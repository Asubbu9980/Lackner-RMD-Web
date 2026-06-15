import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";
import SummaryCards from "./SummaryCards";

import { Moon, Sun } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { useThemeContext } from "../context/ThemeContext";
import { useRenderMode } from "../context/RenderModeContext";

import { LogOut } from "lucide-react";

const Header = () => {
  const { mode, toggleTheme } = useThemeContext();

  const { renderMode, setRenderMode } = useRenderMode();

  const isDark = mode === "dark";

  const navigate = useNavigate();

  const [logoutOpen, setLogoutOpen] = useState(false);
  const handleLogout = () => {
  localStorage.removeItem("token");
  sessionStorage.clear();

  navigate("/");
};

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

          bg-purple-500/10

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

          px-3
          lg:px-5

          py-3
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

          {/* =================================
    LEFT
================================= */}

          <div className="flex items-center gap-4">
            <div
              className="
      flex
      items-center
      justify-center

      rounded-2xl

      px-5
      py-3

      transition-all
      duration-300
    "
              style={{
                background: isDark
                  ? "linear-gradient(135deg, rgba(255,255,255,0.97), rgba(241,245,249,0.92))"
                  : "transparent",
                border: isDark
                  ? "1px solid rgba(255,255,255,0.12)"
                  : "1px solid transparent",
                boxShadow: isDark
                  ? "0 8px 24px rgba(0,0,0,0.35), 0 0 24px rgba(168,85,247,0.18)"
                  : "none",
              }}
            >
              <img
                src="/LeimbergLeClairLackner_logo.png"
                alt="Lackner Logo"
                className="
        h-24
        w-64

        object-contain
      "
              />
            </div>
            <div
              className="
    px-5
    py-3
    max-w-fit

    rounded-2xl

    bg-gradient-to-r
    from-cyan-500/5
    via-blue-500/5
    to-purple-500/5

    border
    border-cyan-400/10

    backdrop-blur-xl
  "
            >
              <h1
                className="
      text-4xl
      lg:text-5xl

      font-black
      tracking-tight

      bg-gradient-to-r
from-cyan-500
via-blue-500
to-purple-500

bg-clip-text
text-transparent]
    "
              >
                Lackner Financial Intelligence
              </h1>

              <p
                className="
      mt-2

      text-base

      text-[var(--text-secondary)]
    "
              >
                Interactive retirement analytics powered by Three.js and Manim
                visualizations
              </p>
            </div>
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

                px-5
                py-3

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
                  text-sm
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
      px-8
      py-3.5

      rounded-xl

      text-sm
      font-semibold

      transition-all
      duration-300

      ${
        renderMode === "node"
          ? `
            bg-gradient-to-r
            from-purple-400
            to-indigo-500

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
                3D Manim
              </button>

              <button
                onClick={() => setRenderMode("python")}
                className={`
      px-8
      py-3.5

      rounded-xl

      text-sm
      font-semibold

      transition-all
      duration-300

      ${
        renderMode === "python"
          ? `
            bg-gradient-to-r
            from-purple-400
            to-indigo-500

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

                px-6
                py-3.5

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

                  text-sm
                  font-semibold

                  text-[var(--text-primary)]
                "
              >
                {isDark ? "Light Mode" : "Dark Mode"}
              </span>
            </button>
            <button
              onClick={() => setLogoutOpen(true)}
              className="
    group

    flex
    items-center
    gap-2

    px-5
    py-3

    rounded-xl

    border
    border-red-500/20

    bg-red-500/5

    text-red-400

    hover:bg-red-500/10

    transition-all
    duration-300

    hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]
  "
            >
              <LogOut size={16} />

              <span
                className="
      text-sm
      font-semibold
    "
              >
                Logout
              </span>
            </button>
          </div>
        </div>

        {/* =================================
            SUMMARY CARDS
        ================================= */}

        <SummaryCards />
        <Dialog
  open={logoutOpen}
  onClose={() => setLogoutOpen(false)}
  PaperProps={{
    sx: {
      borderRadius: "20px",
      p: 1,
      minWidth: 350,
    },
  }}
>
  <DialogTitle>
    Confirm Logout
  </DialogTitle>

  <DialogContent>
    <Typography>
      Are you sure you want to logout from the workspace?
    </Typography>
  </DialogContent>

  <DialogActions>
    <Button
      onClick={() => setLogoutOpen(false)}
    >
      Cancel
    </Button>

    <Button
      color="error"
      variant="contained"
      onClick={handleLogout}
    >
      Logout
    </Button>
  </DialogActions>
</Dialog>
      </div>
    </header>
  );
};

export default Header;
