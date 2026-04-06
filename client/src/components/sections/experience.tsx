import { motion } from "framer-motion";

const experiences = [
  {
    company: "Hexagon AB",
    role: "Senior Product Manager",
    period: "Jan 2023 – Present",
    location: "Abu Dhabi, UAE",
    description: "Leading end-to-end strategy for AI product innovation, building and scaling LLM-based agentic systems.",
    achievements: [
      "Led strategy for AI copilots, achieving 3× faster execution for engineering workflows.",
      "Delivered enterprise-grade AI agents for complex database queries.",
      "Launched secure RAG assistant deflecting 40% of support tickets.",
    ],
    accent: "var(--lf-primary)",
  },
  {
    company: "Hexagon AB",
    role: "Product Manager",
    period: "Sep 2018 – Dec 2022",
    location: "Abu Dhabi, UAE",
    description: "Managed product lifecycle and delivered high-impact AI MVPs across business units.",
    achievements: [
      "Recognized with 'Voice of the Customer' award for productivity gains.",
      "Defined and executed 12-month product roadmaps in an agile framework.",
    ],
    accent: "var(--lf-secondary)",
  },
  {
    company: "Hexagon AB",
    role: "Support Analyst",
    period: "Sep 2013 – Sep 2018",
    location: "Huntsville, Alabama",
    description: "Led support for mission-critical enterprise deployments across global customers.",
    achievements: [
      "Reduced engineering effort by 80% via SDK-driven automation scripts.",
      "Authored Knowledge Base documentation reducing resolution time by 25%.",
    ],
    accent: "var(--lf-tertiary)",
  },
];

export default function Experience() {
  return (
    <section id="experience" style={{ background: 'var(--lf-surface, #f5f6f7)', padding: '6rem 0' }}>
      <div className="container px-6 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <span className="label-meta block mb-4" style={{ color: 'var(--lf-primary)' }}>Career</span>
          <h2
            className="font-bold"
            style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', letterSpacing: '-0.02em', color: 'var(--lf-on-surface)' }}
            data-testid="heading-experience"
          >
            Experience
          </h2>
        </motion.div>

        <div className="flex flex-col gap-6">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              data-testid={`card-experience-${index}`}
            >
              <div
                className="surface-lowest shadow-ambient rounded-3xl relative overflow-hidden"
                style={{ padding: '2rem 2.5rem', borderRadius: '2rem' }}
              >
                {/* Accent bar */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1.5 rounded-r-full"
                  style={{ background: exp.accent, opacity: 0.85 }}
                />

                <div className="pl-3">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-3">
                    <div>
                      <h3
                        className="font-bold"
                        style={{ fontSize: '1.25rem', letterSpacing: '-0.01em', color: 'var(--lf-on-surface)', lineHeight: 1.3 }}
                        data-testid={`text-role-${index}`}
                      >
                        {exp.role}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="font-semibold"
                          style={{ fontSize: '0.95rem', color: exp.accent }}
                          data-testid={`text-company-${index}`}
                        >
                          {exp.company}
                        </span>
                        <span style={{ color: '#abadae', fontSize: '0.85rem' }}>·</span>
                        <span
                          className="text-sm"
                          style={{ color: '#6b7071' }}
                          data-testid={`text-location-${index}`}
                        >
                          {exp.location}
                        </span>
                      </div>
                    </div>
                    <span
                      className="label-meta shrink-0 px-4 py-1.5 rounded-full"
                      style={{
                        background: 'var(--lf-surface-container-low, #eff1f2)',
                        color: '#6b7071',
                        fontSize: '0.72rem',
                      }}
                      data-testid={`text-period-${index}`}
                    >
                      {exp.period}
                    </span>
                  </div>

                  <p
                    className="mb-5"
                    style={{ fontSize: '0.975rem', color: '#6b7071', lineHeight: 1.7, letterSpacing: '0.01em' }}
                    data-testid={`text-exp-desc-${index}`}
                  >
                    {exp.description}
                  </p>

                  <ul className="space-y-2">
                    {exp.achievements.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3"
                        style={{ fontSize: '0.925rem', color: 'var(--lf-on-surface)' }}
                        data-testid={`text-achievement-${index}-${i}`}
                      >
                        <span
                          className="mt-2 shrink-0 rounded-full"
                          style={{ width: '6px', height: '6px', background: exp.accent, display: 'inline-block', opacity: 0.8 }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
