
import { useEffect, useMemo, useRef, useState } from "react";
import * as echarts from "echarts";
import { Box, Typography, Slider, useTheme } from "@mui/material";

const formatMoney = (value = 0) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(value);

export default function SankeyChart({
    rows = [],
    selectedIndex = 0,
}) {
    const theme = useTheme();
    const chartContainerRef = useRef(null);
    const chartInstanceRef = useRef(null);

    const [currentIndex, setCurrentIndex] = useState(selectedIndex);

    const selectedRow = rows[currentIndex] || rows[0];

    const chartData = useMemo(() => {
        if (!selectedRow) {
            return null;
        }

        const beginningBalance = Number(
            selectedRow.beginBalance ??
            selectedRow.beginningBalance ??
            selectedRow.startBalance ??
            selectedRow.initialBalance ??
            0
        );

        const growth = Number(
            selectedRow.growth ??
            selectedRow.investmentGrowth ??
            selectedRow.returnAmount ??
            0
        );

        const rmd = Number(
            selectedRow.rmd ??
            selectedRow.withdrawal ??
            selectedRow.distribution ??
            0
        );

        const endingBalance = Number(
            selectedRow.endBalance ??
            selectedRow.endingBalance ??
            selectedRow.remainingBalance ??
            Math.max(beginningBalance + growth - rmd, 0)
        );

        const tax = Number(
            selectedRow.tax ??
            selectedRow.taxes ??
            selectedRow.taxAmount ??
            0
        );

        const netCash = Math.max(rmd - tax, 0);

        return {
            nodes: [
                { name: "Beginning Balance" },
                { name: "Investment Growth" },
                { name: "Portfolio After Growth" },
                { name: "RMD Withdrawal" },
                { name: "Remaining Portfolio" },
                { name: "Taxes" },
                { name: "Net Cash" },
            ],

            links: [
                {
                    source: "Beginning Balance",
                    target: "Portfolio After Growth",
                    value: beginningBalance,
                },
                {
                    source: "Investment Growth",
                    target: "Portfolio After Growth",
                    value: growth,
                },
                {
                    source: "Portfolio After Growth",
                    target: "RMD Withdrawal",
                    value: rmd,
                },
                {
                    source: "Portfolio After Growth",
                    target: "Remaining Portfolio",
                    value: endingBalance,
                },
                {
                    source: "RMD Withdrawal",
                    target: "Taxes",
                    value: tax,
                },
                {
                    source: "RMD Withdrawal",
                    target: "Net Cash",
                    value: netCash,
                },
            ].filter((link) => link.value > 0),

            endingBalance,

            selectedYear:
                selectedRow.year ??
                selectedRow.age ??
                selectedRow.label ??
                "Selected Year",
        };
    }, [selectedRow]);

    useEffect(() => {
        if (!chartContainerRef.current || !chartData) {
            return undefined;
        }

        const chart = echarts.init(chartContainerRef.current);
        chartInstanceRef.current = chart;

        chart.setOption({
            animation: true,

            tooltip: {
                trigger: "item",
                formatter: (params) => {
                    if (params.dataType === "edge") {
                        const source = params.data.source;
                        const target = params.data.target;
                        const value = Number(params.data.value || 0);

                        return `
                            <div style="font-weight:700;margin-bottom:6px">
                                ${source} → ${target}
                            </div>
                            <div>
                                Flow amount:
                                <strong>${formatMoney(value)}</strong>
                            </div>
                        `;
                    }

                    if (params.dataType === "node") {
                        return `
                            <div style="font-weight:700;margin-bottom:6px">
                                ${params.name}
                            </div>
                            <div>
                                Hover over a flow to view its amount.
                            </div>
                        `;
                    }

                    return "";
                },
            },

            series: [
                {
                    type: "sankey",

                    left: "4%",
                    right: "15%",
                    top: "3%",
                    bottom: "12%",

                    nodeWidth: 28,
                    nodeGap: 42,
                    draggable: true,

                    emphasis: {
                        focus: "adjacency",
                        lineStyle: {
                            opacity: 0.9,
                        },
                    },

                    data: chartData.nodes,
                    links: chartData.links,

                    lineStyle: {
                        color: "gradient",
                        curveness: 0.5,
                        opacity: 0.55,
                    },

                    itemStyle: {
                        borderWidth: 1,
                        borderColor: theme.palette.divider,
                    },

                    label: {
                        color: theme.palette.text.primary,
                        fontSize: 12,
                        overflow: "break",
                    },
                },
            ],
        });

        const resizeObserver = new ResizeObserver(() => {
            chart.resize();
        });

        resizeObserver.observe(chartContainerRef.current);

        return () => {
            resizeObserver.disconnect();
            chart.dispose();
            chartInstanceRef.current = null;
        };
    }, [chartData, theme.palette]);

    if (!chartData) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography color="text.secondary">
                    No data available for the Sankey diagram.
                </Typography>
            </Box>
        );
    }

    const firstYear = rows[0]?.year ?? rows[0]?.age ?? 0;

    const lastYear =
        rows[rows.length - 1]?.year ??
        rows[rows.length - 1]?.age ??
        rows.length - 1;

    const lastIndex = Math.max(rows.length - 1, 0);

    return (
        <Box
            sx={{
                width: "100%",
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                p: 2,
                backgroundColor: theme.palette.background.paper,
                overflow: "visible",
            }}
        >
            <Typography variant="h6" sx={{ mb: 0.5 }}>
                Portfolio Cash Flow
            </Typography>

            <Typography variant="body2" color="text.secondary">
                {chartData.selectedYear}
            </Typography>

            <Box
                sx={{
                    px: 1,
                    mt: 1,
                    overflow: "visible",
                }}
            >
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                >
                    Year
                </Typography>

                <Slider
                    min={0}
                    max={lastIndex}
                    step={1}
                    value={Math.min(currentIndex, lastIndex)}
                    onChange={(_, value) => {
                        setCurrentIndex(Number(value));
                    }}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(index) => {
                        const row = rows[index];

                        return (
                            row?.year ??
                            row?.age ??
                            row?.label ??
                            index
                        );
                    }}
                    marks={[
                        {
                            value: 0,
                            label: String(firstYear),
                        },
                        {
                            value: lastIndex,
                            label: String(lastYear),
                        },
                    ]}
                    sx={{
                        mt: 1,
                        mb: 2,
                        color: theme.palette.primary.main,
                    }}
                />
            </Box>

            <Box
                ref={chartContainerRef}
                sx={{
                    width: "100%",
                    height: {
                        xs: 760,
                        sm: 720,
                        md: 760,
                    },
                    mt: 0,
                    overflow: "visible",
                }}
            />

            <Typography variant="body2" color="text.secondary">
                Remaining portfolio:{" "}
                <strong>{formatMoney(chartData.endingBalance)}</strong>
            </Typography>
        </Box>
    );
}