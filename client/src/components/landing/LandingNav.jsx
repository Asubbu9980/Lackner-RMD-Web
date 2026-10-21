import { Link } from "react-router-dom";

import { Box } from "@mui/material";
import { ArrowRight } from "lucide-react";

import ThemeToggle from "./ThemeToggle";

export default function LandingNav() {
  return (
    <Box
      component="header"
      className="llx-container llx-nav"
      sx={{ pt: { xs: "20px", md: "28px" } }}
    >
      <Link to="/" className="llx-plate">
        <Box
          component="img"
          src="/LeimbergLeClairLackner_logo.png"
          alt="Leimberg LeClair Lackner home"
          className="llx-logo"
          sx={{
            display: "block",
            width: "auto",
            height: { xs: "18px", sm: "22px", md: "28px" },
          }}
        />
        <img src="/lackner.png" alt="Leimberg LeClair Lackner home" className="llx-mark" />
      </Link>

      <nav className="llx-nav-actions" aria-label="Primary">
        <Link to="/dashboard/classic" className="llx-cta llx-cta--nav">
          <span className="llx-cta-label">RMD Workspace</span>
          <ArrowRight className="llx-cta-arrow" size={15} aria-hidden="true" />
        </Link>
        <ThemeToggle />
      </nav>
    </Box>
  );
}
