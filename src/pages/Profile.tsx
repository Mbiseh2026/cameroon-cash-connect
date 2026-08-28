import PageHeader from "@/components/PageHeader";
import { User, Shield, Bell, LogOut, Sun, Moon, Languages, ListChecks, Lock, KeyRound, ShieldCheck, Mail, GraduationCap, Building2, ChevronRight, CalendarCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getUser, clearUser } from "@/lib/userStore";
import { useLang as useGlobalLang, setLang as setGlobalLang } from "@/lib/i18n";

type Lang = "en" | "fr";
const T = {
  en: {
    title: "Profile", subtitle: "Account settings",
    verified: "Verified", unverified: "Unverified",
    myTx: "My Transactions", viewHistory: "View history",
    attendance: "Attendance", attendanceDesc: "Weekly school reports",
    security: "Security & PIN",
    changePin: "Change 4-digit PIN", setPin: "Set 4-digit PIN", set: "Set", notSet: "Not set",
    walletLockTitle: "Require PIN for wallet balance", walletLockDesc: "Hide home-screen balance from kids.",
    savingsLockTitle: "Require PIN for savings balance", savingsLockDesc: "Applies in Save Money & Goals.",
    personal: "Personal Information", notifications: "Notifications",
    lightMode: "Light Mode", darkMode: "Dark Mode",
    langLabel: "Français",
    signOut: "Sign Out", signedOut: "Signed out",
    pinDialogChange: "Change PIN", pinDialogSet: "Set PIN",
    pinDialogDesc: "Used to unlock balance views and authorise payments.",
    pinNew: "New 4-digit PIN", pinConfirm: "Confirm PIN",
    cancel: "Cancel", save: "Save PIN",
    errPinLen: "PIN must be 4 digits", errPinMatch: "PINs don't match", okPin: "PIN saved",
    remindersTitle: "Reminders",
    rKyc: "Complete KYC to unlock Send & Withdraw", ctaVerify: "Verify",
    rEmail: "Verify your email for receipts & recovery",
    rTeacherNew: "Complete your lesson profile — parents are searching", ctaFill: "Fill in",
    rTeacherEdit: "Edit your lesson profile", ctaEdit: "Edit",
    rKyb: "Submit business documents (KYB) to access SME tools", ctaSubmit: "Submit",
    confirmSignOut: "Sign out of Eduvest?", confirmSignOutDesc: "You'll need your phone and PIN to sign back in.",
  },
  fr: {
    title: "Profil", subtitle: "Paramètres du compte",
    verified: "Vérifié", unverified: "Non vérifié",
    myTx: "Mes Transactions", viewHistory: "Voir l'historique",
    attendance: "Présence", attendanceDesc: "Rapports hebdomadaires",
    security: "Sécurité & Code PIN",
    changePin: "Modifier le code PIN (4 chiffres)", setPin: "Définir le code PIN (4 chiffres)", set: "Défini", notSet: "Non défini",
    walletLockTitle: "Exiger le PIN pour le solde du portefeuille", walletLockDesc: "Masquer le solde aux enfants.",
    savingsLockTitle: "Exiger le PIN pour le solde d'épargne", savingsLockDesc: "S'applique à Épargne & Objectifs.",
    personal: "Informations personnelles", notifications: "Notifications",
    lightMode: "Mode Clair", darkMode: "Mode Sombre",
    langLabel: "English",
    signOut: "Déconnexion", signedOut: "Déconnecté",
    pinDialogChange: "Modifier le PIN", pinDialogSet: "Définir le PIN",
    pinDialogDesc: "Utilisé pour déverrouiller les soldes et autoriser les paiements.",
    pinNew: "Nouveau PIN à 4 chiffres", pinConfirm: "Confirmer le PIN",
    cancel: "Annuler", save: "Enregistrer le PIN",
    errPinLen: "Le PIN doit comporter 4 chiffres", errPinMatch: "Les PIN ne correspondent pas", okPin: "PIN enregistré",
    remindersTitle: "Rappels",
    rKyc: "Complétez le KYC pour débloquer Envoyer & Retirer", ctaVerify: "Vérifier",
    rEmail: "Vérifiez votre email pour reçus & récupération",
    rTeacherNew: "Complétez votre profil de cours — des parents cherchent", ctaFill: "Remplir",
    rTeacherEdit: "Modifier votre profil de cours", ctaEdit: "Modifier",
    rKyb: "Soumettez vos documents (KYB) pour accéder aux outils PME", ctaSubmit: "Soumettre",
    confirmSignOut: "Se déconnecter d'Eduvest ?", confirmSignOutDesc: "Vous aurez besoin de votre téléphone et PIN pour vous reconnecter.",
  },
};

