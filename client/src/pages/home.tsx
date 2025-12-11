import Navbar from "@/components/layout/navbar";
import Hero from "@/components/sections/hero";
import FeaturedWork from "@/components/sections/featured-work";
import About from "@/components/sections/about";
import Contact from "@/components/sections/contact";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-white/20 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <FeaturedWork />
        <About />
        <Contact />
      </main>
      
      <footer className="py-12 text-center text-xs font-mono text-muted-foreground bg-background border-t border-border">
        <div className="container mx-auto px-6">
          <p>© {new Date().getFullYear()} Rohit Pathak. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
