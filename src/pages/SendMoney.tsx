import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

const methods = [
  { key: "treasurit", label: "Treasurit User" },
  { key: "momo", label: "Mobile Money" },
  { key: "bank", label: "Bank Transfer" },
  { key: "intl", label: "International Transfer" },
];

const SendMoney = () => {
  const [method, setMethod] = useState("treasurit");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [pin, setPin] = useState("");

  const handleSend = () => {
    if (!recipient || !amount) {
      toast.error("Please fill recipient and amount");
      return;
    }
    if (Number(amount) < 100) {
      toast.error("Minimum amount is 100 FCFA");
      return;
    }
    if (pin.length !== 4) {
      toast.error("Enter your 4-digit PIN");
      return;
    }
    toast.success(`${Number(amount).toLocaleString()} FCFA sent to ${recipient}`);
    setRecipient("");
    setAmount("");
    setReason("");
    setPin("");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 pt-6 animate-fade-in">
        <PageHeader title="Send Money" subtitle="Transfer funds securely" />

        <div className="space-y-5">
          <div>
            <Label className="text-sm font-semibold mb-2 block">How do you want to send?</Label>
            <div className="grid grid-cols-2 gap-2">
              {methods.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMethod(m.key)}
                  className={`text-xs font-semibold p-3 rounded-xl border transition-all ${
                    method === m.key ? "border-primary bg-primary/5" : "border-border bg-card"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-semibold">
              {method === "treasurit" ? "Name or Phone" : method === "momo" ? "Mobile Money Number" : "Account Details"}
            </Label>
            <Input
              placeholder={method === "momo" ? "e.g. 6XX XXX XXX" : "Search contact..."}
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="mt-1.5"
            />
          </div>

          {method === "momo" && (
            <div>
              <Label className="text-sm font-semibold mb-2 block">Network</Label>
              <div className="flex gap-2">
                <button className="flex-1 p-2.5 rounded-xl border border-warning bg-warning/5 text-xs font-bold">MTN MoMo</button>
                <button className="flex-1 p-2.5 rounded-xl border border-destructive bg-destructive/5 text-xs font-bold">Orange Money</button>
              </div>
            </div>
          )}

          <div>
            <Label className="text-sm font-semibold">Amount (FCFA)</Label>
            <Input type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1.5 text-lg font-bold h-12" />
          </div>

          <div>
            <Label className="text-sm font-semibold">Reason (Optional)</Label>
            <Input placeholder="e.g. Family, Business" value={reason} onChange={(e) => setReason(e.target.value)} className="mt-1.5" />
          </div>

          <div>
            <Label className="text-sm font-semibold">PIN Code</Label>
            <Input type="password" maxLength={4} placeholder="••••" value={pin} onChange={(e) => setPin(e.target.value)} className="mt-1.5 text-center text-xl tracking-[1em] h-12" />
          </div>

          <Button onClick={handleSend} className="w-full h-12 text-base font-bold gradient-primary text-primary-foreground">
            Send Money
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SendMoney;
