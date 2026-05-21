import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

import { Box, Typography } from "@mui/material";

import { useState } from "react";

const Pie2D = ({ pieData, formatCurrency, isDark }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const total = pieData.reduce((acc, item) => acc + item.value, 0);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        gap: 2,
      }}
    >
      {/* LEFT */}

      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          position: "relative",
          height: "100%",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              formatter={(value) => [
                formatCurrency(value),
                pieData[activeIndex]?.label,
              ]}
            />

            <Pie
              data={pieData}
              dataKey="value"
              nameKey="label"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={3}
              activeIndex={activeIndex}
              onMouseEnter={(_, i) => setActiveIndex(i)}
            >
              <Cell fill="#7c3aed" />
              <Cell fill="#ef4444" />
              <Cell fill="#22c55e" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* CENTER */}

        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: isDark ? "rgba(255,255,255,0.72)" : "#64748b",
            }}
          >
            {pieData[activeIndex]?.label}
          </Typography>

          <Typography
            sx={{
              fontWeight: 800,

              color: isDark ? "#ffffff" : "#111827",

              fontSize: 24,
            }}
          >
            {formatCurrency(pieData[activeIndex]?.value || 0)}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: isDark ? "rgba(255,255,255,0.72)" : "#64748b",
            }}
          >
            {(((pieData[activeIndex]?.value || 0) / total) * 100).toFixed(1)}%
          </Typography>
        </Box>
      </Box>

      {/* RIGHT */}

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {pieData.map((item, i) => {
          const percent = ((item.value / total) * 100).toFixed(1);

          const color = i === 0 ? "#7c3aed" : i === 1 ? "#ef4444" : "#22c55e";

          return (
            <Box
              key={i}
              onMouseEnter={() => setActiveIndex(i)}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",

                p: 1.2,

                borderRadius: "12px",

                cursor: "pointer",

                transition: "all 0.25s ease",
                backgroundColor:
                  i === activeIndex
                    ? isDark
                      ? "rgba(255,255,255,0.08)"
                      : "#f3f4f6"
                    : "transparent",
                "&:hover": {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "#f8fafc",
                },
              }}
            >
              {/* LEFT */}

              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "3px",
                    backgroundColor: color,
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 13,

                    color: isDark ? "#ffffff" : "#111827",

                    fontWeight: 500,
                  }}
                >
                  {item.label}
                </Typography>
              </Box>

              {/* RIGHT */}

              <Box textAlign="right">
                <Typography
                  sx={{
                    minWidth: 140,

                    textAlign: "right",

                    fontWeight: 700,

                    color: isDark ? "#ffffff" : "#111827",
                  }}
                >
                  {formatCurrency(item.value)}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    color: isDark ? "rgba(255,255,255,0.65)" : "#64748b",
                  }}
                >
                  {percent}%
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default Pie2D;
