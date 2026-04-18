const DARK_BG = "#1A1A1A";
const DARK_TEXT = "#F5F5F0";
const DARK_SECONDARY = "#A8A8A0";
const DARK_TERTIARY = "#7A7A75";
const DARK_RULE = "rgba(255, 255, 255, 0.14)";

export default function Hero() {
  return (
    <section
      style={{
        background: DARK_BG,
        color: DARK_TEXT,
        paddingTop: "2.5rem",
        paddingBottom: "5rem",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, "Plus Jakarta Sans", sans-serif',
      }}
      data-testid="section-hero"
    >
      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 3rem" }}>
        {/* Top hairline rule under nav */}
        <div style={{ borderTop: `0.5px solid ${DARK_RULE}`, marginBottom: "3.5rem" }} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "200px 1fr",
            gap: "3rem",
            alignItems: "start",
          }}
        >
          {/* Index column */}
          <div>
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: DARK_TERTIARY,
                fontWeight: 500,
                margin: "0 0 1.25rem",
              }}
            >
              Entry № 01
            </p>
            <p
              style={{
                fontSize: "60px",
                fontWeight: 500,
                lineHeight: 1,
                color: DARK_TEXT,
                margin: 0,
                letterSpacing: "-0.025em",
              }}
            >
              00
            </p>
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: DARK_TERTIARY,
                fontWeight: 500,
                margin: "1.25rem 0 0",
              }}
            >
              Introduction
            </p>
          </div>

          {/* Content column */}
          <div>
            <p
              style={{
                fontSize: "15px",
                color: DARK_SECONDARY,
                margin: "0 0 1.25rem",
              }}
              data-testid="text-hero-eyebrow"
            >
              Filed under: senior pm · enterprise AI · abu dhabi
            </p>

            <h1
              style={{
                fontSize: "60px",
                fontWeight: 500,
                lineHeight: 1.1,
                letterSpacing: "-0.025em",
                color: DARK_TEXT,
                margin: "0 0 2rem",
                maxWidth: "16ch",
              }}
              data-testid="text-hero-headline"
            >
              Senior product manager shipping AI into software people actually depend on.
            </h1>

            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.7,
                color: DARK_SECONDARY,
                margin: "0 0 2.5rem",
                maxWidth: "60ch",
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
                  fontSize: "14px",
                  fontWeight: 500,
                  padding: "12px 22px",
                  borderRadius: "8px",
                  border: `0.5px solid ${DARK_TEXT}`,
                  color: DARK_TEXT,
                  background: "transparent",
                  textDecoration: "none",
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                View selected work →
              </a>
              <a
                href="/Rohit_Pathak_Resume.pdf"
                download
                data-testid="button-download-cv"
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  padding: "12px 22px",
                  borderRadius: "8px",
                  border: `0.5px solid ${DARK_RULE}`,
                  color: DARK_SECONDARY,
                  background: "transparent",
                  textDecoration: "none",
                  transition: "color 0.15s ease, border-color 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = DARK_TEXT;
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = DARK_SECONDARY;
                  e.currentTarget.style.borderColor = DARK_RULE;
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
                  padding: "12px 22px",
                  borderRadius: "8px",
                  border: `0.5px solid ${DARK_RULE}`,
                  color: DARK_SECONDARY,
                  background: "transparent",
                  textDecoration: "none",
                  transition: "color 0.15s ease, border-color 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = DARK_TEXT;
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = DARK_SECONDARY;
                  e.currentTarget.style.borderColor = DARK_RULE;
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
