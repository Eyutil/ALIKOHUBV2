import { useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { ArrowRight, CheckCircle, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const Contact = () => {
  const [searchParams] = useSearchParams();
  const portal = (searchParams.get("portal") as "professional" | "social") || "professional";
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
    toast.success("Message sent!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar portal={portal} />

      <section className="bg-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">Get in touch.</h1>
            <p className="text-lg text-primary-foreground/80 font-body max-w-2xl mx-auto">
              Have a question or want to discuss your event? We'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {submitted ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Message sent!</h2>
              <p className="text-muted-foreground font-body">We'll get back to you shortly.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-body">Name *</Label>
                  <Input required />
                </div>
                <div className="space-y-2">
                  <Label className="font-body">Email *</Label>
                  <Input type="email" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-body">Subject</Label>
                <Input />
              </div>
              <div className="space-y-2">
                <Label className="font-body">Message *</Label>
                <Textarea required rows={5} />
              </div>
              <Button type="submit" size="lg" disabled={loading} className="w-full font-body bg-primary text-primary-foreground hover:bg-primary/90">
                {loading ? "Sending..." : "Send Message"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </form>
          )}
        </div>
      </section>

      <Footer portal={portal} />
    </div>
  );
};

export default Contact;
