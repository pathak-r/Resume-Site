import { useEffect } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/layout/navbar";
import Hero from "@/components/sections/hero";
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
        <Projects />
        <Education />
        <Closing />
      </main>
    </div>
  );
}
