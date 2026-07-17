const F = "var(--cat-font)";
const MONO = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace";

export default function Hero() {
  return (
    <section
      data-testid="section-masthead"
      style={{
        background: "var(--cat-bg)",
        color: "var(--cat-text)",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        padding: "2.5rem 2rem 3.5rem",
      }}
    >
      <div style={{ maxWidth: "var(--cat-panel-max)", margin: "0 auto" }}>
        <h1
          className="hero-h1"
          style={{
            margin: "0 0 20px",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "var(--cat-text)",
            fontFamily: F,
          }}
          data-testid="text-masthead-headline"
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
              marginBottom: "4px",
            }}
          >
            Capital projects. Critical infrastructure.
          </span>
          <span
            className="hero-h1-line3"
            style={{
              display: "block",
              fontSize: "22px",
              lineHeight: 1.35,
              color: "var(--cat-text-secondary)",
              fontWeight: 500,
              marginBottom: "6px",
            }}
          >
            Refineries, offshore platforms, power plants.
          </span>
          <span
            style={{
              display: "block",
              fontSize: "20px",
              lineHeight: 1.35,
              color: "var(--cat-text)",
              fontWeight: 500,
            }}
            data-testid="text-masthead-tenure"
          >
            10+ years. Hexagon. Nestlé.
          </span>
        </h1>

        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center" }}>
          <a
            href="#interview"
            data-testid="link-ask-questions"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#interview")?.scrollIntoView({ behavior: "smooth" });
              window.dispatchEvent(new CustomEvent("agent:focus"));
            }}
            style={{
              fontSize: "14px",
              color: "var(--cat-accent)",
              fontFamily: MONO,
              textDecoration: "none",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            ask your questions ↑
          </a>
          <a
            href="/Rohit_Pathak_Resume.pdf"
            download
            data-testid="button-download-cv"
            style={{
              fontSize: "14px",
              fontWeight: 600,
              padding: "9px 18px",
              borderRadius: "9px",
              border: "1px solid var(--cat-rule-strong)",
              color: "var(--cat-text)",
              background: "transparent",
              textDecoration: "none",
              cursor: "pointer",
              fontFamily: F,
              transition: "all 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(240,235,224,0.1)")}
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
              fontSize: "14px",
              fontWeight: 600,
              padding: "9px 18px",
              borderRadius: "9px",
              border: "1px solid var(--cat-rule-strong)",
              color: "var(--cat-text-secondary)",
              background: "transparent",
              textDecoration: "none",
              cursor: "pointer",
              fontFamily: F,
              transition: "all 0.15s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = "var(--cat-text)";
              e.currentTarget.style.background = "rgba(240,235,224,0.1)";
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
    </section>
  );
}
