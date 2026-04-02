import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, Users, Ticket, Heart, DollarSign, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const AdminAnalytics = () => {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const { data } = await api.get("/manage/events/stats");
      return data;
    },
    enabled: !!user,
  });

  const stats = [
    { label: "Professional Events", value: data?.proEvents ?? 0, icon: Calendar, gradient: "from-teal to-emerald" },
    { label: "Social Events", value: data?.socialEvents ?? 0, icon: Heart, gradient: "from-rose to-coral" },
    { label: "Registrations", value: data?.totalReg ?? 0, icon: Ticket, gradient: "from-violet to-indigo" },
    { label: "RSVPs", value: data?.totalRsvp ?? 0, icon: Users, gradient: "from-sky to-teal" },
    { label: "Revenue", value: `$${(data?.revenue ?? 0).toFixed(2)}`, icon: DollarSign, gradient: "from-secondary to-amber" },
    { label: "Checked In", value: data?.checkedIn ?? 0, icon: CheckCircle, gradient: "from-emerald to-teal" },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-display text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground font-body mt-1">Performance overview across all your events</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="relative overflow-hidden bg-card border border-border/60 rounded-2xl p-6 hover:shadow-card transition-all group"
          >
            <div className={`absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br ${s.gradient} opacity-[0.07] rounded-full blur-xl group-hover:opacity-[0.14] transition-opacity`} />
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-md`}>
                <s.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xs text-muted-foreground font-body">{s.label}</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{s.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminAnalytics;
