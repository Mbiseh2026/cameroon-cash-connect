import PageHeader from "@/components/PageHeader";
import { ShieldCheck, GraduationCap, Heart, Briefcase, Home as HomeIcon } from "lucide-react";
import { toast } from "sonner";

const PLANS = [
  { icon: GraduationCap, name: "School Fees Insurance", desc: "Protect your child's tuition if income is lost", price: "from 2,500 FCFA/mo", color: "bg-primary/10 text-primary" },
  { icon: Heart, name: "Health Cover", desc: "Family health protection across partner clinics", price: "from 5,000 FCFA/mo", color: "bg-destructive/10 text-destructive" },
  { icon: HomeIcon, name: "Rent & Housing", desc: "Cover rent in case of emergency", price: "from 3,000 FCFA/mo", color: "bg-secondary/10 text-secondary" },
  { icon: Briefcase, name: "SME Business Cover", desc: "Protect your shop, equipment and inventory", price: "from 7,500 FCFA/mo", color: "bg-warning/10 text-warning" },
];

const Insurance = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-4 pt-6 animate-fade-in">
        <PageHeader title="Insurance" subtitle="Protect what matters" />

        <div className="gradient-hero rounded-2xl p-5 text-primary-foreground mb-5">
          <ShieldCheck size={28} className="mb-2" />
          <h2 className="text-lg font-bold mb-1">Eduvest Cover</h2>
          <p className="text-xs opacity-90">Affordable micro-insurance plans backed by your Trust Score.</p>
        </div>

        <div className="space-y-3">
          {PLANS.map((p) => (
            <button
              key={p.name}
              onClick={() => toast.info(`${p.name} — coming soon`)}
              className="w-full flex items-center gap-3 bg-card border border-border rounded-xl p-4 text-left hover:shadow-sm transition"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${p.color}`}>
                <p.icon size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.desc}</p>
                <p className="text-[11px] text-primary font-semibold mt-0.5">{p.price}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Insurance;
