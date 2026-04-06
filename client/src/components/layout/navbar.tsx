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
    { name: "Experience", href: "#experience" },
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
      "fixed top-0 w-full z-50 transition-all duration-300",
      scrolled ? "glass-nav shadow-ambient py-4" : "bg-transparent py-6"
    )}>
      <div className="container mx-auto px-6 flex items-center justify-between max-w-6xl">
        <Link href="/" className="text-lg font-bold tracking-tight" style={{ color: 'var(--lf-on-surface)' }}>
          rohit pathak<span style={{ color: 'var(--lf-primary)' }}>.</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              data-testid={`nav-link-${link.name.toLowerCase()}`}
              onClick={(e) => scrollToSection(e, link.href)}
              className="text-sm font-medium transition-colors"
              style={{ color: 'var(--lf-muted-foreground, #6b7071)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--lf-on-surface)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--lf-muted-foreground, #6b7071)')}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden p-2"
          style={{ color: 'var(--lf-on-surface)' }}
          onClick={() => setIsOpen(!isOpen)}
          data-testid="button-mobile-menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="md:hidden absolute top-full left-0 w-full p-6 flex flex-col gap-4 shadow-ambient"
          style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(20px)' }}
        >
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="text-lg font-semibold py-2"
              style={{ color: 'var(--lf-on-surface)' }}
            >
              {link.name}
            </a>
          ))}
          <a
            href="/Rohit_Pathak_CV.pdf"
            download
            data-testid="button-resume-download-mobile"
            className="btn-primary-gradient text-center px-6 py-3 text-base font-semibold mt-2"
          >
            Download Resume
          </a>
        </div>
      )}
    </nav>
  );
}
