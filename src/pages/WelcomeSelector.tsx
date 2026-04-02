import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Heart, ArrowRight } from "lucide-react";
import logoProfessional from "@/assets/logo-professional.png";
import logoSocial from "@/assets/logo-social.png";

const VIDEOS = [
  "/videos/welcome-bg.mp4",
  "/videos/welcome-2.mp4",
  "/videos/welcome-3.mp4",
  "/videos/welcome-5.mp4",
];

const ROTATE_INTERVAL = 5000;

const glowWords = [
  { text: "Connect", delay: 1.0 },
  { text: "•", delay: 1.3 },
  { text: "Inspire", delay: 1.5 },
  { text: "•", delay: 1.8 },
  { text: "Elevate", delay: 2.0 },
];

const WelcomeSelector = () => {
  const navigate = useNavigate();
  const [lastVisit, setLastVisit] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("aliko-last-portal");
    if (saved) setLastVisit(saved);
  }, []);

  // Rotate videos
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % VIDEOS.length);
    }, ROTATE_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  // Play active video, pause others
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === activeIndex) {
        v.currentTime = 0;
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [activeIndex]);

  const setVideoRef = useCallback((el: HTMLVideoElement | null, i: number) => {
    videoRefs.current[i] = el;
  }, []);

  const handleSelect = (portal: "professional" | "social") => {
    localStorage.setItem("aliko-last-portal", portal);
    navigate(`/${portal}`);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[hsl(152,50%,3%)]">
      {/* Video layers */}
      {VIDEOS.map((src, i) => (
        <video
          key={src}
          ref={(el) => setVideoRef(el, i)}
          muted
          loop
          playsInline
          preload={i === 0 ? "auto" : "metadata"}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          style={{ opacity: i === activeIndex ? 0.55 : 0 }}
        >
          <source src={src} type="video/mp4" />
        </video>
      ))}

      {/* Heavy dark overlay for card readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(152,50%,3%)]/20 via-[hsl(152,50%,3%)]/45 to-[hsl(152,50%,3%)]/70" />
      <div className="absolute inset-0 bg-[hsl(152,50%,3%)]/15" />

      {/* Continue banner */}
      {lastVisit && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-3 py-3 px-4 bg-accent/90 backdrop-blur-sm"
        >
          <span className="text-sm font-medium text-accent-foreground">Welcome back!</span>
          <button
            onClick={() => handleSelect(lastVisit as "professional" | "social")}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-foreground underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            Continue to {lastVisit === "professional" ? "Professional" : "Social"}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 tracking-tight">
            Welcome to Aliko Events
          </h1>
          <p className="text-lg sm:text-xl font-body font-medium tracking-widest uppercase">
            <span className="text-teal">Professional precision</span>
            <span className="text-primary-foreground/50 mx-3">—</span>
            <span className="text-rose">personal celebration</span>
          </p>
          <p className="text-lg sm:text-2xl text-accent font-body font-bold mt-3 tracking-widest uppercase">
            Choose your experience
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* Professional Card */}
          <motion.button
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect("professional")}
            className="group relative overflow-hidden rounded-2xl border border-primary-foreground/8 hover:border-teal/30 bg-[hsl(152,30%,6%)]/80 backdrop-blur-xl transition-all duration-300 cursor-pointer flex flex-col text-left shadow-[0_0_60px_-15px_hsla(152,45%,18%,0.15)]"
          >
            <div className="flex-1 flex items-center justify-center p-8 min-h-[220px]">
              <img src={logoProfessional} alt="Aliko Events Professional" className="max-h-40 w-auto object-contain" />
            </div>
            <div className="border-t border-primary-foreground/5 bg-[hsl(152,30%,4%)]/90">
              <div className="p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-primary-foreground mb-1">Aliko Events Professional</h2>
                <p className="text-sm text-primary-foreground/60 font-body mb-5">Strategic events. Flawless execution. Measurable impact.</p>
                <ul className="space-y-2 mb-6 font-body">
                  {[
                    { text: "Conferences & Summits", color: "text-teal" },
                    { text: "Corporate & Government Events", color: "text-indigo" },
                    { text: "Hybrid & Virtual Programs", color: "text-sky" },
                    { text: "Exchange & Delegation Events", color: "text-violet" },
                  ].map((item) => (
                    <li key={item.text} className="flex items-center gap-3 text-primary-foreground/75">
                      <Briefcase className={`w-4 h-4 ${item.color} flex-shrink-0`} />
                      <span className="text-sm">{item.text}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2 text-teal font-semibold font-body group-hover:gap-3 transition-all">
                  Enter Professional
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </motion.button>

          {/* Social Card */}
          <motion.button
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect("social")}
            className="group relative overflow-hidden rounded-2xl border border-primary-foreground/8 hover:border-rose/30 bg-[hsl(152,30%,6%)]/80 backdrop-blur-xl transition-all duration-300 cursor-pointer flex flex-col text-left shadow-[0_0_60px_-15px_hsla(340,65%,55%,0.1)]"
          >
            <div className="flex-1 flex items-center justify-center p-8 min-h-[220px]">
              <img src={logoSocial} alt="Aliko Events Social" className="max-h-40 w-auto object-contain" />
            </div>
            <div className="border-t border-primary-foreground/5 bg-[hsl(152,30%,4%)]/90">
              <div className="p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-primary-foreground mb-1">Aliko Events Social</h2>
                <p className="text-sm text-primary-foreground/60 font-body mb-5">Beautiful celebrations, thoughtfully planned.</p>
                <ul className="space-y-2 mb-6 font-body">
                  {[
                    { text: "Weddings", color: "text-rose" },
                    { text: "Birthdays", color: "text-coral" },
                    { text: "Bridal Showers", color: "text-violet" },
                    { text: "Graduations & Engagements", color: "text-amber" },
                  ].map((item) => (
                    <li key={item.text} className="flex items-center gap-3 text-primary-foreground/75">
                      <Heart className={`w-4 h-4 ${item.color} flex-shrink-0`} />
                      <span className="text-sm">{item.text}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2 text-rose font-semibold font-body group-hover:gap-3 transition-all">
                  Enter Social
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </motion.button>
        </div>

        {/* Glowing bulb tagline */}
        <div className="flex items-center justify-center gap-4 mt-16">
          {glowWords.map((w, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.5, filter: "blur(12px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ delay: w.delay, duration: 0.7, ease: "easeOut" }}
              className={
                w.text === "•"
                  ? "text-accent text-xl font-bold"
                  : "text-lg sm:text-xl font-bold font-body tracking-[0.25em] uppercase text-accent"
              }
              style={{
                textShadow:
                  w.text === "•"
                    ? "0 0 10px hsla(42,65%,50%,0.8)"
                    : "0 0 10px hsla(42,65%,50%,0.9), 0 0 30px hsla(42,65%,50%,0.5), 0 0 60px hsla(42,65%,50%,0.3), 0 0 100px hsla(42,65%,50%,0.15)",
              }}
            >
              {w.text}
            </motion.span>
          ))}
        </div>

        {/* Video indicator dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {VIDEOS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                i === activeIndex ? "bg-accent w-4" : "bg-primary-foreground/20 hover:bg-primary-foreground/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeSelector;
