import { useState } from "react";

import {
  LayoutGrid,
  Activity,
  Waves,
  Table2,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  SlidersHorizontal,
  Wallet,
  Users,
  Percent,
} from "lucide-react";

import useRmd from "../../hooks/useRmd";
import { deriveInsights, getPlan, getScenario, isDeceasedScenario, validateInputs } from "../../utils/rmd";
import { formatCompact } from "../../utils/format";

import ScenarioPicker from "../../components/dashboard/ScenarioPicker";
import KpiGrid from "../../components/dashboard/KpiGrid";
import Milestones from "../../components/dashboard/Milestones";
import { NoticeList, NeedsDeathDate } from "../../components/dashboard/Notices";
import { Badge } from "../../components/dashboard/fields";
import {
  AccountFields,
  PeopleFields,
  AssumptionFields,
  EngineToggle,
} from "../../components/dashboard/InputSections";
import {
  ProjectionSection,
  WaterfallSection,
  TableSection,
  ResultsSkeleton,
} from "../../components/dashboard/ResultSections";

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "projection", label: "Projection", icon: Activity },
  { id: "waterfall", label: "Waterfall", icon: Waves },
  { id: "table", label: "Year-by-Year", icon: Table2 },
];

const TAB_KEY = "rmd.workspaceTab";

const readTab = () => {
  try {
    return localStorage.getItem(TAB_KEY) || "overview";
  } catch {
    return "overview";
  }
};

// =====================================================
// COLLAPSIBLE SIDEBAR SECTION
// =====================================================

