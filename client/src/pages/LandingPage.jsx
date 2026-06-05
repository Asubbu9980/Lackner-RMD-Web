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

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        p: {
          xs: 2,
          md: 4,
        },
      }}
    >
      <Box
        sx={{
          position: "fixed",

          top: 24,
          right: 24,

          zIndex: 9999,
        }}
      >
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
                "
        >
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

          <div className="relative z-10">
            {isDark ? (
              <Sun size={16} className="text-yellow-300" />
            ) : (
              <Moon size={16} className="text-slate-700" />
            )}
          </div>

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
      </Box>
      <Box
        sx={{
          width: "100%",
          maxWidth: "1400px",

          display: "flex",

          flexDirection: {
            xs: "column",
            lg: "row",
          },

          borderRadius: "28px",
          overflow: "hidden",

          border: isDark
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid rgba(15,23,42,0.08)",

          boxShadow: isDark
            ? "0 20px 60px rgba(0,0,0,0.45)"
            : "0 20px 60px rgba(15,23,42,0.08)",
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            p: {
              xs: 4,
              md: 5,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 3,
              flexWrap: "wrap",
            }}
          >
            <Box
              component="img"
              src="/logo.png"
              alt="Lackner Group"
              sx={{
                height: 50,
                width: "auto",

                filter: isDark
                  ? "drop-shadow(0 0 12px rgba(56,189,248,0.3))"
                  : "none",
              }}
            />

            <Typography
              sx={{
                fontSize: {
                  xs: "32px",
                  md: "48px",
                },
                fontWeight: 900,
                letterSpacing: "-2px",
                lineHeight: 1.02,
                mb: 2.5,
              }}
            >
              Retirement Calculator Reimagined
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontSize: "20px",

                maxWidth: "620px",

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
                <Grid item xs={12} md={4} key={index}>
                  <Card
                    sx={{
                      p: 3,

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
          <Box />
        </Box>
        <Box
          sx={{
            flex: 1,
            p: {
              xs: 3,
              md: 5,
            },
          }}
        >
          <Card
            sx={{
              p: 2.5,

              borderRadius: "24px",

              background: isDark
                ? "linear-gradient(180deg,#0f172a,#081229)"
                : "#ffffff",

              position: "relative",

              overflow: "hidden",

              width: "100%",
              maxWidth: "100%",

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
                label="3D Manim | 3Blue1Brown"
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
                      p: 2.5,
                      borderRadius: "24px",
                      width: "100%",
                      height: "100%",

                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",

                      background: isDark
                        ? "linear-gradient(180deg,#0f172a,#081229)"
                        : "#ffffff",
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
        </Box>
      </Box>
    </Box>
  );
}
