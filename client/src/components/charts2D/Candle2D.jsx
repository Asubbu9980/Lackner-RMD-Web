import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Bar,
} from "recharts";

import { toCandles } from "../../utils/candles";
import { formatCurrency, formatCompact } from "../../utils/format";

// One candle per year. The bar spans low → high (the wick); the body is drawn
// inside it from open → close using the same pixels-per-dollar scale.
const CandleShape = ({ x, y, width, height, payload }) => {
  if (!payload || !height) return null;

  const { open, close, high, low, color } = payload;
  const k = height / Math.max(high - low, 1);
  const bodyTop = y + (high - Math.max(open, close)) * k;
  const bodyHeight = Math.max(Math.abs(close - open) * k, 2);
  const bodyWidth = Math.max(Math.min(width * 0.7, 18), 3);
  const cx = x + width / 2;

  return (
    <g>
      <line x1={cx} x2={cx} y1={y} y2={y + height} stroke={color} strokeWidth={1.5} />
      <rect x={cx - bodyWidth / 2} y={bodyTop} width={bodyWidth} height={bodyHeight} rx={2} fill={color} />
    </g>
  );
};

const Row = ({ label, value, color }) => (
  <p style={{ margin: "0 0 6px 0", color, fontWeight: 600 }}>
    {label}: {formatCurrency(value)}
  </p>
);

const Candle2D = ({ data, isDark }) => {
  // every projected year, from the real balances (same maths as the 3D chart)
  const candleData = toCandles(data);

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

        <YAxis tickFormatter={formatCompact} tick={{ fontSize: 12 }} width={64} />

        {/* TOOLTIP */}
        <Tooltip
          cursor={{
            fill: isDark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.05)",
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

                    minWidth: "190px",

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
                    Age {d.age} · {d.year}
                  </p>

                  <Row label="Opening balance" value={d.open} color="#0ea5e9" />
                  <Row label="RMD withdrawn" value={d.rmd} color="#a855f7" />
                  <Row label="Growth" value={d.growth} color="#22c55e" />
                  <Row label="Closing balance" value={d.close} color={d.color} />
                </div>
              );
            }

            return null;
          }}
        />

        {/* CANDLES — range bar low → high with a custom wick + body */}

        <Bar
          dataKey={(d) => [d.low, d.high]}
          shape={<CandleShape />}
          isAnimationActive
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default Candle2D;
