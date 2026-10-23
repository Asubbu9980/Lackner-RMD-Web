# Spec: Dashboard UI — modern glassmorphic redesign

| | |
|---|---|
| **Ticket** | UI-0002 |
| **Project / service** | Lackner-RMD-Web · `client/` (React SPA) |
| **Stack** | React 19 + Vite 8, JavaScript (`.jsx`), MUI 9 + Tailwind 3 |
| **Status** | Implemented |
| **Author** | devops.ace |
| **Date** | 2026-06-15 |

## 1. Problem / Goal
The dashboard (`/dashboard`) page currently has a functional but dated glassmorphic aesthetic — 
spacing is loose, component hierarchy is unclear, and the overall feel is not premium. Redesign the
dashboard with a modern, refined glassmorphic aesthetic: **tighter spacing, stronger visual 
hierarchy, polished shadows/glows, and a cohesive premium look** across the header, form panel, and
analytics section. All functionality stays unchanged.

## 2. Scope
**In scope**
- **Header** — refine layout (logo, nav items, theme toggle, logout button); tighter spacing; 
  stronger visual hierarchy.
- **Form panel (left)** — improve input field styling, section spacing, button hierarchy, scenario 
  selector appearance.
- **Chart section (right)** — polish summary cards, chart container borders/shadows, visualization 
  panel styling.
- **Overall grid layout** — optimize column proportions, spacing between panels, responsive 
  adjustments.
- **Color/shadow refinement** — enhance glassmorphic effect (refined blur, stronger depth via 
  shadows, better contrast).
- **Typography** — improve font sizing, weights, letter-spacing for better hierarchy.

**Non-goals** (explicitly NOT doing)
- No change to functionality, routing, API calls, or data wiring.
- No new components or major layout restructuring (grid stays 2-column left/right).
- No changes to chart/visualization logic or the cinematic video feature.
- No changes to the landing page or login page from this spec.

## 3. Current behavior
The dashboard renders:
- **Header** (`Header.jsx`): glassmorphic bar with logo, render-mode toggle, theme toggle, logout.
  Loose spacing; icons/text blend together.
- **Form panel** (`InputForm.jsx`, left column): `rounded-[30px]`, `backdrop-blur-2xl`, shadow 
  `0_20px_60px_rgba(0,0,0,0.18)`. Loose `p-6` padding; input fields have `rounded-2xl`, basic 
  focus states.
- **Analytics section** (`Calculator.jsx`, right column): chart containers, summary cards 
  (`SummaryCards.jsx`), waterfall chart, data table. Cards use simple borders and shadows; 
  spacing is large (`space-y-5` between sections).
- **Background glows** (`Calculator.jsx:126-166`): two fixed blur-glows (cyan top-right, purple 
  bottom-left).

## 4. Proposed change
> UI/styling refactor across three components. No API/data/routing changes. PATTERNS §"Styling": 
> Tailwind/MUI `sx`, themed via CSS vars.

### 4.1 API / interface contract
- **Components modified:** `Header.jsx`, `InputForm.jsx`, `Calculator.jsx`, `SummaryCards.jsx`.
- **Props:** no changes (all components receive the same props).
- **State:** no changes (all state logic unchanged).
- **Events/callbacks:** no changes.

| Type | File | Change |
|------|------|--------|
| Header | `Header.jsx` | Refine layout, spacing, shadow/glow |
| Form | `InputForm.jsx` | Tighter padding, improved input/button styling, better hierarchy |
| Analytics | `Calculator.jsx` | Polish chart containers, spacing, background glows |
| Cards | `SummaryCards.jsx` | Enhance card shadows, spacing, typography |

### 4.2 Data / state model
None.

### 4.3 Events / side-effects
None.

### 4.4 External / cross-service / integration calls
None.

### 4.5 Config / feature flags / env
None.

**Implementation direction (for reference):**
1. **Header** — reduce overall height, tighten logo size, refine button spacing and styling, 
   upgrade shadow.
2. **InputForm** — expand width from `300px` to `380px`; reduce padding from `p-6` to `p-5`, 
   tighten input spacing, enhance focus states, upgrade button gradient/shadow, reduce section gaps.
3. **SummaryCards** — upgrade card shadows, refine gradient borders, tighten padding, improve 
   icon styling.
