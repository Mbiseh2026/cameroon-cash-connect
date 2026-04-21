import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Target, ArrowRight, ArrowLeft, MessageCircle, Calendar, Coins, Users, Edit3, AlertTriangle, CheckCircle2, Wallet, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Lock } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";

import goalTravel from "@/assets/goal-travel.png";
import goalHouse from "@/assets/goal-house.png";
import goalBusiness from "@/assets/goal-business.png";
import goalLand from "@/assets/goal-land.png";
import goalCar from "@/assets/goal-car.png";
import goalSchool from "@/assets/goal-school.png";
import goalCelebration from "@/assets/goal-celebration.png";
import goalTuition from "@/assets/goal-tuition.png";
import goalSkill from "@/assets/goal-skill.png";

interface Goal {
  id: string;
  name: string;
  target: number;
  saved: number;
  duration: string;
  autoDeposit: boolean;
  description?: string;
  frequency?: string;
  savingAmount?: number;
}

const GOAL_OPTIONS: { label: string; image: string }[] = [
  { label: "Start a business", image: goalBusiness },
  { label: "Travel", image: goalTravel },
  { label: "Buy a land", image: goalLand },
  { label: "Build a house", image: goalHouse },
  { label: "Buy a car/bike", image: goalCar },
  { label: "Back to school", image: goalSchool },
  { label: "Tuition fees", image: goalTuition },
  { label: "Learn a skill/trade", image: goalSkill },
  { label: "Celebrations", image: goalCelebration },
  { label: "Other", image: "" },
];

const SAVING_FREQUENCIES = [
  { label: "Daily", value: "daily", min: 500 },
  { label: "Weekly", value: "weekly", min: 2000 },
  { label: "Monthly", value: "monthly", min: 5000 },
];

const COMMUNITY_GOALS = [
  { goal: "Travel", count: 48 },
  { goal: "Start a business", count: 35 },
  { goal: "Build a house", count: 29 },
  { goal: "Tuition fees", count: 24 },
  { goal: "Buy a car/bike", count: 18 },
  { goal: "Learn a skill/trade", count: 15 },
  { goal: "Buy a land", count: 12 },
  { goal: "Celebrations", count: 8 },
];

