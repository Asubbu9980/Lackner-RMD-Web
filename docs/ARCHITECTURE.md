# Lackner-RMD-Web — architecture summary

> The map the coding agent reads **first** to orient. Source of truth is the code; if this disagrees,
> the code wins — fix this file. Regenerate (`/sdd-refresh`) when routes, the data model, the RMD
> engine, or the manim scene set change.

## What it is
A Required-Minimum-Distribution (RMD) retirement calculator + cinematic visualizer. A user enters
balance / growth / tax / birth years and an IRS scenario; the app projects a 50-year withdrawal
schedule and renders it as charts and (optionally) a narrated manim video. ~35 source files across
three packages in one repo (no workspace tooling — each package built/run independently):

| Package | Stack | Role |
|---------|-------|------|
| `client/` | React 19 + Vite 8, MUI + Tailwind | SPA: input form, charts, video player |
| `server/` | Express 5 + Mongoose 9 / MongoDB | RMD calc API + persists every scenario |
| `python-backend/` | FastAPI + manim + edge-tts + moviepy | RMD calc + chart data + cinematic video |

The **RMD math is implemented twice** (Node + Python) and kept in sync deliberately — see the
two-engine rule in `docs/PATTERNS.md`. The client chooses which backend to hit via
`RenderModeContext` ("node" = fast JSON charts; manim = video).

## Structure (where to look by feature)

### client/ (React) — routes in `App.jsx:42`
| Route | Component | One-liner |
|-------|-----------|-----------|
| `/` | `pages/LandingPage.jsx` | marketing landing |
| `/login` | `pages/LoginPage.jsx` | login screen (no real auth) |
| `/dashboard` | `pages/Calculator.jsx` | main app: form + charts + cinematic dialog |
- State: `context/RmdContext.jsx` (inputs/result, 300ms debounced auto-calc), `ThemeContext`,
  `RenderModeContext`. Consume via `hooks/useRmd.js`.
- Data layer: `services/api.js` (Node), `services/pythonapi.js` (Python video).
- Charts: `components/` (2D in `components/charts2D/`, 3D via `@react-three/fiber` + plotly).

### server/ (Express) — mounted at `/api/rmd` (`server.js:15`)
| Method · Path | Handler | One-liner |
|---------------|---------|-----------|
| `POST /api/rmd/calculate` | `controllers/rmdController.js:4` | calc schedule, persist, return `{result}` |
| `GET /` | `server.js:17` | health string |
- Layering: `routes/ → controllers/ → services/rmdCalculator.js` (pure engine) + `models/` (Mongoose).

### python-backend/ (FastAPI) — router in `app/api/routes.py`
| Method · Path | Handler | One-liner |
|---------------|---------|-----------|
| `POST /calculate` | `routes.py:12` | RMD schedule JSON |
| `POST /charts/{scenario}` | `routes.py:20` | schedule + chart data |
| `POST /cinematic/{scenario}/{scene}` | `routes.py:53` | render narrated manim video, return `video_url` |
| `GET /` | `main.py:39` | health |
- `/media` is a static mount serving rendered mp4s (`main.py:33`).
- Pipeline: `rmd_engine.calculate_schedule` → `charts.generate_chart_data` →
  `manim_service.render_scene` (`SCENE_REGISTRY` `manim_service.py:14`) → `voice_service` (edge-tts)
  → `video_merge` (moviepy).

## Data & persistence
- **Engine:** MongoDB (Atlas) via Mongoose, server-side only. Python backend is **stateless** (no DB).
- **Model:** `server/models/rmdScenario.js:20` — `RmdScenario { inputs: Object, result: {…, rows:
  [rowSchema] }, timestamps }`. Embedded sub-docs, no refs.
- **Access:** write-only — `RmdScenario.create(...)` on every calc (`rmdController.js:11`); nothing
  reads the collection back. No migrations (schemaless).
- **Render artifacts:** mp4/json written to `python-backend/media/` & `app/renders/` on disk
  (`manim_service.py:44,73`); not persisted to any DB or object store.

## Events / async / side-effects
- No queues/jobs. The cinematic render is **synchronous within the request** — manim is invoked via
  blocking `subprocess.run` (`manim_service.py:68`), then `asyncio.run` for TTS (`:129`), then a
  moviepy merge. Long-running; no background worker. Temp audio is cleaned up best-effort (`:160`).

## External / cross-service calls
| Client | Target | Purpose |
|--------|--------|---------|
| `client services/api.js` | `server` (`VITE_API_URL`) | RMD calc + persist |
| `client services/pythonapi.js` | `python-backend` (`localhost:8000`, hardcoded) | cinematic video |
| `python voice_service.py` | Microsoft Edge TTS (`edge-tts`) | narration audio |
- The two backends do **not** call each other; the client fans out to both. No auth between tiers.

## Cross-cutting
- **Errors:** per-package, no shared handler. Node: try/catch→`res.status(500)` (`rmdController.js:22`).
  Python: FastAPI defaults. Client: `console.error`/`alert`. See `docs/PATTERNS.md`.
- **Auth:** none enforced. `/login` is UI-only; all API routes are open + permissive CORS
  (`main.py:13`, `server.js:12`).
- **Config:** `client/.env` (`VITE_API_URL`), `server/.env` (`MONGO_URI`, `PORT`), Python `os.environ`.
  ⚠ `.env` files are committed and contain live secrets — see `docs/PATTERNS.md` Don'ts.
- **Deploy:** server + python on Render (`python-backend/render.yaml`, Docker `DockerFile`); client
  on Vercel (`client/vercel.json`).
- **Quality gates:** lint in `client/` only; no tests anywhere (see CLAUDE.md).

## Keeping this fresh
Regenerate after changes to: the Express routes/controllers, the Mongoose model, **either RMD
engine** (`rmdCalculator.js` / `rmd_engine.py` — change both), the FastAPI routes, or the manim
`SCENE_REGISTRY`. A single ARCHITECTURE.md (no shards) is enough at this size.
