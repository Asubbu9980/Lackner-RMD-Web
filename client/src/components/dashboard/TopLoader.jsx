import { Box, Fade, LinearProgress, useMediaQuery } from "@mui/material";

import useRmd from "../../hooks/useRmd";

const GRADIENT = "linear-gradient(90deg, #a855f7 0%, #6366f1 50%, #22d3ee 100%)";

// Gradient progress line along the bottom edge of the navbar. Shows from the
// moment an input changes until the recalculated result arrives.
const TopLoader = () => {
  const { calculating } = useRmd();
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    <Fade in={calculating} timeout={{ enter: 150, exit: 450 }} unmountOnExit>
      <Box
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: -1,
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        <LinearProgress
          aria-label="Calculating"
          // reduced motion: a still, full gradient line instead of the sweep
          variant={reduceMotion ? "determinate" : "indeterminate"}
          value={100}
          sx={{
            height: 4,
            backgroundColor: "rgba(139, 92, 246, 0.16)",
            "& .MuiLinearProgress-bar": {
              background: GRADIENT,
              borderRadius: 4,
              boxShadow: "0 0 10px rgba(139, 92, 246, 0.55)",
            },
          }}
        />
      </Box>
    </Fade>
  );
};

export default TopLoader;
