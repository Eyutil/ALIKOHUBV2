import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Calendar, MapPin, Clock, ExternalLink, Image as ImageIcon, Users, BarChart3, Mail } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

interface Post {
  id: string;
  title: string;
  type: string;
  status: string;
  excerpt?: string;
  content: string;
  eventDate?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  externalLink?: string;
  coverImage?: string;
  authorId: string;
  rejectionReason?: string;
}

const UserEvents = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Post | null>(null);
  const [form, setForm] = useState<Partial<Post>>({ type: "EVENT", content: "" });
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: postsData, isLoading } = useQuery({
    queryKey: ["user-events"],
    queryFn: async () => {
      const { data } = await api.get("/manage/events");
      return data;
    },
    enabled: !!user,
  });

  const events = postsData?.items || [];

  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post("/manage/events", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-events"] });
      toast.success("Event created as draft!");
      handleClose();
    },
    onError: (e: any) => toast.error(e.response?.data?.message || e.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const { data } = await api.patch(`/manage/events/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-events"] });
      toast.success("Event updated!");
      handleClose();
    },
    onError: (e: any) => toast.error(e.response?.data?.message || e.message),
  });

  const submitMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.post(`/manage/events/${id}/submit`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-events"] });
      toast.success("Submitted for review");
    },
  });

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setForm({ type: "EVENT", content: "" });
    setFile(null);
    setOpen(true);
  };

  const handleOpenEdit = (event: Post) => {
    setEditingEvent(event);
    setForm({
      type: event.type,
      title: event.title,
      content: event.content,
      excerpt: event.excerpt,
      eventDate: event.eventDate ? new Date(event.eventDate).toISOString().split('T')[0] : "",
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      externalLink: event.externalLink,
      status: event.status,
    });
    setFile(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingEvent(null);
    setForm({ type: "EVENT", content: "" });
    setFile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== undefined && value !== null) formData.append(key, value as string);
    });
    if (file) formData.append("coverImage", file);

    if (editingEvent) {
      updateMutation.mutate({ id: editingEvent.id, formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const statusColor = (s: string) =>
    s === "PUBLISHED" ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
    s === "PENDING" ? "bg-amber-100 text-amber-700 border-amber-200" :
    s === "REJECTED" ? "bg-rose-100 text-rose-700 border-rose-200" :
    "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between gap-6 pb-6 border-b border-border/40">
        <div>
          <h1 className="text-4xl font-bold font-display text-foreground tracking-tight">My Events</h1>
          <p className="text-muted-foreground font-body mt-1 max-w-sm">Manage the lifecycle of your event content.</p>
        </div>
        <Button onClick={handleOpenCreate} className="h-14 px-8 rounded-2xl gap-3 shadow-xl shadow-primary/20 font-bold font-display scale-105 active:scale-95 transition-all gradient-primary">
          <Plus className="w-5 h-5" />
          Create Content
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto rounded-[2.5rem] p-0 border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)]">
          <div className="p-8 md:p-12 space-y-10">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold font-display tracking-tight text-foreground -mb-2">
                {editingEvent ? `Edit my ${editingEvent.type}` : "Create New Event"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2.5">
                  <Label className="font-display font-bold text-xs uppercase tracking-widest text-muted-foreground/80 ml-1">Type *</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger className="h-14 rounded-2xl bg-muted/60 border-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-semibold font-body"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl p-2 font-body">
                      {["EVENT", "SOCIAL_EVENT", "NEWS", "ANNOUNCEMENT"].map(t => (
                        <SelectItem key={t} value={t} className="rounded-xl h-12 focus:bg-primary/5">{t.replace('_', ' ')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2.5">
                  <Label className="font-display font-bold text-xs uppercase tracking-widest text-muted-foreground/80 ml-1">Title *</Label>
                  <Input value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="h-14 rounded-2xl bg-muted/60 border-none focus:ring-4 focus:ring-primary/10 transition-all font-body font-medium" />
                </div>
              </div>

              <div className="space-y-2.5 text-center">
                <Label className="font-display font-bold text-xs uppercase tracking-widest text-muted-foreground/80 ml-1 block text-left">Cover Image</Label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-video w-full rounded-3xl border-2 border-dashed border-border/60 hover:border-primary/40 hover:bg-primary/[0.02] transition-all cursor-pointer group flex flex-col items-center justify-center relative overflow-hidden"
                >
                  {file || editingEvent?.coverImage ? (
                    <>
                      <img src={file ? URL.createObjectURL(file) : editingEvent?.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center ring-2 ring-white/30 transform group-hover:scale-110 transition-transform">
                          <Pencil className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4 flex flex-col items-center">
                       <div className="w-16 h-16 rounded-[2rem] bg-muted/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <ImageIcon className="w-8 h-8 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold font-display text-foreground mb-1">Click to upload cover image</p>
                        <p className="text-xs font-body text-muted-foreground">High resolution JPG, PNG, WEBP up to 5MB</p>
                      </div>
                    </div>
                  )}
                </div>
                <input type="file" ref={fileInputRef} onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" accept="image/*" />
              </div>

              {(form.type === "EVENT" || form.type === "SOCIAL_EVENT") && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2.5 font-body">
                    <Label className="font-display font-bold text-xs uppercase tracking-widest text-muted-foreground/80 ml-1">Event Date</Label>
                    <Input type="date" value={form.eventDate || ""} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} className="h-14 rounded-2xl bg-muted/60 border-none font-medium" />
                  </div>
                  <div className="space-y-2.5 font-body">
                    <Label className="font-display font-bold text-xs uppercase tracking-widest text-muted-foreground/80 ml-1">Location</Label>
                    <div className="relative">
                      <Input value={form.location || ""} onChange={(e) => setForm({ ...form, location: e.target.value })} className="h-14 pl-12 rounded-2xl bg-muted/60 border-none font-medium" placeholder="Venue or Online Link" />
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2.5">
                <Label className="font-display font-bold text-xs uppercase tracking-widest text-muted-foreground/80 ml-1">Content Details</Label>
                <Textarea value={form.content || ""} onChange={(e) => setForm({ ...form, content: e.target.value })} required className="min-h-[220px] rounded-3xl bg-muted/60 border-none focus:ring-4 focus:ring-primary/10 transition-all font-body leading-relaxed p-6" placeholder="Describe your event in detail..." />
              </div>

              <div className="flex gap-4 pt-6">
                <Button type="button" variant="ghost" onClick={handleClose} className="h-14 px-8 flex-1 rounded-2xl font-bold font-display text-muted-foreground hover:bg-muted active:scale-95 transition-all">Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="h-14 px-12 flex-[2] rounded-2xl font-bold font-display text-white shadow-xl shadow-primary/20 active:scale-95 transition-all gradient-primary">
                  {editingEvent ? (updateMutation.isPending ? "Updating..." : "Update Changes") : (createMutation.isPending ? "Creating..." : "Save Draft")}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="aspect-video rounded-3xl bg-card animate-pulse border border-border/20" />)}
        </div>
      ) : !events.length ? (
        <div className="text-center py-32 bg-card/40 border border-dashed border-border/60 rounded-[3rem] px-6">
           <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 animate-bounce transition-all duration-1000">
             <Calendar className="w-10 h-10 text-primary" />
           </div>
           <h3 className="text-3xl font-bold font-display text-foreground mb-4">Launch your first event</h3>
           <p className="text-muted-foreground font-body max-w-sm mx-auto mb-10 text-lg">Your dashboard looks a little empty! Start your organizer journey by creating a piece of content.</p>
           <Button onClick={handleOpenCreate} className="h-14 px-10 rounded-2xl font-bold font-display gradient-primary shadow-xl shadow-primary/20">Create Now</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {events.map((event: Post, i: number) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="group bg-card shadow-sm hover:shadow-2xl hover:shadow-primary/5 rounded-[2.5rem] border border-border/50 overflow-hidden transition-all duration-500 hover:-translate-y-1"
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  {event.coverImage ? (
                    <img src={event.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-muted to-muted/40 flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-muted-foreground/20" />
                    </div>
                  )}
                  <div className="absolute top-6 left-6 flex gap-2">
                    <span className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-white font-bold tracking-widest uppercase border border-white/10 ring-1 ring-white/10">
                      {event.type.replace('_', ' ')}
                    </span>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase border backdrop-blur-md ring-1 ring-white/10 shadow-lg ${statusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold font-display text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-2 tracking-tight">{event.title}</h3>
                    <p className="text-sm text-muted-foreground font-body line-clamp-2 leading-relaxed h-10">
                      {event.excerpt || event.content.substring(0, 100) + "..."}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-y-3 gap-x-5 text-xs text-muted-foreground font-body border-y border-border/40 py-4">
                    {event.eventDate && (
                      <div className="flex items-center gap-2 font-semibold text-foreground/80"><Calendar className="w-4 h-4 text-primary/60" />{new Date(event.eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-2 font-semibold text-foreground/80 truncate max-w-[200px]"><MapPin className="w-4 h-4 text-primary/60" />{event.location}</div>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-3 pt-2">
                    <Button variant="outline" size="icon" className="w-full h-12 rounded-xl hover:bg-primary/5 hover:text-primary hover:border-primary/40 transition-all group/btn" asChild>
                      <Link to={`/dashboard/attendees?eventId=${event.id}`} title="Attendees">
                        <Users className="w-5 h-5 group-hover/btn:scale-110" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon" className="w-full h-12 rounded-xl hover:bg-primary/5 hover:text-primary hover:border-primary/40 transition-all group/btn" asChild>
                      <Link to={`/dashboard/messaging?eventId=${event.id}`} title="Message Settings">
                        <Mail className="w-5 h-5 group-hover/btn:scale-110" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon" className="w-full h-12 rounded-xl hover:bg-primary/5 hover:text-primary hover:border-primary/40 transition-all group/btn" asChild>
                      <Link to={`/dashboard/analytics?eventId=${event.id}`} title="Analytics">
                        <BarChart3 className="w-5 h-5 group-hover/btn:scale-110" />
                      </Link>
                    </Button>
                    <Button variant="secondary" size="icon" className="w-full h-12 rounded-xl hover:bg-foreground hover:text-background transition-all group/btn" onClick={() => handleOpenEdit(event)} title="Edit Event">
                      <Pencil className="w-5 h-5 group-hover/btn:scale-110" />
                    </Button>
                  </div>
                  
                  {event.status === "DRAFT" && (
                    <Button className="w-full h-14 rounded-2xl font-bold font-display shadow-lg shadow-primary/10 tracking-wide translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300" onClick={() => submitMutation.mutate(event.id)}>
                      SUBMIT FOR REVIEW
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default UserEvents;
