import PageHeader from "@/components/PageHeader";
import { CheckCircle2, Clock, XCircle, GraduationCap, User as UserIcon, ChevronRight } from "lucide-react";
import { useState } from "react";

type Status = "arrived" | "late" | "absent";

interface Child {
  id: string;
  name: string;
  role: "Student" | "Teacher";
  school: string;
  classLabel: string;
  status: Status;
  time?: string;
  monthly: number; // %
}

const CHILDREN: Child[] = [
  { id: "1", name: "Marie Nguema", role: "Student", school: "École Saint-Joseph", classLabel: "Form 3 · Science", status: "arrived", time: "07:42", monthly: 96 },
  { id: "2", name: "Junior Nguema", role: "Student", school: "École Saint-Joseph", classLabel: "Class 5", status: "late", time: "08:14", monthly: 88 },
  { id: "3", name: "Mr Fombu (You)", role: "Teacher", school: "École Saint-Joseph", classLabel: "Mathematics dept.", status: "arrived", time: "07:05", monthly: 99 },
];

const TODAY_FEED = [
  { name: "Marie Nguema", who: "Form 3 · Gate A", time: "07:42", kind: "arrival" as const, source: "NFC" },
  { name: "Mr Fombu", who: "Teacher · Gate A", time: "07:05", kind: "arrival" as const, source: "QR" },
  { name: "Junior Nguema", who: "Class 5 · Gate B", time: "08:14", kind: "arrival" as const, source: "NFC" },
];

const statusMap: Record<Status, { label: string; cls: string; Icon: typeof CheckCircle2 }> = {
  arrived: { label: "Arrived", cls: "bg-success/10 text-success", Icon: CheckCircle2 },
  late: { label: "Late", cls: "bg-warning/10 text-warning", Icon: Clock },
  absent: { label: "Absent", cls: "bg-destructive/10 text-destructive", Icon: XCircle },
};

const Attendance = () => {
  const [selected, setSelected] = useState<Child | null>(null);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-4 pt-6 space-y-5 animate-fade-in">
        <PageHeader title="Attendance" subtitle="Real-time arrivals & history" />

        {/* Today summary */}
        <section className="gradient-hero rounded-2xl p-4 text-primary-foreground">
          <p className="text-xs opacity-90">Today · {new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "short" })}</p>
          <div className="flex items-end justify-between mt-1">
            <h2 className="text-2xl font-extrabold">2 of 3 checked in</h2>
            <span className="text-xs font-semibold bg-primary/30 px-2 py-1 rounded-full">Live</span>
          </div>
          <p className="text-[11px] opacity-90 mt-1">You'll get a push the moment they tap at the gate.</p>
        </section>

        {/* People I follow */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-secondary">My people</h3>
          {CHILDREN.map((c) => {
            const s = statusMap[c.status];
            return (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className="w-full flex items-center gap-3 bg-card border border-border rounded-xl p-3 text-left hover:shadow-sm transition"
              >
                <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  {c.role === "Teacher" ? <GraduationCap size={20} /> : <UserIcon size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{c.classLabel} · {c.school}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${s.cls}`}>
                    <s.Icon size={11} /> {s.label}{c.time ? ` · ${c.time}` : ""}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{c.monthly}% this month</span>
                </div>
              </button>
            );
          })}
        </section>

        {/* Live feed */}
        <section className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-secondary">Today's gate feed</h3>
            <span className="text-[10px] text-muted-foreground">École Saint-Joseph</span>
          </div>
          <div className="space-y-2">
            {TODAY_FEED.map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/40">
                <div className="w-8 h-8 rounded-full bg-success/10 text-success flex items-center justify-center">
                  <CheckCircle2 size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{f.name}</p>
                  <p className="text-[10px] text-muted-foreground">{f.who} · via {f.source}</p>
                </div>
                <span className="text-[11px] font-bold text-foreground">{f.time}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Detail (very light) */}
        {selected && (
          <section className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">{selected.name} · monthly</h3>
              <button onClick={() => setSelected(null)} className="text-[11px] text-muted-foreground">Close</button>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3 text-center">
              <div className="bg-success/10 rounded-lg p-2">
                <p className="text-base font-extrabold text-success">19</p>
                <p className="text-[10px] text-muted-foreground">Present</p>
              </div>
              <div className="bg-warning/10 rounded-lg p-2">
                <p className="text-base font-extrabold text-warning">2</p>
                <p className="text-[10px] text-muted-foreground">Late</p>
              </div>
              <div className="bg-destructive/10 rounded-lg p-2">
                <p className="text-base font-extrabold text-destructive">1</p>
                <p className="text-[10px] text-muted-foreground">Absent</p>
              </div>
            </div>
            <button className="mt-3 w-full text-xs font-semibold text-primary flex items-center justify-center gap-1">
              View full history <ChevronRight size={14} />
            </button>
          </section>
        )}
      </div>
    </div>
  );
};

export default Attendance;
