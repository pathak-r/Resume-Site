import { useEffect } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/layout/navbar";
import Hero from "@/components/sections/hero";
import InterviewAgent from "@/components/agent/interview-agent";
import Projects from "@/components/sections/projects";
import Education from "@/components/sections/education";
import Closing from "@/components/sections/closing";

function focusAgent() {
  document.querySelector("#interview")?.scrollIntoView({ behavior: "smooth" });
  window.dispatchEvent(new CustomEvent("agent:focus"));
}

export default function Home() {
  const [location] = useLocation();

  useEffect(() => {
    if (location === "/hello" || window.location.hash === "#interview") {
      const id = window.setTimeout(focusAgent, 50);
      return () => window.clearTimeout(id);
    }
  }, [location]);

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: "transparent", color: "var(--cat-text)" }}
    >
      <Navbar />
      <main className="catalog-page-stack">
        <Hero />
        <InterviewAgent />
        <Projects />
        <Education />
        <Closing />
      </main>

      <footer
        style={{
          maxWidth: "var(--cat-panel-max)",
          margin: "0 auto",
          width: "100%",
          padding: "1.25rem 1.5rem 1.75rem",
          borderTop: "1px solid var(--cat-rule)",
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
          fontFamily: "var(--cat-font-mono)",
          fontSize: "0.68rem",
          letterSpacing: "0.06em",
          color: "var(--cat-text-tertiary)",
          background: "transparent",
        }}
      >
        <span>© {new Date().getFullYear()} Rohit Pathak · Technical Product Manager · Abu Dhabi, UAE</span>
      </footer>
    </div>
  );
}
