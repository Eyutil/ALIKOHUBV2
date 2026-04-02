import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const BookConsultation = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    event_type: "",
    estimated_guests: "",
    preferred_date: "",
    message: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
    toast.success("Consultation request submitted!");
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar portal="social" />
        <div className="container mx-auto px-4 py-32 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <CheckCircle className="w-16 h-16 text-accent mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4">Thank you for reaching out.</h1>
            <p className="text-muted-foreground font-body max-w-md mx-auto">
              We're excited to learn more about your celebration and will contact you shortly.
            </p>
          </motion.div>
        </div>
        <Footer portal="social" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar portal="social" />

      <section className="bg-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">Let's start planning your celebration.</h1>
            <p className="text-lg text-primary-foreground/80 font-body max-w-2xl mx-auto">
              Share your event details with us. We'll schedule a consultation to discuss your vision and next steps.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-body">Full Name *</Label>
                <Input required value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="font-body">Email *</Label>
                <Input type="email" required value={form.email} onChange={(e) => handleChange("email", e.target.value)} />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-body">Phone</Label>
                <Input value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="font-body">Event Type *</Label>
                <Select required value={form.event_type} onValueChange={(v) => handleChange("event_type", v)}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wedding">Wedding</SelectItem>
                    <SelectItem value="birthday">Birthday</SelectItem>
                    <SelectItem value="bridal_shower">Bridal Shower</SelectItem>
                    <SelectItem value="engagement">Engagement</SelectItem>
                    <SelectItem value="graduation">Graduation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-body">Estimated Guests</Label>
                <Input value={form.estimated_guests} onChange={(e) => handleChange("estimated_guests", e.target.value)} placeholder="e.g. 100" />
              </div>
              <div className="space-y-2">
                <Label className="font-body">Preferred Date</Label>
                <Input type="date" value={form.preferred_date} onChange={(e) => handleChange("preferred_date", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-body">Tell us about your celebration *</Label>
              <Textarea required rows={5} value={form.message} onChange={(e) => handleChange("message", e.target.value)} placeholder="Share your vision, theme ideas, and any special requirements..." />
            </div>
            <Button type="submit" size="lg" disabled={loading} className="w-full font-body bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold">
              {loading ? "Submitting..." : "Submit Request"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>
        </div>
      </section>

      <Footer portal="social" />
    </div>
  );
};

export default BookConsultation;
