import PageHeader from "@/components/PageHeader";
import Stepper from "@/components/Stepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { downloadReceipt, genRef } from "@/lib/receipt";
import { Home, MapPin, CalendarDays, CheckCircle2, Download, ChevronLeft } from "lucide-react";

const PROPERTIES = [
  { id: "p1", landlord: "Mr Eyong Tabi", address: "Bonamoussadi, Douala — 2-bed apartment", rent: 85000, due: "May 15, 2026", paidPct: 60 },
  { id: "p2", landlord: "Mme Fonyuy", address: "Molyko, Buea — Studio", rent: 45000, due: "May 28, 2026", paidPct: 30 },
];

const METHODS = [
  { key: "mtn", label: "MTN MoMo" },
  { key: "orange", label: "Orange Money" },
  { key: "wallet", label: "Eduvest Wallet" },
] as const;
type Method = typeof METHODS[number]["key"];

const STEPS = ["Property", "Amount", "Pay"];

const PayRent = () => {
  const [step, setStep] = useState(0);
  const [propId, setPropId] = useState(PROPERTIES[0].id);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<Method>("mtn");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [done, setDone] = useState<null | { ref: string; amt: number }>(null);

  const property = PROPERTIES.find((p) => p.id === propId)!;

  const validate = () => {
    if (step === 1 && (!amount || Number(amount) < 500)) { toast.error("Minimum 500 FCFA"); return false; }
    if (step === 2) {
      if (method !== "wallet" && !/^\d{9}$/.test(phone)) { toast.error("Enter a valid 9-digit number"); return false; }
      if (pin.length !== 4) { toast.error("Enter your 4-digit PIN"); return false; }
    }
    return true;
  };

  const next = () => { if (validate()) setStep((s) => Math.min(s + 1, STEPS.length - 1)); };
  const back = () => setStep((s) => Math.max(0, s - 1));

  const pay = () => {
    if (!validate()) return;
    const ref = genRef("RNT");
    setDone({ ref, amt: Number(amount) });
    toast.success("Rent paid — Trust Score +20 pts");
  };

  const downloadPdf = () => {
    if (!done) return;
    downloadReceipt({
      title: "Rent Payment Receipt",
      reference: done.ref,
      amount: `${done.amt.toLocaleString()} FCFA`,
      rows: [
        { label: "Landlord", value: property.landlord },
        { label: "Property", value: property.address },
        { label: "Monthly rent", value: `${property.rent.toLocaleString()} FCFA` },
        { label: "Due date", value: property.due },
        { label: "Method", value: METHODS.find((m) => m.key === method)!.label },
      ],
    });
  };

  if (done) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="max-w-md mx-auto px-4 pt-6 animate-fade-in">
          <PageHeader title="Receipt" subtitle="Rent payment confirmed" />
          <div className="bg-accent border border-primary/30 rounded-2xl p-5 text-center mb-4">
            <CheckCircle2 className="mx-auto text-primary mb-2" size={48} />
            <p className="text-xs text-muted-foreground">Paid to {property.landlord}</p>
            <p className="text-3xl font-extrabold text-secondary mt-1">{done.amt.toLocaleString()} FCFA</p>
            <p className="text-[11px] text-muted-foreground mt-1">Ref: {done.ref}</p>
            <p className="text-[11px] font-bold text-primary mt-2">Trust Score +20 pts</p>
          </div>
          <Button onClick={downloadPdf} className="w-full h-12 gradient-primary text-primary-foreground">
            <Download size={18} className="mr-2" /> Download Receipt (PDF)
          </Button>
          <Button variant="outline" onClick={() => { setDone(null); setStep(0); }} className="w-full h-11 mt-2">
            New Payment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-4 pt-6 animate-fade-in">
        <PageHeader title="Pay Rent" subtitle={`Step ${step + 1} of ${STEPS.length}`} />
        <Stepper steps={STEPS} current={step} />

        {step === 0 && (
          <div className="space-y-2">
            {PROPERTIES.map((p) => {
              const active = p.id === propId;
              return (
                <button
                  key={p.id}
                  onClick={() => setPropId(p.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition ${
                    active ? "border-primary bg-primary/5" : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                      <Home size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold">{p.landlord}</p>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <MapPin size={11} /> {p.address}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-bold text-primary">{p.rent.toLocaleString()} FCFA / mo</span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <CalendarDays size={11} /> Due {p.due}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold">Amount (FCFA)</Label>
              <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={String(property.rent)} className="mt-1.5 text-lg font-bold h-12" />
              <button type="button" onClick={() => setAmount(String(property.rent))} className="text-[11px] font-semibold text-primary mt-1">
                Use full month: {property.rent.toLocaleString()} FCFA
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold mb-2 block">Payment method</Label>
              <div className="grid grid-cols-3 gap-2">
                {METHODS.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setMethod(m.key)}
                    className={`text-xs font-semibold p-3 rounded-xl border ${
                      method === m.key ? "border-primary bg-primary/5" : "border-border bg-card"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
            {method !== "wallet" && (
              <div>
                <Label className="text-sm font-semibold">Mobile number</Label>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-sm font-semibold text-muted-foreground">+237</span>
                  <Input type="tel" inputMode="numeric" maxLength={9} placeholder="6XX XXX XXX" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} className="h-12" />
                </div>
              </div>
            )}
            <div>
              <Label className="text-sm font-semibold">PIN Code</Label>
              <Input type="password" maxLength={4} value={pin} onChange={(e) => setPin(e.target.value)} placeholder="••••" className="mt-1.5 text-center text-xl tracking-[1em] h-12" />
            </div>
            <div className="bg-muted rounded-xl p-3 text-xs space-y-1">
              <Row k="Landlord" v={property.landlord} />
              <Row k="Amount" v={`${Number(amount || 0).toLocaleString()} FCFA`} highlight />
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
            <Button onClick={pay} className="flex-1 h-12 gradient-primary text-primary-foreground font-bold">Pay Rent</Button>
          )}
        </div>
      </div>
    </div>
  );
};

const Row = ({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) => (
  <div className="flex justify-between items-center">
    <span className="text-muted-foreground">{k}</span>
    <span className={`font-bold ${highlight ? "text-primary" : "text-foreground"}`}>{v}</span>
  </div>
);

export default PayRent;
