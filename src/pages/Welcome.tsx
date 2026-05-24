import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, Languages } from "lucide-react";
import { useLang } from "@/lib/i18n";
import logo from "@/assets/eduvest-logo.png";
import hero from "@/assets/eduvest-hero.png";

const Welcome = () => {
  const navigate = useNavigate();
  const { t, lang, toggle } = useLang();
  return (
    <div className="min-h-screen gradient-hero text-primary-foreground flex flex-col">
      <div className="flex justify-end p-4">
        <button onClick={toggle} className="flex items-center gap-1.5 text-xs font-bold bg-card/20 hover:bg-card/30 backdrop-blur px-3 py-1.5 rounded-full">
          <Languages size={14} /> {lang === "en" ? "FR" : "EN"}
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center animate-fade-in -mt-10">
        <img src={logo} alt="Eduvest" className="h-20 w-auto mb-6 drop-shadow-lg" />
        <h1 className="text-3xl font-extrabold mb-2">Eduvest</h1>
        <p className="text-sm opacity-90 max-w-xs mb-6">{t("welcome_tag")}</p>
        <img src={hero} alt="" className="w-56 h-56 object-contain" />
      </div>
      <div className="px-6 pb-10 space-y-3">
        <Button onClick={() => navigate("/auth?mode=signup")} className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
          <UserPlus size={16} className="mr-2" /> {t("sign_up")}
        </Button>
        <Button onClick={() => navigate("/auth?mode=login")} variant="outline" className="w-full h-12 bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-card/10 font-bold">
          <LogIn size={16} className="mr-2" /> {t("sign_in")}
        </Button>
        <p className="text-[11px] text-center opacity-80">{t("get_started")} — {t("welcome_tag").split(".")[0]}.</p>
      </div>
    </div>
  );
};
export default Welcome;
