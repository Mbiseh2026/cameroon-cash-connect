import PageHeader from "@/components/PageHeader";
import Stepper from "@/components/Stepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";

type Method = "mtn" | "orange" | "treasurit";
const options: { key: Method; label: string }[] = [
  { key: "mtn", label: "MTN Mobile Money" },
  { key: "orange", label: "Orange Money" },
  { key: "treasurit", label: "Eduvest User" },
];
const STEPS = ["Destination", "Amount", "Confirm"];

const Withdraw = () => {
  const [step, setStep] = useState(0);
  const [method, setMethod] = useState<Method>("mtn");
  const [phone, setPhone] = useState("");
  const [accountName, setAccountName] = useState("");
  const [treasuritAccount, setTreasuritAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");

  const validate = () => {
    if (step === 0) {
      if (method === "mtn" || method === "orange") {
        if (!/^\d{9}$/.test(phone)) { toast.error("Enter a valid 9-digit number"); return false; }
        if (!accountName.trim()) { toast.error("Enter account name"); return false; }
      }
      if (method === "treasurit" && !treasuritAccount.trim()) { toast.error("Enter Eduvest account"); return false; }
    }
    if (step === 1 && (!amount || Number(amount) < 500)) { toast.error("Minimum 500 FCFA"); return false; }
    if (step === 2 && pin.length !== 4) { toast.error("Enter your 4-digit PIN"); return false; }
    return true;
  };

  const next = () => { if (validate()) setStep((s) => Math.min(s + 1, STEPS.length - 1)); };
  const back = () => setStep((s) => Math.max(0, s - 1));

  const submit = () => {
    if (!validate()) return;
    toast.success(`Withdrawal of ${Number(amount).toLocaleString()} FCFA initiated`);
    setStep(0); setAmount(""); setPin("");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 pt-6 animate-fade-in">
        <PageHeader title="Withdraw" subtitle={`Step ${step + 1} of ${STEPS.length}`} />
        <Stepper steps={STEPS} current={step} />

        {step === 0 && (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold mb-2 block">Withdrawal Method</Label>
              <div className="space-y-2">
                {options.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setMethod(m.key)}
                    className={`w-full p-3 rounded-xl border text-left text-sm font-semibold ${
                      method === m.key ? "border-primary bg-primary/5" : "border-border bg-card"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
            {(method === "mtn" || method === "orange") && (
              <>
                <div>
                  <Label className="text-sm font-semibold">Phone number</Label>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-sm font-semibold text-muted-foreground">+237</span>
                    <Input type="tel" inputMode="numeric" maxLength={9} placeholder="6XX XXX XXX" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} className="h-12" />
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Account name</Label>
                  <Input placeholder="Full name" value={accountName} onChange={(e) => setAccountName(e.target.value)} className="mt-1.5 h-11" />
                </div>
              </>
            )}
            {method === "treasurit" && (
              <div>
                <Label className="text-sm font-semibold">Eduvest account</Label>
                <Input placeholder="Username, phone or account ID" value={treasuritAccount} onChange={(e) => setTreasuritAccount(e.target.value)} className="mt-1.5 h-11" />
              </div>
            )}
          </div>
        )}

        {step === 1 && (
          <div>
            <Label className="text-sm font-semibold">Amount (FCFA)</Label>
            <Input type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1.5 text-lg font-bold h-12" />
            <p className="text-xs text-muted-foreground mt-1">Daily limit: 500,000 FCFA</p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold">Confirm PIN</Label>
              <Input type="password" maxLength={4} placeholder="••••" value={pin} onChange={(e) => setPin(e.target.value)} className="mt-1.5 text-center text-xl tracking-[1em] h-12" />
            </div>
            <div className="bg-muted rounded-xl p-3 text-xs space-y-1">
              <Row k="Method" v={options.find((o) => o.key === method)!.label} />
              <Row k="Destination" v={method === "treasurit" ? treasuritAccount : `${accountName} · +237 ${phone}`} />
              <Row k="Amount" v={`${Number(amount || 0).toLocaleString()} FCFA`} />
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
            <Button onClick={submit} className="flex-1 h-12 gradient-primary text-primary-foreground font-bold">Confirm Withdrawal</Button>
          )}
        </div>
      </div>
    </div>
  );
};

const Row = ({ k, v }: { k: string; v: string }) => (
  <div className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className="font-bold text-right max-w-[60%] truncate">{v}</span></div>
);

export default Withdraw;
