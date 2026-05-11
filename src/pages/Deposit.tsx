import PageHeader from "@/components/PageHeader";
import Stepper from "@/components/Stepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";

type Method = "mtn" | "orange";
const STEPS = ["Method", "Account", "Confirm"];

const Deposit = () => {
  const [step, setStep] = useState(0);
  const [method, setMethod] = useState<Method | "">("");
  const [phone, setPhone] = useState("");
  const [accountName, setAccountName] = useState("");
  const [amount, setAmount] = useState("");

  const validate = () => {
    if (step === 0 && !method) { toast.error("Pick a method"); return false; }
    if (step === 1) {
      if (!/^\d{9}$/.test(phone)) { toast.error("Enter a valid 9-digit number"); return false; }
      if (!accountName.trim()) { toast.error("Enter account name"); return false; }
    }
    if (step === 2 && (!amount || Number(amount) < 100)) { toast.error("Minimum 100 FCFA"); return false; }
    return true;
  };

  const next = () => { if (validate()) setStep((s) => Math.min(s + 1, STEPS.length - 1)); };
  const back = () => setStep((s) => Math.max(0, s - 1));

  const submit = () => {
    if (!validate()) return;
    toast.success(`Deposit of ${Number(amount).toLocaleString()} FCFA initiated via ${method!.toUpperCase()}`);
    setStep(0); setMethod(""); setPhone(""); setAccountName(""); setAmount("");
  };

  const methods: { key: Method; label: string; color: string }[] = [
    { key: "mtn", label: "MTN Mobile Money", color: "bg-warning" },
    { key: "orange", label: "Orange Money", color: "bg-destructive" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 pt-6 animate-fade-in">
        <PageHeader title="Deposit / Top Up" subtitle={`Step ${step + 1} of ${STEPS.length}`} />
        <Stepper steps={STEPS} current={step} />

        {step === 0 && (
          <div>
            <Label className="text-sm font-semibold mb-2 block">Funding Method</Label>
            <div className="space-y-2">
              {methods.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMethod(m.key)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left ${
                    method === m.key ? "border-primary bg-primary/5" : "border-border bg-card"
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${m.color}`} />
                  <span className="text-sm font-semibold">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold">Phone number</Label>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-sm font-semibold text-muted-foreground">+237</span>
                <Input type="tel" inputMode="numeric" maxLength={9} placeholder="6XX XXX XXX" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} className="h-12" />
              </div>
            </div>
            <div>
              <Label className="text-sm font-semibold">Account name</Label>
              <Input placeholder="Full name on the mobile money account" value={accountName} onChange={(e) => setAccountName(e.target.value)} className="mt-1.5 h-11" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold">Amount (FCFA)</Label>
              <Input type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1.5 text-lg font-bold h-12" />
            </div>
            <div className="bg-muted rounded-xl p-3 text-xs space-y-1">
              <Row k="Method" v={method === "mtn" ? "MTN Mobile Money" : "Orange Money"} />
              <Row k="Account" v={`${accountName} (+237 ${phone})`} />
              <Row k="Fees" v="Free" />
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <Button variant="outline" onClick={back} className="flex-1 h-12">
              <ChevronLeft size={18} className="mr-1" /> Back
            </Button>
          )}
          {step < STEPS.length - 1 ? (
            <Button onClick={next} className="flex-1 h-12 gradient-primary text-primary-foreground font-bold">Continue</Button>
          ) : (
            <Button onClick={submit} className="flex-1 h-12 gradient-primary text-primary-foreground font-bold">Confirm Deposit</Button>
          )}
        </div>
      </div>
    </div>
  );
};

const Row = ({ k, v }: { k: string; v: string }) => (
  <div className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className="font-bold">{v}</span></div>
);

export default Deposit;
