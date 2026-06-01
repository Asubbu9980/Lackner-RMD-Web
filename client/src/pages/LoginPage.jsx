import { useState } from "react";

import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  Grid,
  Chip,
} from "@mui/material";

import { Sun, Moon } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import { useThemeContext } from "../context/ThemeContext";

export default function LoginPage() {
  const navigate = useNavigate();

  const { mode, toggleTheme } = useThemeContext();

  const isDark = mode === "dark";

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleLogin = () => {
    if (email === "admin@test.com" && password === "admin123") {
      navigate("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

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
      <Grid
        container
        columns={12}
        sx={{
          width: "100%",
          maxWidth: "1400px",
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
        {/* LEFT */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Box
            sx={{
              height: "100%",

              p: {
                xs: 4,
                md: 5,
              },

              background: isDark ? "rgba(15,23,42,0.92)" : "#ffffff",

              display: "flex",

              flexDirection: "column",

              justifyContent: "center",
            }}
          >
            {/* TOP */}
            <Box
              sx={{
                display: "flex",

                justifyContent: "space-between",

                alignItems: "center",

                mb: 5,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,

                  background: "linear-gradient(90deg,#38bdf8,#0ea5e9)",

                  WebkitBackgroundClip: "text",

                  WebkitTextFillColor: "transparent",
                }}
              >
                Lackner RMD Projection Workspace
              </Typography>

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

            {/* CHIP */}
            <Chip
              label="Secure Workspace Access"
              sx={{
                width: "fit-content",

                mb: 3,

                background: isDark ? "rgba(14,165,233,0.08)" : "#e0f2fe",

                color: "#06b6d4",

                border: "1px solid rgba(14,165,233,0.2)",
              }}
            />

            {/* HEADING */}
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,

                mb: 2,
              }}
            >
              Welcome Back
            </Typography>

            <Typography
              variant="body1"
              sx={{
                opacity: 0.8,

                lineHeight: 1.8,

                mb: 5,
              }}
            >
              Access your cinematic financial projection workspace and
              retirement visualization dashboard.
            </Typography>

            {/* EMAIL */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Email Address
              </Typography>

              <TextField
                fullWidth
                placeholder="admin@test.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Box>

            {/* PASSWORD */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Password
              </Typography>

              <TextField
                fullWidth
                type="password"
                placeholder="admin123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Box>

            {error && (
              <Typography
                sx={{
                  color: "#ef4444",

                  mb: 2,
                }}
              >
                {error}
              </Typography>
            )}

            {/* BUTTON */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleLogin}
              sx={{
                py: 1.6,

                borderRadius: "16px",

                background: "linear-gradient(135deg,#38bdf8,#2563eb)",

                boxShadow: "0 8px 20px rgba(14,165,233,0.25)",

                fontWeight: 700,
              }}
            >
              Log In
            </Button>

            {/* BACK */}
            <Link
              to="/"
              style={{
                textDecoration: "none",
              }}
            >
              <Typography
                sx={{
                  mt: 3,

                  color: "#38bdf8",

                  fontWeight: 600,
                }}
              >
                ← Back to Overview
              </Typography>
            </Link>
          </Box>
        </Grid>

        {/* RIGHT */}
        <Grid
          size={{ xs: 12, lg: 6 }}
          sx={{
            display: "flex",

            minWidth: 0,
          }}
        >
          <Box
            sx={{
              flex: 1,

              width: "100%",

              minWidth: 0,

              display: "flex",

              flexDirection: "column",

              background: isDark
                ? "linear-gradient(180deg,#081229,#020617)"
                : "linear-gradient(180deg,#eef5ff,#f8fbff)",

              p: {
                xs: 3,
                md: 4,
              },
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
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                  }}
                >
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
            <Box
              sx={{
                flex: 1,

                width: "100%",

                display: "flex",

                alignItems: "stretch",

                justifyContent: "stretch",

                height: {
                  xs: 420,
                  md: 520,
                },

                borderRadius: "24px",

                background: isDark
                  ? "linear-gradient(180deg,#020617,#081229)"
                  : "#ffffff",

                border: isDark
                  ? "1px solid rgba(255,255,255,0.06)"
                  : "1px solid rgba(15,23,42,0.08)",

                overflow: "hidden",

                position: "relative",
              }}
            >
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
                viewBox="0 0 900 300"
                style={{
                  position: "absolute",

                  inset: 0,

                  width: "100%",

                  height: "calc(100% - 10px)",
                }}
              >
                <defs>
                  <linearGradient id="curve2" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#22d3ee" />

                    <stop offset="50%" stopColor="#60a5fa" />

                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>

                <path
                  d="M40 250 C180 180 280 70 420 120 C560 170 700 240 860 90"
                  stroke="url(#curve2)"
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                />
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
                  title: "Ending Value",
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
                <Grid item
                  xs={4}
                  key={index}
                  sx={{
                    display: "flex",

                    flex: 1,
                  }}>
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
                    <Typography variant="caption" sx={{
                        opacity: 0.7,

                        fontSize: "12px",
                      }}>{item.title}</Typography>

                    <Typography
                      sx={{
                        mt: 1,

                        color: item.color,

                        fontWeight: 700,

                        fontSize: {
                          xs: "20px",
                          md: "24px",
                        },
                      }}
                    >
                      {item.value}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
