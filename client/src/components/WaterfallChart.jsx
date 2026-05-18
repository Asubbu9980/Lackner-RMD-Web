import { useState } from "react";

import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

import CascadeFlow3D from "./CascadeFlow3D";

import PlotlyChart from "./PlotlyChart";

import { useThemeContext } from "../context/ThemeContext";

import useRmd from "../hooks/useRmd";

const WaterfallChart = () => {
  const { mode } = useThemeContext();

  const { result } = useRmd();

  const isDark = mode === "dark";

  const [view, setView] = useState("3d");

  const rows = result?.rows || [];

  return (
    <Box
      sx={{
        width: "100%",

        borderRadius: "22px",

        overflow: "hidden",

        background: isDark
          ? "linear-gradient(180deg, #020617 0%, #0f172a 100%)"
          : "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",

        border: isDark
          ? "1px solid rgba(255,255,255,0.06)"
          : "1px solid rgba(15,23,42,0.08)",

        boxShadow: isDark
          ? "0 12px 35px rgba(0,0,0,0.4)"
          : "0 6px 20px rgba(15,23,42,0.08)",

        p: 2,

        transition: "all 0.3s ease",
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <Box
        sx={{
          display: "flex",

          justifyContent: "space-between",

          alignItems: "center",

          mb: 1.8,

          p: 1.2,

          borderRadius: "16px",

          background: isDark
            ? "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(30,41,59,0.85))"
            : "linear-gradient(135deg, #ffffff, #f8fafc)",

          border: isDark
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(15,23,42,0.08)",
        }}
      >
        {/* LEFT */}

        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,

              letterSpacing: "-0.3px",

              color: isDark ? "#ffffff" : "#0f172a",
            }}
          >
            Financial Waterfall
          </Typography>

          <Typography
            sx={{
              mt: 0.3,

              fontSize: 12,

              color: isDark ? "rgba(255,255,255,0.65)" : "#64748b",
            }}
          >
            Interactive Wealth Flow Visualization
          </Typography>
        </Box>

        {/* RIGHT TOGGLE */}

        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(_, v) => v && setView(v)}
          size="small"
          sx={{
            background: isDark ? "rgba(15,23,42,0.9)" : "#f1f5f9",

            borderRadius: "14px",

            p: 0.4,

            "& .MuiToggleButton-root": {
              border: 0,

              color: isDark ? "#94a3b8" : "#475569",

              px: 2,

              py: 0.8,

              fontWeight: 700,

              textTransform: "none",

              borderRadius: "10px",

              "&.Mui-selected": {
                background: "linear-gradient(135deg, #2563eb, #3b82f6)",

                color: "#fff",

                boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
              },
            },
          }}
        >
          <ToggleButton value="3d">Projection</ToggleButton>

          <ToggleButton value="2d">Waterfall</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* =====================================================
          CHART
      ===================================================== */}

      <Box
        sx={{
          borderRadius: "18px",

          overflow: "hidden",

          border: isDark
            ? "1px solid rgba(255,255,255,0.04)"
            : "1px solid rgba(15,23,42,0.06)",

          background: isDark ? "#020617" : "#ffffff",

          height: "420px",
        }}
      >
        {view === "3d" ? (
          <CascadeFlow3D mode="WATERFALL" />
        ) : (
          <PlotlyChart
            data={[
              {
                x: rows.map((r) => r.growth),

                y: rows.map((r) => `${r.year}`),

                type: "bar",

                orientation: "h",

                name: "Growth",

                marker: {
                  color: "#86efac",
                },

                customdata: rows.map((r) => [
                  r.beginBalance,
                  r.rmd,
                  r.tax,
                  r.growth,
                  r.endBalance,
                ]),

                hovertemplate:
                  "<span style='font-size:16px;font-weight:700;color:#38bdf8'>" +
                  "Financial Projection" +
                  "</span><br><br>" +
                  "<b>Year:</b> %{y}<br>" +
                  "<b>End Balance:</b> %{customdata[4]:$,.0f}<br><br>" +
                  "<span style='color:#84cc16'><b>Principal:</b></span> %{customdata[0]:$,.0f}<br>" +
                  "<span style='color:#22c55e'><b>Growth:</b></span> %{customdata[3]:$,.0f}<br>" +
                  "<span style='color:#ef4444'><b>Tax:</b></span> %{customdata[2]:$,.0f}<br>" +
                  "<span style='color:#a855f7'><b>RMD:</b></span> %{customdata[1]:$,.0f}" +
                  "<extra></extra>",
              },

              {
                x: rows.map((r) => r.beginBalance),

                y: rows.map((r) => `${r.year}`),

                type: "bar",

                orientation: "h",

                name: "Principal",

                marker: {
                  color: "#65a30d",
                },

                customdata: rows.map((r) => [
                  r.beginBalance,
                  r.rmd,
                  r.tax,
                  r.growth,
                  r.endBalance,
                ]),

                hovertemplate:
                  "<span style='font-size:16px;font-weight:700;color:#38bdf8'>" +
                  "Financial Projection" +
                  "</span><br><br>" +
                  "<b>Year:</b> %{y}<br>" +
                  "<b>End Balance:</b> %{customdata[4]:$,.0f}<br><br>" +
                  "<span style='color:#84cc16'><b>Principal:</b></span> %{customdata[0]:$,.0f}<br>" +
                  "<span style='color:#22c55e'><b>Growth:</b></span> %{customdata[3]:$,.0f}<br>" +
                  "<span style='color:#ef4444'><b>Tax:</b></span> %{customdata[2]:$,.0f}<br>" +
                  "<span style='color:#a855f7'><b>RMD:</b></span> %{customdata[1]:$,.0f}" +
                  "<extra></extra>",
              },

              {
                x: rows.map((r) => r.rmd),

                y: rows.map((r) => `${r.year}`),

                type: "bar",

                orientation: "h",

                name: "RMD",

                marker: {
                  color: "#9333ea",
                },

                customdata: rows.map((r) => [
                  r.beginBalance,
                  r.rmd,
                  r.tax,
                  r.growth,
                  r.endBalance,
                ]),

                hovertemplate:
                  "<span style='font-size:16px;font-weight:700;color:#38bdf8'>" +
                  "Financial Projection" +
                  "</span><br><br>" +
                  "<b>Year:</b> %{y}<br>" +
                  "<b>End Balance:</b> %{customdata[4]:$,.0f}<br><br>" +
                  "<span style='color:#84cc16'><b>Principal:</b></span> %{customdata[0]:$,.0f}<br>" +
                  "<span style='color:#22c55e'><b>Growth:</b></span> %{customdata[3]:$,.0f}<br>" +
                  "<span style='color:#ef4444'><b>Tax:</b></span> %{customdata[2]:$,.0f}<br>" +
                  "<span style='color:#a855f7'><b>RMD:</b></span> %{customdata[1]:$,.0f}" +
                  "<extra></extra>",
              },

              {
                x: rows.map((r) => r.tax),

                y: rows.map((r) => `${r.year}`),

                type: "bar",

                orientation: "h",

                name: "Tax",

                marker: {
                  color: "#ef4444",
                },

                customdata: rows.map((r) => [
                  r.beginBalance,
                  r.rmd,
                  r.tax,
                  r.growth,
                  r.endBalance,
                ]),

                hovertemplate:
                  "<span style='font-size:16px;font-weight:700;color:#38bdf8'>" +
                  "Financial Projection" +
                  "</span><br><br>" +
                  "<b>Year:</b> %{y}<br>" +
                  "<b>End Balance:</b> %{customdata[4]:$,.0f}<br><br>" +
                  "<span style='color:#84cc16'><b>Principal:</b></span> %{customdata[0]:$,.0f}<br>" +
                  "<span style='color:#22c55e'><b>Growth:</b></span> %{customdata[3]:$,.0f}<br>" +
                  "<span style='color:#ef4444'><b>Tax:</b></span> %{customdata[2]:$,.0f}<br>" +
                  "<span style='color:#a855f7'><b>RMD:</b></span> %{customdata[1]:$,.0f}" +
                  "<extra></extra>",
              },
            ]}
            layout={{
              hovermode: "closest",

              barmode: "stack",

              paper_bgcolor: "transparent",

              plot_bgcolor: "transparent",

              font: {
                color: isDark ? "#e2e8f0" : "#0f172a",
              },

              margin: {
                t: 20,
                l: 70,
                r: 20,
                b: 40,
              },

              xaxis: {
                tickprefix: "$",

                tickformat: ",.0f",

                gridcolor: isDark ? "#1e293b" : "#e2e8f0",

                zeroline: false,
              },

              yaxis: {
                autorange: "reversed",

                gridcolor: isDark ? "#1e293b" : "#e2e8f0",
              },

              legend: {
                orientation: "h",

                y: -0.18,

                x: 0.5,

                xanchor: "center",
              },

              hoverlabel: {
                bgcolor: "#071226",

                bordercolor: "#1e3a8a",

                font: {
                  color: "#ffffff",
                  size: 13,
                  family: "Inter, sans-serif",
                },

                align: "left",
              },
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default WaterfallChart;