const Profile = () => {
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  const { lang } = useGlobalLang();
  const setLang = setGlobalLang;
  const t = T[lang];

  const [walletLock, setWalletLock] = useState(() => localStorage.getItem("walletPinLock") === "1");
  const [savingsLock, setSavingsLock] = useState(() => localStorage.getItem("savingsPinLock") !== "0");

  const [pinOpen, setPinOpen] = useState(false);
  const [pin1, setPin1] = useState("");
  const [pin2, setPin2] = useState("");
  const [signOutOpen, setSignOutOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => { localStorage.setItem("walletPinLock", walletLock ? "1" : "0"); }, [walletLock]);
  useEffect(() => { localStorage.setItem("savingsPinLock", savingsLock ? "1" : "0"); }, [savingsLock]);

  const toggleLang = () => {
    const next: Lang = lang === "en" ? "fr" : "en";
    setLang(next);
    toast.success(next === "fr" ? "Langue : Français" : "Language: English");
  };

  const savePin = () => {
    if (pin1.length !== 4) return toast.error(t.errPinLen);
    if (pin1 !== pin2) return toast.error(t.errPinMatch);
    localStorage.setItem("userPin", pin1);
    setPinOpen(false); setPin1(""); setPin2("");
    toast.success(t.okPin);
  };

  const doSignOut = () => {
    clearUser();
    localStorage.removeItem("userPin");
    setSignOutOpen(false);
    toast.success(t.signedOut);
    navigate("/welcome");
  };

  const hasPin = !!localStorage.getItem("userPin");

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 pt-6 animate-fade-in">
        <PageHeader title={t.title} subtitle={t.subtitle} />

        <div className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 mb-4">
          <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center">
            <span className="text-xl font-bold text-primary-foreground">E</span>
          </div>
          <div>
            <p className="font-bold">Eduvest User</p>
            <p className="text-xs text-muted-foreground">{getUser().phone ? `+237 ${getUser().phone}` : "+237 6XX XXX XXX"}</p>
            <span className="text-[10px] bg-success/10 text-success px-2 py-0.5 rounded-full font-bold">{getUser().kycComplete ? t.verified : t.unverified}</span>
          </div>
        </div>

        <Reminders lang={lang} />

        <div className="space-y-2">
          <button onClick={() => navigate("/history")}
            className="w-full flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:bg-muted transition-colors">
            <ListChecks size={18} className="text-primary" />
            <span className="text-sm font-semibold">{t.myTx}</span>
            <span className="ml-auto text-[10px] text-muted-foreground">{t.viewHistory}</span>
          </button>

          <button onClick={() => navigate("/attendance")}
            className="w-full flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:bg-muted transition-colors">
            <CalendarCheck size={18} className="text-primary" />
            <span className="text-sm font-semibold">{t.attendance}</span>
            <span className="ml-auto text-[10px] text-muted-foreground">{t.attendanceDesc}</span>
          </button>

          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-primary" />
              <p className="text-sm font-bold">{t.security}</p>
            </div>
            <button onClick={() => { setPin1(""); setPin2(""); setPinOpen(true); }}
              className="w-full flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted">
              <KeyRound size={16} className="text-primary" />
              <span className="text-xs font-semibold">{hasPin ? t.changePin : t.setPin}</span>
              <span className="ml-auto text-[10px] text-muted-foreground">{hasPin ? t.set : t.notSet}</span>
            </button>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Lock size={14} className="text-primary" />
                <div>
                  <p className="text-xs font-semibold">{t.walletLockTitle}</p>
                  <p className="text-[10px] text-muted-foreground">{t.walletLockDesc}</p>
                </div>
              </div>
              <Switch checked={walletLock} onCheckedChange={setWalletLock} />
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Lock size={14} className="text-primary" />
                <div>
                  <p className="text-xs font-semibold">{t.savingsLockTitle}</p>
                  <p className="text-[10px] text-muted-foreground">{t.savingsLockDesc}</p>
                </div>
              </div>
              <Switch checked={savingsLock} onCheckedChange={setSavingsLock} />
            </div>
          </div>

          <button onClick={() => toast.info(lang === "fr" ? "Bientôt disponible" : "Coming soon")}
            className="w-full flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:bg-muted transition-colors">
            <User size={18} className="text-primary" />
            <span className="text-sm font-semibold">{t.personal}</span>
            <ChevronRight size={16} className="ml-auto text-muted-foreground" />
          </button>

          <button onClick={() => toast.info(lang === "fr" ? "Bientôt disponible" : "Coming soon")}
            className="w-full flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:bg-muted transition-colors">
            <Bell size={18} className="text-primary" />
            <span className="text-sm font-semibold">{t.notifications}</span>
            <ChevronRight size={16} className="ml-auto text-muted-foreground" />
          </button>

          <button onClick={() => setDark(!dark)}
            className="w-full flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:bg-muted transition-colors">
            {dark ? <Sun size={18} className="text-warning" /> : <Moon size={18} className="text-primary" />}
            <span className="text-sm font-semibold">{dark ? t.lightMode : t.darkMode}</span>
          </button>

          <button onClick={toggleLang}
            className="w-full flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:bg-muted transition-colors">
            <Languages size={18} className="text-primary" />
            <span className="text-sm font-semibold">{t.langLabel}</span>
            <span className="ml-auto text-xs text-muted-foreground font-bold uppercase">{lang}</span>
          </button>

          <button onClick={() => setSignOutOpen(true)}
            className="w-full flex items-center gap-3 bg-card border border-destructive/20 rounded-xl p-4 hover:bg-destructive/5 transition-colors mt-4">
            <LogOut size={18} className="text-destructive" />
            <span className="text-sm font-semibold text-destructive">{t.signOut}</span>
          </button>
        </div>
      </div>

      <Dialog open={pinOpen} onOpenChange={setPinOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><KeyRound size={18} className="text-primary" /> {hasPin ? t.pinDialogChange : t.pinDialogSet}</DialogTitle>
            <DialogDescription>{t.pinDialogDesc}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input type="password" inputMode="numeric" maxLength={4} placeholder={t.pinNew} value={pin1}
              onChange={(e) => setPin1(e.target.value.replace(/\D/g, ""))} className="text-center text-xl tracking-[1em] h-12" autoFocus />
            <Input type="password" inputMode="numeric" maxLength={4} placeholder={t.pinConfirm} value={pin2}
              onChange={(e) => setPin2(e.target.value.replace(/\D/g, ""))} className="text-center text-xl tracking-[1em] h-12" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPinOpen(false)}>{t.cancel}</Button>
            <Button onClick={savePin} className="gradient-primary text-primary-foreground">{t.save}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={signOutOpen} onOpenChange={setSignOutOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><LogOut size={18} className="text-destructive" /> {t.confirmSignOut}</DialogTitle>
            <DialogDescription>{t.confirmSignOutDesc}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSignOutOpen(false)}>{t.cancel}</Button>
            <Button onClick={doSignOut} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{t.signOut}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Reminders = ({ lang }: { lang: Lang }) => {
  const navigate = useNavigate();
  const u = getUser();
  const t = T[lang];
  const items: { icon: any; text: string; cta: string; to: string; tone: "warn" | "info" }[] = [];
  if (!u.kycComplete) items.push({ icon: ShieldCheck, text: t.rKyc, cta: t.ctaVerify, to: "/onboarding", tone: "warn" });
  if (u.email && !u.emailVerified) items.push({ icon: Mail, text: t.rEmail, cta: t.ctaVerify, to: "/onboarding", tone: "info" });
  if (u.role === "teacher" && !u.teacherProfileComplete) items.push({ icon: GraduationCap, text: t.rTeacherNew, cta: t.ctaFill, to: "/onboarding", tone: "info" });
  if (u.role === "teacher" && u.teacherProfileComplete) items.push({ icon: GraduationCap, text: t.rTeacherEdit, cta: t.ctaEdit, to: "/onboarding", tone: "info" });
  if (u.role === "sme" && !u.kybComplete) items.push({ icon: Building2, text: t.rKyb, cta: t.ctaSubmit, to: "/onboarding", tone: "warn" });
  if (items.length === 0) return null;
  return (
    <div className="space-y-2 mb-4">
      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">{t.remindersTitle}</p>
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
