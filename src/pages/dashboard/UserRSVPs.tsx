import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Heart, Search, Calendar, UserCheck, Filter, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface RSVP {
  id: string;
  user: {
    firstname: string;
    lastname: string;
    email: string;
  };
  event: {
    title: string;
    id: string;
  };
  createdAt: string;
  status: string;
  guestsCount?: number;
}

const UserRSVPs = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const { data: rsvpsData, isLoading, refetch } = useQuery({
    queryKey: ["user-rsvps"],
    queryFn: async () => {
      // Backend: GET /manage/events/rsvps
      const { data } = await api.get("/manage/events/rsvps");
      return data;
    },
    enabled: !!user,
  });

  const rsvps = rsvpsData || [];

  const filteredRSVPs = rsvps.filter((r: RSVP) => 
    r.user.firstname.toLowerCase().includes(search.toLowerCase()) ||
    r.user.lastname.toLowerCase().includes(search.toLowerCase()) ||
    r.event.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/40">
        <div>
          <h1 className="text-4xl font-bold font-display text-foreground tracking-tight">Guest RSVPs</h1>
          <p className="text-muted-foreground font-body mt-2 max-w-sm">Manage responses for your social events and gatherings.</p>
        </div>
        <Button variant="outline" className="h-12 rounded-xl gap-2 font-body font-bold border-border/60 hover:bg-muted shadow-sm">
          <Download className="w-4 h-4" />
          Export Guest List
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search by name or social event title..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            className="h-14 pl-12 rounded-2xl bg-card border-border/40 focus:ring-4 focus:ring-primary/10 transition-all font-body font-medium shadow-sm" 
          />
        </div>
        <div className="flex items-center gap-2 bg-rose-50 dark:bg-rose-950/20 px-4 rounded-2xl border border-rose-100 dark:border-rose-900/50 text-rose-600">
          <Heart className="w-5 h-5 fill-current" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600/60 leading-none mb-1">Total Guests</span>
            <span className="text-lg font-bold font-display leading-none">{filteredRSVPs.reduce((acc: number, curr: RSVP) => acc + (curr.guestsCount || 1), 0)}</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 rounded-3xl bg-card animate-pulse border border-border/20" />)}
        </div>
      ) : !filteredRSVPs.length ? (
        <div className="text-center py-32 bg-card/40 border border-dashed border-border/60 rounded-[3rem]">
          <Heart className="w-16 h-16 text-muted-foreground/20 mx-auto mb-6" />
          <h3 className="text-2xl font-bold font-display text-foreground tracking-tight">No RSVPs found</h3>
          <p className="text-muted-foreground font-body max-w-xs mx-auto mb-8 text-sm">Your social events don't have any responses yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[2.5rem] border border-border/40 shadow-sm bg-card/60 backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/40 font-display text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">
                  <th className="px-8 py-5 border-b border-border/40">Guest</th>
                  <th className="px-8 py-5 border-b border-border/40">Social Event</th>
                  <th className="px-8 py-5 border-b border-border/40 text-center">Plus One</th>
                  <th className="px-8 py-5 border-b border-border/40">Status</th>
                  <th className="px-8 py-5 border-b border-border/40">Response Date</th>
                </tr>
              </thead>
              <tbody className="font-body">
                <AnimatePresence mode="popLayout">
                  {filteredRSVPs.map((r: RSVP, i: number) => (
                    <motion.tr
                      key={r.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="group border-b border-border/20 hover:bg-rose-50/50 dark:hover:bg-rose-950/5 transition-all"
                    >
                      <td className="px-8 py-6">
                        <div>
                          <p className="text-sm font-bold text-foreground group-hover:text-rose-600 transition-colors">{r.user.firstname} {r.user.lastname}</p>
                          <p className="text-xs text-muted-foreground">{r.user.email}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm font-semibold text-foreground/80">{r.event.title}</td>
                      <td className="px-8 py-6 text-center font-bold text-rose-600">+{r.guestsCount ? r.guestsCount - 1 : 0}</td>
                      <td className="px-8 py-6">
                        <span className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-100 text-emerald-700 border border-emerald-200">
                          {r.status || "GOING"}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-sm text-foreground/70">
                          <Calendar className="w-4 h-4 text-muted-foreground/40" />
                          {new Date(r.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRSVPs;
