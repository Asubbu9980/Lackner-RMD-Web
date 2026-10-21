import { Wallet, CalendarClock, TrendingUp, Landmark, HandCoins, PiggyBank } from "lucide-react";

import { formatCurrency, formatCompact, formatPercent } from "../../utils/format";
import { getPlan } from "../../utils/rmd";

const buildKpis = (insights, inputs) => [
  {
    key: "start",
    title: "Starting Balance",
    value: formatCurrency(insights.balanceStart),
    subtitle: getPlan(inputs.plan).label,
    icon: Wallet,
    tone: "text-purple-400",
    ring: "from-purple-500/20",
  },
  {
    key: "first",
    title: "First RMD",
    value: insights.firstRmd ? formatCurrency(insights.firstRmd.rmd) : "—",
    subtitle: insights.firstRmd
      ? `Age ${insights.firstRmd.age} · ${insights.firstRmd.year}`
      : "No distributions",
    icon: CalendarClock,
    tone: "text-indigo-400",
    ring: "from-indigo-500/20",
  },
  {
    key: "rmd",
    title: "Total RMDs",
    value: formatCurrency(insights.totalRmd),
    subtitle: `${formatPercent(insights.rmdPctOfStart)} of start · ${insights.years} yrs`,
    icon: TrendingUp,
    tone: "text-cyan-400",
    ring: "from-cyan-500/20",
  },
  {
    key: "tax",
    title: "Total Taxes",
    value: formatCurrency(insights.totalTax),
    subtitle: `${formatPercent(insights.taxPctOfRmd)} of RMDs at ${inputs.tax_Rate}%`,
    icon: Landmark,
    tone: "text-rose-400",
    ring: "from-rose-500/20",
    danger: true,
  },
  {
    key: "net",
    title: "Net After-Tax Income",
    value: formatCurrency(insights.netIncome),
    subtitle: `Avg ${formatCompact(insights.avgRmd)} RMD / yr`,
    icon: HandCoins,
    tone: "text-emerald-400",
    ring: "from-emerald-500/20",
  },
  {
    key: "end",
    title: "Ending Balance",
    value: insights.endingBalance >= 1 ? formatCurrency(insights.endingBalance) : "$0",
    subtitle: insights.depleted
      ? `Depleted by ${insights.lastRow?.year}`
      : `After ${insights.years} years`,
    icon: PiggyBank,
    tone: "text-amber-400",
    ring: "from-amber-500/20",
  },
];

// variant "compact" — six tiles across (Workspace)
// variant "hero" — fewer, larger tiles (Planner)
const KpiGrid = ({ insights, inputs, keys, variant = "compact", loading }) => {
  const kpis = buildKpis(insights, inputs).filter((k) => !keys || keys.includes(k.key));

  const isHero = variant === "hero";

  return (
    // Columns fit the content rather than fixed breakpoints, so tiles wrap
    // (instead of truncating values) when the text-size control is raised.
    <div
      style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${isHero ? 200 : 170}px, 1fr))` }}
      className={`
        grid
        gap-3
        transition-opacity
        duration-300
        ${loading ? "opacity-60" : "opacity-100"}
      `}
    >
      {kpis.map((k) => {
        const Icon = k.icon;

        return (
          <div
            key={k.key}
            className={`
              relative
              min-w-0
              overflow-hidden
              rounded-[var(--card-radius)]
              border
              border-[var(--border-color)]
              bg-gradient-to-br
              ${k.ring}
              to-transparent
              bg-[var(--card-bg)]
              ${isHero ? "p-5" : "p-4"}
            `}
          >
            <div className="flex items-start justify-between gap-2">
              <p
                className="
                  text-[10.5px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-[var(--text-secondary)]
                "
              >
                {k.title}
              </p>

              <Icon size={isHero ? 20 : 16} className={`shrink-0 ${k.tone}`} />
            </div>

            <p
              className={`
                mt-2
                truncate
                font-black
                tracking-tight
                tabular-nums
                ${isHero ? "text-3xl" : "text-xl xl:text-2xl"}
                ${k.danger ? "text-rose-400" : "text-[var(--text-primary)]"}
              `}
              title={k.value}
            >
              {k.value}
            </p>

            <p className="mt-1 truncate text-xs text-[var(--text-secondary)]" title={k.subtitle}>
              {k.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default KpiGrid;
