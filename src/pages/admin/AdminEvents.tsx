import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Calendar, MapPin, Clock, CheckCircle, XCircle, Image as ImageIcon, ExternalLink, RefreshCw, Info } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

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

const AdminEvents = () => {
  const { user, isAdmin, isContentManager } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Post | null>(null);
  const [form, setForm] = useState<Partial<Post>>({ type: "EVENT", content: "" });
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: postsData, isLoading } = useQuery({
    queryKey: ["admin-events"],
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
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
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
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Event updated!");
      handleClose();
    },

    onError: (e: any) => toast.error(e.response?.data?.message || e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/manage/events/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Event deleted");
    },

  });

  const reviewMutation = useMutation({
    mutationFn: async ({ id, status, rejectionReason }: { id: string; status: string; rejectionReason?: string }) => {
      await api.post(`/manage/events/${id}/review`, { status, rejectionReason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast.success("Review submitted");
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.post(`/manage/events/${id}/submit`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
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
    setForm({ type: "EVENT", content: "", status: "DRAFT" });
    setFile(null);
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) {
      toast.error("Title and Content are required");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string);
      }
    });
    if (file) {
      formData.append("coverImage", file);
    }

    if (editingEvent) {
      updateMutation.mutate({ id: editingEvent.id, formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const statusColor = (s: string) =>
    s === "PUBLISHED" ? "bg-emerald/15 text-emerald border border-emerald/20" :
    s === "PENDING" ? "bg-amber/15 text-amber border border-amber/20" :
    s === "REJECTED" ? "bg-rose/15 text-rose border border-rose/20" :
    "bg-secondary/15 text-secondary border border-secondary/20";

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            {isAdmin() || isContentManager() ? "Content Administration" : "My Events"}
          </h1>
          <p className="text-sm text-muted-foreground font-body mt-1">
            {isAdmin() || isContentManager() ? "Review and manage all events & news" : "Manage your content"}
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="font-body rounded-xl gap-2 shadow-md">
          <Plus className="w-4 h-4" />Create Content
        </Button>
      </motion.div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editingEvent ? `Edit ${editingEvent.type}` : "Create New Content"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-body text-xs">Type *</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EVENT">Event</SelectItem>
                    <SelectItem value="SOCIAL_EVENT">Social Event</SelectItem>
                    <SelectItem value="ANNOUNCEMENT">Announcement</SelectItem>
                    <SelectItem value="NEWS">News</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="font-body text-xs">Title *</Label>
                <Input value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="rounded-xl font-body" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="font-body text-xs">Excerpt (Short Description)</Label>
              <Input value={form.excerpt || ""} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="rounded-xl font-body" placeholder="A brief summary..." />
            </div>

            <div className="space-y-1.5">
              <Label className="font-body text-xs">Content *</Label>
              <Textarea value={form.content || ""} onChange={(e) => setForm({ ...form, content: e.target.value })} required className="rounded-xl min-h-[120px] font-body" />
            </div>

            {(form.type === "EVENT" || form.type === "SOCIAL_EVENT") && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="font-body text-xs">Event Date</Label>
                  <Input type="date" value={form.eventDate || ""} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} className="rounded-xl font-body" />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-xs">Location</Label>
                  <Input value={form.location || ""} onChange={(e) => setForm({ ...form, location: e.target.value })} className="rounded-xl font-body" placeholder="Venue or Online link" />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-xs">Start Time</Label>
                  <Input type="time" value={form.startTime || ""} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="rounded-xl font-body" />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-xs">End Time</Label>
                  <Input type="time" value={form.endTime || ""} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="rounded-xl font-body" />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="font-body text-xs">External Link (Optional)</Label>
              <Input value={form.externalLink || ""} onChange={(e) => setForm({ ...form, externalLink: e.target.value })} className="rounded-xl font-body" placeholder="https://..." />
            </div>

            <div className="space-y-1.5">
              <Label className="font-body text-xs">Cover Image</Label>
              <div className="flex items-start gap-4">
                {file ? (
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-border shadow-sm group">
                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setFile(null)} className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-5 h-5" /></button>
                  </div>
                ) : editingEvent?.coverImage ? (
                   <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-border shadow-sm group">
                    <img src={editingEvent.coverImage} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"><Pencil className="w-5 h-5" /></button>
                  </div>
                ) : (
                  <button type="button" className="w-24 h-24 rounded-2xl border border-dashed border-border flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all" onClick={() => fileInputRef.current?.click()}>
                    <ImageIcon className="w-5 h-5 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Upload</span>
                  </button>
                )}
                <input type="file" ref={fileInputRef} onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" accept="image/*" />
                <div className="flex-1 pt-1">
                  <p className="text-xs text-muted-foreground font-body">Attach a high-quality cover image for better visibility.</p>
                  <p className="text-[10px] text-muted-foreground/60 font-body mt-1">Accepts JPG, PNG, WEBP. Max size 2MB.</p>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="font-body text-xs">Publication Status</Label>
              <Select value={form.status || "DRAFT"} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PENDING">Pending Review</SelectItem>
                  <SelectItem value="PUBLISHED">Published (Admin Only)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[10px] text-muted-foreground font-body">Published content is visible to all users immediately.</p>
            </div>

            <div className="pt-6 flex gap-3">

              <Button type="button" variant="ghost" onClick={handleClose} className="flex-1 rounded-xl font-body">Cancel</Button>
              <Button type="submit" className="flex-[2] font-body rounded-xl shadow-lg gradient-primary" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingEvent ? 
                  (updateMutation.isPending ? "Updating..." : "Update Content") : 
                  (createMutation.isPending ? "Processing..." : (form.status === "PUBLISHED" ? "Publish Content" : "Save Draft"))
                }
              </Button>
            </div>

          </form>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="text-center py-20 text-muted-foreground font-body flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <p className="animate-pulse">Retrieving entries...</p>
        </div>
      ) : !events.length ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 bg-card/40 border border-dashed border-border/60 rounded-[2rem]">
          <div className="w-16 h-16 bg-muted/60 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-muted-foreground/30" />
          </div>
          <h3 className="text-lg font-display font-bold text-foreground mb-2">No entries yet</h3>
          <p className="text-muted-foreground font-body max-w-xs mx-auto">Start by creating your first event, news piece, or announcement.</p>
          <Button onClick={handleOpenCreate} variant="outline" className="mt-6 rounded-xl font-body">Create New</Button>
        </motion.div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {events.map((event: Post, i: number) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                className="bg-card border border-border/50 rounded-2xl p-4 hover:shadow-card transition-all duration-300 group relative"
              >
                <div className="flex flex-col sm:flex-row gap-5">
                  <div className="w-full sm:w-44 h-28 sm:h-auto rounded-xl bg-muted overflow-hidden relative flex-shrink-0 shadow-sm">
                    {event.coverImage ? (
                      <img src={event.coverImage} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-border/40">
                        <ImageIcon className="w-6 h-6 text-muted-foreground/30" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-[9px] text-white font-bold tracking-wider uppercase border border-white/10">
                        {event.type}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-start justify-between gap-4 mb-2">
                       <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-display font-bold text-foreground text-base truncate">{event.title}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-body font-bold flex-shrink-0 border ${statusColor(event.status)}`}>
                            {event.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground font-body line-clamp-2 leading-relaxed">
                          {event.excerpt || event.content.substring(0, 100) + "..."}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {event.status === "DRAFT" && event.authorId === user?.id && (
                          <Button variant="outline" size="sm" className="h-8 rounded-lg text-[10px] px-3 font-bold uppercase tracking-tight" onClick={() => submitMutation.mutate(event.id)}>SUBMIT</Button>
                        )}
                        {isAdmin() && event.status === "PENDING" && (
                          <div className="flex gap-1.5 p-1 bg-muted/60 rounded-xl">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-emerald hover:bg-emerald/10" title="Approve" onClick={() => reviewMutation.mutate({ id: event.id, status: "PUBLISHED" })}>
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-rose hover:bg-rose/10" title="Reject" onClick={() => {
                              const reason = prompt("Rejection reason:");
                              if (reason) reviewMutation.mutate({ id: event.id, status: "REJECTED", rejectionReason: reason });
                            }}>
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => handleOpenEdit(event)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-rose/10 hover:text-rose transition-colors" onClick={() => {
                          if (confirm("Are you sure you want to delete this content?")) deleteMutation.mutate(event.id);
                        }}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center gap-y-2 gap-x-5 text-[11px] text-muted-foreground font-body flex-wrap border-t border-border/40 pt-4">
                      {event.eventDate && (
                        <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-primary/60" />{new Date(event.eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                      )}
                      {(event.startTime || event.endTime) && (
                        <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary/60" />{event.startTime || "--:--"}{event.endTime ? ` - ${event.endTime}` : ''}</div>
                      )}
                      {event.location && (
                        <div className="flex items-center gap-1.5 truncate max-w-[150px]"><MapPin className="w-3.5 h-3.5 text-primary/60" />{event.location}</div>
                      )}
                      {event.externalLink && (
                        <a href={event.externalLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors font-medium"><ExternalLink className="w-3.5 h-3.5" />Link</a>
                      )}
                    </div>

                    {event.status === "REJECTED" && event.rejectionReason && (
                      <div className="mt-3 flex items-start gap-2 bg-rose/5 p-2.5 rounded-xl border border-rose/10">
                        <Info className="w-3.5 h-3.5 text-rose mt-0.5 flex-shrink-0" /> 
                        <p className="text-[10px] text-rose font-medium leading-normal"><span className="font-bold uppercase tracking-wider mr-1">Rejection Reason:</span>{event.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
