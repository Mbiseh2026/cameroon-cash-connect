import PageHeader from "@/components/PageHeader";
import { Coins, Clock, CheckCircle } from "lucide-react";

const TFunds = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 pt-6 animate-fade-in">
        <PageHeader title="T-Funds" subtitle="Zero-interest merit-based loans" />

        <div className="gradient-primary rounded-2xl p-5 text-primary-foreground mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Coins size={22} />
            <span className="font-bold">Your T-Fund Status</span>
          </div>
          <p className="text-2xl font-bold">Not yet eligible</p>
          <p className="text-xs opacity-80 mt-1">Keep saving regularly to unlock T-Funds</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold">How T-Funds Work</h2>

          {[
            { icon: CheckCircle, title: "Merit Based", desc: "Earn eligibility through consistent saving and app usage." },
            { icon: Clock, title: "Grace Period", desc: "3 to 6 months grace period before repayment starts." },
            { icon: Coins, title: "Zero Interest", desc: "No interest charged — it's a reward for loyalty." },
          ].map((item) => (
            <div key={item.title} className="flex gap-3 bg-card border border-border rounded-xl p-4">
              <div className="bg-primary/10 p-2 rounded-lg shrink-0">
                <item.icon size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}

          <div className="bg-muted rounded-xl p-4 mt-4">
            <p className="text-xs font-bold mb-2">Eligibility Criteria</p>
            <ul className="text-xs text-muted-foreground space-y-1.5">
              <li>• Regular savings for at least 3 months</li>
              <li>• Consistent app engagement</li>
              <li>• No defaulted loans</li>
              <li>• Positive business impact score</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TFunds;
