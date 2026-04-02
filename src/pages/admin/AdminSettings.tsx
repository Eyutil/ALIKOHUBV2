import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { User, Mail, Phone, Save } from "lucide-react";

const AdminSettings = () => {
  const { profile, user } = useAuth();
  const [fullName, setFullName] = useState(profile?.fullName ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await api.patch("/users/profile", { fullName, phone });
      toast.success("Profile updated!");
    } catch (e: any) {
      toast.error(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-display text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground font-body mt-1">Manage your profile and preferences</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-green-light p-8">
        <div className="absolute top-0 right-0 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary-foreground/15 backdrop-blur-sm flex items-center justify-center text-2xl font-bold text-primary-foreground font-display shadow-lg">
            {(profile?.fullName || profile?.email || "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-primary-foreground">{profile?.fullName || "Your Name"}</h2>
            <p className="text-sm text-primary-foreground/70 font-body">{profile?.email}</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-border/60 rounded-2xl p-6 max-w-lg space-y-5">
        <div>
          <Label className="font-body text-xs flex items-center gap-2 mb-2"><User className="w-3.5 h-3.5 text-muted-foreground" />Full Name</Label>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="rounded-xl" />
        </div>
        <div>
          <Label className="font-body text-xs flex items-center gap-2 mb-2"><Mail className="w-3.5 h-3.5 text-muted-foreground" />Email</Label>
          <Input value={profile?.email ?? ""} disabled className="rounded-xl bg-muted/50" />
        </div>
        <div>
          <Label className="font-body text-xs flex items-center gap-2 mb-2"><Phone className="w-3.5 h-3.5 text-muted-foreground" />Phone</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-xl" />
        </div>
        <Button onClick={handleSave} disabled={loading} className="font-body rounded-xl gap-2 shadow-md">
          <Save className="w-4 h-4" />{loading ? "Saving..." : "Save Changes"}
        </Button>
      </motion.div>
    </div>
  );
};

export default AdminSettings;
