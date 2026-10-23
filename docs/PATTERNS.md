# Lackner-RMD-Web — code patterns & conventions

> Learned from the codebase by `/sdd-init`. The agent's "house style" memory: how THIS project
> actually writes code. Every pattern cites a real `file:line`. The code is the source of truth —
> if a pattern here drifts, fix this file. Monorepo: three packages, each its own stack/section.

## Stack snapshot
- **Monorepo (no workspace tooling)** — three independently-run packages under one git repo:
  `client/` (React SPA), `server/` (Node API + DB), `python-backend/` (FastAPI + video render).
- **client:** React 19 + Vite 8, JavaScript (`.jsx`, NOT TypeScript), MUI 9 + Tailwind 3, axios +
  fetch, plotly.js / `@react-three/fiber` (three.js) for charts. Package manager: npm.
- **server:** Node + Express 5, Mongoose 9 / MongoDB. CommonJS (`require`), not ESM.
- **python-backend:** FastAPI + Pydantic 2 (Python 3.11), manim + edge-tts + moviepy for cinematic
  video. Run via uvicorn/gunicorn.
- **Tests:** NONE anywhere. `server` test script is a stub (`server/package.json:6`). No Jest/Vitest/
  pytest configured. New work should introduce tests with the spec (see CLAUDE.md quality gates).
- **Lint:** ESLint flat config in `client/` only (`client/eslint.config.js`); no lint in server/python.

## Directory layout (mirror this when adding files)
```
client/src/
  pages/         # route-level screens (Calculator.jsx, LandingPage.jsx, LoginPage.jsx)
  components/    # presentational + chart components (charts2D/ for 2D variants)
  context/       # React Context providers (Rmd, Theme, RenderMode)
  hooks/         # thin useContext wrappers (useRmd.js)
  services/      # API clients: api.js (Node), pythonapi.js (Python)
  utils/         # pure helpers (format.js)
server/
  routes/ controllers/ services/ models/ config/   # classic Express layering
python-backend/app/
  api/routes.py  models/ (pydantic)  services/ (engine, charts, manim, voice)
  scenes/        # manim Scene classes   constants/irs_tables.py
```

## Naming conventions
- **client:** components `PascalCase.jsx` one per file (`InputForm.jsx`); hooks `useXxx.js`
  (`hooks/useRmd.js:4`); utils/services `camelCase.js` (`services/api.js`).
- **server:** files `camelCase.js` (`rmdController.js`, `rmdCalculator.js`); CommonJS
  `module.exports` (`services/rmdCalculator.js:139`), controller handlers as `exports.calculateRmd`
  (`controllers/rmdController.js:4`).
- **python:** `snake_case` files & functions (`rmd_engine.py`, `calculate_schedule`); `PascalCase`
  classes (`RmdRequest` `models/request_models.py:5`, `RmdGrowthScene` `scenes/rmd_scene.py:9`).
- **Scenario keys** are `SCREAMING_SNAKE` and shared across all three packages: `LIVING_UNIFORM`,
  `DECEASED_10YEAR`, … (`server/services/rmdCalculator.js:65`, `services/scenarios.py:1`).
- **⚠ Field-name convention is split by direction** — match it exactly:
  - **Inputs** use mixed snake/Pascal: `balance_Start`, `growth_Rate`, `year_Birth_Owner`
    (`models/request_models.py:5`, `context/RmdContext.jsx:8`).
  - **Output rows** use `camelCase`: `beginBalance`, `endBalance`, `cumRmd`
    (`rmd_engine.py:189`, `models/rmdScenario.js:4`).

## How a feature is structured (the layered flow)
Two parallel request paths — the client picks one via `RenderModeContext` ("node" vs manim):

**Node calc path** (default, auto-runs on input change):
- Entry: `client/src/services/api.js:9` `calculateRmd` → `POST {VITE_API_URL}/rmd/calculate`.
- Route: `server/routes/rmdRoutes.js:6` → controller `controllers/rmdController.js:4`.
- Business logic: `server/services/rmdCalculator.js:31` `calculateSchedule(inputs)` (pure function).
- Persistence: controller calls `RmdScenario.create({inputs, result})` (`rmdController.js:11`).
- Response: `res.json({ result })` — client reads `res.result` (`RmdContext.jsx:27`).

**Python cinematic path** (on-demand video):
- Entry: `client/src/services/pythonapi.js:4` `generateProjection` → `POST /cinematic/{scenario}/{scene}`.
- Route: `python-backend/app/api/routes.py:53` → `calculate_schedule` → `generate_chart_data`
  → `render_scene` (manim → edge-tts voice → moviepy merge), returns `/media/...mp4`.

## Client state & data fetching
- State lives in **React Context**, not Redux/zustand (zustand is in node_modules but unused).
  `RmdProvider` holds `inputs`/`result`/`loading` (`context/RmdContext.jsx:7`); consume via
  `useRmd()` (`hooks/useRmd.js`).
