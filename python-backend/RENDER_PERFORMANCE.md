# Manim Render Performance — spec 0003

Tracks the rendering optimization from spec
[`specs/0003-manim-rendering-optimization.md`](../specs/0003-manim-rendering-optimization.md).
Goal: cut cinematic render time 20–30% (target ≤35s/scene) with **no** change to
resolution (854×480), FPS (15), codecs (H.264 / AAC), or visual content.

## What changed

| Area | File | Before | After |
|------|------|--------|-------|
| End-of-scene padding | `app/scenes/rmd_scene.py` | `self.wait(3)` | `self.wait(1)` |
| End-of-scene padding | `app/scenes/rmd_extraction_scene.py` | `self.wait(9)` | `self.wait(1)` |
| End-of-scene padding | `app/scenes/tax_drain_scene.py` | `self.wait(7)` | `self.wait(1)` |
| End-of-scene padding | `app/scenes/portfolio_collapse_scene.py` | `self.wait(7)` | `self.wait(1)` |
| Bar lag density | `app/scenes/rmd_scene.py` (×3 `LaggedStart`) | `lag_ratio=0.01` | `lag_ratio=0.005` |
| Bar lag density | extraction / tax / collapse scenes | `lag_ratio=0.03` | `lag_ratio=0.015` |
| Curve tracker | `app/scenes/rmd_scene.py` (`MoveAlongPath`) | `run_time=2.5` | `run_time=1.5` |
| Encoder preset | `app/services/video_merge.py` | libx264 default (`medium`) | `preset="ultrafast"` |

Total wait padding dropped from **26s → 4s** (~22s) across the four scenes.

## Tests

- `test_scene_optimization.py` — static AST checks for AC1/AC2/AC3 (fast, no
  manim/ffmpeg needed): `pytest test_scene_optimization.py -v`
- `test_rendering_performance.py` — end-to-end benchmark for AC4 (heavy; renders
  via manim + ffmpeg + edge-tts). Disabled by default:
  - `RUN_RENDER_BENCH=1 pytest test_rendering_performance.py -v -s`
  - or `python test_rendering_performance.py` to print a per-scene table.

## Baseline vs optimized metrics

Fill these in by running the benchmark on the deployment-class render host
(`python test_rendering_performance.py`) before and after the change.

| Scene type | Baseline avg (s) | Optimized avg (s) | Δ | ≤35s? |
|------------|------------------|-------------------|---|-------|
| projection | _TBD_ | _TBD_ | _TBD_ | _TBD_ |
| rmd        | _TBD_ | _TBD_ | _TBD_ | _TBD_ |
| tax        | _TBD_ | _TBD_ | _TBD_ | _TBD_ |
| collapse   | _TBD_ | _TBD_ | _TBD_ | _TBD_ |

## Quality / metadata invariants (AC5)

Confirm with `ffprobe media/videos/{scene_id}_final.mp4` that these are unchanged:
resolution `854x480`, `15` fps, video codec `h264`, audio codec `aac`.
