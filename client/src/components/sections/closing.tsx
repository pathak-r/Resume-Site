const F = "var(--cat-font)";
const MONO = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace";

const linkStyle: React.CSSProperties = {
  color: "var(--cat-text)",
  textDecoration: "none",
  transition: "color 0.15s",
};

export default function Closing() {
  const hover = (e: React.MouseEvent<HTMLAnchorElement>, on: boolean) => {
    e.currentTarget.style.color = on ? "var(--cat-accent)" : "var(--cat-text)";
  };

  return (
    <section id="contact" className="catalog-section" data-testid="section-closing">
      <div className="catalog-panel">
        <h2
          style={{
            fontSize: "34px",
            fontWeight: 600,
            margin: "0 0 32px",
            lineHeight: 1.2,
            color: "var(--cat-text)",
            letterSpacing: "-0.015em",
            fontFamily: F,
          }}
          data-testid="text-closing-statement"
        >
          I prototype before I pitch
          <span style={{ color: "var(--cat-accent)" }}>.</span>
        </h2>

        <p
          style={{
            fontSize: "11px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--cat-text-tertiary)",
            fontWeight: 600,
            fontFamily: F,
            margin: "0 0 10px",
          }}
        >
          Reach out
        </p>
        <p
          style={{
            fontSize: "14px",
            fontFamily: MONO,
            margin: 0,
            color: "var(--cat-text-secondary)",
            lineHeight: 1.8,
            wordBreak: "break-word",
          }}
          data-testid="text-contact-line"
        >
          ▸{" "}
          <a
            href="mailto:pathak.a.rohit@gmail.com"
            style={linkStyle}
            onMouseEnter={(e) => hover(e, true)}
            onMouseLeave={(e) => hover(e, false)}
            data-testid="link-contact-email"
          >
            pathak.a.rohit@gmail.com
          </a>{" "}
          ·{" "}
          <a
            href="tel:+971567874381"
            style={linkStyle}
            onMouseEnter={(e) => hover(e, true)}
            onMouseLeave={(e) => hover(e, false)}
            data-testid="link-contact-phone"
          >
            +971 567 874 381
          </a>{" "}
          · abu dhabi, uae
        </p>
      </div>
    </section>
  );
}
