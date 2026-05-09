import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { downloadReceipt, genRef } from "@/lib/receipt";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, Download, FileText, History as HistoryIcon, Bell } from "lucide-react";

const SCHOOLS = [
  { id: "saker", name: "Saker Baptist College", balance: 250000 },
  { id: "sasse", name: "St Joseph's College Sasse", balance: 180000 },
  { id: "lyceebil", name: "Lycée Bilingue de Yaoundé", balance: 95000 },
  { id: "buea-uni", name: "University of Buea", balance: 420000 },
];

const METHODS = [
  { key: "mtn", label: "MTN MoMo" },
  { key: "orange", label: "Orange Money" },
  { key: "wallet", label: "Eduvest Wallet" },
] as const;

type Method = typeof METHODS[number]["key"];

const PaySchoolFees = () => {
  const [schoolId, setSchoolId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [amount, setAmount] = useState("");
  const [installment, setInstallment] = useState(false);
  const [method, setMethod] = useState<Method>("mtn");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [done, setDone] = useState<null | { ref: string; amt: number }>(null);

  const school = useMemo(() => SCHOOLS.find((s) => s.id === schoolId), [schoolId]);
  const remaining = school ? Math.max(0, school.balance - Number(amount || 0)) : 0;

  const submit = () => {
    if (!school || !studentName || !studentId || !amount) {
      toast.error("Please complete all required fields");
      return;
    }
    if (Number(amount) < 500) return toast.error("Minimum 500 FCFA");
    if (method !== "wallet" && !/^\d{9}$/.test(phone)) return toast.error("Enter a valid 9-digit number");
    if (pin.length !== 4) return toast.error("Enter your 4-digit PIN");
    setConfirmOpen(true);
  };

  const confirmPay = () => {
    const ref = genRef("FEE");
    setConfirmOpen(false);
    setDone({ ref, amt: Number(amount) });
    toast.success("Payment successful — Trust Score updated");
  };

  const downloadPdf = () => {
    if (!done || !school) return;
    downloadReceipt({
      title: "School Fees Receipt",
      reference: done.ref,
      amount: `${done.amt.toLocaleString()} FCFA`,
      rows: [
        { label: "School", value: school.name },
        { label: "Student", value: studentName },
        { label: "Student ID", value: studentId },
        { label: "Method", value: METHODS.find((m) => m.key === method)!.label },
        { label: "Outstanding before", value: `${school.balance.toLocaleString()} FCFA` },
        { label: "Outstanding after", value: `${remaining.toLocaleString()} FCFA` },
        { label: "Plan", value: installment ? "Installment" : "Full payment" },
      ],
    });
  };

  if (done && school) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="max-w-md mx-auto px-4 pt-6 animate-fade-in">
          <PageHeader title="Receipt" subtitle="Payment confirmed" />
          <div className="bg-accent border border-primary/30 rounded-2xl p-5 text-center mb-4">
            <CheckCircle2 className="mx-auto text-primary mb-2" size={48} />
            <p className="text-xs text-muted-foreground">Paid to {school.name}</p>
            <p className="text-3xl font-extrabold text-secondary mt-1">{done.amt.toLocaleString()} FCFA</p>
            <p className="text-[11px] text-muted-foreground mt-1">Ref: {done.ref}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 space-y-2 text-xs mb-4">
            <Row k="Student" v={studentName} />
            <Row k="Student ID" v={studentId} />
            <Row k="Method" v={METHODS.find((m) => m.key === method)!.label} />
            <Row k="Outstanding" v={`${remaining.toLocaleString()} FCFA`} />
            <Row k="Trust Score" v="+15 pts" highlight />
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
        <PageHeader title="Pay School Fees" subtitle="Secure payments with receipts" />

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-semibold">Select School</Label>
            <Select value={schoolId} onValueChange={setSchoolId}>
              <SelectTrigger className="mt-1.5 h-12"><SelectValue placeholder="Choose a school" /></SelectTrigger>
              <SelectContent>
                {SCHOOLS.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {school && (
            <div className="bg-secondary text-secondary-foreground rounded-2xl p-4">
              <p className="text-[11px] opacity-80">Outstanding balance</p>
              <p className="text-2xl font-extrabold">{school.balance.toLocaleString()} FCFA</p>
              <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${Math.min(100, (Number(amount || 0) / school.balance) * 100)}%` }}
                />
              </div>
              <p className="text-[10px] opacity-80 mt-2">After this payment: {remaining.toLocaleString()} FCFA</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-semibold">Student Name</Label>
              <Input value={studentName} onChange={(e) => setStudentName(e.target.value)} className="mt-1.5" placeholder="Full name" />
            </div>
            <div>
              <Label className="text-sm font-semibold">Student ID</Label>
              <Input value={studentId} onChange={(e) => setStudentId(e.target.value)} className="mt-1.5" placeholder="e.g. SBC2024-019" />
            </div>
          </div>

          <div>
            <Label className="text-sm font-semibold">Amount (FCFA)</Label>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1.5 text-lg font-bold h-12" placeholder="0" />
            <label className="flex items-center gap-2 mt-2 text-xs">
              <input type="checkbox" checked={installment} onChange={(e) => setInstallment(e.target.checked)} className="accent-primary" />
              Pay in installments
            </label>
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
            Continue to Pay
          </Button>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button className="flex items-center gap-2 p-3 bg-card border border-border rounded-xl text-xs font-semibold">
              <HistoryIcon size={16} className="text-primary" /> Payment History
            </button>
            <button className="flex items-center gap-2 p-3 bg-card border border-border rounded-xl text-xs font-semibold">
              <Bell size={16} className="text-secondary" /> Auto-reminders
            </button>
          </div>
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText size={18} className="text-primary" /> Confirm payment
            </DialogTitle>
          </DialogHeader>
          <div className="text-sm space-y-2">
            <Row k="School" v={school?.name || ""} />
            <Row k="Student" v={studentName} />
            <Row k="Amount" v={`${Number(amount || 0).toLocaleString()} FCFA`} highlight />
            <Row k="Method" v={METHODS.find((m) => m.key === method)!.label} />
            {method !== "wallet" && <Row k="Phone" v={`+237 ${phone}`} />}
          </div>
          <Button onClick={confirmPay} className="w-full h-11 gradient-primary text-primary-foreground">
            Confirm & Pay
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

export default PaySchoolFees;
