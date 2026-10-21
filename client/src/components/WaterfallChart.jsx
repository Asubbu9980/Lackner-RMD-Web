import { useState } from "react";

import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

import CascadeFlow3D from "./CascadeFlow3D";

import PlotlyChart from "./PlotlyChart";

import Waterfall2D from "./Waterfall2D";

import PortfolioJourney from "./portfoliojourney/PortfolioJourney";

import SankeyChart from "./portfoliojourney/SankeyChart";

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

        borderRadius: "var(--card-radius)",

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

        p: { xs: 1.5, sm: 2 },

        transition: "background 0.3s ease, border-color 0.3s ease",
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <Box
        sx={{
          display: "flex",

          flexDirection: { xs: "column", md: "row" },

          justifyContent: "space-between",

          alignItems: { xs: "stretch", md: "center" },

          gap: 1.5,

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

              fontSize: "max(12px, 0.875rem)",

              color: isDark ? "rgba(255,255,255,0.72)" : "#475569",
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

            // wraps into rows on narrow screens instead of overflowing
            flexWrap: "wrap",
            gap: 0.5,
            alignSelf: { xs: "flex-start", md: "auto" },
            maxWidth: "100%",

            "& .MuiToggleButtonGroup-grouped": {
              borderRadius: "10px !important",
              ml: "0 !important",
            },

            "& .MuiToggleButton-root": {
              border: 0,

              minHeight: { xs: 40, md: "auto" },

              fontSize: { xs: "0.875rem", md: "0.8125rem" },

              color: isDark ? "#cbd5e1" : "#475569",

              px: { xs: 1.5, sm: 2 },

              py: 0.8,

              fontWeight: 700,

              textTransform: "none",

              borderRadius: "10px",

              "&.Mui-selected": {
                background: "linear-gradient(135deg, #7c3aed, #2563eb)",

                color: "#fff",

                boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
              },
            },
          }}
        >
          <ToggleButton value="3d">Projection</ToggleButton>

          <ToggleButton value="2d1">Waterfall</ToggleButton>

          <ToggleButton value="2d2">Waterfall Prototype</ToggleButton>

          <ToggleButton value="echarts">Next Gen</ToggleButton>

          <ToggleButton value="sankey">Sankey</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* =====================================================
          CHART
      ===================================================== */}

      <Box
        sx={{
          borderRadius: "18px",
          overflow: view === "sankey" ? "visible" : "hidden",

          border: isDark
            ? "1px solid rgba(255,255,255,0.04)"
            : "1px solid rgba(15,23,42,0.06)",

          background: isDark ? "#020617" : "#ffffff",

          // shorter on phones; the bar list (2d1) keeps room for a row per year
          height:
            view === "echarts"
              ? { xs: "640px", md: "920px" }
              : view === "sankey"
                ? "auto"
                : view === "2d2"
                  ? { xs: "520px", md: "700px" }
                  : view === "3d"
                    ? { xs: "340px", sm: "400px", md: "420px" }
                    : "420px",

          minHeight:
            view === "sankey"
              ? { xs: "600px", md: "850px" }
              : undefined,
        }}
      >
        {view === "3d" && (
          <CascadeFlow3D mode="WATERFALL" />
        )}
        {view === "2d1" && (
          <PlotlyChart

            data={[
              {
                x: rows.map((r) => r.beginBalance),

                y: rows.map((r) => `${r.year}`),

                type: "bar",

                orientation: "h",

                name: "Principal",

                marker: {
                  color: "rgba(101,163,13,0.15)",
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
                  "🟩 Principal: %{customdata[0]:$,.0f}<br>" +
                  "🟢 Growth: %{customdata[3]:$,.0f}<br>" +
                  "🟣 RMD: %{customdata[1]:$,.0f}<br>" +
                  "🔴 Tax: %{customdata[2]:$,.0f}" +
                  "<extra></extra>",
              },
              {
                x: rows.map((r) => r.growth),

                y: rows.map((r) => `${r.year}`),

                type: "bar",

                orientation: "h",

                name: "Growth",

                marker: {
                  color: "#22c55e",
                  line: {
                    color: "#16a34a",
                    width: 1,
                  },
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
                  "🟩 Principal: %{customdata[0]:$,.0f}<br>" +
                  "🟢 Growth: %{customdata[3]:$,.0f}<br>" +
                  "🟣 RMD: %{customdata[1]:$,.0f}<br>" +
                  "🔴 Tax: %{customdata[2]:$,.0f}" +
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
                  "🟩 Principal: %{customdata[0]:$,.0f}<br>" +
                  "🟢 Growth: %{customdata[3]:$,.0f}<br>" +
                  "🟣 RMD: %{customdata[1]:$,.0f}<br>" +
                  "🔴 Tax: %{customdata[2]:$,.0f}" +
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
                  "🟩 Principal: %{customdata[0]:$,.0f}<br>" +
                  "🟢 Growth: %{customdata[3]:$,.0f}<br>" +
                  "🟣 RMD: %{customdata[1]:$,.0f}<br>" +
                  "🔴 Tax: %{customdata[2]:$,.0f}" +
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

        {view === "2d2" && (
          <Waterfall2D rows={rows} />
        )}

        {view === "echarts" && (
          <PortfolioJourney rows={rows} />
        )}
        {view === "sankey" && (
          <SankeyChart
            rows={rows}
            selectedIndex={0}
          />
        )}
      </Box>
    </Box>
  );
};

export default WaterfallChart;
