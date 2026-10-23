# Spec: Manim video rendering performance optimization

| | |
|---|---|
| **Ticket** | PERF-0003 |
| **Project / service** | Lackner-RMD-Web · `python-backend/` (FastAPI + Manim) |
| **Stack** | Python 3.11, FastAPI, Manim 0.18.1, edge-tts, moviepy (ffmpeg) |
| **Status** | In Progress |
| **Author** | devops.ace |
| **Date** | 2026-06-15 |

## 1. Problem / Goal
Cinematic analytics video rendering is slow (~40-50s total per request), blocking user experience on the `/dashboard` "Generate Manim Analytics" button. Primary bottleneck: Manim scene animation complexity and excessive padding (wait times). Reduce rendering time by 20–30% via targeted animation simplification, encoder tuning, and removal of unnecessary delays. Goal: achieve sub-35s render time for all four scene types (projection, RMD, tax, collapse analysis) without sacrificing visual quality.

## 2. Scope
**In scope**
- Reduce `self.wait()` padding times in all four scene classes (`rmd_scene.py`, `rmd_extraction_scene.py`, `tax_drain_scene.py`, `portfolio_collapse_scene.py`)
- Simplify bar/curve animation complexity: skip non-essential animations, reduce animation runtimes, optimize LaggedStart lag density
- Tune video encoder: add `preset=ultrafast` to libx264 in moviepy merge (video_merge.py)
- Measure and document baseline vs. optimized render times for each scene type

**Non-goals** (explicitly NOT doing)
- No changes to scene visual content, layout, or final appearance (colors, fonts, chart data)
- No changes to RMD calculation logic or scene narrative/text generation
- No database/API contract changes
- No rendering quality reduction (resolution, FPS, codec remain unchanged)
- No cross-service impacts (client/server remain unchanged)

## 3. Current behavior
**Video Rendering Pipeline** (`python-backend/app/`):
1. **Manim scene rendering** (`services/manim_service.py:38-115`) — subprocess spawns `manim -qm --fps 15 --resolution 854,480 {scene}` (medium quality, mobile-friendly)
2. **Scene animation** — each scene class (lines noted below) constructs animations with varying `self.wait()` padding:
   - `scenes/rmd_scene.py:657` — `self.wait(3)` at end
   - `scenes/rmd_extraction_scene.py:287` — `self.wait(9)` at end
   - `scenes/tax_drain_scene.py:289` — `self.wait(7)` at end
   - `scenes/portfolio_collapse_scene.py:290` — `self.wait(7)` at end
   - **Total padding: 26 seconds** (if all rendered)
   - Bar animations use `LaggedStart` with 20+ bars per scene (lag density = high)
   - Curve tracking: `run_time=2.5` (MoveAlongPath with tracker dot + glow)
3. **Audio generation** (`services/narration_service.py`, `voice_service.py`) — TTS via edge-tts (~3-5s cloud latency)
4. **Audio/video merge** (`services/video_merge.py:24-28`) — moviepy + ffmpeg with default libx264 preset (medium encoding speed)
5. **Output** — final MP4 ~300-340KB, returned at `/media/videos/{scene_id}_final.mp4`

**Current estimated breakdown:**
- Manim scene render: 30-40s (animation + padding)
  - Active animation: 6.5-7.8s per scene
  - Wait padding: 3-9s per scene
- Audio generation: 3-5s
- Video encoding/merge: 5-10s
- File I/O: 1-2s
- **Total: ~40-50s per request**

## 4. Proposed change
> Pure performance optimization of animation and encoding. No contract or data model changes. Code follows existing patterns in `python-backend/app/`.

### 4.1 API / interface contract
**No changes.** The `/cinematic/{scenario}/{scene_type}` route and response remain identical. Performance improvement is transparent to the client.

| Method | Path | Request | Response | Notes |
|--------|------|---------|----------|-------|
| POST | `/cinematic/{scenario}/{scene_type}` | scenario + request body | `/media/videos/{scene_id}_final.mp4` | Identical; only faster |

### 4.2 Data / state model
None.

### 4.3 Events / side-effects
None.

### 4.4 External / cross-service / integration calls
None.

### 4.5 Config / feature flags / env
No new environment variables. Optimization is code-only.

**Implementation direction (for reference):**
1. **Trim padding times** (`scenes/*.py`):
   - `rmd_scene.py:657` — `self.wait(3)` → `self.wait(1)` (save 2s)
   - `rmd_extraction_scene.py:287` — `self.wait(9)` → `self.wait(1)` (save 8s)
   - `tax_drain_scene.py:289` — `self.wait(7)` → `self.wait(1)` (save 6s)
   - `portfolio_collapse_scene.py:290` — `self.wait(7)` → `self.wait(1)` (save 6s)
   - **Subtotal: ~22s saved**

2. **Reduce animation complexity** (`scenes/rmd_scene.py`, `rmd_extraction_scene.py`, `tax_drain_scene.py`):
   - Bar animations: render every bar (LaggedStart), but reduce lag_ratio `0.01` → `0.005` (halves sequential render time per bar)
   - Skip unnecessary animations (e.g., peak pulse effect if not critical to narrative)
   - Curve tracking animation: `run_time=2.5` → `run_time=1.5` (save 1s per scene)
   - **Subtotal: ~3-5s saved**

3. **Video encoder tuning** (`services/video_merge.py:24-28`):
   - Add `preset="ultrafast"` to `write_videofile()` call
   - Maintains 480p/15 FPS/aac audio, only speeds up H.264 encoding
   - ffmpeg libx264 `preset=ultrafast` is 5-10x faster than `medium`, with negligible quality loss at 480p mobile resolution
   - **Subtotal: ~2-4s saved**

