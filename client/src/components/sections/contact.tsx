import EntryRow from "@/components/catalog/entry-row";

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
        <div className="catalog-panel">
          <EntryRow entryNumber="№ 06" numeral="06" label="Contact">
            <p className="catalog-meta" style={{ marginBottom: "6px" }}>A brief entry on</p>
            <h2
              style={{
                fontSize: "var(--cat-fs-h2)",
                fontWeight: 600,
                margin: "0 0 12px",
                lineHeight: 1.15,
                color: "var(--cat-text)",
                letterSpacing: "-0.025em",
              }}
              data-testid="heading-contact"
            >
              Get in touch.
            </h2>
            <p
              style={{
                fontSize: "var(--cat-fs-body)",
                lineHeight: 1.75,
                color: "var(--cat-text-secondary)",
                margin: "0 0 20px",
                maxWidth: "440px",
              }}
            >
              Open to new opportunities in AI product leadership and enterprise SaaS.
              Always happy to talk.
            </p>

            <div
              style={{
                background: "var(--cat-bg-card)",
                borderRadius: "var(--cat-radius-card)",
                border: `var(--cat-rule-width) solid var(--cat-rule)`,
                padding: "1.25rem 1.5rem",
              }}
            >
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
                      index === contactItems.length - 1
                        ? "none"
                        : `var(--cat-rule-width) solid var(--cat-rule)`,
                  }}
                >
                  <span
                    style={{
                      fontSize: "var(--cat-fs-eyebrow)",
                      letterSpacing: "var(--cat-ls-eyebrow)",
                      textTransform: "uppercase",
                      color: "var(--cat-text-tertiary)",
                      fontWeight: 500,
                    }}
                  >
                    {item.label}
                  </span>
                  {item.href ? (
                    <a
                      href={item.href}
                      data-testid={`text-contact-value-${index}`}
                      style={{
                        fontSize: "var(--cat-fs-body)",
                        color: "var(--cat-text)",
                        textDecoration: "none",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cat-accent)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--cat-text)")}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span
                      data-testid={`text-contact-value-${index}`}
                      style={{ fontSize: "var(--cat-fs-body)", color: "var(--cat-text)" }}
                    >
                      {item.value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </EntryRow>
        </div>
      </div>
    </section>
  );
}
