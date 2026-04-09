import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Target } from "lucide-react";

interface Goal {
  id: string;
  name: string;
  target: number;
  saved: number;
  duration: string;
  autoDeposit: boolean;
}

const GOAL_OPTIONS = [
  "Start a business", "Travel", "Buy a land", "Build a house",
  "Buy a car/bike", "Back to school", "Celebrations", "Other",
];

const GoalSavings = () => {
  const [goals] = useState<Goal[]>([
    { id: "1", name: "Buy a Land", target: 200000, saved: 75000, duration: "6 months", autoDeposit: true },
    { id: "2", name: "Start a Business", target: 500000, saved: 120000, duration: "12 months", autoDeposit: false },
  ]);
  const [showCreate, setShowCreate] = useState(false);
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [autoDeposit, setAutoDeposit] = useState(false);

  const handleCreate = () => {
    if (!goalName || !targetAmount || !duration) {
      toast.error("Please fill all fields");
      return;
    }
    toast.success(`Goal "${goalName}" created!`);
    setShowCreate(false);
    setGoalName("");
    setTargetAmount("");
    setDuration("");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 pt-6 animate-fade-in">
        <PageHeader title="Goal-Based Savings" subtitle="Lock funds toward your dreams" />

        {!showCreate ? (
          <div className="space-y-4">
            {goals.map((goal) => {
              const pct = Math.round((goal.saved / goal.target) * 100);
              return (
                <div key={goal.id} className="bg-card border border-border rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target size={18} className="text-primary" />
                      <span className="font-bold text-sm">{goal.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{goal.duration}</span>
                  </div>
                  <Progress value={pct} className="h-2" />
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">
                      {goal.saved.toLocaleString()} / {goal.target.toLocaleString()} FCFA
                    </span>
                    <span className="font-bold text-primary">{pct}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">
                      Remaining: {(goal.target - goal.saved).toLocaleString()} FCFA
                    </span>
                    {goal.autoDeposit && (
                      <span className="bg-success/10 text-success px-2 py-0.5 rounded-full text-[10px] font-bold">Auto</span>
                    )}
                  </div>
                </div>
              );
            })}

            <Button onClick={() => setShowCreate(true)} className="w-full h-12 gradient-primary text-primary-foreground font-bold">
              <Plus size={18} className="mr-2" /> Create Savings Goal
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold">Select Your Goal</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {GOAL_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setGoalName(opt)}
                    className={`text-xs font-semibold p-2.5 rounded-lg border transition-all ${
                      goalName === opt ? "border-primary bg-primary/5" : "border-border bg-card"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold">Target Amount (FCFA)</Label>
              <Input type="number" placeholder="e.g. 500,000" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} className="mt-1.5" />
            </div>

            <div>
              <Label className="text-sm font-semibold">Duration</Label>
              <Input placeholder="e.g. 6 months" value={duration} onChange={(e) => setDuration(e.target.value)} className="mt-1.5" />
            </div>

            <div className="flex items-center justify-between bg-card border border-border rounded-xl p-3">
              <Label className="text-sm font-semibold">Auto-deposit</Label>
              <Switch checked={autoDeposit} onCheckedChange={setAutoDeposit} />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowCreate(false)} className="flex-1 h-12 font-bold">Cancel</Button>
              <Button onClick={handleCreate} className="flex-1 h-12 gradient-primary text-primary-foreground font-bold">Create Goal</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalSavings;
