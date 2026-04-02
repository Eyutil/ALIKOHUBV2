import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, MapPin, Heart, CheckCircle, Share2, Music, PartyPopper } from "lucide-react";
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
  hostName?: string;
}

const SocialEventPage = () => {
  const { id: eventId } = useParams();
  const [rsvpForm, setRsvpForm] = useState({
    guestName: "", guestEmail: "", response: "yes",
    plusOneName: "", mealPreference: "", notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const { data: event, isLoading } = useQuery({
    queryKey: ["social-event", eventId],
    queryFn: async () => {
      const { data } = await api.get(`/events/${eventId}`);
      return data as Post;
    },
    enabled: !!eventId,
  });

  const rsvpMutation = useMutation({
    mutationFn: async (payload: any) => {
      await api.post("/manage/events/rsvps", { ...payload, eventId });
    },
    onSuccess: () => {
      setSubmitted(true);
      toast.success("RSVP submitted! We're excited to see you.");
    },
    onError: (e: any) => toast.error(e.response?.data?.message || e.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpForm.guestName || !rsvpForm.guestEmail) {
      toast.error("Please fill in your name and email");
      return;
    }
    rsvpMutation.mutate(rsvpForm);
  };

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" /></div>;
  if (!event) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground font-body">Event not found</p></div>;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar portal="social" />

      {/* Hero */}
      <section className="relative h-80 md:h-[450px] overflow-hidden">
        {event.coverImage ? (
          <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover scale-105" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accent/40 to-pink-light/40 flex items-center justify-center">
            <PartyPopper className="w-24 h-24 text-accent/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 py-12">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-block px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest mb-4">Social Event</span>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground font-display drop-shadow-sm max-w-3xl leading-tight">{event.title}</h1>
              {event.hostName && <p className="text-lg md:text-xl text-muted-foreground font-body mt-4 flex items-center gap-2">Hosted by <span className="text-foreground font-semibold">{event.hostName}</span></p>}
            </motion.div>
          </div>
        </div>
      </section>

      <div className="flex-1 container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            <div className="flex flex-wrap gap-8">
              {event.eventDate && (
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Date & Time</p>
                  <div className="flex items-center gap-2 text-foreground font-body">
                    <CalendarDays className="w-5 h-5 text-accent" />
                    <span>{format(new Date(event.eventDate), "EEEE, MMMM d, yyyy")}</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-body ml-7">{format(new Date(event.eventDate), "h:mm a")}</p>
                </div>
              )}
              {event.location && (
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Location</p>
                  <div className="flex items-center gap-2 text-foreground font-body">
                    <MapPin className="w-5 h-5 text-accent" />
                    <span>{event.location}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="h-px bg-gradient-to-r from-border/60 to-transparent" />

            {event.content && (
              <section>
                <h2 className="text-2xl font-bold font-display text-foreground mb-6">About the Celebration</h2>
                <div className="text-foreground/80 font-body text-lg leading-relaxed whitespace-pre-wrap">{event.content}</div>
              </section>
            )}

            <div className="pt-4">
              <Button 
                variant="outline" 
                className="font-body rounded-2xl hover:bg-accent/5 hover:border-accent/30 transition-all gap-2" 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied!");
                }}
              >
                <Share2 className="w-4 h-4" /> Share This Event
              </Button>
            </div>
          </div>

          {/* RSVP Widget */}
          <div className="relative">
            <div className="bg-card border border-border/80 rounded-[2.5rem] p-8 shadow-2xl shadow-accent/5 sticky top-24 overflow-hidden border-b-8 border-b-accent/20">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
              
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0 }}
                    className="text-center py-12 flex flex-col items-center"
                  >
                    <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle className="w-10 h-10 text-accent" />
                    </div>
                    <h3 className="font-display font-bold text-2xl text-foreground mb-2">You're on the list!</h3>
                    <p className="text-muted-foreground font-body mb-8">We can't wait to celebrate together.</p>
                    <Button variant="ghost" className="rounded-xl text-accent hover:text-accent hover:bg-accent/5" onClick={() => setSubmitted(false)}>Change RSVP</Button>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 rounded-2xl bg-accent/10 flex items-center justify-center">
                        <Heart className="w-5 h-5 text-accent" />
                      </div>
                      <h3 className="font-display font-bold text-2xl text-foreground">RSVP</h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Your Name</Label>
                        <Input 
                          value={rsvpForm.guestName} 
                          onChange={(e) => setRsvpForm({ ...rsvpForm, guestName: e.target.value })} 
                          placeholder="John Doe"
                          className="rounded-2xl border-none bg-muted/40 h-12 focus-visible:ring-accent/30" 
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Email Address</Label>
                        <Input 
                          type="email" 
                          value={rsvpForm.guestEmail} 
                          onChange={(e) => setRsvpForm({ ...rsvpForm, guestEmail: e.target.value })} 
                          placeholder="john@example.com"
                          className="rounded-2xl border-none bg-muted/40 h-12 focus-visible:ring-accent/30" 
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Are you joining us?</Label>
                        <Select value={rsvpForm.response} onValueChange={(v) => setRsvpForm({ ...rsvpForm, response: v })}>
                          <SelectTrigger className="rounded-2xl border-none bg-muted/40 h-12 focus-visible:ring-accent/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-border/60">
                            <SelectItem value="yes">Yes, I'll be there!</SelectItem>
                            <SelectItem value="no">Unfortunately, no</SelectItem>
                            <SelectItem value="maybe">Maybe</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <AnimatePresence>
                        {rsvpForm.response === "yes" && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-4 pt-2">
                            <div className="space-y-1.5">
                              <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Plus One Name (Optional)</Label>
                              <Input 
                                value={rsvpForm.plusOneName} 
                                onChange={(e) => setRsvpForm({ ...rsvpForm, plusOneName: e.target.value })} 
                                placeholder="Jane Doe"
                                className="rounded-2xl border-none bg-muted/40 h-12 focus-visible:ring-accent/30" 
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Meal Preference</Label>
                              <Input 
                                value={rsvpForm.mealPreference} 
                                onChange={(e) => setRsvpForm({ ...rsvpForm, mealPreference: e.target.value })} 
                                placeholder="Vegan, No Nuts, etc."
                                className="rounded-2xl border-none bg-muted/40 h-12 focus-visible:ring-accent/30" 
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Notes for Host</Label>
                        <Textarea 
                          value={rsvpForm.notes} 
                          onChange={(e) => setRsvpForm({ ...rsvpForm, notes: e.target.value })} 
                          placeholder="Anything else?"
                          className="rounded-2xl border-none bg-muted/40 min-h-[100px] focus-visible:ring-accent/30 resize-none" 
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={rsvpMutation.isPending}
                        className="w-full h-14 font-bold font-display rounded-2xl bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {rsvpMutation.isPending ? "Sending..." : "Submit RSVP"}
                      </Button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <Footer portal="social" />
    </div>
  );
};

export default SocialEventPage;
