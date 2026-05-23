import {
  Bell, Wallet, PiggyBank, GraduationCap, ChevronRight,
  SendHorizontal, Home as HomeIconLucide, ScanLine, BookOpen, Users,
  ArrowUpFromLine, ArrowDownToLine, Landmark, Briefcase, Building2, UserCog,
  ShieldCheck, CalendarCheck, Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import logo from "@/assets/eduvest-logo.png";
import hero from "@/assets/eduvest-hero.png";

const PRIMARY_QUICK = [
  { icon: ScanLine, label: "Pay School Fees", action: "nav", path: "/pay-fees", tone: "bg-primary/10 text-primary" },
  { icon: SendHorizontal, label: "Send Money", action: "send", tone: "bg-secondary/10 text-secondary" },
  { icon: PiggyBank, label: "Save Money", action: "nav", path: "/save", tone: "bg-primary/10 text-primary" },
  { icon: GraduationCap, label: "Book Lessons", action: "nav", path: "/lessons", tone: "bg-secondary/10 text-secondary" },
];

// "See all" must NOT repeat the 4 Primary Quick actions
const MORE_QUICK = [
  { icon: HomeIconLucide, label: "Pay Rent", path: "/pay-rent", tone: "bg-primary/10 text-primary" },
  { icon: Wallet, label: "Get Paid", path: "/get-paid", tone: "bg-secondary/10 text-secondary" },
  { icon: Landmark, label: "Take Loan", path: "/loans", tone: "bg-primary/10 text-primary" },
  { icon: ShieldCheck, label: "Insurance", path: "/insurance", tone: "bg-secondary/10 text-secondary" },
  { icon: CalendarCheck, label: "Attendance", path: "/attendance", tone: "bg-primary/10 text-primary" },
  { icon: ArrowUpFromLine, label: "Withdraw", path: "/withdraw", tone: "bg-secondary/10 text-secondary" },
];

// Visible 4 (Rent & Get Paid first)
const VISIBLE_SERVICES = [
  { icon: HomeIconLucide, label: "Rent Payments", desc: "Pay & track rent while building Trust Score credibility.", path: "/pay-rent", tone: "bg-primary/10 text-primary" },
  { icon: Wallet, label: "Get Paid", desc: "Salary, freelance & client payments with payslips.", path: "/get-paid", tone: "bg-secondary/10 text-secondary" },
  { icon: GraduationCap, label: "School Fee Payments", desc: "Pay school fees securely with digital receipts.", path: "/pay-fees", tone: "bg-primary/10 text-primary" },
  { icon: PiggyBank, label: "Savings & Wallet", desc: "Save for fees, housing, emergencies, or goals.", path: "/save", tone: "bg-secondary/10 text-secondary" },
];

// "See all" services — NO repetition of the 4 above
const MORE_SERVICES = [
  { icon: Landmark, label: "Loans & Financing", desc: "Access micro-loans based on payment & savings history.", path: "/loans", tone: "bg-primary/10 text-primary" },
  { icon: BookOpen, label: "Private Lessons", desc: "Connect with verified teachers for home tutoring.", path: "/lessons", tone: "bg-secondary/10 text-secondary" },
  { icon: ShieldCheck, label: "Insurance", desc: "School, health & rent insurance for peace of mind.", path: "/insurance", tone: "bg-primary/10 text-primary" },
  { icon: CalendarCheck, label: "Smart Attendance", desc: "Real-time school arrival alerts for parents & admins.", path: "/attendance", tone: "bg-secondary/10 text-secondary" },
  { icon: HomeIconLucide, label: "Housing Plans", desc: "Save toward rent deposits, land or building.", path: "/loans", tone: "bg-primary/10 text-primary" },
];

interface CommunityMember { icon: any; label: string; desc: string; cases: string[]; }

const COMMUNITY: CommunityMember[] = [
  { icon: Users, label: "Parents", desc: "Pay & track", cases: ["Pay school fees & download receipts","Track attendance & results","Book private lessons","Save for your child's future"] },
  { icon: GraduationCap, label: "Teachers", desc: "Offer & earn", cases: ["List subjects & receive bookings","Get paid securely after each lesson","Build verified profile with reviews"] },
  { icon: BookOpen, label: "Students", desc: "Learn & grow", cases: ["Book verified tutors","Save pocket money & set goals","Build Trust Score for scholarships"] },
  { icon: Building2, label: "Schools", desc: "Manage & grow", cases: ["Collect fees online with auto-reconciliation","Smart attendance & payroll","Access institutional loans"] },
  { icon: HomeIconLucide, label: "Tenants & Landlords", desc: "Rent & track", cases: ["Tenants build credit history","Landlords get instant confirmations","Auto rent receipts every month"] },
  { icon: Briefcase, label: "Business Owners / SMEs", desc: "Pay staff", cases: ["Run payroll in one tap","Pay suppliers via MoMo/Wallet","SME loans backed by Trust Score"] },
  { icon: UserCog, label: "Employees", desc: "Earn & save", cases: ["Receive salary into Wallet","Auto-save % of every paycheck","Salary advances based on history"] },
];

const Index = () => {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(false);
  const [pinDialog, setPinDialog] = useState(false);
  const [pinValue, setPinValue] = useState("");
  const [moreQuickOpen, setMoreQuickOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [activeMember, setActiveMember] = useState<CommunityMember | null>(null);

  const handleBalanceTap = () => {
    if (showBalance) { setShowBalance(false); return; }
    const lock = localStorage.getItem("walletPinLock") === "1";
    if (lock) { setPinValue(""); setPinDialog(true); } else setShowBalance(true);
  };

  const submitPin = () => {
    if (pinValue.length !== 4) return toast.error("Enter your 4-digit PIN");
    const saved = localStorage.getItem("userPin");
    if (saved && saved !== pinValue) return toast.error("Wrong PIN");
    setShowBalance(true); setPinDialog(false); setPinValue("");
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="max-w-md mx-auto px-4 pt-5 space-y-5 animate-fade-in">
        <header className="flex items-center justify-between">
          <img src={logo} alt="Eduvest logo" className="h-12 w-auto" width={1536} height={1024} />
          <div className="flex items-center gap-3">
            <button onClick={() => setNotifOpen(true)} className="relative p-2 rounded-full hover:bg-muted active:scale-95 transition" aria-label="Notifications">
              <Bell size={20} className="text-secondary" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            </button>
            <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold">E</div>
          </div>
        </header>

        <section className="gradient-hero rounded-2xl p-5 text-primary-foreground relative overflow-hidden">
          <div className="relative z-10 max-w-[60%]">
            <p className="text-sm opacity-90">Welcome back,</p>
            <h1 className="text-2xl font-extrabold mb-1">Emmanuel!</h1>
            <p className="text-xs opacity-90 leading-snug mb-3">Wallet balance only. Lockable from Profile › Security.</p>
            <button onClick={handleBalanceTap} className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold px-4 py-2 rounded-lg transition inline-flex items-center gap-2">
              {showBalance ? "FCFA 245,000 · Wallet" : (<><Lock size={14} /> View Balance</>)}
            </button>
          </div>
          <img src={hero} alt="Graduation cap on books" className="absolute right-0 bottom-0 w-40 h-40 object-contain" width={1024} height={1024} />
        </section>

        <section className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-secondary">Quick Actions</h2>
            <button onClick={() => setMoreQuickOpen(true)} className="text-xs font-semibold text-primary">See all</button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {PRIMARY_QUICK.map((a) => (
              <button key={a.label} onClick={() => { if (a.action === "send") setSendOpen(true); else navigate(a.path!); }} className="flex flex-col items-center gap-1.5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${a.tone}`}><a.icon size={20} /></div>
                <span className="text-[10px] font-semibold text-foreground text-center leading-tight">{a.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-secondary">Services</h2>
            <button onClick={() => setServicesOpen(true)} className="text-xs font-semibold text-primary">See all</button>
          </div>
          <div className="space-y-2">
            {VISIBLE_SERVICES.map((s) => (<ServiceRow key={s.label} service={s} onStart={() => navigate(s.path)} />))}
          </div>
        </section>

        <section className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-secondary">Eduvest Community</h2>
              <p className="text-[10px] text-muted-foreground">Connect everyone in the ecosystem</p>
            </div>
            <button onClick={() => setCommunityOpen(true)} className="text-xs font-semibold text-primary">See all</button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {COMMUNITY.slice(0, 4).map((c) => (
              <button key={c.label} onClick={() => setActiveMember(c)} className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-muted transition">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><c.icon size={20} /></div>
                <span className="text-[10px] font-bold text-center leading-tight">{c.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section onClick={() => navigate("/rewards")} className="cursor-pointer bg-accent border border-primary/20 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-extrabold">720</div>
          <div className="flex-1">
            <p className="text-xs font-bold text-secondary">Your Trust Score</p>
            <p className="text-[10px] text-muted-foreground">Every payment builds your financial identity.</p>
          </div>
          <ChevronRight size={18} className="text-primary" />
        </section>
      </div>

      {/* PIN dialog for wallet view */}
      <Dialog open={pinDialog} onOpenChange={(o) => { if (!o) { setPinDialog(false); setPinValue(""); } }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Lock size={18} className="text-primary" /> Enter PIN</DialogTitle>
            <DialogDescription>Wallet balance is locked. Enter your 4-digit PIN to view it.</DialogDescription>
          </DialogHeader>
          <Input type="password" inputMode="numeric" maxLength={4} placeholder="••••" value={pinValue}
            onChange={(e) => setPinValue(e.target.value.replace(/\D/g, ""))}
            className="text-center text-xl tracking-[1em] h-12" autoFocus />
          <DialogFooter>
            <Button variant="outline" onClick={() => setPinDialog(false)}>Cancel</Button>
            <Button onClick={submitPin} className="gradient-primary text-primary-foreground">Unlock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* More Quick Actions sheet (no repeats) */}
      <Sheet open={moreQuickOpen} onOpenChange={setMoreQuickOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl max-w-md mx-auto">
          <SheetHeader><SheetTitle className="text-secondary">More Actions</SheetTitle></SheetHeader>
          <p className="text-[11px] text-muted-foreground mb-3">Different from the 4 shown on home.</p>
          <div className="grid grid-cols-4 gap-3 mt-2">
            {MORE_QUICK.map((a) => (
              <button key={a.label} onClick={() => { setMoreQuickOpen(false); navigate(a.path); }} className="flex flex-col items-center gap-1.5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${a.tone}`}><a.icon size={20} /></div>
                <span className="text-[10px] font-semibold text-center leading-tight">{a.label}</span>
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Send Money sheet — now 3 options (Top Up / Send / Withdraw) */}
      <Sheet open={sendOpen} onOpenChange={setSendOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl max-w-md mx-auto">
          <SheetHeader><SheetTitle className="text-secondary">Move money</SheetTitle></SheetHeader>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <button onClick={() => { setSendOpen(false); navigate("/deposit"); }} className="flex flex-col items-start gap-2 p-3 bg-card border border-border rounded-xl hover:shadow-md transition text-left">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><ArrowDownToLine size={20} /></div>
              <span className="text-sm font-bold">Top Up</span>
              <span className="text-[10px] text-muted-foreground">Add money to wallet</span>
            </button>
            <button onClick={() => { setSendOpen(false); navigate("/send"); }} className="flex flex-col items-start gap-2 p-3 bg-card border border-border rounded-xl hover:shadow-md transition text-left">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center"><SendHorizontal size={20} /></div>
              <span className="text-sm font-bold">Send</span>
              <span className="text-[10px] text-muted-foreground">Transfer to a user</span>
            </button>
            <button onClick={() => { setSendOpen(false); navigate("/withdraw"); }} className="flex flex-col items-start gap-2 p-3 bg-card border border-border rounded-xl hover:shadow-md transition text-left">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><ArrowUpFromLine size={20} /></div>
              <span className="text-sm font-bold">Withdraw</span>
              <span className="text-[10px] text-muted-foreground">Cash out from wallet</span>
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* All services sheet — only NEW services, no repeats */}
      <Sheet open={servicesOpen} onOpenChange={setServicesOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl max-w-md mx-auto max-h-[85vh] overflow-y-auto">
          <SheetHeader><SheetTitle className="text-secondary">More Services</SheetTitle></SheetHeader>
          <p className="text-[11px] text-muted-foreground mb-3">In addition to the 4 services on home.</p>
          <div className="space-y-2 mt-2">
            {MORE_SERVICES.map((s) => (
              <ServiceRow key={s.label} service={s} onStart={() => { setServicesOpen(false); navigate(s.path); }} />
            ))}
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={communityOpen} onOpenChange={setCommunityOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl max-w-md mx-auto">
          <SheetHeader><SheetTitle className="text-secondary">Eduvest Community</SheetTitle></SheetHeader>
          <div className="grid grid-cols-4 gap-3 mt-4">
            {COMMUNITY.map((c) => (
              <button key={c.label} onClick={() => { setCommunityOpen(false); setActiveMember(c); }} className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-muted">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><c.icon size={20} /></div>
                <span className="text-[10px] font-bold text-center leading-tight">{c.label}</span>
                <span className="text-[9px] text-muted-foreground text-center">{c.desc}</span>
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={!!activeMember} onOpenChange={(o) => { if (!o) setActiveMember(null); }}>
        <SheetContent side="bottom" className="rounded-t-2xl max-w-md mx-auto max-h-[85vh] overflow-y-auto">
          {activeMember && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><activeMember.icon size={22} /></div>
                  <div className="text-left">
                    <SheetTitle className="text-secondary">{activeMember.label}</SheetTitle>
                    <p className="text-[11px] text-muted-foreground">How Eduvest helps you</p>
                  </div>
                </div>
              </SheetHeader>
              <ul className="space-y-2 mt-4">
                {activeMember.cases.map((u, i) => (
                  <li key={i} className="flex items-start gap-3 p-3 bg-card border border-border rounded-xl">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[11px] font-bold flex-shrink-0">{i + 1}</div>
                    <span className="text-xs leading-relaxed text-foreground">{u}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={notifOpen} onOpenChange={setNotifOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl max-w-md mx-auto max-h-[80vh] overflow-y-auto">
          <SheetHeader><SheetTitle className="text-secondary">Notifications</SheetTitle></SheetHeader>
          <div className="space-y-2 mt-4">
            {[
              { t: "Trust Score updated", d: "+15 pts after your last fee payment.", time: "2h" },
              { t: "Rent due in 3 days", d: "Mr Eyong Tabi · 85,000 FCFA", time: "1d" },
              { t: "New tutor available", d: "Mr Fombu added Saturday slots.", time: "2d" },
            ].map((n, i) => (
              <div key={i} className="p-3 bg-card border border-border rounded-xl">
                <div className="flex justify-between items-start">
                  <p className="text-xs font-bold">{n.t}</p>
                  <span className="text-[10px] text-muted-foreground">{n.time}</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">{n.d}</p>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

const ServiceRow = ({ service, onStart }: { service: { icon: any; label: string; desc: string; tone: string }; onStart: () => void; }) => (
  <div className="flex items-center gap-3 p-3 border border-border rounded-xl">
    <div className={`w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center ${service.tone}`}><service.icon size={20} /></div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-bold text-foreground">{service.label}</p>
      <p className="text-[10px] text-muted-foreground leading-tight line-clamp-2">{service.desc}</p>
    </div>
    <button onClick={onStart} className="text-[10px] font-bold bg-primary text-primary-foreground px-3 py-1.5 rounded-lg whitespace-nowrap">Get Started</button>
  </div>
);

export default Index;
