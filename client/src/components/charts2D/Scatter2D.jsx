import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";


const Scatter2D = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        {/* GRID */}

        <CartesianGrid
          strokeDasharray="3 3"
        />

        {/* X AXIS */}

        <XAxis
          type="number"
          dataKey="x"
          name="Age"
          tick={{ fontSize: 12 }}
        />

        {/* Y AXIS */}

        <YAxis
          type="number"
          dataKey="y"
          name="Value"
          tickFormatter={(v) =>
            `$${(v / 1000).toFixed(0)}k`
          }
        />

        {/* TOOLTIP */}
<Tooltip
  cursor={{
    strokeDasharray: "3 3",
  }}
  content={({ active, payload }) => {
    if (
      active &&
      payload &&
      payload.length
    ) {
      const point =
        payload[0].payload;

      return (
        <div
          style={{
            background: "#ffffff",
            border:
              "1px solid #d1d5db",
            padding: "12px",
            borderRadius: "8px",
            boxShadow:
              "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          {/* AGE */}

          <p
            style={{
              margin: 0,
              color: "#0f172a",
              fontWeight: 600,
            }}
          >
            Age: {point.x}
          </p>

          {/* VALUE */}

          <p
            style={{
              marginTop: 8,
              marginBottom: 0,
              color:
                payload[0].color,
              fontWeight: 600,
            }}
          >
            {payload[0].payload.series}: $
            {Math.round(
              point.y
            ).toLocaleString()}
          </p>
        </div>
      );
    }

    return null;
  }}
/>

        {/* LEGEND */}

        <Legend />

        {/* ======================
            RMD
        ====================== */}

        <Scatter
          name="RMD"
          fill="#a855f7"
         data={data.map((d) => ({
  x: d.age,
  y: d.rmd,
  series: "RMD",
}))}
        />

        {/* ======================
            TAX
        ====================== */}

        <Scatter
          name="Tax"
          fill="#ef4444"
          data={data.map((d) => ({
            x: d.age,
            y: d.tax,
            series: "Tax",
          }))}
        />

        {/* ======================
            GROWTH
        ====================== */}

        <Scatter
          name="Growth"
          fill="#10b981"
          data={data.map((d) => ({
            x: d.age,
            y: d.growth,
            series: "Growth",
          }))}
        />
      </ScatterChart>
    </ResponsiveContainer>
    
  );
};

export default Scatter2D;