import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/eduvest-logo.png";
import hero from "@/assets/eduvest-hero.png";

const Welcome = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen gradient-hero text-primary-foreground flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center animate-fade-in">
        <img src={logo} alt="Eduvest" className="h-20 w-auto mb-6 drop-shadow-lg" />
        <h1 className="text-3xl font-extrabold mb-2">Eduvest</h1>
        <p className="text-sm opacity-90 max-w-xs mb-6">
          Pay. Save. Learn. Build your financial identity — every transaction grows your Trust Score.
        </p>
        <img src={hero} alt="" className="w-56 h-56 object-contain" />
      </div>
      <div className="px-6 pb-10 space-y-3">
        <Button onClick={() => navigate("/auth")} className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
          Get Started
        </Button>
        <button onClick={() => navigate("/auth?mode=login")} className="w-full text-xs font-semibold opacity-90 hover:opacity-100">
          I already have an account
        </button>
      </div>
    </div>
  );
};
export default Welcome;
