// Shared, non-component pieces for the dashboard form fields

// =====================================================
// SHARED STYLES
// =====================================================

export const inputClass = (error) => `
  w-full
  rounded-xl
  border
  ${error ? "border-rose-400/70" : "border-[var(--border-color)]"}
  bg-[var(--input-bg)]
  px-3.5
  py-2.5
  text-sm
  text-[var(--text-primary)]
  outline-none
  transition-all
  duration-200
  hover:border-purple-400/50
  focus:border-purple-400
  focus:ring-4
  focus:ring-purple-400/15
`;

// =====================================================
// PRESETS
// =====================================================

export const BALANCE_PRESETS = [
  { label: "$250K", value: 250000 },
  { label: "$500K", value: 500000 },
  { label: "$1M", value: 1000000 },
  { label: "$2.5M", value: 2500000 },
  { label: "$5M", value: 5000000 },
];

export const GROWTH_PRESETS = [
  { label: "Conservative 4%", value: 4 },
  { label: "Moderate 6%", value: 6 },
  { label: "Growth 8%", value: 8 },
];

export const TAX_PRESETS = [12, 22, 24, 32, 35, 37].map((v) => ({ label: `${v}%`, value: v }));
