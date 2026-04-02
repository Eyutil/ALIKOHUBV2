import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, ClipboardList, Globe, Mic, Award, Users, BarChart3, Shield, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useRef, useState } from "react";

const whyChoose = [
  { text: "Precision-Driven Execution", desc: "Every timeline, vendor, and deliverable is managed with military-grade coordination — so nothing is left to chance.", icon: Shield, cardBg: "hsla(174, 60%, 41%, 0.08)", iconColor: "text-teal" },
  { text: "Measurable Impact", desc: "We design events that move metrics — from attendee engagement scores to post-event lead conversion.", icon: TrendingUp, cardBg: "hsla(262, 52%, 56%, 0.10)", iconColor: "text-violet" },
  { text: "Global Reach, Local Mastery", desc: "With experience across 15+ countries, we blend international standards with deep cultural understanding.", icon: Globe, cardBg: "hsla(12, 76%, 61%, 0.08)", iconColor: "text-coral" },
  { text: "Technology-Forward", desc: "From hybrid streaming to real-time analytics dashboards — we leverage modern tools to amplify every experience.", icon: Zap, cardBg: "hsla(262, 52%, 56%, 0.10)", iconColor: "text-violet" },
  { text: "Transparent Budgeting", desc: "Clear cost breakdowns, real-time tracking, and no surprises at the finish line.", icon: BarChart3, cardBg: "hsla(174, 60%, 41%, 0.08)", iconColor: "text-teal" },
  { text: "Experienced Production Team", desc: "Seasoned professionals who've delivered hundreds of high-profile events across every format.", icon: Award, cardBg: "hsla(12, 76%, 61%, 0.08)", iconColor: "text-coral" },
];

const coreServices = [
  { icon: ClipboardList, title: "Complete Event Management", desc: "We manage every aspect of your event — from concept development and vendor sourcing to onsite execution and final reporting.", image: "/images/conference-hall.jpg", cardBg: "hsla(174, 60%, 41%, 0.08)", iconColor: "text-teal" },
  { icon: Award, title: "Corporate & Government Events", desc: "We design professional events aligned with institutional standards, stakeholder expectations, and policy requirements.", image: "/images/corporate-event.jpg", cardBg: "hsla(262, 52%, 56%, 0.10)", iconColor: "text-violet" },
  { icon: Globe, title: "Hybrid & Virtual Event Production", desc: "We combine production quality, digital engagement tools, and audience interaction to create dynamic hybrid experiences.", image: "/images/hybrid-event.jpg", cardBg: "hsla(12, 76%, 61%, 0.08)", iconColor: "text-coral" },
  { icon: Mic, title: "Launch & Media Events", desc: "We deliver launch events designed to amplify brand presence and engage press, partners, and clients.", image: "/images/media-launch.jpg", cardBg: "hsla(174, 60%, 41%, 0.08)", iconColor: "text-teal" },
  { icon: Users, title: "Conferences & Multi-Day Programs", desc: "We manage multi-session, multi-speaker, multi-day conferences with precision and structure.", image: "/images/summit-stage.jpg", cardBg: "hsla(262, 52%, 56%, 0.10)", iconColor: "text-violet" },
  { icon: BarChart3, title: "Ceremonies & Official Inaugurations", desc: "Protocol-conscious events with structured sequencing and seamless coordination.", image: "/images/vip-protocol.jpg", cardBg: "hsla(12, 76%, 61%, 0.08)", iconColor: "text-coral" },
];

const coverageGrid = [
  { text: "Event Strategy & Concept", cardBg: "hsla(174, 60%, 41%, 0.08)" },
  { text: "Budget Development & Procurement", cardBg: "hsla(262, 52%, 56%, 0.10)" },
  { text: "Registration & Ticketing", cardBg: "hsla(12, 76%, 61%, 0.08)" },
  { text: "Agenda & Speaker Management", cardBg: "hsla(174, 60%, 41%, 0.08)" },
  { text: "Vendor & Venue Coordination", cardBg: "hsla(262, 52%, 56%, 0.10)" },
  { text: "VIP & Protocol Support", cardBg: "hsla(12, 76%, 61%, 0.08)" },
  { text: "Onsite Operations & Staffing", cardBg: "hsla(174, 60%, 41%, 0.08)" },
  { text: "Post-Event Reporting & Analytics", cardBg: "hsla(262, 52%, 56%, 0.10)" },
];

