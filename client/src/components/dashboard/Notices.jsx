import { TriangleAlert, CircleAlert, CalendarClock } from "lucide-react";

export const Notice = ({ tone = "amber", children }) => {
  const isError = tone === "rose";
  const Icon = isError ? CircleAlert : TriangleAlert;

  return (
    <div
      role={isError ? "alert" : "status"}
      className={`
        flex
        items-start
        gap-2.5
        rounded-xl
        border
        px-3.5
        py-2.5
        text-xs
        leading-relaxed
        ${
          isError
            ? "border-rose-400/30 bg-rose-500/10 text-rose-600 dark:text-rose-200"
            : "border-amber-400/30 bg-amber-500/10 text-amber-700 dark:text-amber-200"
        }
      `}
    >
      <Icon size={15} className="mt-px shrink-0" />
      <span>{children}</span>
    </div>
  );
};

export const NoticeList = ({ warnings = [], error }) => {
  if (!error && warnings.length === 0) return null;

  return (
    <div className="space-y-2">
      {error && <Notice tone="rose">{error}</Notice>}
      {warnings.map((w) => (
        <Notice key={w}>{w}</Notice>
      ))}
    </div>
  );
};

// Shown instead of results when an inherited scenario has no date of death yet
export const NeedsDeathDate = ({ onFix }) => (
  <div
    className="
      flex
      flex-col
      items-center
      justify-center
      gap-3
      rounded-[var(--card-radius)]
      border
      border-dashed
      border-purple-400/40
      bg-purple-500/5
      px-6
      py-14
      text-center
    "
  >
    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-400">
      <CalendarClock size={22} />
    </span>

    <div>
      <p className="text-base font-bold text-[var(--text-primary)]">
        Add the owner's date of death
      </p>
      <p className="mt-1 max-w-sm text-sm text-[var(--text-secondary)]">
        Inherited scenarios start from the date of death. Enter it to see the projection.
      </p>
    </div>

    {onFix && (
      <button
        type="button"
        onClick={onFix}
        className="
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
        Enter date of death
      </button>
    )}
  </div>
);
