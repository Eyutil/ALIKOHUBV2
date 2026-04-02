import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import logoProfessional from "@/assets/logo-professional.png";
import logoSocial from "@/assets/logo-social.png";

interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  portal: "professional" | "social";
}

const professionalLinks: NavItem[] = [
  { label: "Home", href: "/professional" },
  { label: "Services", href: "/professional/services" },
  { label: "Portfolio", href: "/professional/portfolio" },
  { label: "Events", href: "/professional/events" },
];

const socialLinks: NavItem[] = [
  { label: "Home", href: "/social" },
  { label: "Services", href: "/social/services" },
  { label: "Gallery", href: "/social/gallery" },
  { label: "Templates", href: "/social/templates" },
];

const Navbar = ({ portal }: NavbarProps) => {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, isContentManager, signOut } = useAuth();
  const location = useLocation();
  const links = portal === "professional" ? professionalLinks : socialLinks;
  const logo = portal === "professional" ? logoProfessional : logoSocial;
  const ctaText = portal === "professional" ? "Request Proposal" : "Book Consultation";
  const ctaHref = portal === "professional" ? "/professional/request-proposal" : "/social/book-consultation";

  return (
    <nav className="sticky top-0 z-40 bg-primary border-b border-primary/80 shadow-md">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to={`/${portal}`} className="flex items-center gap-2">
          <img src={logo} alt={`Aliko Events ${portal}`} className="h-9 w-auto" />
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-6 font-body text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className={`transition-colors hover:text-accent ${
                location.pathname === l.href
                  ? "text-accent font-semibold"
                  : "text-primary-foreground/80"
              }`}
            >
              {l.label}
            </Link>
          ))}
          {(isAdmin() || isContentManager()) && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 text-secondary font-semibold hover:text-accent transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          )}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={signOut}
              className="font-body text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          ) : (
            <Link to={`/${portal}/signin`}>
              <Button variant="ghost" size="sm" className="font-body text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                Sign In
              </Button>
            </Link>
          )}
          <Link to={ctaHref}>
            <Button size="sm" className="font-body bg-accent text-accent-foreground hover:bg-accent/90">
              {ctaText}
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 text-primary-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-primary-foreground/20 bg-primary px-4 pb-4 pt-2 space-y-2 font-body">
          {links.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm text-primary-foreground/90 hover:text-accent"
            >
              {l.label}
            </Link>
          ))}
          {/* Mobile Admin Link */}
          {(isAdmin() || isContentManager()) && (
            <div className="pt-2 border-t border-primary-foreground/10">
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/10 text-secondary font-semibold hover:bg-secondary/20 transition-colors"
              >
                <LayoutDashboard className="w-5 h-5 text-secondary" />
                Dashboard
              </Link>
            </div>
          )}
          <div className="pt-2 flex flex-col gap-2">
            {user ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => { setOpen(false); signOut(); }}
                className="w-full font-body border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            ) : (
              <Link to={`/${portal}/signin`}>
                <Button variant="outline" size="sm" className="w-full font-body border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  Sign In
                </Button>
              </Link>
            )}
            <Link to={ctaHref}>
              <Button size="sm" className="w-full font-body bg-accent text-accent-foreground hover:bg-accent/90">
                {ctaText}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
