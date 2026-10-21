import { useEffect, useRef } from "react";

/**
 * Soft drifting colour fields plus a masked hairline grid. Purely decorative.
 * Pauses every ambient animation on the page while the tab is hidden by
 * toggling data-paused on the .llx-landing root.
 */
export default function AuroraBackdrop() {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current?.closest(".llx-landing");
    if (!root || typeof document === "undefined") return undefined;
    const sync = () =>
      root.setAttribute("data-paused", document.hidden ? "true" : "false");
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  return (
    <div ref={ref} className="llx-backdrop" aria-hidden="true">
      <span className="llx-blob llx-blob--a" />
      <span className="llx-blob llx-blob--b" />
      <span className="llx-blob llx-blob--c" />
      <span className="llx-gridfield" />
    </div>
  );
}
