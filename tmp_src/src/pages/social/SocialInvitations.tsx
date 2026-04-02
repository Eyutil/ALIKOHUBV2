import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin } from "lucide-react";
import { format } from "date-fns";

const SocialInvitations = () => {
  const { user } = useAuth();

  const { data: events, isLoading } = useQuery({
    queryKey: ["my-social-events", user?.id],
    queryFn: async () => {
      const { data } = await api.get("/manage/events", {
        params: { type: "SOCIAL_EVENT" }
      });
      return data ?? [];
    },
    enabled: !!user,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar portal="social" />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold font-display text-foreground mb-2">My Invitations</h1>
        <p className="text-muted-foreground font-body mb-8">Events you've created</p>

        {!user ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-body mb-4">Please sign in to view your invitations.</p>
            <Link to="/signin" className="text-accent font-body font-semibold hover:underline">Sign In</Link>
          </div>
        ) : isLoading ? (
          <p className="text-muted-foreground font-body">Loading...</p>
        ) : !events?.length ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-body mb-4">No events yet.</p>
            <Link to="/social/create" className="text-accent font-body font-semibold hover:underline">Create Your First Event</Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event: any) => (
              <Link key={event.id} to={`/social/e/${event.id}`}>
                <div className="bg-card border border-border rounded-xl p-6 shadow-card hover:shadow-elevated transition-all">
                  <h3 className="font-display font-semibold text-foreground mb-2">{event.title}</h3>
                  <div className="space-y-1 text-sm text-muted-foreground font-body">
                    <p className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5 text-accent" />{event.eventDate ? format(new Date(event.eventDate), "MMM d, yyyy") : "TBD"}</p>
                    {event.location && <p className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-accent" />{event.location}</p>}
                  </div>
                  <span className={`inline-block mt-3 px-2 py-0.5 rounded-full text-xs ${event.status === "PUBLISHED" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {event.status.replace("_", " ").toLowerCase()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer portal="social" />
    </div>
  );
};

export default SocialInvitations;
