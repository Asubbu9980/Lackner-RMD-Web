import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

import { Typography } from "@mui/material";

const Bar2D = ({ data, formatCurrency }) => {
return (
 
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          dataKey="label"
          tick={{ fontSize: 10 }}
        />

        <YAxis
          tickFormatter={(v) =>
            `$${(v / 1000).toFixed(0)}k`
          }
        />

        <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const d = payload[0].payload;

                return (
                  <div
                    style={{
                      background: "rgba(15,23,42,0.96)",

                      border: "1px solid rgba(255,255,255,0.08)",

                      borderRadius: "14px",

                      padding: "14px",

                      color: "#ffffff",

                      boxShadow: "0 10px 30px rgba(0,0,0,0.45)",

                      minWidth: "180px",

                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 800,

                        mb: 1,

                        color: "#f7f4f4",
                      }}
                    >
                      Age {d.age}
                    </Typography>
                    {/* BALANCE */}

                    <p
                      style={{
                        margin: "0 0 10px 0",

                        color: "#0ea5e9",

                        fontWeight: 700,
                      }}
                    >
                      balance : {formatCurrency(d.balance)}
                    </p>

                    {/* GROWTH */}

                    <p
                      style={{
                        margin: "0 0 10px 0",

                        color: "#22c55e",

                        fontWeight: 700,
                      }}
                    >
                      growth : {formatCurrency(d.growth)}
                    </p>

                    {/* RMD */}

                    <p
                      style={{
                        margin: "0 0 10px 0",

                        color: "#a855f7",

                        fontWeight: 700,
                      }}
                    >
                      rmd : {formatCurrency(d.rmd)}
                    </p>

                    {/* TAX */}

                    <p
                      style={{
                        margin: 0,

                        color: "#ef4444",

                        fontWeight: 700,
                      }}
                    >
                      tax : {formatCurrency(d.tax)}
                    </p>
                  </div>
                );
              }

              return null;
            }}
          />

        <Legend />

        <Bar dataKey="rmd" fill="#7c3aed" />
        <Bar dataKey="tax" fill="#ef4444" />
        <Bar dataKey="growth" fill="#22c55e" />
      </BarChart>
    </ResponsiveContainer>
   
  );
};

export default Bar2D;