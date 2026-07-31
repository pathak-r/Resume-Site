const F = "var(--cat-font)";

export default function Hero() {
  return (
    <section
      data-testid="section-hero"
      style={{
        background: "var(--cat-bg)",
        color: "var(--cat-text)",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        padding: "calc(56px + 2rem) 2rem 1.25rem",
      }}
    >
      <div className="hero-pm-strip">
        <h1
          className="hero-pm-title"
          style={{
            margin: "0 0 10px",
            fontSize: "clamp(26px, 4vw, 34px)",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            lineHeight: 1.25,
            color: "var(--cat-text)",
            fontFamily: F,
          }}
          data-testid="text-hero-headline"
        >
          PM for capital projects: refineries, offshore, power.
        </h1>

        <p
          style={{
            fontSize: "15px",
            color: "var(--cat-text-secondary)",
            fontFamily: F,
            margin: "0 0 20px",
            letterSpacing: "0.01em",
            lineHeight: 1.4,
          }}
          data-testid="text-hero-eyebrow"
        >
          Gen AI · 10+ years · Abu Dhabi
        </p>

        <div className="hero-cta-row">
          <a
            href="/Rohit_Pathak_Resume.pdf"
            download
            data-testid="button-download-cv"
            style={{
              fontSize: "14px",
              fontWeight: 600,
              padding: "9px 16px",
              borderRadius: "8px",
              border: "1px solid var(--cat-accent)",
              color: "var(--cat-on-accent)",
              background: "var(--cat-accent)",
              textDecoration: "none",
              fontFamily: F,
            }}
          >
            Download CV
          </a>
          <a
            href="https://www.linkedin.com/in/pathakrohit/"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="button-linkedin"
            style={{
              fontSize: "14px",
              fontWeight: 500,
              padding: "9px 16px",
              borderRadius: "8px",
              border: "1px solid var(--cat-rule-strong)",
              color: "var(--cat-text-secondary)",
              background: "transparent",
              textDecoration: "none",
              fontFamily: F,
            }}
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
