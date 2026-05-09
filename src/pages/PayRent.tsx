import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { downloadReceipt, genRef } from "@/lib/receipt";
import { Home, MapPin, CalendarDays, AlertTriangle, UserPlus, CheckCircle2, Download, History as HistoryIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

const PayRent = () => {
  const [propId, setPropId] = useState(PROPERTIES[0].id);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<Method>("mtn");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [done, setDone] = useState<null | { ref: string; amt: number }>(null);
  const [inviteOpen, setInviteOpen] = useState(false);

  const property = PROPERTIES.find((p) => p.id === propId)!;
  const isLate = false;

  const submit = () => {
    if (!amount) return toast.error("Enter amount");
    if (method !== "wallet" && !/^\d{9}$/.test(phone)) return toast.error("Enter a valid 9-digit number");
    if (pin.length !== 4) return toast.error("Enter your 4-digit PIN");
    setConfirmOpen(true);
  };

  const confirmPay = () => {
    const ref = genRef("RNT");
    setConfirmOpen(false);
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
          <Button variant="outline" onClick={() => setDone(null)} className="w-full h-11 mt-2">
            New Payment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-4 pt-6 animate-fade-in">
        <PageHeader title="Pay Rent" subtitle="Track & build credit history" />

        <div className="space-y-4">
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
                      <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${p.paidPct}%` }} />
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">{p.paidPct}% of yearly rent paid</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {isLate && (
            <div className="flex items-center gap-2 bg-warning/10 text-warning border border-warning/30 rounded-xl p-3 text-xs font-semibold">
              <AlertTriangle size={16} /> Payment is overdue. Late fees may apply.
            </div>
          )}

          <div>
            <Label className="text-sm font-semibold">Amount (FCFA)</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={String(property.rent)}
              className="mt-1.5 text-lg font-bold h-12"
            />
            <button
              type="button"
              onClick={() => setAmount(String(property.rent))}
              className="text-[11px] font-semibold text-primary mt-1"
            >
              Use full month: {property.rent.toLocaleString()} FCFA
            </button>
          </div>

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
                <Input
                  type="tel"
                  inputMode="numeric"
                  maxLength={9}
                  placeholder="6XX XXX XXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  className="h-12"
                />
              </div>
            </div>
          )}

          <div>
            <Label className="text-sm font-semibold">PIN Code</Label>
            <Input type="password" maxLength={4} value={pin} onChange={(e) => setPin(e.target.value)} placeholder="••••" className="mt-1.5 text-center text-xl tracking-[1em] h-12" />
          </div>

          <Button onClick={submit} className="w-full h-12 text-base font-bold gradient-primary text-primary-foreground">
            Pay Rent
          </Button>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button className="flex items-center gap-2 p-3 bg-card border border-border rounded-xl text-xs font-semibold">
              <HistoryIcon size={16} className="text-primary" /> Payment History
            </button>
            <button onClick={() => setInviteOpen(true)} className="flex items-center gap-2 p-3 bg-card border border-border rounded-xl text-xs font-semibold">
              <UserPlus size={16} className="text-secondary" /> Invite Landlord
            </button>
          </div>
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Confirm rent payment</DialogTitle></DialogHeader>
          <div className="text-sm space-y-2">
            <Row k="Landlord" v={property.landlord} />
            <Row k="Property" v={property.address} />
            <Row k="Amount" v={`${Number(amount || 0).toLocaleString()} FCFA`} highlight />
            <Row k="Method" v={METHODS.find((m) => m.key === method)!.label} />
          </div>
          <Button onClick={confirmPay} className="w-full h-11 gradient-primary text-primary-foreground">
            Confirm & Pay
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Invite your landlord</DialogTitle></DialogHeader>
          <p className="text-xs text-muted-foreground">
            Send an invite so your landlord can receive payments and confirm receipts directly on Eduvest.
          </p>
          <div className="space-y-2">
            <Input placeholder="Landlord phone (+237 ...)" />
            <Input placeholder="Landlord name" />
          </div>
          <Button
            onClick={() => {
              toast.success("Invite sent");
              setInviteOpen(false);
            }}
            className="gradient-primary text-primary-foreground"
          >
            Send Invite
          </Button>
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

export default PayRent;
