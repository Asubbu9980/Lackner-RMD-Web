/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */

import { useMemo, useState } from "react";

import { Slider, Stack } from "@mui/material";

import {
    Background,
    Controls,
    MiniMap,
    ReactFlow,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import {
    Box,
    Typography,
    Chip,
    useTheme,
} from "@mui/material";

import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";

import { getLayoutedElements } from "./layout";

import JourneyNode from "./JourneyNode";
import JourneyEdge from "./JourneyEdge";
import { COLORS } from "./colors";

const nodeTypes = {
    journey: JourneyNode,
};

const edgeTypes = {
    journey: JourneyEdge,
};

export default function PortfolioJourney({
    rows = [],
}) {
    const theme = useTheme();

    const isDark =
        theme.palette.mode === "dark";

    if (!rows.length) return null;

   const [selectedIndex, setSelectedIndex] = useState(0);

const r = rows[selectedIndex];

    const afterGrowth =
        r.beginBalance + r.growth;

    const netCash =
        r.rmd - r.tax;

    const HEADER_HEIGHT = 82;

    const NODE = {
        W: 300,
        H: 132,
    };

    const SPACING = {
        V: 220,
        H: 360,
    };

    const rawNodes = useMemo(
        () => [
            {
                id: "begin",
                type: "journey",
                data: {
                    type: "begin",
                    title: "Begin Balance",
                    value: r.beginBalance,
                    subtitle: "Opening Portfolio",
                    color: COLORS.begin,
                },
            },

            {
                id: "growth",
                type: "journey",
                data: {
                    type: "growth",
                    title: "Investment Growth",
                    value: r.growth,
                    subtitle: "Annual Return",
                    color: COLORS.growth,
                },
            },

            {
                id: "portfolio",
                type: "journey",
                data: {
                    type: "portfolio",
                    title: "Portfolio After Growth",
                    value: afterGrowth,
                    subtitle: "Before Withdrawals",
                    color: COLORS.portfolio,
                },
            },

            {
                id: "rmd",
                type: "journey",
                data: {
                    type: "rmd",
                    title: "RMD",
                    value: r.rmd,
                    subtitle: "Required Distribution",
                    color: COLORS.rmd,
                },
            },

            {
                id: "tax",
                type: "journey",
                data: {
                    type: "tax",
                    title: "Taxes",
                    value: r.tax,
                    subtitle: "Federal Tax",
                    color: COLORS.tax,
                },
            },

            {
                id: "cash",
                type: "journey",
                data: {
                    type: "cash",
                    title: "Net Cash",
                    value: netCash,
                    subtitle: "Cash Received",
                    color: COLORS.cash,
                },
            },

            {
                id: "remaining",
                type: "journey",
                data: {
                    type: "remaining",
                    title: "Remaining",
                    value: r.endBalance,
                    subtitle: "Ending Portfolio",
                    color: COLORS.remaining,
                },
            },
        ],
        [r, afterGrowth, netCash]
    );

    const rawEdges = useMemo(
        () => [
            {
                id: "e1",
                source: "begin",
                target: "growth",
                type: "journey",
                data: {
                    label: `+$${Math.round(r.growth).toLocaleString()}`,
                    color: COLORS.growth,
                },
            },

            {
                id: "e2",
                source: "growth",
                target: "portfolio",
                type: "journey",
                data: {
                    label: "Growth Applied",
                    color: COLORS.portfolio,
                },
            },

            {
                id: "e3",
                source: "portfolio",
                target: "rmd",
                type: "journey",
                data: {
                    label: `-$${Math.round(r.rmd).toLocaleString()}`,
                    color: COLORS.rmd,
                },
            },

            {
                id: "e4",
                source: "portfolio",
                target: "remaining",
                type: "journey",
                data: {
                    label: "Ending Balance",
                    color: COLORS.remaining,
                },
            },

            {
                id: "e5",
                source: "rmd",
                target: "tax",
                type: "journey",
                data: {
                    label: `-$${Math.round(r.tax).toLocaleString()}`,
                    color: COLORS.tax,
                },
            },

            {
                id: "e6",
                source: "tax",
                target: "cash",
                type: "journey",
                data: {
                    label: `$${Math.round(netCash).toLocaleString()}`,
                    color: COLORS.cash,
                },
            },
        ],
        [r, netCash]
    );
    const { nodes, edges } = useMemo(() => {
        return getLayoutedElements(rawNodes, rawEdges);
    }, [rawNodes, rawEdges]);

    return (
        <Box
            sx={{
                height: "100%",

                minHeight: 860,

                borderRadius: 5,

                overflow: "hidden",

                background: isDark
                    ? COLORS.darkBg
                    : COLORS.lightBg,

                border: isDark
                    ? "1px solid rgba(255,255,255,.06)"
                    : "1px solid rgba(15,23,42,.08)",

                display: "flex",

                flexDirection: "column",
            }}
        >
            <Box
                sx={{
                    height: HEADER_HEIGHT,

                    px: 3,

                    display: "flex",

                    alignItems: "center",

                    justifyContent: "space-between",

                    borderBottom: isDark
                        ? "1px solid rgba(255,255,255,.06)"
                        : "1px solid rgba(15,23,42,.08)",

                    background: isDark
                        ? "#09111f"
                        : "#ffffff",
                }}
            >
                <Box
                    display="flex"
                    alignItems="center"
                    gap={2}
                >
                    <Box
                        sx={{
                            width: 48,

                            height: 48,

                            borderRadius: "50%",

                            display: "grid",

                            placeItems: "center",

                            bgcolor: "#0ea5e922",
                        }}
                    >
                        <InsightsRoundedIcon
                            sx={{
                                color: "#0EA5E9",
                            }}
                        />
                    </Box>

                    <Box>
                        <Typography
                            sx={{
                                fontWeight: 800,

                                fontSize: 26,

                                color: isDark
                                    ? "#fff"
                                    : "#111827",
                            }}
                        >
                            Portfolio Journey Explorer
                        </Typography>

                        <Typography
                            sx={{
                                color: "text.secondary",

                                fontSize: 14,
                            }}
                        >
                            Calendar {r.year} • Age {r.age}
                        </Typography>
                    </Box>
                </Box>

                <Chip
                    label="Live Journey"

                    sx={{
                        fontWeight: 700,

                        bgcolor: "#22c55e22",

                        color: "#22c55e",

                        border:
                            "1px solid rgba(34,197,94,.3)",
                    }}
                />
            </Box>

            <Box
  sx={{
    px: 3,
    py: 2,
    borderBottom: isDark
      ? "1px solid rgba(255,255,255,.06)"
      : "1px solid rgba(0,0,0,.08)",
  }}
>
  <Stack spacing={1}>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        fontWeight: 700,
      }}
    >
      <Typography>
        Year {r.year}
      </Typography>

      <Typography color="primary">
        Age {r.age}
      </Typography>
    </Box>

    <Slider
      value={selectedIndex}
      min={0}
      max={rows.length - 1}
      step={1}
      marks
      valueLabelDisplay="auto"
      valueLabelFormat={(v) => rows[v].year}
      onChange={(_, value) => setSelectedIndex(value)}
    />
  </Stack>
</Box>


            <Box
                sx={{
                    flex: 1,

                    position: "relative",
                }}
            >
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    fitView
                    fitViewOptions={{
                        padding: 0.25,
                        includeHiddenNodes: true,
                    }}
                    nodesDraggable={false}
                    nodesConnectable={false}
                    elementsSelectable={false}
                    panOnDrag
                    proOptions={{ hideAttribution: true }}
                >
                    <Background
                        gap={24}
                        color={isDark ? "#1e293b" : "#cbd5e1"}
                    />

                    <MiniMap
  pannable
  zoomable
  position="bottom-left"
  nodeBorderRadius={8}
  style={{
    width: 170,
    height: 110,
    borderRadius: 14,
    background: isDark ? "#0f172a" : "#ffffff",
    border: isDark
      ? "1px solid rgba(255,255,255,.08)"
      : "1px solid rgba(15,23,42,.08)",
  }}
/>

                    <Controls
                        showInteractive={false}
                        position="bottom-right"
                        style={{
                            background: isDark ? "#111827" : "#fff",
                            borderRadius: 12,
                            border: "none",
                            boxShadow: "0 8px 24px rgba(0,0,0,.15)",
                        }}
                    />
                </ReactFlow>
            </Box>
        </Box>
    );
}