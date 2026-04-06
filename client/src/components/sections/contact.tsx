import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Linkedin } from "lucide-react";

const contactItems = [
  {
    icon: Mail,
    label: "Email",
    value: "pathak.a.rohit@gmail.com",
    href: "mailto:pathak.a.rohit@gmail.com",
    accent: "var(--lf-primary)",
    accentBg: "rgba(168,48,40,0.08)",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+971 567 874 381",
    href: "tel:+971567874381",
    accent: "var(--lf-secondary)",
    accentBg: "rgba(0,95,153,0.08)",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Abu Dhabi, UAE",
    href: null,
    accent: "var(--lf-tertiary)",
    accentBg: "rgba(0,99,130,0.08)",
  },
];

export default function Contact() {
  return (
    <section
      id="contact"
      style={{ background: 'var(--lf-surface-container-low, #eff1f2)', padding: '6rem 0' }}
    >
      <div className="container px-6 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <span className="label-meta block mb-4" style={{ color: 'var(--lf-primary)' }}>Let's Connect</span>
          <h2
            className="font-bold"
            style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', letterSpacing: '-0.02em', color: 'var(--lf-on-surface)' }}
            data-testid="heading-contact"
          >
            Get in Touch
          </h2>
          <p
            className="mt-4"
            style={{ fontSize: '1rem', color: '#6b7071', maxWidth: '480px', lineHeight: 1.7, letterSpacing: '0.01em' }}
          >
            Open to new opportunities in AI product leadership and enterprise SaaS. Always happy to talk.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactItems.map((item, index) => {
            const Icon = item.icon;
            const content = (
              <div
                className="surface-lowest shadow-ambient rounded-3xl p-8 flex flex-col gap-4 transition-all duration-200"
                style={{ borderRadius: '2rem' }}
                data-testid={`card-contact-${index}`}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: item.accentBg, borderRadius: '1rem' }}
                >
                  <Icon className="w-5 h-5" style={{ color: item.accent }} />
                </div>
                <div>
                  <div className="label-meta mb-1" style={{ color: '#abadae' }}>{item.label}</div>
                  <div
                    className="font-semibold"
                    style={{ fontSize: '1rem', color: 'var(--lf-on-surface)', letterSpacing: '0.01em' }}
                    data-testid={`text-contact-value-${index}`}
                  >
                    {item.value}
                  </div>
                </div>
              </div>
            );

            if (item.href) {
              return (
                <motion.a
                  key={index}
                  href={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="block no-underline group"
                  onMouseEnter={e => {
                    const card = e.currentTarget.querySelector<HTMLElement>('[data-testid]');
                    if (card) card.style.boxShadow = '0 12px 48px rgba(44,47,48,0.1)';
                  }}
                  onMouseLeave={e => {
                    const card = e.currentTarget.querySelector<HTMLElement>('[data-testid]');
                    if (card) card.style.boxShadow = '';
                  }}
                >
                  {content}
                </motion.a>
              );
            }

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                {content}
              </motion.div>
            );
          })}
        </div>

        {/* LinkedIn CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-10 flex justify-start"
        >
          <a
            href="https://www.linkedin.com/in/pathakrohit/"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="button-linkedin"
            className="btn-primary-gradient flex items-center gap-2 px-8 py-3.5 text-base font-semibold"
          >
            <Linkedin className="w-4 h-4" />
            Connect on LinkedIn
          </a>
        </motion.div>
      </div>
    </section>
  );
}
