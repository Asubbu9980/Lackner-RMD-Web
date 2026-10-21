import { Flag, CalendarClock, Mountain, PiggyBank, CircleAlert } from "lucide-react";

import { formatCompact } from "../../utils/format";
import { isDeceasedScenario } from "../../utils/rmd";
import useRmd from "../../hooks/useRmd";
import Skeleton from "./Skeleton";

const buildMilestones = (insights, inputs, thisYear = new Date().getFullYear()) => {
  const inherited = isDeceasedScenario(inputs.scenario);
  const { firstRmd, peakRmd, lastRow } = insights;

  const items = [
    {
      key: "today",
      year: thisYear,
      title: "Today",
      detail: inherited
        ? `Beneficiary age ${insights.benyAge}`
        : `Owner age ${insights.ownerAge}`,
      icon: Flag,
      color: "bg-slate-400",
    },
  ];

  if (firstRmd) {
    items.push({
      key: "first",
      year: firstRmd.year,
      title: inherited ? "Distributions begin" : "RMDs begin",
      detail: `Age ${firstRmd.age} · ${formatCompact(firstRmd.rmd)}`,
      icon: CalendarClock,
      color: "bg-indigo-500",
    });
  }

  if (peakRmd && peakRmd !== firstRmd && peakRmd !== lastRow) {
    items.push({
      key: "peak",
      year: peakRmd.year,
      title: "Peak RMD",
      detail: `Age ${peakRmd.age} · ${formatCompact(peakRmd.rmd)}`,
      icon: Mountain,
      color: "bg-cyan-500",
    });
  }

  if (lastRow) {
    items.push({
      key: "end",
      year: lastRow.year,
      title: insights.depleted ? "Account depleted" : "Projection ends",
      detail: insights.depleted
        ? `Final RMD ${formatCompact(lastRow.rmd)}`
        : `Balance ${formatCompact(insights.endingBalance)}`,
      icon: insights.depleted ? CircleAlert : PiggyBank,
      color: insights.depleted ? "bg-amber-500" : "bg-emerald-500",
    });
  }

  return items;
};

// variant "strip" — tiles (Workspace) · variant "timeline" — connected line (Planner)
const Milestones = ({ insights, inputs, variant = "strip" }) => {
  const items = buildMilestones(insights, inputs);
  const { calculating } = useRmd();

  if (variant === "timeline") {
    return (
      <ol className="relative flex flex-col gap-5 sm:flex-row sm:gap-2">
        {/* connector — runs between the centres of the first and last items */}
        <div
          aria-hidden
          style={{ left: `${50 / items.length}%`, right: `${50 / items.length}%` }}
          className="
            absolute
            hidden
            sm:block
            top-[18px]
            h-0.5
            bg-gradient-to-r
            from-slate-400/40
            via-purple-500/50
            to-emerald-500/50
          "
        />

        {items.map((m) => {
          const Icon = m.icon;

          return (
            <li
              key={m.key}
              className="relative flex items-center gap-3 sm:flex-1 sm:flex-col sm:text-center"
            >
              <span
                className={`
                  relative
                  z-10
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  ${m.color}
                  text-white
                  ring-4
                  ring-[var(--bg-primary)]
                `}
              >
                <Icon size={16} />
              </span>

              {calculating ? (
                <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:items-center">
                  <Skeleton className="h-5 w-14" />
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
              ) : (
                <div key={`${m.year}${m.detail}`} className="rmd-fade-in min-w-0">
                  <p className="text-lg font-black tabular-nums text-[var(--text-primary)]">{m.year}</p>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{m.title}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{m.detail}</p>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
      {items.map((m) => {
        const Icon = m.icon;

        return (
          <div
            key={m.key}
            className="
              flex
              min-w-0
              items-center
              gap-3
              rounded-[var(--card-radius)]
              border
              border-[var(--border-color)]
              bg-[var(--bg-secondary)]
              px-3
              py-2.5
            "
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${m.color} text-white`}
            >
              <Icon size={15} />
            </span>

            {calculating ? (
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <Skeleton className="h-3 w-3/5" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            ) : (
              <div key={`${m.year}${m.detail}`} className="rmd-fade-in min-w-0">
                <p className="truncate text-xs font-semibold text-[var(--text-secondary)]">
                  {m.title} · <span className="tabular-nums text-[var(--text-primary)]">{m.year}</span>
                </p>
                <p className="truncate text-sm font-bold text-[var(--text-primary)]">{m.detail}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Milestones;
