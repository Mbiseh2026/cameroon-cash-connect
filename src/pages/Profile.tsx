import PageHeader from "@/components/PageHeader";
import { User, Shield, Bell, LogOut, Sun, Moon, Languages, ListChecks, Lock, KeyRound, AlertCircle, ShieldCheck, Mail, GraduationCap, Building2, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getUser } from "@/lib/userStore";

const Profile = () => {
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");

  const [walletLock, setWalletLock] = useState(() => localStorage.getItem("walletPinLock") === "1");
  const [savingsLock, setSavingsLock] = useState(() => localStorage.getItem("savingsPinLock") !== "0");

  const [pinOpen, setPinOpen] = useState(false);
  const [pin1, setPin1] = useState("");
  const [pin2, setPin2] = useState("");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => { localStorage.setItem("walletPinLock", walletLock ? "1" : "0"); }, [walletLock]);
  useEffect(() => { localStorage.setItem("savingsPinLock", savingsLock ? "1" : "0"); }, [savingsLock]);

  const toggleLang = () => {
    const next = lang === "en" ? "fr" : "en";
    setLang(next);
    localStorage.setItem("lang", next);
  };

  const savePin = () => {
    if (pin1.length !== 4) return toast.error("PIN must be 4 digits");
    if (pin1 !== pin2) return toast.error("PINs don't match");
    localStorage.setItem("userPin", pin1);
    setPinOpen(false); setPin1(""); setPin2("");
    toast.success("PIN saved");
  };

  const hasPin = !!localStorage.getItem("userPin");

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 pt-6 animate-fade-in">
        <PageHeader title="Profile" subtitle="Account settings" />

        <div className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 mb-4">
          <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center">
            <span className="text-xl font-bold text-primary-foreground">E</span>
          </div>
          <div>
            <p className="font-bold">Eduvest User</p>
            <p className="text-xs text-muted-foreground">{getUser().phone ? `+237 ${getUser().phone}` : "+237 6XX XXX XXX"}</p>
            <span className="text-[10px] bg-success/10 text-success px-2 py-0.5 rounded-full font-bold">{getUser().kycComplete ? "Verified" : "Unverified"}</span>
          </div>
        </div>

        <Reminders />


        <div className="space-y-2">
          <button onClick={() => navigate("/history")}
            className="w-full flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:bg-muted transition-colors">
            <ListChecks size={18} className="text-primary" />
            <span className="text-sm font-semibold">My Transactions</span>
            <span className="ml-auto text-[10px] text-muted-foreground">View history</span>
          </button>

          {/* Security section */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-primary" />
              <p className="text-sm font-bold">Security & PIN</p>
            </div>
            <button onClick={() => { setPin1(""); setPin2(""); setPinOpen(true); }}
              className="w-full flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted">
              <KeyRound size={16} className="text-primary" />
              <span className="text-xs font-semibold">{hasPin ? "Change 4-digit PIN" : "Set 4-digit PIN"}</span>
              <span className="ml-auto text-[10px] text-muted-foreground">{hasPin ? "Set" : "Not set"}</span>
            </button>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Lock size={14} className="text-primary" />
                <div>
                  <p className="text-xs font-semibold">Require PIN for wallet balance</p>
                  <p className="text-[10px] text-muted-foreground">Hide home-screen balance from kids.</p>
                </div>
              </div>
              <Switch checked={walletLock} onCheckedChange={setWalletLock} />
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Lock size={14} className="text-primary" />
                <div>
                  <p className="text-xs font-semibold">Require PIN for savings balance</p>
                  <p className="text-[10px] text-muted-foreground">Applies in Save Money & Goals.</p>
                </div>
              </div>
              <Switch checked={savingsLock} onCheckedChange={setSavingsLock} />
            </div>
          </div>

          {[
            { icon: User, label: "Personal Information" },
            { icon: Bell, label: "Notifications" },
          ].map((item) => (
            <button key={item.label} className="w-full flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:bg-muted transition-colors">
              <item.icon size={18} className="text-primary" />
              <span className="text-sm font-semibold">{item.label}</span>
            </button>
          ))}

          <button onClick={() => setDark(!dark)}
            className="w-full flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:bg-muted transition-colors">
            {dark ? <Sun size={18} className="text-warning" /> : <Moon size={18} className="text-primary" />}
            <span className="text-sm font-semibold">{dark ? "Light Mode" : "Dark Mode"}</span>
          </button>

          <button onClick={toggleLang}
            className="w-full flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:bg-muted transition-colors">
            <Languages size={18} className="text-primary" />
            <span className="text-sm font-semibold">{lang === "en" ? "Français" : "English"}</span>
            <span className="ml-auto text-xs text-muted-foreground font-bold uppercase">{lang}</span>
          </button>

          <button className="w-full flex items-center gap-3 bg-card border border-destructive/20 rounded-xl p-4 hover:bg-destructive/5 transition-colors mt-4">
            <LogOut size={18} className="text-destructive" />
            <span className="text-sm font-semibold text-destructive">Sign Out</span>
          </button>
        </div>
      </div>

      <Dialog open={pinOpen} onOpenChange={setPinOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><KeyRound size={18} className="text-primary" /> {hasPin ? "Change PIN" : "Set PIN"}</DialogTitle>
            <DialogDescription>Used to unlock balance views and authorise payments.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input type="password" inputMode="numeric" maxLength={4} placeholder="New 4-digit PIN" value={pin1}
              onChange={(e) => setPin1(e.target.value.replace(/\D/g, ""))} className="text-center text-xl tracking-[1em] h-12" autoFocus />
            <Input type="password" inputMode="numeric" maxLength={4} placeholder="Confirm PIN" value={pin2}
              onChange={(e) => setPin2(e.target.value.replace(/\D/g, ""))} className="text-center text-xl tracking-[1em] h-12" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPinOpen(false)}>Cancel</Button>
            <Button onClick={savePin} className="gradient-primary text-primary-foreground">Save PIN</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Reminders = () => {
  const navigate = useNavigate();
  const u = getUser();
  const items: { icon: any; text: string; cta: string; to: string; tone: "warn" | "info" }[] = [];
  if (!u.kycComplete) items.push({ icon: ShieldCheck, text: "Complete KYC to unlock Send & Withdraw", cta: "Verify", to: "/onboarding", tone: "warn" });
  if (u.email && !u.emailVerified) items.push({ icon: Mail, text: "Verify your email for receipts & recovery", cta: "Verify", to: "/onboarding", tone: "info" });
  if (u.role === "teacher" && !u.teacherProfileComplete) items.push({ icon: GraduationCap, text: "Complete your lesson profile — parents are searching", cta: "Fill in", to: "/onboarding", tone: "info" });
  if (u.role === "teacher" && u.teacherProfileComplete) items.push({ icon: GraduationCap, text: "Edit your lesson profile", cta: "Edit", to: "/onboarding", tone: "info" });
  if (u.role === "sme" && !u.kybComplete) items.push({ icon: Building2, text: "Submit business documents (KYB) to access SME tools", cta: "Submit", to: "/onboarding", tone: "warn" });
  if (items.length === 0) return null;
  return (
    <div className="space-y-2 mb-4">
      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Reminders</p>
      {items.map((it, i) => (
        <button key={i} onClick={() => navigate(it.to)}
          className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left ${it.tone === "warn" ? "border-warning/40 bg-warning/5" : "border-primary/30 bg-primary/5"}`}>
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${it.tone === "warn" ? "bg-warning/15 text-warning" : "bg-primary/15 text-primary"}`}>
            <it.icon size={16} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold leading-tight">{it.text}</p>
          </div>
          <span className="text-[11px] font-bold text-primary flex items-center gap-0.5">{it.cta} <ChevronRight size={14} /></span>
        </button>
      ))}
    </div>
  );
};

export default Profile;

