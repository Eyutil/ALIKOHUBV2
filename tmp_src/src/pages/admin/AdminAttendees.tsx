import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Users, CheckCircle, XCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

const AdminAttendees = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: registrations, isLoading } = useQuery({
    queryKey: ["admin-attendees"],
    queryFn: async () => {
      const { data } = await api.get("/manage/events/registrations");
      return data ?? [];
    },
    enabled: !!user,
  });

  const checkinMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/manage/events/registrations/${id}/checkin`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-attendees"] });
      toast.success("Check-in status updated");
    },
    onError: (e: any) => toast.error(e.response?.data?.message || e.message),
  });

  const filtered = registrations?.filter((r: any) =>
    r.attendeeName.toLowerCase().includes(search.toLowerCase()) ||
    r.attendeeEmail.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-display text-foreground">Attendees</h1>
        <p className="text-sm text-muted-foreground font-body mt-1">View all registrations across your events</p>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search attendees..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 rounded-xl" />
      </motion.div>

      {isLoading ? (
        <div className="text-center py-16 text-muted-foreground font-body">Loading...</div>
      ) : !filtered?.length ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <Users className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground font-body">{search ? "No results found." : "No registrations yet."}</p>
        </motion.div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((r: any, i: number) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-card border border-border/60 rounded-2xl p-4 flex items-center gap-4 hover:shadow-card transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet to-indigo flex items-center justify-center text-sm font-bold text-primary-foreground flex-shrink-0 shadow-sm">
                {r.attendeeName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body font-semibold text-foreground text-sm truncate">{r.attendeeName}</p>
                <p className="text-xs text-muted-foreground font-body truncate">{r.attendeeEmail}</p>
              </div>
              <div className="hidden md:block text-xs text-muted-foreground font-body truncate max-w-[150px]">{r.event?.title}</div>
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-body font-medium hidden sm:block ${
                r.paymentStatus === "paid" ? "bg-emerald/15 text-emerald" : "bg-secondary/15 text-secondary"
              }`}>{r.paymentStatus}</span>
              <button 
                onClick={() => checkinMutation.mutate(r.id)}
                className="flex items-center gap-1 text-xs font-body hover:scale-105 transition-transform"
              >
                {r.isCheckedIn ? (
                  <><CheckCircle className="w-3.5 h-3.5 text-emerald" /><span className="text-emerald hidden sm:inline font-medium">In</span></>
                ) : (
                  <><XCircle className="w-3.5 h-3.5 text-muted-foreground/50" /><span className="text-muted-foreground hidden sm:inline">No</span></>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAttendees;
