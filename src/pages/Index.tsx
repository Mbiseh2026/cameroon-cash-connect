import BalanceCard from "@/components/BalanceCard";
import QuickActions from "@/components/QuickActions";
import HomeExtras from "@/components/HomeExtras";
import PromoCarousel from "@/components/PromoCarousel";
import { Diamond } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 pt-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="gradient-primary p-2 rounded-xl">
              <Diamond size={20} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gradient">TREASURIT</h1>
              <p className="text-[10px] text-muted-foreground font-medium">Your financial partner</p>
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
            <span className="text-sm font-bold text-muted-foreground">T</span>
          </div>
        </div>

        {/* Balance */}
        <BalanceCard />

        {/* Promo Section */}
        <div>
          <p className="text-sm font-bold text-foreground mb-3">Get the best out of Treasurit 🚀</p>
          <PromoCarousel />
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-sm font-bold mb-3 text-foreground">Services</h2>
          <QuickActions />
        </div>

        {/* Extras */}
        <HomeExtras />
      </div>
    </div>
  );
};

export default Index;
