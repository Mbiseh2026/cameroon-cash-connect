import PageHeader from "@/components/PageHeader";
import { User, Shield, Bell, LogOut, Sun, Moon, Languages, ListChecks } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Profile = () => {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const toggleLang = () => {
    const next = lang === "en" ? "fr" : "en";
    setLang(next);
    localStorage.setItem("lang", next);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 pt-6 animate-fade-in">
        <PageHeader title="Profile" subtitle="Account settings" />

        <div className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 mb-6">
          <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center">
            <span className="text-xl font-bold text-primary-foreground">E</span>
          </div>
          <div>
            <p className="font-bold">Eduvest User</p>
            <p className="text-xs text-muted-foreground">+237 6XX XXX XXX</p>
            <span className="text-[10px] bg-success/10 text-success px-2 py-0.5 rounded-full font-bold">Verified</span>
          </div>
        </div>



        <div className="space-y-2">
          {[
            { icon: User, label: "Personal Information" },
            { icon: Shield, label: "Security & PIN" },
            { icon: Bell, label: "Notifications" },
          ].map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:bg-muted transition-colors"
            >
              <item.icon size={18} className="text-primary" />
              <span className="text-sm font-semibold">{item.label}</span>
            </button>
          ))}

          {/* Dark mode toggle */}
          <button
            onClick={() => setDark(!dark)}
            className="w-full flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:bg-muted transition-colors"
          >
            {dark ? <Sun size={18} className="text-warning" /> : <Moon size={18} className="text-primary" />}
            <span className="text-sm font-semibold">{dark ? "Light Mode" : "Dark Mode"}</span>
          </button>

          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className="w-full flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:bg-muted transition-colors"
          >
            <Languages size={18} className="text-primary" />
            <span className="text-sm font-semibold">
              {lang === "en" ? "Français" : "English"}
            </span>
            <span className="ml-auto text-xs text-muted-foreground font-bold uppercase">{lang}</span>
          </button>

          <button className="w-full flex items-center gap-3 bg-card border border-destructive/20 rounded-xl p-4 hover:bg-destructive/5 transition-colors mt-4">
            <LogOut size={18} className="text-destructive" />
            <span className="text-sm font-semibold text-destructive">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
