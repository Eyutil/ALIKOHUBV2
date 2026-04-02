import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { User, Mail, Shield, Bell, Key, Save, Camera, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { motion } from "framer-motion";

const UserSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Settings saved successfully!");
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="pb-8 border-b border-border/40 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-foreground tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground font-body mt-4 text-lg max-w-sm leading-relaxed">Manage your personal information and account preferences.</p>
        </div>
        <Button onClick={handleSave} disabled={loading} className="h-14 px-10 rounded-2xl gap-3 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all gradient-primary font-bold font-display">
          <Save className="w-5 h-5" />
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <section className="bg-card border border-border/60 rounded-[3rem] p-8 md:p-10 shadow-2xl shadow-black/[0.01]">
            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-border/40">
               <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                 <User className="w-6 h-6 text-primary" />
               </div>
               <div className="space-y-0.5">
                 <h2 className="text-xl font-bold font-display text-foreground tracking-tight">Personal Information</h2>
                 <p className="text-xs font-bold font-body text-muted-foreground uppercase tracking-widest">Update your basic identity</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">First Name</label>
                <div className="relative">
                  <Input defaultValue={user?.firstname} className="h-14 pl-12 rounded-2xl bg-muted/30 border-border/60 focus:ring-4 focus:ring-primary/10 transition-all font-body font-bold" />
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground/40" />
                </div>
              </div>
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">Last Name</label>
                <div className="relative">
                  <Input defaultValue={user?.lastname} className="h-14 pl-12 rounded-2xl bg-muted/30 border-border/60 focus:ring-4 focus:ring-primary/10 transition-all font-body font-bold" />
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground/40" />
                </div>
              </div>
              <div className="md:col-span-2 space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">Email Address</label>
                <div className="relative">
                  <Input defaultValue={user?.email} className="h-14 pl-12 rounded-2xl bg-muted/30 border-border/60 focus:ring-4 focus:ring-primary/10 transition-all font-body font-bold" />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground/40" />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-card border border-border/60 rounded-[3rem] p-8 md:p-10 shadow-2xl shadow-black/[0.01]">
            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-border/40">
               <div className="w-14 h-14 rounded-2xl bg-coral/10 flex items-center justify-center">
                 <Shield className="w-6 h-6 text-coral" />
               </div>
               <div className="space-y-0.5">
                 <h2 className="text-xl font-bold font-display text-foreground tracking-tight">Security & Privacy</h2>
                 <p className="text-xs font-bold font-body text-muted-foreground uppercase tracking-widest">Manage your credentials</p>
               </div>
            </div>

            <div className="space-y-8">
               <div className="flex items-center justify-between gap-6 p-6 rounded-3xl bg-muted/20 border border-border/40 group hover:bg-muted/40 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <Key className="w-4.5 h-4.5 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold font-display text-foreground leading-none">Password Update</p>
                      <p className="text-[10px] font-bold font-body text-muted-foreground uppercase tracking-wider">Change your login password</p>
                    </div>
                  </div>
                  <Button variant="outline" className="rounded-xl font-bold font-display h-10 px-6 border-border/60 hover:bg-white transition-all">Update</Button>
               </div>

               <div className="flex items-center justify-between gap-6 p-1 pl-6">
                  <div className="space-y-1">
                    <p className="text-sm font-bold font-display text-foreground leading-none">Two-Factor Authentication</p>
                    <p className="text-[10px] font-bold font-body text-muted-foreground uppercase tracking-wider">Enable extra security for your account</p>
                  </div>
                  <Switch className="data-[state=checked]:bg-emerald-500 scale-110" />
               </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-10">
           <div className="bg-card border border-border/60 rounded-[3rem] p-8 space-y-8 shadow-xl shadow-black/[0.01]">
              <div className="relative group mx-auto w-32 h-32">
                 <div className="w-full h-full rounded-[2.5rem] bg-gradient-to-br from-secondary/80 to-accent/80 flex items-center justify-center text-4xl font-black font-display text-primary shadow-2xl group-hover:scale-105 transition-transform duration-700 ring-2 ring-white/30">
                   {user?.firstname?.charAt(0).toUpperCase()}
                 </div>
                 <button className="absolute -bottom-2 -right-2 w-12 h-12 rounded-[1.25rem] bg-foreground text-background flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all">
                   <Camera className="w-5 h-5" />
                 </button>
              </div>
              <div className="text-center space-y-1">
                 <h3 className="text-xl font-bold font-display text-foreground leading-none">{user?.firstname} {user?.lastname}</h3>
                 <p className="text-[10px] font-bold font-body text-muted-foreground uppercase tracking-widest">{user?.email}</p>
              </div>
              <div className="pt-2">
                 <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 space-y-4">
                    <div className="flex items-center gap-2.5 text-primary">
                       <Sparkles className="w-4.5 h-4.5" />
                       <span className="text-[10px] font-bold uppercase tracking-widest font-display">Organize Pro</span>
                    </div>
                    <div className="space-y-4">
                       {[
                         "Unlimited social events",
                         "Priority reviewer support",
                         "Deep analytics access"
                       ].map((f, i) => (
                         <div key={i} className="flex items-center gap-2.5">
                           <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                           <span className="text-[11px] font-bold font-body text-muted-foreground leading-none">{f}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-card border border-border/60 rounded-[3rem] p-8 space-y-8 shadow-xl shadow-black/[0.01]">
              <div className="flex items-center gap-4 border-b border-border/40 pb-5">
                 <div className="w-10 h-10 rounded-xl bg-violet/10 flex items-center justify-center">
                   <Bell className="w-4.5 h-4.5 text-violet" />
                 </div>
                 <h3 className="text-sm font-bold font-display text-foreground tracking-tight">Notification Center</h3>
              </div>
              <div className="space-y-6">
                 {[
                   { label: "New Registration Alert", active: true },
                   { label: "Review Status Update", active: true },
                   { label: "Platform Mentions", active: false }
                 ].map((n, i) => (
                   <div key={i} className="flex items-center justify-between">
                     <span className="text-xs font-bold font-body text-muted-foreground group-hover:text-foreground transition-colors">{n.label}</span>
                     <Switch defaultChecked={n.active} className="data-[state=checked]:bg-primary scale-90" />
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
