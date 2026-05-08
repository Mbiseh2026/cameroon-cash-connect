import PageHeader from "@/components/PageHeader";
import { Trophy, Star, Gift, Zap } from "lucide-react";

const rewards = [
  { icon: Star, title: "First Deposit", desc: "Made your first deposit", points: 50, earned: true },
  { icon: Zap, title: "7-Day Streak", desc: "Save for 7 consecutive days", points: 100, earned: false },
  { icon: Trophy, title: "Goal Achiever", desc: "Complete a savings goal", points: 250, earned: false },
  { icon: Gift, title: "Referral Bonus", desc: "Invite a friend who signs up", points: 150, earned: false },
];

const Rewards = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 pt-6 animate-fade-in">
        <PageHeader title="My Rewards" subtitle="Earn points for using Eduvest" />

        <div className="gradient-primary rounded-2xl p-5 text-primary-foreground mb-6">
          <p className="text-sm opacity-80">Total Points</p>
          <p className="text-3xl font-bold">50</p>
          <p className="text-xs opacity-70 mt-1">Keep using Eduvest to earn more!</p>
        </div>

        <h2 className="text-sm font-bold mb-3">Achievements</h2>
        <div className="space-y-3">
          {rewards.map((r) => (
            <div key={r.title} className={`flex items-center gap-3 bg-card border rounded-xl p-4 ${
              r.earned ? "border-success/30" : "border-border"
            }`}>
              <div className={`p-2 rounded-lg ${r.earned ? "bg-success/10" : "bg-muted"}`}>
                <r.icon size={18} className={r.earned ? "text-success" : "text-muted-foreground"} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">{r.title}</p>
                <p className="text-xs text-muted-foreground">{r.desc}</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-primary">{r.points} pts</span>
                {r.earned && <p className="text-[9px] text-success font-bold">Earned ✓</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rewards;
