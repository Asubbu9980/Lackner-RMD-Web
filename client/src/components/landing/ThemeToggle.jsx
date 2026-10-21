import { Moon, Sun } from "lucide-react";

import { useThemeContext } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { mode, toggleTheme } = useThemeContext();
  const isDark = mode === "dark";

  return (
    <button
      type="button"
      className="llx-toggle llx-x"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      data-mode={mode}
    >
      <span className="llx-toggle-icon llx-toggle-icon--sun" aria-hidden="true">
        <Sun size={18} strokeWidth={1.75} />
      </span>
      <span className="llx-toggle-icon llx-toggle-icon--moon" aria-hidden="true">
        <Moon size={18} strokeWidth={1.75} />
      </span>
    </button>
  );
}
