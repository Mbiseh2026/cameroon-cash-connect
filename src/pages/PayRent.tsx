import PageHeader from "@/components/PageHeader";
import Stepper from "@/components/Stepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { downloadReceipt, genRef } from "@/lib/receipt";
import { CheckCircle2, Download, ChevronLeft, Home } from "lucide-react";

const PROPERTY_TYPES = ["Studio", "1-bedroom", "2-bedroom apartment", "3-bedroom apartment", "House", "Shop / Office", "Other"];

const METHODS = [
  { key: "mtn", label: "MTN MoMo" },
  { key: "orange", label: "Orange Money" },
  { key: "wallet", label: "Eduvest Wallet" },
] as const;
type Method = typeof METHODS[number]["key"];

const STEPS = ["Property", "Amount", "Pay"];

const PayRent = () => {
  const [step, setStep] = useState(0);

  // Step 1 — manual property entry (no landlord dashboard yet)
  const [landlord, setLandlord] = useState("");
  const [landlordPhone, setLandlordPhone] = useState("");
  const [location, setLocation] = useState("");
  const [propType, setPropType] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [payDate, setPayDate] = useState(() => new Date().toISOString().slice(0, 10));

  // Step 2
  const [monthlyRent, setMonthlyRent] = useState("");
  const [months, setMonths] = useState("1");

  // Step 3
  const [method, setMethod] = useState<Method>("mtn");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [done, setDone] = useState<null | { ref: string; amt: number }>(null);

  const total = (Number(monthlyRent) || 0) * (Number(months) || 0);

  const validate = () => {
    if (step === 0) {
      if (!landlord.trim()) { toast.error("Enter landlord / receiver name"); return false; }
      if (!location.trim()) { toast.error("Enter property location"); return false; }
      if (!propType) { toast.error("Select property type"); return false; }
    }
    if (step === 1) {
      if (!monthlyRent || Number(monthlyRent) < 500) { toast.error("Enter a valid monthly rent"); return false; }
      if (!months || Number(months) < 1) { toast.error("Enter months to pay"); return false; }
    }
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
    setDone({ ref, amt: total });
    toast.success("Rent paid — Trust Score +20 pts");
  };

  const downloadPdf = () => {
    if (!done) return;
    downloadReceipt({
      title: "Rent Payment Receipt",
      reference: done.ref,
      amount: `${done.amt.toLocaleString()} FCFA`,
      rows: [
        { label: "Landlord / Receiver", value: landlord },
        ...(landlordPhone ? [{ label: "Landlord phone", value: `+237 ${landlordPhone}` }] : []),
        { label: "Property", value: `${propType} — ${location}` },
        { label: "Monthly rent", value: `${Number(monthlyRent).toLocaleString()} FCFA` },
        { label: "Months paid", value: `${months} month(s)` },
        ...(dueDate ? [{ label: "Due date", value: dueDate }] : []),
        { label: "Payment date", value: payDate },
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
            <p className="text-xs text-muted-foreground">Paid to {landlord}</p>
            <p className="text-3xl font-extrabold text-secondary mt-1">{done.amt.toLocaleString()} FCFA</p>
            <p className="text-[11px] text-muted-foreground mt-1">Ref: {done.ref}</p>
            <p className="text-[11px] font-bold text-primary mt-2">Trust Score +20 pts</p>
          </div>
          <Button onClick={downloadPdf} className="w-full h-12 gradient-primary text-primary-foreground">
            <Download size={18} className="mr-2" /> Download Receipt (PDF)
          </Button>
          <Button variant="outline" onClick={() => { setDone(null); setStep(0); }} className="w-full h-11 mt-2">New Payment</Button>
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
          <div className="space-y-3">
            <div className="bg-accent rounded-xl p-3 text-[11px] text-secondary">
              <Home size={14} className="inline mr-1" /> Fill in property & landlord details. Money goes directly to the landlord's wallet or mobile money.
            </div>
            <div>
              <Label className="text-sm font-semibold">Landlord / Receiver name</Label>
              <Input value={landlord} onChange={(e) => setLandlord(e.target.value)} className="mt-1.5 h-11" placeholder="As it should appear on the receipt" />
            </div>
            <div>
              <Label className="text-sm font-semibold">Landlord phone (optional)</Label>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-sm font-semibold text-muted-foreground">+237</span>
                <Input type="tel" inputMode="numeric" maxLength={9} placeholder="6XX XXX XXX" value={landlordPhone} onChange={(e) => setLandlordPhone(e.target.value.replace(/\D/g, ""))} className="h-11" />
              </div>
            </div>
            <div>
              <Label className="text-sm font-semibold">Location (city & quarter)</Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1.5 h-11" placeholder="e.g. Bonamoussadi, Douala" />
            </div>
            <div>
              <Label className="text-sm font-semibold">Property type</Label>
              <Select value={propType} onValueChange={setPropType}>
                <SelectTrigger className="mt-1.5 h-11"><SelectValue placeholder="Choose type" /></SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-semibold">Due date (optional)</Label>
                <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="mt-1.5 h-11" />
              </div>
              <div>
                <Label className="text-sm font-semibold">Payment date</Label>
                <Input type="date" value={payDate} onChange={(e) => setPayDate(e.target.value)} className="mt-1.5 h-11" />
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold">Monthly rent (FCFA)</Label>
              <Input type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(e.target.value)} className="mt-1.5 text-lg font-bold h-12" placeholder="0" />
            </div>
            <div>
              <Label className="text-sm font-semibold">Months to pay in advance</Label>
              <div className="grid grid-cols-5 gap-2 mt-1.5">
                {["1", "2", "3", "6", "12"].map((m) => (
                  <button key={m} onClick={() => setMonths(m)}
                    className={`p-2 rounded-lg border text-sm font-bold ${months === m ? "border-primary bg-primary/5 text-primary" : "border-border bg-card"}`}>
                    {m}
                  </button>
                ))}
              </div>
              <Input type="number" min={1} value={months} onChange={(e) => setMonths(e.target.value)} className="mt-2 h-10" placeholder="Or type custom (e.g. 4, 10)" />
              <p className="text-[11px] text-muted-foreground mt-1">Some landlords collect 2, 4, 6 or even 10 months in advance.</p>
            </div>
            <div className="bg-secondary text-secondary-foreground rounded-xl p-4">
              <p className="text-[11px] opacity-80">Total to pay</p>
              <p className="text-2xl font-extrabold">{total.toLocaleString()} FCFA</p>
              <p className="text-[10px] opacity-80 mt-1">{months} × {Number(monthlyRent || 0).toLocaleString()} FCFA</p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
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

            {/* Summary */}
            <div className="bg-card border border-border rounded-xl p-4 text-xs space-y-1.5">
              <p className="text-[11px] font-bold text-secondary mb-1">Summary</p>
              <Row k="Landlord" v={landlord} />
              <Row k="Property" v={`${propType} · ${location}`} />
              <Row k="Monthly rent" v={`${Number(monthlyRent || 0).toLocaleString()} FCFA`} />
              <Row k="Months" v={`${months}`} />
              {dueDate && <Row k="Due date" v={dueDate} />}
              <Row k="Payment date" v={payDate} />
              <Row k="Method" v={METHODS.find((m) => m.key === method)!.label} />
              <div className="border-t border-border pt-1.5 mt-1.5">
                <Row k="Total" v={`${total.toLocaleString()} FCFA`} highlight />
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <Button variant="outline" onClick={back} className="flex-1 h-12"><ChevronLeft size={18} className="mr-1" /> Back</Button>
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
    <span className={`font-bold ${highlight ? "text-primary text-base" : "text-foreground"}`}>{v}</span>
  </div>
);

export default PayRent;
