const linkStyle: React.CSSProperties = {
  color: "var(--cat-text)",
  textDecoration: "none",
  borderBottom: "1px solid transparent",
  transition: "border-color 0.15s",
};

export default function Closing() {
  const hover = (e: React.MouseEvent<HTMLAnchorElement>, on: boolean) => {
    e.currentTarget.style.borderBottomColor = on ? "var(--cat-ink)" : "transparent";
  };

  return (
    <section
      id="contact"
      className="catalog-section"
      style={{ background: "transparent" }}
      data-testid="section-closing"
    >
      <div className="catalog-panel">
        <h2
          style={{
            fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
            fontWeight: 600,
            margin: "0 0 1.5rem",
            lineHeight: 1.15,
            color: "var(--cat-text)",
            letterSpacing: "-0.03em",
            fontFamily: "var(--cat-font)",
            maxWidth: "18ch",
          }}
          data-testid="text-closing-statement"
        >
          Anyway, the sun is out. Go look at the sky
          <span style={{ background: "var(--cat-accent)", padding: "0 0.12em" }}>.</span>
        </h2>

        <p
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--cat-text-tertiary)",
            fontWeight: 500,
            fontFamily: "var(--cat-font-mono)",
            margin: "0 0 0.45rem",
          }}
          data-testid="text-reach-out-label"
        >
          Reach out
        </p>
        <p
          style={{
            fontSize: "0.9rem",
            fontFamily: "var(--cat-font-mono)",
            margin: 0,
            color: "var(--cat-text-secondary)",
            lineHeight: 1.7,
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
