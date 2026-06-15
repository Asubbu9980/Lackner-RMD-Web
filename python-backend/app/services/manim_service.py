import json
import re
import subprocess
import threading
import uuid
import os
import shutil
import time
import asyncio

from app.services.voice_service import generate_voice
from app.services.narration_service import create_narration
from app.services.video_merge import merge_audio_video


SCENE_REGISTRY = {

    "projection": {
        "file": "app/scenes/rmd_scene.py",
        "class": "RmdGrowthScene"
    },

    "rmd": {
        "file": "app/scenes/rmd_extraction_scene.py",
        "class": "RmdExtractionScene"
    },

    "tax": {
        "file": "app/scenes/tax_drain_scene.py",
        "class": "TaxDrainScene"
    },

    "collapse": {
        "file": "app/scenes/portfolio_collapse_scene.py",
        "class": "PortfolioCollapseScene"
    }
}


# ==========================================================
# JOB STORE
# ==========================================================
# In-memory registry of render jobs. Each job tracks the real
# progress of the manim render + narration + merge pipeline so
# the client can poll and show an actual percentage.
#
# Shape:
#   {
#     "progress": int (0-100),
#     "stage": str,            # human-readable current step
#     "status": "rendering" | "done" | "error",
#     "video_url": str | None,
#     "summary": dict | None,
#     "error": str | None,
#   }

RENDER_JOBS = {}

# Progress is split into weighted phases so the bar reflects the
# whole pipeline, not just the manim render.
_RENDER_PHASE_END = 75   # manim animation render occupies 0 -> 75%
_NARRATION_PHASE_END = 88   # TTS narration occupies 75 -> 88%
_MERGE_PHASE_END = 99   # audio/video merge occupies 88 -> 99%


def create_job(summary=None):
    """Register a new render job and return its id."""

    job_id = str(uuid.uuid4())[:8]

    RENDER_JOBS[job_id] = {
        "progress": 0,
        "stage": "Queued",
        "status": "rendering",
        "video_url": None,
        "summary": summary,
        "error": None,
    }

    return job_id


def get_job(job_id):
    return RENDER_JOBS.get(job_id)


def _set_progress(job_id, progress, stage):
    job = RENDER_JOBS.get(job_id)

    if not job:
        return

    # Progress must never go backwards — the bar should feel stable.
    job["progress"] = max(job["progress"], int(progress))
    job["stage"] = stage


def _count_expected_animations(scene_file):
    """Estimate how many partial movie files manim will produce.

    Manim writes one partial movie file per animation, where an
    animation is each ``self.play(...)`` and each ``self.wait(...)``
    call in the scene's ``construct``. Counting those literal calls
    gives a reliable denominator for real render progress. The exact
    number only affects how smooth the bar looks (it is clamped), so
    a small miscount is harmless.
    """

    try:
        with open(scene_file, "r", encoding="utf-8") as file:
            source = file.read()
    except OSError:
        return 0

    plays = len(re.findall(r"self\.play\s*\(", source))
    waits = len(re.findall(r"self\.wait\s*\(", source))

    return plays + waits


def _count_recent_partials(start_time):
    """Count partial movie files written by the current render.

    Manim keeps a per-scene ``partial_movie_files`` directory and
    reuses cached files across runs, so stale files from previous
    renders live alongside the new ones. We only count files modified
    at or after this render started, which isolates the current run.
    """

    count = 0

    for root, _dirs, files in os.walk("media/videos"):

        if "partial_movie_files" not in root:
            continue

        for file in files:

            if not file.endswith(".mp4"):
                continue

            full_path = os.path.join(root, file)

            try:
                modified_time = os.path.getmtime(full_path)
            except OSError:
                continue

            # Small tolerance so files created in the same second as
            # the start are still counted.
            if modified_time >= start_time - 1:
                count += 1

    return count


