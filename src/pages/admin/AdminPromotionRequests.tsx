import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Search, Eye, CheckCircle2, FilePlus2, Building2, User, Mail, Phone, Calendar, MapPin, Users2, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

interface PromotionRequest {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phoneNumber?: string;
  organization?: string;
  event_type?: string;
  estimatedAttendees?: string;
  preferredDate?: string;
  location?: string;
  type: string;
  message: string;
  status: "PENDING" | "REVIEWED" | "CONVERTED";
  createdAt: string;
}

const AdminPromotionRequests = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<PromotionRequest | null>(null);

  const { data: requests, isLoading } = useQuery({
    queryKey: ["admin", "proposals"],
    queryFn: async () => {
      const { data } = await api.get("/manage/events/promotions");
      return data as PromotionRequest[];
    },
  });

  const reviewMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.patch(`/manage/events/promotions/${id}/review`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "proposals"] });
      toast.success("Proposal marked as reviewed");
      setSelected(null);
    },
  });

  const convertMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.post(`/manage/events/promotions/${id}/convert`);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "proposals"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
      toast.success("Event draft created successfully!");
      setSelected(null);
    },
    onError: (e: any) => toast.error(e.response?.data?.message || "Conversion failed"),
  });

  const filtered = requests?.filter(r => 
    r.companyName.toLowerCase().includes(search.toLowerCase()) ||
    r.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
    r.organization?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground tracking-tight flex items-center gap-3">
            Event Proposals <span className="text-sm font-body font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">{requests?.length || 0} Total</span>
          </h1>
          <p className="text-muted-foreground font-body mt-1">Review and manage partnership and promotion inquiries.</p>
        </div>
        <div className="relative w-full md:w-72 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search proposals..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="pl-10 h-11 bg-card/50 border-border/40 hover:border-primary/30 focus:border-primary transition-all rounded-xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
             Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-64 rounded-3xl bg-card/40 animate-pulse border border-border/20" />
             ))
          ) : filtered?.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 opacity-40">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold font-display text-muted-foreground">No proposals found</h3>
              <p className="text-sm text-muted-foreground/60 font-body">Try adjusting your search or filters.</p>
            </div>
          ) : (
            filtered?.map((r) => (
              <motion.div
                key={r.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative bg-card/60 backdrop-blur-sm border border-border/40 hover:border-primary/40 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    r.status === "PENDING" ? "bg-amber-100 text-amber-700" : 
                    r.status === "REVIEWED" ? "bg-blue-100 text-blue-700" :
                    "bg-emerald-100 text-emerald-700"
                  }`}>
                    {r.status}
                  </div>
                  <span className="text-[10px] text-muted-foreground font-body">{format(new Date(r.createdAt), "MMM d, yyyy")}</span>
                </div>

                <h3 className="text-xl font-bold font-display text-foreground group-hover:text-primary transition-colors mb-4 line-clamp-1">
                  {r.companyName}
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground font-body">
                    <User className="w-4 h-4 text-primary/60" />
                    <span>{r.contactPerson}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground font-body">
                    <Mail className="w-4 h-4 text-primary/60" />
                    <span className="truncate">{r.email}</span>
                  </div>
                  {r.organization && (
                    <div className="flex items-center gap-3 text-sm text-muted-foreground font-body font-semibold">
                      <Building2 className="w-4 h-4 text-primary/60" />
                      <span className="truncate">{r.organization}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 rounded-xl h-10 font-body text-xs border-primary/20 hover:bg-primary/5 hover:border-primary/40"
                    onClick={() => setSelected(r)}
                  >
                    <Eye className="w-4 h-4 mr-2" /> View Details
                  </Button>
                  {r.status === "PENDING" && (
                    <Button 
                      onClick={() => reviewMutation.mutate(r.id)}
                      disabled={reviewMutation.isPending}
                      className="bg-primary/90 hover:bg-primary text-primary-foreground rounded-xl h-10 px-3 shadow-md shadow-primary/20"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-xl border-border/40 rounded-3xl p-8">
          {selected && (
            <div className="space-y-8">
              <DialogHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{selected.type} Proposal</span>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    selected.status === "PENDING" ? "bg-amber-100 text-amber-700" : 
                    selected.status === "REVIEWED" ? "bg-blue-100 text-blue-700" :
                    "bg-emerald-100 text-emerald-700"
                  }`}>
                    {selected.status}
                  </div>
                </div>
                <DialogTitle className="text-3xl font-bold font-display text-foreground">{selected.companyName}</DialogTitle>
                <DialogDescription className="font-body text-muted-foreground mt-2">
                  Submitted on {format(new Date(selected.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <User className="w-3.5 h-3.5" /> Contact Details
                  </h4>
                  <div className="space-y-3 bg-muted/20 rounded-2xl p-4 border border-border/20">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase text-muted-foreground">Contact Person</span>
                      <span className="text-sm font-semibold">{selected.contactPerson}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase text-muted-foreground">Email Address</span>
                      <span className="text-sm font-semibold break-all">{selected.email}</span>
                    </div>
                    {selected.phoneNumber && (
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-muted-foreground">Phone Number</span>
                        <span className="text-sm font-semibold">{selected.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5" /> Event Scope
                  </h4>
                  <div className="space-y-3 bg-muted/20 rounded-2xl p-4 border border-border/20">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase text-muted-foreground">Organization</span>
                      <span className="text-sm font-semibold">{selected.organization || "N/A"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase text-muted-foreground">Target Event Type</span>
                      <span className="text-sm font-semibold capitalize font-body">{selected.event_type || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col flex-1">
                        <span className="text-[10px] uppercase text-muted-foreground">Estimated Reach</span>
                        <span className="text-sm font-semibold flex items-center gap-1.5"><Users2 className="w-3.5 h-3.5 text-primary/60" /> {selected.estimatedAttendees || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {(selected.preferredDate || selected.location) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selected.preferredDate && (
                    <div className="flex flex-col bg-primary/5 rounded-2xl p-4 border border-primary/10">
                      <span className="text-[10px] uppercase text-primary/60 font-bold mb-1 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Preferred Date</span>
                      <span className="text-sm font-bold text-primary">{format(new Date(selected.preferredDate), "EEEE, MMMM d, yyyy")}</span>
                    </div>
                  )}
                  {selected.location && (
                    <div className="flex flex-col bg-primary/5 rounded-2xl p-4 border border-primary/10">
                      <span className="text-[10px] uppercase text-primary/60 font-bold mb-1 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Target Location</span>
                      <span className="text-sm font-bold text-primary">{selected.location}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5" /> Message Details
                </h4>
                <div className="bg-muted/30 rounded-2xl p-6 border border-border/20 text-sm font-body leading-relaxed text-foreground/90 whitespace-pre-wrap">
                  {selected.message}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                {selected.status !== "CONVERTED" && (
                   <Button 
                    className="flex-1 rounded-2xl h-12 font-bold font-display shadow-lg shadow-primary/20 gap-2 overflow-hidden group relative"
                    onClick={() => convertMutation.mutate(selected.id)}
                    disabled={convertMutation.isPending}
                   >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-green-light to-primary opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity bg-[length:200%_100%] animate-gradient" />
                    <FilePlus2 className="w-4 h-4 z-10" />
                    <span className="z-10">{convertMutation.isPending ? "Creating Draft..." : "Convert to Event Draft"}</span>
                   </Button>
                )}
                
                {selected.status === "PENDING" && (
                  <Button 
                    variant="outline"
                    className="flex-1 rounded-2xl h-12 font-body text-xs border-primary/20 hover:bg-primary/5 lg:flex-none lg:w-40"
                    onClick={() => reviewMutation.mutate(selected.id)}
                    disabled={reviewMutation.isPending}
                  >
                    Mark as Reviewed
                  </Button>
                )}

                <Button 
                  variant="ghost"
                  className="rounded-2xl h-12 font-body text-xs text-muted-foreground hover:bg-muted"
                  onClick={() => setSelected(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPromotionRequests;
