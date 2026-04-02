import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const templates = [
  { name: "Elegant Gold", desc: "Classic gold accents for timeless celebrations", image: "/images/anniversary.jpg", accent: "from-amber/40 to-transparent" },
  { name: "Garden Romance", desc: "Lush florals and soft pastels", image: "/images/wedding.jpg", accent: "from-rose/40 to-transparent" },
  { name: "Modern Minimal", desc: "Clean lines and sophisticated simplicity", image: "/images/corporate-event.jpg", accent: "from-indigo/40 to-transparent" },
  { name: "Classic White", desc: "Timeless white with delicate details", image: "/images/bridal-shower.jpg", accent: "from-violet/40 to-transparent" },
  { name: "Tropical Vibes", desc: "Vibrant colors for island-inspired events", image: "/images/celebration.jpg", accent: "from-teal/40 to-transparent" },
];

const SocialTemplates = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar portal="social" />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold font-display text-foreground mb-2">Templates</h1>
        <p className="text-muted-foreground font-body mb-8">Choose a beautiful template for your event</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((t, i) => (
            <Link key={t.name} to={`/social/create?template=${encodeURIComponent(t.name)}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="group bg-card border border-border rounded-xl overflow-hidden shadow-card hover:shadow-elevated transition-all cursor-pointer"
              >
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img src={t.image} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${t.accent}`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-display text-lg font-semibold text-primary-foreground">{t.name}</h3>
                    <p className="text-xs text-primary-foreground/70 font-body">{t.desc}</p>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
      <Footer portal="social" />
    </div>
  );
};

export default SocialTemplates;
