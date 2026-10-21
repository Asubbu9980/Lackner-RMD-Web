export const formatCurrency = (num) => {
  if (!num) return "—";
  return "$" + Math.round(num).toLocaleString();
};

// $1.2M / $845K — for tight spaces like KPI subtitles and timelines
export const formatCompact = (num) => {
  if (num === null || num === undefined || Number.isNaN(num)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(num);
};

export const formatPercent = (num, digits = 1) => {
  if (!Number.isFinite(num)) return "—";
  return `${num.toFixed(digits)}%`;
};
