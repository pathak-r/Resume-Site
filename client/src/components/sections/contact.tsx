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

const F = "var(--cat-font)";
const FB = "var(--cat-font-body)";

export default function Contact() {
  return (
    <section id="contact" className="catalog-section" data-testid="section-contact">
      <div className="catalog-panel">
        <h2
          style={{
            fontSize: "32px",
            fontWeight: 600,
            margin: "0 0 10px",
            lineHeight: 1.2,
            color: "var(--cat-text)",
            letterSpacing: "-0.015em",
            fontFamily: F,
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
            margin: "0 0 24px",
            fontFamily: FB,
            maxWidth: "620px",
          }}
        >
          Open to new opportunities in AI product leadership and enterprise SaaS.
          Always happy to talk.
        </p>

        <div className="contact-grid">
          {contactItems.map((item, index) => (
            <div
              key={item.label}
              className="cat-plate"
              style={{ padding: "1rem 1.25rem" }}
              data-testid={`row-contact-${index}`}
            >
              <p
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--cat-ink-tertiary)",
                  fontWeight: 600,
                  fontFamily: F,
                  margin: "0 0 4px",
                }}
              >
                {item.label}
              </p>
              {item.href ? (
                <a
                  href={item.href}
                  data-testid={`text-contact-value-${index}`}
                  style={{
                    fontSize: "16px",
                    color: "var(--cat-ink)",
                    textDecoration: "none",
                    fontFamily: FB,
                    wordBreak: "break-word",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cat-accent)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--cat-ink)")}
                >
                  {item.value}
                </a>
              ) : (
                <span
                  data-testid={`text-contact-value-${index}`}
                  style={{
                    fontSize: "16px",
                    color: "var(--cat-ink)",
                    fontFamily: FB,
                  }}
                >
                  {item.value}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .contact-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }
        @media (max-width: 767px) {
          .contact-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
