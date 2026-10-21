import { useState } from "react";

import { Minus, Plus } from "lucide-react";

// Must match the .fluid-range thumb size in index.css — the custom visuals
// use the same geometry as the (invisible) native thumb so clicks line up.
const THUMB = 28;

const at = (pct) => `calc(${THUMB / 2}px + ${pct / 100} * (100% - ${THUMB}px))`;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

const decimalsOf = (step) => (String(step).split(".")[1] || "").length;

const TONES = {
  growth: {
    fill: "from-emerald-400 via-teal-400 to-cyan-500",
    bubble: "from-emerald-500 to-cyan-600",
    ring: "ring-emerald-400/30",
    glow: "shadow-[0_0_22px_rgba(45,212,191,0.55)]",
  },
  tax: {
    fill: "from-amber-400 via-orange-500 to-rose-500",
    bubble: "from-orange-500 to-rose-600",
    ring: "ring-rose-400/30",
    glow: "shadow-[0_0_22px_rgba(244,63,94,0.5)]",
  },
  purple: {
    fill: "from-purple-500 via-violet-500 to-indigo-500",
    bubble: "from-purple-500 to-indigo-600",
    ring: "ring-purple-400/30",
    glow: "shadow-[0_0_22px_rgba(139,92,246,0.55)]",
  },
};

// Large, animated range slider with −/+ steppers, a value bubble that
// follows the thumb, and tick marks for preset values.
const FluidSlider = ({
  id,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = "%",
  marks = [],
  tone = "purple",
  ariaLabel,
}) => {
  const [dragging, setDragging] = useState(false);
  const [focused, setFocused] = useState(false);

  const t = TONES[tone] || TONES.purple;
  const safe = clamp(Number(value) || 0, min, max);
  const pct = ((safe - min) / (max - min)) * 100;
  const active = dragging || focused;

  const snap = (v) => Number((Math.round(v / step) * step).toFixed(decimalsOf(step)));

  const nudge = (dir) => onChange(clamp(snap(safe + dir * step), min, max));

  const startDrag = () => {
    setDragging(true);
    window.addEventListener("pointerup", () => setDragging(false), { once: true });
  };

  // glide slowly to clicked/preset values, track the pointer quickly while dragging
  const motion = `
    ease-[cubic-bezier(0.22,1,0.36,1)]
    motion-reduce:transition-none
    ${dragging ? "duration-100" : "duration-500"}
  `;

  const display = `${safe.toFixed(decimalsOf(step))}${unit}`;

  const stepperClass = `
    flex
    h-12
    w-12
    shrink-0
    items-center
    justify-center
    rounded-full
    border
    border-[var(--border-color)]
    bg-[var(--bg-secondary)]
    text-[var(--text-primary)]
    transition-all
    duration-200
    hover:border-purple-400/50
    hover:transform-none
    active:scale-90
    disabled:opacity-40
  `;

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        aria-label={`Decrease ${ariaLabel}`}
        disabled={safe <= min}
        onClick={() => nudge(-1)}
        className={stepperClass}
      >
        <Minus size={20} strokeWidth={2.5} />
      </button>

      <div className="relative min-w-0 flex-1 pt-11 pb-6 select-none">
        {/* VALUE BUBBLE */}
        <div
          aria-hidden
          className={`pointer-events-none absolute top-0 -translate-x-1/2 transition-[left] ${motion}`}
          style={{ left: at(pct) }}
        >
          <div
            className={`
              relative
              rounded-lg
              bg-gradient-to-br
              ${t.bubble}
              px-2.5
              py-1
              text-base
              font-black
              tabular-nums
              text-white
              shadow-lg
              transition-transform
              duration-300
              ease-[cubic-bezier(0.34,1.56,0.64,1)]
              motion-reduce:transition-none
              ${active ? "scale-110 -translate-y-1" : "scale-100"}
            `}
          >
            {display}
          </div>
        </div>

        {/* TRACK */}
        <div className="relative h-3.5 rounded-full border border-[var(--border-color)] bg-[var(--hover-bg)]">
          {/* fill */}
          <div
            className={`absolute inset-y-0 left-0 overflow-hidden rounded-full bg-gradient-to-r ${t.fill} transition-[width] ${motion}`}
            style={{ width: at(pct) }}
          >
            <span
              className={`
                absolute
                inset-0
                fluid-shimmer
                transition-opacity
                duration-300
                ${active ? "opacity-100" : "opacity-0"}
              `}
            />
          </div>

          {/* preset ticks */}
          {marks.map((m) => (
            <span
              key={m}
              aria-hidden
              className={`
                absolute
                top-1/2
                h-1.5
                w-1.5
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                transition-colors
                duration-300
                ${m <= safe ? "bg-white/80" : "bg-slate-400/50"}
              `}
              style={{ left: at(((m - min) / (max - min)) * 100) }}
            />
          ))}

          {/* thumb */}
          <span
            aria-hidden
            className={`
              pointer-events-none
              absolute
              top-1/2
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-white
              ring-4
              ${t.ring}
              transition-[left,transform,box-shadow]
              ${motion}
              ${active ? `scale-125 ${t.glow}` : "scale-100 shadow-md"}
            `}
            style={{ left: at(pct), width: THUMB, height: THUMB }}
          />

          {/* native input — invisible, handles pointer, touch and keyboard */}
          <input
            id={id}
            type="range"
            aria-label={ariaLabel}
            aria-valuetext={display}
            min={min}
            max={max}
            step={step}
            value={safe}
            onChange={(e) => onChange(Number(e.target.value))}
            onPointerDown={startDrag}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="fluid-range absolute inset-x-0 top-1/2 h-12 w-full touch-pan-y -translate-y-1/2 cursor-grab active:cursor-grabbing"
          />
        </div>

        {/* MIN / MAX */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 flex justify-between text-xs font-semibold tabular-nums text-[var(--text-secondary)]"
        >
          <span>
            {min}
            {unit}
          </span>
          <span>
            {max}
            {unit}
          </span>
        </div>
      </div>

      <button
        type="button"
        aria-label={`Increase ${ariaLabel}`}
        disabled={safe >= max}
        onClick={() => nudge(1)}
        className={stepperClass}
      >
        <Plus size={20} strokeWidth={2.5} />
      </button>
    </div>
  );
};

export default FluidSlider;
