import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Bar,
  Cell,
} from "recharts";

const Candle2D = ({ data, isDark }) => {
  // =========================
  // MATCH 3D LOGIC
  // =========================

  const candleData = data.slice(0, 24).map((d, i) => {
    const base = (d.balance || d.endBalance || 0) / 100000;

    const open = base * (0.9 + Math.sin(i * 0.5) * 0.1);

    const close = base * (1.1 + Math.cos(i * 0.5) * 0.1);

    const high = Math.max(open, close) + 0.8;

    const low = Math.min(open, close) - 0.8;

    return {
      age: d.age,
      year: d.year,

      open,
      close,
      high,
      low,

      color: close > open ? "#10b981" : "#f43f5e",

      body: Math.abs(close - open),

      bodyBase: Math.min(open, close),
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={candleData}
        margin={{
          top: 20,
          right: 20,
          left: 20,
          bottom: 20,
        }}
      >
        {/* GRID */}

        <CartesianGrid strokeDasharray="3 3" />

        {/* X AXIS */}

        <XAxis dataKey="age" tick={{ fontSize: 12 }} />

        {/* Y AXIS */}

        <YAxis />

        {/* TOOLTIP */}
        <Tooltip
          cursor={{
            stroke: isDark ? "rgba(255,255,255,0.15)" : "rgba(15,23,42,0.12)",

            strokeWidth: 2,
          }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const d = payload[0].payload;

              return (
                <div
                  style={{
                    background: isDark ? "rgba(15,23,42,0.96)" : "#ffffff",

                    border: isDark
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "1px solid #d1d5db",

                    borderRadius: "14px",

                    padding: "14px",

                    color: isDark ? "#ffffff" : "#111827",

                    boxShadow: isDark
                      ? "0 10px 30px rgba(0,0,0,0.45)"
                      : "0 10px 30px rgba(0,0,0,0.12)",

                    minWidth: "150px",

                    backdropFilter: "blur(10px)",
                  }}
                >
                  {/* AGE */}

                  <p
                    style={{
                      margin: "0 0 10px 0",

                      fontWeight: 800,

                      color: isDark ? "#ffffff" : "#111827",
                    }}
                  >
                    Age: {d.age}
                  </p>

                  {/* OPEN */}

                  <p
                    style={{
                      margin: "0 0 6px 0",

                      color: "#0ea5e9",

                      fontWeight: 600,
                    }}
                  >
                    Open: {d.open.toFixed(2)}
                  </p>

                  {/* CLOSE */}

                  <p
                    style={{
                      margin: "0 0 6px 0",

                      color: "#22c55e",

                      fontWeight: 600,
                    }}
                  >
                    Close: {d.close.toFixed(2)}
                  </p>

                  {/* HIGH */}

                  <p
                    style={{
                      margin: "0 0 6px 0",

                      color: "#a855f7",

                      fontWeight: 600,
                    }}
                  >
                    High: {d.high.toFixed(2)}
                  </p>

                  {/* LOW */}

                  <p
                    style={{
                      margin: 0,

                      color: "#ef4444",

                      fontWeight: 600,
                    }}
                  >
                    Low: {d.low.toFixed(2)}
                  </p>
                </div>
              );
            }

            return null;
          }}
        />

        {/* WICKS */}

        <Bar dataKey="high" stackId="a" fill="transparent" />

        {/* BODY */}

        <Bar dataKey="body" stackId="a" radius={[4, 4, 0, 0]}>
          {candleData.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Bar>
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default Candle2D;