def _run_manim(job_id, scene_config, render_data_path):
    """Run manim and report real animation-render progress."""

    command = [

        "manim",

        "-qm",

        "--fps",
        "15",

        "--resolution",
        "854,480",

        scene_config["file"],

        scene_config["class"]
    ]

    # Pass the data file via the subprocess environment instead of a
    # process-global mutation so concurrent renders don't clobber it.
    env = dict(os.environ)
    env["RENDER_DATA_FILE"] = render_data_path

    total_animations = _count_expected_animations(scene_config["file"])

    start_time = time.time()

    process = subprocess.Popen(
        command,
        env=env,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )

    _set_progress(job_id, 2, "Rendering animation")

    while process.poll() is None:

        if total_animations > 0:

            rendered = _count_recent_partials(start_time)

            fraction = min(rendered / total_animations, 0.97)

            progress = fraction * _RENDER_PHASE_END

            _set_progress(
                job_id,
                progress,
                f"Rendering animation {min(rendered + 1, total_animations)}"
                f"/{total_animations}",
            )

        time.sleep(0.3)

    if process.returncode != 0:
        raise Exception(
            f"manim exited with code {process.returncode}"
        )

    _set_progress(job_id, _RENDER_PHASE_END, "Finalizing animation")


def render_scene(scene_type, chart_data, job_id):

    scene_config = SCENE_REGISTRY[scene_type]

    scene_id = str(uuid.uuid4())[:8]

    render_data_path = f"app/renders/{scene_id}.json"

    with open(render_data_path, "w") as file:
        json.dump(chart_data, file)

    # ==========================================
    # RENDER ANIMATION (with live progress)
    # ==========================================

    _run_manim(job_id, scene_config, render_data_path)

    media_folder = "media/videos"

    rendered_video = None
    latest_time = 0

    for root, dirs, files in os.walk(media_folder):

        if "partial_movie_files" in root:
            continue

        for file in files:

            if file.endswith(".mp4"):

                full_path = os.path.join(
                    root,
                    file
                )

                modified_time = os.path.getmtime(
                    full_path
                )

                if modified_time > latest_time:

                    latest_time = modified_time

                    rendered_video = full_path

    if not rendered_video:

        raise Exception(
            "No rendered video found."
        )

    final_video = (
        f"media/videos/{scene_id}.mp4"
    )

    shutil.copy(
        rendered_video,
        final_video
    )

    # ==========================================
    # GENERATE NARRATION
    # ==========================================

    _set_progress(
        job_id,
        _RENDER_PHASE_END + 3,
        "Generating narration",
    )

    narration = create_narration(
        chart_data,
        scene_type
    )
    audio_file = (
        f"media/videos/{scene_id}.mp3"
    )

    asyncio.run(

        generate_voice(
            narration,
            audio_file
        )

    )

    _set_progress(
        job_id,
        _NARRATION_PHASE_END,
        "Merging audio and video",
    )

    # ==========================================
    # MERGE AUDIO + VIDEO
    # ==========================================

    merged_video = (
        f"media/videos/{scene_id}_final.mp4"
    )

    merge_audio_video(

        final_video,

        audio_file,

        merged_video

    )

    _set_progress(
        job_id,
        _MERGE_PHASE_END,
        "Wrapping up",
    )

    # ==========================================
    # CLEANUP TEMP FILES
    # ==========================================

    try:

        if os.path.exists(audio_file):

            os.remove(audio_file)

    except Exception:

        pass

    time.sleep(1)

    return (
        f"/media/videos/{scene_id}_final.mp4"
    )


def run_render_job(job_id, scene_type, chart_data):
    """Background entry point: render a scene and update the job."""

    try:

        video_url = render_scene(scene_type, chart_data, job_id)

        job = RENDER_JOBS.get(job_id)

        if job is not None:
            job["video_url"] = video_url
            job["progress"] = 100
            job["stage"] = "Done"
            job["status"] = "done"

    except Exception as error:

        job = RENDER_JOBS.get(job_id)

        if job is not None:
            job["status"] = "error"
            job["error"] = str(error)
            job["stage"] = "Failed"


def start_render_job(scene_type, chart_data, summary=None):
    """Create a job and kick off rendering on a background thread."""

    job_id = create_job(summary)

    thread = threading.Thread(
        target=run_render_job,
        args=(job_id, scene_type, chart_data),
        daemon=True,
    )

    thread.start()

    return job_id
