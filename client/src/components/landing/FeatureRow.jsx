import { useRef } from "react";

import { Box } from "@mui/material";
import { Clapperboard, Receipt, TrendingUp } from "lucide-react";

import useReveal from "./useReveal";

const FEATURES = [
  {
    icon: TrendingUp,
    title: "Projection Engine",
    subtitle: "3D Visualization",
    body: "Model multi-decade balances and required distributions year by year, then explore them in interactive 3D.",
  },
  {
    icon: Receipt,
    title: "Tax Analysis",
    subtitle: "Withdrawal Insights",
    body: "See how each withdrawal is taxed and where the drag on the portfolio really comes from.",
  },
  {
    icon: Clapperboard,
    title: "Manim Rendering",
    subtitle: "Cinematic Workflow",
    body: "Turn a projection into a Manim-rendered, presentation-ready financial story.",
  },
];

const REVEAL = { threshold: 0.2, rootMargin: "0px 0px -8% 0px", once: true };

function FeatureCard({ feature, index }) {
  const ref = useRef(null);
  useReveal(ref, REVEAL);
  const Icon = feature.icon;

  return (
    <article
      ref={ref}
      className="llx-reveal llx-feature-wrap"
      style={{ "--d": `${index * 90}ms` }}
    >
      <div className="llx-feature">
        <div className="llx-feature-top">
          <span className="llx-feature-icon" aria-hidden="true">
            <Icon size={18} strokeWidth={1.75} />
          </span>
          <span className="llx-feature-num">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <h3 className="llx-feature-title">{feature.title}</h3>
        <p className="llx-feature-sub">{feature.subtitle}</p>
        <p className="llx-feature-body">{feature.body}</p>
      </div>
    </article>
  );
}

export default function FeatureRow() {
  const headRef = useRef(null);
  useReveal(headRef, REVEAL);

  return (
    <Box
      component="section"
      aria-labelledby="llx-features-title"
      className="llx-container llx-features"
      sx={{
        pt: { xs: "56px", md: "72px" },
        pb: { xs: "96px", lg: "140px" },
      }}
    >
      <div ref={headRef} className="llx-reveal llx-features-head">
        <span className="llx-eyebrow">What&rsquo;s inside</span>
        <h2 id="llx-features-title" className="llx-h2">
          Built for clarity, from projection to presentation.
        </h2>
      </div>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
          gap: { xs: "16px", md: "20px" },
        }}
      >
        {FEATURES.map((f, i) => (
          <FeatureCard key={f.title} feature={f} index={i} />
        ))}
      </Box>
    </Box>
  );
}
