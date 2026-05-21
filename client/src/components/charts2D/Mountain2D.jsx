import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const Mountain2D = ({
  data,
  isDark,
  formatCurrency,
}) => {
  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
    >
      <AreaChart data={data}>
        {/* GRADIENT */}

        <defs>
          <linearGradient
            id="balance"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="5%"
              stopColor="#0ea5e9"
              stopOpacity={0.8}
            />

            <stop
              offset="95%"
              stopColor="#0ea5e9"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>

        {/* GRID */}

        <CartesianGrid
          strokeDasharray="3 3"
          stroke={
            isDark
              ? "rgba(255,255,255,0.08)"
              : "#d1d5db"
          }
        />

        {/* X AXIS */}

        <XAxis
          dataKey="year"
          tick={{
            fill: isDark
              ? "#cbd5e1"
              : "#475569",

            fontSize: 11,
          }}
        />

        {/* Y AXIS */}

        <YAxis
          tick={{
            fill: isDark
              ? "#cbd5e1"
              : "#475569",

            fontSize: 11,
          }}
          tickFormatter={(v) =>
            `$${(v / 1000).toFixed(0)}k`
          }
        />

        {/* TOOLTIP */}

        <Tooltip
          cursor={{
            stroke: isDark
              ? "rgba(255,255,255,0.15)"
              : "rgba(15,23,42,0.12)",

            strokeWidth: 2,
          }}
          content={({
            active,
            payload,
          }) => {
            if (
              active &&
              payload &&
              payload.length
            ) {
              const d =
                payload[0].payload;

              return (
                <div
                  style={{
                    background: isDark
                      ? "rgba(15,23,42,0.96)"
                      : "#ffffff",

                    border: isDark
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "1px solid #d1d5db",

                    borderRadius:
                      "14px",

                    padding: "14px",

                    color: isDark
                      ? "#ffffff"
                      : "#111827",

                    boxShadow: isDark
                      ? "0 10px 30px rgba(0,0,0,0.45)"
                      : "0 10px 30px rgba(0,0,0,0.12)",

                    minWidth: "180px",

                    backdropFilter:
                      "blur(10px)",
                  }}
                >
                  {/* YEAR */}

                  <p
                    style={{
                      margin:
                        "0 0 10px 0",

                      fontWeight: 800,

                      color: isDark
                        ? "#ffffff"
                        : "#111827",
                    }}
                  >
                    Year: {d.year}
                  </p>

                  {/* BALANCE */}

                  <p
                    style={{
                      margin: 0,

                      color: "#0ea5e9",

                      fontWeight: 700,
                    }}
                  >
                    Balance:{" "}
                    {formatCurrency(
                      d.balance
                    )}
                  </p>
                </div>
              );
            }

            return null;
          }}
        />

        {/* AREA */}

        <Area
          type="monotone"
          dataKey="balance"
          stroke="#0ea5e9"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#balance)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default Mountain2D;