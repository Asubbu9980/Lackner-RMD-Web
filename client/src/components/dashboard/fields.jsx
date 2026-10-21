import { useState } from "react";

import { CircleAlert } from "lucide-react";

import { inputClass } from "./styles";
import FluidSlider from "./FluidSlider";

// =====================================================
// FIELD WRAPPER
// =====================================================

export const Field = ({ label, htmlFor, hint, error, aside, children }) => (
  <div className="min-w-0">
    <div className="flex items-baseline justify-between gap-2 mb-1.5">
      <label
        htmlFor={htmlFor}
        className="
          text-[11px]
          font-semibold
          uppercase
          tracking-[0.12em]
          text-[var(--text-secondary)]
        "
      >
        {label}
      </label>

      {aside}
    </div>

    {children}

    {error ? (
      <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-400">
        <CircleAlert size={12} />
        {error}
      </p>
    ) : (
      hint && <p className="mt-1.5 text-xs text-[var(--text-secondary)]">{hint}</p>
    )}
  </div>
);

export const Badge = ({ children, tone = "purple" }) => {
  const tones = {
    purple: "bg-purple-500/10 text-purple-500 dark:text-purple-300 border-purple-400/20",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-400/20",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-400/20",
    slate: "bg-[var(--hover-bg)] text-[var(--text-secondary)] border-[var(--border-color)]",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1
        rounded-full
        border
        px-2
        py-0.5
        text-[11px]
        font-semibold
        whitespace-nowrap
        ${tones[tone]}
      `}
    >
      {children}
    </span>
  );
};

export const Chip = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`
      rounded-full
      border
      px-2.5
      py-1
      text-xs
      font-semibold
      hover:transform-none
      ${
        active
          ? "border-purple-400/60 bg-purple-500/15 text-purple-600 dark:text-purple-200"
          : "border-[var(--border-color)] text-[var(--text-secondary)] hover:border-purple-400/40 hover:text-[var(--text-primary)]"
      }
    `}
  >
    {children}
  </button>
);

// =====================================================
// NUMBER INPUT
// Keeps a raw string while focused so partial values
// ("", "-", "6.") can be typed without being clobbered.
// =====================================================

export const NumberInput = ({ value, onChange, error, suffix, className = "", ...rest }) => {
  const [draft, setDraft] = useState(null);

  return (
    <div className="relative">
      <input
        type="number"
        inputMode="decimal"
        value={draft ?? value}
        onFocus={() => setDraft(String(value))}
        onBlur={() => setDraft(null)}
        onChange={(e) => {
          setDraft(e.target.value);
          const parsed = parseFloat(e.target.value);
          if (!Number.isNaN(parsed)) onChange(parsed);
        }}
        className={`${inputClass(error)} tabular-nums font-semibold ${suffix ? "pr-8" : ""} ${className}`}
        {...rest}
      />

      {suffix && (
        <span
          className="
            pointer-events-none
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            text-xs
            text-[var(--text-secondary)]
          "
        >
          {suffix}
        </span>
      )}
    </div>
  );
};

// =====================================================
// CURRENCY INPUT
// =====================================================

export const CurrencyInput = ({ id, value, onChange, error, presets = [] }) => {
  const [draft, setDraft] = useState(null);

  const display = draft ?? (value ? Number(value).toLocaleString("en-US") : "");

  return (
    <div>
      <div className="relative">
        <span
          className="
            pointer-events-none
            absolute
            left-3.5
            top-1/2
            -translate-y-1/2
            text-sm
            font-semibold
            text-[var(--text-secondary)]
          "
        >
          $
        </span>

        <input
          id={id}
          inputMode="numeric"
          autoComplete="off"
          value={display}
          onFocus={() => setDraft(value ? String(value) : "")}
          onBlur={() => setDraft(null)}
          onChange={(e) => {
            const digits = e.target.value.replace(/[^\d]/g, "");
            setDraft(digits);
            onChange(digits ? Number(digits) : 0);
          }}
          className={`${inputClass(error)} pl-7 text-base font-bold tabular-nums`}
        />
      </div>

      {presets.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {presets.map((p) => (
            <Chip key={p.value} active={value === p.value} onClick={() => onChange(p.value)}>
              {p.label}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
};

// =====================================================
// RATE INPUT (fluid slider + presets)
// =====================================================

export const RateInput = ({ id, label, value, onChange, min, max, step = 0.5, tone, presets = [] }) => (
  <div>
    <FluidSlider
      id={id}
      ariaLabel={label}
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      step={step}
      tone={tone}
      marks={presets.map((p) => p.value)}
    />

    {presets.length > 0 && (
      <div className="mt-2 flex flex-wrap gap-1.5">
        {presets.map((p) => (
          <Chip key={p.value} active={value === p.value} onClick={() => onChange(p.value)}>
            {p.label}
          </Chip>
        ))}
      </div>
    )}
  </div>
);

// =====================================================
// SEGMENTED CONTROL
// =====================================================

export const Segmented = ({ options, value, onChange, ariaLabel }) => (
  <div
    role="radiogroup"
    aria-label={ariaLabel}
    className="
      grid
      gap-1
      p-1
      rounded-xl
      border
      border-[var(--border-color)]
      bg-[var(--hover-bg)]
    "
    style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
  >
    {options.map((o) => {
      const active = o.value === value;
      const Icon = o.icon;

      return (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={active}
          onClick={() => onChange(o.value)}
          className={`
            flex
            items-center
            justify-center
            gap-1.5
            rounded-lg
            px-2
            py-2
            text-xs
            font-semibold
            whitespace-nowrap
            hover:transform-none
            ${
              active
                ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-[0_4px_14px_rgba(124,58,237,0.35)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
            }
          `}
        >
          {Icon && <Icon size={14} />}
          {o.label}
        </button>
      );
    })}
  </div>
);
