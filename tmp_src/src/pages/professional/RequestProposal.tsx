import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, User, Mail, Phone, Calendar, MapPin, Send, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const RequestProposal = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    organization: "",
    type: "EVENT",
    contactPerson: "",
    email: "",
    phoneNumber: "",
    preferredDate: "",
    location: "",
    estimatedAttendees: "",
    message: "",
  });

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.post("/events/promote", formData);
      setSubmitted(true);
      toast.success("Proposal submitted successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit proposal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-6 bg-card/40 backdrop-blur-xl p-12 rounded-[40px] border border-primary/20 shadow-2xl shadow-primary/10"
        >
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 relative">
            <CheckCircle2 className="w-12 h-12 text-primary" />
            <motion.div 
               animate={{ scale: [1, 1.5, 1], opacity: [0, 0.5, 0] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="absolute inset-0 rounded-full bg-primary/20"
            />
          </div>
          <h2 className="text-3xl font-bold font-display text-foreground tracking-tight">Proposal Received!</h2>
          <p className="text-muted-foreground font-body">
            Thank you for your interest. Our team will review your proposal and get back to you shortly.
          </p>
          <div className="pt-4 flex flex-col gap-3">
            <Button className="rounded-full px-8 h-12 font-bold font-display" onClick={() => navigate("/professional/my-proposals")}>
              View My Proposals
            </Button>
            <Button variant="ghost" className="rounded-full font-bold font-display" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
        <Navbar portal="professional" />
        
        {/* Background Decorations */}
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-green-light/5 rounded-full blur-[100px]" />

      <div className="max-w-4xl mx-auto relative z-10 pt-32 pb-20 px-4">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20 mb-4 shadow-sm shadow-primary/5">
            <Sparkles className="w-3.5 h-3.5" />
            Partnership Opportunities
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-display text-foreground tracking-tight">
            Bring Your Vision <span className="text-primary italic">To Life</span>
          </h1>
          <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto leading-relaxed">
            Partner with AlikoHub to host premium corporate events, professional summits, or exclusive industry gatherings.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card/40 backdrop-blur-2xl border border-border/40 rounded-[40px] p-8 md:p-12 shadow-2xl shadow-black/5"
        >
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-bold font-display text-foreground flex items-center gap-2 mb-2">
                <Building2 className="w-5 h-5 text-primary" /> Company Details
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Company Name</label>
                  <Input 
                    value={formData.companyName} 
                    onChange={(e) => handleChange("companyName", e.target.value)} 
                    required 
                    placeholder="Legal company name" 
                    className="h-12 rounded-2xl bg-muted/30 border-border/30" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Parent Organization</label>
                  <Input 
                    value={formData.organization} 
                    onChange={(e) => handleChange("organization", e.target.value)} 
                    placeholder="Group or Holding (Optional)" 
                    className="h-12 rounded-2xl bg-muted/30 border-border/30" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Request Type</label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(v) => handleChange("type", v)}
                  >
                    <SelectTrigger className="h-12 rounded-2xl bg-muted/30 border-border/30">
                      <SelectValue placeholder="What are you proposing?" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/30">
                      <SelectItem value="EVENT">Corporate Event</SelectItem>
                      <SelectItem value="ANNOUNCEMENT">Announcements</SelectItem>
                      <SelectItem value="NEWS">News & Press Release</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold font-display text-foreground flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-primary" /> Contact Person
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                  <Input 
                    value={formData.contactPerson} 
                    onChange={(e) => handleChange("contactPerson", e.target.value)} 
                    required 
                    placeholder="Primary contact person" 
                    className="h-12 rounded-2xl bg-muted/30 border-border/30" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Business Email</label>
                  <Input 
                    value={formData.email} 
                    onChange={(e) => handleChange("email", e.target.value)} 
                    type="email" 
                    required 
                    placeholder="name@company.com" 
                    className="h-12 rounded-2xl bg-muted/30 border-border/30" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Contact Phone</label>
                  <Input 
                    value={formData.phoneNumber} 
                    onChange={(e) => handleChange("phoneNumber", e.target.value)} 
                    type="tel" 
                    placeholder="+1 (555) 000-0000" 
                    className="h-12 rounded-2xl bg-muted/30 border-border/30" 
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6 pt-4 border-t border-border/20">
              <h3 className="text-lg font-bold font-display text-foreground flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-primary" /> Event Scope & Goals
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                   <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Preferred Date</label>
                   <Input 
                     value={formData.preferredDate} 
                     onChange={(e) => handleChange("preferredDate", e.target.value)} 
                     type="date" 
                     className="h-12 rounded-2xl bg-muted/30 border-border/30" 
                   />
                </div>
                <div className="space-y-2 md:col-span-2">
                   <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Target Location</label>
                   <Input 
                     value={formData.location} 
                     onChange={(e) => handleChange("location", e.target.value)} 
                     placeholder="City, Venue, or Digital Platform" 
                     className="h-12 rounded-2xl bg-muted/30 border-border/30" 
                   />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Estimated Attendees</label>
                <Select 
                   value={formData.estimatedAttendees} 
                   onValueChange={(v) => handleChange("estimatedAttendees", v)}
                >
                    <SelectTrigger className="h-12 rounded-2xl bg-muted/30 border-border/30">
                      <SelectValue placeholder="Select expected reach" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/30">
                      <SelectItem value="under_50">&lt; 50 Guests</SelectItem>
                      <SelectItem value="50_200">50 - 200 Guests</SelectItem>
                      <SelectItem value="200_500">200 - 500 Guests</SelectItem>
                      <SelectItem value="500_plus">500+ Guests</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Detailed Message</label>
                <Textarea 
                  value={formData.message} 
                  onChange={(e) => handleChange("message", e.target.value)} 
                  required 
                  placeholder="Tell us about your objectives, requirements, and how we can best support your vision..." 
                  className="min-h-[160px] rounded-3xl bg-muted/30 border-border/30 focus:border-primary transition-all p-6 text-sm"
                />
              </div>
            </div>

            <div className="md:col-span-2 pt-6">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 rounded-full text-lg font-display font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] gap-3"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-5 h-5" />}
                {loading ? "Submitting Inquiry..." : "Submit Proposal"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>

      <Footer portal="professional" />
    </div>
  );
};

export default RequestProposal;
