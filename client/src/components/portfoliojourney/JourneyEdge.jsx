/* eslint-disable no-unused-vars */
import { memo } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
} from "@xyflow/react";
import { useTheme } from "@mui/material/styles";

function JourneyEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) {
  const theme = useTheme();

  const isDark = theme.palette.mode === "dark";

  const [path, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const stroke = data?.color || "#3b82f6";

  return (
    <>
      {/* Glow */}
      <BaseEdge
        path={path}
        style={{
          stroke,
          strokeWidth: 8,
          opacity: isDark ? 0.18 : 0.12,
          filter: `drop-shadow(0 0 10px ${stroke})`,
        }}
      />

      {/* Main Edge */}
      <BaseEdge
        path={path}
        style={{
          stroke,
          strokeWidth: 3,
          strokeDasharray: "8 6",
          animation: "dash 1.2s linear infinite",
        }}
      />

      <EdgeLabelRenderer>
        {data?.label && (
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,

              background: isDark
                ? "#111827"
                : "#ffffff",

              color: stroke,

              padding: "4px 10px",

              borderRadius: "999px",

              border: `1px solid ${stroke}`,

              fontWeight: 700,

              fontSize: 12,

              pointerEvents: "none",

              whiteSpace: "nowrap",

              boxShadow: "0 4px 16px rgba(0,0,0,.15)",
            }}
          >
            {data.label}
          </div>
        )}
      </EdgeLabelRenderer>

      <style>
        {`
          @keyframes dash{
              to{
                  stroke-dashoffset:-28;
              }
          }
        `}
      </style>
    </>
  );
}

export default memo(JourneyEdge);