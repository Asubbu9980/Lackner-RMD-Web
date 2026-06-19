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

        borderRadius: "30px",

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

          p: 3,
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

            mb: 3,
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

                fontSize: 13,

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
              width: 54,
              height: 54,

              borderRadius:
                "18px",

              display: "flex",

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

            maxHeight: 520,

            borderRadius:
              "24px",

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

              minWidth: "900px",
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
                        padding:
                          "18px 20px",

                        textAlign:
                          "left",

                        fontSize:
                          "12px",

                        textTransform:
                          "uppercase",

                        letterSpacing:
                          "0.14em",

                        fontWeight: 800,

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
                        padding:
                          "18px 20px",

                        borderBottom:
                          "1px solid var(--border-color)",

                        color:
                          "var(--text-primary)",

                        fontWeight: 700,
                        textAlign: "left",
                      }}
                    >
                      {r.year}
                    </td>

                    {/* AGE */}

                    <td
                      style={{
                        padding:
                          "18px 20px",

                        borderBottom:
                          "1px solid var(--border-color)",

                        color:
                          "var(--text-primary)",

                        fontWeight: 600,
                        textAlign: "left",
                      }}
                    >
                      {r.age}
                    </td>

                    {/* RMD */}

                    <td
                      style={{
                        padding:
                          "18px 20px",

                        borderBottom:
                          "1px solid var(--border-color)",

                        color:
                          "#8b5cf6",

                        fontWeight: 700,
                        textAlign: "left",
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
                        padding:
                          "18px 20px",

                        borderBottom:
                          "1px solid var(--border-color)",

                        color:
                          "#ef4444",

                        fontWeight: 700,
                        textAlign: "left",

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
                        padding:
                          "18px 20px",

                        borderBottom:
                          "1px solid var(--border-color)",

                        color:
                          "var(--text-primary)",

                        fontWeight: 800,

                        fontVariantNumeric:
                          "tabular-nums",
                        textAlign: "left",
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