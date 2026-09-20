const linkStyle: React.CSSProperties = {
  color: "var(--cat-text)",
  textDecoration: "none",
  borderBottom: "1px solid var(--cat-rule)",
};

export default function Closing() {
  const hover = (e: React.MouseEvent<HTMLAnchorElement>, on: boolean) => {
    e.currentTarget.style.borderBottomColor = on ? "var(--cat-ink)" : "var(--cat-rule)";
  };

  return (
    <section
      id="contact"
      className="catalog-section"
      style={{ background: "transparent" }}
      data-testid="section-closing"
    >
      <div className="catalog-panel">
        <p className="work-label" data-testid="text-reach-out-label">
          Reach out
        </p>
        <p
          style={{
            fontSize: "0.95rem",
            fontFamily: "var(--cat-font-body)",
            margin: 0,
            color: "var(--cat-text-secondary)",
            lineHeight: 1.7,
            wordBreak: "break-word",
          }}
          data-testid="text-contact-line"
        >
          <a
            href="mailto:write@rohitpathak.com"
            style={linkStyle}
            onMouseEnter={(e) => hover(e, true)}
            onMouseLeave={(e) => hover(e, false)}
            data-testid="link-contact-email"
          >
            write@rohitpathak.com
          </a>
          {" · "}
          <a
            href="https://wa.me/971567874381"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
            onMouseEnter={(e) => hover(e, true)}
            onMouseLeave={(e) => hover(e, false)}
            data-testid="link-contact-phone"
          >
            +971 567 874 381
          </a>
          {" · Abu Dhabi, UAE"}
        </p>
      </div>
    </section>
  );
}
