import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import webinarVisa from "@/assets/webinar-visa.jpg";
import webinarBusiness from "@/assets/webinar-business.jpg";
import webinarCareer from "@/assets/webinar-career.jpg";
import webinarPhd from "@/assets/webinar-phd.jpg";

const fallbackThumbnails = [webinarVisa, webinarBusiness, webinarCareer, webinarPhd];

type Webinar = {
  id: string;
  title: string;
  description: string | null;
  scheduledAt: string | null;
  durationMinutes: number | null;
  webinarUrl: string | null;
  thumbnailUrl: string | null;
  isFree: boolean;
};

const Webinars = () => {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState<Webinar | null>(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchWebinars = async () => {
      try {
        const { data } = await api.get("/consultancy/cms/webinars");
        setWebinars(data || []);
      } catch (error) {
        console.error("Failed to fetch webinars:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWebinars();
  }, []);

  const now = new Date();
  const upcoming = webinars.filter(w => w.scheduledAt && new Date(w.scheduledAt) >= now);
  const past = webinars.filter(w => !w.scheduledAt || new Date(w.scheduledAt) < now);

  const handleRegister = async () => {
    if (!form.name || !form.email || !registering) return;
    setSubmitting(true);

    try {
      await api.post(`/consultancy/cms/webinars/${registering.id}/register`, form);
      
      const meetingLink = registering.webinarUrl || "https://meet.google.com/abc-defg-hij";

      toast({
        title: "Registration Confirmed!",
        description: `You're registered for "${registering.title}". A confirmation has been sent to ${form.email}. Join here: ${meetingLink}`,
      });

      setRegistering(null);
      setForm({ name: "", email: "" });
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast({
        title: "Registration Failed",
        description: error.response?.data?.message || "There was an error during registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getThumb = (w: Webinar) => w.thumbnailUrl || "";

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${webinarVisa})` }} />
        <div className="absolute inset-0 bg-navy/85" />
        <div className="relative container-wide px-4 lg:px-8 py-20 md:py-28 lg:py-36">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent mb-4 block">Webinars</span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-6">Live & Recorded Sessions</h1>
            <p className="text-primary-foreground/70 text-lg">Join expert-led webinars on business, career, and travel topics.</p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          {loading ? (
            <p className="text-center text-muted-foreground py-12">Loading webinars…</p>
          ) : webinars.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No webinars available yet. Check back soon!</p>
          ) : (
            <>
              {upcoming.length > 0 && (
                <>
                  <h2 className="font-serif text-2xl font-bold text-primary mb-8">Upcoming</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    {upcoming.map((w, i) => (
                      <div key={w.id} className="bg-card border border-border rounded-xl overflow-hidden card-hover group">
                        <div className="aspect-[16/9] overflow-hidden">
                          <img src={getThumb(w)} alt={w.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        </div>
                        <div className="p-6">
                          <h3 className="font-serif text-lg font-semibold text-primary mb-3">{w.title}</h3>
                          {w.description && <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{w.description}</p>}
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-5">
                            {w.scheduledAt && <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{new Date(w.scheduledAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>}
                            {w.durationMinutes && <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{w.durationMinutes} min</span>}
                          </div>
                          <Button onClick={() => setRegistering(w)} className="bg-gold text-navy hover:bg-gold/90 font-semibold text-sm">Register Now</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {past.length > 0 && (
                <>
                  <h2 className="font-serif text-2xl font-bold text-primary mb-8">Past Sessions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {past.map((w, i) => (
                      <div key={w.id} className="bg-card border border-border rounded-xl overflow-hidden group">
                        <div className="aspect-[16/9] overflow-hidden relative">
                          <img src={getThumb(w)} alt={w.title} className="w-full h-full object-cover opacity-60" loading="lazy" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-14 h-14 rounded-full bg-card/90 flex items-center justify-center">
                              <Video className="w-6 h-6 text-accent" />
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="font-serif text-lg font-semibold text-primary mb-3">{w.title}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                            {w.scheduledAt && <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{new Date(w.scheduledAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>}
                            {w.durationMinutes && <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{w.durationMinutes} min</span>}
                          </div>
                          {w.webinarUrl ? (
                            <a href={w.webinarUrl} target="_blank" rel="noopener noreferrer">
                              <span className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline">Watch Recording <ArrowRight className="w-4 h-4" /></span>
                            </a>
                          ) : (
                            <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">Recording Coming Soon</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>

      {/* Registration Dialog */}
      <Dialog open={!!registering} onOpenChange={() => setRegistering(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Register for Webinar</DialogTitle>
          </DialogHeader>
          {registering && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">You're registering for <strong>{registering.title}</strong></p>
              {registering.scheduledAt && (
                <p className="text-sm text-muted-foreground">Date: {new Date(registering.scheduledAt).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
              )}
              <Input placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Email Address" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <p className="text-xs text-muted-foreground">The webinar link (Zoom/Google Meet) will be sent to your email upon registration.</p>
              <Button onClick={handleRegister} disabled={submitting || !form.name || !form.email} className="w-full bg-gold text-navy hover:bg-gold/90 font-semibold">
                {submitting ? "Registering…" : "Confirm Registration"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Webinars;
