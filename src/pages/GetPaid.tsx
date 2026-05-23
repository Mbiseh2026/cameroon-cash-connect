import PageHeader from "@/components/PageHeader";
import Stepper from "@/components/Stepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { downloadReceipt, genRef } from "@/lib/receipt";
import { Briefcase, UserPlus, ArrowRight, ChevronLeft, CheckCircle2, Download, Wallet, History, TrendingUp, FileText, Share2 } from "lucide-react";

type Role = "employer" | "employee" | "client";
const ROLES: { key: Role; label: string; desc: string }[] = [
  { key: "employer", label: "I'm paying", desc: "Pay salary to staff or a freelancer" },
  { key: "employee", label: "I'm being paid", desc: "Receive salary or freelance income" },
  { key: "client", label: "Invoice a client", desc: "Send an invoice and get paid" },
];

const METHODS = [
  { key: "mtn", label: "MTN MoMo" },
  { key: "orange", label: "Orange Money" },
  { key: "wallet", label: "Eduvest Wallet" },
] as const;
type Method = typeof METHODS[number]["key"];

const STEPS = ["Person", "Amount", "Method", "Confirm"];

const GetPaid = () => {
  const [intro, setIntro] = useState(true);
  const [role, setRole] = useState<Role>("employer");
  const [step, setStep] = useState(0);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [period, setPeriod] = useState("monthly");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<Method>("mtn");
  const [pin, setPin] = useState("");
  const [done, setDone] = useState<null | { ref: string; amt: number }>(null);

  const personLabel = role === "employer" ? "Employee" : role === "client" ? "Client" : "Employer";

  const validate = () => {
    if (step === 0) {
      if (!name.trim()) { toast.error(`Enter ${personLabel.toLowerCase()} name`); return false; }
      if (!/^\d{9}$/.test(phone)) { toast.error("Enter a valid 9-digit number"); return false; }
    }
    if (step === 1 && (!amount || Number(amount) < 500)) { toast.error("Minimum 500 FCFA"); return false; }
    if (step === 3 && pin.length !== 4) { toast.error("Enter your 4-digit PIN"); return false; }
    return true;
  };

  const next = () => { if (validate()) setStep((s) => Math.min(s + 1, STEPS.length - 1)); };
  const back = () => setStep((s) => Math.max(0, s - 1));

  const pay = () => {
    if (!validate()) return;
    const ref = genRef("SAL");
    setDone({ ref, amt: Number(amount) });
    toast.success(role === "employer" ? "Salary paid" : "Payment recorded — Trust Score updated");
  };

  const downloadPayslip = () => {
    if (!done) return;
    downloadReceipt({
      title: role === "client" ? "Invoice / Payment Receipt" : "Pay Slip",
      reference: done.ref,
      amount: `${done.amt.toLocaleString()} FCFA`,
      rows: [
        { label: personLabel, value: name },
        { label: "Phone", value: `+237 ${phone}` },
        ...(position ? [{ label: "Role / Position", value: position }] : []),
        { label: "Period", value: period },
        { label: "Method", value: METHODS.find((m) => m.key === method)!.label },
        { label: "Direction", value: role === "employer" ? "Outgoing" : "Incoming" },
      ],
    });
  };

  const invite = () => {
    const url = `https://wa.me/?text=${encodeURIComponent("Join me on Eduvest to manage salary payments securely: https://eduvest.app")}`;
    window.open(url, "_blank");
  };

  // Intro screen
  if (intro) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="max-w-md mx-auto px-4 pt-6 animate-fade-in space-y-4">
          <PageHeader title="Get Paid" subtitle="Salary, freelance & client payments" />

          <div className="gradient-hero rounded-2xl p-5 text-primary-foreground">
            <Briefcase size={28} className="mb-2" />
            <h2 className="text-lg font-bold mb-1">One feature, everyone benefits</h2>
            <p className="text-xs opacity-90">Employers pay, employees & freelancers receive — all with payslips, history and Trust Score growth.</p>
          </div>

          <div className="space-y-2">
            {ROLES.map((r) => (
              <button key={r.key} onClick={() => setRole(r.key)}
                className={`w-full text-left p-4 rounded-xl border ${role === r.key ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
                <p className="text-sm font-bold">{r.label}</p>
                <p className="text-[11px] text-muted-foreground">{r.desc}</p>
              </button>
            ))}
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs font-bold text-secondary mb-2">What you get</p>
            <ul className="space-y-1.5 text-xs">
              {[
                { i: TrendingUp, t: "Track income over time" },
                { i: History, t: "Full payment history" },
                { i: FileText, t: "Download pay slips any time" },
                { i: Wallet, t: "Trust Score updates & instant loan access" },
              ].map((x) => (
                <li key={x.t} className="flex items-center gap-2">
                  <x.i size={14} className="text-primary" />
                  <span>{x.t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={invite} className="flex-1 h-12">
              <UserPlus size={16} className="mr-1.5" /> Invite {role === "employer" ? "Employee" : "Employer"}
            </Button>
            <Button onClick={() => setIntro(false)} className="flex-1 h-12 gradient-primary text-primary-foreground font-bold">
              Continue <ArrowRight size={16} className="ml-1.5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="max-w-md mx-auto px-4 pt-6 animate-fade-in">
          <PageHeader title="Receipt" subtitle="Payment confirmed" />
          <div className="bg-accent border border-primary/30 rounded-2xl p-5 text-center mb-4">
            <CheckCircle2 className="mx-auto text-primary mb-2" size={48} />
            <p className="text-xs text-muted-foreground">{role === "employer" ? "Paid to" : "Received from"} {name}</p>
            <p className="text-3xl font-extrabold text-secondary mt-1">{done.amt.toLocaleString()} FCFA</p>
            <p className="text-[11px] text-muted-foreground mt-1">Ref: {done.ref}</p>
          </div>
          <Button onClick={downloadPayslip} className="w-full h-12 gradient-primary text-primary-foreground">
            <Download size={18} className="mr-2" /> Download Pay Slip (PDF)
          </Button>
          <Button variant="outline" onClick={invite} className="w-full h-11 mt-2">
            <Share2 size={16} className="mr-1.5" /> Invite the other party
          </Button>
          <Button variant="ghost" onClick={() => { setDone(null); setStep(0); setIntro(true); }} className="w-full h-11 mt-1">
            New payment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-4 pt-6 animate-fade-in">
        <PageHeader title="Get Paid" subtitle={`Step ${step + 1} of ${STEPS.length}`} />
        <Stepper steps={STEPS} current={step} />

        {step === 0 && (
          <div className="space-y-3">
            <div className="bg-muted rounded-xl p-3 text-[11px]">Filling brief {personLabel.toLowerCase()} details. Just the essentials.</div>
            <div>
              <Label className="text-sm font-semibold">{personLabel} name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 h-11" placeholder="Full name" />
            </div>
            <div>
              <Label className="text-sm font-semibold">Phone number</Label>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-sm font-semibold text-muted-foreground">+237</span>
                <Input type="tel" inputMode="numeric" maxLength={9} placeholder="6XX XXX XXX" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} className="h-11" />
              </div>
            </div>
            <div>
              <Label className="text-sm font-semibold">Role / Position (optional)</Label>
              <Input value={position} onChange={(e) => setPosition(e.target.value)} className="mt-1.5 h-11" placeholder="e.g. Cashier, Designer" />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold">Amount (FCFA)</Label>
              <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1.5 text-lg font-bold h-12" placeholder="0" />
            </div>
            <div>
              <Label className="text-sm font-semibold">Period</Label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="mt-1.5 h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="one-off">One-off / Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <Label className="text-sm font-semibold mb-2 block">Payment method</Label>
            <div className="grid grid-cols-3 gap-2">
              {METHODS.map((m) => (
                <button key={m.key} onClick={() => setMethod(m.key)}
                  className={`text-xs font-semibold p-3 rounded-xl border ${method === m.key ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-4 text-xs space-y-1.5">
              <p className="text-[11px] font-bold text-secondary mb-1">Summary</p>
              <Row k={personLabel} v={name} />
              <Row k="Phone" v={`+237 ${phone}`} />
              {position && <Row k="Position" v={position} />}
              <Row k="Period" v={period} />
              <Row k="Method" v={METHODS.find((m) => m.key === method)!.label} />
              <Row k="Amount" v={`${Number(amount).toLocaleString()} FCFA`} highlight />
            </div>
            <div>
              <Label className="text-sm font-semibold">PIN Code</Label>
              <Input type="password" maxLength={4} value={pin} onChange={(e) => setPin(e.target.value)} placeholder="••••" className="mt-1.5 text-center text-xl tracking-[1em] h-12" />
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          {step > 0 ? (
            <Button variant="outline" onClick={back} className="flex-1 h-12"><ChevronLeft size={18} className="mr-1" /> Back</Button>
          ) : (
            <Button variant="outline" onClick={() => setIntro(true)} className="flex-1 h-12"><ChevronLeft size={18} className="mr-1" /> Back</Button>
          )}
          {step < STEPS.length - 1 ? (
            <Button onClick={next} className="flex-1 h-12 gradient-primary text-primary-foreground font-bold">Continue</Button>
          ) : (
            <Button onClick={pay} className="flex-1 h-12 gradient-primary text-primary-foreground font-bold">
              {role === "employer" ? "Pay Now" : "Confirm"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const Row = ({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) => (
  <div className="flex justify-between">
    <span className="text-muted-foreground">{k}</span>
    <span className={`font-bold ${highlight ? "text-primary" : "text-foreground"}`}>{v}</span>
  </div>
);

export default GetPaid;
