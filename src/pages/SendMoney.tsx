import PageHeader from "@/components/PageHeader";
import Stepper from "@/components/Stepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";

type Method = "treasurit" | "mtn" | "orange";
const methods: { key: Method; label: string }[] = [
  { key: "treasurit", label: "Eduvest User" },
  { key: "mtn", label: "MTN MoMo" },
  { key: "orange", label: "Orange Money" },
];
const STEPS = ["Method", "Recipient", "Confirm"];

const SendMoney = () => {
  const [step, setStep] = useState(0);
  const [method, setMethod] = useState<Method>("treasurit");
  const [recipient, setRecipient] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [pin, setPin] = useState("");

  const validate = () => {
    if (step === 1) {
      if (method === "treasurit" && !recipient.trim()) { toast.error("Enter Eduvest account"); return false; }
      if (method !== "treasurit") {
        if (!/^\d{9}$/.test(recipient)) { toast.error("Enter a valid 9-digit number"); return false; }
        if (!recipientName.trim()) { toast.error("Enter recipient name"); return false; }
      }
    }
    if (step === 2) {
      if (!amount || Number(amount) < 100) { toast.error("Minimum 100 FCFA"); return false; }
      if (pin.length !== 4) { toast.error("Enter your 4-digit PIN"); return false; }
    }
    return true;
  };

  const next = () => { if (validate()) setStep((s) => Math.min(s + 1, STEPS.length - 1)); };
  const back = () => setStep((s) => Math.max(0, s - 1));

  const send = () => {
    if (!validate()) return;
    const target = recipientName ? `${recipientName} (+237 ${recipient})` : recipient;
    toast.success(`${Number(amount).toLocaleString()} FCFA sent to ${target}`);
    setStep(0); setRecipient(""); setRecipientName(""); setAmount(""); setReason(""); setPin("");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 pt-6 animate-fade-in">
        <PageHeader title="Send Money" subtitle={`Step ${step + 1} of ${STEPS.length}`} />
        <Stepper steps={STEPS} current={step} />

        {step === 0 && (
          <div>
            <Label className="text-sm font-semibold mb-2 block">How do you want to send?</Label>
            <div className="space-y-2">
              {methods.map((m) => (
                <button
                  key={m.key}
                  onClick={() => { setMethod(m.key); setRecipient(""); setRecipientName(""); }}
                  className={`w-full p-4 rounded-xl border text-left text-sm font-semibold ${
                    method === m.key ? "border-primary bg-primary/5 text-primary" : "border-border bg-card"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            {method === "treasurit" ? (
              <div>
                <Label className="text-sm font-semibold">Eduvest account</Label>
                <Input placeholder="Search by name, @username or phone" value={recipient} onChange={(e) => setRecipient(e.target.value)} className="mt-1.5 h-12" />
                <p className="text-xs text-muted-foreground mt-1">Tip: names aren't unique — use a username or phone.</p>
              </div>
            ) : (
              <>
                <div>
                  <Label className="text-sm font-semibold">Phone number</Label>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-sm font-semibold text-muted-foreground">+237</span>
                    <Input type="tel" inputMode="numeric" maxLength={9} placeholder="6XX XXX XXX" value={recipient} onChange={(e) => setRecipient(e.target.value.replace(/\D/g, ""))} className="h-12" />
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Recipient name</Label>
                  <Input placeholder="Full name on the account" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} className="mt-1.5 h-11" />
                </div>
              </>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold">Amount (FCFA)</Label>
              <Input type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1.5 text-lg font-bold h-12" />
            </div>
            <div>
              <Label className="text-sm font-semibold">Reason (Optional)</Label>
              <Input placeholder="e.g. Family, Business" value={reason} onChange={(e) => setReason(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label className="text-sm font-semibold">PIN Code</Label>
              <Input type="password" maxLength={4} placeholder="••••" value={pin} onChange={(e) => setPin(e.target.value)} className="mt-1.5 text-center text-xl tracking-[1em] h-12" />
            </div>
            <div className="bg-muted rounded-xl p-3 text-xs space-y-1">
              <Row k="Method" v={methods.find((m) => m.key === method)!.label} />
              <Row k="Recipient" v={recipientName ? `${recipientName} · ${method !== "treasurit" ? "+237 " : ""}${recipient}` : recipient} />
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
            <Button onClick={send} className="flex-1 h-12 gradient-primary text-primary-foreground font-bold">Send Money</Button>
          )}
        </div>
      </div>
    </div>
  );
};

const Row = ({ k, v }: { k: string; v: string }) => (
  <div className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className="font-bold text-right max-w-[60%] truncate">{v}</span></div>
);

export default SendMoney;
