/* eslint-disable no-unused-vars */
import { Box, Typography, Tooltip } from "@mui/material";
import { useThemeContext } from "../context/ThemeContext";





export default function Waterfall2D({ rows = [] }) {
    

    const { mode } = useThemeContext();

    const isDark = mode === "dark";
    if (!rows.length) return null;

    const COLORS = {
        principal: "#558E28",

        growthCurrent: "#86CD4D",
        growthPrior: isDark
            ? "#d9eec7"
            : "#b7d59a",

        rmdCurrent: "#722CFD",
        rmdPrior: isDark
            ? "#ddd0ff"
            : "#b8a7f0",

        taxCurrent: "#DD2067",
        taxPrior: isDark
            ? "#EF8FB3"
            : "#df7da5",
    };

    const startBalance = rows[0].beginBalance;

    return (
        <Box
            sx={{
                height: "100%",
                overflowY: "auto",
                px: 2,
                py: 1,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 2,
                    px: 1,
                }}
            >
                {[
                    [COLORS.principal, "Principal"],


                    [COLORS.rmdCurrent, "Current RMD"],
                    [COLORS.rmdPrior, "Prior RMD"],


                    [COLORS.taxCurrent, "Current Tax"],
                    [COLORS.taxPrior, "Prior Tax"],


                    [COLORS.growthCurrent, "Current Growth"],
                    [COLORS.growthPrior, "Prior Growth"],
                ].map(([color, label]) => (
                    <Box
                        key={label}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <Box
                            sx={{
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                background: color,
                            }}
                        />
                        <Typography
                            sx={{
                                fontSize: 11,
                                color: isDark ? "#94a3b8" : "#475569",
                                fontWeight: 600,
                            }}
                        >
                            {label}
                        </Typography>
                    </Box>
                ))}
            </Box>
            {rows.map((r) => {
                const principal =
                    (r.endBalance / startBalance) * 100;
                const growthCurrent =
                    (r.growth / startBalance) * 100;

                const growthPrior =
                    ((r.cumGrowth - r.growth) /
                        startBalance) *
                    100;

                const rmdCurrent =
                    (r.rmd / startBalance) * 100;

                const rmdPrior =
                    ((r.cumRmd - r.rmd) /
                        startBalance) *
                    100;

                const taxCurrent =
                    (r.tax / startBalance) * 100;

                const taxPrior =
                    ((r.cumTax - r.tax) /
                        startBalance) *
                    100;

                const SCALE = 350;

                const used =
                    principal +
                    growthCurrent +
                    growthPrior +
                    rmdCurrent +
                    rmdPrior +
                    taxCurrent +
                    taxPrior;

                const remaining = Math.max(
                    SCALE - used,
                    0
                );
                const segments = [
                    {
                        value: principal,
                        color: COLORS.principal,
                    },


                    {
                        value: rmdCurrent,
                        color: COLORS.rmdCurrent,
                    },


                    {
                        value: rmdPrior,
                        color: COLORS.rmdPrior,
                    },

                    {
                        value: taxCurrent,
                        color: COLORS.taxCurrent,
                    },

                    {
                        value: taxPrior,
                        color: COLORS.taxPrior,
                    },

                    {
                        value: growthCurrent,
                        color: COLORS.growthCurrent,
                    },

                    {
                        value: growthPrior,
                        color: COLORS.growthPrior,
                    },
                ];

                // {
                //     value: remaining,
                //     color: COLORS.remaining,
                // },


                return (
                    <Tooltip
                        key={r.year}
                        arrow
                        slotProps={{
                            tooltip: {
                                sx: {
                                    bgcolor: isDark
                                        ? "rgba(15,23,42,0.98)"
                                        : "#ffffff",

                                    color: isDark
                                        ? "#ffffff"
                                        : "#0f172a",

                                    border: isDark
                                        ? "1px solid rgba(255,255,255,0.08)"
                                        : "1px solid rgba(15,23,42,0.08)",

                                    borderRadius: "16px",

                                    boxShadow: isDark
                                        ? "0 20px 50px rgba(0,0,0,0.45)"
                                        : "0 20px 50px rgba(0,0,0,0.12)",

                                    minWidth: 250,
                                    backdropFilter: "blur(12px)",
                                    p: 2,
                                },
                            },
                        }}

                        title={
                            <Box
                                sx={{
                                    minWidth: 200,
                                    p: 1,
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 800,
                                        fontSize: 18,
                                        mb: 1,
                                        color: isDark
                                            ? "#ffffff"
                                            : "#0f172a",
                                    }}
                                >
                                    Calendar {r.year} • Age {r.age}
                                </Typography>

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        mb: 1,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            color: isDark
                                                ? "#ffffff"
                                                : "#0f172a",
                                            fontSize: 14,
                                            fontWeight: 600,
                                        }}
                                    >
                                        Begin Balance:
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color: COLORS.principal,
                                            fontSize: 14,
                                            fontWeight: 800,
                                        }}
                                    >
                                        ${Math.round(r.beginBalance).toLocaleString()}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        mb: 1,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            color: isDark
                                                ? "#ffffff"
                                                : "#0f172a",
                                            fontSize: 14,
                                            fontWeight: 600,
                                        }}
                                    >
                                        RMD:
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color: COLORS.rmdCurrent,
                                            fontSize: 14,
                                            fontWeight: 800,
                                        }}
                                    >
                                        ${Math.round(r.rmd).toLocaleString()}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        mb: 1,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            color: isDark
                                                ? "#ffffff"
                                                : "#0f172a",
                                            fontSize: 14,
                                            fontWeight: 600,
                                        }}
                                    >
                                        Tax:
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color: COLORS.taxCurrent,
                                            fontSize: 14,
                                            fontWeight: 800,
                                        }}
                                    >
                                        ${Math.round(r.tax).toLocaleString()}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        mb: 1,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            color: isDark
                                                ? "#ffffff"
                                                : "#0f172a",
                                            fontSize: 14,
                                            fontWeight: 600,
                                        }}
                                    >
                                        Growth:
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color: COLORS.growthCurrent,
                                            fontSize: 14,
                                            fontWeight: 800,
                                        }}
                                    >
                                        ${Math.round(r.growth).toLocaleString()}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        mb: 1,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            color: isDark
                                                ? "#ffffff"
                                                : "#0f172a",
                                            fontSize: 14,
                                            fontWeight: 600,
                                        }}
                                    >
                                        End Balance:
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color: isDark ? "#ffffff" : "#000000",
                                            fontSize: 14,
                                            fontWeight: 800,
                                        }}
                                    >
                                        ${Math.round(r.endBalance).toLocaleString()}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        borderTop:
                                            "1px solid rgba(255,255,255,0.1)",
                                        pt: 1,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            mb: 1,
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: isDark
                                                    ? "#ffffff"
                                                    : "#0f172a",
                                                fontSize: 14,
                                                fontWeight: 600,
                                            }}
                                        >
                                            Cum RMD:
                                        </Typography>

                                        <Typography
                                            sx={{
                                                color: COLORS.rmdPrior,
                                                fontSize: 14,
                                                fontWeight: 800,
                                            }}
                                        >
                                            ${Math.round(r.cumRmd).toLocaleString()}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            mb: 1,
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: isDark
                                                    ? "#ffffff"
                                                    : "#0f172a",
                                                fontSize: 14,
                                                fontWeight: 600,
                                            }}
                                        >
                                            Cum Tax:
                                        </Typography>

                                        <Typography
                                            sx={{
                                                color: COLORS.taxPrior,
                                                fontSize: 14,
                                                fontWeight: 800,
                                            }}
                                        >
                                            ${Math.round(r.cumTax).toLocaleString()}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        }
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 0.6,
                                gap: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 70,
                                    color: isDark ? "#94a3b8" : "#475569",
                                    fontWeight: 600,
                                    textAlign: "right",
                                    fontSize: 12,
                                }}
                            >
                                {r.year}
                            </Box>

                            <Box
                                sx={{
                                    flex: 1,
                                    height: 14,
                                    display: "flex",
                                    borderRadius: "999px",
                                    overflow: "hidden",
                                    background:
                                        "rgba(255,255,255,0.04)",
                                    border:
                                        "1px solid rgba(255,255,255,0.05)",
                                }}
                            >
                                {segments.map((s, idx) => (
                                    <Box
                                        key={idx}
                                        sx={{
                                            width: `${(s.value / 350) * 100}%`,
                                            background: s.color,
                                        }}
                                    />
                                ))}
                            </Box>

                            <Box
                                sx={{
                                    width: 120,
                                    textAlign: "right",
                                    fontWeight: 800,
                                    color: "var(--text-primary)",
                                    fontSize: 13,
                                    fontVariantNumeric:
                                        "tabular-nums",
                                }}
                            >
                                $
                                {Math.round(
                                    r.endBalance
                                ).toLocaleString()}
                            </Box>
                        </Box>
                    </Tooltip >
                );
            })}
        </Box >
    );
}