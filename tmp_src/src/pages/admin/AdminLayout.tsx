import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, Calendar, Users, Ticket, Mail, BarChart3, Settings,
  ChevronLeft, ChevronRight, LogOut, ClipboardCheck, Heart, Menu, X, Image, Sparkles, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/admin" },
  { label: "Events", icon: Calendar, href: "/admin/events" },
  { label: "Attendees", icon: Users, href: "/admin/attendees" },
  { label: "Proposals", icon: FileText, href: "/admin/proposals" },
  { label: "Tickets", icon: Ticket, href: "/admin/tickets" },
  { label: "RSVPs", icon: Heart, href: "/admin/rsvps" },
  { label: "Check-in", icon: ClipboardCheck, href: "/admin/checkin" },
  { label: "Messaging", icon: Mail, href: "/admin/messaging" },
  { label: "Media", icon: Image, href: "/admin/media" },
  { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user, eventsProfile } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-muted/40">
      {/* ... ambient background remains same ... */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-muted via-background to-muted" />
        <div className="absolute top-[-5%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, hsl(var(--teal)), transparent 70%)" }} />
        <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, hsl(var(--violet)), transparent 70%)" }} />
      </div>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 justify-between bg-card/95 backdrop-blur-md border-b border-border/60 shadow-sm">
        <button onClick={() => setMobileOpen(!mobileOpen)} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
          <Menu className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-green-light flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-primary text-sm">Aliko Admin</span>
        </div>
        <div className="w-9" />
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-40 h-screen bg-card border-r border-border/60 transition-all duration-300 ease-in-out flex flex-col shadow-sm
        ${collapsed ? "w-[68px]" : "w-[260px]"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-border/60 gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-green-light flex items-center justify-center flex-shrink-0 shadow-md">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              className="font-display font-bold text-primary text-base whitespace-nowrap overflow-hidden"
            >
              Aliko Admin
            </motion.span>
          )}
          <button
            onClick={() => { setCollapsed(!collapsed); setMobileOpen(false); }}
            className="hidden lg:flex ml-auto w-7 h-7 rounded-lg bg-muted/80 hover:bg-muted items-center justify-center transition-colors flex-shrink-0"
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />}
          </button>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden ml-auto">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-body transition-all duration-200 ${
                  active
                    ? "bg-primary text-primary-foreground font-semibold shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                } ${collapsed ? "justify-center px-0" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className={`w-[18px] h-[18px] flex-shrink-0 ${active ? "" : "group-hover:text-primary"} transition-colors`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="border-t border-border/60 p-3">
          {!collapsed && user && (
            <div className="flex items-center gap-3 px-2 mb-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-xs font-bold text-primary flex-shrink-0 shadow-sm">
                {(user.firstname || user.email || "U").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground font-body truncate">{user.firstname || "User"}</p>
                <p className="text-[10px] text-muted-foreground font-body truncate">{user.email}</p>
                <p className="text-[10px] text-primary/70 font-display font-medium uppercase">{eventsProfile?.role.replace('_', ' ')}</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className={`font-body text-xs w-full rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors ${collapsed ? "px-2" : ""}`}
          >
            <LogOut className="w-3.5 h-3.5" />
            {!collapsed && <span className="ml-2">Sign Out</span>}
          </Button>
        </div>
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 min-h-screen pt-14 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
