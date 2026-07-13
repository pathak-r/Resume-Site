import { HeroFigure } from "@/components/figures/figures";

export default function Hero() {
  return (
    <section
      data-testid="section-hero"
      style={{
        background: "var(--cat-bg)",
        color: "var(--cat-text)",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        padding: "calc(56px + 4rem) 2rem 4rem",
      }}
    >
      <div style={{ maxWidth: "1040px", margin: "0 auto" }}>
        <div className="hero-grid">
          {/* Text column */}
          <div>
            <p
              style={{
                fontSize: "12px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--cat-text-tertiary)",
                fontWeight: 600,
                fontFamily: "var(--cat-font)",
                margin: "0 0 18px",
              }}
              data-testid="text-hero-eyebrow"
            >
              Senior PM · Enterprise AI · Abu Dhabi
            </p>

            <h1
              className="hero-h1"
              style={{
                fontSize: "42px",
                fontWeight: 600,
                margin: "0 0 18px",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                color: "var(--cat-text)",
                fontFamily: "var(--cat-font)",
              }}
              data-testid="text-hero-headline"
            >
              Senior product manager building AI products for critical infrastructure.
            </h1>

            <p
              style={{
                fontSize: "17px",
                lineHeight: 1.65,
                color: "var(--cat-text-secondary)",
                margin: "0 0 28px",
                maxWidth: "540px",
                fontFamily: "var(--cat-font-body)",
              }}
              data-testid="text-hero-body"
            >
              Ten plus years shipping, turning complex technical capabilities into
              products. I don't trust an idea until I've built a rough version of it,
              so there are usually two or three of my own products in flight at any
              given time.
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <a
                href="#work"
                data-testid="button-view-work"
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  padding: "12px 24px",
                  borderRadius: "10px",
                  border: "1px solid var(--cat-text)",
                  color: "var(--cat-bg)",
                  background: "var(--cat-text)",
                  textDecoration: "none",
                  cursor: "pointer",
                  fontFamily: "var(--cat-font)",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#3A372F")}
                onMouseLeave={e => (e.currentTarget.style.background = "var(--cat-text)")}
              >
                View selected work →
              </a>
              <a
                href="/Rohit_Pathak_Resume.pdf"
                download
                data-testid="button-download-cv"
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  padding: "12px 24px",
                  borderRadius: "10px",
                  border: "1px solid var(--cat-rule-strong)",
                  color: "var(--cat-text)",
                  background: "transparent",
                  textDecoration: "none",
                  cursor: "pointer",
                  fontFamily: "var(--cat-font)",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(34,32,28,0.04)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                Download CV
              </a>
              <a
                href="https://www.linkedin.com/in/pathakrohit/"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="button-linkedin"
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  padding: "12px 24px",
                  borderRadius: "10px",
                  border: "1px solid var(--cat-rule-strong)",
                  color: "var(--cat-text-secondary)",
                  background: "transparent",
                  textDecoration: "none",
                  cursor: "pointer",
                  fontFamily: "var(--cat-font)",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = "var(--cat-text)";
                  e.currentTarget.style.background = "rgba(34,32,28,0.04)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = "var(--cat-text-secondary)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Figure column */}
          <div aria-hidden="false">
            <HeroFigure />
          </div>
        </div>
      </div>
    </section>
  );
}
