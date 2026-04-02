import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const testimonials = [
  { name: "Amara Obi", role: "Conference Director", quote: "Aliko Events delivered our annual summit flawlessly. Their team handled every detail with professionalism and clarity." },
  { name: "David Mensah", role: "HR Manager", quote: "The career fair tools and attendee matching saved us countless hours of coordination." },
  { name: "Fatima Al-Hassan", role: "Education Lead", quote: "From ticketing to analytics, everything just works beautifully. A truly professional experience." },
  { name: "Chioma Eze", role: "Bride", quote: "Aliko Events made our wedding day absolutely magical. Every single detail was perfect." },
  { name: "Kwame Asante", role: "Birthday Host", quote: "My 40th birthday celebration was beyond anything I imagined. The team was incredible." },
  { name: "Nadia Bello", role: "Proud Mom", quote: "They handled everything so I could just enjoy my daughter's graduation party stress-free." },
  { name: "Ibrahim Toure", role: "CEO", quote: "Our product launch event exceeded all expectations. The media coverage was outstanding." },
  { name: "Grace Adeyemi", role: "Wedding Planner", quote: "As a fellow planner, I trust Aliko Events for large-scale coordination. They never disappoint." },
];

const Testimonials = () => {
  const [searchParams] = useSearchParams();
  const portal = (searchParams.get("portal") as "professional" | "social") || "professional";

  return (
    <div className="min-h-screen bg-background">
      <Navbar portal={portal} />

      <section className="bg-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">What our clients say.</h1>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-6 rounded-xl bg-card border border-border shadow-card"
            >
              <p className="text-foreground/90 font-body text-sm leading-relaxed mb-4">"{t.quote}"</p>
              <div>
                <p className="font-semibold text-foreground text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground font-body">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer portal={portal} />
    </div>
  );
};

export default Testimonials;
