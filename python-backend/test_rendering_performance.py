"""
End-to-end rendering performance benchmark for spec 0003 (AC4).

Renders each of the four scene types several times and asserts the average
wall-clock render time is at or below the target. This is HEAVY: it shells out
to manim, ffmpeg (moviepy) and edge-tts (network), so it is skipped by default.

Enable it explicitly:
    RUN_RENDER_BENCH=1 pytest test_rendering_performance.py -v -s

Or run it as a script to print a per-scene baseline-vs-target table:
    python test_rendering_performance.py

The script form does NOT assert; it just measures and prints, which is what you
use to capture the baseline (before the optimization) and the optimized numbers.
"""

import os
import sys
import time

import pytest

BASE = os.path.dirname(os.path.abspath(__file__))
if BASE not in sys.path:
    sys.path.insert(0, BASE)

SCENE_TYPES = ["projection", "rmd", "tax", "collapse"]
RUNS_PER_SCENE = 3
TARGET_SECONDS = 35.0

# A representative request body (matches client/server contract).
SAMPLE_REQUEST = {
    "balance_Start": 1_000_000.0,
    "growth_Rate": 6.0,
    "tax_Rate": 24.0,
    "year_Birth_Owner": 1955,
    "year_Birth_Beny": 1985,
    "plan": "IRA",
    "scenario": "baseline",
}


def _build_chart_data():
    """Run the real engine + chart builder to get valid scene input."""
    from app.services.rmd_engine import calculate_schedule
    from app.services.charts import generate_chart_data

    result = calculate_schedule(dict(SAMPLE_REQUEST))
    return generate_chart_data(result["rows"])


def _time_render(scene_type, chart_data):
    from app.services.manim_service import render_scene

    start = time.perf_counter()
    render_scene(scene_type, chart_data)
    return time.perf_counter() - start


def _benchmark(runs_per_scene=RUNS_PER_SCENE):
    """Return {scene_type: average_seconds} over `runs_per_scene` renders."""
    chart_data = _build_chart_data()
    averages = {}
    for scene_type in SCENE_TYPES:
        samples = []
        for run in range(runs_per_scene):
            elapsed = _time_render(scene_type, chart_data)
            samples.append(elapsed)
            print(
                f"  {scene_type:11s} run {run + 1}/{runs_per_scene}: "
                f"{elapsed:6.2f}s"
            )
        averages[scene_type] = sum(samples) / len(samples)
    return averages


@pytest.mark.skipif(
    os.environ.get("RUN_RENDER_BENCH") != "1",
    reason="Set RUN_RENDER_BENCH=1 to run the heavy end-to-end render benchmark",
)
@pytest.mark.parametrize("scene_type", SCENE_TYPES)
def test_scene_render_under_target(scene_type):
    pytest.importorskip("manim")
    chart_data = _build_chart_data()

    samples = []
    for _ in range(RUNS_PER_SCENE):
        samples.append(_time_render(scene_type, chart_data))

    average = sum(samples) / len(samples)
    print(f"\n{scene_type}: avg {average:.2f}s over {RUNS_PER_SCENE} runs")
    assert average <= TARGET_SECONDS, (
        f"{scene_type}: average render {average:.2f}s exceeds "
        f"{TARGET_SECONDS}s target (samples={[round(s, 2) for s in samples]})"
    )


if __name__ == "__main__":
    print(f"Benchmarking {RUNS_PER_SCENE} renders per scene "
          f"(target <= {TARGET_SECONDS}s)\n")
    results = _benchmark()
    print("\n=== Average render time per scene ===")
    worst = 0.0
    for scene_type in SCENE_TYPES:
        avg = results[scene_type]
        worst = max(worst, avg)
        status = "PASS" if avg <= TARGET_SECONDS else "FAIL"
        print(f"  {scene_type:11s} {avg:6.2f}s  [{status}]")
    print(f"\nSlowest scene average: {worst:.2f}s "
          f"(target {TARGET_SECONDS:.0f}s)")
    sys.exit(0 if worst <= TARGET_SECONDS else 1)
