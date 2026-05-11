import {
  Bell, Wallet, PiggyBank, TrendingUp, GraduationCap, ChevronRight,
  SendHorizontal, Home as HomeIconLucide, ScanLine, BookOpen, Users,
  ArrowUpFromLine, Landmark, ShieldCheck, Briefcase, Building2, UserCog, MoreHorizontal,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import logo from "@/assets/eduvest-logo.png";
import hero from "@/assets/eduvest-hero.png";

const PRIMARY_QUICK = [
  { icon: ScanLine, label: "Pay School Fees", action: "nav", path: "/pay-fees", tone: "bg-primary/10 text-primary" },
  { icon: SendHorizontal, label: "Send Money", action: "send", tone: "bg-secondary/10 text-secondary" },
  { icon: PiggyBank, label: "Save Money", action: "nav", path: "/save", tone: "bg-primary/10 text-primary" },
  { icon: GraduationCap, label: "Book Lessons", action: "nav", path: "/lessons", tone: "bg-secondary/10 text-secondary" },
];

const MORE_QUICK = [
  { icon: HomeIconLucide, label: "Pay Rent", path: "/pay-rent", tone: "bg-primary/10 text-primary" },
  { icon: Wallet, label: "Pay Salary", path: "/send", tone: "bg-secondary/10 text-secondary" },
  { icon: Landmark, label: "Take Loan", path: "/loans", tone: "bg-primary/10 text-primary" },
  { icon: HomeIconLucide, label: "Housing Plans", path: "/loans", tone: "bg-secondary/10 text-secondary" },
];

const SERVICES = [
  { icon: GraduationCap, label: "School Fee Payments", desc: "Pay school fees securely with digital receipts and tracking.", path: "/pay-fees", tone: "bg-primary/10 text-primary" },
  { icon: PiggyBank, label: "Savings & Wallet", desc: "Save for fees, housing, emergencies, or goals.", path: "/save", tone: "bg-secondary/10 text-secondary" },
  { icon: HomeIconLucide, label: "Rent Payments", desc: "Pay & track rent while building Trust Score credibility.", path: "/pay-rent", tone: "bg-primary/10 text-primary" },
  { icon: Landmark, label: "Loans & Financing", desc: "Access micro-loans based on payment & savings history.", path: "/loans", tone: "bg-secondary/10 text-secondary" },
  { icon: BookOpen, label: "Private Lessons", desc: "Connect parents with verified teachers for home tutoring.", path: "/lessons", tone: "bg-primary/10 text-primary" },
  { icon: Wallet, label: "Salary Payment", desc: "Pay staff salaries securely with full payslips & records.", path: "/send", tone: "bg-secondary/10 text-secondary" },
];

interface CommunityMember {
  icon: any;
  label: string;
  desc: string;
  cases: string[];
}

const COMMUNITY: CommunityMember[] = [
  {
    icon: Users, label: "Parents", desc: "Pay & track",
    cases: [
      "Pay school fees & download receipts",
      "Track your child's attendance & results",
      "Connect directly with school administration",
      "Book private lessons for your child",
      "Get quick loans (emergency, tuition, books, housing)",
      "Save for your child's future",
      "AI assistant for homework help (works offline) & free messaging",
    ],
  },
  {
    icon: GraduationCap, label: "Teachers", desc: "Offer & earn",
    cases: [
      "List your subjects & receive booking requests",
      "Get paid securely after every lesson",
      "Build a verified profile with parent reviews",
      "Use the offline AI assistant to prepare lessons",
      "Save earnings & access loans against income history",
    ],
  },
  {
    icon: BookOpen, label: "Students", desc: "Learn & grow",
    cases: [
      "Book private lessons with verified tutors",
      "Use offline AI tutor for homework & exam prep",
      "Save pocket money & set goals (laptop, internship)",
      "Get a personal Trust Score that unlocks scholarships & loans",
      "Send & receive money for free with classmates",
    ],
  },
  {
    icon: Building2, label: "Schools", desc: "Manage & grow",
    cases: [
      "Collect fees online with auto-reconciliation & receipts",
      "Smart attendance management & tracking",
      "Payroll management for staff salaries",
      "Pay rent & utilities from one dashboard",
      "Access institutional loans based on Trust Score",
      "Built-in AI assistant for staff & students",
    ],
  },
  {
    icon: HomeIconLucide, label: "Tenants & Landlords", desc: "Rent & track",
    cases: [
      "Tenants pay rent on time and build credit history",
      "Landlords receive instant payment confirmations",
      "Auto-generated rent receipts every month",
      "Trust Score unlocks better housing deals & loans",
    ],
  },
  {
    icon: Briefcase, label: "Business Owners / SMEs", desc: "Pay staff",
    cases: [
      "Run payroll for employees with one tap",
      "Pay suppliers via MTN, Orange or Eduvest Wallet",
      "Track expenses & download tax-ready receipts",
      "Access SME loans backed by your Trust Score",
      "Smart attendance tracking for your team",
    ],
  },
  {
    icon: UserCog, label: "Employees", desc: "Earn & save",
    cases: [
      "Receive salary directly into Eduvest Wallet",
      "Auto-save a % of every paycheck",
      "Pay rent, school fees & insurance from salary",
      "Get salary advances based on payment history",
      "Build a Trust Score that follows you across jobs",
    ],
  },
];

const Index = () => {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(false);
  const [moreQuickOpen, setMoreQuickOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);

  const visibleServices = SERVICES.slice(0, 3);
  const visibleCommunity = COMMUNITY.slice(0, 4);

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="max-w-md mx-auto px-4 pt-5 space-y-5 animate-fade-in">
        {/* Header */}
        <header className="flex items-center justify-between">
          <img src={logo} alt="Eduvest logo" className="h-12 w-auto" width={1536} height={1024} />
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-full hover:bg-muted">
              <Bell size={20} className="text-secondary" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            </button>
            <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
              E
            </div>
          </div>
        </header>

        {/* Welcome hero */}
        <section className="gradient-hero rounded-2xl p-5 text-primary-foreground relative overflow-hidden">
          <div className="relative z-10 max-w-[60%]">
            <p className="text-sm opacity-90">Welcome back,</p>
            <h1 className="text-2xl font-extrabold mb-1">Emmanuel!</h1>
            <p className="text-xs opacity-90 leading-snug mb-4">
              Manage payments, grow your savings and build your future.
            </p>
            <button
              onClick={() => setShowBalance((v) => !v)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold px-4 py-2 rounded-lg transition"
            >
              {showBalance ? "FCFA 245,000" : "View Balance"}
            </button>
          </div>
          <img
            src={hero}
            alt="Graduation cap on books"
            className="absolute right-0 bottom-0 w-40 h-40 object-contain"
            width={1024}
            height={1024}
          />
        </section>

        {/* Quick Actions - static grid */}
        <section className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-secondary">Quick Actions</h2>
            <button onClick={() => setMoreQuickOpen(true)} className="text-xs font-semibold text-primary">See all</button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {PRIMARY_QUICK.map((a) => (
              <button
                key={a.label}
                onClick={() => {
                  if (a.action === "send") setSendOpen(true);
                  else navigate(a.path!);
                }}
                className="flex flex-col items-center gap-1.5"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${a.tone}`}>
                  <a.icon size={20} />
                </div>
                <span className="text-[10px] font-semibold text-foreground text-center leading-tight">
                  {a.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Services (replaces Overview) */}
        <section className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-secondary">Services</h2>
            <button onClick={() => setServicesOpen(true)} className="text-xs font-semibold text-primary">See all</button>
          </div>
          <div className="space-y-2">
            {visibleServices.map((s) => (
              <ServiceRow key={s.label} service={s} onStart={() => navigate(s.path)} />
            ))}
          </div>
        </section>

        {/* Eduvest community */}
        <section className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-secondary">Eduvest Community</h2>
              <p className="text-[10px] text-muted-foreground">Connect everyone in the ecosystem</p>
            </div>
            <button onClick={() => setCommunityOpen(true)} className="text-xs font-semibold text-primary">See all</button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {visibleCommunity.map((c) => (
              <button
                key={c.label}
                onClick={() => navigate("/lessons")}
                className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-muted transition"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <c.icon size={20} />
                </div>
                <span className="text-[10px] font-bold text-center leading-tight">{c.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Trust Score teaser */}
        <section
          onClick={() => navigate("/rewards")}
          className="cursor-pointer bg-accent border border-primary/20 rounded-2xl p-4 flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-extrabold">
            720
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-secondary">Your Trust Score</p>
            <p className="text-[10px] text-muted-foreground">Every payment builds your financial identity.</p>
          </div>
          <ChevronRight size={18} className="text-primary" />
        </section>
      </div>

      {/* More Quick Actions sheet */}
      <Sheet open={moreQuickOpen} onOpenChange={setMoreQuickOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl max-w-md mx-auto">
          <SheetHeader><SheetTitle className="text-secondary">All Quick Actions</SheetTitle></SheetHeader>
          <div className="grid grid-cols-4 gap-3 mt-4">
            {MORE_QUICK.map((a) => (
              <button
                key={a.label}
                onClick={() => { setMoreQuickOpen(false); navigate(a.path); }}
                className="flex flex-col items-center gap-1.5"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${a.tone}`}>
                  <a.icon size={20} />
                </div>
                <span className="text-[10px] font-semibold text-center leading-tight">{a.label}</span>
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Send Money sheet */}
      <Sheet open={sendOpen} onOpenChange={setSendOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl max-w-md mx-auto">
          <SheetHeader><SheetTitle className="text-secondary">Send Money</SheetTitle></SheetHeader>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              onClick={() => { setSendOpen(false); navigate("/send"); }}
              className="flex flex-col items-start gap-2 p-4 bg-card border border-border rounded-xl hover:shadow-md transition text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <SendHorizontal size={20} />
              </div>
              <span className="text-sm font-bold">Send</span>
              <span className="text-[10px] text-muted-foreground">Transfer to another user</span>
            </button>
            <button
              onClick={() => { setSendOpen(false); navigate("/withdraw"); }}
              className="flex flex-col items-start gap-2 p-4 bg-card border border-border rounded-xl hover:shadow-md transition text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                <ArrowUpFromLine size={20} />
              </div>
              <span className="text-sm font-bold">Withdraw</span>
              <span className="text-[10px] text-muted-foreground">Cash out from your wallet</span>
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* All services sheet */}
      <Sheet open={servicesOpen} onOpenChange={setServicesOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl max-w-md mx-auto max-h-[85vh] overflow-y-auto">
          <SheetHeader><SheetTitle className="text-secondary">All Services</SheetTitle></SheetHeader>
          <div className="space-y-2 mt-4">
            {SERVICES.map((s) => (
              <ServiceRow
                key={s.label}
                service={s}
                onStart={() => { setServicesOpen(false); navigate(s.path); }}
              />
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* All community sheet */}
      <Sheet open={communityOpen} onOpenChange={setCommunityOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl max-w-md mx-auto">
          <SheetHeader><SheetTitle className="text-secondary">Eduvest Community</SheetTitle></SheetHeader>
          <div className="grid grid-cols-4 gap-3 mt-4">
            {COMMUNITY.map((c) => (
              <button
                key={c.label}
                onClick={() => { setCommunityOpen(false); navigate("/lessons"); }}
                className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-muted"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <c.icon size={20} />
                </div>
                <span className="text-[10px] font-bold text-center leading-tight">{c.label}</span>
                <span className="text-[9px] text-muted-foreground text-center">{c.desc}</span>
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

const ServiceRow = ({
  service,
  onStart,
}: {
  service: { icon: any; label: string; desc: string; tone: string };
  onStart: () => void;
}) => (
  <div className="flex items-center gap-3 p-3 border border-border rounded-xl">
    <div className={`w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center ${service.tone}`}>
      <service.icon size={20} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-bold text-foreground">{service.label}</p>
      <p className="text-[10px] text-muted-foreground leading-tight line-clamp-2">{service.desc}</p>
    </div>
    <button
      onClick={onStart}
      className="text-[10px] font-bold bg-primary text-primary-foreground px-3 py-1.5 rounded-lg whitespace-nowrap"
    >
      Get Started
    </button>
  </div>
);

export default Index;
