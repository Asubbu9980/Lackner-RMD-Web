import { useState } from "react";

import {
  Wallet,
  Users,
  SlidersHorizontal,
  Percent,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
  HeartPulse,
  UserRound,
  Table2,
  Route,
} from "lucide-react";

import useRmd from "../../hooks/useRmd";
import {
  SCENARIOS,
  deriveInsights,
  getPlan,
  getScenario,
  isDeceasedScenario,
  validateInputs,
} from "../../utils/rmd";
import { formatCurrency } from "../../utils/format";

import Panel from "../../components/dashboard/Panel";
import ScenarioPicker from "../../components/dashboard/ScenarioPicker";
import KpiGrid from "../../components/dashboard/KpiGrid";
import Milestones from "../../components/dashboard/Milestones";
import { NoticeList, NeedsDeathDate } from "../../components/dashboard/Notices";
import { Field, Segmented } from "../../components/dashboard/fields";
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
import { scrollToSection } from "../../utils/scroll";

const STEPS = [
  {
    id: "account",
    title: "Account",
    subtitle: "Plan type and balance",
    prompt: "What kind of account is it, and how much is in it?",
    icon: Wallet,
    fields: ["balance_Start"],
  },
  {
    id: "people",
    title: "People",
    subtitle: "Owner and beneficiary",
    prompt: "Who owns the account, and who inherits it?",
    icon: Users,
    fields: ["year_Birth_Owner", "year_Birth_Beny", "date_Death_Owner"],
  },
  {
    id: "scenario",
    title: "Scenario",
    subtitle: "Distribution rule",
    prompt: "Which IRS distribution rule applies?",
    icon: SlidersHorizontal,
    fields: [],
  },
  {
    id: "assumptions",
    title: "Assumptions",
    subtitle: "Growth and taxes",
    prompt: "What growth and tax rate should we assume?",
    icon: Percent,
    fields: ["growth_Rate", "tax_Rate"],
  },
];

const firstOfGroup = (group) => SCENARIOS.find((s) => s.group === group).id;

// =====================================================
// STEP BODIES
// =====================================================

const OwnerStatus = () => {
  const { inputs, updateInput } = useRmd();

  const status = isDeceasedScenario(inputs.scenario) ? "inherited" : "living";

  return (
    <Field label="Is the account owner living?">
      <Segmented
        ariaLabel="Owner status"
        value={status}
        onChange={(group) => group !== status && updateInput("scenario", firstOfGroup(group))}
        options={[
          { value: "living", label: "Yes, living", icon: UserRound },
          { value: "inherited", label: "No, inherited", icon: HeartPulse },
        ]}
      />
    </Field>
  );
};

const StepBody = ({ stepId }) => {
  const { inputs, updateInput } = useRmd();

  if (stepId === "account") return <AccountFields />;

  if (stepId === "people") {
    return (
      <div className="space-y-5">
        <OwnerStatus />
        <PeopleFields />
      </div>
    );
  }

  if (stepId === "scenario") {
    return (
      <ScenarioPicker
        variant="cards"
        groups={[getScenario(inputs.scenario).group]}
        value={inputs.scenario}
        onChange={(v) => updateInput("scenario", v)}
      />
    );
  }

  return <AssumptionFields />;
};

// =====================================================
// WIZARD
// =====================================================

