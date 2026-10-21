const META = ["RMD modeling", "Tax-aware withdrawals", "Cinematic renders"];

export default function HeroCopy() {
  return (
    <div className="llx-hero-copy">
      <div className="llx-eyebrow-row">
        <span className="llx-rule" aria-hidden="true" />
        <span className="llx-eyebrow llx-eyebrow-text">
          RMD · Retirement Analytics
        </span>
      </div>

      <h1
        id="llx-hero-title"
        className="llx-h1"
        aria-label="Retirement Calculator Reimagined"
      >
        <span className="llx-line llx-line--1" aria-hidden="true">
          <span className="llx-line-inner">Retirement Calculator</span>
        </span>
        <span className="llx-line llx-line--2" aria-hidden="true">
          <span className="llx-line-inner">
            <em className="llx-accent">Reimagined.</em>
            <span className="llx-underline" />
          </span>
        </span>
      </h1>

      <p className="llx-lede">
        Interactive retirement analytics, RMD projection modeling, and
        Manim-powered cinematic financial storytelling — designed for modern
        portfolio visualization workflows.
      </p>

      <ul className="llx-meta" aria-label="Highlights">
        {META.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
    </div>
  );
}
