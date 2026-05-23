import PageHeader from "@/components/PageHeader";
import Stepper from "@/components/Stepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { downloadReceipt, genRef } from "@/lib/receipt";
import { CheckCircle2, Download, ChevronLeft, PlusCircle } from "lucide-react";

interface School { id: string; name: string; balance?: number; logoUrl?: string; }
const SCHOOLS: School[] = [
  { id: "saker", name: "Saker Baptist College", balance: 250000 },
  { id: "sasse", name: "St Joseph's College Sasse", balance: 180000 },
  { id: "lyceebil", name: "Lycée Bilingue de Yaoundé" }, // no balance in DB
  { id: "buea-uni", name: "University of Buea", balance: 420000 },
];

const LEVELS = [
  { key: "nursery", label: "Nursery" },
  { key: "primary", label: "Primary" },
  { key: "secondary", label: "Secondary" },
  { key: "high", label: "High School" },
  { key: "tertiary", label: "Tertiary / University" },
] as const;
type LevelKey = typeof LEVELS[number]["key"];

const METHODS = [
  { key: "mtn", label: "MTN MoMo" },
  { key: "orange", label: "Orange Money" },
  { key: "wallet", label: "Eduvest Wallet" },
] as const;
type Method = typeof METHODS[number]["key"];

const STEPS = ["School", "Level", "Student", "Amount", "Pay"];

