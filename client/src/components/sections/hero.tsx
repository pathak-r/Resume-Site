import CvPreviewButton from "@/components/cv-preview";

export default function Hero() {
  return (
    <section
      data-testid="section-hero"
      style={{
        background: "transparent",
        color: "var(--cat-text)",
        WebkitFontSmoothing: "antialiased",
        padding: "calc(56px + 2.75rem) 1.5rem 1.75rem",
      }}
    >
      <div className="hero-pm-strip">
        <h1
          className="hero-pm-title"
          style={{
            margin: "0 0 0.75rem",
            fontSize: "clamp(2rem, 5vw, 3.1rem)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            color: "var(--cat-text)",
            fontFamily: "var(--cat-font)",
            maxWidth: "18ch",
          }}
          data-testid="text-hero-headline"
        >
          PM for capital projects: refineries, offshore, power.
        </h1>

        <p
          style={{
            fontSize: "0.78rem",
            color: "var(--cat-text-tertiary)",
            fontFamily: "var(--cat-font-mono)",
            margin: "0 0 1.5rem",
            letterSpacing: "0.06em",
            lineHeight: 1.4,
          }}
          data-testid="text-hero-eyebrow"
        >
          Gen AI · 10+ years · Abu Dhabi
        </p>

        <div className="hero-cta-row">
          <CvPreviewButton
            data-testid="button-download-cv"
            className="catalog-btn catalog-btn--primary"
            style={{
              height: "auto",
              padding: "0.9rem 1.15rem",
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontFamily: "var(--cat-font-mono)",
              gap: "0.65rem",
            }}
          >
            <span
              aria-hidden="true"
              style={{ width: 8, height: 8, background: "var(--cat-ink)", display: "inline-block" }}
            />
            View CV
          </CvPreviewButton>
          <a
            href="https://www.linkedin.com/in/pathakrohit/"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="button-linkedin"
            className="catalog-btn"
            style={{
              height: "auto",
              padding: "0.9rem 1.15rem",
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontFamily: "var(--cat-font-mono)",
              borderColor: "var(--cat-ink)",
              borderRadius: 0,
              color: "var(--cat-text)",
            }}
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
