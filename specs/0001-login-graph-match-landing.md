# Spec: Login page graph matches the landing page

| | |
|---|---|
| **Ticket** | UI-0001 |
| **Project / service** | Lackner-RMD-Web · `client/` (React SPA) |
| **Stack** | React 19 + Vite 8, JavaScript (`.jsx`), MUI 9 + Tailwind 3 |
| **Status** | Implemented |
| **Author** | devops.ace |
| **Date** | 2026-06-12 |

## 1. Problem / Goal
The login page (`/login`) shows a flat, static SVG line as its hero "graph", while the landing
page (`/`) shows an animated 3D financial curve. The two screens look inconsistent. Make the login
page's graph visualization match the landing page's by reusing the same animated component and
backdrop, so the product feels cohesive from landing → login.

## 2. Scope
**In scope**
- Replace the login page's static SVG graph with the same animated `<HeroFinancialGraph />`
  component the landing page uses (`components/HeroFinancialGraph.jsx`).
- Add the landing page's **grid-overlay** backdrop to the login "SCREEN" box (keep the existing
  stars overlay).
- Wrap the graph using the same positioning pattern as the landing page (absolute, `inset:0`,
  `zIndex:2`).

**Non-goals** (explicitly NOT doing)
- No change to the login form, header text, "3D Manim | 3Blue1Brown" chip, or the three stat cards
  (their labels/values stay as-is — `Ending Value` / `Tax Drain` / `Projection`).
- No change to `HeroFinancialGraph.jsx` itself, the landing page, routing, or auth logic.
- No new data wiring — the graph remains decorative/illustrative (static sample points).

## 3. Current behavior
- **Login** renders a static `<svg>` with a single gradient `<path id curve2>` inside the right
  "SCREEN" box; that box has a stars overlay but **no** grid overlay
  (`client/src/pages/LoginPage.jsx:435-480`). `HeroFinancialGraph` is **not** imported here.
- **Landing** renders the animated component inside an absolute `inset:0`, `zIndex:2` box, with a
  grid overlay (`:390-403`) + stars overlay (`:406-417`) + `<HeroFinancialGraph />` (`:419-428`),
  imported at `client/src/pages/LandingPage.jsx:7`.
- The component is a react-three-fiber `<Canvas>` (auto-rotating curve with glowing nodes on a
  grid) — `client/src/components/HeroFinancialGraph.jsx:47`.

## 4. Proposed change
> UI-component change only (PATTERNS §"Styling": Tailwind/MUI `sx`, themed via CSS vars).

### 4.1 API / interface contract
- **Component:** `LoginPage` (`client/src/pages/LoginPage.jsx`). No props in/out change; no new
  state, events, or callbacks. Purely the JSX inside the right "SCREEN" `<Box>` changes.
- Reuses existing component `HeroFinancialGraph` (no props) — no signature change.

| Type | Name | Change |
|------|------|--------|
| Page component | `LoginPage` | Swap static `<svg>` graph → `<HeroFinancialGraph/>`; add grid overlay |
| Import | `HeroFinancialGraph` | Add `import HeroFinancialGraph from "../components/HeroFinancialGraph";` |

### 4.2 Data / state model
None. No client state added or changed; the graph uses the component's built-in sample points.

### 4.3 Events / side-effects
None.

### 4.4 External / cross-service / integration calls
None.

### 4.5 Config / feature flags / env
None.

**Implementation shape (for reference, built in IMPLEMENT phase):**
1. Add the `HeroFinancialGraph` import to `LoginPage.jsx`.
2. Inside the right "SCREEN" `<Box>` (`LoginPage.jsx:435-480`):
   - Add a grid-overlay `<Box>` matching `LandingPage.jsx:390-403` (absolute, `inset:0`,
     `opacity:0.12`, the two linear-gradient grid lines, `backgroundSize:"40px 40px"`).
   - Keep the existing stars `<Box>` (`LoginPage.jsx:436-447`).
   - Remove the static `<svg>…<path id="curve2"/>…</svg>` block (`:450-479`).
   - Add a graph wrapper `<Box sx={{ position:"absolute", inset:0, zIndex:2 }}><HeroFinancialGraph/></Box>`
     matching `LandingPage.jsx:419-428`.

