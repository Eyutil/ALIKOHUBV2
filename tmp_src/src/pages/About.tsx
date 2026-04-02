import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const philosophy = [
  "Excellence in detail",
  "Clear communication",
  "Transparent planning",
  "Seamless execution",
];

const About = () => {
  const [searchParams] = useSearchParams();
  const portal = (searchParams.get("portal") as "professional" | "social") || "professional";

  const intro = portal === "professional"
    ? "Aliko Events Professional delivers structured, strategic event planning for organizations, institutions, and businesses. We combine operational excellence with modern event technology to create impactful experiences."
    : "Aliko Events Social creates beautifully organized celebrations designed around your vision, culture, and personality.";

  return (
    <div className="min-h-screen bg-background">
      <Navbar portal={portal} />

      <section className="bg-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">About Aliko Events</h1>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-foreground font-body leading-relaxed mb-12">{intro}</p>

          <h2 className="text-2xl font-bold text-foreground mb-6">Our Philosophy</h2>
          <div className="space-y-3 mb-12">
            {philosophy.map((item) => (
              <div key={item} className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="font-body text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer portal={portal} />
    </div>
  );
};

export default About;
