import PageHeader from "@/components/PageHeader";
import { PiggyBank, Target, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SaveMoney = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-4 pt-6 animate-fade-in">
        <PageHeader title="Save Money" subtitle="Choose a savings type" />

        <div className="gradient-hero rounded-2xl p-5 text-primary-foreground mb-5">
          <PiggyBank size={28} className="mb-2" />
          <h2 className="text-lg font-bold mb-1">Save & build your future</h2>
          <p className="text-xs opacity-90">Every deposit boosts your Trust Score and loan eligibility.</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => toast.info("Regular Saving — coming soon")}
            className="w-full flex items-center gap-3 bg-card border border-border rounded-xl p-4 text-left hover:shadow-sm transition"
          >
            <div className="w-12 h-12 rounded-xl bg-accent text-secondary flex items-center justify-center">
              <PiggyBank size={24} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm">Regular Saving</p>
              <p className="text-xs text-muted-foreground">Deposit any time, withdraw any time. Flexible wallet savings.</p>
            </div>
            <ArrowRight size={18} className="text-muted-foreground" />
          </button>

          <button
            onClick={() => navigate("/goals")}
            className="w-full flex items-center gap-3 bg-card border border-border rounded-xl p-4 text-left hover:shadow-sm transition"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Target size={24} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm">Goal Saving</p>
              <p className="text-xs text-muted-foreground">Set a target, choose a frequency, lock funds and reach your goal.</p>
            </div>
            <ArrowRight size={18} className="text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveMoney;
