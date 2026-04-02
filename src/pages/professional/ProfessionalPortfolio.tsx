import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, Play, Image as ImageIcon, Film } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const categoryCards = [
  { name: "Business Summit", image: "/images/business-summit.jpg", color: "bg-teal" },
  { name: "Education Forum", image: "/images/education-forum.jpg", color: "bg-indigo" },
  { name: "Tech Fair", image: "/images/tech-fair.jpg", color: "bg-coral" },
  { name: "Conference", image: "/images/conference-hall.jpg", color: "bg-violet" },
  { name: "Corporate Event", image: "/images/corporate-event.jpg", color: "bg-amber" },
  { name: "Media Launch", image: "/images/media-launch.jpg", color: "bg-rose" },
];

const ProfessionalPortfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: media = [] } = useQuery({
    queryKey: ["portfolio-media", "professional", selectedCategory],
    queryFn: async () => {
      const { data } = await api.get("/manage/events/portfolio", {
        params: { portal: "professional", category: selectedCategory || undefined }
      });
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar portal="professional" />

      <section className="bg-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">Portfolio</h1>
            <p className="text-lg text-primary-foreground/80 font-body max-w-2xl mx-auto">
              A closer look at events we've delivered.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <AnimatePresence mode="wait">
          {!selectedCategory ? (
            <motion.div key="categories" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-center text-muted-foreground font-body mb-10 max-w-xl mx-auto">
                Select a category to explore our work.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryCards.map((cat, i) => (
                  <motion.button
                    key={cat.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => setSelectedCategory(cat.name)}
                    className="relative aspect-[4/3] rounded-xl overflow-hidden bg-card border border-border shadow-card group cursor-pointer text-left"
                  >
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className={`inline-block px-3 py-1 text-xs font-body font-semibold rounded-full mb-2 text-primary-foreground ${cat.color}`}>
                        {categoryCards.filter(c => c.name === cat.name).length} Collection
                      </span>
                      <h3 className="font-display text-xl font-bold text-primary-foreground">{cat.name}</h3>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="collection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)} className="font-body">
                  <ArrowLeft className="w-4 h-4 mr-2" /> All Categories
                </Button>
                <h2 className="text-2xl font-display font-bold text-foreground">{selectedCategory}</h2>
                <span className="text-sm text-muted-foreground font-body">
                  {media.length} item{media.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {media.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.06 }}
                    className="relative aspect-[4/3] rounded-xl overflow-hidden bg-card border border-border shadow-card group"
                  >
                    {item.media_type === "video" ? (
                      <video
                        src={item.media_url}
                        poster={item.thumbnail_url || undefined}
                        controls
                        preload="metadata"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img src={item.media_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    )}
                    <div className="absolute top-3 right-3">
                      <span className="bg-foreground/60 backdrop-blur-sm text-primary-foreground rounded-full p-1.5 inline-flex">
                        {item.media_type === "video" ? <Film className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/70 to-transparent p-4">
                      <h3 className="font-display text-sm font-semibold text-primary-foreground">{item.title}</h3>
                      {item.description && <p className="text-xs text-primary-foreground/70 font-body mt-0.5">{item.description}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>

              {media.length === 0 && (
                <p className="text-center text-muted-foreground font-body py-12">No media in this category yet.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section className="bg-muted py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-4">Have an event in mind?</h2>
          <Link to="/professional/request-proposal">
            <Button size="lg" className="font-body bg-primary text-primary-foreground hover:bg-primary/90">
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

export default ProfessionalPortfolio;
