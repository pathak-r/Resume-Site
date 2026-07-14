const contactItems = [
  {
    label: "Email",
    value: "pathak.a.rohit@gmail.com",
    href: "mailto:pathak.a.rohit@gmail.com",
  },
  {
    label: "Phone",
    value: "+971 567 874 381",
    href: "tel:+971567874381",
  },
  {
    label: "Location",
    value: "Abu Dhabi, UAE",
    href: null as string | null,
  },
];

export default function Contact() {
  return (
    <section id="contact" className="catalog-section" data-testid="section-contact">
      <div className="px-4">
        <div className="catalog-panel" style={{ maxWidth: "1040px" }}>
          <div className="catalog-section-header">
            <p
              style={{
                fontSize: "13px",
                letterSpacing: "0.1em",
                color: "var(--cat-text-tertiary)",
                textTransform: "uppercase",
                margin: 0,
                fontWeight: 600,
                fontFamily: "var(--cat-font)",
              }}
            >
              Contact
            </p>
          </div>

          <div style={{ maxWidth: "620px" }}>
            <h2
              style={{
                fontSize: "32px",
                fontWeight: 600,
                margin: "0 0 12px",
                lineHeight: 1.2,
                color: "var(--cat-text)",
                letterSpacing: "-0.015em",
                fontFamily: "var(--cat-font)",
              }}
              data-testid="heading-contact"
            >
              Get in touch.
            </h2>
            <p
              style={{
                fontSize: "17px",
                lineHeight: 1.75,
                color: "var(--cat-text-secondary)",
                margin: "0 0 20px",
                fontFamily: "var(--cat-font-body)",
              }}
            >
              Open to new opportunities in AI product leadership and enterprise SaaS.
              Always happy to talk.
            </p>

            <div className="cat-plate" style={{ padding: "1.25rem 1.5rem" }}>
              {contactItems.map((item, index) => (
                <div
                  key={item.label}
                  data-testid={`row-contact-${index}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "90px 1fr",
                    gap: "1rem",
                    alignItems: "baseline",
                    paddingTop: index === 0 ? 0 : "0.75rem",
                    paddingBottom: index === contactItems.length - 1 ? 0 : "0.75rem",
                    borderBottom:
                      index === contactItems.length - 1 ? "none" : "1px solid var(--cat-rule)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--cat-text-tertiary)",
                      fontWeight: 600,
                      fontFamily: "var(--cat-font)",
                    }}
                  >
                    {item.label}
                  </span>
                  {item.href ? (
                    <a
                      href={item.href}
                      data-testid={`text-contact-value-${index}`}
                      style={{
                        fontSize: "16px",
                        color: "var(--cat-text)",
                        textDecoration: "none",
                        fontFamily: "var(--cat-font-body)",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cat-accent)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--cat-text)")}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span
                      data-testid={`text-contact-value-${index}`}
                      style={{
                        fontSize: "16px",
                        color: "var(--cat-text)",
                        fontFamily: "var(--cat-font-body)",
                      }}
                    >
                      {item.value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
