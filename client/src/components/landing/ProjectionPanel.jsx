import { useEffect, useRef, useState } from "react";

import { Box } from "@mui/material";
import { CalendarClock, Mountain } from "lucide-react";

import CascadeFlow3D from "../CascadeFlow3D";
import ErrorBoundary from "../ErrorBoundary";
import StatTile from "./StatTile";
import { SAMPLE_ROWS, SAMPLE_SUMMARY } from "./sampleProjection";
import useReveal, { supportsIntersectionObserver } from "./useReveal";
import usePrefersReducedMotion from "./usePrefersReducedMotion";

const money = (v) =>
  v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(2)}M` : `$${(v / 1000).toFixed(1)}K`;

const STATS = [
  {
    label: "Total RMDs",
    target: SAMPLE_SUMMARY.totalRmd / 1_000_000,
    decimals: 2,
    format: (v) => `$${v.toFixed(2)}M`,
    srText: `${money(SAMPLE_SUMMARY.totalRmd)} in total RMDs`,
    color: "var(--llx-positive)",
  },
  {
    label: "Tax Drain",
    target: SAMPLE_SUMMARY.totalTax / 1000,
    format: (v) => `$${Math.round(v)}K`,
    srText: `${money(SAMPLE_SUMMARY.totalTax)} in taxes`,
    color: "var(--llx-negative)",
  },
  {
    label: "Projection",
    target: SAMPLE_SUMMARY.years,
    format: (v) => `${Math.round(v)}`,
    unit: "Years",
    srText: `${SAMPLE_SUMMARY.years} years`,
    color: "var(--llx-accent)",
  },
];

const { firstRmd, peak } = SAMPLE_SUMMARY;

export default function ProjectionPanel() {
  const panelRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  const revealed = useReveal(panelRef, { threshold: 0.35, once: true });
  // Non-latching: pauses the 3D render loop and the halo while off screen.
  const inView = useReveal(panelRef, { threshold: 0, once: false, attribute: "data-inview" });

  const [minDelayDone, setMinDelayDone] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setMinDelayDone(true), 700);
    return () => clearTimeout(id);
  }, []);

  const play =
    reduced || !supportsIntersectionObserver() || (revealed && minDelayDone);

  return (
    <Box
      ref={panelRef}
      className="llx-panel"
      data-play={play ? "true" : "false"}
      sx={{
        width: "100%",
        minWidth: 0,
        maxWidth: { xs: 640, lg: "none" },
        mx: { xs: "auto", lg: 0 },
      }}
    >
      <div className="llx-panel-float">
        <Box className="llx-card" sx={{ p: { xs: "14px", sm: "18px", md: "22px" } }}>
          <div className="llx-card-head">
            <div>
              <h2 className="llx-card-title">Projection Workspace</h2>
              <p className="llx-card-sub">Interactive 3D wealth projection</p>
            </div>
            <span className="llx-pill">
              <span className="llx-live" aria-hidden="true" />
              Interactive 3D
            </span>
          </div>

          {/* same 3D scene as the dashboard's Projection chart, on sample data */}
          <div
            className="llx-stage"
            role="img"
            aria-label={`Sample 3D projection: balance grows to ${money(peak.endBalance)} at age ${peak.age}, then RMDs draw it down over ${SAMPLE_SUMMARY.years} years.`}
          >
            <div className="llx-stage-placeholder" aria-hidden="true" />
            {play && (
              <ErrorBoundary>
                <CascadeFlow3D
                  rows={SAMPLE_ROWS}
                  showLegend={false}
                  interactive={false}
                  frameloop={inView ? "always" : "never"}
                />
              </ErrorBoundary>
            )}

            <ul className="llx-stage-legend" aria-hidden="true">
              <li><span className="llx-key llx-key--stream" />Wealth stream</li>
              <li><span className="llx-key llx-key--milestone" />Milestones</li>
            </ul>
          </div>

          <div className="llx-stats">
            {STATS.map((s, i) => (
              <StatTile key={s.label} {...s} index={i} start={play} delay={500 + i * 120} />
            ))}
          </div>

          <p className="llx-caption">Illustrative sample · not client data</p>
        </Box>

        {/* floating milestone chips (wide screens) */}
        <div className="llx-float-chip llx-float-chip--a" aria-hidden="true">
          <span className="llx-float-icon"><CalendarClock size={16} /></span>
          <span>
            <span className="llx-float-label">First RMD · Age {firstRmd.age}</span>
            <span className="llx-float-value">{money(firstRmd.rmd)}</span>
          </span>
        </div>

        <div className="llx-float-chip llx-float-chip--b" aria-hidden="true">
          <span className="llx-float-icon llx-float-icon--peak"><Mountain size={16} /></span>
          <span>
            <span className="llx-float-label">Peak balance · Age {peak.age}</span>
            <span className="llx-float-value">{money(peak.endBalance)}</span>
          </span>
        </div>
      </div>
    </Box>
  );
}
