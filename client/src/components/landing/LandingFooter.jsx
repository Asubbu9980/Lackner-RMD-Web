import { Link } from "react-router-dom";

export default function LandingFooter() {
  return (
    <footer className="llx-container llx-footer">
      <span>Lackner Group · Retirement Calculator</span>
      <nav className="llx-footer-links" aria-label="Footer">
        <Link className="llx-link" to="/dashboard/classic">
          Workspace
        </Link>
      </nav>
    </footer>
  );
}
