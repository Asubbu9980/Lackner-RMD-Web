import json
import subprocess
import uuid
import os
import shutil
import time


SCENE_REGISTRY = {

    "projection": {
        "file":
        "app/scenes/rmd_scene.py",

        "class":
        "RmdGrowthScene"
    },

    "rmd": {
        "file":
        "app/scenes/rmd_extraction_scene.py",

        "class":
        "RmdExtractionScene"
    },

    "tax": {
        "file":
        "app/scenes/tax_drain_scene.py",

        "class":
        "TaxDrainScene"
    },

    "collapse": {
        "file":
        "app/scenes/portfolio_collapse_scene.py",

        "class":
        "PortfolioCollapseScene"
    }
}


def render_scene(
    scene_type,
    chart_data
):

    scene_config = (
        SCENE_REGISTRY[scene_type]
    )

    scene_id = str(
        uuid.uuid4()
    )[:8]

    render_data_path = (
        f"app/renders/{scene_id}.json"
    )

    with open(render_data_path, "w") as file:

        json.dump(
            chart_data,
            file
        )

    os.environ[
        "RENDER_DATA_FILE"
    ] = render_data_path

    command = [
        
        
        "manim",

        "-pql",

        "--fps",
        "24",

        "--resolution",
        "854,480",

        scene_config["file"],

        scene_config["class"]
    ]

    subprocess.run(command, check=True)

    media_folder = (
        "media/videos"
    )

    rendered_video = None
    latest_time = 0

    for root, dirs, files in os.walk(media_folder):

    # IGNORE partial renders
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

    final_video = (

        f"media/videos/"
        f"{scene_id}.mp4"
    )

    shutil.copy(
        rendered_video,
        final_video
    )
    time.sleep(2)

    return (
        f"/media/videos/{scene_id}.mp4"
    )