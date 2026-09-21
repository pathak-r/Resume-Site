export default function Closing() {
  return (
    <footer id="contact" className="rp-contact" data-testid="section-closing">
      <div className="rp-contact-links" data-testid="text-contact-line">
        <a href="mailto:write@rohitpathak.com" data-testid="link-contact-email">
          write@rohitpathak.com
        </a>
        <span className="rp-contact-separator" aria-hidden="true">
          ·
        </span>
        <a
          href="https://wa.me/971567874381"
          target="_blank"
          rel="noopener noreferrer"
          data-testid="link-contact-phone"
        >
          +971 567 874 381
        </a>
      </div>
      <p className="rp-location">Abu Dhabi, UAE</p>
    </footer>
  );
}
