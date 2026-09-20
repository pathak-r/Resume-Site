import CvPreviewButton from "@/components/cv-preview";

export default function Hero() {
  return (
    <section
      data-testid="section-hero"
      style={{
        background: "transparent",
        color: "var(--cat-text)",
        WebkitFontSmoothing: "antialiased",
        padding: "calc(56px + 3.5rem) 1.5rem 2rem",
      }}
    >
      <div className="hero-pm-strip">
        <div className="hero-pm-copy">
          <h1
            className="hero-pm-title"
            style={{
              margin: "0 0 0.85rem",
              fontSize: "3.15rem",
              fontWeight: 500,
              letterSpacing: 0,
              lineHeight: 1.1,
              color: "var(--cat-text)",
              fontFamily: "var(--cat-font)",
            }}
            data-testid="text-hero-headline"
          >
            Rohit Pathak
          </h1>

          <p
            style={{
              margin: "0 0 0.2rem",
              fontSize: "1.15rem",
              lineHeight: 1.45,
              color: "var(--cat-navy)",
              fontFamily: "var(--cat-font-body)",
              fontWeight: 500,
            }}
          >
            Technical PM
          </p>
          <p
            style={{
              margin: "0 0 0.2rem",
              fontSize: "1.05rem",
              lineHeight: 1.5,
              color: "var(--cat-text-secondary)",
              fontFamily: "var(--cat-font-body)",
            }}
            data-testid="text-hero-eyebrow"
          >
            10+ Years. Hexagon AB. Nestlé.
          </p>
          <p
            style={{
              margin: "0 0 1.75rem",
              fontSize: "1.05rem",
              lineHeight: 1.5,
              color: "var(--cat-text-secondary)",
              fontFamily: "var(--cat-font-body)",
            }}
          >
            Gen AI for Capital Projects
          </p>

          <div className="hero-cta-row">
            <CvPreviewButton data-testid="button-download-cv" className="quiet-link">
              CV
            </CvPreviewButton>
            <a
              href="https://www.linkedin.com/in/pathakrohit/"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="button-linkedin"
              className="quiet-link"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <img
          className="hero-portrait"
          src="/rohit-portrait-v5.jpg"
          alt="Rohit Pathak"
          width={148}
          height={169}
          data-testid="img-hero-portrait"
        />
      </div>
    </section>
  );
}
