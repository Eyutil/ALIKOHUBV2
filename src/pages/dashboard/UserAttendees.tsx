import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Users, Search, Mail, Download, Filter, ArrowUpRight, Calendar, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

interface Attendee {
  id: string;
  user: {
    firstname: string;
    lastname: string;
    email: string;
  };
  event: {
    title: string;
    id: string;
  };
  registrationDate: string;
  status: string;
}

const UserAttendees = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState(searchParams.get("eventId") || "all");

  const { data: attendeesData, isLoading, refetch: refetchAttendees } = useQuery({
    queryKey: ["user-attendees", eventFilter],
    queryFn: async () => {
      // Backend: GET /manage/events/registrations (all) OR /manage/events/:id/attendees (specific)
      const url = eventFilter === "all" ? "/manage/events/registrations" : `/manage/events/${eventFilter}/attendees`;
      const { data } = await api.get(url);
      return data;
    },
    enabled: !!user,
  });

  const { data: eventsData } = useQuery({
    queryKey: ["user-events-list"],
    queryFn: async () => {
      const { data } = await api.get("/manage/events");
      return data;
    },
    enabled: !!user,
  });

  const attendees = attendeesData || [];
  const events = eventsData?.items || [];

  const filteredAttendees = attendees.filter((a: Attendee) => 
    a.user.firstname.toLowerCase().includes(search.toLowerCase()) ||
    a.user.lastname.toLowerCase().includes(search.toLowerCase()) ||
    a.user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleCheckIn = async (eventId: string, registrationId: string, currentStatus: string) => {
    try {
      // User added a PATCH toggle as well: /manage/events/registrations/:id/checkin
      // I'll stick to the POST version you mentioned in Verified Endpoints: /manage/events/:id/checkin/:regId
      // Or we can use the toggle if we want:
      await api.patch(`/manage/events/registrations/${registrationId}/checkin`);
      toast.success(currentStatus === "CHECKED_IN" ? "Check-in reverted!" : "Attendee checked in!");
      refetchAttendees();
    } catch (error) {
      toast.error("Process failed. Please try again.");
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/40">
        <div>
          <h1 className="text-4xl font-bold font-display text-foreground tracking-tight">Attendee List</h1>
          <p className="text-muted-foreground font-body mt-2 max-w-sm">Detailed overview of guests across your events.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 rounded-xl gap-2 font-body font-bold border-border/60 hover:bg-muted active:scale-95 transition-all shadow-sm">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button className="h-12 rounded-xl gap-2 font-body font-bold shadow-xl shadow-primary/20 active:scale-95 transition-all gradient-primary">
            <Mail className="w-4 h-4" />
            Email All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="md:col-span-2 lg:col-span-3 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40 transition-colors group-focus-within:text-primary" />
          <Input 
            placeholder="Search attendees by name or email..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            className="h-14 pl-12 rounded-2xl bg-card border-border/40 focus:ring-4 focus:ring-primary/10 transition-all font-body font-medium shadow-sm" 
          />
        </div>
        <div className="lg:col-span-2 relative group">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40 transition-colors" />
          <Select value={eventFilter} onValueChange={setEventFilter}>
            <SelectTrigger className="h-14 pl-12 rounded-2xl bg-card border-border/40 focus:ring-4 focus:ring-primary/10 transition-all font-body font-medium shadow-sm"><SelectValue placeholder="All Events" /></SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl p-2 font-body max-h-[300px]">
              <SelectItem value="all" className="rounded-xl h-12 focus:bg-primary/5">All Active Events</SelectItem>
              {events.map((e: any) => (
                <SelectItem key={e.id} value={e.id} className="rounded-xl h-12 focus:bg-primary/5">{e.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 bg-primary/5 dark:bg-primary/10 px-4 rounded-2xl border border-primary/20 text-primary">
          <UserCheck className="w-5 h-5" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60 leading-none mb-1">Total Found</span>
            <span className="text-lg font-bold font-display leading-none">{filteredAttendees.length}</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-20 rounded-2xl bg-card animate-pulse border border-border/20" />)}
        </div>
      ) : !filteredAttendees.length ? (
        <div className="text-center py-32 bg-card/40 border border-dashed border-border/60 rounded-[3rem]">
          <div className="w-20 h-20 bg-muted/80 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-muted-foreground/30" />
          </div>
          <h3 className="text-2xl font-bold font-display text-foreground tracking-tight">No attendees matching this filter</h3>
          <p className="text-muted-foreground font-body max-w-xs mx-auto mb-8 text-sm">Try adjusting your filters or search query.</p>
          <Button variant="ghost" onClick={() => { setSearch(""); setEventFilter("all"); }} className="rounded-xl font-bold font-display text-primary hover:bg-primary/5 transition-all">Clear Filters</Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[2.5rem] border border-border/40 shadow-xl shadow-black/[0.02] bg-card/60 backdrop-blur-md">
          <div className="overflow-x-auto overflow-y-hidden">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-muted/40 font-display text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">
                  <th className="px-8 py-5 border-b border-border/40">Attendee Info</th>
                  <th className="px-8 py-5 border-b border-border/40">Registered Event</th>
                  <th className="px-8 py-5 border-b border-border/40">Registration Date</th>
                  <th className="px-8 py-5 border-b border-border/40">Status</th>
                  <th className="px-8 py-5 border-b border-border/40 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="font-body">
                <AnimatePresence mode="popLayout">
                  {filteredAttendees.map((a: Attendee, i: number) => (
                    <motion.tr
                      key={a.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="group border-b border-border/20 transition-all duration-300 hover:bg-primary/[0.01] hover:scale-[1.002]"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/80 to-accent/80 flex items-center justify-center text-primary font-bold shadow-sm ring-1 ring-white/20 group-hover:scale-110 transition-transform">
                            {a.user.firstname.charAt(0).toUpperCase()}{a.user.lastname.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">{a.user.firstname} {a.user.lastname}</p>
                            <p className="text-xs text-muted-foreground font-medium">{a.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 group/event cursor-pointer">
                          <p className="text-sm font-semibold text-foreground/80 max-w-[200px] truncate group-hover/event:text-primary transition-colors">{a.event.title}</p>
                          <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover/event:text-primary transition-colors" />
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-sm text-foreground/70">
                          <Calendar className="w-4 h-4 text-muted-foreground/40" />
                          {new Date(a.registrationDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${
                          a.status === "CONFIRMED" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-muted text-muted-foreground border-border/60"
                        }`}>
                          {a.status}
                        </span>
                      </td>
                       <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                             <Button 
                               variant={a.status === "CHECKED_IN" ? "secondary" : "outline"}
                               size="sm" 
                               onClick={() => handleCheckIn(a.event.id, a.id, a.status)}
                               className={`rounded-xl h-10 px-4 font-bold font-display gap-2 transition-all ${
                                 a.status === "CHECKED_IN" 
                                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                                  : "border-border/60 hover:border-emerald-500/30 hover:text-emerald-600"
                               }`}
                             >
                               <UserCheck className={`w-4 h-4 ${a.status === "CHECKED_IN" ? "fill-emerald-600" : ""}`} />
                               {a.status === "CHECKED_IN" ? "Checked" : "Check-in"}
                             </Button>
                           <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors border border-transparent hover:border-primary/20 shadow-sm" title="Message Guest">
                             <Mail className="w-4.5 h-4.5" />
                           </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAttendees;
