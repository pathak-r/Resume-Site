import { motion } from "framer-motion";
import { ArrowRight, Download, BarChart2, MessageSquare, Zap, Linkedin } from "lucide-react";
import { Link } from "wouter";

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden surface-base"
      style={{ paddingTop: '7rem', paddingBottom: '1rem' }}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left — headline + CTAs + stats */}
          <div>
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
              className="font-bold leading-tight mb-10"
              style={{
                fontSize: 'clamp(2rem, 3.8vw, 3.5rem)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                color: 'var(--lf-on-surface)',
              }}
              data-testid="text-hero-headline"
            >
              Senior PM.<br />
              <span style={{ color: 'var(--lf-primary)' }}>Enterprise AI.</span><br />
              <span style={{ color: 'var(--lf-tertiary)', fontSize: '0.6em', letterSpacing: '-0.01em' }}>Abu Dhabi · 10+ Years of Experience</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col items-start gap-3"
            >
              {/* Row 1: View Selected Work + Download CV */}
              <div className="flex items-center gap-3">
                <a
                  href="#work"
                  data-testid="button-view-work"
                  className="btn-primary-gradient flex items-center gap-2 px-8 py-3.5 text-base font-semibold whitespace-nowrap"
                >
                  View Selected Work <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="/Rohit_Pathak_CV.pdf"
                  download
                  data-testid="button-download-cv"
                  className="flex items-center gap-2 px-8 py-3.5 text-base font-semibold rounded-full transition-all duration-200 whitespace-nowrap"
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
              </div>
              {/* Row 2: Connect on LinkedIn */}
              <a
                href="https://www.linkedin.com/in/pathakrohit/"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="button-linkedin"
                className="btn-primary-gradient flex items-center gap-2 px-8 py-3.5 text-base font-semibold whitespace-nowrap"
              >
                <Linkedin className="w-4 h-4" /> Connect on LinkedIn
              </a>
            </motion.div>

          </div>

          {/* Right — Featured project card */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Link href="/geo-agentic-int" data-testid="card-geo-feature">
              <div
                className="relative rounded-3xl p-7 cursor-pointer transition-all duration-300 overflow-hidden group"
                style={{
                  background: '#ffffff',
                  boxShadow: '0 8px 40px rgba(44,47,48,0.10)',
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 16px 56px rgba(44,47,48,0.16)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 8px 40px rgba(44,47,48,0.10)')}
              >
                {/* Subtle gradient shimmer in top-right */}
                <div
                  className="absolute top-0 right-0 w-56 h-56 rounded-full pointer-events-none opacity-30 group-hover:opacity-50 transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(ellipse at 80% 20%, #0ac4fd 0%, #ff7668 60%, transparent 80%)',
                    filter: 'blur(40px)',
                    transform: 'translate(30%, -30%)',
                  }}
                />

                {/* Live badge */}
                <div className="flex items-center justify-between mb-5">
                  <span className="chip-teal flex items-center gap-1.5" style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.03em' }}>
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ background: '#0ac4fd', boxShadow: '0 0 8px #0ac4fd' }}
                    />
                    What I'm currently building
                  </span>
                  <ArrowRight
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                    style={{ color: '#abadae' }}
                  />
                </div>

                {/* Title */}
                <h3
                  className="font-bold mb-1"
                  style={{ fontSize: '1.3rem', letterSpacing: '-0.02em', color: 'var(--lf-on-surface)' }}
                >
                  Volve Field AI Explorer
                </h3>
                <p className="text-base mb-3" style={{ color: '#6b7071', lineHeight: 1.6 }}>
                  I collect daily drilling reports, production data, and well completion reports (both structured and unstructured data) from Equinor's Volve field, the most comprehensive open subsurface dataset ever released from the Norwegian Continental Shelf, to build an agentic RAG system.
                </p>
                <p className="text-base mb-2" style={{ color: '#6b7071', lineHeight: 1.6 }}>
                  This visualizes production trends and anomalies, and answers questions like:
                </p>
                <ul className="mb-6" style={{ color: '#6b7071', lineHeight: 1.7, paddingLeft: '1.25rem', listStyleType: 'disc' }}>
                  <li className="text-base mb-1">Why is this well's water cut rising?</li>
                  <li className="text-base mb-1">What's the decline rate for the well F-1 C over the last 12 months?</li>
                  <li className="text-base">What drilling problems were encountered in F-12 that could explain current production behavior?</li>
                </ul>

                {/* Feature pills */}
                <div className="flex flex-wrap gap-2 mb-7">
                  {[
                    { icon: BarChart2, label: 'Production Analytics' },
                    { icon: Zap, label: 'Anomaly Detection' },
                    { icon: MessageSquare, label: 'AI Chat' },
                  ].map(({ icon: Icon, label }) => (
                    <span
                      key={label}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                      style={{ background: '#f5f6f7', color: '#6b7071' }}
                    >
                      <Icon className="w-3 h-3" />
                      {label}
                    </span>
                  ))}
                </div>

                {/* Mini stat strip */}
                <div
                  className="flex gap-6 pt-5"
                  style={{ borderTop: '1px solid #eff1f2' }}
                >
                  {[
                    { value: '7', label: 'Wells' },
                    { value: '15K+', label: 'Data Points' },
                    { value: '9 yrs', label: 'Production History' },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="font-bold text-base" style={{ color: 'var(--lf-primary)', letterSpacing: '-0.02em' }}>
                        {s.value}
                      </div>
                      <div className="label-meta" style={{ fontSize: '0.7rem' }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-6">
                  <span className="btn-primary-gradient inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold pointer-events-none">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
