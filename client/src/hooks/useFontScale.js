import { useLayoutEffect, useState } from "react";

// Text-size levels for the dashboard. Applied as CSS zoom on <html> so every
// part of the UI grows together — px-sized text, MUI menus/dialogs and charts
// included — the same way browser zoom does.
export const FONT_SCALES = [1, 1.1, 1.25, 1.4];

export const BASE_ZOOM = 1.045; // matches --app-zoom in index.css

// v2: the base grew 10% (old 110% is the new 100%), so old saved levels would stack
const STORAGE_KEY = "rmd.fontScale.v2";

const readIndex = () => {
  try {
    const i = Number(localStorage.getItem(STORAGE_KEY));
    return FONT_SCALES[i] ? i : 0;
  } catch {
    return 0;
  }
};

export default function useFontScale() {
  const [index, setIndex] = useState(readIndex);

  // layout effect so the new size lands before paint (no flash at the old size)
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--app-zoom", String(BASE_ZOOM * FONT_SCALES[index]));

    try {
      localStorage.setItem(STORAGE_KEY, String(index));
    } catch {
      // per-viewer convenience only
    }

    // leaving the dashboard restores the stylesheet default
    return () => root.style.removeProperty("--app-zoom");
  }, [index]);

  return {
    percent: Math.round(FONT_SCALES[index] * 100),
    canDecrease: index > 0,
    canIncrease: index < FONT_SCALES.length - 1,
    decrease: () => setIndex((i) => Math.max(0, i - 1)),
    increase: () => setIndex((i) => Math.min(FONT_SCALES.length - 1, i + 1)),
    reset: () => setIndex(0),
  };
}
