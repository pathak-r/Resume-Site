import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: "Work", href: "#work" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent",
      scrolled ? "bg-background/90 backdrop-blur-md border-border py-4" : "bg-transparent py-6"
    )}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold font-heading tracking-tight text-white">
          ROHIT PATHAK
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="text-sm font-medium text-muted-foreground hover:text-white transition-colors uppercase tracking-widest"
            >
              {link.name}
            </a>
          ))}
          <a 
            href="/assets/Rohit_Pathak_CV.pdf" 
            download
            className="text-sm font-medium text-white border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-colors uppercase tracking-widest"
          >
            Resume
          </a>
        </div>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden p-2 text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border p-8 flex flex-col gap-6">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="text-2xl font-light text-white"
            >
              {link.name}
            </a>
          ))}
          <a 
            href="/assets/Rohit_Pathak_CV.pdf" 
            download
            className="text-lg font-medium text-muted-foreground pt-4 border-t border-border"
          >
            Download Resume
          </a>
        </div>
      )}
    </nav>
  );
}
