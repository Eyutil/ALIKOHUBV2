import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
      toast.success("Check your email for the reset link");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send reset link";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-primary font-display">Aliko Events</Link>
          <p className="text-muted-foreground font-body mt-2">Reset your password</p>
        </div>
        {sent ? (
          <div className="bg-card p-8 rounded-xl border border-border shadow-card text-center">
            <p className="text-foreground font-body mb-4">We've sent a reset link to <strong>{email}</strong></p>
            <Link to="/signin"><Button variant="outline" className="font-body">Back to Sign In</Button></Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 bg-card p-8 rounded-xl border border-border shadow-card">
            <div>
              <Label htmlFor="email" className="font-body">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" />
            </div>
            <Button type="submit" className="w-full font-body" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
            <p className="text-center text-sm text-muted-foreground font-body">
              <Link to="/signin" className="text-primary hover:underline">Back to Sign In</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
