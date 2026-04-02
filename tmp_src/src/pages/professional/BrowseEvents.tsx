import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, CalendarDays, MapPin, Filter, Wifi, Building2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { format } from "date-fns";

interface Post {
  id: string;
  title: string;
  excerpt?: string;
  type: string;
  status: string;
  eventDate?: string;
  location?: string;
  coverImage?: string;
}

const BrowseEvents = () => {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<"upcoming" | "past" | "all">("upcoming");
  const [locationFilter, setLocationFilter] = useState<"all" | "in-person" | "virtual">("all");

  const { data: postsData, isLoading } = useQuery({
    queryKey: ["professional-events"],
    queryFn: async () => {
      const { data } = await api.get("/events?type=EVENT");
      return data.items || [];
    },
  });

  const filtered = useMemo(() => {
    if (!postsData) return [];
    const now = new Date();
    return postsData
      .filter((e: Post) => {
        // Search
        const q = search.toLowerCase();
        if (q && !e.title.toLowerCase().includes(q) && !e.location?.toLowerCase().includes(q) && !e.excerpt?.toLowerCase().includes(q)) return false;
        // Date
        if (!e.eventDate) return dateFilter === "all";
        if (dateFilter === "upcoming" && new Date(e.eventDate) < now) return false;
        if (dateFilter === "past" && new Date(e.eventDate) >= now) return false;
        // Location
        if (locationFilter === "in-person" && !e.location) return false;
        if (locationFilter === "virtual" && e.location) return false;
        return true;
      })
      .slice(0, 6);
  }, [postsData, search, dateFilter, locationFilter]);

  const activeFilterClasses = "bg-primary text-primary-foreground";
  const inactiveFilterClasses = "bg-card text-muted-foreground border border-border hover:bg-muted";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar portal="professional" />
      <div className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold font-display text-foreground mb-2">Browse Events</h1>
        <p className="text-muted-foreground font-body mb-8">Discover professional events, conferences, and more</p>

        {/* Search */}
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by title, location, or description..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="flex items-center gap-1.5 mr-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-body text-muted-foreground font-medium">Filters:</span>
          </div>

          {/* Date filter */}
          <div className="flex gap-1.5">
            {(["upcoming", "past", "all"] as const).map((val) => (
              <Button
                key={val}
                size="sm"
                variant="ghost"
                onClick={() => setDateFilter(val)}
                className={`text-xs font-body rounded-full px-3 h-8 ${dateFilter === val ? activeFilterClasses : inactiveFilterClasses}`}
              >
                <CalendarDays className="w-3 h-3 mr-1" />
                {val.charAt(0).toUpperCase() + val.slice(1)}
              </Button>
            ))}
          </div>

          <div className="w-px h-8 bg-border" />

          {/* Location filter */}
          <div className="flex gap-1.5">
            {([
              { val: "all" as const, icon: null, label: "All" },
              { val: "in-person" as const, icon: Building2, label: "In Person" },
              { val: "virtual" as const, icon: Wifi, label: "Virtual" },
            ]).map(({ val, icon: Icon, label }) => (
              <Button
                key={val}
                size="sm"
                variant="ghost"
                onClick={() => setLocationFilter(val)}
                className={`text-xs font-body rounded-full px-3 h-8 ${locationFilter === val ? activeFilterClasses : inactiveFilterClasses}`}
              >
                {Icon && <Icon className="w-3 h-3 mr-1" />}
                {label}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground font-body">Loading events...</p>
        ) : !filtered.length ? (
          <p className="text-muted-foreground font-body">No events found matching your filters.</p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground font-body mb-4">Showing {filtered.length} event{filtered.length !== 1 ? "s" : ""}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((event) => (
                <Link key={event.id} to={`/professional/events/${event.id}`} className="group">
                  <div className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 border border-border hover:border-primary/20">
                    <div className="relative overflow-hidden aspect-[16/10]">
                      {event.coverImage ? (
                        <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <CalendarDays className="w-10 h-10 text-muted-foreground/40" />
                        </div>
                      )}
                      {!event.location && (
                        <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold font-body rounded-full bg-primary text-primary-foreground">
                          Virtual
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-lg font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      {event.excerpt && (
                        <p className="text-sm text-muted-foreground font-body line-clamp-2 mb-3">{event.excerpt}</p>
                      )}
                      <div className="space-y-1.5 font-body text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                          <span>{event.eventDate ? format(new Date(event.eventDate), "MMM d, yyyy") : "Date TBD"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                          <span>{event.location ?? "Virtual Event"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
      <Footer portal="professional" />
    </div>
  );
};

export default BrowseEvents;
