import { Bell, Wallet, PiggyBank, TrendingUp, GraduationCap, ChevronRight, SendHorizontal, Home as HomeIcon, ScanLine, BookOpen, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "@/assets/eduvest-logo.png";
import hero from "@/assets/eduvest-hero.png";

const QUICK_ACTIONS = [
  { icon: ScanLine, label: "Pay School Fees", path: "/send", tone: "bg-primary/10 text-primary" },
  { icon: SendHorizontal, label: "Send Money", path: "/send", tone: "bg-secondary/10 text-secondary" },
  { icon: PiggyBank, label: "Save Money", path: "/save", tone: "bg-primary/10 text-primary" },
  { icon: GraduationCap, label: "Book Lessons", path: "/lessons", tone: "bg-secondary/10 text-secondary" },
  { icon: HomeIcon, label: "Housing Plans", path: "/loans", tone: "bg-primary/10 text-primary" },
];

const COMMUNITY = [
  { icon: GraduationCap, label: "Teachers", desc: "Offer & earn", tone: "bg-primary/10 text-primary" },
  { icon: Users, label: "Parents", desc: "Pay & track", tone: "bg-secondary/10 text-secondary" },
  { icon: BookOpen, label: "Students", desc: "Learn & grow", tone: "bg-primary/10 text-primary" },
];

const Index = () => {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="max-w-md mx-auto px-4 pt-5 space-y-5 animate-fade-in">
        {/* Header */}
        <header className="flex items-center justify-between">
          <img src={logo} alt="Eduvest logo" className="h-8 w-auto" width={1536} height={1024} />
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-full hover:bg-muted">
              <Bell size={20} className="text-secondary" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            </button>
            <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
              E
            </div>
          </div>
        </header>

        {/* Welcome hero */}
        <section className="gradient-hero rounded-2xl p-5 text-primary-foreground relative overflow-hidden">
          <div className="relative z-10 max-w-[60%]">
            <p className="text-sm opacity-90">Welcome back,</p>
            <h1 className="text-2xl font-extrabold mb-1">Emmanuel!</h1>
            <p className="text-xs opacity-90 leading-snug mb-4">
              Manage payments, grow your savings and build your future.
            </p>
            <button
              onClick={() => setShowBalance((v) => !v)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold px-4 py-2 rounded-lg transition"
            >
              {showBalance ? "FCFA 245,000" : "View Balance"}
            </button>
          </div>
          <img
            src={hero}
            alt="Graduation cap on books"
            className="absolute right-0 bottom-0 w-40 h-40 object-contain"
            width={1024}
            height={1024}
          />
        </section>

        {/* Quick Actions */}
        <section className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-secondary">Quick Actions</h2>
            <button className="text-xs font-semibold text-primary">See all</button>
          </div>
          <div className="flex gap-3 overflow-x-auto -mx-1 px-1 pb-1 scrollbar-hide">
            {QUICK_ACTIONS.map((a) => (
              <button
                key={a.label}
                onClick={() => navigate(a.path)}
                className="flex-shrink-0 w-[72px] flex flex-col items-center gap-1.5"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${a.tone}`}>
                  <a.icon size={24} />
                </div>
                <span className="text-[11px] font-semibold text-foreground text-center leading-tight">
                  {a.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* My Overview (moved from bottom) */}
        <section className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-secondary">My Overview</h2>
            <button className="text-xs font-semibold text-primary">See details</button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Wallet, label: "Wallet Balance", value: "245,000", tone: "bg-primary/10 text-primary" },
              { icon: PiggyBank, label: "Savings Balance", value: "120,000", tone: "bg-secondary/10 text-secondary" },
              { icon: TrendingUp, label: "Loan Eligibility", value: "1,500,000", tone: "bg-primary/10 text-primary" },
            ].map((m) => (
              <div key={m.label} className="flex flex-col items-center text-center">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center mb-2 ${m.tone}`}>
                  <m.icon size={20} />
                </div>
                <p className="text-[10px] text-muted-foreground leading-tight mb-0.5">{m.label}</p>
                <p className="text-xs font-bold flex items-center gap-0.5">
                  <span className="text-[9px] text-muted-foreground">FCFA</span>
                  {m.value}
                  <ChevronRight size={12} className="text-primary" />
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Eduvest community */}
        <section className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-secondary">Eduvest Community</h2>
              <p className="text-[10px] text-muted-foreground">Connect teachers, parents & students</p>
            </div>
            <button
              onClick={() => navigate("/lessons")}
              className="text-xs font-semibold text-primary"
            >
              Book lessons
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {COMMUNITY.map((c) => (
              <button
                key={c.label}
                onClick={() => navigate("/lessons")}
                className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-muted transition"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.tone}`}>
                  <c.icon size={22} />
                </div>
                <span className="text-[11px] font-bold">{c.label}</span>
                <span className="text-[9px] text-muted-foreground">{c.desc}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Trust Score teaser */}
        <section
          onClick={() => navigate("/rewards")}
          className="cursor-pointer bg-accent border border-primary/20 rounded-2xl p-4 flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-extrabold">
            720
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-secondary">Your Trust Score</p>
            <p className="text-[10px] text-muted-foreground">Every payment builds your financial identity.</p>
          </div>
          <ChevronRight size={18} className="text-primary" />
        </section>
      </div>
    </div>
  );
};

export default Index;
