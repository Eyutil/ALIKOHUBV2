import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

import logo from "@/assets/Aliko Events I - tbg (H).png";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user, signIn, isAdmin, isContentManager } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || "/";

  useEffect(() => {
    if (user) {
      if (isAdmin() || isContentManager()) {
        navigate("/admin");
      } else {
        navigate(redirect);
      }
    }
  }, [user, isAdmin, isContentManager, navigate, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error, eventsRole } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast.error((error as any).message || "Sign in failed");
    } else {
      toast.success("Signed in successfully!");
      // Use the eventsRole returned directly from login response for an immediate redirect
      if (eventsRole === "ADMIN" || eventsRole === "CONTENT_MANAGER") {
        navigate("/admin");
      } else if (params.get("redirect")) {
        navigate(redirect);
      } else {
        navigate("/");
      }
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-green-light to-primary" />
      
      {/* Floating orbs */}
      <motion.div
        className="absolute top-[10%] left-[15%] w-72 h-72 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, hsl(var(--teal)) 0%, transparent 70%)" }}
        animate={{ y: [0, -30, 0], x: [0, 20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[15%] right-[10%] w-96 h-96 rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, hsl(var(--violet)) 0%, transparent 70%)" }}
        animate={{ y: [0, 25, 0], x: [0, -15, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[50%] right-[30%] w-48 h-48 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, hsl(var(--coral)) 0%, transparent 70%)" }}
        animate={{ y: [0, 40, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary-foreground)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 w-full max-w-md px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Logo & Header */}
        <motion.div
          className="text-center pt-6 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Link to="/" className="inline-block">
            <img src={logo} alt="Aliko Events" className="h-14 w-auto mx-auto object-contain" />
          </Link>
        </motion.div>

        {/* Sign-in card */}
        <motion.form
          onSubmit={handleSubmit}
          className="backdrop-blur-xl rounded-2xl border border-primary-foreground/10 shadow-2xl overflow-hidden"
          style={{ background: "hsla(0, 0%, 100%, 0.08)" }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-teal via-secondary to-coral" />

          <div className="p-8 space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="font-body text-primary-foreground/80 text-xs uppercase tracking-wider">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/40" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 h-12 bg-primary-foreground/5 border-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/30 focus-visible:ring-secondary focus-visible:border-secondary/50 rounded-xl"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="font-body text-primary-foreground/80 text-xs uppercase tracking-wider">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/40" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-10 h-12 bg-primary-foreground/5 border-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/30 focus-visible:ring-secondary focus-visible:border-secondary/50 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-foreground/40 hover:text-primary-foreground/70 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Forgot password link */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs font-body text-secondary hover:text-accent transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                className="w-full h-12 font-body font-semibold text-sm rounded-xl bg-gradient-to-r from-secondary to-accent text-primary hover:opacity-90 transition-opacity shadow-lg"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Signing in…
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </motion.div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-primary-foreground/10" />
              <span className="text-xs text-primary-foreground/40 font-body">or</span>
              <div className="flex-1 h-px bg-primary-foreground/10" />
            </div>

            {/* Sign up link */}
            <p className="text-center text-sm font-body text-primary-foreground/60">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-secondary hover:text-accent font-semibold transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>
        </motion.form>

        {/* Footer */}
        <motion.p
          className="text-center text-xs text-primary-foreground/30 mt-6 font-body"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          © {new Date().getFullYear()} Aliko Events. Crafted with care.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default SignIn;
