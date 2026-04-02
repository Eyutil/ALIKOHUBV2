import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, Sparkles, Star, Clock, Palette, Gift, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroSocial from "@/assets/hero-social.jpg";

const moments = [
  { icon: Heart, label: "Weddings", stat: "200+", desc: "Dream weddings brought to life", color: "text-rose", bg: "bg-rose/10", border: "border-rose/20" },
  { icon: Sparkles, label: "Birthdays & Milestones", stat: "500+", desc: "Celebrations that set the standard", color: "text-coral", bg: "bg-coral/10", border: "border-coral/20" },
  { icon: Star, label: "Engagements & Showers", stat: "150+", desc: "Intimate gatherings, perfectly styled", color: "text-violet", bg: "bg-violet/10", border: "border-violet/20" },
];

const promisePoints = [
  { icon: Palette, title: "Your Vision, Elevated", desc: "We listen deeply, then design experiences that feel uniquely yours — never cookie-cutter, always personal.", color: "text-rose", bg: "bg-rose/10", border: "border-rose/20" },
  { icon: Clock, title: "Stress-Free From Start to Finish", desc: "We handle the logistics, the timelines, the vendor calls — so you can be fully present in your moment.", color: "text-teal", bg: "bg-teal/10", border: "border-teal/20" },
  { icon: Camera, title: "Every Detail, Picture-Perfect", desc: "From table settings to lighting to flow — we obsess over the details that make your photos and memories magical.", color: "text-amber", bg: "bg-amber/10", border: "border-amber/20" },
  { icon: Heart, title: "Built on Trust & Care", desc: "98% of our clients come through referrals. We treat every celebration like it's our own family's.", color: "text-indigo", bg: "bg-indigo/10", border: "border-indigo/20" },
];

const gallery = [
  { image: "/images/wedding.jpg", label: "Elegant Weddings" },
  { image: "/images/birthday.jpg", label: "Vibrant Birthdays" },
  { image: "/images/bridal-shower.jpg", label: "Bridal Showers" },
  { image: "/images/engagement.jpg", label: "Engagement Parties" },
  { image: "/images/graduation.jpg", label: "Graduations" },
  { image: "/images/anniversary.jpg", label: "Anniversaries" },
];

const SocialHome = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar portal="social" />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroSocial} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        </div>
        <div className="relative container mx-auto px-4 py-24 lg:py-36">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
              Celebrate beautifully. We'll handle the rest.
            </h1>
            <p className="text-lg text-primary-foreground/80 font-body mb-8 leading-relaxed">
              From weddings to milestone celebrations, we plan meaningful experiences so you can enjoy every moment.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/social/book-consultation">
                <Button size="lg" className="font-body bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold">
                  Book Consultation
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/social/services">
                <Button size="lg" variant="outline" className="font-body border-primary-foreground text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20">
                  Explore Packages
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Moments We Create — stat-driven cards */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-foreground text-center mb-4">Moments We Create</h2>
        <p className="text-center text-muted-foreground font-body mb-12 max-w-lg mx-auto">
          Every celebration is a story. We make yours unforgettable.
        </p>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {moments.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-2xl border ${m.border} ${m.bg} text-center transition-all hover:shadow-elevated`}
            >
              <m.icon className={`w-10 h-10 ${m.color} mx-auto mb-3`} />
              <p className={`text-3xl font-bold ${m.color} mb-1`}>{m.stat}</p>
              <h3 className="font-display text-lg font-semibold text-foreground mb-1">{m.label}</h3>
              <p className="text-sm text-muted-foreground font-body">{m.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Inspiration Gallery Mosaic */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground text-center mb-4">Inspiration Gallery</h2>
          <p className="text-center text-muted-foreground font-body mb-12 max-w-lg mx-auto">
            A glimpse into the celebrations we've had the honor of bringing to life.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-5xl mx-auto">
            {gallery.map((g, i) => (
              <motion.div
                key={g.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="relative rounded-xl overflow-hidden group aspect-[4/3]"
              >
                <img src={g.image} alt={g.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-primary-foreground font-body text-sm font-semibold">{g.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Aliko Promise */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-foreground text-center mb-4">The Aliko Promise</h2>
        <p className="text-center text-muted-foreground font-body mb-12 max-w-lg mx-auto">
          Why families and couples trust us with their most important days.
        </p>
        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {promisePoints.map((p, i) => (
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

      {/* Testimonials */}
      <section className="bg-primary py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary-foreground text-center mb-12">What Our Clients Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Chioma Eze", event: "Wedding", quote: "Aliko Events made our wedding day absolutely magical. Every detail was perfect.", accent: "border-l-4 border-l-rose" },
              { name: "Kwame Asante", event: "Birthday", quote: "My 40th birthday celebration was beyond anything I imagined. The team was incredible.", accent: "border-l-4 border-l-coral" },
              { name: "Nadia Bello", event: "Graduation", quote: "They handled everything so I could just enjoy my daughter's graduation party stress-free.", accent: "border-l-4 border-l-indigo" },
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
                  <p className="text-xs text-gold font-body">{t.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Gift className="w-12 h-12 text-accent mx-auto mb-4" />
        <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
          Let's plan your celebration.
        </h2>
        <p className="text-muted-foreground font-body mb-8 max-w-md mx-auto">
          Beautiful moments deserve thoughtful planning. Let's create something unforgettable together.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/social/book-consultation">
            <Button size="lg" className="font-body bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold">
              Book Consultation
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link to="/social/services">
            <Button size="lg" variant="outline" className="font-body">
              View Planning Packages
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer portal="social" />
    </div>
  );
};

export default SocialHome;