const PaySchoolFees = () => {
  const [step, setStep] = useState(0);

  // Step 1
  const [schoolId, setSchoolId] = useState("");
  const [manualMode, setManualMode] = useState(false);
  const [manualSchool, setManualSchool] = useState("");
  // Step 2
  const [level, setLevel] = useState<LevelKey | "">("");
  // Step 3
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [classOrYear, setClassOrYear] = useState("");
  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
  // Step 4
  const [amount, setAmount] = useState("");
  const [installment, setInstallment] = useState(false);
  // Step 5
  const [method, setMethod] = useState<Method>("mtn");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");

  const [done, setDone] = useState<null | { ref: string; amt: number }>(null);

  const school: School | undefined = useMemo(() => {
    if (manualMode) return manualSchool ? { id: "manual", name: manualSchool } : undefined;
    return SCHOOLS.find((s) => s.id === schoolId);
  }, [schoolId, manualMode, manualSchool]);

  const isTertiary = level === "tertiary";
  const showFaculty = isTertiary;
  const classLabel = isTertiary ? "Year / Level" : level === "high" ? "Class (e.g. Upper 6 Sci)" : "Class";
  const hasBalance = typeof school?.balance === "number";
  const remaining = hasBalance ? Math.max(0, (school!.balance || 0) - Number(amount || 0)) : 0;

  const validateStep = (): boolean => {
    if (step === 0) {
      if (manualMode) {
        if (!manualSchool.trim()) { toast.error("Enter the school name"); return false; }
      } else if (!schoolId) { toast.error("Select a school"); return false; }
    }
    if (step === 1 && !level) { toast.error("Select level of education"); return false; }
    if (step === 2) {
      if (!studentName.trim()) { toast.error("Enter student name"); return false; }
      if (!studentId.trim()) { toast.error("Enter student ID"); return false; }
      if (!classOrYear.trim()) { toast.error(`Enter ${classLabel.toLowerCase()}`); return false; }
      if (showFaculty && (!faculty.trim() || !department.trim())) { toast.error("Enter faculty and department"); return false; }
    }
    if (step === 3 && (!amount || Number(amount) < 500)) { toast.error("Minimum 500 FCFA"); return false; }
    if (step === 4) {
      if (method !== "wallet" && !/^\d{9}$/.test(phone)) { toast.error("Enter a valid 9-digit number"); return false; }
      if (pin.length !== 4) { toast.error("Enter your 4-digit PIN"); return false; }
    }
    return true;
  };

  const next = () => { if (validateStep()) setStep((s) => Math.min(s + 1, STEPS.length - 1)); };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const pay = () => {
    if (!validateStep()) return;
    const ref = genRef("FEE");
    setDone({ ref, amt: Number(amount) });
    toast.success("Payment successful — Trust Score updated");
  };

  const levelLabel = LEVELS.find((l) => l.key === level)?.label || "";

  const downloadPdf = () => {
    if (!done || !school) return;
    const rows = [
      { label: "School", value: school.name },
      { label: "Level", value: levelLabel },
      { label: "Student", value: studentName },
      { label: "Student ID", value: studentId },
      { label: classLabel, value: classOrYear },
    ];
    if (showFaculty) {
      rows.push({ label: "Faculty", value: faculty });
      rows.push({ label: "Department", value: department });
    }
    rows.push({ label: "Method", value: METHODS.find((m) => m.key === method)!.label });
    if (hasBalance) {
      rows.push({ label: "Outstanding before", value: `${school.balance!.toLocaleString()} FCFA` });
      rows.push({ label: "Outstanding after", value: `${remaining.toLocaleString()} FCFA` });
    }
    rows.push({ label: "Plan", value: installment ? "Installment" : "Full payment" });
    downloadReceipt({
      title: "School Fees Receipt",
      reference: done.ref,
      amount: `${done.amt.toLocaleString()} FCFA`,
      rows,
      logoUrl: school.logoUrl,
      organization: school.name,
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
            <Row k="Level" v={levelLabel} />
            <Row k="Student" v={studentName} />
            <Row k="Student ID" v={studentId} />
            <Row k={classLabel} v={classOrYear} />
            {showFaculty && <Row k="Faculty" v={faculty} />}
            {showFaculty && <Row k="Department" v={department} />}
            <Row k="Method" v={METHODS.find((m) => m.key === method)!.label} />
            {hasBalance && <Row k="Outstanding" v={`${remaining.toLocaleString()} FCFA`} />}
            <Row k="Trust Score" v="+15 pts" highlight />
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
        <PageHeader title="Pay School Fees" subtitle={`Step ${step + 1} of ${STEPS.length}`} />
        <Stepper steps={STEPS} current={step} />

        {step === 0 && (
          <div className="space-y-4">
            {!manualMode ? (
              <>
                <div>
                  <Label className="text-sm font-semibold">Select School</Label>
                  <Select value={schoolId} onValueChange={setSchoolId}>
                    <SelectTrigger className="mt-1.5 h-12"><SelectValue placeholder="Choose a school" /></SelectTrigger>
                    <SelectContent>
                      {SCHOOLS.map((s) => (<SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <button onClick={() => { setManualMode(true); setSchoolId(""); }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-dashed border-primary/40 text-left hover:bg-primary/5 transition">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><PlusCircle size={20} /></div>
                  <div>
                    <p className="text-xs font-bold">School not listed?</p>
                    <p className="text-[11px] text-muted-foreground">Type the school name manually — you can still pay even if it hasn't joined Eduvest.</p>
                  </div>
                </button>
              </>
            ) : (
              <div className="space-y-2">
                <Label className="text-sm font-semibold">School name</Label>
                <Input value={manualSchool} onChange={(e) => setManualSchool(e.target.value)} className="h-12" placeholder="e.g. GBHS Etoug-Ebe" />
                <button onClick={() => { setManualMode(false); setManualSchool(""); }} className="text-[11px] font-semibold text-primary">← Choose from list instead</button>
              </div>
            )}

            {school && hasBalance && (
              <div className="bg-secondary text-secondary-foreground rounded-2xl p-4">
                <p className="text-[11px] opacity-80">Outstanding balance</p>
                <p className="text-2xl font-extrabold">{school.balance!.toLocaleString()} FCFA</p>
              </div>
            )}
            {school && !hasBalance && (
              <div className="bg-muted rounded-xl p-3 text-[11px] text-muted-foreground">
                No outstanding balance found in our records. You can still pay any amount below.
              </div>
            )}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <Label className="text-sm font-semibold mb-2 block">Level of education</Label>
            <div className="grid grid-cols-2 gap-2">
              {LEVELS.map((l) => (
                <button key={l.key} onClick={() => setLevel(l.key)}
                  className={`p-4 rounded-xl border text-sm font-semibold ${level === l.key ? "border-primary bg-primary/5 text-primary" : "border-border bg-card"}`}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
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
              <Label className="text-sm font-semibold">{classLabel}</Label>
              <Input value={classOrYear} onChange={(e) => setClassOrYear(e.target.value)} className="mt-1.5" placeholder={isTertiary ? "Year 2" : "Form 4 / Class CE2"} />
            </div>
            {showFaculty && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm font-semibold">Faculty</Label>
                  <Input value={faculty} onChange={(e) => setFaculty(e.target.value)} className="mt-1.5" placeholder="e.g. Science" />
                </div>
                <div>
                  <Label className="text-sm font-semibold">Department</Label>
                  <Input value={department} onChange={(e) => setDepartment(e.target.value)} className="mt-1.5" placeholder="e.g. Computer Science" />
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            {school && hasBalance && (
              <div className="bg-secondary text-secondary-foreground rounded-2xl p-4">
                <p className="text-[11px] opacity-80">Outstanding balance</p>
                <p className="text-2xl font-extrabold">{school.balance!.toLocaleString()} FCFA</p>
                <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all" style={{ width: `${Math.min(100, (Number(amount || 0) / school.balance!) * 100)}%` }} />
                </div>
                <p className="text-[10px] opacity-80 mt-2">After this payment: {remaining.toLocaleString()} FCFA</p>
              </div>
            )}
            <div>
              <Label className="text-sm font-semibold">Amount (FCFA)</Label>
              <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1.5 text-lg font-bold h-12" placeholder="0" />
              <label className="flex items-center gap-2 mt-2 text-xs">
                <input type="checkbox" checked={installment} onChange={(e) => setInstallment(e.target.checked)} className="accent-primary" />
                Pay in installments
              </label>
            </div>
          </div>
        )}

        {step === 4 && (
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
                  <Input type="tel" inputMode="numeric" maxLength={9} placeholder="6XX XXX XXX"
                    value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} className="h-12" />
                </div>
              </div>
            )}
            <div>
              <Label className="text-sm font-semibold">PIN Code</Label>
              <Input type="password" maxLength={4} value={pin} onChange={(e) => setPin(e.target.value)} placeholder="••••" className="mt-1.5 text-center text-xl tracking-[1em] h-12" />
            </div>
            <div className="bg-muted rounded-xl p-3 text-xs space-y-1">
              <Row k="School" v={school?.name || ""} />
              <Row k="Level" v={levelLabel} />
              <Row k="Student" v={studentName} />
              <Row k={classLabel} v={classOrYear} />
              {showFaculty && <Row k="Faculty / Dept" v={`${faculty} / ${department}`} />}
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
            <Button onClick={pay} className="flex-1 h-12 gradient-primary text-primary-foreground font-bold">Pay Now</Button>
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

export default PaySchoolFees;
