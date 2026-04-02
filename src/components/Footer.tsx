import { Link } from "react-router-dom";
import logoMain from "@/assets/logo-main-white.png";

interface FooterProps {
  portal: "professional" | "social";
}

const Footer = ({ portal }: FooterProps) => {
  const otherPortal = portal === "professional" ? "social" : "professional";

  const portalLinks = portal === "professional"
    ? [
        { label: "Home", href: "/professional" },
        { label: "Services", href: "/professional/services" },
        { label: "Portfolio", href: "/professional/portfolio" },
        { label: "Events", href: "/professional/events" },
        { label: "Request Proposal", href: "/professional/request-proposal" },
      ]
    : [
        { label: "Home", href: "/social" },
        { label: "Services", href: "/social/services" },
        { label: "Gallery", href: "/social/gallery" },
        { label: "Book Consultation", href: "/social/book-consultation" },
      ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to={`/${portal}`} className="inline-block mb-6">
              <img src={logoMain} alt="Aliko Events" className="h-20 w-auto" />
            </Link>
            <h3 className="sr-only">Aliko Events</h3>
            <div className="h-0.5 w-12 bg-gold mb-4" />
            <p className="text-sm text-primary-foreground/70 font-body leading-relaxed mb-2">
              Professional precision. Personal celebration.
            </p>
            <p className="text-sm text-primary-foreground/50 font-body">
              Connect • Inspire • Elevate
            </p>
          </div>
          <div>
            <h4 className="font-body font-semibold text-sm mb-3 text-gold">Platform</h4>
            <ul className="space-y-2 font-body text-sm text-primary-foreground/70">
              {portalLinks.map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="hover:text-primary-foreground transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-body font-semibold text-sm mb-3 text-gold">Company</h4>
            <ul className="space-y-2 font-body text-sm text-primary-foreground/70">
              <li><Link to={`/about?portal=${portal}`} className="hover:text-primary-foreground transition-colors">About</Link></li>
              <li><Link to={`/testimonials?portal=${portal}`} className="hover:text-primary-foreground transition-colors">Testimonials</Link></li>
              <li><Link to={`/contact?portal=${portal}`} className="hover:text-primary-foreground transition-colors">Contact</Link></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Terms</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-body font-semibold text-sm mb-3 text-gold">Switch Experience</h4>
            <Link
              to={`/${otherPortal}`}
              className="inline-flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground font-body transition-colors"
            >
              Go to {otherPortal === "professional" ? "Professional" : "Social"} Portal →
            </Link>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 pt-6 text-center text-xs text-primary-foreground/50 font-body">
          © {new Date().getFullYear()} Aliko Events. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
