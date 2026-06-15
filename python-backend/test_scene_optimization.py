"""
Static optimization tests for spec 0003 (Manim rendering performance).

These tests verify the source of the four scene classes and the video merge
service WITHOUT rendering anything, so they are fast and have no external
dependencies (no manim / ffmpeg / network required).

Covers:
  AC1 - every self.wait() in all four scene files is <= 2 seconds.
  AC2 - the rmd_scene curve-tracking MoveAlongPath run_time is <= 1.5 seconds.
  AC3 - video_merge passes an "ultrafast" (or "superfast") libx264 preset.

Run:  pytest test_scene_optimization.py -v
"""

import ast
import os

import pytest

BASE = os.path.dirname(os.path.abspath(__file__))
SCENES_DIR = os.path.join(BASE, "app", "scenes")

SCENE_FILES = [
    "rmd_scene.py",
    "rmd_extraction_scene.py",
    "tax_drain_scene.py",
    "portfolio_collapse_scene.py",
]

MAX_WAIT_SECONDS = 2.0
MAX_TRACKER_RUN_TIME = 1.5
ALLOWED_PRESETS = {"ultrafast", "superfast"}


def _parse(path):
    with open(path, "r", encoding="utf-8") as fh:
        return ast.parse(fh.read(), filename=path)


def _is_self_wait(node):
    return (
        isinstance(node, ast.Call)
        and isinstance(node.func, ast.Attribute)
        and node.func.attr == "wait"
        and isinstance(node.func.value, ast.Name)
        and node.func.value.id == "self"
    )


def _const_number(node):
    if isinstance(node, ast.Constant) and isinstance(node.value, (int, float)):
        return float(node.value)
    return None


def _call_contains_movealongpath(call):
    for arg in call.args:
        if (
            isinstance(arg, ast.Call)
            and isinstance(arg.func, ast.Name)
            and arg.func.id == "MoveAlongPath"
        ):
            return True
    return False


def _keyword_value(call, name):
    for kw in call.keywords:
        if kw.arg == name:
            return kw.value
    return None


# ---------------------------------------------------------------------------
# AC1 - wait padding
# ---------------------------------------------------------------------------

@pytest.mark.parametrize("scene_file", SCENE_FILES)
def test_all_waits_are_short(scene_file):
    path = os.path.join(SCENES_DIR, scene_file)
    tree = _parse(path)

    waits = []
    for node in ast.walk(tree):
        if _is_self_wait(node):
            if node.args:
                value = _const_number(node.args[0])
                # A non-literal wait argument is a red flag for this spec.
                assert value is not None, (
                    f"{scene_file}:{node.lineno} self.wait() uses a "
                    "non-literal duration; cannot verify it is <= 2s"
                )
            else:
                # self.wait() with no argument defaults to 1s in manim.
                value = 1.0
            waits.append((node.lineno, value))

    assert waits, f"{scene_file}: expected at least one self.wait() call"

    too_long = [(ln, v) for ln, v in waits if v > MAX_WAIT_SECONDS]
    assert not too_long, (
        f"{scene_file}: self.wait() calls exceeding {MAX_WAIT_SECONDS}s "
        f"at lines {too_long}"
    )


# ---------------------------------------------------------------------------
# AC2 - tracker curve animation run_time
# ---------------------------------------------------------------------------

def test_tracker_run_time_reduced():
    path = os.path.join(SCENES_DIR, "rmd_scene.py")
    tree = _parse(path)

    tracker_run_times = []
    for node in ast.walk(tree):
        if (
            isinstance(node, ast.Call)
            and isinstance(node.func, ast.Attribute)
            and node.func.attr == "play"
            and _call_contains_movealongpath(node)
        ):
            rt = _keyword_value(node, "run_time")
            value = _const_number(rt) if rt is not None else None
            tracker_run_times.append((node.lineno, value))

    assert tracker_run_times, (
        "rmd_scene.py: expected a self.play(...) with MoveAlongPath "
        "(curve tracker animation)"
    )

    for lineno, value in tracker_run_times:
        assert value is not None, (
            f"rmd_scene.py:{lineno} MoveAlongPath play has no literal run_time"
        )
        assert value <= MAX_TRACKER_RUN_TIME, (
            f"rmd_scene.py:{lineno} tracker run_time={value}s exceeds "
            f"{MAX_TRACKER_RUN_TIME}s"
        )


# ---------------------------------------------------------------------------
# AC3 - encoder preset
# ---------------------------------------------------------------------------

def test_video_merge_uses_fast_preset():
    path = os.path.join(BASE, "app", "services", "video_merge.py")
    tree = _parse(path)

    presets = []
    for node in ast.walk(tree):
        if (
            isinstance(node, ast.Call)
            and isinstance(node.func, ast.Attribute)
            and node.func.attr == "write_videofile"
        ):
            preset = _keyword_value(node, "preset")
            if isinstance(preset, ast.Constant):
                presets.append(preset.value)

    assert presets, (
        "video_merge.py: write_videofile() must pass a 'preset' keyword"
    )
    for preset in presets:
        assert preset in ALLOWED_PRESETS, (
            f"video_merge.py: preset={preset!r} is not one of {ALLOWED_PRESETS}"
        )
