import { ArrowDownToLine, ArrowUpFromLine, ChevronRight, Landmark, PiggyBank, SendHorizontal, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";

const Finance = () => {
  const navigate = useNavigate();
  const { lang, t } = useLang();
  const french = lang === "fr";
  const features = [
    { icon: SendHorizontal, label: french ? "Envoyer de l’argent" : "Send Money", path: "/send", tone: "bg-secondary/10 text-secondary" },
    { icon: PiggyBank, label: french ? "Épargner" : "Save Money", path: "/save", tone: "bg-primary/10 text-primary" },
    { icon: Landmark, label: french ? "Prêts" : "Loans", path: "/loans", tone: "bg-secondary/10 text-secondary" },
  ];
  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="max-w-md mx-auto px-4 pt-6 animate-fade-in">
        <PageHeader title={t("nav_finance")} />
        <div className="flex items-center gap-3 mb-6 text-primary"><Wallet size={28} /><h2 className="text-sm font-semibold">{french ? "Votre argent" : "Your money"}</h2></div>
        <div className="space-y-3">
          {features.map(({ icon: Icon, ...feature }) => (
            <Button key={feature.path} variant="outline" onClick={() => navigate(feature.path)} className="w-full h-auto p-4 justify-start whitespace-normal bg-card">
              <span className={`w-11 h-11 shrink-0 rounded-lg flex items-center justify-center ${feature.tone}`}><Icon /></span>
              <span className="flex-1 text-left font-bold">{feature.label}</span><ChevronRight className="text-muted-foreground" />
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 mt-6">
          <Button variant="outline" onClick={() => navigate("/deposit")}><ArrowDownToLine />{french ? "Recharger" : "Top Up"}</Button>
          <Button variant="outline" onClick={() => navigate("/withdraw")}><ArrowUpFromLine />{french ? "Retirer" : "Withdraw"}</Button>
        </div>
      </div>
    </div>
  );
};
export default Finance;