const Wizard = ({ step, setStep, onFinish }) => {
  const { inputs } = useRmd();
  const { errors } = validateInputs(inputs);

  const [visited, setVisited] = useState(() => new Set([0]));

  const goTo = (i) => {
    setVisited((prev) => new Set(prev).add(i));
    setStep(i);
  };

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const stepHasError = (s) => s.fields.some((f) => errors[f]);

  return (
    <section
      className="
        overflow-hidden
        rounded-[var(--card-radius)]
        border
        border-[var(--border-color)]
        bg-[var(--glass-bg)]
        backdrop-blur-xl
        shadow-[var(--shadow-md)]
        print:hidden
      "
    >
      {/* STEP HEADER */}
      <ol className="grid grid-cols-4 border-b border-[var(--border-color)]">
        {STEPS.map((s, i) => {
          const active = i === step;
          const done = visited.has(i) && !active && !stepHasError(s);
          const flagged = visited.has(i) && stepHasError(s);

          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-current={active ? "step" : undefined}
                className={`
                  relative
                  flex
                  w-full
                  flex-col
                  items-center
                  gap-1.5
                  px-2
                  py-3
                  text-center
                  hover:transform-none
                  hover:bg-[var(--hover-bg)]
                  ${active ? "bg-purple-500/5" : ""}
                `}
              >
                <span
                  className={`
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    text-xs
                    font-bold
                    ${
                      active
                        ? "bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-[0_4px_14px_rgba(124,58,237,0.4)]"
                        : flagged
                          ? "bg-rose-500/15 text-rose-400 ring-1 ring-rose-400/40"
                          : done
                            ? "bg-emerald-500/15 text-emerald-500"
                            : "bg-[var(--hover-bg)] text-[var(--text-secondary)] ring-1 ring-[var(--border-color)]"
                    }
                  `}
                >
                  {done ? <Check size={15} strokeWidth={3} /> : i + 1}
                </span>

                <span
                  className={`text-xs font-semibold ${active ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}
                >
                  {s.title}
                </span>

                <span className="hidden text-[10.5px] text-[var(--text-secondary)] md:block">{s.subtitle}</span>

                {active && (
                  <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500" />
                )}
              </button>
            </li>
          );
        })}
      </ol>

      {/* STEP CONTENT */}
      <div className="p-5">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-purple-400">
          Step {step + 1} of {STEPS.length}
        </p>
        <h2 className="mt-1 text-lg font-black tracking-tight text-[var(--text-primary)]">{current.prompt}</h2>

        <div className="mt-4">
          <StepBody stepId={current.id} />
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between gap-3 border-t border-[var(--border-color)] px-5 py-3">
        <button
          type="button"
          disabled={step === 0}
          onClick={() => goTo(step - 1)}
          className="
            flex
            items-center
            gap-1
            rounded-xl
            px-3
            py-2
            text-sm
            font-semibold
            text-[var(--text-secondary)]
            hover:bg-[var(--hover-bg)]
            hover:text-[var(--text-primary)]
            disabled:invisible
          "
        >
          <ChevronLeft size={16} />
          Back
        </button>

        <button
          type="button"
          onClick={() => (isLast ? onFinish() : goTo(step + 1))}
          className="
            flex
            items-center
            gap-1
            rounded-xl
            bg-gradient-to-r
            from-purple-500
            to-indigo-600
            px-4
            py-2
            text-sm
            font-semibold
            text-white
            shadow-[0_6px_18px_rgba(124,58,237,0.35)]
          "
        >
          {isLast ? "See full analysis" : `Next: ${STEPS[step + 1].title}`}
          <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
};

// =====================================================
// PLAIN-ENGLISH SUMMARY
// =====================================================

const Strong = ({ children }) => (
  <strong className="font-extrabold text-[var(--text-primary)]">{children}</strong>
);

const Summary = ({ insights, inputs }) => {
  const plan = getPlan(inputs.plan).label;
  const scenario = getScenario(inputs.scenario);
  const { firstRmd, lastRow } = insights;

  const ending = insights.depleted ? (
    <>, fully drawing down the account by <Strong>{lastRow?.year}</Strong></>
  ) : (
    <>, leaving <Strong>{formatCurrency(insights.endingBalance)}</Strong></>
  );

  if (isDeceasedScenario(inputs.scenario)) {
    return (
      <p className="text-base leading-relaxed text-[var(--text-secondary)] xl:text-lg">
        Under the <Strong>{scenario.title}</Strong>, the beneficiary draws{" "}
        <Strong>{formatCurrency(insights.totalRmd)}</Strong> from this{" "}
        <Strong>{formatCurrency(insights.balanceStart)}</Strong> {plan} over{" "}
        <Strong>{insights.years} years</Strong> and pays about{" "}
        <Strong>{formatCurrency(insights.totalTax)}</Strong> in taxes at {inputs.tax_Rate}%{ending}.
      </p>
    );
  }

  return (
    <p className="text-base leading-relaxed text-[var(--text-secondary)] xl:text-lg">
      A <Strong>{formatCurrency(insights.balanceStart)}</Strong> {plan} growing at{" "}
      <Strong>{inputs.growth_Rate}%</Strong>
      {firstRmd ? (
        <>
          {" "}requires a first RMD of <Strong>{formatCurrency(firstRmd.rmd)}</Strong> in{" "}
          <Strong>{firstRmd.year}</Strong>, at age {firstRmd.age}
        </>
      ) : (
        " requires no distributions"
      )}
      . Over <Strong>{insights.years} years</Strong> the owner withdraws{" "}
      <Strong>{formatCurrency(insights.totalRmd)}</Strong> and pays about{" "}
      <Strong>{formatCurrency(insights.totalTax)}</Strong> in taxes{ending}.
    </p>
  );
};

// =====================================================
// LAYOUT
// =====================================================

const PlannerLayout = () => {
  const { inputs, result, loading, error } = useRmd();

  const [step, setStep] = useState(0);
  const [tableOpen, setTableOpen] = useState(false);

  const { warnings } = validateInputs(inputs);
  const insights = deriveInsights(result, inputs);
  const needsDeathDate = isDeceasedScenario(inputs.scenario) && !inputs.date_Death_Owner;

  const scrollToAnalysis = () => scrollToSection(document.getElementById("planner-analysis"));

  return (
    <div className="mx-auto max-w-[1500px] space-y-5">
      {/* TOP: WIZARD + SNAPSHOT */}
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <Wizard step={step} setStep={setStep} onFinish={scrollToAnalysis} />

        <div className="min-w-0 space-y-4">
          <Panel icon={Sparkles} title="Your RMD snapshot" subtitle="Updates live as you answer">
            {needsDeathDate ? (
              <NeedsDeathDate onFix={() => setStep(1)} />
            ) : !result ? (
              <div className="h-24 animate-pulse rounded-xl bg-[var(--hover-bg)]" />
            ) : (
              <div className="space-y-5">
                <div className={`transition-opacity duration-300 ${loading ? "opacity-60" : ""}`}>
                  <Summary insights={insights} inputs={inputs} />
                </div>
                <KpiGrid
                  variant="hero"
                  insights={insights}
                  inputs={inputs}
                  keys={["first", "rmd", "tax", "end"]}
                />
              </div>
            )}
          </Panel>

          <NoticeList warnings={warnings} error={error} />
        </div>
      </div>

      {!needsDeathDate && result && (
        <Panel icon={Route} title="Key milestones" subtitle="The moments that matter in this projection">
          <Milestones variant="timeline" insights={insights} inputs={inputs} />
        </Panel>
      )}

      {/* FULL ANALYSIS */}
      <div id="planner-analysis" tabIndex={-1} aria-label="Full analysis" className="scroll-mt-[5.5rem] space-y-5">
        {needsDeathDate ? null : !result ? (
          <ResultsSkeleton />
        ) : (
          <>
            <EngineToggle className="max-w-xs lg:hidden" />

            <ProjectionSection />

            <WaterfallSection />

            <Panel
              icon={Table2}
              title="Year-by-year details"
              subtitle={`${insights.years} rows · balance, RMD, tax and growth for every year`}
              accent="from-emerald-500 to-green-600"
              padded={tableOpen}
              actions={
                <button
                  type="button"
                  aria-expanded={tableOpen}
                  onClick={() => setTableOpen(!tableOpen)}
                  className="
                    flex
                    items-center
                    gap-1.5
                    rounded-lg
                    border
                    border-[var(--border-color)]
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-[var(--text-primary)]
                    hover:bg-[var(--hover-bg)]
                  "
                >
                  {tableOpen ? "Hide table" : "Show table"}
                  <ChevronDown size={14} className={`transition-transform ${tableOpen ? "rotate-180" : ""}`} />
                </button>
              }
            >
              {tableOpen && <TableSection />}
            </Panel>
          </>
        )}
      </div>
    </div>
  );
};

export default PlannerLayout;