- **Auto-calculate on input change, debounced 300ms** inside a `useEffect` (`RmdContext.jsx:22-36`).
  There is no real "Calculate" button action — the button in `InputForm.jsx:861` is decorative.
- Inputs are coerced to `Number` on change except `date*` fields (`InputForm.jsx:68`).
- API clients: axios instance with `baseURL: import.meta.env.VITE_API_URL` for Node
  (`services/api.js:2`); raw `fetch` with a **hardcoded** `http://localhost:8000` for Python
  (`services/pythonapi.js:1`) — see Don'ts.

## Styling (client)
- Tailwind utility classes inline in JSX, themed via CSS vars (`var(--bg-primary)`,
  `var(--text-primary)`) toggled by `ThemeContext`; MUI used for `Dialog`/`Button` only
  (`pages/Calculator.jsx:13`). Icons from `lucide-react` (`InputForm.jsx:4`).

## Data access & persistence (server)
- Mongoose model with embedded `rowSchema` sub-docs + `{ timestamps: true }`
  (`models/rmdScenario.js:20`). `inputs` stored as untyped `Object`.
- Connection: `mongoose.connect(process.env.MONGO_URI)`, `process.exit(1)` on failure
  (`config/db.js:5`), called once at boot (`server.js:10`).
- **No migrations** (MongoDB, schemaless). Every calc is persisted as a new document; there is no
  read/update/delete path — write-only audit trail.

## API / interface contracts
- **Validation:** only the Python side validates — Pydantic `RmdRequest` (`request_models.py:5`).
  Node accepts `req.body` raw and coerces inside the engine (`rmdCalculator.js:35`). No Joi/Zod.
- **Response shape** is shared across both engines: `{ balanceStart, totalRmd, totalTax,
  totalGrowth, endingBalance, rows[] }` (`rmd_engine.py:228`, `rmdCalculator.js:129`).
- FastAPI handlers return plain dicts (`routes.py:17`); `response_models.py` defines `RmdResponse`
  but is **not** wired as the route `response_model`.

## Error handling
- **server:** `try/catch` in the controller, `console.error(error)` + `res.status(500).json({ error:
  error.message })` (`rmdController.js:22-24`). No central error middleware.
- **python:** no try/except in routes — relies on FastAPI defaults; `SCENE_REGISTRY[scene_type]`
  raises `KeyError`→500 on an unknown scene (`manim_service.py:40`).
- **client:** `try/catch` + `console.error`, occasional `alert()` for user-facing validation
  (`Calculator.jsx:55,101`). Errors are logged, rarely surfaced in UI.

## Validation, config & secrets
- **client:** Vite env, `import.meta.env.VITE_API_URL` from `client/.env` (`api.js:2`).
- **server:** `require("dotenv").config()` then `process.env.*` (`server.js:2`, `config/db.js:5`).
- **python:** `os.environ` / `os.path` (`main.py:21`); `RENDER_DATA_FILE` passed to manim via env
  (`manim_service.py:49`, `scenes/rmd_scene.py:17`).
- **⚠ Secrets are currently committed** — `server/.env` and `client/.env` are tracked and `.env` is
  NOT in `.gitignore`. `server/.env` holds a live MongoDB Atlas URI+password. Treat as a leak to
  remediate; never add new secrets this way.

## The two-engine rule (the #1 gotcha)
- The RMD math exists **twice and must stay byte-for-byte equivalent**: `server/services/
  rmdCalculator.js:31` (JS) and `python-backend/app/services/rmd_engine.py:11` (Python, literally
  commented "MATCH NODE LOGIC" at `:90`). IRS factor tables are duplicated too
  (`rmdCalculator.js:2` ↔ `services/life_tables.py`, `services/helpers.py:1` ↔ `rmdCalculator.js:23`).
- **Any change to a factor, scenario branch, RBD age, or the `balance <= 1000` stop condition must
  be made in BOTH files in the same PR**, or the two render paths diverge.

## Don'ts (project-specific anti-patterns to avoid / fix, not copy)
- Don't hard-code service URLs — `pythonapi.js:1` hardcodes `localhost:8000` (and commented prod
  URL); prefer a Vite env var like the Node client already does.
- Don't commit `.env` / secrets (see above) — and don't widen the leak.
- Don't use Pydantic v1 `.dict()` (`routes.py:15,26,66`) in new code — it's deprecated; use
  `model_dump()`.
- Don't edit one RMD engine without the other (the two-engine rule).
- `inputs.scenario` is a **string**; `Calculator.jsx:60` reads `inputs.scenario.value` (object
  access) — a latent bug; treat scenario as a plain string.
- No TypeScript in `client/` — don't introduce `.ts`/`.tsx` ad hoc; match the `.jsx` + JSDoc style.
