import PageHeader from "@/components/PageHeader";
import { PiggyBank, Target, ArrowRight, Wallet, TrendingUp, Eye, EyeOff, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SaveMoney = () => {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(false);

  const metrics = [
    { icon: Wallet, label: "Wallet", value: "245,000", tone: "bg-primary/10 text-primary" },
    { icon: PiggyBank, label: "Savings", value: "120,000", tone: "bg-secondary/10 text-secondary" },
    { icon: TrendingUp, label: "Loan Eligibility", value: "1,500,000", tone: "bg-primary/10 text-primary" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-4 pt-6 animate-fade-in">
        <PageHeader title="Save Money" subtitle="Choose a savings type" />

        {/* Hero with View Balance toggle */}
        <div className="gradient-hero rounded-2xl p-5 text-primary-foreground mb-5 relative">
          <PiggyBank size={28} className="mb-2" />
          <h2 className="text-lg font-bold mb-1">Save & build your future</h2>
          <p className="text-xs opacity-90 mb-3">Every deposit boosts your Trust Score and loan eligibility.</p>
          <button
            onClick={() => setShowBalance((v) => !v)}
            className="inline-flex items-center gap-2 bg-primary-foreground/15 hover:bg-primary-foreground/25 text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-lg transition"
          >
            {showBalance ? <EyeOff size={14} /> : <Eye size={14} />}
            {showBalance ? "Hide overview" : "View overview"}
          </button>
        </div>

        {/* My Overview */}
        {showBalance && (
          <section className="bg-card border border-border rounded-xl p-4 mb-5 animate-fade-in">
            <h3 className="text-xs font-bold text-secondary mb-3">My Overview</h3>
            <div className="grid grid-cols-3 gap-2">
              {metrics.map((m) => (
                <div key={m.label} className="flex flex-col items-center text-center">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center mb-2 ${m.tone}`}>
                    <m.icon size={20} />
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-tight mb-0.5">{m.label}</p>
                  <p className="text-xs font-bold">
                    <span className="text-[9px] text-muted-foreground">FCFA </span>{m.value}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="space-y-3">
          <button
            onClick={() => navigate("/deposit")}
            className="w-full flex items-center gap-3 bg-card border border-border rounded-xl p-4 text-left hover:shadow-md hover:border-primary/40 transition active:scale-[0.99]"
          >
            <div className="w-12 h-12 rounded-xl bg-accent text-secondary flex items-center justify-center">
              <PiggyBank size={24} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm">Regular Saving</p>
              <p className="text-xs text-muted-foreground">Deposit any time, withdraw any time. Flexible wallet savings.</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <Plus size={16} />
            </div>
          </button>

          <button
            onClick={() => navigate("/goals")}
            className="w-full flex items-center gap-3 bg-card border border-border rounded-xl p-4 text-left hover:shadow-md hover:border-primary/40 transition active:scale-[0.99]"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Target size={24} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm">Goal Saving</p>
              <p className="text-xs text-muted-foreground">Set a target, choose a frequency, lock funds and reach your goal.</p>
            </div>
            <ArrowRight size={18} className="text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveMoney;
