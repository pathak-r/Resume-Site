import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const links = [
    { name: "Work", href: "#work" },
    { name: "About", href: "#about" },
    { name: "Experience", href: "#experience" },
    { name: "Contact", href: "#contact" },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (location !== "/") {
      window.location.href = `/${href}`;
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <nav
      className="fixed top-0 w-full z-50"
      style={{
        background: "var(--cat-bg)",
        borderBottom: "var(--cat-rule-width) solid var(--cat-rule)",
        fontFamily: "var(--cat-font)",
      }}
    >
      <div
        className="mx-auto px-4 flex items-baseline justify-between py-4"
        style={{ maxWidth: "calc(var(--cat-panel-max) + 4rem)" }}
      >
        <Link
          href="/"
          style={{ color: "var(--cat-text)", fontSize: "14px", fontWeight: 500 }}
          data-testid="link-logo"
        >
          rohit pathak
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-baseline gap-5">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              data-testid={`nav-link-${link.name.toLowerCase()}`}
              onClick={(e) => scrollToSection(e, link.href)}
              className="transition-colors"
              style={{
                color: "var(--cat-text-secondary)",
                fontSize: "13px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cat-text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--cat-text-secondary)")}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2"
          style={{ color: "var(--cat-text)" }}
          onClick={() => setIsOpen(!isOpen)}
          data-testid="button-mobile-menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="md:hidden absolute top-full left-0 w-full p-6 flex flex-col gap-3"
          style={{
            background: "var(--cat-bg)",
            borderBottom: "var(--cat-rule-width) solid var(--cat-rule)",
          }}
        >
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              style={{ color: "var(--cat-text)", fontSize: "14px", paddingTop: "0.5rem", paddingBottom: "0.5rem" }}
            >
              {link.name}
            </a>
          ))}
          <a
            href="/Rohit_Pathak_Resume.pdf"
            download
            data-testid="button-resume-download-mobile"
            className="catalog-btn catalog-btn--primary mt-2 justify-center"
          >
            Download CV
          </a>
        </div>
      )}
    </nav>
  );
}
