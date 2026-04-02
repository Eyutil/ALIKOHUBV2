import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Mail, Send, Bell, Users, CheckCircle, Info, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const AdminMessaging = () => {
  const { user } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState("");
  const [form, setForm] = useState({ subject: "", content: "", targetAudience: "ALL" });

  const { data: events } = useQuery({
    queryKey: ["messaging-events"],
    queryFn: async () => {
      const { data } = await api.get("/manage/events");
      return data.items ?? [];
    },
    enabled: !!user,
  });

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ["messaging-stats"],
    queryFn: async () => {
      const { data } = await api.get("/manage/events/messaging/stats");
      return data;
    },
    enabled: !!user,
  });

  const sendMutation = useMutation({
    mutationFn: async () => {
      if (!selectedEvent) throw new Error("Please select an event");
      const { data } = await api.post(`/manage/events/${selectedEvent}/message`, form);
      return data;
    },
    onSuccess: (res) => {
      toast.success(res.message || "Message dispatched!");
      setForm({ ...form, subject: "", content: "" });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || e.message),
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject || !form.content) return toast.error("Required fields missing");
    sendMutation.mutate();
  };

  const audienceOptions = [
    { value: "ALL", label: "All Registered/RSVP" },
    { value: "CHECKED_IN", label: "Only Checked-In (Pro)" },
    { value: "NOT_CHECKED_IN", label: "Absent Only (Pro)" },
    { value: "RSVP_YES", label: "Going Only (Social)" },
    { value: "RSVP_MAYBE", label: "Maybe Only (Social)" },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Messaging</h1>
          <p className="text-sm text-muted-foreground font-body mt-1">Send communications to your attendees and guests</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">Delivery Rate</p>
            <p className="text-lg font-bold text-emerald">{stats?.deliveryRate || 0}%</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">Open Rate</p>
            <p className="text-lg font-bold text-sky">{stats?.openRate || 0}%</p>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-card border border-border/60 rounded-2xl p-6 shadow-sm"
        >
          <form onSubmit={handleSend} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-body">Select Event</Label>
                <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Choose an event" />
                  </SelectTrigger>
                  <SelectContent>
                    {events?.map((e: any) => (
                      <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-body">Recipient Group</Label>
                <Select value={form.targetAudience} onValueChange={(v) => setForm({ ...form, targetAudience: v })}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {audienceOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-body">Subject Line</Label>
              <Input
                placeholder="Important update regarding your session..."
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-body">Message Body</Label>
              <Textarea
                placeholder="Type your message here..."
                rows={6}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="rounded-xl resize-none"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl font-body gap-2 shadow-md"
              disabled={sendMutation.isPending}
            >
              {sendMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {sendMutation.isPending ? "Sending..." : "Dispatch Message"}
            </Button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <Info className="w-5 h-5 text-primary" />
              <h3 className="font-display font-semibold text-sm">Best Practices</h3>
            </div>
            <ul className="space-y-3">
              {[
                "Keep subjects short and clear",
                "Personalize with attendee context",
                "Link to event resources if needed",
                "Clear CTA for next steps",
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground font-body">
                  <div className="w-1 h-1 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card border border-border/60 rounded-2xl p-5">
            <h3 className="font-display font-semibold text-sm mb-4">Channel Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-sky" />
                  <span className="text-xs font-body">Email Capacity</span>
                </div>
                <span className="text-xs font-bold text-foreground">Unlimited</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber" />
                  <span className="text-xs font-body">Push Notifications</span>
                </div>
                <span className="text-xs font-bold text-emerald">Enabled</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminMessaging;
