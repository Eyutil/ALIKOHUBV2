import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Trash2, Plus, Film, Image as ImageIcon, FolderOpen } from "lucide-react";
import { motion } from "framer-motion";

const professionalCategories = ["Business Summit", "Education Forum", "Tech Fair", "Conference", "Corporate Event", "Media Launch"];
const socialCategories = ["Wedding", "Birthday", "Bridal Shower", "Graduation", "Engagement", "Anniversary", "Celebration"];

const AdminMedia = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [portal, setPortal] = useState<string>("professional");
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ category: "", title: "", description: "", mediaType: "image" as "image" | "video", mediaUrl: "", thumbnailUrl: "" });

  const categories = portal === "professional" ? professionalCategories : socialCategories;

  const { data: media = [], isLoading } = useQuery({
    queryKey: ["admin-portfolio-media", portal],
    queryFn: async () => {
      const { data } = await api.get("/manage/events/portfolio", { params: { portal } });
      return data ?? [];
    },
    enabled: !!user,
  });

  const handleFileUpload = async (file: File, field: "mediaUrl" | "thumbnailUrl") => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", field === "mediaUrl" ? form.mediaType : "image");

    try {
      const { data } = await api.post("/manage/events/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((f) => ({ ...f, [field]: data.url }));
      toast.success("File uploaded!");
    } catch (e: any) {
      toast.error("Upload failed: " + (e.response?.data?.message || e.message));
    } finally {
      setUploading(false);
    }
  };

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      await api.post("/manage/events/portfolio", { ...payload, portal });
    },
    onSuccess: () => {
      toast.success("Media added!");
      queryClient.invalidateQueries({ queryKey: ["admin-portfolio-media"] });
      setShowForm(false);
      setForm({ category: "", title: "", description: "", mediaType: "image", mediaUrl: "", thumbnailUrl: "" });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/manage/events/portfolio/${id}`);
    },
    onSuccess: () => {
      toast.success("Deleted!");
      queryClient.invalidateQueries({ queryKey: ["admin-portfolio-media"] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || e.message),
  });

  const grouped = media.reduce<Record<string, any[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Media</h1>
          <p className="text-sm text-muted-foreground font-body mt-1">Manage portfolio images and videos</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="font-body rounded-xl gap-2 shadow-md"><Plus className="w-4 h-4" />Add Media</Button>
      </motion.div>

      <div className="flex gap-2">
        {["professional", "social"].map((p) => (
          <Button key={p} variant={portal === p ? "default" : "outline"} size="sm" onClick={() => setPortal(p)} className="font-body rounded-xl capitalize">
            {p} {p === "professional" ? "Portfolio" : "Gallery"}
          </Button>
        ))}
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-card border border-border/60 rounded-2xl p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="font-body text-xs">Category *</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-body text-xs">Media Type *</Label>
              <Select value={form.mediaType} onValueChange={(v) => setForm({ ...form, mediaType: v as "image" | "video" })}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="image">Image</SelectItem><SelectItem value="video">Video</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <div><Label className="font-body text-xs">Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-xl" /></div>
          <div><Label className="font-body text-xs">Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-xl" /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="font-body text-xs">Media File *</Label>
              <Input type="file" accept={form.mediaType === "video" ? "video/*" : "image/*"} onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "mediaUrl")} className="rounded-xl" />
              {form.mediaUrl && <p className="text-xs text-emerald mt-1 font-body">✓ Uploaded</p>}
            </div>
            <div>
              <Label className="font-body text-xs">Thumbnail (videos)</Label>
              <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "thumbnailUrl")} className="rounded-xl" />
              {form.thumbnailUrl && <p className="text-xs text-emerald mt-1 font-body">✓ Uploaded</p>}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowForm(false)} className="font-body rounded-xl">Cancel</Button>
            <Button onClick={() => createMutation.mutate(form)} disabled={!form.category || !form.title || !form.mediaUrl || createMutation.isPending || uploading} className="font-body rounded-xl">
              {uploading ? "Uploading..." : createMutation.isPending ? "Saving..." : "Save Media"}
            </Button>
          </div>
        </motion.div>
      )}

      {isLoading ? (
        <div className="text-center py-16 text-muted-foreground font-body">Loading...</div>
      ) : Object.keys(grouped).length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground font-body">No media uploaded yet.</p>
        </motion.div>
      ) : (
        Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-base font-display font-bold text-foreground mb-3">{category}</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="relative rounded-2xl overflow-hidden bg-card border border-border/60 group hover:shadow-card transition-all"
                >
                  <div className="aspect-video">
                    {item.mediaType === "video" ? (
                      <video src={item.mediaUrl} poster={item.thumbnailUrl || undefined} className="w-full h-full object-cover" preload="metadata" />
                    ) : (
                      <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-1.5">
                      {item.mediaType === "video" ? <Film className="w-3 h-3 text-muted-foreground" /> : <ImageIcon className="w-3 h-3 text-muted-foreground" />}
                      <span className="text-xs font-body font-semibold text-foreground truncate">{item.title}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteMutation.mutate(item.id)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-destructive/90 text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminMedia;
