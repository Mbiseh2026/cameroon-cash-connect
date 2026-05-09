import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, TrendingUp, Info, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const PURPOSES = ["School fees", "Rent", "Business capital", "Medical", "Personal"];
const TRUST_SCORE = 720;
const MAX_LOAN = 750000;

const Loans = () => {
  const [amount, setAmount] = useState(150000);
  const [months, setMonths] = useState(6);
  const [purpose, setPurpose] = useState("School fees");
  const [trustOpen, setTrustOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const interestRate = 0.05; // 5% flat
  const totalRepay = useMemo(() => Math.round(amount * (1 + interestRate)), [amount]);
  const monthly = useMemo(() => Math.round(totalRepay / months), [totalRepay, months]);

  const apply = () => {
    if (amount > MAX_LOAN) return toast.error("Above eligibility");
    setSubmitted(true);
    toast.success("Loan request submitted for review");
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="max-w-md mx-auto px-4 pt-6 animate-fade-in">
          <PageHeader title="Application Status" />
          <div className="bg-accent border border-primary/30 rounded-2xl p-5 text-center mb-4">
            <CheckCircle2 className="mx-auto text-primary mb-2" size={48} />
            <p className="text-sm font-bold text-secondary">Under Review</p>
            <p className="text-[11px] text-muted-foreground mt-1">
              We'll notify you within 24 hours. Your Trust Score gives you priority.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 space-y-2 text-xs mb-4">
            <Row k="Requested" v={`${amount.toLocaleString()} FCFA`} highlight />
            <Row k="Term" v={`${months} months`} />
            <Row k="Monthly repayment" v={`${monthly.toLocaleString()} FCFA`} />
            <Row k="Purpose" v={purpose} />
          </div>
          <Button variant="outline" onClick={() => setSubmitted(false)} className="w-full h-11">
            New Application
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-4 pt-6 animate-fade-in">
        <PageHeader title="Loans" subtitle="Powered by your Trust Score" />

        <section className="gradient-card rounded-2xl p-5 text-primary-foreground mb-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs opacity-90">Loan Eligibility</p>
            <button onClick={() => setTrustOpen(true)} className="text-[11px] font-semibold flex items-center gap-1 opacity-90">
              <Info size={12} /> Trust Score
            </button>
          </div>
          <p className="text-3xl font-extrabold">{MAX_LOAN.toLocaleString()} FCFA</p>
          <p className="text-[11px] opacity-90 mt-1">Maximum amount you can borrow today.</p>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <ShieldCheck size={14} /> <span>Trust Score: <b>{TRUST_SCORE}</b> — Excellent</span>
          </div>
        </section>

        <div className="space-y-5">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <Label className="text-sm font-semibold">Loan amount</Label>
              <span className="text-sm font-bold text-primary">{amount.toLocaleString()} FCFA</span>
            </div>
            <input
              type="range"
              min={50000}
              max={MAX_LOAN}
              step={10000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>50,000</span>
              <span>{MAX_LOAN.toLocaleString()}</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <Label className="text-sm font-semibold">Repayment timeline</Label>
              <span className="text-sm font-bold text-primary">{months} months</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[3, 6, 9, 12, 18].map((m) => (
                <button
                  key={m}
                  onClick={() => setMonths(m)}
                  className={`text-xs font-semibold p-2 rounded-lg border ${
                    months === m ? "border-primary bg-primary/5 text-primary" : "border-border"
                  }`}
                >
                  {m}m
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-semibold">Purpose</Label>
            <Select value={purpose} onValueChange={setPurpose}>
              <SelectTrigger className="mt-1.5 h-12"><SelectValue /></SelectTrigger>
              <SelectContent>
                {PURPOSES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-accent border border-primary/20 rounded-2xl p-4 space-y-2 text-xs">
            <p className="text-sm font-bold text-secondary mb-1">Loan summary</p>
            <Row k="Interest (flat)" v="5%" />
            <Row k="Total repayment" v={`${totalRepay.toLocaleString()} FCFA`} />
            <Row k="Monthly installment" v={`${monthly.toLocaleString()} FCFA`} highlight />
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-primary" />
              <p className="text-xs font-bold">Repayment tracker</p>
            </div>
            <div className="grid grid-cols-6 gap-1">
              {Array.from({ length: months }).map((_, i) => (
                <div key={i} className="h-2 rounded-full bg-muted" />
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              First repayment due 30 days after approval.
            </p>
          </div>

          <Button onClick={apply} className="w-full h-12 text-base font-bold gradient-primary text-primary-foreground">
            Apply for Loan
          </Button>
        </div>
      </div>

      <Dialog open={trustOpen} onOpenChange={setTrustOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>What is the Trust Score?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            Your Trust Score is your financial identity on Eduvest. Every payment — school fees, rent, savings — increases it.
            A higher score unlocks larger loans, lower rates and access to housing.
          </p>
          <ul className="text-xs space-y-2 mt-2">
            <li className="flex justify-between"><span>0–499</span><span className="font-bold">Building</span></li>
            <li className="flex justify-between"><span>500–699</span><span className="font-bold text-secondary">Trusted</span></li>
            <li className="flex justify-between"><span>700+</span><span className="font-bold text-primary">Excellent</span></li>
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Row = ({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) => (
  <div className="flex justify-between items-center">
    <span className="text-muted-foreground">{k}</span>
    <span className={`font-bold ${highlight ? "text-primary" : "text-foreground"}`}>{v}</span>
  </div>
);

export default Loans;
