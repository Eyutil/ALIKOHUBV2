import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, MapPin, Clock, Share2, CheckCircle, Ticket, User } from "lucide-react";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Post {
  id: string;
  title: string;
  content: string;
  type: string;
  eventDate?: string;
  location?: string;
  coverImage?: string;
  tickets?: any[];
  sessions?: any[];
  sponsors?: any[];
}

const EventDetail = () => {
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [regForm, setRegForm] = useState({ attendeeName: "", attendeeEmail: "", ticketId: "", totalPaid: 0 });
  const [registered, setRegistered] = useState(false);

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      const { data } = await api.get(`/events/${eventId}`);
      return data as Post;
    },
    enabled: !!eventId,
  });

  const registerMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post("/manage/events/registrations", { ...payload, eventId });
      return data;
    },
    onSuccess: () => {
      setRegistered(true);
      toast.success("Registration successful!");
    },
    onError: (e: any) => toast.error(e.response?.data?.message || e.message),
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to complete registration");
      navigate("/professional/signin");
      return;
    }
    if (!regForm.attendeeName || !regForm.attendeeEmail) {
      toast.error("Name and Email are required");
      return;
    }
    registerMutation.mutate(regForm);
  };

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!event) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground font-body">Event not found</p></div>;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar portal="professional" />

      {/* Hero */}
      <section className="relative h-64 md:h-80 bg-primary group overflow-hidden">
        {event.coverImage ? (
          <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover opacity-60 scale-105 group-hover:scale-100 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary to-green-dark" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground font-display drop-shadow-sm">{event.title}</h1>
              <div className="flex flex-wrap gap-4 mt-4 text-muted-foreground text-sm font-body">
                {event.eventDate && <span className="flex items-center gap-1.5 bg-background/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/50"><CalendarDays className="w-4 h-4 text-primary" />{format(new Date(event.eventDate), "MMMM d, yyyy")}</span>}
                {event.eventDate && <span className="flex items-center gap-1.5 bg-background/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/50"><Clock className="w-4 h-4 text-primary" />{format(new Date(event.eventDate), "h:mm a")}</span>}
                {event.location && <span className="flex items-center gap-1.5 bg-background/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/50"><MapPin className="w-4 h-4 text-primary" />{event.location}</span>}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {event.content && (
              <section>
                <h2 className="text-2xl font-bold font-display text-foreground mb-4">About the Event</h2>
                <div className="text-foreground/80 font-body text-lg leading-relaxed whitespace-pre-wrap">{event.content}</div>
              </section>
            )}

            {event.sessions && event.sessions.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold font-display text-foreground mb-6">Event Agenda</h2>
                <div className="space-y-4">
                  {event.sessions.map((s: any, i: number) => (
                    <motion.div 
                      key={s.id} 
                      initial={{ opacity: 0, x: -20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      transition={{ delay: i * 0.1 }}
                      className="bg-card border border-border/60 hover:border-primary/30 rounded-2xl p-5 hover:shadow-card transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex flex-col items-center justify-center text-primary">
                            <Clock className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground font-display text-lg">{s.title}</h3>
                            {s.speakerName && <p className="text-sm text-muted-foreground font-body flex items-center gap-1.5 mt-1"><User className="w-3.5 h-3.5" />{s.speakerName}</p>}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-sm font-bold text-primary font-body">
                            {format(new Date(s.startTime), "h:mm a")}
                          </span>
                          <p className="text-[10px] text-muted-foreground font-body">Starts</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {event.sponsors && event.sponsors.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold font-display text-foreground mb-6 text-center">Our Partners</h2>
                <div className="flex flex-wrap justify-center gap-8">
                  {event.sponsors.map((s: any) => (
                    <div key={s.id} className="group text-center">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-card border border-border/60 p-4 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 hover:shadow-card hover:-translate-y-1">
                        {s.logoUrl ? (
                          <img src={s.logoUrl} alt={s.name} className="max-w-full max-h-full object-contain" />
                        ) : (
                          <span className="font-bold text-muted-foreground text-xs">{s.name}</span>
                        )}
                      </div>
                      <p className="mt-2 text-xs font-body font-semibold text-muted-foreground group-hover:text-primary transition-colors">{s.tier}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-card border border-border/60 rounded-3xl p-8 shadow-card sticky top-24 overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors" />
              
              {!registered ? (
                <>
                  <h3 className="text-xl font-bold font-display text-foreground mb-6">Reserve your spot</h3>
                  <div className="space-y-4 mb-8">
                    {event.tickets && event.tickets.length > 0 ? (
                      event.tickets.map((t: any) => (
                        <button
                          key={t.id}
                          onClick={() => setRegForm({ ...regForm, ticketId: t.id, totalPaid: t.price })}
                          className={`w-full text-left p-4 rounded-2xl border transition-all ${
                            regForm.ticketId === t.id ? "border-primary bg-primary/5 shadow-sm" : "border-border/60 hover:border-primary/20 bg-muted/20"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-foreground text-sm flex items-center gap-2"><Ticket className="w-4 h-4 text-primary" /> {t.name}</span>
                            <span className="font-bold text-primary text-sm">${t.price}</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground font-body">Available for immediate registration</p>
                        </button>
                      ))
                    ) : (
                      <div className="p-4 rounded-2xl border border-border/60 bg-muted/20 text-center">
                        <p className="text-sm font-body text-muted-foreground">Free entry for this event</p>
                      </div>
                    )}
                  </div>

                  <AnimatePresence>
                    {(regForm.ticketId || !event.tickets?.length) && (
                      <motion.form 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleRegister} 
                        className="space-y-4 overflow-hidden"
                      >
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Your Full Name</Label>
                          <Input value={regForm.attendeeName} onChange={(e) => setRegForm({ ...regForm, attendeeName: e.target.value })} required className="rounded-xl bg-muted/30 border-none h-11" placeholder="John Doe" />
                        </div>
                        <div className="space-y-1.5 pb-2">
                          <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Email Address</Label>
                          <Input type="email" value={regForm.attendeeEmail} onChange={(e) => setRegForm({ ...regForm, attendeeEmail: e.target.value })} required className="rounded-xl bg-muted/30 border-none h-11" placeholder="john@example.com" />
                        </div>
                        <Button type="submit" disabled={registerMutation.isPending} className="w-full h-12 font-bold font-display rounded-2xl shadow-lg hover:shadow-primary/20 transition-all">
                          {!user ? "Sign In to Register" : registerMutation.isPending ? "Processing..." : "Complete Registration"}
                        </Button>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                  <div className="w-16 h-16 bg-emerald/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald" />
                  </div>
                  <h3 className="text-xl font-bold font-display text-foreground mb-2">Registered!</h3>
                  <p className="text-sm text-muted-foreground font-body mb-6">See you at the event. We've sent details to your email.</p>
                  <Button variant="outline" onClick={() => setRegistered(false)} className="rounded-xl font-body">Back</Button>
                </motion.div>
              )}

              <div className="mt-8 pt-6 border-t border-border/40">
                <Button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied!");
                  }} 
                  variant="ghost" 
                  className="w-full font-body text-xs text-muted-foreground hover:text-primary transition-colors gap-2"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share this event
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer portal="professional" />
    </div>
  );
};

export default EventDetail;
