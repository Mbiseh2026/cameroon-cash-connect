import PageHeader from "@/components/PageHeader";
import { GraduationCap, Star, Calendar as CalendarIcon, Search, BadgeCheck, Video, MapPin, CheckCircle2, Baby, BookOpen, School, University, ChevronLeft, ChevronDown, ChevronUp, Home as HomeIcon, Building2, Globe2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

const CATEGORIES = [
  { key: "nursery", label: "Nursery School", desc: "Ages 2–5 · Foundational play-based learning", icon: Baby },
  { key: "primary", label: "Primary School", desc: "Class 1–6 · Core literacy & numeracy", icon: BookOpen },
  { key: "secondary", label: "Secondary School", desc: "Form 1–5 · Subject teachers", icon: School },
  { key: "high", label: "High School", desc: "Lower & Upper 6 · GCE / Bac prep", icon: GraduationCap },
  { key: "tertiary", label: "Tertiary / Exams (TOEFL, IELTS, TCF)", desc: "University coaching & exam prep", icon: University },
] as const;
type CatKey = typeof CATEGORIES[number]["key"];

type Mode = "home" | "center" | "online" | "hybrid";
type PayMethod = "momo" | "bank" | "cash";

interface Teacher {
  id: string;
  name: string;
  subject: string;
  levels: string[];         // shown BEFORE reviews
  exams?: string[];
  city: string;
  quarter: string;
  modes: Mode[];
  rate: number;             // per-hour
  monthly?: number;         // monthly rate at a centre / evening school
  installments?: string;    // e.g. "2 or 3 installments"
  payments: PayMethod[];
  payTimings: string[];     // when payment due
  kycVerified: boolean;
  rating: number;
  reviews: { author: string; comment: string; stars: number }[];
  slots: string[];
  bio: string;
}

const TEACHERS: Teacher[] = [
  {
    id: "t1", name: "Mme Ngono", subject: "Mathematics",
    levels: ["Form 1–5", "Lower 6", "Upper 6"],
    exams: ["GCE O/L", "GCE A/L", "Probatoire"],
    city: "Yaoundé", quarter: "Bastos",
    modes: ["home", "online", "hybrid"],
    rate: 5000, monthly: 35000, installments: "Pay monthly or 2 installments",
    payments: ["momo", "bank", "cash"],
    payTimings: ["Pay monthly", "After each lesson", "Advance (1 month)"],
    kycVerified: true,
    rating: 4.9,
    reviews: [
      { author: "Mr. Bertrand (parent)", stars: 5, comment: "My son's marks improved in 2 months." },
      { author: "Linda (parent)", stars: 5, comment: "Patient and very professional." },
    ],
    slots: ["Mon 4pm", "Tue 5pm", "Wed 4pm", "Sat 10am"],
    bio: "10+ years teaching Maths. Specialises in GCE A/L Pure Maths & Statistics.",
  },
  {
    id: "t2", name: "Mr. Tabi", subject: "Physics & Chemistry",
    levels: ["Form 4–5", "Lower 6", "Upper 6"],
    exams: ["GCE O/L", "GCE A/L"],
    city: "Douala", quarter: "Bonamoussadi",
    modes: ["home", "center", "online"],
    rate: 6000, monthly: 40000, installments: "Monthly or holiday-school package",
    payments: ["momo", "bank"],
    payTimings: ["Pay monthly", "Advance"],
    kycVerified: true,
    rating: 4.8,
    reviews: [{ author: "Esther (parent)", stars: 5, comment: "Explains concepts very clearly." }],
    slots: ["Mon 6pm", "Thu 5pm", "Sat 2pm"],
    bio: "MSc Physics, ENS graduate. Runs a small evening centre in Bonamoussadi.",
  },
  {
    id: "t3", name: "Mme Achu", subject: "English & Literature",
    levels: ["Nursery", "Class 1–6"],
    exams: ["Common Entrance"],
    city: "Buea", quarter: "Molyko",
    modes: ["home", "online"],
    rate: 4500, installments: "Pay after each lesson",
    payments: ["momo", "cash"],
    payTimings: ["After each lesson"],
    kycVerified: false,
    rating: 4.7,
    reviews: [{ author: "Joseph (parent)", stars: 4, comment: "Great with younger kids." }],
    slots: ["Tue 4pm", "Fri 5pm"],
    bio: "Primary school teacher with 6 years' experience.",
  },
  {
    id: "t4", name: "Mr. Fombu", subject: "Computer Science / Coding & Exam Prep",
    levels: ["Form 4–5", "Lower 6", "Upper 6", "University"],
    exams: ["TOEFL", "IELTS", "TCF"],
    city: "Yaoundé", quarter: "Etoug-Ebe",
    modes: ["online", "hybrid"],
    rate: 8000, monthly: 60000, installments: "Monthly or holiday intensive",
    payments: ["momo", "bank"],
    payTimings: ["Pay monthly", "Advance"],
    kycVerified: true,
    rating: 5.0,
    reviews: [{ author: "Achille (student)", stars: 5, comment: "Built my first app with him!" }],
    slots: ["Wed 6pm", "Sat 11am", "Sun 3pm"],
    bio: "Software engineer · IELTS 8.0 · Helps students with coding & study-abroad prep.",
  },
];

const MODE_META: Record<Mode, { label: string; icon: any }> = {
  home: { label: "Home visit", icon: HomeIcon },
  center: { label: "At my centre", icon: Building2 },
  online: { label: "Online", icon: Globe2 },
  hybrid: { label: "Hybrid", icon: Video },
};

const PAY_META: Record<PayMethod, string> = {
  momo: "MTN / Orange MoMo",
  bank: "Direct bank transfer",
  cash: "Cash (after lesson)",
};

const BookLessons = () => {
  const [category, setCategory] = useState<CatKey | null>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Teacher | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [mode, setMode] = useState<Mode>("online");
  const [slot, setSlot] = useState("");
  const [payment, setPayment] = useState<PayMethod>("momo"); // default = MoMo
  const [payTiming, setPayTiming] = useState("");
  const [confirmed, setConfirmed] = useState<null | { teacher: Teacher; slot: string; mode: Mode }>(null);

  const [requestOpen, setRequestOpen] = useState(false);
  const [reqSubject, setReqSubject] = useState("");
  const [reqDetails, setReqDetails] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TEACHERS;
    return TEACHERS.filter((t) => t.name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q));
  }, [query]);

  const book = () => {
    if (!active || !slot) return toast.error("Pick a time slot");
    if (!payTiming) return toast.error("Choose when to pay");
    setConfirmed({ teacher: active, slot, mode });
    setActive(null); setShowDetails(false); setSlot(""); setPayTiming("");
    toast.success("Lesson booked");
  };

  const submitRequest = () => {
    if (!reqSubject.trim()) return toast.error("Tell us the subject you need");
    setRequestOpen(false);
    setReqSubject(""); setReqDetails("");
    toast.success("Request sent — we'll match you with a tutor.");
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="max-w-md mx-auto px-4 pt-6 animate-fade-in">
          <PageHeader title="Book Lessons" subtitle="Pick a level to start" />
          <div className="bg-accent rounded-2xl p-4 mb-4">
            <p className="text-xs font-bold text-secondary mb-1">Choose your child's level</p>
            <p className="text-[11px] text-muted-foreground">We'll show verified teachers matching that level.</p>
          </div>
          <div className="space-y-2">
            {CATEGORIES.map((c) => (
              <button key={c.key} onClick={() => setCategory(c.key)}
                className="w-full flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:shadow-sm transition text-left">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><c.icon size={22} /></div>
                <div className="flex-1">
                  <p className="font-bold text-sm">{c.label}</p>
                  <p className="text-[11px] text-muted-foreground">{c.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const catLabel = CATEGORIES.find((c) => c.key === category)!.label;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-4 pt-6 animate-fade-in">
        <PageHeader title="Book Lessons" subtitle={catLabel} />
        <button onClick={() => setCategory(null)} className="flex items-center gap-1 text-xs font-semibold text-primary mb-3">
          <ChevronLeft size={14} /> Change level
        </button>

        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder='Search "Math Teacher", "Physics"…' className="pl-9 h-11" />
        </div>

        <div className="space-y-3">
          {filtered.map((t) => (
            <div key={t.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                  {t.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="font-bold text-sm">{t.name}</p>
                    {t.kycVerified && (
                      <span title="KYC verified" className="inline-flex items-center gap-0.5 text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                        <BadgeCheck size={11} /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{t.subject}</p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1"><MapPin size={10} /> {t.quarter}, {t.city}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-primary">{t.rate.toLocaleString()} FCFA/hr</p>
                  {t.monthly && <p className="text-[10px] text-muted-foreground">{t.monthly.toLocaleString()}/mo</p>}
                </div>
              </div>
              <Button onClick={() => { setActive(t); setShowDetails(false); setMode(t.modes[0]); setSlot(""); setPayment(t.payments[0] || "momo"); setPayTiming(""); }}
                className="w-full h-9 text-xs">
                <CalendarIcon size={14} className="mr-1.5" /> Book a lesson
              </Button>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-xs text-muted-foreground py-8">No teachers match your search.</p>
          )}
        </div>

        {/* Request a tutor */}
        <button onClick={() => setRequestOpen(true)}
          className="mt-5 w-full p-4 rounded-xl border border-dashed border-primary/40 text-left hover:bg-primary/5 transition flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><Send size={18} /></div>
          <div className="flex-1">
            <p className="text-sm font-bold">Didn't see a tutor?</p>
            <p className="text-[11px] text-muted-foreground">Tell us what you need — we'll match you within 48 hrs.</p>
          </div>
          <span className="text-xs font-bold text-primary">Request</span>
        </button>
      </div>

      {/* Booking dialog */}
      <Dialog open={!!active} onOpenChange={(o) => { if (!o) { setActive(null); setShowDetails(false); } }}>
        <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto">
          {active && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {active.name}
                  {active.kycVerified && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                      <BadgeCheck size={11} /> Verified
                    </span>
                  )}
                </DialogTitle>
              </DialogHeader>
              <p className="text-xs text-muted-foreground -mt-2">{active.subject}</p>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1 -mt-1"><MapPin size={11} /> {active.quarter}, {active.city}</p>

              {/* Levels & exams — BEFORE reviews */}
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-[11px] font-bold mb-1">Levels taught</p>
                <div className="flex flex-wrap gap-1">
                  {active.levels.map((l) => (
                    <span key={l} className="text-[10px] font-semibold bg-card border border-border px-2 py-0.5 rounded-full">{l}</span>
                  ))}
                </div>
                {active.exams && active.exams.length > 0 && (
                  <>
                    <p className="text-[11px] font-bold mt-2 mb-1">Exam focus</p>
                    <div className="flex flex-wrap gap-1">
                      {active.exams.map((e) => (
                        <span key={e} className="text-[10px] font-semibold bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">{e}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* View more details */}
              <button onClick={() => setShowDetails(!showDetails)} className="flex items-center justify-center gap-1 text-xs font-semibold text-primary">
                {showDetails ? <>Hide details <ChevronUp size={14} /></> : <>View more details <ChevronDown size={14} /></>}
              </button>

              {showDetails && (
                <div className="space-y-3 animate-fade-in">
                  <div className="bg-card border border-border rounded-lg p-3 text-xs">
                    <p className="font-bold mb-1">About</p>
                    <p className="text-muted-foreground">{active.bio}</p>
                  </div>

                  <div className="bg-card border border-border rounded-lg p-3 text-xs space-y-1">
                    <p className="font-bold">Transparent pricing</p>
                    <div className="flex justify-between"><span className="text-muted-foreground">Per hour</span><span className="font-semibold">{active.rate.toLocaleString()} FCFA</span></div>
                    {active.monthly && (<div className="flex justify-between"><span className="text-muted-foreground">Monthly (centre)</span><span className="font-semibold">{active.monthly.toLocaleString()} FCFA</span></div>)}
                    {active.installments && (<div className="flex justify-between"><span className="text-muted-foreground">Installments</span><span className="font-semibold">{active.installments}</span></div>)}
                  </div>

                  <div className="bg-card border border-border rounded-lg p-3 text-xs">
                    <p className="font-bold mb-1">Accepted payment</p>
                    <div className="flex flex-wrap gap-1">
                      {active.payments.map((p) => (
                        <span key={p} className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">{PAY_META[p]}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Mode */}
              <div>
                <p className="text-xs font-bold mb-2">Mode</p>
                <div className="grid grid-cols-2 gap-2">
                  {active.modes.map((m) => {
                    const M = MODE_META[m];
                    return (
                      <button key={m} onClick={() => setMode(m)}
                        className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-semibold ${mode === m ? "border-primary bg-primary/5 text-primary" : "border-border"}`}>
                        <M.icon size={14} /> {M.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slots */}
              <div>
                <p className="text-xs font-bold mb-2">Available time slots</p>
                <div className="grid grid-cols-2 gap-2">
                  {active.slots.map((s) => (
                    <button key={s} onClick={() => setSlot(s)}
                      className={`p-2.5 rounded-lg border text-xs font-semibold ${slot === s ? "border-primary bg-primary/5 text-primary" : "border-border"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment method (MoMo / Bank default) */}
              <div>
                <p className="text-xs font-bold mb-2">Payment method</p>
                <div className="grid grid-cols-3 gap-2">
                  {active.payments.map((p) => (
                    <button key={p} onClick={() => setPayment(p)}
                      className={`p-2 rounded-lg border text-[11px] font-semibold ${payment === p ? "border-primary bg-primary/5 text-primary" : "border-border"}`}>
                      {PAY_META[p]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pay timing */}
              <div>
                <p className="text-xs font-bold mb-2">When to pay</p>
                <div className="grid grid-cols-1 gap-2">
                  {active.payTimings.map((t) => (
                    <button key={t} onClick={() => setPayTiming(t)}
                      className={`p-2 rounded-lg border text-[11px] font-semibold text-left ${payTiming === t ? "border-primary bg-primary/5 text-primary" : "border-border"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reviews — AFTER level/exams */}
              <div>
                <p className="text-xs font-bold mb-2">Parent reviews</p>
                <div className="space-y-2">
                  {active.reviews.map((r, i) => (
                    <div key={i} className="bg-muted rounded-lg p-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold">{r.author}</span>
                        <span className="text-[11px] text-warning flex items-center gap-0.5"><Star size={10} fill="currentColor" /> {r.stars}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-accent rounded-xl p-3 flex justify-between items-center">
                <span className="text-xs">Total ({MODE_META[mode].label})</span>
                <span className="text-base font-extrabold text-primary">
                  {(active.rate + (mode === "home" ? 1000 : 0)).toLocaleString()} FCFA
                </span>
              </div>

              <Button onClick={book} className="w-full h-11 gradient-primary text-primary-foreground">
                {payment === "cash" ? "Confirm booking · Pay after lesson" : "Pay & Confirm Booking"}
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation */}
      <Dialog open={!!confirmed} onOpenChange={(o) => { if (!o) setConfirmed(null); }}>
        <DialogContent className="max-w-sm text-center">
          {confirmed && (
            <>
              <DialogHeader><DialogTitle className="text-center">Lesson confirmed</DialogTitle></DialogHeader>
              <CheckCircle2 className="mx-auto text-primary" size={56} />
              <p className="text-sm">
                Your lesson with <b>{confirmed.teacher.name}</b> is booked for <b>{confirmed.slot}</b> ({MODE_META[confirmed.mode].label}).
              </p>
              <p className="text-[11px] text-muted-foreground">A reminder will be sent 30 mins before the lesson.</p>
              <Button onClick={() => setConfirmed(null)} className="gradient-primary text-primary-foreground">Done</Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Request a tutor dialog */}
      <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Request a tutor</DialogTitle>
            <DialogDescription>Tell us what you need — we'll match you with a verified teacher.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-semibold">Subject / Exam</Label>
              <Input value={reqSubject} onChange={(e) => setReqSubject(e.target.value)} placeholder="e.g. Maths · Upper 6" className="mt-1 h-11" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Details (optional)</Label>
              <Textarea value={reqDetails} onChange={(e) => setReqDetails(e.target.value)} rows={3} placeholder="Preferred time, mode, budget…" className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRequestOpen(false)}>Cancel</Button>
            <Button onClick={submitRequest} className="gradient-primary text-primary-foreground">Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookLessons;
