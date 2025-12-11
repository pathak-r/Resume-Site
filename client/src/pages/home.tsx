import Navbar from "@/components/layout/navbar";
import Hero from "@/components/sections/hero";
import Experience from "@/components/sections/experience";
import Skills from "@/components/sections/skills";
import Education from "@/components/sections/education";
import Contact from "@/components/sections/contact";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <main>
        <Hero />
        <Experience />
        <Skills />
        <Education />
        <Contact />
      </main>
      
      <footer className="py-8 text-center text-sm text-muted-foreground bg-secondary/20 border-t border-border/50">
        <div className="container mx-auto px-6">
          <p>© {new Date().getFullYear()} Rohit Pathak. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
