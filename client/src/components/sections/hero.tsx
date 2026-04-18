const D = {
  bg:          "#1C1C1C",
  primary:     "#F2EFE8",
  secondary:   "#A8A49B",
  tertiary:    "#7A7771",
  border:      "rgba(242, 239, 232, 0.15)",
  borderStrong:"rgba(242, 239, 232, 0.35)",
  radius:      "10px",
  font:        '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

export default function Hero() {
  return (
    <section
      data-testid="section-hero"
      style={{
        background: D.bg,
        fontFamily: D.font,
        color: D.primary,
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        padding: "0 2rem 5rem",
        paddingTop: "calc(56px + 3.5rem)", /* clear fixed nav + gap */
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "260px 1fr",
            gap: "3rem",
            alignItems: "start",
          }}
        >
          {/* Index column */}
          <div style={{ paddingTop: "4px" }}>
            <p
              style={{
                fontSize: "13px",
                letterSpacing: "0.14em",
                color: D.tertiary,
                margin: 0,
                textTransform: "uppercase",
                fontWeight: 500,
              }}
              data-testid="text-hero-eyebrow-entry"
            >
              Entry № 01
            </p>
            <p
              style={{
                fontSize: "88px",
                fontWeight: 500,
                margin: "18px 0",
                lineHeight: 0.9,
                letterSpacing: "-0.03em",
                color: D.primary,
              }}
            >
              00
            </p>
            <p
              style={{
                fontSize: "13px",
                letterSpacing: "0.14em",
                color: D.tertiary,
                margin: 0,
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              Introduction
            </p>
          </div>

          {/* Content column */}
          <div>
            <p
              style={{ fontSize: "16px", color: D.secondary, margin: "0 0 20px" }}
              data-testid="text-hero-eyebrow"
            >
              Filed under: senior pm · enterprise AI · abu dhabi
            </p>

            <h1
              style={{
                fontSize: "56px",
                fontWeight: 600,
                margin: "0 0 28px",
                lineHeight: 1.1,
                letterSpacing: "-0.025em",
                color: D.primary,
                maxWidth: "920px",
              }}
              data-testid="text-hero-headline"
            >
              Senior product manager shipping AI into software people actually depend on.
            </h1>

            <p
              style={{
                fontSize: "18px",
                lineHeight: 1.65,
                color: D.secondary,
                margin: "0 0 36px",
                maxWidth: "640px",
              }}
              data-testid="text-hero-body"
            >
              Ten plus years turning complex technical capabilities into products that
              solve real business problems. Currently focused on agentic AI and RAG
              systems inside enterprise SaaS.
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <a
                href="#work"
                data-testid="button-view-work"
                style={{
                  fontSize: "15px",
                  fontWeight: 500,
                  padding: "12px 22px",
                  borderRadius: D.radius,
                  border: `0.5px solid ${D.borderStrong}`,
                  color: D.primary,
                  background: "transparent",
                  textDecoration: "none",
                  cursor: "pointer",
                  fontFamily: D.font,
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(242,239,232,0.05)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                View selected work →
              </a>
              <a
                href="/Rohit_Pathak_Resume.pdf"
                download
                data-testid="button-download-cv"
                style={{
                  fontSize: "15px",
                  fontWeight: 500,
                  padding: "12px 22px",
                  borderRadius: D.radius,
                  border: `0.5px solid ${D.border}`,
                  color: D.secondary,
                  background: "transparent",
                  textDecoration: "none",
                  cursor: "pointer",
                  fontFamily: D.font,
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = D.primary;
                  e.currentTarget.style.borderColor = D.borderStrong;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = D.secondary;
                  e.currentTarget.style.borderColor = D.border;
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
                  fontSize: "15px",
                  fontWeight: 500,
                  padding: "12px 22px",
                  borderRadius: D.radius,
                  border: `0.5px solid ${D.border}`,
                  color: D.secondary,
                  background: "transparent",
                  textDecoration: "none",
                  cursor: "pointer",
                  fontFamily: D.font,
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = D.primary;
                  e.currentTarget.style.borderColor = D.borderStrong;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = D.secondary;
                  e.currentTarget.style.borderColor = D.border;
                }}
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
