import { useEffect, useState } from "react";

import usePrefersReducedMotion from "./usePrefersReducedMotion";

export const supportsIntersectionObserver = () =>
  typeof window !== "undefined" && "IntersectionObserver" in window;

/**
 * Observes `ref` and reports whether it has entered the viewport.
 * Mirrors the result onto ref.current as a data attribute (data-revealed by
 * default) so CSS can drive the transition. Resolves to true immediately when
 * IntersectionObserver is missing or reduced motion is requested.
 */
export default function useReveal(
  ref,
  {
    threshold = 0.2,
    rootMargin = "0px",
    once = true,
    attribute = "data-revealed",
  } = {}
) {
  const reduced = usePrefersReducedMotion();
  const supported = supportsIntersectionObserver();
  const [seen, setSeen] = useState(false);

  const revealed = seen || !supported || reduced;

  useEffect(() => {
    const el = ref.current;
    if (el && attribute) el.setAttribute(attribute, revealed ? "true" : "false");
  }, [ref, attribute, revealed]);

  useEffect(() => {
    if (!supported || reduced) return undefined;
    if (once && seen) return undefined;
    const el = ref.current;
    if (!el) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setSeen(true);
            if (once) io.disconnect();
          } else if (!once) {
            setSeen(false);
          }
        }
      },
      { threshold, rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, rootMargin, once, seen, supported, reduced]);

  return revealed;
}
