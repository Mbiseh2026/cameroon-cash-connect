import { Home, Sparkles, ScanLine, Landmark, User, GraduationCap, HomeIcon, Wallet, ShoppingBag } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useLang } from "@/lib/i18n";

const PAY_OPTIONS_EN = [
  { icon: GraduationCap, label: "Pay Tuition Fees", desc: "School fees & receipts", path: "/pay-fees", tone: "bg-primary/10 text-primary" },
  { icon: HomeIcon, label: "Pay Rent", desc: "Track & build trust", path: "/pay-rent", tone: "bg-secondary/10 text-secondary" },
  { icon: Wallet, label: "Pay Salary", desc: "Pay staff securely", path: "/send", tone: "bg-primary/10 text-primary" },
  { icon: ShoppingBag, label: "Pay School Supplies", desc: "Books, uniforms, lab kits & laptops", path: "/shopping", tone: "bg-secondary/10 text-secondary" },
];
const PAY_OPTIONS_FR = [
  { icon: GraduationCap, label: "Frais de scolarité", desc: "Frais & reçus", path: "/pay-fees", tone: "bg-primary/10 text-primary" },
  { icon: HomeIcon, label: "Payer le loyer", desc: "Suivre & bâtir la confiance", path: "/pay-rent", tone: "bg-secondary/10 text-secondary" },
  { icon: Wallet, label: "Payer salaire", desc: "Payer le personnel", path: "/send", tone: "bg-primary/10 text-primary" },
  { icon: ShoppingBag, label: "Fournitures scolaires", desc: "Livres, uniformes, labo & ordinateurs", path: "/shopping", tone: "bg-secondary/10 text-secondary" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const [payOpen, setPayOpen] = useState(false);

  const navItems = [
    { icon: Home, label: t("nav_home"), path: "/" },
    { icon: Sparkles, label: t("nav_ai"), path: "/ai-help" },
    { icon: ScanLine, label: t("nav_pay"), path: "#pay", center: true },
    { icon: Landmark, label: t("nav_finance"), path: "/finance" },
    { icon: User, label: t("nav_profile"), path: "/profile" },
  ];
  const PAY_OPTIONS = lang === "fr" ? PAY_OPTIONS_FR : PAY_OPTIONS_EN;


  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
        <div className="max-w-md mx-auto flex justify-around items-end py-2 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            if (item.center) {
              return (
                <button
                  key={item.label}
                  onClick={() => setPayOpen(true)}
                  className="flex flex-col items-center -mt-6"
                >
                  <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg ring-4 ring-background">
                    <item.icon size={24} strokeWidth={2.5} />
                  </div>
                  <span className="text-[10px] font-semibold text-foreground mt-1">{item.label}</span>
                </button>
              );
            }
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-semibold">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <Sheet open={payOpen} onOpenChange={setPayOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl max-w-md mx-auto">
          <SheetHeader>
            <SheetTitle className="text-secondary">{lang === "fr" ? "Que voulez-vous payer ?" : "What would you like to pay?"}</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {PAY_OPTIONS.map((p) => (
              <button
                key={p.label}
                onClick={() => {
                  setPayOpen(false);
                  navigate(p.path);
                }}
                className="flex flex-col items-start gap-2 p-4 bg-card border border-border rounded-xl hover:shadow-md transition text-left"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${p.tone}`}>
                  <p.icon size={20} />
                </div>
                <span className="text-sm font-bold leading-tight">{p.label}</span>
                <span className="text-[10px] text-muted-foreground leading-tight">{p.desc}</span>
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default BottomNav;
