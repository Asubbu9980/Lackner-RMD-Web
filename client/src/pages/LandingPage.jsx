import { Link } from "react-router-dom";

import { Box, Typography, Button, Grid, Card, Chip } from "@mui/material";

import { useThemeContext } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";

export default function LandingPage() {
  const { mode, toggleTheme } = useThemeContext();

  const isDark = mode === "dark";

  return (
    <Box
      sx={{
        minHeight: "100vh",

        background: isDark
          ? "linear-gradient(180deg,#020617 0%, #081229 100%)"
          : "linear-gradient(180deg,#f8fbff 0%, #eef5ff 100%)",

        overflow: "hidden",
      }}
    >
      {/* NAVBAR */}
      <Box
        sx={{
          px: {
            xs: 2,
            md: 4,
          },

          py: 2,

          borderBottom: isDark
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid rgba(15,23,42,0.08)",

          display: "flex",

          alignItems: "center",

          justifyContent: "space-between",

          backdropFilter: "blur(10px)",

          position: "sticky",

          top: 0,

          zIndex: 50,

          background: isDark ? "rgba(2,6,23,0.72)" : "rgba(255,255,255,0.72)",
        }}
      >
        {/* LOGO */}
        <Box
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 2,
  }}
>
  <Box
    component="img"
    src="/logo.png"
    alt="Lackner"
    sx={{
      height: 60,
      width: 140,
      objectFit: "contain",
    }}
  />

  <Typography
    variant="h5"
    sx={{
      fontWeight: 800,
      background: "linear-gradient(90deg,#38bdf8,#0ea5e9)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}
  >
    Lackner Financial Intelligence
  </Typography>
</Box>

        {/* RIGHT */}
        <Box
          sx={{
            display: "flex",

            alignItems: "center",

            gap: 1.5,
          }}
        >
          <Chip
            label="Live Projection Engine"
            sx={{
              display: {
                xs: "none",
                md: "flex",
              },

              background: isDark ? "rgba(14,165,233,0.08)" : "#e0f2fe",

              color: "#06b6d4",

              border: "1px solid rgba(14,165,233,0.2)",
            }}
          />

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

          <Link to="/login" style={{ textDecoration: "none" }}>
            <Button
              variant="outlined"
              sx={{
                borderRadius: "14px",

                px: 3,
              }}
            >
              Login
            </Button>
          </Link>

          <Link to="/" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              sx={{
                borderRadius: "14px",

                px: 3,

                background: "linear-gradient(135deg,#38bdf8,#2563eb)",

                boxShadow: "0 8px 20px rgba(14,165,233,0.25)",
              }}
            >
              Workspace
            </Button>
          </Link>
        </Box>
      </Box>

      {/* HERO */}
      <Grid
        container
        spacing={4}
        sx={{
          px: {
            xs: 2,
            md: 5,
          },

          py: {
            xs: 4,
            md: 4,
          },

          alignItems: "center",

          minHeight: "calc(100vh - 90px)",
        }}
      >
        {/* LEFT */}
        <Grid
          item
          xs={12}
          lg={5}
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box sx={{ maxWidth: "540px" }}>
            <Chip
              label="Financial Projection Workspace"
              sx={{
                mb: 3,

                background: isDark ? "rgba(14,165,233,0.08)" : "#e0f2fe",

                color: "#06b6d4",

                border: "1px solid rgba(14,165,233,0.2)",
              }}
            />

            <Typography
              sx={{
                fontSize: {
                  xs: "42px",
                  md: "44px",
                },

                lineHeight: 1.08,

                fontWeight: 800,

                mb: 2.5,
              }}
            >
              Cinematic Financial
              <br />
              Visualization
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontSize: "17px",

                maxWidth: "520px",

                opacity: 0.8,

                lineHeight: 1.8,
              }}
            >
              Interactive retirement analytics, RMD projection modeling, and
              Manim-powered financial storytelling designed for modern portfolio
              visualization workflows.
            </Typography>

            {/* CTA */}
            <Box
              sx={{
                display: "flex",

                gap: 2,

                mt: 4,

                flexWrap: "wrap",
              }}
            >
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    borderRadius: "16px",

                    px: 4,

                    py: 1.5,

                    background: "linear-gradient(135deg,#38bdf8,#2563eb)",

                    boxShadow: "0 8px 20px rgba(14,165,233,0.25)",
                  }}
                >
                  Login to Dashboard
                </Button>
              </Link>
              <Link to="/" style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    borderRadius: "16px",

                    px: 4,

                    py: 1.5,

                    background: "linear-gradient(135deg,#38bdf8,#2563eb)",

                    boxShadow: "0 8px 20px rgba(14,165,233,0.25)",
                  }}
                >
                  Open Workspace
                </Button>
              </Link>
            </Box>

            {/* MINI ANALYTICS */}
            <Grid container spacing={2} sx={{ mt: 4 }}>
              {[
                {
                  title: "Projection Engine",
                  subtitle: "3D Visualization",
                },
                {
                  title: "Tax Analysis",
                  subtitle: "Withdrawal Insights",
                },

                {
                  title: "Manim Rendering",
                  subtitle: "Cinematic Workflow",
                },
              ].map((item, index) => (
                <Grid item xs={6} key={index}>
                  <Card
                    sx={{
                      p: 2.2,

                      borderRadius: "18px",

                      background: isDark ? "rgba(15,23,42,0.72)" : "#ffffff",

                      border: isDark
                        ? "1px solid rgba(255,255,255,0.05)"
                        : "1px solid rgba(15,23,42,0.06)",

                      boxShadow: "none",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,

                        fontSize: "15px",

                        mb: 0.5,
                      }}
                    >
                      {item.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        opacity: 0.7,
                      }}
                    >
                      {item.subtitle}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>

        {/* RIGHT */}
        <Grid item xs={12} lg={7}>
          <Card
            sx={{
              p: 2.5,

              borderRadius: "24px",

              background: isDark
                ? "linear-gradient(180deg,#0f172a,#081229)"
                : "#ffffff",

              position: "relative",

              overflow: "hidden",

              maxWidth: "760px",

              mx: "auto",

              border: isDark
                ? "1px solid rgba(255,255,255,0.05)"
                : "1px solid rgba(15,23,42,0.06)",
            }}
          >
            {/* TOP */}
            <Box
              sx={{
                display: "flex",

                justifyContent: "space-between",

                alignItems: "center",

                mb: 3,
              }}
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Projection Workspace
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,

                    opacity: 0.7,
                  }}
                >
                  Interactive retirement visualization
                </Typography>
              </Box>

              <Chip
                label="Three D | 3Blue1Brown"
                sx={{
                  background: "linear-gradient(135deg,#38bdf8,#2563eb)",

                  color: "#fff",
                }}
              />
             
            </Box>

            {/* SCREEN */}
            {/* SCREEN */}
            <Box
              sx={{
                height: {
                  xs: 260,
                  md: 360,
                },

                borderRadius: "24px",

                background: isDark
                  ? "linear-gradient(180deg,#020617,#081229)"
                  : "#eef5ff",

                border: isDark
                  ? "1px solid rgba(255,255,255,0.06)"
                  : "1px solid rgba(15,23,42,0.08)",

                overflow: "hidden",

                position: "relative",

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                px: 2,
              }}
            >
              {/* GRID OVERLAY */}
              <Box
                sx={{
                  position: "absolute",

                  inset: 0,

                  opacity: 0.12,

                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",

                  backgroundSize: "40px 40px",
                }}
              />

              {/* STARS */}
              <Box
                sx={{
                  position: "absolute",

                  inset: 0,

                  backgroundImage:
                    "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.8) 1px, transparent 1px), radial-gradient(circle at 80% 40%, rgba(255,255,255,0.6) 1px, transparent 1px), radial-gradient(circle at 50% 80%, rgba(255,255,255,0.7) 1px, transparent 1px)",

                  backgroundSize: "200px 200px",
                }}
              />

              {/* GRAPH */}
              <svg
                viewBox="0 0 700 300"
                style={{
                  width: "100%",

                  height: "100%",

                  position: "relative",

                  zIndex: 2,
                }}
              >
                <defs>
                  <linearGradient id="curve" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#22d3ee" />

                    <stop offset="50%" stopColor="#60a5fa" />

                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>

                {/* AREA */}
                <path
                  d="M40 250 C160 180 240 80 340 110 C430 135 510 230 650 90 L650 300 L40 300 Z"
                  fill="rgba(56,189,248,0.08)"
                />

                {/* MAIN CURVE */}
                <path
                  d="M40 250 C160 180 240 80 340 110 C430 135 510 230 650 90"
                  stroke="url(#curve)"
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* GLOW */}
                <path
                  d="M40 250 C160 180 240 80 340 110 C430 135 510 230 650 90"
                  stroke="rgba(56,189,248,0.35)"
                  strokeWidth="14"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* POINTS */}
                {[
                  [40, 250],
                  [180, 150],
                  [340, 110],
                  [500, 210],
                  [650, 90],
                ].map((point, index) => (
                  <circle
                    key={index}
                    cx={point[0]}
                    cy={point[1]}
                    r="5"
                    fill="#ffffff"
                  />
                ))}
              </svg>
            </Box>

            {/* STATS */}
            <Grid
              container
              spacing={2}
              sx={{
                mt: 1,

                flexWrap: "nowrap",
              }}
            >
              {[
                {
                  title: "Ending Balance",
                  value: "$2.4M",
                  color: "#22c55e",
                },

                {
                  title: "Tax Drain",
                  value: "$644K",
                  color: "#ef4444",
                },

                {
                  title: "Projection",
                  value: "49 Years",
                  color: "#38bdf8",
                },
              ].map((item, index) => (
                <Grid
                  item
                  xs={4}
                  key={index}
                  sx={{
                    display: "flex",

                    flex: 1,
                  }}
                >
                  <Card
                    sx={{
                      p: 2.2,

                      borderRadius: "18px",

                      boxShadow: "none",

                      width: "100%",

                      background: isDark ? "rgba(15,23,42,0.78)" : "#ffffff",

                      border: isDark
                        ? "1px solid rgba(255,255,255,0.05)"
                        : "1px solid rgba(15,23,42,0.06)",

                      display: "flex",

                      flexDirection: "column",

                      justifyContent: "center",

                      minHeight: "110px",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        opacity: 0.7,

                        fontSize: "12px",
                      }}
                    >
                      {item.title}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 1.5,

                        color: item.color,

                        fontWeight: 800,

                        fontSize: {
                          xs: "24px",
                          md: "32px",
                        },
                      }}
                    >
                      {item.value}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
