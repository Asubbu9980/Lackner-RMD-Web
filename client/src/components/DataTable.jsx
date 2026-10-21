import useRmd from "../hooks/useRmd";

import { formatCurrency } from "../utils/format";

import {
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

import {
  Table2,
  TrendingUp,
} from "lucide-react";

const DataTable = () => {
  const { result } =
    useRmd();

  if (!result) return null;

  return (
    <Card
      sx={{
        position: "relative",

        overflow: "hidden",

        borderRadius: "var(--card-radius)",

        background:
          "var(--glass-bg)",

        backdropFilter:
          "blur(20px)",

        border:
          "1px solid var(--border-color)",

        boxShadow:
          "0 20px 60px rgba(0,0,0,0.16)",

        transition:
          "all 0.3s ease",
      }}
    >
      {/* =====================================
          GLOW
      ===================================== */}

      <Box
        sx={{
          position: "absolute",

          top: -120,
          right: -100,

          width: 260,
          height: 260,

          borderRadius: "50%",

          background:
            "rgba(34,211,238,0.08)",

          filter: "blur(80px)",

          pointerEvents: "none",
        }}
      />

      <CardContent
        sx={{
          position: "relative",
          zIndex: 2,

          p: { xs: 2, sm: 3 },
          "&:last-child": { pb: { xs: 2, sm: 3 } },
        }}
      >
        {/* =================================
            HEADER
        ================================= */}

        <Box
          sx={{
            display: "flex",

            alignItems: "center",

            justifyContent:
              "space-between",

            gap: 2,

            mb: { xs: 2, sm: 3 },
          }}
        >
          {/* LEFT */}

          <Box>
            <Box
              sx={{
                display: "inline-flex",

                alignItems:
                  "center",

                gap: 1,

                px: 1.5,
                py: 0.7,

                borderRadius:
                  "999px",

                border:
                  "1px solid rgba(34,211,238,0.2)",

                background:
                  "rgba(34,211,238,0.08)",

                mb: 2,
              }}
            >
              <TrendingUp
                size={14}
                color="#67e8f9"
              />

              <Typography
                sx={{
                  fontSize: 11,

                  textTransform:
                    "uppercase",

                  letterSpacing:
                    "0.18em",

                  fontWeight: 700,

                  color:
                    "#67e8f9",
                }}
              >
                Projection Data
              </Typography>
            </Box>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 900,

                letterSpacing:
                  "-0.03em",

                color:
                  "var(--text-primary)",
              }}
            >
              Detailed Projection
            </Typography>

            <Typography
              sx={{
                mt: 0.5,

                fontSize: "max(13px, 0.875rem)",

                color:
                  "var(--text-secondary)",
              }}
            >
              Backend-driven yearly
              RMD, tax and balance
              analytics
            </Typography>
          </Box>

          {/* RIGHT */}

          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              flexShrink: 0,

              width: 54,
              height: 54,

              borderRadius:
                "18px",

              alignItems:
                "center",

              justifyContent:
                "center",

              background:
                "linear-gradient(135deg, #06b6d4, #2563eb)",

              boxShadow:
                "0 0 30px rgba(0,212,255,0.28)",
            }}
          >
            <Table2
              size={24}
              color="white"
            />
          </Box>
        </Box>

        {/* =================================
            TABLE WRAPPER
        ================================= */}

        <Box
          sx={{
            overflowX: "auto",

            overflowY: "auto",

            maxHeight: { xs: 460, md: 520 },

            borderRadius:
              { xs: "18px", sm: "24px" },

            // swipe sideways inside the card, never the page
            overscrollBehaviorX: "contain",

            "& table": {
              minWidth: { xs: 520, md: 900 },
            },

            // fixed column widths only where there's room for them
            "& th": {
              width: { md: "180px" },
            },
            "& th:nth-of-type(1)": { width: { md: "120px" } },
            "& th:nth-of-type(2)": { width: { md: "100px" } },
            "& th:nth-of-type(5)": { width: { md: "260px" } },

            "& th, & td": {
              padding: { xs: "14px 14px", md: "18px 20px" },
              whiteSpace: "nowrap",
            },

            // year stays pinned while the money columns scroll
            "& tbody td:first-of-type": {
              position: "sticky",
              left: 0,
              zIndex: 1,
              background: "var(--bg-secondary)",
            },

            "& thead th:first-of-type": {
              position: "sticky",
              left: 0,
              zIndex: 6,
            },

            border:
              "1px solid var(--border-color)",

            background:
              "var(--bg-secondary)",

            "&::-webkit-scrollbar":
            {
              width: 10,
              height: 10,
            },

            "&::-webkit-scrollbar-thumb":
            {
              background:
                "rgba(100,116,139,0.5)",

              borderRadius:
                "999px",
            },
          }}
        >
          <table
            style={{
              width: "100%",

              borderCollapse:
                "separate",

              borderSpacing: 0,

            }}
          >
            {/* =================================
                HEADER
            ================================= */}

            <thead
              style={{
                position:
                  "sticky",

                top: 0,

                zIndex: 5,
              }}
            >
              <tr
                style={{
                  background:
                    "var(--hover-bg)",
                  borderTopLeftRadius: "24px",
                  borderTopRightRadius: "24px",
                  overflow: "hidden",

                  backdropFilter:
                    "blur(12px)",
                }}
              >
                {[
                  "Year",
                  "Age",
                  "RMD",
                  "Tax",
                  "Ending Balance",
                ].map(
                  (
                    head,
                    i
                  ) => (
                    <th
                      key={i}
                      style={{
                        borderTopLeftRadius:
                          i === 0 ? "24px" : 0,

                        borderTopRightRadius:
                          i === 4 ? "24px" : 0,

                        textAlign:
                          head === "Year" || head === "Age"
                            ? "center"
                            : "right",

                        fontSize:
                          "12px",

                        textTransform:
                          "uppercase",

                        letterSpacing:
                          "0.18em",

                        fontWeight: 700,

                        color:
                          "var(--text-secondary)",

                        borderBottom:
                          "1px solid var(--border-color)",

                        background:
                          "var(--hover-bg)",
                      }}
                    >
                      {head}
                    </th>
                  )
                )}
              </tr>
            </thead>

            {/* =================================
                BODY
            ================================= */}

            <tbody>
              {result.rows.map(
                (
                  r,
                  i
                ) => (
                  <tr
                    key={i}
                    style={{
                      transition:
                        "all 0.25s ease",

                      background:
                        i % 2 === 0
                          ? "transparent"
                          : "rgba(255,255,255,0.01)",
                    }}
                    onMouseEnter={(
                      e
                    ) => {
                      e.currentTarget.style.background =
                        "rgba(34,211,238,0.05)";
                    }}
                    onMouseLeave={(
                      e
                    ) => {
                      e.currentTarget.style.background =
                        i % 2 ===
                          0
                          ? "transparent"
                          : "rgba(255,255,255,0.01)";
                    }}
                  >
                    {/* YEAR */}

                    <td
                      style={{
                        borderBottom:
                          "1px solid var(--border-color)",

                        color:
                          "var(--text-primary)",

                        fontWeight: 700,
                        textAlign: "center",
                      }}
                    >
                      {r.year}
                    </td>

                    {/* AGE */}

                    <td
                      style={{
                        borderBottom:
                          "1px solid var(--border-color)",

                        color:
                          "var(--text-primary)",

                        fontWeight: 600,
                        textAlign: "center",
                      }}
                    >
                      {r.age}
                    </td>

                    {/* RMD */}

                    <td
                      style={{
                        borderBottom:
                          "1px solid var(--border-color)",

                        color:
                          "var(--rmd-color, #8b5cf6)",

                        fontWeight: 700,
                        textAlign: "right",
                        fontVariantNumeric:
                          "tabular-nums",
                      }}
                    >
                      {formatCurrency(
                        r.rmd
                      )}
                    </td>

                    {/* TAX */}

                    <td
                      style={{
                        borderBottom:
                          "1px solid var(--border-color)",

                        color:
                          "var(--tax-color, #ef4444)",

                        fontWeight: 700,
                        textAlign: "right",

                        fontVariantNumeric:
                          "tabular-nums",
                      }}
                    >
                      {formatCurrency(
                        r.tax
                      )}
                    </td>

                    {/* BALANCE */}

                    <td
                      style={{
                        borderBottom:
                          "1px solid var(--border-color)",

                        color:
                          "var(--text-primary)",

                        fontWeight: 900,
                        fontSize: "max(15px, 1rem)",
                        letterSpacing: "-0.02em",

                        fontVariantNumeric:
                          "tabular-nums",
                        textAlign: "right",
                      }}
                    >
                      {formatCurrency(
                        r.endBalance
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DataTable;