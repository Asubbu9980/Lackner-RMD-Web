import { CircleCheck } from "lucide-react";

import { SCENARIOS, SCENARIO_GROUPS } from "../../utils/rmd";

// variant "list" — compact rows for the Workspace sidebar
// variant "cards" — roomy grid for the Planner wizard
const ScenarioPicker = ({ value, onChange, groups = ["living", "inherited"], variant = "list" }) => {
  const isCards = variant === "cards";

  return (
    <div className="space-y-4">
      {SCENARIO_GROUPS.filter((g) => groups.includes(g.id)).map((group) => (
        <div key={group.id}>
          {groups.length > 1 && (
            <p
              className="
                mb-2
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.12em]
                text-[var(--text-secondary)]
              "
            >
              {group.label}
            </p>
          )}

          <div
            role="radiogroup"
            aria-label={group.label}
            className={isCards ? "grid gap-3 sm:grid-cols-2" : "space-y-2"}
          >
            {SCENARIOS.filter((s) => s.group === group.id).map((s) => {
              const active = s.id === value;

              return (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => onChange(s.id)}
                  className={`
                    group
                    relative
                    flex
                    w-full
                    items-start
                    gap-3
                    rounded-xl
                    border
                    text-left
                    hover:transform-none
                    ${isCards ? "p-4" : "px-3 py-2.5"}
                    ${
                      active
                        ? "border-purple-400/60 bg-gradient-to-r from-purple-500/15 to-indigo-500/10 shadow-[0_0_0_1px_rgba(168,85,247,0.25)]"
                        : "border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-purple-400/40 hover:bg-[var(--hover-bg)]"
                    }
                  `}
                >
                  <span
                    className={`
                      mt-0.5
                      shrink-0
                      rounded-md
                      px-1.5
                      py-0.5
                      text-[10px]
                      font-bold
                      tabular-nums
                      ${
                        active
                          ? "bg-purple-500 text-white"
                          : "bg-[var(--hover-bg)] text-[var(--text-secondary)] border border-[var(--border-color)]"
                      }
                    `}
                  >
                    {s.chart}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-[var(--text-primary)]">
                      {s.title}
                    </span>

                    <span
                      className={`
                        mt-0.5
                        block
                        text-xs
                        leading-snug
                        text-[var(--text-secondary)]
                        ${isCards ? "" : "line-clamp-2"}
                      `}
                    >
                      {s.description}
                    </span>
                  </span>

                  {active && <CircleCheck size={18} className="shrink-0 text-purple-400" />}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScenarioPicker;
