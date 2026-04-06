import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    title: "Enterprise AI Copilot System",
    category: "Generative AI Product",
    impact: "3× Faster Engineering Workflows",
    description: "Led the strategy and development of an LLM-based agentic system designed to automate complex 3D engineering workflows. This product transformed how global engineering teams operate, saving hundreds of hours monthly.",
    tags: ["LLM Agents", "Product Strategy", "3D Engineering", "Automation"],
    accentColor: "var(--lf-primary)",
  },
  {
    title: "AI Agents & Natural Language Querying",
    category: "Data Intelligence",
    impact: "Accelerated Decision-Making",
    description: "Delivered enterprise-grade AI agents enabling natural-language queries on complex databases, significantly improving access to mission-critical data and accelerating cross-functional decision-making.",
    tags: ["NL2SQL", "Data Accessibility", "Enterprise Search", "Decision Support"],
    accentColor: "var(--lf-secondary)",
  },
  {
    title: "AI ROI & Telemetry Framework",
    category: "Analytics & Strategy",
    impact: "Quantifiable Business Value",
    description: "Designed a comprehensive framework to measure the actual business impact of AI features. Defined KPIs for time savings and user adoption, enabling data-driven roadmap decisions across multiple business units.",
    tags: ["Product Analytics", "ROI Modeling", "Strategic Planning"],
    accentColor: "var(--lf-tertiary)",
  },
];

export default function FeaturedWork() {
  return (
    <section id="work" className="surface-base" style={{ paddingBottom: '6rem' }}>
      <div className="container px-6 mx-auto max-w-6xl">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 pt-24"
        >
          <span className="label-meta block mb-4" style={{ color: 'var(--lf-primary)' }}>Selected Work</span>
          <h2
            className="font-bold"
            style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', letterSpacing: '-0.02em', color: 'var(--lf-on-surface)' }}
            data-testid="heading-selected-work"
          >
            Case Studies
          </h2>
        </motion.div>

        <div className="flex flex-col gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group"
              data-testid={`card-project-${index}`}
            >
              <div
                className="surface-lowest shadow-ambient shadow-ambient-hover rounded-3xl overflow-hidden transition-all duration-300 relative"
                style={{ padding: '2.5rem', borderRadius: '2rem' }}
              >
                {/* Subtle accent bar */}
                <div
                  className="absolute top-0 left-0 h-1 w-24 rounded-full"
                  style={{ background: project.accentColor, opacity: 0.7, borderRadius: '0 0 2rem 2rem', top: 0, left: '2.5rem' }}
                />

                {/* Arrow on hover */}
                <div className="absolute top-7 right-7 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowUpRight
                    className="w-5 h-5"
                    style={{ color: 'var(--lf-on-surface)' }}
                  />
                </div>

                <div className="flex flex-col gap-5">
                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className="chip-teal"
                      data-testid={`chip-category-${index}`}
                    >
                      {project.category}
                    </span>
                    <span
                      className="text-xs font-bold uppercase"
                      style={{ letterSpacing: '0.05em', color: 'var(--lf-primary)' }}
                      data-testid={`text-impact-${index}`}
                    >
                      · {project.impact}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className="font-bold"
                    style={{ fontSize: '1.5rem', letterSpacing: '-0.02em', color: 'var(--lf-on-surface)', lineHeight: 1.3 }}
                    data-testid={`text-project-title-${index}`}
                  >
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{ fontSize: '1rem', color: '#6b7071', lineHeight: 1.7, maxWidth: '640px', letterSpacing: '0.01em' }}
                    data-testid={`text-project-desc-${index}`}
                  >
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-1">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-semibold px-3 py-1.5 rounded-full"
                        style={{
                          background: 'var(--lf-surface-container-low, #eff1f2)',
                          color: 'var(--lf-on-surface)',
                          letterSpacing: '0.01em',
                        }}
                        data-testid={`chip-tag-${tag.replace(/\s+/g, '-').toLowerCase()}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
