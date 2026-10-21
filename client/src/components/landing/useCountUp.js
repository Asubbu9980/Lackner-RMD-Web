import { useLayoutEffect } from "react";

import usePrefersReducedMotion from "./usePrefersReducedMotion";

const easeOutExpo = (p) => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p));

/**
 * Counts ref.current's text from 0 to `target` with requestAnimationFrame.
 * Writes textContent directly (no per-frame React state) and always finishes
 * on format(target), the canonical string.
 */
export default function useCountUp(
  ref,
  { target, decimals = 0, format, duration = 1600, delay = 0, start = true }
) {
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const fmt = format || ((v) => v.toFixed(decimals));

    if (reduced) {
      el.textContent = fmt(target);
      return undefined;
    }

    el.textContent = fmt(0);
    if (!start) return undefined;

    const factor = 10 ** decimals;
    let raf = 0;
    let t0 = null;

    const tick = (now) => {
      if (t0 === null) t0 = now;
      const p = Math.min(1, (now - t0) / duration);
      if (p < 1) {
        el.textContent = fmt(Math.round(target * easeOutExpo(p) * factor) / factor);
        raf = requestAnimationFrame(tick);
      } else {
        el.textContent = fmt(target);
      }
    };

    const timer = setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [ref, target, decimals, format, duration, delay, start, reduced]);
}
