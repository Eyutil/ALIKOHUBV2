import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Shield, Globe, Zap, BarChart3, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroProfessional from "@/assets/hero-professional.jpg";

const stats = [
  { value: "100+", label: "Events Delivered" },
  { value: "15+", label: "Countries Served" },
  { value: "25,000+", label: "Attendees Hosted" },
  { value: "98%", label: "Client Satisfaction" },
];

const pillars = [
  { icon: Shield, title: "Precision-Driven Execution", desc: "Every timeline, vendor, and deliverable is managed with military-grade coordination — so nothing is left to chance.", color: "text-teal", bg: "bg-teal/10", border: "border-teal/20" },
  { icon: TrendingUp, title: "Measurable Impact", desc: "We design events that move metrics — from attendee engagement scores to post-event lead conversion.", color: "text-indigo", bg: "bg-indigo/10", border: "border-indigo/20" },
  { icon: Globe, title: "Global Reach, Local Mastery", desc: "With experience across 15+ countries, we blend international standards with deep cultural understanding.", color: "text-coral", bg: "bg-coral/10", border: "border-coral/20" },
  { icon: Zap, title: "Technology-Forward", desc: "From hybrid streaming to real-time analytics dashboards — we leverage modern tools to amplify every experience.", color: "text-violet", bg: "bg-violet/10", border: "border-violet/20" },
];

const industries = [
  { label: "Technology", bg: "bg-sky/10 border-sky/20 text-sky" },
  { label: "Finance & Banking", bg: "bg-emerald/10 border-emerald/20 text-emerald" },
  { label: "Government & Public Sector", bg: "bg-indigo/10 border-indigo/20 text-indigo" },
  { label: "Healthcare & Pharma", bg: "bg-coral/10 border-coral/20 text-coral" },
  { label: "Education", bg: "bg-violet/10 border-violet/20 text-violet" },
  { label: "Energy & Infrastructure", bg: "bg-amber/10 border-amber/20 text-amber" },
  { label: "Non-Profit & NGO", bg: "bg-teal/10 border-teal/20 text-teal" },
  { label: "Media & Entertainment", bg: "bg-rose/10 border-rose/20 text-rose" },
];

const highlights = [
  { stat: "4.9/5", label: "Average client rating across all events", icon: BarChart3 },
  { stat: "72hrs", label: "Average post-event report turnaround", icon: Zap },
  { stat: "350+", label: "Vendor partners in our curated network", icon: Users },
];

const steps = [
  { num: "01", title: "Discover & Strategize", desc: "We understand your objectives, audience, and success metrics.", color: "text-teal", bg: "bg-teal/10" },
  { num: "02", title: "Plan & Produce", desc: "We manage timelines, vendors, budgets, and every operational detail.", color: "text-indigo", bg: "bg-indigo/10" },
  { num: "03", title: "Deliver & Report", desc: "We execute flawlessly and provide post-event insights and reporting.", color: "text-coral", bg: "bg-coral/10" },
];

const ProfessionalHome = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar portal="professional" />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroProfessional} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 gradient-overlay" />
        </div>
        <div className="relative container mx-auto px-4 py-24 lg:py-36">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
              Professional events planned with precision and delivered with impact.
            </h1>
            <p className="text-lg text-primary-foreground/80 font-body mb-8 leading-relaxed">
              From strategy to execution, we design and manage conferences, summits, corporate programs, and institutional events that inspire confidence and deliver measurable results.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/professional/request-proposal">
                <Button size="lg" className="font-body bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold">
                  Request Proposal
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/professional/events">
                <Button size="lg" variant="outline" className="font-body border-primary-foreground text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20">
                  Explore Events
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Credibility Stats */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary-foreground text-center mb-12">Trusted to deliver events that matter.</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl lg:text-5xl font-bold text-gradient-gold mb-2">{s.value}</p>
                <p className="text-sm text-primary-foreground/70 font-body">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Aliko — Value Pillars */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-foreground text-center mb-4">Why Leading Organizations Choose Aliko</h2>
        <p className="text-center text-muted-foreground font-body mb-12 max-w-xl mx-auto">
          We don't just plan events — we engineer outcomes.
        </p>
        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-2xl border ${p.border} ${p.bg} transition-all hover:shadow-elevated`}
            >
              <p.icon className={`w-8 h-8 ${p.color} mb-4`} />
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground text-center mb-4">Industries We Serve</h2>
          <p className="text-center text-muted-foreground font-body mb-12 max-w-lg mx-auto">
            Deep expertise across sectors that demand excellence.
          </p>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {industries.map((ind, i) => (
              <motion.span
                key={ind.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`px-5 py-2.5 rounded-full border font-body text-sm font-semibold ${ind.bg}`}
              >
                {ind.label}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Highlights */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-6">
          {highlights.map((h, i) => (
            <motion.div
              key={h.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-8 rounded-2xl bg-card border border-border shadow-card"
            >
              <h.icon className="w-8 h-8 text-accent mx-auto mb-3" />
              <p className="text-3xl font-bold text-foreground mb-1">{h.stat}</p>
              <p className="text-sm text-muted-foreground font-body">{h.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How We Work */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">How We Work</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`text-center p-8 rounded-2xl ${s.bg} border border-border`}
              >
                <span className={`text-5xl font-display font-bold ${s.color}`}>{s.num}</span>
                <h3 className="font-display text-xl font-semibold text-foreground mt-4 mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground font-body">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-primary py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary-foreground text-center mb-12">What Our Clients Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Amara Obi", role: "Conference Director", quote: "Aliko Events delivered our annual summit flawlessly. Their team handled every detail with professionalism and clarity.", accent: "border-l-4 border-l-teal" },
              { name: "David Mensah", role: "HR Manager", quote: "The career fair tools and attendee matching saved us countless hours of coordination.", accent: "border-l-4 border-l-coral" },
              { name: "Fatima Al-Hassan", role: "Education Lead", quote: "From ticketing to analytics, everything just works beautifully. A truly professional experience.", accent: "border-l-4 border-l-indigo" },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/10 ${t.accent}`}
              >
                <p className="text-primary-foreground/90 font-body text-sm leading-relaxed mb-4">"{t.quote}"</p>
                <div>
                  <p className="font-semibold text-primary-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-gold font-body">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
          Ready to plan your next professional event?
        </h2>
        <p className="text-muted-foreground font-body mb-8 max-w-md mx-auto">
          Join thousands of organizers creating impactful professional events with Aliko.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/professional/request-proposal">
            <Button size="lg" className="font-body bg-primary text-primary-foreground hover:bg-primary/90">
              Request Proposal
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link to="/professional/services">
            <Button size="lg" variant="outline" className="font-body">
              View All Services
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer portal="professional" />
    </div>
  );
};

export default ProfessionalHome;
