// Scrolls a section into view (its scroll-margin-top clears the sticky
// navbar) and moves keyboard / screen-reader focus to it. Smooth unless the
// reader asked the OS for reduced motion.
export const scrollToSection = (el, focusEl = el) => {
  if (!el) return;

  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  el.scrollIntoView?.({ behavior: reduce ? "auto" : "smooth", block: "start" });

  // tabindex=-1 targets; preventScroll so focus doesn't cut the smooth scroll short
  focusEl?.focus?.({ preventScroll: true });
};
