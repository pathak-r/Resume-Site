import { Smart3DFigure } from "@/components/figures/figures";

export default function Hero() {
  return (
    <section
      data-testid="section-hero"
      style={{
        background: "var(--cat-bg)",
        color: "var(--cat-text)",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        padding: "3.5rem 2rem 4rem",
      }}
    >
      <div
        className="hero-wall-frame"
        style={{ maxWidth: "1040px", margin: "0 auto" }}
      >
        <div style={{ minWidth: 0 }}>
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
              margin: "0 0 28px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "var(--cat-text)",
              fontFamily: "var(--cat-font)",
            }}
            data-testid="text-hero-headline"
          >
            <span
              className="hero-h1-line1"
              style={{
                display: "block",
                fontSize: "42px",
                lineHeight: 1.15,
                marginBottom: "8px",
              }}
            >
              PM ← Gen AI ← Tech.
            </span>
            <span
              className="hero-h1-line2"
              style={{
                display: "block",
                fontSize: "26px",
                lineHeight: 1.3,
                color: "var(--cat-text-secondary)",
                marginBottom: "2px",
              }}
            >
              Capital projects.
            </span>
            <span
              className="hero-h1-line2"
              style={{
                display: "block",
                fontSize: "26px",
                lineHeight: 1.3,
                color: "var(--cat-text-tertiary)",
                marginBottom: "2px",
              }}
            >
              Critical infrastructure.
            </span>
            <span
              className="hero-h1-line3"
              style={{
                display: "block",
                fontSize: "20px",
                lineHeight: 1.35,
                color: "var(--cat-text-tertiary)",
                fontWeight: 500,
                marginBottom: "6px",
              }}
            >
              Refineries, offshore platforms, power plants.
            </span>
            <span
              style={{
                display: "block",
                fontSize: "22px",
                lineHeight: 1.35,
                color: "#E8A060",
                fontWeight: 600,
              }}
              data-testid="text-hero-tenure"
            >
              10+ Years.
            </span>
          </h1>

          <div className="hero-cta-row">
            <a
              href="#interview"
              data-testid="button-ask-questions"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#interview")?.scrollIntoView({ behavior: "smooth" });
                window.dispatchEvent(new CustomEvent("agent:focus"));
              }}
              style={{
                fontSize: "15px",
                fontWeight: 600,
                padding: "10px 18px",
                borderRadius: "10px",
                border: "1px solid var(--cat-accent)",
                color: "var(--cat-on-accent)",
                background: "var(--cat-accent)",
                textDecoration: "none",
                cursor: "pointer",
                fontFamily: "var(--cat-font)",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#A94D30")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--cat-accent)")}
            >
              Ask your questions ↑
            </a>
            <a
              href="/Rohit_Pathak_Resume.pdf"
              download
              data-testid="button-download-cv"
              style={{
                fontSize: "15px",
                fontWeight: 600,
                padding: "10px 18px",
                borderRadius: "10px",
                border: "1px solid var(--cat-rule-strong)",
                color: "var(--cat-text)",
                background: "transparent",
                textDecoration: "none",
                cursor: "pointer",
                fontFamily: "var(--cat-font)",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(240,235,224,0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
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
                padding: "10px 18px",
                borderRadius: "10px",
                border: "1px solid var(--cat-rule-strong)",
                color: "var(--cat-text-secondary)",
                background: "transparent",
                textDecoration: "none",
                cursor: "pointer",
                fontFamily: "var(--cat-font)",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--cat-text)";
                e.currentTarget.style.background = "rgba(240,235,224,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--cat-text-secondary)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              LinkedIn
            </a>
          </div>
        </div>

        <div className="hero-wall-figure" style={{ minWidth: 0 }} data-testid="hero-nl-figure">
          <div aria-hidden style={{ opacity: 0.95 }}>
            <Smart3DFigure variant="wall" />
          </div>

          <div
            className="hero-wall-query"
            style={{
              marginTop: "0.75rem",
              fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
            }}
          >
            <div
              style={{
                height: "1px",
                background: "rgba(232,226,212,0.28)",
                marginBottom: "0.65rem",
              }}
            />
            <p
              style={{
                margin: 0,
                fontSize: "13px",
                lineHeight: 1.4,
                color: "var(--cat-text)",
              }}
            >
              ▸ which lines connect vessel V-20 to the exchangers?
              <span
                style={{
                  display: "inline-block",
                  width: "7px",
                  height: "12px",
                  background: "#E8A060",
                  marginLeft: "6px",
                  verticalAlign: "middle",
                }}
              />
            </p>
            <p
              style={{
                margin: "0.35rem 0 0",
                fontSize: "12px",
                color: "#E8A060",
              }}
            >
              1 line · 1 valve · 2 nozzles matched
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
