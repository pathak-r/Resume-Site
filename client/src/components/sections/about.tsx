import { motion } from "framer-motion";

const skills = [
  "Product Strategy",
  "Generative AI",
  "LLMs & RAG",
  "Enterprise SaaS",
  "MLOps Awareness",
  "Roadmapping",
  "Stakeholder Management",
  "Azure PaaS",
  "Agentic Systems",
  "Data Analytics",
];

export default function About() {
  return (
    <section id="about" style={{ background: 'var(--lf-surface-container-low, #eff1f2)', padding: '6rem 0' }}>
      <div className="container px-6 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="label-meta block mb-4" style={{ color: 'var(--lf-primary)' }}>About Me</span>
            <h2
              className="font-bold mb-8"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', letterSpacing: '-0.02em', color: 'var(--lf-on-surface)' }}
              data-testid="heading-about"
            >
              The Optimistic Architect.
            </h2>

            <div className="space-y-5" style={{ fontSize: '1rem', color: '#6b7071', lineHeight: 1.8, letterSpacing: '0.01em' }}>
              <p>
                I am an AI-driven Senior Product Manager with over a decade of experience building enterprise SaaS and industrial-tech solutions. My passion lies in translating complex technical capabilities into intuitive products that solve real business problems.
              </p>
              <p>
                Currently, I focus on Agentic AI and RAG systems, helping engineering teams automate workflows and access critical data faster. I believe in responsible AI development, balancing innovation with governance, security, and ethical standards.
              </p>
            </div>

            {/* Education */}
            <div className="mt-10 pt-10" style={{ borderTop: 'none' }}>
              <span className="label-meta block mb-6">Education</span>
              <div
                className="surface-lowest rounded-3xl p-8 shadow-ambient"
                style={{ borderRadius: '2rem' }}
              >
                <div className="space-y-6">
                  <div data-testid="text-education-ms">
                    <div className="font-bold text-lg" style={{ color: 'var(--lf-on-surface)', letterSpacing: '-0.01em' }}>
                      M.S. Mechanical Engineering
                    </div>
                    <div className="text-sm mt-1" style={{ color: '#6b7071' }}>North Carolina State University</div>
                  </div>
                  <div data-testid="text-education-btech">
                    <div className="font-bold text-lg" style={{ color: 'var(--lf-on-surface)', letterSpacing: '-0.01em' }}>
                      B.Tech Mechanical Engineering
                    </div>
                    <div className="text-sm mt-1" style={{ color: '#6b7071' }}>National Institute of Technology (NIT) Rourkela</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <span className="label-meta block mb-4" style={{ color: 'var(--lf-secondary)' }}>Core Expertise</span>
            <h2
              className="font-bold mb-8"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', letterSpacing: '-0.02em', color: 'var(--lf-on-surface)' }}
              data-testid="heading-expertise"
            >
              What I bring to the table.
            </h2>

            <div className="flex flex-wrap gap-3">
              {skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-5 py-2.5 surface-lowest shadow-ambient rounded-full font-semibold transition-all duration-200"
                  style={{
                    fontSize: '0.925rem',
                    color: 'var(--lf-on-surface)',
                    letterSpacing: '0.01em',
                    cursor: 'default',
                  }}
                  data-testid={`chip-skill-${i}`}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(44,47,48,0.1)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow = '';
                    (e.currentTarget as HTMLElement).style.transform = '';
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
