import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

const hasMatchMedia = () =>
  typeof window !== "undefined" && typeof window.matchMedia === "function";

function subscribe(onChange) {
  if (!hasMatchMedia()) return () => {};
  const mq = window.matchMedia(QUERY);
  if (mq.addEventListener) {
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }
  mq.addListener(onChange);
  return () => mq.removeListener(onChange);
}

const getSnapshot = () => hasMatchMedia() && window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

/** True when the user asked the OS to reduce motion. Live-updates. */
export default function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
