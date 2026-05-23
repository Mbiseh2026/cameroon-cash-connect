import PageHeader from "@/components/PageHeader";
import { PiggyBank, Target, ArrowRight, Wallet, TrendingUp, Eye, EyeOff, Plus, Lock, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const SaveMoney = () => {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [loanReqOpen, setLoanReqOpen] = useState(false);

  const tapBalance = () => {
    if (showBalance) return setShowBalance(false);
    const lock = localStorage.getItem("savingsPinLock") !== "0"; // default ON
    if (lock) { setPin(""); setPinOpen(true); } else setShowBalance(true);
  };

  const submitPin = () => {
    if (pin.length !== 4) return toast.error("Enter your 4-digit PIN");
    const saved = localStorage.getItem("userPin");
    if (saved && saved !== pin) return toast.error("Wrong PIN");
    setShowBalance(true); setPinOpen(false); setPin("");
  };

  const metrics = [
    { icon: Wallet, label: "Wallet", value: "245,000", tone: "bg-primary/10 text-primary" },
    { icon: PiggyBank, label: "Savings", value: "120,000", tone: "bg-secondary/10 text-secondary" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-4 pt-6 animate-fade-in">
        <PageHeader title="Save Money" subtitle="Choose a savings type" />

        <div className="gradient-hero rounded-2xl p-5 text-primary-foreground mb-5 relative">
          <PiggyBank size={28} className="mb-2" />
          <h2 className="text-lg font-bold mb-1">Save & build your future</h2>
          <p className="text-xs opacity-90 mb-3">Every deposit boosts your Trust Score and loan eligibility.</p>
          <button onClick={tapBalance}
            className="inline-flex items-center gap-2 bg-primary-foreground/15 hover:bg-primary-foreground/25 text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-lg transition">
            {showBalance ? <EyeOff size={14} /> : <Lock size={14} />}
            {showBalance ? "Hide balance" : "View balance"}
          </button>
        </div>

        {showBalance && (
          <section className="bg-card border border-border rounded-xl p-4 mb-5 animate-fade-in">
            <h3 className="text-xs font-bold text-secondary mb-3">My balances</h3>
            <div className="grid grid-cols-3 gap-2">
              {metrics.map((m) => (
                <div key={m.label} className="flex flex-col items-center text-center">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center mb-2 ${m.tone}`}><m.icon size={20} /></div>
                  <p className="text-[10px] text-muted-foreground leading-tight mb-0.5">{m.label}</p>
                  <p className="text-xs font-bold"><span className="text-[9px] text-muted-foreground">FCFA </span>{m.value}</p>
                </div>
              ))}
              <button onClick={() => setLoanReqOpen(true)} className="flex flex-col items-center text-center hover:opacity-80">
                <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2"><TrendingUp size={20} /></div>
                <p className="text-[10px] text-muted-foreground leading-tight mb-0.5">Loan Eligibility</p>
                <p className="text-[10px] font-bold text-primary inline-flex items-center gap-1"><Send size={10} /> Request</p>
              </button>
            </div>
          </section>
        )}

        <div className="space-y-3">
          <button onClick={() => navigate("/deposit")}
            className="w-full flex items-center gap-3 bg-card border border-border rounded-xl p-4 text-left hover:shadow-md hover:border-primary/40 transition active:scale-[0.99]">
            <div className="w-12 h-12 rounded-xl bg-accent text-secondary flex items-center justify-center"><PiggyBank size={24} /></div>
            <div className="flex-1">
              <p className="font-bold text-sm">Regular Saving</p>
              <p className="text-xs text-muted-foreground">Deposit any time, withdraw any time. Flexible wallet savings.</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center"><Plus size={16} /></div>
          </button>

          <button onClick={() => navigate("/goals")}
            className="w-full flex items-center gap-3 bg-card border border-border rounded-xl p-4 text-left hover:shadow-md hover:border-primary/40 transition active:scale-[0.99]">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><Target size={24} /></div>
            <div className="flex-1">
              <p className="font-bold text-sm">Goal Saving</p>
              <p className="text-xs text-muted-foreground">Set a target, choose a frequency, lock funds and reach your goal.</p>
            </div>
            <ArrowRight size={18} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* PIN gate */}
      <Dialog open={pinOpen} onOpenChange={(o) => { if (!o) { setPinOpen(false); setPin(""); } }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Lock size={18} className="text-primary" /> Enter PIN</DialogTitle>
            <DialogDescription>Enter your 4-digit PIN to view your savings balance.</DialogDescription>
          </DialogHeader>
          <Input type="password" inputMode="numeric" maxLength={4} placeholder="••••" value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            className="text-center text-xl tracking-[1em] h-12" autoFocus />
          <DialogFooter>
            <Button variant="outline" onClick={() => setPinOpen(false)}>Cancel</Button>
            <Button onClick={submitPin} className="gradient-primary text-primary-foreground">Unlock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Loan request */}
      <Dialog open={loanReqOpen} onOpenChange={setLoanReqOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Request Loan Eligibility</DialogTitle>
            <DialogDescription>
              Eligibility is reviewed manually during the MVP. Submit a request and our team will assess your Trust Score, savings & payment history within 48 hours.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLoanReqOpen(false)}>Cancel</Button>
            <Button className="gradient-primary text-primary-foreground" onClick={() => { setLoanReqOpen(false); toast.success("Request submitted — we'll be in touch."); }}>
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SaveMoney;