const GoalSavings = () => {
  const [goals] = useState<Goal[]>([
    { id: "1", name: "Buy a Land", target: 200000, saved: 75000, duration: "6 months", autoDeposit: true, frequency: "monthly", savingAmount: 35000, description: "Plot in Yaoundé suburbs" },
    { id: "2", name: "Start a Business", target: 500000, saved: 120000, duration: "12 months", autoDeposit: false, frequency: "monthly", savingAmount: 40000 },
  ]);
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [step, setStep] = useState(1);
  const [goalName, setGoalName] = useState("");
  const [customGoalName, setCustomGoalName] = useState("");
  const [description, setDescription] = useState("");
  const [descPopoverOpen, setDescPopoverOpen] = useState(false);
  const [targetAmount, setTargetAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [frequency, setFrequency] = useState("");
  const [savingAmount, setSavingAmount] = useState("");
  const [autoDeposit, setAutoDeposit] = useState(false);
  const [postCreateGoal, setPostCreateGoal] = useState<string | null>(null);
  const [pinPromptGoal, setPinPromptGoal] = useState<Goal | null>(null);
  const [pinValue, setPinValue] = useState("");

  const totalSteps = 4;

  const resetForm = () => {
    setStep(1);
    setGoalName("");
    setCustomGoalName("");
    setDescription("");
    setTargetAmount("");
    setDuration("");
    setFrequency("");
    setSavingAmount("");
    setAutoDeposit(false);
    setShowCreate(false);
  };

  const displayGoalName = goalName === "Other" ? customGoalName : goalName;

  const handleCreate = () => {
    const name = displayGoalName;
    toast.success(`Goal "${name}" created!`);
    resetForm();
    setPostCreateGoal(name);
  };

  const canNext = () => {
    if (step === 1) {
      if (goalName === "Other") return !!customGoalName.trim();
      return !!goalName;
    }
    if (step === 2) return !!targetAmount;
    if (step === 3) return !!frequency && !!savingAmount;
    return !!duration;
  };

  const selectedFreq = SAVING_FREQUENCIES.find(f => f.value === frequency);

  const openWhatsApp = () => {
    window.open("https://wa.me/237600000000?text=Hi%20Treasurit,%20I%20need%20help%20budgeting%20my%20savings%20goal.", "_blank");
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
                <button
                  key={goal.id}
                  onClick={() => { setPinValue(""); setPinPromptGoal(goal); }}
                  className="w-full text-left bg-card border border-border rounded-xl p-4 space-y-3 hover:border-primary/40 transition-colors"
                >
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
                </button>
              );
            })}

            <Button onClick={() => { setShowCreate(true); setStep(1); }} className="w-full h-12 gradient-primary text-primary-foreground font-bold">
              <Plus size={18} className="mr-2" /> Create Savings Goal
            </Button>

            {/* See Other Goals */}
            <button
              onClick={() => setShowCommunity(!showCommunity)}
              className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-primary py-2 hover:underline"
            >
              <Users size={16} /> See what others are saving for
            </button>

            {showCommunity && (
              <div className="bg-card border border-border rounded-xl p-4 space-y-3 animate-fade-in">
                <p className="text-xs font-bold text-foreground">🔥 Popular Goals in the Community</p>
                <div className="space-y-2">
                  {COMMUNITY_GOALS.map((item) => (
                    <div key={item.goal} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{item.goal}</span>
                      <span className="font-bold text-primary">{item.count} savers</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground text-center pt-1">Names are never shared — only goals.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Progress indicator */}
            <div className="flex items-center gap-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div key={i} className="flex-1 flex items-center gap-1">
                  <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    i + 1 <= step ? "bg-primary" : "bg-muted"
                  }`} />
                </div>
              ))}
              <span className="text-xs text-muted-foreground font-semibold ml-1">{step}/{totalSteps}</span>
            </div>

            {/* Step 1: Select Goal */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="text-center space-y-1">
                  <Target size={32} className="text-primary mx-auto" />
                  <h2 className="text-base font-bold">Select Your Goal</h2>
                  <p className="text-xs text-muted-foreground">What are you saving for?</p>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {GOAL_OPTIONS.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => {
                        setGoalName(opt.label);
                        if (opt.label !== "Other") setCustomGoalName("");
                      }}
                      className={`flex flex-col items-center gap-1.5 text-xs font-semibold p-3 rounded-xl border-2 transition-all ${
                        goalName === opt.label
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border bg-card text-foreground hover:border-muted-foreground/30"
                      }`}
                    >
                      {opt.image ? (
                        <img src={opt.image} alt={opt.label} width={40} height={40} className="object-contain" loading="lazy" />
                      ) : (
                        <Edit3 size={24} className="text-muted-foreground" />
                      )}
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>

                {/* Custom goal input when "Other" is selected */}
                {goalName === "Other" && (
                  <div className="animate-fade-in">
                    <Label className="text-sm font-semibold">Describe your goal</Label>
                    <Input
                      placeholder="e.g. Buy new equipment"
                      value={customGoalName}
                      onChange={(e) => setCustomGoalName(e.target.value)}
                      className="mt-1.5 h-12 text-base"
                      autoFocus
                    />
                  </div>
                )}

                {/* Optional description popover */}
                {goalName && (
                  <Popover open={descPopoverOpen} onOpenChange={setDescPopoverOpen}>
                    <PopoverTrigger asChild>
                      <button className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-primary py-2 hover:underline animate-fade-in">
                        <Edit3 size={14} />
                        {description ? "Edit description" : "Add a short description (optional)"}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-3 space-y-2" align="center">
                      <Label className="text-xs font-semibold">Describe your goal in summary</Label>
                      <Textarea
                        placeholder="e.g. Save for a small plot in Douala by end of year."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="text-sm resize-none"
                      />
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => { setDescription(""); setDescPopoverOpen(false); }}>
                          Clear
                        </Button>
                        <Button size="sm" onClick={() => setDescPopoverOpen(false)}>
                          Save
                        </Button>
                      </div>
                      <p className="text-[10px] text-muted-foreground">Optional — helps you remember the why.</p>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            )}

            {/* Step 2: Target Amount */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div className="text-center space-y-1">
                  <Coins size={32} className="text-primary mx-auto" />
                  <h2 className="text-base font-bold">Target Amount</h2>
                  <p className="text-xs text-muted-foreground">How much do you want to save for "{displayGoalName}"?</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Amount (FCFA)</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 500,000"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    className="mt-1.5 h-12 text-base"
                  />
                </div>
                <div
                  onClick={openWhatsApp}
                  className="flex items-center gap-3 bg-card border border-border rounded-xl p-3.5 cursor-pointer hover:border-primary/40 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                    <MessageCircle size={18} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Need help to budget?</p>
                    <p className="text-xs text-muted-foreground">Chat with us on WhatsApp</p>
                  </div>
                  <ArrowRight size={16} className="text-muted-foreground ml-auto" />
                </div>
              </div>
            )}

            {/* Step 3: Saving Frequency & Amount */}
            {step === 3 && (
              <div className="space-y-5 animate-fade-in">
                <div className="text-center space-y-1">
                  <Calendar size={32} className="text-primary mx-auto" />
                  <h2 className="text-base font-bold">Saving Plan</h2>
                  <p className="text-xs text-muted-foreground">How often will you save?</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Saving Frequency</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {SAVING_FREQUENCIES.map((f) => (
                      <button
                        key={f.value}
                        onClick={() => {
                          setFrequency(f.value);
                          if (savingAmount && Number(savingAmount) < f.min) {
                            setSavingAmount(String(f.min));
                          }
                        }}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${
                          frequency === f.value
                            ? "border-primary bg-primary/5"
                            : "border-border bg-card hover:border-muted-foreground/30"
                        }`}
                      >
                        <p className="text-sm font-bold">{f.label}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Min: {f.min.toLocaleString()} FCFA</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Saving Amount (FCFA)</Label>
                  <Input
                    type="number"
                    placeholder={selectedFreq ? `Min ${selectedFreq.min.toLocaleString()} FCFA` : "Select frequency first"}
                    value={savingAmount}
                    onChange={(e) => setSavingAmount(e.target.value)}
                    className="mt-1.5 h-12 text-base"
                  />
                  {selectedFreq && savingAmount && Number(savingAmount) < selectedFreq.min && (
                    <p className="text-xs text-destructive mt-1">
                      Minimum {selectedFreq.label.toLowerCase()} saving is {selectedFreq.min.toLocaleString()} FCFA
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Duration & Auto-deposit */}
            {step === 4 && (() => {
              const parseDuration = (d: string) => {
                const num = parseInt(d) || 0;
                const lower = d.toLowerCase();
                if (lower.includes("day")) return num;
                if (lower.includes("week")) return num * 7;
                if (lower.includes("month")) return num * 30;
                if (lower.includes("year")) return num * 365;
                return num * 30; // default to months
              };

              const freqPeriodsPerDay: Record<string, number> = { daily: 1, weekly: 1 / 7, monthly: 1 / 30 };
              const freqLabel: Record<string, string> = { daily: "days", weekly: "weeks", monthly: "months" };

              const totalDays = parseDuration(duration);
              const periodsInDuration = frequency ? Math.floor(totalDays * (freqPeriodsPerDay[frequency] || 0)) : 0;
              const totalSaved = periodsInDuration * (Number(savingAmount) || 0);
              const target = Number(targetAmount) || 0;
              const shortfall = target - totalSaved;
              const meetsTarget = totalSaved >= target && target > 0;

              const neededPeriods = (Number(savingAmount) || 0) > 0 ? Math.ceil(target / Number(savingAmount)) : 0;

              return (
              <div className="space-y-5 animate-fade-in">
                <div className="text-center space-y-1">
                  <Target size={32} className="text-primary mx-auto" />
                  <h2 className="text-base font-bold">Final Details</h2>
                  <p className="text-xs text-muted-foreground">Set your timeline and preferences</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Duration (e.g. 6 months, 90 days)</Label>
                  <Input
                    placeholder="e.g. 6 months"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="mt-1.5 h-12 text-base"
                  />
                </div>
                <div className="flex items-center justify-between bg-card border border-border rounded-xl p-4">
                  <div>
                    <Label className="text-sm font-semibold">Auto-deposit</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">Automatically save {frequency}</p>
                  </div>
                  <Switch checked={autoDeposit} onCheckedChange={setAutoDeposit} />
                </div>

                {/* Summary */}
                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-2">
                  <p className="text-xs font-bold text-foreground">Summary</p>
                  <div className="grid grid-cols-2 gap-y-1.5 text-xs">
                    <span className="text-muted-foreground">Goal</span>
                    <span className="font-semibold text-right">{displayGoalName}</span>
                    <span className="text-muted-foreground">Target</span>
                    <span className="font-semibold text-right">{target.toLocaleString()} FCFA</span>
                    <span className="text-muted-foreground">Saving</span>
                    <span className="font-semibold text-right">{Number(savingAmount).toLocaleString()} FCFA / {frequency}</span>
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-semibold text-right">{duration || "—"}</span>
                    {duration && (
                      <>
                        <span className="text-muted-foreground">Total savings</span>
                        <span className={`font-semibold text-right ${meetsTarget ? "text-green-600" : "text-destructive"}`}>
                          {totalSaved.toLocaleString()} FCFA
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Target analysis */}
                {duration && target > 0 && Number(savingAmount) > 0 && (
                  <>
                    {meetsTarget ? (
                      <div className="flex items-start gap-3 bg-green-500/10 border border-green-500/20 rounded-xl p-3.5">
                        <CheckCircle2 size={18} className="text-green-600 shrink-0 mt-0.5" />
                        <div className="text-xs">
                          <p className="font-bold text-green-700 dark:text-green-400">On track! 🎉</p>
                          <p className="text-muted-foreground mt-0.5">
                            Saving {Number(savingAmount).toLocaleString()} FCFA {frequency} for {duration} will reach your target.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/20 rounded-xl p-3.5">
                        <AlertTriangle size={18} className="text-destructive shrink-0 mt-0.5" />
                        <div className="text-xs space-y-1.5">
                          <p className="font-bold text-destructive">Shortfall of {shortfall.toLocaleString()} FCFA</p>
                          <p className="text-muted-foreground">
                            At {Number(savingAmount).toLocaleString()} FCFA / {frequency} for {duration}, you'll only save {totalSaved.toLocaleString()} FCFA — which is below your {target.toLocaleString()} FCFA target.
                          </p>
                          <p className="text-foreground font-semibold">
                            💡 You need <span className="text-primary">{neededPeriods} {freqLabel[frequency] || "periods"}</span> at {Number(savingAmount).toLocaleString()} FCFA/{frequency} to reach your goal.
                          </p>
                          <p className="text-muted-foreground">You can still create this goal and adjust later.</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
              );
            })()}

            {/* Navigation buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => step === 1 ? resetForm() : setStep(step - 1)}
                className="flex-1 h-12 font-bold"
              >
                <ArrowLeft size={16} className="mr-1" />
                {step === 1 ? "Cancel" : "Back"}
              </Button>
              {step < totalSteps ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={!canNext()}
                  className="flex-1 h-12 gradient-primary text-primary-foreground font-bold"
                >
                  Next <ArrowRight size={16} className="ml-1" />
                </Button>
              ) : (
                <Button
                  onClick={handleCreate}
                  disabled={!duration}
                  className="flex-1 h-12 gradient-primary text-primary-foreground font-bold"
                >
                  Create Goal
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Goal summary dialog */}
      <Dialog open={!!selectedGoal} onOpenChange={(o) => !o && setSelectedGoal(null)}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          {selectedGoal && (() => {
            const pct = Math.round((selectedGoal.saved / selectedGoal.target) * 100);
            const remaining = selectedGoal.target - selectedGoal.saved;
            return (
              <div className="flex flex-col">
                {/* Top: balance + actions */}
                <div className="gradient-primary text-primary-foreground p-5 space-y-4">
                  <div>
                    <p className="text-xs opacity-80 font-medium">Goal Balance</p>
                    <p className="text-2xl font-bold tracking-tight">
                      {selectedGoal.saved.toLocaleString()}
                      <span className="text-sm ml-1 font-semibold opacity-80">FCFA</span>
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => { setSelectedGoal(null); navigate("/deposit"); }}
                      className="flex flex-col items-center gap-1 bg-primary-foreground/15 hover:bg-primary-foreground/25 rounded-xl py-2.5 transition-colors"
                    >
                      <ArrowDownToLine size={18} />
                      <span className="text-[11px] font-semibold">Deposit</span>
                    </button>
                    <button
                      onClick={() => { setSelectedGoal(null); navigate("/withdraw"); }}
                      className="flex flex-col items-center gap-1 bg-primary-foreground/15 hover:bg-primary-foreground/25 rounded-xl py-2.5 transition-colors"
                    >
                      <ArrowUpFromLine size={18} />
                      <span className="text-[11px] font-semibold">Withdraw</span>
                    </button>
                    <div className="flex flex-col items-center gap-1 bg-primary-foreground/15 rounded-xl py-2.5">
                      <Wallet size={18} />
                      <span className="text-[11px] font-semibold">Balance</span>
                    </div>
                  </div>
                </div>

                {/* Summary body */}
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target size={18} className="text-primary" />
                      <h3 className="font-bold text-base">{selectedGoal.name}</h3>
                    </div>
                    {selectedGoal.autoDeposit && (
                      <span className="bg-success/10 text-success px-2 py-0.5 rounded-full text-[10px] font-bold">Auto</span>
                    )}
                  </div>

                  <Progress value={pct} className="h-2" />
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{selectedGoal.saved.toLocaleString()} / {selectedGoal.target.toLocaleString()} FCFA</span>
                    <span className="font-bold text-primary">{pct}%</span>
                  </div>

                  <div className="bg-muted/50 border border-border rounded-xl p-3 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Target</span>
                      <span className="font-semibold">{selectedGoal.target.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Remaining</span>
                      <span className="font-semibold">{remaining.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-semibold">{selectedGoal.duration}</span>
                    </div>
                    {selectedGoal.frequency && selectedGoal.savingAmount && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Saving plan</span>
                        <span className="font-semibold">{selectedGoal.savingAmount.toLocaleString()} FCFA / {selectedGoal.frequency}</span>
                      </div>
                    )}
                    {selectedGoal.description && (
                      <div className="pt-1.5 border-t border-border">
                        <p className="text-muted-foreground mb-0.5">Description</p>
                        <p className="text-foreground">{selectedGoal.description}</p>
                      </div>
                    )}
                  </div>

                  <p className="text-[10px] text-muted-foreground text-center">
                    Goal balance is locked and not shown on your home screen.
                  </p>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* PIN gate before viewing goal summary */}
      <Dialog open={!!pinPromptGoal} onOpenChange={(o) => { if (!o) { setPinPromptGoal(null); setPinValue(""); } }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock size={18} className="text-primary" /> Enter PIN
            </DialogTitle>
            <DialogDescription>
              For your security, enter your 4-digit PIN to view this goal's summary.
            </DialogDescription>
          </DialogHeader>
          <Input
            type="password"
            inputMode="numeric"
            maxLength={4}
            placeholder="••••"
            value={pinValue}
            onChange={(e) => setPinValue(e.target.value.replace(/\D/g, ""))}
            className="text-center text-xl tracking-[1em] h-12"
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setPinPromptGoal(null); setPinValue(""); }}>Cancel</Button>
            <Button
              onClick={() => {
                if (pinValue.length !== 4) {
                  toast.error("Enter your 4-digit PIN");
                  return;
                }
                setSelectedGoal(pinPromptGoal);
                setPinPromptGoal(null);
                setPinValue("");
              }}
              className="gradient-primary text-primary-foreground"
            >
              Unlock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Post-create: prompt for first deposit */}
      <Dialog open={!!postCreateGoal} onOpenChange={(o) => !o && setPostCreateGoal(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-600" /> Goal Created!
            </DialogTitle>
            <DialogDescription>
              Would you like to make your first deposit to <span className="font-semibold text-foreground">"{postCreateGoal}"</span> now, or do it later?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setPostCreateGoal(null)} className="flex-1">
              Later
            </Button>
            <Button
              onClick={() => { setPostCreateGoal(null); navigate("/deposit"); }}
              className="flex-1 gradient-primary text-primary-foreground"
            >
              <ArrowDownToLine size={16} className="mr-1" /> Deposit Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GoalSavings;
