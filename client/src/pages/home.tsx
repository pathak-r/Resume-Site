import Navbar from "@/components/layout/navbar";
import Hero from "@/components/sections/hero";
import FeaturedWork from "@/components/sections/featured-work";
import Experience from "@/components/sections/experience";
import About from "@/components/sections/about";
import Contact from "@/components/sections/contact";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-foreground selection:text-background">
      <Navbar />
      <main>
        <Hero />
        <FeaturedWork />
        <Experience />
        <About />
        <Contact />
      </main>
      
      <footer className="py-12 text-center text-sm font-medium text-muted-foreground bg-background border-t border-border">
        <div className="container mx-auto px-6">
          <p>© {new Date().getFullYear()} Rohit Pathak. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
