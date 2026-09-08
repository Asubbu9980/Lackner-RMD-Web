/* eslint-disable no-unused-vars */
import React from "react";
import ReactECharts from "echarts-for-react";

export default function WealthFlowSankey({ rows = [] }) {
  if (!rows.length) return null;

  // First year for now
  const r = rows[0];

  const option = {
    backgroundColor: "transparent",

    tooltip: {
      trigger: "item",
      backgroundColor: "#111827",
      borderColor: "#334155",
      textStyle: {
        color: "#fff",
      },
    },

    series: [
      {
        type: "sankey",

        layout: "none",

        emphasis: {
          focus: "adjacency",
        },

        nodeWidth: 24,

        nodeGap: 30,

        draggable: false,

        lineStyle: {
          color: "gradient",
          curveness: 0.5,
          opacity: 0.8,
        },

        label: {
          color: "#e2e8f0",
          fontSize: 14,
          fontWeight: 600,
        },

        data: [
          { name: "Begin Balance" },
          { name: "Growth" },
          { name: "RMD" },
          { name: "Tax" },
          { name: "Remaining" },
          { name: "Net RMD" },
        ],

        links: [
          {
            source: "Begin Balance",
            target: "Growth",
            value: r.growth,
          },

          {
            source: "Begin Balance",
            target: "Remaining",
            value: r.endBalance,
          },

          {
            source: "Growth",
            target: "RMD",
            value: r.rmd,
          },

          {
            source: "RMD",
            target: "Tax",
            value: r.tax,
          },

          {
            source: "RMD",
            target: "Net RMD",
            value: r.rmd - r.tax,
          },
        ],

        itemStyle: {
          borderWidth: 0,
        },
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      style={{
        width: "100%",
        height: "650px",
      }}
    />
  );
}