import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "../../lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Send, Mail, Users, Info, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";

const UserMessaging = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [eventId, setEventId] = useState(searchParams.get("eventId") || "all");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const { data: eventsData } = useQuery({
    queryKey: ["user-events-messaging"],
    queryFn: async () => {
      const { data } = await api.get("/manage/events");
      return data;
    },
    enabled: !!user,
  });

  const events = eventsData?.items || [];

  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      const url = eventId === "all" ? "/manage/events/message-all" : `/manage/events/${eventId}/message`;
      await api.post(url, { subject, body });
    },
    onSuccess: () => {
      toast.success("Broadcast sent successfully!");
      setSubject("");
      setBody("");
    },
    onError: (e: any) => toast.error(e.response?.data?.message || "Failed to send message"),
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !body) {
      toast.error("Subject and Message are required");
      return;
    }
    sendMessageMutation.mutate();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="pb-8 border-b border-border/40 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold font-display text-foreground tracking-tight">Broadcast Center</h1>
        <p className="text-muted-foreground font-body mt-4 text-lg max-w-2xl leading-relaxed">Communicate directly with your event community and keep your guests up to date.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handleSend} className="space-y-6 bg-card border border-border/60 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-black/[0.02]">
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">Send to audience of:</label>
              <Select value={eventId} onValueChange={setEventId}>
                <SelectTrigger className="h-14 rounded-2xl bg-muted/20 border-border/60 focus:ring-4 focus:ring-primary/10 transition-all font-body font-bold"><SelectValue placeholder="Select an Event" /></SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-2xl p-2 font-body max-h-[300px]">
                  <SelectItem value="all" className="rounded-xl h-12 focus:bg-primary/5">All Active Events</SelectItem>
                  {events.map((e: any) => (
                    <SelectItem key={e.id} value={e.id} className="rounded-xl h-12 focus:bg-primary/5">{e.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">Broadcast Subject</label>
              <Input 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)} 
                placeholder="Important: Event Update, Logistics, or Welcome"
                className="h-14 rounded-2xl bg-muted/20 border-border/60 focus:ring-4 focus:ring-primary/10 transition-all font-body font-bold" 
              />
            </div>

            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">Compose Message</label>
              <Textarea 
                value={body} 
                onChange={(e) => setBody(e.target.value)} 
                placeholder="Write your update here... Use clear call to actions if needed."
                className="min-h-[250px] rounded-[2rem] bg-muted/20 border-border/60 focus:ring-4 focus:ring-primary/10 transition-all font-body p-6 leading-relaxed text-lg" 
              />
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={sendMessageMutation.isPending} 
                className="w-full h-16 rounded-[1.5rem] font-bold font-display text-lg gap-3 shadow-xl shadow-primary/20 active:scale-95 transition-all gradient-primary"
              >
                {sendMessageMutation.isPending ? (
                   <span className="flex items-center gap-2 animate-pulse">Broadcasting... <Sparkles className="w-5 h-5" /></span>
                ) : (
                  <>Send Broadcast <Send className="w-5 h-5 translate-x-1 -translate-y-1" /></>
                )}
              </Button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-primary/[0.03] border border-primary/10 rounded-[2.5rem] p-8 space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold font-display text-foreground tracking-tight">Pro Tips</h3>
            <div className="space-y-4">
              {[
                "Keep subjects short and clear",
                "Personalize with a friendly greeting",
                "Include direct links if needed",
                "Send 24h before event starts"
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-3 group">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <p className="text-sm text-muted-foreground font-body leading-snug group-hover:text-foreground transition-colors">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/50 rounded-[2.5rem] p-8 space-y-4 shadow-sm">
             <div className="flex items-center gap-3 text-amber-700 dark:text-amber-500 mb-2">
               <Info className="w-5 h-5 flex-shrink-0" />
               <span className="text-xs font-bold uppercase tracking-widest leading-none">Deliverability</span>
             </div>
             <p className="text-xs text-amber-800/80 dark:text-amber-400/80 font-body leading-relaxed font-medium">Broadcasts are sent via email to all confirmed attendees. Use carefully to avoid spam filters.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMessaging;