**Total estimated savings: 13–21 seconds (20–30% reduction)**

## 5. Acceptance criteria

- [x] **AC1** — Given a valid POST request to `/cinematic/{scenario}/{scene_type}`, when the scene is rendered, then all `self.wait()` calls in scene classes are set to 1 or 2 seconds (no padding > 2s). *(Verified by code review of `scenes/*.py` + automated `test_scene_optimization.py::test_all_waits_are_short`. All four end-of-scene waits trimmed to `self.wait(1)`.)*

- [x] **AC2** — Given the rmd_scene animation with curve tracking, when the MoveAlongPath animation renders, then `run_time` is reduced from 2.5 to ≤1.5 seconds without breaking the visual effect. *(Verified by code review of `scenes/rmd_scene.py:548-561` + `test_scene_optimization.py::test_tracker_run_time_reduced`. `run_time` now 1.5; both tracker dot + glow `MoveAlongPath` retained, so the effect is unchanged.)*

- [x] **AC3** — Given the video merge step in `services/video_merge.py`, when `write_videofile()` is called, then the libx264 preset is set to `"ultrafast"` (or `"superfast"` if ultrafast produces unacceptable artifacts). *(Verified by code review + `test_scene_optimization.py::test_video_merge_uses_fast_preset`. `preset="ultrafast"` added.)*

- [ ] **AC4** — Given all four scene types (projection, RMD, tax, collapse), when each is rendered end-to-end, then the total render time is reduced to ≤35 seconds (from baseline ~40-50s). *(Harness ready: `test_rendering_performance.py` (`RUN_RENDER_BENCH=1`) renders each scene 3× and asserts the average ≤35s. **Pending execution on the deployment-class render host** — local box lacks the full ffmpeg/edge-tts render path.)*

- [ ] **AC5** — Given a completed render, when the final video is inspected, then the output resolution (854x480), FPS (15), codec (H.264), and audio codec (AAC) remain unchanged from the baseline. *(Verified by ffmpeg metadata inspection: `ffprobe /media/videos/{scene_id}_final.mp4`)*

- [ ] **AC6** — Given the client dashboard, when a user clicks "Generate Manim Analytics" and waits for the render, then the response time is noticeably faster (≤35s vs prior ~40-50s) and video quality is indistinguishable from baseline. *(Verified by manual end-to-end test on `/dashboard` with timer)*

## 6. Test plan

| AC | Test type | Approach |
|----|-----------|----------|
| AC1 | code review | Grep `self.wait()` in all four scene files; verify all calls are `≤2` seconds. Manual review of each file. |
| AC2 | code review | Inspect `scenes/rmd_scene.py` lines 548-561; verify `run_time=1.5` (or equivalent) and no visual regression. |
| AC3 | code review | Inspect `services/video_merge.py:24-28`; verify `preset="ultrafast"` is passed to `write_videofile()`. |
| AC4 | performance | Script: render each of 4 scene types 3 times, measure total time per render, compute average. Assert average ≤35s. Log baseline vs optimized times. |
| AC5 | integration | Use ffprobe to inspect final MP4 metadata (resolution, FPS, codecs). Assert no changes from baseline. |
| AC6 | manual e2e | Open dashboard, click "Generate Manim Analytics", time the response. Visually inspect output for quality. Compare to prior renders. |

**Test files to create:**
- `python-backend/test_rendering_performance.py` — performance benchmark (AC4)
- `python-backend/test_scene_optimization.py` — unit tests verifying wait times, animation runtimes (AC1, AC2)
- Manual checklist / README in `python-backend/` documenting baseline vs optimized metrics

**No database migrations or API contract changes needed.**

## 7. Rollout & risks

**Rollout:**
- Single-service change (python-backend only); no client or server changes needed.
- Can be deployed independently; no coordination required.
- Rollback: revert the four scene files + video_merge.py to prior commit.

**Risks & mitigations:**
- **Visual quality degradation**: Low risk. Animation simplifications (reduced lag density, shorter runtimes) are imperceptible at 15 FPS / 480p. Ultrafast encoder may introduce minor blockiness, but unnoticeable on small screen. **Mitigation**: AC5 enforces codec/resolution unchanged; AC6 verifies visual parity.
- **Audio/video sync failure**: Low risk. Audio narration (~10s) generated independently; video duration is auto-adjusted. Shorter wait times don't affect sync. **Mitigation**: AC6 manual test confirms sync.
- **Partial Manim animation loss**: Low risk. Skip/reduce non-critical animations (pulse, peak highlight), but keep core curve/bar rendering. **Mitigation**: AC2 verifies tracker animation remains visible.
- **Performance regression on constrained hardware**: Ultrafast preset may cause high CPU spike. **Mitigation**: Preset falls back to `superfast` if needed; test on target deployment environment.
- **Cache invalidation**: Manim partial_movie_files accumulate in `media/` folder. **Mitigation**: Add cleanup step to remove intermediate files after successful merge (low priority follow-up).

## 8. Open questions / follow-ups

- Should the 1s wait time be configurable (env var) for future tuning, or is a hardcoded 1-2s sufficient?
- Which peak/highlight animations in `rmd_scene.py` (lines 320-332) are essential to the narrative? Should they be kept or removed as part of AC2?
- What is the target deployment environment's CPU spec? Should we test ultrafast preset on that hardware?
- Post-optimization, should we document expected render times in a README or SLA for the API?
- Opportunity for follow-up: implement render caching by chart data hash (30-40s saved on repeat scenarios) — should this be a separate spec or a phase-2 optimization?