/* Auto-sliding carousel hook */
const useAutoSlide = (length: number, interval = 4000) => {
  const [index, setIndex] = useState(0);
  const ref = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    ref.current = setInterval(() => setIndex((p) => (p + 1) % length), interval);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [length, interval]);

  return { index, setIndex };
};

const ProfessionalServices = () => {
  const whySlider = useAutoSlide(whyChoose.length, 4000);
  const serviceSlider = useAutoSlide(coreServices.length, 5000);

  /* How many visible cards based on screen */
  const getVisible = () => (typeof window !== "undefined" && window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1);
  const [visible, setVisible] = useState(getVisible);
  useEffect(() => {
    const h = () => setVisible(getVisible());
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar portal="professional" />

      <section className="bg-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">Our Services</h1>
            <p className="text-lg text-primary-foreground/80 font-body max-w-2xl mx-auto">
              Strategic event planning backed by operational excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Choose — horizontal auto-sliding cards */}
      <section className="container mx-auto px-4 py-20 overflow-hidden">
        <h2 className="text-3xl font-bold text-foreground text-center mb-12">Why Choose Aliko Events</h2>
        <div className="relative">
          <div
            className="flex gap-5 transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${whySlider.index * (100 / visible)}%)` }}
          >
            {[...whyChoose, ...whyChoose].map((item, i) => (
              <div
                key={`${item.text}-${i}`}
                className="flex-shrink-0 rounded-2xl p-7 border border-border/40 shadow-card hover:shadow-elevated transition-all duration-300"
                style={{ width: `calc(${100 / visible}% - ${((visible - 1) * 20) / visible}px)`, backgroundColor: item.cardBg }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: item.cardBg }}>
                  <item.icon className={`w-6 h-6 ${item.iconColor}`} />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{item.text}</h3>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {whyChoose.map((_, i) => (
              <button
                key={i}
                onClick={() => whySlider.setIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${whySlider.index % whyChoose.length === i ? "bg-primary w-6" : "bg-border hover:bg-muted-foreground/40"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Core Services — horizontal auto-sliding cards */}
      <section className="bg-muted py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Core Services</h2>
          <div className="relative">
            <div
              className="flex gap-5 transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${serviceSlider.index * (100 / visible)}%)` }}
            >
              {[...coreServices, ...coreServices].map((s, i) => (
                <div
                  key={`${s.title}-${i}`}
                  className={`flex-shrink-0 rounded-2xl bg-card border border-border/40 shadow-card hover:shadow-elevated transition-all duration-300 overflow-hidden group`}
                  style={{ width: `calc(${100 / visible}% - ${((visible - 1) * 20) / visible}px)` }}
                >
                  <div className="aspect-[16/9] overflow-hidden">
                    <img src={s.image} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: s.cardBg }}>
                        <s.icon className={`w-4 h-4 ${s.iconColor}`} />
                      </div>
                      <h3 className="font-display text-base font-semibold text-foreground">{s.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground font-body leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {coreServices.map((_, i) => (
                <button
                  key={i}
                  onClick={() => serviceSlider.setIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${serviceSlider.index % coreServices.length === i ? "bg-primary w-6" : "bg-border hover:bg-muted-foreground/40"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Grid */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-foreground text-center mb-4">All Bases Covered</h2>
        <p className="text-center text-muted-foreground font-body mb-12 max-w-xl mx-auto">
          Every element of your event, handled with care.
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {coverageGrid.map((item, i) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-5 rounded-2xl border border-border/30 text-left shadow-card hover:shadow-elevated transition-all"
              style={{ backgroundColor: item.cardBg }}
            >
              <span className="text-sm font-semibold font-body text-foreground">{item.text}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-primary py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">Ready to get started?</h2>
          <Link to="/professional/request-proposal">
            <Button size="lg" className="font-body bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold">
              Request Proposal
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer portal="professional" />
    </div>
  );
};

export default ProfessionalServices;