## 5. Acceptance criteria
- [x] **AC1** — Given the `/login` page is rendered, when the right visualization panel mounts,
  then `HeroFinancialGraph` is rendered there (the animated 3D graph), not the static SVG.
  *(test: LoginPage.test.jsx "renders the animated HeroFinancialGraph")*
- [x] **AC2** — Given the `/login` page is rendered, then the static SVG curve is gone: no element
  with the `curve2` gradient / the old `<path>` exists in the login DOM.
  *(test: LoginPage.test.jsx "no longer renders the static SVG curve")*
- [x] **AC3** — Given the login "SCREEN" box, then it contains the grid-overlay backdrop (the
  `40px 40px` repeating grid) in addition to the existing stars overlay — matching the landing page.
  *(test: LoginPage.test.jsx "includes the 40px grid-overlay backdrop")*
- [x] **AC4** — Given the landing page (`/`), then it is unchanged and still renders
  `HeroFinancialGraph` (regression guard — shared component still works on both pages).
  *(test: LandingPage.test.jsx "still renders HeroFinancialGraph")*
- [x] **AC5** — `npm run build` and `npm run lint` pass with the change. *(build ✓; lint 0 errors —
  5 pre-existing warnings in unrelated chart files, none from this change)*

## 6. Test plan
> No test suite exists in `client/` yet (CLAUDE.md "Quality gates"). Introduce **Vitest +
> @testing-library/react + jsdom** as part of this change. Mock `HeroFinancialGraph` (it renders a
> WebGL `<Canvas>` that jsdom can't run) with a stub exposing a `data-testid="hero-graph"`.

| AC | Test type | Test file / approach |
|----|-----------|----------------------|
| AC1 | unit (RTL) | `client/src/pages/__tests__/LoginPage.test.jsx` — mock `HeroFinancialGraph` → `data-testid="hero-graph"`; assert it is in the document. |
| AC2 | unit (RTL) | same file — assert the rendered container has no `curve2`/static `path` (query `container.querySelector('path')` is null). |
| AC3 | unit (RTL) | same file — assert an element styled with the `40px 40px` grid background exists (query by style/background-image). |
| AC4 | unit (RTL) | `client/src/pages/__tests__/LandingPage.test.jsx` — mock graph; assert `hero-graph` present (landing unchanged). |
| AC5 | CI/manual | `npm run build` + `npm run lint` in `client/`. |

## 7. Rollout & risks
- **Low risk, frontend-only, no API/data changes.** Single product, no cross-service impact.
- **Perf:** the login page now mounts a second react-three-fiber `<Canvas>` (WebGL). Acceptable —
  it mirrors the landing page, which already does this. Only one Canvas per page at a time.
- **Layout risk:** `HeroFinancialGraph`'s wrapper is a fixed `h-[520px]` div
  (`HeroFinancialGraph.jsx:49`); the login SCREEN box is `420px` tall on `xs`. Same situation
  exists on the landing page (graph box `260/360`), so behavior matches — but verify the graph
  fills/clips correctly at the login box's `xs:420 / md:520` heights during VERIFY. If it overflows,
  the absolute `inset:0` wrapper should clip it (parent has `overflow:"hidden"`).
- **Rollback:** revert `LoginPage.jsx` (single-file change).

## 8. Open questions / follow-ups
- The fixed `h-[520px]` inside `HeroFinancialGraph` is a latent responsiveness smell on both pages;
  out of scope here, but a candidate follow-up to make the component fill its parent (`h-full`).
- Stat-card label drift (`Ending Value` vs landing's `Ending Balance`) is intentionally left
  untouched per agreed scope — flag for a future "make whole panel identical" ticket if desired.
