import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, Ticket, Heart, TrendingUp, Clock, Sparkles, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const UserOverview = () => {
  const { user } = useAuth();

  const { data: statsData, isLoading } = useQuery({
    queryKey: ["user-stats"],
    queryFn: async () => {
      // Assuming a similar stats endpoint but filtered for the current user
      const { data } = await api.get("/manage/events/stats");
      return data;
    },
    enabled: !!user,
    refetchInterval: 30000,
  });

  const stats = [
    { label: "My Events", value: (statsData?.proEvents ?? 0) + (statsData?.socialEvents ?? 0), icon: Calendar, gradient: "from-teal to-emerald", href: "/dashboard/events" },
    { label: "Registrations", value: statsData?.totalReg ?? 0, icon: Ticket, gradient: "from-violet to-indigo", href: "/dashboard/attendees" },
    { label: "Social RSVPs", value: statsData?.totalRsvp ?? 0, icon: Heart, gradient: "from-rose to-coral", href: "/dashboard/rsvps" },
  ];

  const quickActions = [
    { label: "Create Event", href: "/dashboard/events", icon: Calendar, color: "bg-teal/10 text-teal border-teal/20" },
    { label: "My Proposals", href: "/dashboard/proposals", icon: TrendingUp, color: "bg-violet/10 text-violet border-violet/20" },
    { label: "Guest RSVPs", href: "/dashboard/rsvps", icon: Heart, color: "bg-rose/10 text-rose border-rose/20" },
    { label: "Message Attendees", href: "/dashboard/messaging", icon: Clock, color: "bg-coral/10 text-coral border-coral/20" },
    { label: "Analytics", href: "/dashboard/analytics", icon: Sparkles, color: "bg-amber/10 text-amber border-amber/20" },
  ];

  const getGreeting = () => {
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
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary to-primary/80 p-10 text-primary-foreground shadow-2xl shadow-primary/20"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-[100px] -mr-40 -mt-40" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -ml-32 -mb-32" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary-foreground/90">{getGreeting()}</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-4 tracking-tight">
            Hello, {user?.firstname || "Organizer"}!
          </h1>
          <p className="text-base font-body text-primary-foreground/80 max-w-lg leading-relaxed">
            Manage your event community and track your impact from your new organizer dashboard.
          </p>
        </div>
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
          >
            <Link to={s.href} className="group block h-full">
              <div className="h-full relative overflow-hidden bg-white dark:bg-card border border-border/40 rounded-[2rem] p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${s.gradient} opacity-0 group-hover:opacity-10 rounded-full blur-3xl transition-opacity duration-700`} />
                
                <div className="flex items-center justify-between mb-8">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-500`}>
                    <s.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-4xl font-bold text-foreground tracking-tighter">{isLoading ? "..." : s.value}</p>
                  <span className="text-sm text-muted-foreground font-body font-medium uppercase tracking-wider">{s.label}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h2 className="text-xl font-bold font-display text-foreground mb-6 flex items-center gap-2">
          Quick Actions
          <div className="h-px flex-1 bg-border/40 ml-4" />
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((a, i) => (
            <Link
              key={a.label}
              to={a.href}
              className={`flex items-center gap-4 p-5 rounded-2xl border ${a.color} hover:shadow-lg transition-all duration-300 group`}
            >
              <div className="w-10 h-10 rounded-xl bg-white/50 dark:bg-black/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <a.icon className="w-5 h-5" />
              </div>
              <span className="font-display font-bold text-sm tracking-tight">{a.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default UserOverview;
