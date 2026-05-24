import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Users, GraduationCap, BookOpen, Briefcase, ChevronLeft, ShieldCheck,
  FileText, Camera, IdCard, Fingerprint, AlertCircle, CheckCircle2, Building2,
} from "lucide-react";
import { setUser, setTeacherProfile, Role } from "@/lib/userStore";

type Stage = "role" | "teacher" | "kycIntro" | "kyc" | "kyb" | "done";

const LEVELS = ["Nursery", "Class 1–6", "Form 1–5", "Lower 6", "Upper 6", "Tertiary / Exams"];
const MODES = ["Online", "Onsite (home)", "Onsite (centre)", "Hybrid"];
const PAY_TIMINGS = ["After each lesson", "Pay monthly", "Advance (1 month)"];

const Onboarding = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>("role");
  const [role, setRole] = useState<Role | null>(null);

  // Teacher form
  const [subject, setSubject] = useState("");
  const [levels, setLevels] = useState<string[]>([]);
  const [exams, setExams] = useState("");
  const [modes, setModes] = useState<string[]>([]);
  const [city, setCity] = useState("");
  const [quarter, setQuarter] = useState("");
  const [rate, setRate] = useState("");
  const [monthly, setMonthly] = useState("");
  const [payTimings, setPayTimings] = useState<string[]>([]);
  const [bio, setBio] = useState("");

  // KYC
  const [docType, setDocType] = useState<"cni" | "passport" | "permit">("cni");
  const [docNumber, setDocNumber] = useState("");
  const [front, setFront] = useState(false);
  const [backImg, setBackImg] = useState(false);
  const [selfie, setSelfie] = useState(false);
  const [biometric, setBiometric] = useState(true);

  // KYB
  const [bizName, setBizName] = useState("");
  const [rccm, setRccm] = useState("");
  const [taxId, setTaxId] = useState("");
  const [bizAddress, setBizAddress] = useState("");

  const toggle = (arr: string[], v: string, set: (a: string[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const pickRole = (r: Role) => {
    setRole(r);
    setUser({ role: r });
    setStage(r === "teacher" ? "teacher" : "kycIntro");
  };

  const submitTeacher = () => {
    if (!subject.trim() || levels.length === 0 || modes.length === 0) {
      return toast.error("Fill subject, at least one level and one mode");
    }
    setTeacherProfile({ subject, levels, exams, modes, city, quarter, rate, monthly, payTimings, bio });
    setUser({ teacherProfileComplete: true });
    toast.success("Lesson profile saved — parents can now find you");
    setStage("kycIntro");
  };

  const skipTeacher = () => {
    toast.info("You can complete your lesson profile anytime from Profile");
    setStage("kycIntro");
  };

  const submitKyc = () => {
    if (!docNumber.trim()) return toast.error("Enter your document number");
    if (!front || !selfie) return toast.error("Capture the required photos");
    if (docType === "cni" && !backImg) return toast.error("Capture the back of your CNI");
    setUser({ kycComplete: true, biometricEnabled: biometric });
    toast.success("KYC submitted — your account is fully active");
    if (role === "sme") setStage("kyb");
    else setStage("done");
  };

  const skipKyc = () => {
    toast.info("KYC pending. You can deposit, save and receive — but not send or withdraw until verified.");
    setStage(role === "sme" ? "kyb" : "done");
  };

  const submitKyb = () => {
    if (!bizName.trim() || !rccm.trim() || !taxId.trim()) return toast.error("Fill business name, RCCM and Taxpayer card");
    setUser({ kybComplete: true });
    toast.success("Business verification submitted");
    setStage("done");
  };

  const skipKyb = () => { toast.info("Business verification skipped — reminder added in Profile"); setStage("done"); };

  const finish = () => navigate("/");

  const back = () => {
    if (stage === "role") return navigate("/auth");
    if (stage === "teacher") return setStage("role");
    if (stage === "kycIntro") return setStage(role === "teacher" ? "teacher" : "role");
    if (stage === "kyc") return setStage("kycIntro");
    if (stage === "kyb") return setStage("kyc");
    if (stage === "done") return setStage(role === "sme" ? "kyb" : "kyc");
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="max-w-md mx-auto px-4 pt-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={back} className="p-2 rounded-xl bg-card border border-border hover:bg-muted">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold">Set up your account</h1>
            <p className="text-xs text-muted-foreground">Takes ~3 minutes</p>
          </div>
        </div>

        {stage === "role" && (
          <section className="space-y-3">
            <div>
              <h2 className="text-base font-bold">I am a…</h2>
              <p className="text-xs text-muted-foreground">We tailor your experience to your role.</p>
            </div>
            {([
              { k: "parent", l: "Parent", d: "Pay fees, track attendance, save for kids.", I: Users },
              { k: "student", l: "Student", d: "Pay tuition, save pocket money, book tutors.", I: BookOpen },
              { k: "teacher", l: "Teacher", d: "Offer private lessons & receive payments.", I: GraduationCap },
              { k: "sme", l: "Business / SME", d: "Payroll, supplier payments, business loans.", I: Briefcase },
            ] as { k: Role; l: string; d: string; I: any }[]).map((r) => (
              <button key={r.k} onClick={() => pickRole(r.k)}
                className="w-full flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition text-left">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><r.I size={20} /></div>
                <div className="flex-1">
                  <p className="text-sm font-bold">{r.l}</p>
                  <p className="text-[11px] text-muted-foreground">{r.d}</p>
                </div>
              </button>
            ))}
          </section>
        )}

        {stage === "teacher" && (
          <section className="space-y-4">
            <div className="bg-accent/50 border border-primary/20 rounded-xl p-3">
              <p className="text-xs font-bold text-secondary">Boost your income 💰</p>
              <p className="text-[11px] text-muted-foreground">Fill your lesson profile — parents are already browsing Eduvest for verified tutors.</p>
            </div>

            <div>
              <Label className="text-xs font-bold">Subject</Label>
              <Input placeholder="e.g. Mathematics" value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1.5" />
            </div>

            <div>
              <Label className="text-xs font-bold mb-2 block">Levels you teach</Label>
              <div className="grid grid-cols-2 gap-2">
                {LEVELS.map((l) => (
                  <label key={l} className={`flex items-center gap-2 p-2 rounded-lg border text-[11px] cursor-pointer ${levels.includes(l) ? "border-primary bg-primary/5" : "border-border"}`}>
                    <Checkbox checked={levels.includes(l)} onCheckedChange={() => toggle(levels, l, setLevels)} />
                    {l}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold">Exams (optional)</Label>
              <Input placeholder="GCE O/L, A/L, Probatoire, IELTS…" value={exams} onChange={(e) => setExams(e.target.value)} className="mt-1.5" />
            </div>

            <div>
              <Label className="text-xs font-bold mb-2 block">Teaching mode</Label>
              <div className="grid grid-cols-2 gap-2">
                {MODES.map((m) => (
                  <label key={m} className={`flex items-center gap-2 p-2 rounded-lg border text-[11px] cursor-pointer ${modes.includes(m) ? "border-primary bg-primary/5" : "border-border"}`}>
                    <Checkbox checked={modes.includes(m)} onCheckedChange={() => toggle(modes, m, setModes)} />
                    {m}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-bold">City</Label>
                <Input placeholder="Yaoundé" value={city} onChange={(e) => setCity(e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label className="text-xs font-bold">Quarter</Label>
                <Input placeholder="Bastos" value={quarter} onChange={(e) => setQuarter(e.target.value)} className="mt-1.5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-bold">Rate per hour (FCFA)</Label>
                <Input type="number" placeholder="5000" value={rate} onChange={(e) => setRate(e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label className="text-xs font-bold">Monthly (optional)</Label>
                <Input type="number" placeholder="35000" value={monthly} onChange={(e) => setMonthly(e.target.value)} className="mt-1.5" />
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold mb-2 block">Payment timing</Label>
              <div className="space-y-2">
                {PAY_TIMINGS.map((p) => (
                  <label key={p} className={`flex items-center gap-2 p-2 rounded-lg border text-[11px] cursor-pointer ${payTimings.includes(p) ? "border-primary bg-primary/5" : "border-border"}`}>
                    <Checkbox checked={payTimings.includes(p)} onCheckedChange={() => toggle(payTimings, p, setPayTimings)} />
                    {p}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold">Short bio</Label>
              <Textarea placeholder="Your experience, qualifications, approach…" value={bio} onChange={(e) => setBio(e.target.value)} className="mt-1.5" rows={3} />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={skipTeacher} className="flex-1 h-12">Skip for now</Button>
              <Button onClick={submitTeacher} className="flex-1 h-12 gradient-primary text-primary-foreground font-bold">Save & continue</Button>
            </div>
            <p className="text-[10px] text-muted-foreground text-center">You can edit this anytime from Profile › Lesson profile.</p>
          </section>
        )}

        {stage === "kycIntro" && (
          <section className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center mb-3">
                <ShieldCheck size={28} />
              </div>
              <h2 className="text-lg font-extrabold">Let's verify your identity</h2>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Cameroon law (COBAC / ANTIC) requires us to know who you are before you move money.
                Verification protects your wallet against fraud and unlocks every Eduvest feature.
              </p>
            </div>

            <div className="bg-warning/10 border border-warning/30 rounded-xl p-3">
              <p className="text-xs font-bold text-foreground flex items-center gap-2">
                <Camera size={14} className="text-warning" /> Prepare these documents to snap:
              </p>
              <ul className="text-[11px] mt-2 space-y-1 text-muted-foreground">
                <li>• Your <b>National ID (CNI)</b> — front and back, OR Passport / Residence permit</li>
                <li>• A clear <b>selfie</b> (good lighting, no cap or sunglasses)</li>
                {role === "sme" && <li>• Business docs: <b>RCCM</b> + <b>Taxpayer card (NIU)</b></li>}
              </ul>
              <p className="text-[10px] text-muted-foreground mt-2">Tip: clean the camera lens and place the ID on a dark, flat surface.</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-3 space-y-2">
              <p className="text-xs font-bold">What you can do without KYC</p>
              <p className="text-[11px] text-success">✓ Deposit / Top up · ✓ Save · ✓ Receive money</p>
              <p className="text-[11px] text-destructive">✗ Send money · ✗ Withdraw</p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={skipKyc} className="flex-1 h-12">Skip for now</Button>
              <Button onClick={() => setStage("kyc")} className="flex-1 h-12 gradient-primary text-primary-foreground font-bold">I'm ready</Button>
            </div>
          </section>
        )}

        {stage === "kyc" && (
          <section className="space-y-4">
            <div>
              <h2 className="text-base font-bold flex items-center gap-2"><IdCard size={18} className="text-primary" /> Identity verification</h2>
              <p className="text-xs text-muted-foreground">Cameroon KYC — all data encrypted.</p>
            </div>

            <div>
              <Label className="text-xs font-bold mb-2 block">Document type</Label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { k: "cni", l: "CNI" },
                  { k: "passport", l: "Passport" },
                  { k: "permit", l: "Residence" },
                ] as const).map((d) => (
                  <button key={d.k} onClick={() => setDocType(d.k)}
                    className={`p-2 rounded-lg border text-xs font-bold ${docType === d.k ? "border-primary bg-primary/5 text-primary" : "border-border"}`}>
                    {d.l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold">Document number</Label>
              <Input placeholder={docType === "cni" ? "CNI N°" : docType === "passport" ? "Passport N°" : "Permit N°"}
                value={docNumber} onChange={(e) => setDocNumber(e.target.value.toUpperCase())} className="mt-1.5" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <PhotoBtn label={docType === "cni" ? "Front of CNI" : "Document photo"} captured={front} onClick={() => setFront(true)} />
              {docType === "cni" && <PhotoBtn label="Back of CNI" captured={backImg} onClick={() => setBackImg(true)} />}
              <PhotoBtn label="Selfie" captured={selfie} onClick={() => setSelfie(true)} />
            </div>

            <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${biometric ? "border-primary bg-primary/5" : "border-border"}`}>
              <Checkbox checked={biometric} onCheckedChange={(v) => setBiometric(!!v)} />
              <div className="flex-1">
                <p className="text-xs font-bold flex items-center gap-1"><Fingerprint size={14} className="text-primary" /> Enable biometric (fingerprint / Face ID)</p>
                <p className="text-[10px] text-muted-foreground">Used to unlock the app and approve big payments.</p>
              </div>
            </label>

            <div className="flex gap-2">
              <Button variant="outline" onClick={skipKyc} className="flex-1 h-12">Skip</Button>
              <Button onClick={submitKyc} className="flex-1 h-12 gradient-primary text-primary-foreground font-bold">Submit</Button>
            </div>
          </section>
        )}

        {stage === "kyb" && (
          <section className="space-y-4">
            <div>
              <h2 className="text-base font-bold flex items-center gap-2"><Building2 size={18} className="text-primary" /> Business verification (KYB)</h2>
              <p className="text-xs text-muted-foreground">Required to run payroll and access SME loans.</p>
            </div>
            <div>
              <Label className="text-xs font-bold">Business / School name</Label>
              <Input value={bizName} onChange={(e) => setBizName(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label className="text-xs font-bold">RCCM number</Label>
              <Input placeholder="RC/YAE/2024/B/XXXX" value={rccm} onChange={(e) => setRccm(e.target.value.toUpperCase())} className="mt-1.5" />
            </div>
            <div>
              <Label className="text-xs font-bold">Taxpayer card (NIU)</Label>
              <Input value={taxId} onChange={(e) => setTaxId(e.target.value.toUpperCase())} className="mt-1.5" />
            </div>
            <div>
              <Label className="text-xs font-bold">Business address</Label>
              <Textarea rows={2} value={bizAddress} onChange={(e) => setBizAddress(e.target.value)} className="mt-1.5" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={skipKyb} className="flex-1 h-12">Skip</Button>
              <Button onClick={submitKyb} className="flex-1 h-12 gradient-primary text-primary-foreground font-bold">Submit business</Button>
            </div>
          </section>
        )}

        {stage === "done" && (
          <section className="space-y-4 text-center">
            <div className="w-20 h-20 rounded-full bg-success/10 text-success mx-auto flex items-center justify-center">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-xl font-extrabold">You're all set!</h2>
            <p className="text-xs text-muted-foreground">
              Welcome to Eduvest. Anything you skipped is waiting for you in your <b>Profile</b>.
            </p>
            <div className="bg-muted/40 rounded-xl p-3 text-left text-[11px] space-y-1">
              <p className="flex items-center gap-2"><AlertCircle size={12} className="text-warning" /> Skipped items show a yellow reminder badge.</p>
              <p className="flex items-center gap-2"><FileText size={12} className="text-primary" /> Complete KYC to unlock <b>Send</b> & <b>Withdraw</b>.</p>
            </div>
            <Button onClick={finish} className="w-full h-12 gradient-primary text-primary-foreground font-bold">Go to my dashboard</Button>
          </section>
        )}
      </div>
    </div>
  );
};

const PhotoBtn = ({ label, captured, onClick }: { label: string; captured: boolean; onClick: () => void }) => (
  <button onClick={onClick}
    className={`p-3 rounded-xl border-2 border-dashed flex flex-col items-center gap-1 ${captured ? "border-success bg-success/5" : "border-border bg-card hover:border-primary"}`}>
    {captured ? <CheckCircle2 size={22} className="text-success" /> : <Camera size={22} className="text-muted-foreground" />}
    <span className="text-[11px] font-bold">{label}</span>
    <span className="text-[9px] text-muted-foreground">{captured ? "Captured" : "Tap to snap"}</span>
  </button>
);

export default Onboarding;
