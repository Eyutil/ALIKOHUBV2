import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, Ticket, Heart, TrendingUp, Clock, Sparkles, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AdminOverview = () => {
  const { user, eventsProfile } = useAuth();

  const { data: statsData, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data } = await api.get("/manage/events/stats");
      return data;
    },
    enabled: !!user,
    refetchInterval: 10000, // Refetch every 10 seconds for real-time vibe
  });


  const stats = [
    { label: "Total Events", value: (statsData?.proEvents ?? 0) + (statsData?.socialEvents ?? 0), icon: Calendar, gradient: "from-teal to-emerald", href: "/admin/events" },
    { label: "Registrations", value: statsData?.totalReg ?? 0, icon: Ticket, gradient: "from-violet to-indigo", href: "/admin/attendees" },
    { label: "RSVPs", value: statsData?.totalRsvp ?? 0, icon: Heart, gradient: "from-rose to-coral", href: "/admin/rsvps" },
  ];

  const quickActions = [
    { label: "Create Event", href: "/admin/events", icon: Calendar, color: "bg-teal/10 text-teal border-teal/20" },
    { label: "View Analytics", href: "/admin/analytics", icon: TrendingUp, color: "bg-violet/10 text-violet border-violet/20" },
    { label: "Check-in", href: "/admin/checkin", icon: Clock, color: "bg-coral/10 text-coral border-coral/20" },
    { label: "Manage Media", href: "/admin/media", icon: Sparkles, color: "bg-amber/10 text-amber border-amber/20" },
  ];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl gradient-hero p-8 text-primary-foreground"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-primary-foreground/5 rounded-full blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="text-sm font-body text-primary-foreground/70">{greeting()}</span>
          </div>
          <h1 className="text-3xl font-bold font-display mb-2">
            Welcome back, {user?.firstname || "Admin"}!
          </h1>
          <p className="text-sm font-body text-primary-foreground/70 max-w-md">
            Here's what's happening with your events. Manage everything from this central hub.
            Role: <span className="font-semibold uppercase">{eventsProfile?.role.replace('_', ' ')}</span>
          </p>
        </div>
      </motion.div>

      {/* Stats cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
          >
            <Link to={s.href} className="group block">
              <div className="relative overflow-hidden bg-card border border-border/50 rounded-2xl p-6 shadow-card hover:shadow-elevated transition-all duration-300">
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${s.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-lg`}>
                    <s.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-4xl font-bold text-foreground mb-1">{s.value}</p>
                <span className="text-sm text-muted-foreground font-body">{s.label}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h2 className="text-lg font-semibold font-display text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((a) => (
            <Link
              key={a.label}
              to={a.href}
              className={`flex items-center gap-3 p-4 rounded-xl border ${a.color} hover:scale-[1.02] transition-all duration-200 font-body text-sm font-medium`}
            >
              <a.icon className="w-5 h-5" />
              <span>{a.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminOverview;
