import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

const Deposit = () => {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"mtn" | "orange" | "bank">("mtn");

  const handleDeposit = () => {
    const num = Number(amount);
    if (!num || num < 100) {
      toast.error("Minimum deposit is 100 FCFA");
      return;
    }
    toast.success(`Deposit of ${Number(amount).toLocaleString()} FCFA initiated via ${method.toUpperCase()}`);
    setAmount("");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 pt-6 animate-fade-in">
        <PageHeader title="Deposit / Top Up" subtitle="Add money to your wallet" />

        <div className="space-y-5">
          <div>
            <Label className="text-sm font-semibold">Amount (FCFA)</Label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1.5 text-lg font-bold h-12"
            />
          </div>

          <div>
            <Label className="text-sm font-semibold mb-2 block">Funding Method</Label>
            <div className="space-y-2">
              {[
                { key: "mtn" as const, label: "MTN Mobile Money", color: "bg-warning" },
                { key: "orange" as const, label: "Orange Money", color: "bg-destructive" },
                { key: "bank" as const, label: "Bank Transfer", color: "bg-navy" },
              ].map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMethod(m.key)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    method === m.key
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-card"
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${m.color}`} />
                  <span className="text-sm font-semibold">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {amount && Number(amount) >= 100 && (
            <div className="bg-muted rounded-xl p-3 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-bold">{Number(amount).toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fees</span>
                <span className="font-bold text-success">Free</span>
              </div>
            </div>
          )}

          <Button onClick={handleDeposit} className="w-full h-12 text-base font-bold gradient-primary text-primary-foreground">
            Confirm Deposit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Deposit;
