import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";

export default function Hero() {
  return (
    <section
      className="relative min-h-[90vh] flex items-center overflow-hidden surface-base"
      style={{ paddingTop: '7rem' }}
    >
      {/* Decorative background gradient blob */}
      <div
        className="absolute top-0 right-0 w-[55vw] h-[70vh] rounded-full opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 70% 30%, #ff7668 0%, #0ac4fd 60%, transparent 80%)',
          filter: 'blur(60px)',
          transform: 'translate(20%, -20%)',
        }}
      />

      <div className="container relative z-10 px-6 mx-auto max-w-6xl">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span
              className="inline-block px-4 py-1.5 text-sm font-semibold rounded-full"
              style={{
                background: 'var(--lf-surface-container-lowest, #ffffff)',
                color: 'var(--lf-primary)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                boxShadow: '0 2px 16px rgba(44,47,48,0.06)',
              }}
              data-testid="text-role-badge"
            >
              Senior Product Manager · Enterprise AI
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-bold leading-tight mb-6"
            style={{
              fontSize: 'clamp(2.8rem, 6vw, 4.5rem)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              color: 'var(--lf-on-surface)',
            }}
            data-testid="text-hero-headline"
          >
            Product Strategy<br />
            <span style={{ color: 'var(--lf-primary)' }}>meets</span>{' '}
            <span style={{ color: 'var(--lf-tertiary)' }}>Enterprise AI.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mb-10 leading-relaxed"
            style={{
              fontSize: '1.125rem',
              color: '#6b7071',
              maxWidth: '600px',
              letterSpacing: '0.01em',
            }}
            data-testid="text-hero-description"
          >
            Bridging the gap between complex AI capabilities and real-world business value.
            Building GenAI copilots, RAG systems, and scalable SaaS platforms.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-start gap-4"
          >
            <a
              href="#work"
              data-testid="button-view-work"
              className="btn-primary-gradient flex items-center gap-2 px-8 py-3.5 text-base font-semibold"
            >
              View Selected Work <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/Rohit_Pathak_CV.pdf"
              download
              data-testid="button-download-cv"
              className="flex items-center gap-2 px-8 py-3.5 text-base font-semibold rounded-full transition-all duration-200"
              style={{
                background: 'var(--lf-surface-container-lowest, #ffffff)',
                color: 'var(--lf-on-surface)',
                boxShadow: '0 2px 16px rgba(44,47,48,0.07)',
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 24px rgba(44,47,48,0.13)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 2px 16px rgba(44,47,48,0.07)')}
            >
              Download CV <Download className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Stat row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="flex flex-wrap gap-10 mt-16"
          >
            {[
              { value: "10+", label: "Years of Experience" },
              { value: "3x", label: "Engineering Throughput" },
              { value: "40%", label: "Support Deflection via RAG" },
            ].map((stat) => (
              <div key={stat.label} data-testid={`stat-${stat.value.replace(/\W/g, '')}`}>
                <div
                  className="font-bold"
                  style={{ fontSize: '2rem', color: 'var(--lf-primary)', letterSpacing: '-0.02em' }}
                >
                  {stat.value}
                </div>
                <div className="label-meta mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