// forceOpen keeps a section expanded while it holds a required, missing field
const Section = ({ icon: Icon, title, summary, defaultOpen = true, forceOpen = false, children }) => {
  const [expanded, setExpanded] = useState(defaultOpen);
  const open = expanded || forceOpen;

  return (
    <div className="border-t border-[var(--border-color)] first:border-t-0">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setExpanded(!open)}
        className="
          flex
          w-full
          items-center
          gap-2.5
          px-5
          py-3.5
          text-left
          hover:transform-none
          hover:bg-[var(--hover-bg)]
        "
      >
        <Icon size={16} className="shrink-0 text-purple-400" />

        <span className="text-sm font-bold text-[var(--text-primary)]">{title}</span>

        <span
          aria-hidden={open}
          className={`ml-auto min-w-0 truncate text-sm text-[var(--text-secondary)] transition-opacity duration-300 ${open ? "opacity-0" : "opacity-100"}`}
        >
          {summary}
        </span>

        <ChevronDown
          size={16}
          className={`shrink-0 text-[var(--text-secondary)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* stays mounted so it can animate open/closed (grid rows 0fr ↔ 1fr) */}
      <div
        inert={!open}
        className={`
          grid
          transition-[grid-template-rows,opacity]
          duration-300
          ease-[cubic-bezier(0.22,1,0.36,1)]
          motion-reduce:transition-none
          ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
        `}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="px-5 pb-5 pt-1">{children}</div>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// INPUTS SIDEBAR
// =====================================================

const InputsSidebar = ({ onCollapse }) => {
  const { inputs, updateInput } = useRmd();

  const scenario = getScenario(inputs.scenario);
  const needsDeathDate = isDeceasedScenario(inputs.scenario) && !inputs.date_Death_Owner;

  // On stacked (mobile/tablet) layouts start mostly collapsed so results are reachable
  const [stacked] = useState(() => window.matchMedia?.("(max-width: 1023px)").matches ?? false);

  return (
    <aside
      className="
        min-w-0
        overflow-hidden
        rounded-[var(--card-radius)]
        border
        border-[var(--border-color)]
        bg-[var(--glass-bg)]
        backdrop-blur-xl
        shadow-[var(--shadow-md)]
        lg:w-[360px]
        lg:sticky
        lg:top-[76px]
        lg:max-h-[calc(100vh_/_var(--app-zoom,1)_-_110px)]
        lg:overflow-y-auto
        print:hidden
      "
    >
      <div
        className="
          sticky
          top-0
          z-10
          flex
          items-center
          justify-between
          border-b
          border-[var(--border-color)]
          bg-[var(--card-bg)]
          px-5
          py-3
        "
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-purple-600 dark:text-purple-400">
            Configuration
          </p>
          <h2 className="text-lg font-black tracking-tight text-[var(--text-primary)]">Inputs</h2>
        </div>

        <button
          type="button"
          onClick={onCollapse}
          aria-label="Hide inputs"
          className="
            hidden
            lg:flex
            h-8
            w-8
            items-center
            justify-center
            rounded-lg
            text-[var(--text-secondary)]
            hover:bg-[var(--hover-bg)]
            hover:text-[var(--text-primary)]
          "
        >
          <PanelLeftClose size={17} />
        </button>
      </div>

      <Section icon={SlidersHorizontal} title="Scenario" defaultOpen={!stacked} summary={`Chart ${scenario.chart} · ${scenario.title}`}>
        <ScenarioPicker value={inputs.scenario} onChange={(v) => updateInput("scenario", v)} />
      </Section>

      <Section
        icon={Wallet}
        title="Account"
        summary={`${getPlan(inputs.plan).short} · ${formatCompact(inputs.balance_Start)}`}
      >
        <AccountFields />
      </Section>

      <Section
        icon={Users}
        title="People"
        defaultOpen={!stacked}
        forceOpen={needsDeathDate}
        summary={`Owner ${inputs.year_Birth_Owner} · Beneficiary ${inputs.year_Birth_Beny}`}
      >
        <PeopleFields />
      </Section>

      <Section
        icon={Percent}
        title="Assumptions"
        defaultOpen={!stacked}
        summary={`${inputs.growth_Rate}% growth · ${inputs.tax_Rate}% tax`}
      >
        <AssumptionFields />
      </Section>
    </aside>
  );
};

// =====================================================
// LAYOUT
// =====================================================

const WorkspaceLayout = () => {
  const { inputs, result, error } = useRmd();

  const [tab, setTabState] = useState(readTab);
  const [inputsOpen, setInputsOpen] = useState(true);

  const setTab = (id) => {
    setTabState(id);
    try {
      localStorage.setItem(TAB_KEY, id);
    } catch {
      // per-viewer convenience only
    }
  };

  const { warnings } = validateInputs(inputs);
  const insights = deriveInsights(result, inputs);
  const scenario = getScenario(inputs.scenario);
  const needsDeathDate = isDeceasedScenario(inputs.scenario) && !inputs.date_Death_Owner;

  const focusDeathDate = () => {
    setInputsOpen(true);
    requestAnimationFrame(() => {
      const el = document.getElementById("date_Death_Owner");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus();
    });
  };

  return (
    <div
      className={`
        grid
        items-start
        gap-4
        xl:gap-5
        lg:transition-[grid-template-columns,column-gap]
        lg:duration-500
        lg:ease-[cubic-bezier(0.22,1,0.36,1)]
        motion-reduce:transition-none
        ${inputsOpen ? "lg:grid-cols-[360px_minmax(0,1fr)]" : "lg:grid-cols-[0px_minmax(0,1fr)] lg:!gap-x-0"}
      `}
    >
      {/* the sidebar stays mounted and slides/fades as its column animates;
          the stretched wrapper keeps the sticky aside working */}
      <div
        inert={!inputsOpen}
        className={`
          min-w-0
          lg:self-stretch
          lg:overflow-clip
          lg:[overflow-clip-margin:24px]
          transition-[opacity,transform]
          duration-500
          ease-[cubic-bezier(0.22,1,0.36,1)]
          motion-reduce:transition-none
          ${inputsOpen ? "opacity-100" : "max-lg:hidden lg:-translate-x-6 lg:opacity-0"}
        `}
      >
        <InputsSidebar onCollapse={() => setInputsOpen(false)} />
      </div>

      <div className="min-w-0 space-y-4">
        {/* RESULTS HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {!inputsOpen && (
              <button
                type="button"
                onClick={() => setInputsOpen(true)}
                className="
                  rmd-fade-in
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-[var(--border-color)]
                  bg-[var(--bg-secondary)]
                  px-3
                  py-2
                  text-sm
                  font-semibold
                  text-[var(--text-primary)]
                  hover:bg-[var(--hover-bg)]
                  print:hidden
                "
              >
                <PanelLeftOpen size={16} />
                Inputs
              </button>
            )}

            <div className="min-w-0">
              <h1 className="text-xl leading-tight sm:truncate font-black tracking-tight text-[var(--text-primary)] xl:text-2xl">
                Chart {scenario.chart} · {scenario.title}
              </h1>

              <div className="mt-1 flex flex-wrap gap-1.5">
                <Badge>{getPlan(inputs.plan).label}</Badge>
                <Badge tone="slate">{formatCompact(inputs.balance_Start)} start</Badge>
                <Badge tone="slate">{inputs.growth_Rate}% growth</Badge>
                <Badge tone="slate">{inputs.tax_Rate}% tax</Badge>
                {insights.years > 0 && <Badge tone="slate">{insights.years} years</Badge>}
              </div>
            </div>
          </div>

          <div
            role="tablist"
            aria-label="Results view"
            className="
              flex
              max-w-full
              gap-1
              overflow-x-auto
              rounded-xl
              border
              border-[var(--border-color)]
              bg-[var(--hover-bg)]
              p-1
              print:hidden
            "
          >
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className={`
                  flex
                  items-center
                  gap-1.5
                  whitespace-nowrap
                  rounded-lg
                  px-3
                  py-1.5
                  text-sm
                  font-semibold
                  transition-[background-color,color,box-shadow,transform]
                  duration-300
                  hover:transform-none
                  active:scale-[0.97]
                  ${
                    tab === id
                      ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-[0_4px_14px_rgba(124,58,237,0.35)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                  }
                `}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <NoticeList warnings={warnings} error={error} />

        {needsDeathDate ? (
          <NeedsDeathDate onFix={focusDeathDate} />
        ) : !result ? (
          <ResultsSkeleton />
        ) : (
          <>
            <KpiGrid insights={insights} inputs={inputs} />

            <Milestones insights={insights} inputs={inputs} />

            <EngineToggle className="max-w-xs lg:hidden" />

            {(tab === "overview" || tab === "projection") && <ProjectionSection />}

            {(tab === "overview" || tab === "waterfall") && <WaterfallSection />}

            {(tab === "overview" || tab === "table") && <TableSection />}
          </>
        )}
      </div>
    </div>
  );
};

export default WorkspaceLayout;