4. **Calculator layout** — refine `gap-4` / `gap-5` spacing, expand left column width to `380px`, 
   upgrade background glows.
5. **Color palette shift** — move from cyan/blue accents to **purple/indigo** (more modern, 
   premium feel); update gradients, glows, focus states, borders, and icon colors throughout. 
   Keep dark background, increase contrast for text/interactive elements.
6. **Animations** — add subtle entrance animations (fade-in on page load), hover effects on 
   buttons/inputs (scale, shadow lift), smooth transitions on state changes (0.3s duration), 
   and interactive feedback on interactions (e.g., input focus pulse, button press effect).

## 5. Acceptance criteria
- [x] **AC1** — The header is visually refined: layout is tighter, logo/nav items have clear 
  hierarchy, buttons have premium styling (stronger shadow, refined purple/indigo gradient).
- [x] **AC2** — The form panel is expanded to `380px` width (from `300px`) with modern, polished 
  inputs: rounded corners, refined purple/indigo borders, enhanced focus states, tighter spacing, 
  and subtle animations on interaction.
- [x] **AC3** — The form buttons (Calculate, Reset, Print, Export) are visually prominent with 
  modern styling: purple/indigo gradients, shadows, hover effects (scale + shadow lift), and 
  smooth transitions.
- [x] **AC4** — The summary cards on the right are polished: refined shadows, purple/indigo 
  borders/accents, icons, typography — matching a premium aesthetic with subtle fade-in animations.
- [x] **AC5** — The overall dashboard layout has optimized spacing: tighter gaps, expanded form 
  width (`380px`), better proportions, cohesive premium look, and page-level entrance animations 
  (fade-in on load).
- [x] **AC6** — Color palette is shifted: cyan/blue accents replaced with **purple/indigo** 
  throughout (gradients, glows, borders, focus states, icons); dark background retained with 
  increased contrast.
- [x] **AC7** — Animations enhance UX: button/input hover effects (scale 1.02–1.05), smooth 
  focus transitions (0.3s), state-change transitions (chart updates), and interactive feedback. 
  No performance regression.
- [x] **AC8** — All functionality works unchanged: form inputs, scenario selection, calculations, 
  chart rendering, video generation, theme toggle, logout — no regressions.
- [x] **AC9** — `npm run build` and `npm run lint` pass; responsive design looks good on 
  mobile/tablet/desktop (expanded form may stack earlier on small screens).

## 6. Test plan
> Functionality is unchanged (AC6 verified by existing auto-calc and video logic). Testing focuses 
> on visual regression (manual spot-check) and that nothing broke. Use existing Vitest suite 
> (from spec 0001) to verify components still mount/render.

| AC | Test type | Approach |
|----|-----------|----------|
| AC1-AC7 | visual (manual) | Open `/dashboard` in browser; inspect header, form, cards, layout at 3 breakpoints (mobile/tablet/desktop); verify purple/indigo palette, animations (hover, fade-in). |
| AC8 | functional (manual) | Test form inputs, scenario switch, calculate, chart render, cinematic video, theme toggle, logout — ensure unchanged. |
| AC9 | build | `npm run build` + `npm run lint` must pass.

## 7. Rollout & risks
- **Low risk:** pure styling (CSS/Tailwind), no logic or data changes.
- **Visual breaking:** expanded form width (`380px`) and tighter spacing might cause mobile 
  wrapping earlier — test responsive behavior on `xs` / `sm` breakpoints.
- **Animation performance:** smooth 60fps transitions; avoid layout thrashing. Use CSS transforms 
  and opacity for animations (cheaper than reflow-inducing properties).
- **Regression:** existing functionality must work identically; be careful not to break class 
  names or event bindings.
- **Rollback:** revert modified component files (multi-file change, each component independently 
  revertible).

## 8. Design decisions (locked in)
- **Color palette:** Shift from cyan/blue to **purple/indigo** accents (gradients, borders, glows, 
  focus states, icons). Dark background maintained with increased contrast.
- **Form width:** Expand left panel from `300px` to **`380px`** for better content breathing room 
  and premium feel.
- **Animations:** Add subtle entrance (fade-in on load), hover effects (button/input scale 1.02–1.05, 
  shadow lift), and smooth transitions (0.3s on state changes, interactions). CSS-based for 
  performance.
