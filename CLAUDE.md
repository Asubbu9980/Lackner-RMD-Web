# CLAUDE.md — Lackner-RMD-Web

Thin index for the coding agent. Read this first; it points to the deep docs rather than inlining them.

## What this is
RMD retirement calculator + cinematic visualizer. **Monorepo, three independently-run packages**
(no workspace tooling): `client/` (React 19 + Vite), `server/` (Express 5 + MongoDB), `python-backend/`
(FastAPI + manim video). The RMD math is implemented **twice** (Node + Python) and must stay in sync.

## Stack / build / run / test
Run each package from its own directory.

| Package | Install | Dev | Build / Start | Lint | Test |
|---------|---------|-----|---------------|------|------|
| `client/` | `npm install` | `npm run dev` (Vite) | `npm run build` | `npm run lint` | — none — |
| `server/` | `npm install` | `npm run dev` (nodemon) | `npm start` (`node server.js`) | — | — none (stub) — |
| `python-backend/` | `pip install -r requirements.txt` | `uvicorn app.main:app --reload --port 8000` | Docker (`DockerFile`) | — | — none — |

- **No test framework is configured in any package.** When a spec needs tests, introduce the
  standard one for that stack (client: Vitest + Testing Library; server: Jest + Supertest;
  python: pytest) as part of the change.
- Env: `client/.env` (`VITE_API_URL`), `server/.env` (`MONGO_URI`, `PORT`), Python via `os.environ`.
  ⚠ `.env` files are currently committed with **live secrets** — do not widen this; see PATTERNS Don'ts.

## Code patterns & conventions  → see [docs/PATTERNS.md](docs/PATTERNS.md)
The learned house style new code must match. Highlights:
- Three stacks, three naming styles: React `PascalCase.jsx` / Express `camelCase.js` CommonJS /
  Python `snake_case`. Inputs use `balance_Start`-style names; output rows use `camelCase`.
- Client state = React **Context** (`useRmd`), not Redux/zustand; calc auto-runs **debounced 300ms**
  on input change — the "Calculate" button is decorative.
- **The two-engine rule:** any RMD-math change goes in BOTH `server/services/rmdCalculator.js` and
  `python-backend/app/services/rmd_engine.py` (+ duplicated IRS tables) in the same PR.
- Node validates nothing (coerces in-engine); only Python uses Pydantic. Errors are logged, rarely
  surfaced. No auth, permissive CORS.

## Architecture  → see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
Where things live: client routes (`/`, `/login`, `/dashboard`), Express `/api/rmd/calculate`
(persists to MongoDB), FastAPI `/calculate` · `/charts` · `/cinematic` (manim → TTS → moviepy).

<!-- Shared sdd-toolkit sections below -->

## Knowledge layer — indexing, retrieval, summaries
Load the **least** that answers the task (cheap context first, deep search last):
0. **This file** is a thin index — always in context, kept small; it links, it does not inline.
1. **Patterns — read when writing/changing code:** `docs/PATTERNS.md`. Read only the relevant
   package's section. New code MUST match it.
2. **Structure — read to find where something lives:** `docs/ARCHITECTURE.md` (single file, not
   sharded at this size). Read the relevant section, not the whole file.
3. **Agentic retrieval for the last mile** — then use Explore / grep / glob for exact lines.

**Token discipline:** prefer `file:line` references over pasting code; read file *ranges*; don't
re-read a doc already in context. Keep summaries fresh (`/sdd-refresh`) after changing routes, the
data model, **either RMD engine**, or the manim scene set.

## Working agreement (coding-agent contract)
Operate as a senior engineer in an existing codebase:
1. Understand the task before coding. 2. Never assume structure — inspect files first. 3. Identify
the relevant files and explain the plan before changing code. 4. Make the smallest correct change.
5. Follow existing patterns. 6. Reuse existing utilities. 7. After coding: review for bugs, edge
cases, suggest tests. 8. If information is missing, ASK — don't guess on contract-level decisions
(API shape, data model, error/status codes). 9. Explain what changed, why, and the risks.

**Output format for any non-trivial coding task:** `PLAN / FILES TO INSPECT / IMPLEMENTATION /
REVIEW / TESTS`.

**Quality gates (run the project's real commands):**
- client: `npm run build` + `npm run lint` must pass.
- No test suites exist yet — add tests with the change (Vitest / Supertest / pytest per package) and
  state plainly that prior coverage was zero.
- DB: MongoDB is schemaless — no migrations; update the Mongoose model + any embedded sub-doc shape.
- Secrets come from env, never hard-coded. Don't commit new secrets (existing `.env` leak is a
  separate remediation, not a precedent).

## Spec-driven development
Non-trivial changes start with a reviewable spec, not code. See `specs/README.md`. Loop:
1. `/spec <ticket>` → draft `specs/NNNN-slug.md` (no code); human reviews.
2. Approve, then plan.
3. `/spec-build specs/NNNN-slug.md` → implement strictly against acceptance criteria, test-first.
4. `/code-review` (+ `/security-review` where relevant) → CI.

Anything not in the approved spec is out of scope — update the spec first. Trivial one-line fixes
are exempt. **A spec that changes RMD math must call out both engines explicitly.**

## Git & PR workflow
- Branch off the default branch; never commit straight to it. Current working branch: `initial-setup`.
- Small, focused, present-tense commits. Keep the spec in the same branch/PR as its implementation.
- Before a PR: quality gates pass, `/code-review` clean, every acceptance criterion has a test.
- Don't commit secrets, generated artifacts (`media/`, `node_modules/`), or unrelated reformatting.
- Only commit or push when the human asks; surface the diff first.
