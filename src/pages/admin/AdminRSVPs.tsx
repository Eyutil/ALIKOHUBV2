import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Heart, CheckCircle, XCircle, HelpCircle, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const AdminRSVPs = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: rsvps, isLoading } = useQuery({
    queryKey: ["admin-rsvps"],
    queryFn: async () => {
      const { data } = await api.get("/manage/events/rsvps");
      return data ?? [];
    },
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/manage/events/rsvps/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-rsvps"] });
      toast.success("RSVP removed");
    },
    onError: (e: any) => toast.error(e.response?.data?.message || "Failed to remove RSVP"),
  });

  const yesCount = rsvps?.filter((r: any) => r.response === "yes").length ?? 0;
  const noCount = rsvps?.filter((r: any) => r.response === "no").length ?? 0;
  const maybeCount = rsvps?.filter((r: any) => r.response === "maybe").length ?? 0;

  const summaryCards = [
    { label: "Attending", count: yesCount, icon: CheckCircle, gradient: "from-emerald to-teal" },
    { label: "Declined", count: noCount, icon: XCircle, gradient: "from-rose to-coral" },
    { label: "Maybe", count: maybeCount, icon: HelpCircle, gradient: "from-secondary to-amber" },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-display text-foreground">RSVPs</h1>
        <p className="text-sm text-muted-foreground font-body mt-1">Track responses for social events</p>
      </motion.div>

      {!isLoading && rsvps && rsvps.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {summaryCards.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-card border border-border/60 rounded-2xl p-5 text-center hover:shadow-card transition-all"
            >
              <div className={`w-10 h-10 mx-auto mb-3 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center shadow-sm`}>
                <c.icon className="w-4 h-4 text-primary-foreground" />
              </div>
              <p className="text-3xl font-bold text-foreground">{c.count}</p>
              <p className="text-xs text-muted-foreground font-body mt-1">{c.label}</p>
            </motion.div>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-16 text-muted-foreground font-body">Loading...</div>
      ) : !rsvps?.length ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <Heart className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground font-body">No RSVPs yet.</p>
        </motion.div>
      ) : (
        <div className="grid gap-3">
          {rsvps.map((r: any, i: number) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-card border border-border/60 rounded-2xl p-4 flex items-center gap-4 hover:shadow-card transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose to-coral flex items-center justify-center text-sm font-bold text-primary-foreground flex-shrink-0 shadow-sm">
                {r.guestName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body font-semibold text-foreground text-sm truncate">{r.guestName}</p>
                <p className="text-xs text-muted-foreground font-body truncate">{r.guestEmail}</p>
              </div>
              <div className="hidden md:block text-xs text-muted-foreground font-body truncate max-w-[140px]">{r.event?.title}</div>
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-body font-medium ${
                r.response === "yes" ? "bg-emerald/15 text-emerald" :
                r.response === "no" ? "bg-rose/15 text-rose" : "bg-secondary/15 text-secondary"
              }`}>{r.response}</span>
              {r.plusOneName && <span className="text-[10px] text-muted-foreground font-body hidden lg:block">+1: {r.plusOneName}</span>}
              <button 
                onClick={() => deleteMutation.mutate(r.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminRSVPs;
