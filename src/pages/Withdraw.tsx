import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

const Withdraw = () => {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"mtn" | "orange" | "bank">("mtn");
  const [pin, setPin] = useState("");

  const handleWithdraw = () => {
    const num = Number(amount);
    if (!num || num < 500) {
      toast.error("Minimum withdrawal is 500 FCFA");
      return;
    }
    if (pin.length !== 4) {
      toast.error("Enter your 4-digit PIN");
      return;
    }
    toast.success(`Withdrawal of ${num.toLocaleString()} FCFA initiated`);
    setAmount("");
    setPin("");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 pt-6 animate-fade-in">
        <PageHeader title="Withdraw" subtitle="Move wallet funds out" />

        <div className="space-y-5">
          <div>
            <Label className="text-sm font-semibold">Amount (FCFA)</Label>
            <Input type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1.5 text-lg font-bold h-12" />
            <p className="text-xs text-muted-foreground mt-1">Daily limit: 500,000 FCFA</p>
          </div>

          <div>
            <Label className="text-sm font-semibold mb-2 block">Withdrawal Method</Label>
            <div className="space-y-2">
              {[
                { key: "mtn" as const, label: "MTN Mobile Money" },
                { key: "orange" as const, label: "Orange Money" },
                { key: "bank" as const, label: "Bank Transfer" },
              ].map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMethod(m.key)}
                  className={`w-full text-left p-3 rounded-xl border text-sm font-semibold transition-all ${
                    method === m.key ? "border-primary bg-primary/5" : "border-border bg-card"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-semibold">Confirm PIN</Label>
            <Input type="password" maxLength={4} placeholder="••••" value={pin} onChange={(e) => setPin(e.target.value)} className="mt-1.5 text-center text-xl tracking-[1em] h-12" />
          </div>

          <Button onClick={handleWithdraw} className="w-full h-12 text-base font-bold gradient-primary text-primary-foreground">
            Confirm Withdrawal
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
