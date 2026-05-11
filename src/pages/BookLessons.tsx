import PageHeader from "@/components/PageHeader";
import { GraduationCap, Star, Calendar as CalendarIcon, Search, BadgeCheck, Video, MapPin, CheckCircle2, Baby, BookOpen, School, University, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const CATEGORIES = [
  { key: "nursery", label: "Nursery School", desc: "Ages 2–5 · Foundational play-based learning", icon: Baby },
  { key: "primary", label: "Primary School", desc: "Class 1–6 · Core literacy & numeracy", icon: BookOpen },
  { key: "secondary", label: "Secondary School", desc: "Form 1–5 · Subject teachers", icon: School },
  { key: "high", label: "High School", desc: "Lower & Upper 6 · GCE / Bac prep", icon: GraduationCap },
  { key: "tertiary", label: "Tertiary / Higher Institute", desc: "University & college coaching", icon: University },
] as const;
type CatKey = typeof CATEGORIES[number]["key"];

interface Teacher {
  id: string;
  name: string;
  subject: string;
  rate: number;
  rating: number;
  reviews: { author: string; comment: string; stars: number }[];
  verified: boolean;
  slots: string[];
}

const TEACHERS: Teacher[] = [
  {
    id: "t1", name: "Mme Ngono", subject: "Mathematics — Grade 10-12", rate: 5000, rating: 4.9, verified: true,
    slots: ["Mon 4pm", "Tue 5pm", "Wed 4pm", "Sat 10am"],
    reviews: [
      { author: "Mr. Bertrand (parent)", stars: 5, comment: "My son's marks improved in 2 months." },
      { author: "Linda (parent)", stars: 5, comment: "Patient and very professional." },
    ],
  },
  {
    id: "t2", name: "Mr. Tabi", subject: "Physics & Chemistry", rate: 6000, rating: 4.8, verified: true,
    slots: ["Mon 6pm", "Thu 5pm", "Sat 2pm"],
    reviews: [{ author: "Esther (parent)", stars: 5, comment: "Explains concepts very clearly." }],
  },
  {
    id: "t3", name: "Mme Achu", subject: "English & Literature", rate: 4500, rating: 4.7, verified: false,
    slots: ["Tue 4pm", "Fri 5pm"],
    reviews: [{ author: "Joseph (parent)", stars: 4, comment: "Great with younger kids." }],
  },
  {
    id: "t4", name: "Mr. Fombu", subject: "Computer Science / Coding", rate: 8000, rating: 5.0, verified: true,
    slots: ["Wed 6pm", "Sat 11am", "Sun 3pm"],
    reviews: [{ author: "Achille (student)", stars: 5, comment: "Built my first app with him!" }],
  },
];

type Mode = "online" | "in_person";

const BookLessons = () => {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Teacher | null>(null);
  const [mode, setMode] = useState<Mode>("online");
  const [slot, setSlot] = useState("");
  const [confirmed, setConfirmed] = useState<null | { teacher: Teacher; slot: string; mode: Mode }>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TEACHERS;
    return TEACHERS.filter((t) => t.name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q));
  }, [query]);

  const book = () => {
    if (!active || !slot) return toast.error("Pick a time slot");
    setConfirmed({ teacher: active, slot, mode });
    setActive(null);
    setSlot("");
    toast.success("Lesson booked & paid");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-4 pt-6 animate-fade-in">
        <PageHeader title="Book Lessons" subtitle="Find a verified teacher" />

        <div className="bg-accent rounded-2xl p-4 mb-4 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
            <GraduationCap size={22} />
          </div>
          <div className="text-xs">
            <p className="font-bold text-secondary">Verified tutors</p>
            <p className="text-muted-foreground">Pay through Eduvest. Every lesson builds your Trust Score.</p>
          </div>
        </div>

        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search "Math Teacher", "Physics"…'
            className="pl-9 h-11"
          />
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
                    {t.verified && <BadgeCheck size={14} className="text-primary" />}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{t.subject}</p>
                  <div className="flex items-center gap-1 text-[11px] text-warning mt-0.5">
                    <Star size={12} fill="currentColor" />
                    <span className="font-semibold">{t.rating}</span>
                    <span className="text-muted-foreground">({t.reviews.length} reviews)</span>
                  </div>
                </div>
                <p className="text-xs font-bold text-primary">{t.rate.toLocaleString()} FCFA / hr</p>
              </div>
              <Button onClick={() => { setActive(t); setMode("online"); setSlot(""); }} className="w-full h-9 text-xs">
                <CalendarIcon size={14} className="mr-1.5" /> Book a lesson
              </Button>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-xs text-muted-foreground py-8">No teachers match your search.</p>
          )}
        </div>
      </div>

      {/* Booking dialog */}
      <Dialog open={!!active} onOpenChange={(o) => { if (!o) setActive(null); }}>
        <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto">
          {active && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {active.name}
                  {active.verified && <BadgeCheck size={16} className="text-primary" />}
                </DialogTitle>
              </DialogHeader>
              <p className="text-xs text-muted-foreground -mt-2">{active.subject}</p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setMode("online")}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-semibold ${
                    mode === "online" ? "border-primary bg-primary/5 text-primary" : "border-border"
                  }`}
                >
                  <Video size={14} /> Online
                </button>
                <button
                  onClick={() => setMode("in_person")}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-semibold ${
                    mode === "in_person" ? "border-primary bg-primary/5 text-primary" : "border-border"
                  }`}
                >
                  <MapPin size={14} /> In-person
                </button>
              </div>

              <div>
                <p className="text-xs font-bold mb-2">Available time slots</p>
                <div className="grid grid-cols-2 gap-2">
                  {active.slots.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSlot(s)}
                      className={`p-2.5 rounded-lg border text-xs font-semibold ${
                        slot === s ? "border-primary bg-primary/5 text-primary" : "border-border"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold mb-2">Parent reviews</p>
                <div className="space-y-2">
                  {active.reviews.map((r, i) => (
                    <div key={i} className="bg-muted rounded-lg p-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold">{r.author}</span>
                        <span className="text-[11px] text-warning flex items-center gap-0.5">
                          <Star size={10} fill="currentColor" /> {r.stars}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-accent rounded-xl p-3 flex justify-between items-center">
                <span className="text-xs">Total ({mode === "online" ? "Online" : "In-person"})</span>
                <span className="text-base font-extrabold text-primary">
                  {(active.rate + (mode === "in_person" ? 1000 : 0)).toLocaleString()} FCFA
                </span>
              </div>

              <Button onClick={book} className="w-full h-11 gradient-primary text-primary-foreground">
                Pay & Confirm Booking
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
              <DialogHeader>
                <DialogTitle className="text-center">Lesson confirmed</DialogTitle>
              </DialogHeader>
              <CheckCircle2 className="mx-auto text-primary" size={56} />
              <p className="text-sm">
                Your lesson with <b>{confirmed.teacher.name}</b> is booked for <b>{confirmed.slot}</b> ({confirmed.mode === "online" ? "Online" : "In-person"}).
              </p>
              <p className="text-[11px] text-muted-foreground">A reminder will be sent 30 mins before the lesson.</p>
              <Button onClick={() => setConfirmed(null)} className="gradient-primary text-primary-foreground">Done</Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookLessons;
