import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

import { Box, Typography } from "@mui/material";



const Analytics2D = ({ data, isDark, formatCurrency }) => {
  // =========================
  // DATA
  // =========================

  const analyticsData = data.slice(0, 24).map((d) => ({
    age: d.age,

    rmd: d.rmd,

    tax: d.tax,

    growth: d.growth || 0,

    total: d.rmd + d.tax + (d.growth || 0),
  }));

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",

        p: 1,
      }}
    >
      {/* HEADER */}

      <Box
        sx={{
          display: "flex",

          justifyContent: "space-between",

          alignItems: "center",

          mb: 2,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: 22,

              fontWeight: 800,

              color: isDark ? "#ffffff" : "#111827",
            }}
          >
            Global Analytics
          </Typography>

          <Typography
            sx={{
              fontSize: 13,

              mt: 0.5,

              color: isDark ? "rgba(255,255,255,0.6)" : "#64748b",
            }}
          >
            Financial performance insights
          </Typography>
        </Box>
      </Box>

      {/* CHART */}

      <Box
        sx={{
          width: "100%",
          height: 430,

          borderRadius: "24px",

          overflow: "hidden",

          background: isDark
            ? "linear-gradient(180deg,#020617,#0f172a)"
            : "#ffffff",

          border: isDark
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid rgba(15,23,42,0.08)",

          p: 2,
        }}
      >
        
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={analyticsData}>
              {/* GRID */}

              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}
              />

              {/* X */}

              <XAxis
                dataKey="age"
                tick={{
                  fill: isDark ? "#94a3b8" : "#64748b",

                  fontSize: 11,
                }}
              />

              {/* Y */}

              <YAxis
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                tick={{
                  fill: isDark ? "#94a3b8" : "#64748b",

                  fontSize: 11,
                }}
              />

              {/* TOOLTIP */}

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;

                    return (
                      <Box
                        sx={{
                          background: isDark
                            ? "rgba(15,23,42,0.98)"
                            : "#ffffff",

                          border: "1px solid rgba(148,163,184,0.2)",

                          borderRadius: "14px",

                          p: 2,

                          minWidth: 220,

                          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 800,

                            mb: 1,

                            color: "#0ea5e9",
                          }}
                        >
                          Age {d.age}
                        </Typography>

                        {/* RMD */}

                        <Box
                          sx={{
                            display: "flex",

                            justifyContent: "space-between",

                            mb: 1,
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#a855f7",
                            }}
                          >
                            RMD
                          </Typography>

                          <Typography fontWeight={700}>
                            {formatCurrency(d.rmd)}
                          </Typography>
                        </Box>

                        {/* TAX */}

                        <Box
                          sx={{
                            display: "flex",

                            justifyContent: "space-between",

                            mb: 1,
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#f43f5e",
                            }}
                          >
                            TAX
                          </Typography>

                          <Typography fontWeight={700}>
                            {formatCurrency(d.tax)}
                          </Typography>
                        </Box>

                        {/* GROWTH */}

                        <Box
                          sx={{
                            display: "flex",

                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#10b981",
                            }}
                          >
                            GROWTH
                          </Typography>

                          <Typography fontWeight={700}>
                            {formatCurrency(d.growth)}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  }

                  return null;
                }}
              />

              {/* LEGEND */}

              <Legend />

              {/* RMD */}

              <Bar
                dataKey="rmd"
                stackId="a"
                fill="#a855f7"
                radius={[4, 4, 0, 0]}
              />

              {/* TAX */}

              <Bar
                dataKey="tax"
                stackId="a"
                fill="#f43f5e"
                radius={[4, 4, 0, 0]}
              />

              {/* GROWTH */}

              <Bar
                dataKey="growth"
                stackId="a"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />

              {/* TREND LINE */}

              <Line
                type="monotone"
                dataKey="total"
                stroke="#00f2ff"
                strokeWidth={3}
                dot={{
                  r: 3,
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
     
      </Box>
    </Box>
  );
};

export default Analytics2D;
