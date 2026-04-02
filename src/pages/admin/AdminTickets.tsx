import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Ticket, DollarSign, Hash } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const AdminTickets = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [form, setForm] = useState({ name: "", price: "0", quantity: "100" });

  const { data: events } = useQuery({
    queryKey: ["admin-events-list"],
    queryFn: async () => {
      const { data } = await api.get("/manage/events", {
        params: { type: "EVENT" }
      });
      return data.items ?? [];
    },
    enabled: !!user,
  });

  const { data: tickets, isLoading } = useQuery({
    queryKey: ["admin-tickets"],
    queryFn: async () => {
      const { data } = await api.get("/manage/events/tickets");
      return data.map((t: any) => ({ 
        ...t, 
        event_title: t.event?.title || "Unknown Event" 
      }));
    },
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      await api.post("/manage/events/tickets", {
        eventId: selectedEvent,
        name: form.name,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tickets"] });
      toast.success("Ticket tier created!");
      setOpen(false);
      setForm({ name: "", price: "0", quantity: "100" });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/manage/events/tickets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tickets"] });
      toast.success("Ticket deleted");
    },
    onError: (e: any) => toast.error(e.response?.data?.message || e.message),
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: { id: string; name: string; price: number; quantity: number }) => {
      await api.patch(`/manage/events/tickets/${payload.id}`, {
        name: payload.name,
        price: payload.price,
        quantity: payload.quantity,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tickets"] });
      toast.success("Ticket updated!");
      setOpen(false);
      setEditingTicket(null);
    },
    onError: (e: any) => toast.error(e.response?.data?.message || e.message),
  });

  const [editingTicket, setEditingTicket] = useState<any>(null);

  const handleEdit = (ticket: any) => {
    setEditingTicket(ticket);
    setSelectedEvent(ticket.eventId);
    setForm({ 
      name: ticket.name, 
      price: ticket.price.toString(), 
      quantity: ticket.quantity.toString() 
    });
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Tickets</h1>
          <p className="text-sm text-muted-foreground font-body mt-1">Manage ticket tiers for your events</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if(!v) setEditingTicket(null); }}>
          <DialogTrigger asChild>
            <Button onClick={() => { setForm({ name: "", price: "0", quantity: "100" }); setSelectedEvent(""); }} className="font-body rounded-xl gap-2 shadow-md"><Plus className="w-4 h-4" />Add Tier</Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <DialogHeader><DialogTitle className="font-display">{editingTicket ? "Edit Ticket Tier" : "New Ticket Tier"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              {!editingTicket && (
                <div>
                  <Label className="font-body text-xs">Event</Label>
                  <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                    <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select event" /></SelectTrigger>
                    <SelectContent>{events?.map((e: any) => <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              )}
              <div><Label className="font-body text-xs">Tier Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Early Bird" className="rounded-xl" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="font-body text-xs">Price ($)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="rounded-xl" /></div>
                <div><Label className="font-body text-xs">Quantity</Label><Input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="rounded-xl" /></div>
              </div>
              <Button 
                onClick={() => editingTicket ? updateMutation.mutate({ id: editingTicket.id, ...form, price: parseFloat(form.price), quantity: parseInt(form.quantity) }) : createMutation.mutate()} 
                className="w-full font-body rounded-xl" 
                disabled={(!selectedEvent && !editingTicket) || !form.name || createMutation.isPending || updateMutation.isPending}
              >
                {editingTicket ? "Update Ticket Tier" : "Create Ticket Tier"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {isLoading ? (
        <div className="text-center py-16 text-muted-foreground font-body">Loading...</div>
      ) : !tickets?.length ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <Ticket className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground font-body">No ticket tiers yet.</p>
        </motion.div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tickets.map((t: any, i: number) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border/60 rounded-2xl p-5 hover:shadow-card transition-all group relative"
            >
              <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(t)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors">
                  <Plus className="w-3.5 h-3.5 rotate-45" /> {/* Placeholder for Pencil icon if not imported */}
                </button>
                <button onClick={() => deleteMutation.mutate(t.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet to-indigo flex items-center justify-center mb-4 shadow-sm">
                <Ticket className="w-4 h-4 text-primary-foreground" />
              </div>
              <h3 className="font-display font-bold text-foreground text-sm mb-1">{t.name}</h3>
              <p className="text-xs text-muted-foreground font-body mb-4 truncate">{t.event_title}</p>
              <div className="flex items-center gap-4 text-xs font-body text-muted-foreground">
                <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />${t.price}</span>
                <span className="flex items-center gap-1"><Hash className="w-3 h-3" />{t.quantity} qty</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTickets;
