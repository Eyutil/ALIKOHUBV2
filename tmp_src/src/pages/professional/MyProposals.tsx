import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Clock, CheckCircle2, FilePlus2, Building2, Calendar, MapPin, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Proposal {
  id: string;
  companyName: string;
  type: string;
  status: "PENDING" | "REVIEWED" | "CONVERTED";
  createdAt: string;
  preferredDate?: string;
  location?: string;
}

const MyProposals = () => {
  const { user } = useAuth();

  const { data: proposals, isLoading } = useQuery({
    queryKey: ["my-proposals"],
    queryFn: async () => {
      const { data } = await api.get("/manage/events/my-promotions");
      return data as Proposal[];
    },
    enabled: !!user,
  });

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto space-y-12">
        <header>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold font-display text-foreground tracking-tight"
          >
            My Proposals
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground font-body mt-4 max-w-2xl"
          >
            Track the status of your event partnership and promotion inquiries.
          </motion.p>
        </header>

        {isLoading ? (
          <div className="grid gap-6">
            {[1, 2].map(i => (
              <div key={i} className="h-32 rounded-3xl bg-card/40 animate-pulse border border-border/20" />
            ))}
          </div>
        ) : !proposals?.length ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-card/30 backdrop-blur-sm rounded-[40px] border border-border/40"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-primary/60" />
            </div>
            <h3 className="text-2xl font-bold font-display text-foreground mb-2">No proposals yet</h3>
            <p className="text-muted-foreground font-body mb-8">Ready to bring your event vision to Aliko?</p>
            <Button asChild className="rounded-full px-8 h-12 font-bold font-display">
              <Link to="/professional/request-proposal">Submit Your First Proposal</Link>
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {proposals.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group bg-card/30 backdrop-blur-md border border-border/40 hover:border-primary/40 rounded-[32px] p-6 md:p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 shadow-sm overflow-hidden relative"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm ${
                         p.status === "PENDING" ? "bg-amber-100/50 text-amber-600" :
                         p.status === "REVIEWED" ? "bg-blue-100/50 text-blue-600" :
                         "bg-emerald-100/50 text-emerald-600"
                       }`}>
                         {p.status === "PENDING" ? <Clock className="w-5 h-5" /> : 
                          p.status === "REVIEWED" ? <CheckCircle2 className="w-5 h-5" /> :
                          <FilePlus2 className="w-5 h-5" />}
                       </div>
                       <div>
                         <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{p.type} Request</span>
                         <h3 className="text-xl font-bold font-display text-foreground group-hover:text-primary transition-colors">{p.companyName}</h3>
                       </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-body">
                      <div className="flex items-center gap-1.5 bg-muted/30 px-3 py-1.5 rounded-full border border-border/20">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{format(new Date(p.createdAt), "MMM d, yyyy")}</span>
                      </div>
                      {p.location && (
                        <div className="flex items-center gap-1.5 bg-muted/30 px-3 py-1.5 rounded-full border border-border/20">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{p.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:flex-col md:items-end gap-3">
                    <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                      p.status === "PENDING" ? "bg-amber-500 text-white" :
                      p.status === "REVIEWED" ? "bg-blue-500 text-white" :
                      "bg-emerald-500 text-white"
                    }`}>
                      {p.status}
                    </div>
                    <Link 
                      to="/contact" 
                      className="text-xs font-bold font-display text-primary hover:underline flex items-center gap-1.5 group/link"
                    >
                      Questions? Contact Support <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>

                {p.status === "CONVERTED" && (
                  <div className="mt-6 pt-6 border-t border-border/20 flex items-center gap-3">
                    <div className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase">Great News!</div>
                    <p className="text-sm font-body text-muted-foreground">Your proposal has been accepted and an event draft has been created.</p>
                  </div>
                )}
                
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProposals;
