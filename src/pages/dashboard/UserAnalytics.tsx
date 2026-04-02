import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";
import { useAuth } from "@/hooks/useAuth";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, Eye, Target, Calendar, MousePointer2, Info } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

const COLORS = ["#8B5CF6", "#10B981", "#F43F5E", "#F59E0B"];

const UserAnalytics = () => {
  const { user } = useAuth();
  const [eventId, setEventId] = useState("all");

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["user-analytics", eventId],
    queryFn: async () => {
      // Updated to match backend: /manage/events/:id/stats
      const url = eventId === "all" ? "/manage/events/all-stats" : `/manage/events/${eventId}/stats`;
      const { data } = await api.get(url);
      return data;
    },
    enabled: !!user,
  });

  const { data: eventsData } = useQuery({
    queryKey: ["user-events-analytics"],
    queryFn: async () => {
      const { data } = await api.get("/manage/events");
      return data;
    },
    enabled: !!user,
  });

  const events = eventsData?.items || [];

  const chartData = analyticsData?.chartData || [];
  const pieData = analyticsData?.pieData || [];

  const stats = [
    { label: "Total Views", value: analyticsData?.totalViews ?? 0, icon: Eye, color: "text-violet" },
    { label: "Total Registrations", value: analyticsData?.totalReg ?? 0, icon: Users, color: "text-emerald" },
    { label: "Conversion Rate", value: analyticsData?.convRate ? `${analyticsData.convRate}%` : "0%", icon: Target, color: "text-coral" },
    { label: "Avg. Daily Signups", value: analyticsData?.avgSignups ?? 0, icon: TrendingUp, color: "text-amber" },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/40">
        <div>
          <h1 className="text-4xl font-bold font-display text-foreground tracking-tight">Performance Analytics</h1>
          <p className="text-muted-foreground font-body mt-2 max-w-sm">Deeper insights into your event performance and engagement.</p>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-muted-foreground/40" />
          <Select value={eventId} onValueChange={setEventId}>
            <SelectTrigger className="h-12 w-[240px] rounded-xl bg-card border-border/60 focus:ring-4 focus:ring-primary/10 transition-all font-body font-bold"><SelectValue placeholder="Select an Event" /></SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl p-2 font-body max-h-[300px]">
              <SelectItem value="all" className="rounded-xl h-12 focus:bg-primary/5 text-sm font-bold">Aggregate: All Active Events</SelectItem>
              {events.map((e: any) => (
                <SelectItem key={e.id} value={e.id} className="rounded-xl h-12 focus:bg-primary/5 text-sm font-bold">{e.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="p-8 bg-card border border-border/50 rounded-[2.5rem] shadow-xl shadow-black/[0.01] hover:shadow-2xl hover:shadow-primary/5 transition-all group"
          >
            <div className={`w-14 h-14 rounded-2xl bg-muted/60 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
              <s.icon className={`w-6 h-6 ${s.color}`} />
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-black font-display text-foreground tracking-tight">{s.value}</p>
              <p className="text-xs font-bold font-body text-muted-foreground uppercase tracking-widest leading-none">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8 h-full">
           <div className="bg-card border border-border/50 rounded-[3rem] p-8 md:p-10 shadow-xl shadow-black/[0.01] h-full flex flex-col">
              <div className="flex items-center justify-between gap-4 mb-10 pl-2">
                 <div className="space-y-1">
                   <h3 className="text-xl font-bold font-display text-foreground leading-none">Registration Velocity</h3>
                   <p className="text-sm font-body text-muted-foreground">Sign-ups versus unique event views over the last 7 days.</p>
                 </div>
                 <div className="px-5 py-2.5 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 font-bold font-display text-xs tracking-wide">
                   +12.4% Increase
                 </div>
              </div>

              <div className="flex-1 min-h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 600}} dy={12} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 600}} dx={-12} />
                    <Tooltip 
                      contentStyle={{borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px', backgroundColor: '#fff'}} 
                      itemStyle={{fontSize: '12px', fontWeight: 'bold'}}
                    />
                    <Area type="monotone" dataKey="registrations" stroke="#8B5CF6" strokeWidth={4} fillOpacity={1} fill="url(#colorReg)" />
                    <Area type="monotone" dataKey="views" stroke="#CBD5E1" strokeWidth={2} strokeDasharray="4 4" fill="transparent" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>
        </div>

        <div className="space-y-8 flex flex-col justify-between">
           <div className="bg-card border border-border/50 rounded-[3rem] p-10 shadow-xl shadow-black/[0.01]">
              <h3 className="text-xl font-bold font-display text-foreground text-center mb-8">Traffic Sources</h3>
              <div className="h-[250px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="focus:outline-none" />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-black font-display text-foreground leading-none tracking-tight">1.2k</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Total Hits</span>
                </div>
              </div>
              <div className="space-y-3 mt-8">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between p-1 pl-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                      <span className="text-xs font-bold font-body text-muted-foreground">{d.name}</span>
                    </div>
                    <span className="text-xs font-black font-display text-foreground">{Math.round(d.value / 1200 * 100)}%</span>
                  </div>
                ))}
              </div>
           </div>

           <div className="bg-gradient-to-br from-secondary/80 to-accent text-primary-foreground rounded-[2.5rem] p-8 shadow-2xl shadow-primary/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                 <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                 </div>
                 <h4 className="text-xl font-bold font-display text-primary tracking-tight">Insight of the Week</h4>
                 <p className="text-xs font-body text-muted-foreground/80 leading-relaxed font-medium">Events published on <span className="font-bold text-primary">Friday afternoon</span> see an average view increase of <span className="font-bold text-primary">24%</span> within the first hour.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default UserAnalytics;
