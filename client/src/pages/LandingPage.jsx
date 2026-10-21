import { useLayoutEffect, useRef } from "react";

import { Box } from "@mui/material";

import AuroraBackdrop from "../components/landing/AuroraBackdrop";
import LandingNav from "../components/landing/LandingNav";
import HeroCopy from "../components/landing/HeroCopy";
import ProjectionPanel from "../components/landing/ProjectionPanel";
import FeatureRow from "../components/landing/FeatureRow";
import LandingFooter from "../components/landing/LandingFooter";

import "./landing.css";

/**
 * "Quiet Ledger" home page: nav, hero (copy + projection panel), feature row
 * and footer, each in its own container. Hidden initial states for entrance
 * and reveal animations are scoped under .llx-js, which is only added once JS
 * runs, so the page is fully visible without it.
 */
export default function LandingPage() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    root?.classList.add("llx-js");
    return () => root?.classList.remove("llx-js");
  }, []);

  return (
    <div ref={rootRef} className="llx-landing">
      <AuroraBackdrop />

      <LandingNav />

      <main>
        <Box
          component="section"
          aria-labelledby="llx-hero-title"
          className="llx-container llx-hero"
          sx={{
            pt: { xs: "48px", md: "72px", lg: "96px" },
            pb: { xs: "72px", md: "96px", lg: "120px" },
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "minmax(0, 1.05fr) minmax(0, 0.95fr)",
            },
            rowGap: "48px",
            columnGap: { lg: "72px" },
            alignItems: { lg: "center" },
            "& > *": { minWidth: 0 },
          }}
        >
          <HeroCopy />
          <ProjectionPanel />
        </Box>

        <FeatureRow />
      </main>

      <LandingFooter />
    </div>
  );
}
