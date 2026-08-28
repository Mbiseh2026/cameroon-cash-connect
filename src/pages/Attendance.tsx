import PageHeader from "@/components/PageHeader";
import { CheckCircle2, Clock, XCircle, GraduationCap, User as UserIcon, Info, ChevronRight } from "lucide-react";
import { useState } from "react";

interface WeekReport {
  id: string;
  range: string;
  present: number;
  late: number;
  absent: number;
}

interface Child {
  id: string;
  name: string;
  role: "Student" | "Teacher";
  school: string;
  classLabel: string;
  weeks: WeekReport[];
}

const CHILDREN: Child[] = [
  {
    id: "1",
    name: "Marie Nguema",
    role: "Student",
    school: "École Saint-Joseph",
    classLabel: "Form 3 · Science",
    weeks: [
      { id: "w1", range: "This week · Mon 24 – Fri 28", present: 5, late: 0, absent: 0 },
      { id: "w2", range: "Mon 17 – Fri 21", present: 4, late: 1, absent: 0 },
      { id: "w3", range: "Mon 10 – Fri 14", present: 4, late: 0, absent: 1 },
    ],
  },
  {
    id: "2",
    name: "Junior Nguema",
    role: "Student",
    school: "École Saint-Joseph",
    classLabel: "Class 5",
    weeks: [
      { id: "w1", range: "This week · Mon 24 – Fri 28", present: 4, late: 1, absent: 0 },
      { id: "w2", range: "Mon 17 – Fri 21", present: 3, late: 1, absent: 1 },
      { id: "w3", range: "Mon 10 – Fri 14", present: 5, late: 0, absent: 0 },
    ],
  },
];

const pct = (w: WeekReport) => {
  const total = w.present + w.late + w.absent;
  return total ? Math.round(((w.present + w.late) / total) * 100) : 0;
};

const Attendance = () => {
  const [openId, setOpenId] = useState<string | null>(CHILDREN[0].id);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-4 pt-6 space-y-5 animate-fade-in">
        <PageHeader title="Attendance" subtitle="Weekly reports from your school" />

        <section className="gradient-hero rounded-2xl p-4 text-primary-foreground">
          <p className="text-xs opacity-90">Latest weekly summary</p>
          <h2 className="text-2xl font-extrabold mt-1">2 reports received</h2>
          <p className="text-[11px] opacity-90 mt-1">
            Your school sends a summary every Friday for each child you follow.
          </p>
        </section>

        {CHILDREN.map((c) => {
          const latest = c.weeks[0];
          const open = openId === c.id;
          return (
            <section key={c.id} className="bg-card border border-border rounded-2xl p-4 space-y-3">
              <button className="w-full flex items-center gap-3 text-left" onClick={() => setOpenId(open ? null : c.id)}>
                <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  {c.role === "Teacher" ? <GraduationCap size={20} /> : <UserIcon size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {c.classLabel} · {c.school}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-extrabold text-primary leading-none">{pct(latest)}%</p>
                  <p className="text-[10px] text-muted-foreground">this week</p>
                </div>
              </button>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-success/10 rounded-lg p-2">
                  <CheckCircle2 size={14} className="mx-auto text-success" />
                  <p className="text-base font-extrabold text-success">{latest.present}</p>
                  <p className="text-[10px] text-muted-foreground">Present</p>
                </div>
                <div className="bg-warning/10 rounded-lg p-2">
                  <Clock size={14} className="mx-auto text-warning" />
                  <p className="text-base font-extrabold text-warning">{latest.late}</p>
                  <p className="text-[10px] text-muted-foreground">Late</p>
                </div>
                <div className="bg-destructive/10 rounded-lg p-2">
                  <XCircle size={14} className="mx-auto text-destructive" />
                  <p className="text-base font-extrabold text-destructive">{latest.absent}</p>
                  <p className="text-[10px] text-muted-foreground">Absent</p>
                </div>
              </div>

              {open && (
                <div className="space-y-2 pt-1">
                  <p className="text-xs font-bold text-secondary">Past weeks</p>
                  {c.weeks.slice(1).map((w) => (
                    <div key={w.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/40">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">{w.range}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {w.present} present · {w.late} late · {w.absent} absent
                        </p>
                      </div>
                      <span className="text-xs font-bold">{pct(w)}%</span>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => setOpenId(open ? null : c.id)}
                className="w-full text-xs font-semibold text-primary flex items-center justify-center gap-1"
              >
                {open ? "Hide past weeks" : "View past weeks"} <ChevronRight size={14} />
              </button>
            </section>
          );
        })}

        <section className="flex gap-2 bg-muted/40 border border-border rounded-xl p-3">
          <Info size={16} className="text-primary shrink-0 mt-0.5" />
          <p className="text-[11px] text-muted-foreground">
            Real-time gate check-ins are recorded by your school with the Eduvest Gate App. Here you receive the
            weekly summary your school publishes.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Attendance;
