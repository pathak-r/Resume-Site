import Navbar from "@/components/layout/navbar";
import Hero from "@/components/sections/hero";
import FeaturedWork from "@/components/sections/featured-work";
import Experience from "@/components/sections/experience";
import About from "@/components/sections/about";
import Contact from "@/components/sections/contact";

export default function Home() {
  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: 'var(--lf-surface, #f5f6f7)', color: 'var(--lf-on-surface, #2c2f30)' }}
    >
      <Navbar />
      <main>
        <Hero />
        <FeaturedWork />
        <Experience />
        <About />
        <Contact />
      </main>

      <footer
        className="py-10 text-center"
        style={{
          background: 'var(--lf-surface, #f5f6f7)',
          color: '#abadae',
          fontSize: '0.875rem',
          fontWeight: 500,
        }}
      >
        <div className="container mx-auto px-6 max-w-6xl">
          <p>© {new Date().getFullYear()} Rohit Pathak · Senior Product Manager · Abu Dhabi, UAE</p>
        </div>
      </footer>
    </div>
  );
}
