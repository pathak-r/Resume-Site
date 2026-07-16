import Navbar from "@/components/layout/navbar";
import Hero from "@/components/sections/hero";
import InterviewAgent from "@/components/agent/interview-agent";
import Projects from "@/components/sections/projects";
import About from "@/components/sections/about";
import Contact from "@/components/sections/contact";

export default function Home() {
  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: "var(--cat-bg)", color: "var(--cat-text)" }}
    >
      <Navbar />
      <main className="catalog-page-stack">
        <Hero />
        <InterviewAgent />
        <Projects />
        <About />
        <Contact />
      </main>

      <footer
        style={{
          background: "var(--cat-bg)",
          color: "var(--cat-text-tertiary)",
          fontSize: "12px",
          padding: "2.5rem 1rem",
          textAlign: "center",
          letterSpacing: "0.04em",
        }}
      >
        © {new Date().getFullYear()} Rohit Pathak · Senior Product Manager · Abu Dhabi, UAE
      </footer>
    </div>
  );
}
