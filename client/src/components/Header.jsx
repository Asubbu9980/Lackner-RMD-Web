import SummaryCards from "./SummaryCards";

import { Moon, Sun, Sparkles } from "lucide-react";

import { useThemeContext } from "../context/ThemeContext";
import { useRenderMode } from "../context/RenderModeContext";

const Header = () => {
  const { mode, toggleTheme } = useThemeContext();

  const { renderMode, setRenderMode } = useRenderMode();

  const isDark = mode === "dark";

  return (
    <header
      className="
        relative

        overflow-hidden

        border-b
        border-[var(--border-color)]

        bg-[var(--glass-bg)]

        backdrop-blur-2xl

        transition-colors
        duration-300
      "
    >
      {/* =====================================
          BACKGROUND GLOWS
      ===================================== */}

      <div
        className="
          absolute
          top-[-120px]
          right-[-120px]

          w-[300px]
          h-[300px]

          rounded-full

          bg-cyan-500/10

          blur-3xl

          pointer-events-none
        "
      />

      <div
        className="
          absolute
          bottom-[-100px]
          left-[20%]

          w-[240px]
          h-[240px]

          rounded-full

          bg-purple-500/10

          blur-3xl

          pointer-events-none
        "
      />

      {/* =====================================
          CONTENT
      ===================================== */}

      <div
        className="
          relative
          z-10

          px-4
          lg:px-6

          py-4
        "
      >
        {/* =================================
            TOP ROW
        ================================= */}

        <div
          className="
            flex
            items-start
            justify-between

            gap-3

            flex-wrap

            mb-4
          "
        >
          {/* =================================
              LEFT
          ================================= */}

          <div>
            {/* TAG */}

            <div
              className="
                inline-flex
                items-center
                gap-2

                px-3
                py-1

                rounded-full

                border
                border-cyan-400/20

                bg-cyan-400/5

                mb-3
              "
            >
              <Sparkles size={12} className="text-cyan-300" />

              <span
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.15em]

                  text-cyan-300
                  font-semibold
                "
              >
                Financial Intelligence
              </span>
            </div>

            {/* TITLE */}

            <h1
              className="
                text-2xl
                lg:text-3xl

                font-black
                tracking-tight

                text-[var(--text-primary)]
              "
            >
              RMD Projection Workspace
            </h1>

            {/* SUBTITLE */}

            <p
              className="
                mt-1

                text-xs
                lg:text-sm

                text-[var(--text-secondary)]
              "
            >
              Backend-driven wealth, tax and retirement distribution analytics
            </p>
          </div>

          {/* =================================
              RIGHT
          ================================= */}

          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            {/* LIVE STATUS */}

            <div
              className="
                hidden
                md:flex

                items-center
                gap-2

                px-3
                py-2

                rounded-xl

                border
                border-cyan-400/15

                bg-cyan-400/5
              "
            >
              <div
                className="
                  h-2
                  w-2

                  rounded-full

                  bg-emerald-400

                  shadow-[0_0_12px_rgba(74,222,128,0.9)]

                  animate-pulse
                "
              />

              <span
                className="
                  text-xs
                  font-medium

                  text-cyan-300
                "
              >
                Live Projection Engine
              </span>
            </div>

            {/* RENDER MODE TOGGLE */}

            <div
              className="
    flex
    items-center

    p-1

    rounded-2xl

    border
    border-white/10

    bg-white/5
    backdrop-blur-md
  "
            >
              <button
                onClick={() => setRenderMode("node")}
                className={`
      px-5
      py-2.5

      rounded-xl

      text-xs
      font-semibold

      transition-all
      duration-300

      ${
        renderMode === "node"
          ? `
            bg-gradient-to-r
            from-cyan-400
            to-blue-500

            text-white

            shadow-[0_0_20px_rgba(0,212,255,0.35)]
          `
          : `
            text-[var(--text-secondary)]

            hover:text-white
          `
      }
    `}
              >
                Three D
              </button>

              <button
                onClick={() => setRenderMode("python")}
                className={`
      px-5
      py-2.5

      rounded-xl

      text-xs
      font-semibold

      transition-all
      duration-300

      ${
        renderMode === "python"
          ? `
            bg-gradient-to-r
            from-cyan-400
            to-blue-500

            text-white

            shadow-[0_0_20px_rgba(0,212,255,0.35)]
          `
          : `
            text-[var(--text-secondary)]

            hover:text-white
          `
      }
    `}
              >
                3Blue1Brown
              </button>
            </div>

            {/* THEME TOGGLE */}

            <button
              onClick={toggleTheme}
              className="
                group

                relative

                flex
                items-center
                gap-2

                px-4
                py-2.5

                rounded-xl

                border
                border-[var(--border-color)]

                bg-[var(--bg-secondary)]

                hover:bg-[var(--hover-bg)]

                transition-all
                duration-300

                hover:shadow-[0_0_20px_rgba(0,212,255,0.15)]

                hover:-translate-y-[1px]
              "
            >
              {/* Glow */}

              <div
                className="
                  absolute
                  inset-0

                  rounded-xl

                  bg-gradient-to-r
                  from-cyan-400/0
                  via-cyan-400/5
                  to-blue-500/0

                  opacity-0

                  group-hover:opacity-100

                  transition-opacity
                  duration-300
                "
              />

              {/* ICON */}

              <div className="relative z-10">
                {isDark ? (
                  <Sun size={16} className="text-yellow-300" />
                ) : (
                  <Moon size={16} className="text-slate-700" />
                )}
              </div>

              {/* TEXT */}

              <span
                className="
                  relative
                  z-10

                  text-xs
                  font-semibold

                  text-[var(--text-primary)]
                "
              >
                {isDark ? "Light Mode" : "Dark Mode"}
              </span>
            </button>
          </div>
        </div>

        {/* =================================
            SUMMARY CARDS
        ================================= */}

        <SummaryCards />
      </div>
    </header>
  );
};

export default Header;
