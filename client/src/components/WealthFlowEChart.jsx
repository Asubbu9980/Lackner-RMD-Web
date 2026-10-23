/* eslint-disable no-unused-vars */
import React from "react";
import ReactECharts from "echarts-for-react";
import { useThemeContext } from "../context/ThemeContext";

export default function WealthFlowEChart({ rows = [] }) {
  const { mode } = useThemeContext();

  const isDark = mode === "dark";

  if (!rows.length) return null;

  const option = {
    backgroundColor: "transparent",

    animation: true,

    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },

    legend: {
      top: 5,
      textStyle: {
        color: isDark ? "#e2e8f0" : "#1e293b",
      },
    },

    grid: {
      left: 70,
      right: 100,
      top: 45,
      bottom: 20,
    },

    xAxis: {
      type: "value",

      splitLine: {
        lineStyle: {
          color: isDark ? "#1e293b" : "#e2e8f0",
        },
      },

      axisLabel: {
        color: isDark ? "#94a3b8" : "#475569",
      },
    },

    yAxis: {
      type: "category",

      inverse: true,

      data: rows.map((r) => r.year),

      axisLabel: {
        color: isDark ? "#cbd5e1" : "#475569",
        fontWeight: 600,
      },
    },

    series: [
      {
        name: "Principal",
        type: "bar",
        stack: "wealth",

        data: rows.map((r) => r.beginBalance),

        itemStyle: {
          color: "#558E28",
        },
      },

      {
        name: "Growth",
        type: "bar",
        stack: "wealth",

        data: rows.map((r) => r.growth),

        itemStyle: {
          color: "#86CD4D",
        },
      },

      {
        name: "RMD",
        type: "bar",
        stack: "wealth",

        data: rows.map((r) => r.rmd),

        itemStyle: {
          color: "#722CFD",
        },
      },

      {
        name: "Tax",
        type: "bar",
        stack: "wealth",

        data: rows.map((r) => r.tax),

        itemStyle: {
          color: "#DD2067",
        },
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      style={{
        width: "100%",
        height: "700px",
      }}
    />
  );
}