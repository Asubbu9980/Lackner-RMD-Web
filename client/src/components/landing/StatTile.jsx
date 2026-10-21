import { useRef } from "react";

import useCountUp from "./useCountUp";

export default function StatTile({
  label,
  target,
  decimals = 0,
  format,
  unit,
  srText,
  color,
  delay = 0,
  start,
  index = 0,
}) {
  const valueRef = useRef(null);
  useCountUp(valueRef, { target, decimals, format, delay, start });

  return (
    <div className="llx-stat" style={{ "--llx-stat-color": color, "--si": index }}>
      <div className="llx-stat-label">{label}</div>
      <div className="llx-stat-value">
        <span ref={valueRef} aria-hidden="true" />
        {unit && (
          <span className="llx-stat-unit" aria-hidden="true">
            {unit}
          </span>
        )}
        <span className="llx-sr">{srText}</span>
      </div>
    </div>
  );
}
