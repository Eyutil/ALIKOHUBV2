import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, CheckCircle, UserCheck, Users } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const AdminCheckin = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedEvent, setSelectedEvent] = useState("");
  const [search, setSearch] = useState("");

  const { data: events } = useQuery({
    queryKey: ["checkin-events-list"],
    queryFn: async () => {
      const { data } = await api.get("/manage/events", {
        params: { type: "EVENT" }
      });
      return data.items ?? [];
    },
    enabled: !!user,
  });

  const { data: registrations, isLoading } = useQuery({
    queryKey: ["admin-attendees"], // Reuse cache or separate if needed
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
      toast.success("Checked in!");
    },
  });

  const eventRegistrations = registrations?.filter((r: any) => r.eventId === selectedEvent) ?? [];

  const filtered = eventRegistrations?.filter((r: any) =>
    r.attendeeName.toLowerCase().includes(search.toLowerCase()) ||
    r.attendeeEmail.toLowerCase().includes(search.toLowerCase())
  );

  const checkedIn = eventRegistrations?.filter((r: any) => r.isCheckedIn).length ?? 0;
  const total = eventRegistrations?.length ?? 0;
  const pct = total > 0 ? Math.round((checkedIn / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-display text-foreground">Check-in</h1>
        <p className="text-sm text-muted-foreground font-body mt-1">Manage attendee check-ins at your events</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <Label className="font-body text-xs mb-1 block">Select Event</Label>
        <Select value={selectedEvent} onValueChange={setSelectedEvent}>
          <SelectTrigger className="max-w-md rounded-xl"><SelectValue placeholder="Choose event" /></SelectTrigger>
          <SelectContent>{events?.map((e: any) => <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>)}</SelectContent>
        </Select>
      </motion.div>

      {selectedEvent && (
        <>
          {/* Stats + search */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 rounded-xl" />
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-card border border-border/60 rounded-xl px-4 py-2.5 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald" />
                <span className="text-sm font-body"><span className="font-bold text-foreground">{checkedIn}</span><span className="text-muted-foreground">/{total}</span></span>
              </div>
              <div className="bg-card border border-border/60 rounded-xl px-4 py-2.5">
                <span className="text-sm font-body font-bold text-foreground">{pct}%</span>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-16 text-muted-foreground font-body">Loading...</div>
          ) : !filtered?.length ? (
            <div className="text-center py-16">
              <Users className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground font-body">{search ? "No results." : "No registrations."}</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {filtered.map((r: any, i: number) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className={`bg-card border rounded-2xl p-4 flex items-center gap-4 transition-all ${
                    r.isCheckedIn ? "border-emerald/30 bg-emerald/[0.03]" : "border-border/60 hover:shadow-card"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-primary-foreground flex-shrink-0 shadow-sm ${
                    r.isCheckedIn ? "bg-gradient-to-br from-emerald to-teal" : "bg-gradient-to-br from-primary to-green-light"
                  }`}>
                    {r.attendeeName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-semibold text-foreground text-sm truncate">{r.attendeeName}</p>
                    <p className="text-xs text-muted-foreground font-body truncate">{r.attendeeEmail}</p>
                  </div>
                  {r.isCheckedIn ? (
                    <span className="flex items-center gap-1.5 text-emerald text-xs font-body font-medium">
                      <CheckCircle className="w-4 h-4" /> Checked In
                    </span>
                  ) : (
                    <Button size="sm" onClick={() => checkinMutation.mutate(r.id)} className="font-body rounded-xl shadow-sm">
                      Check In
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminCheckin;
