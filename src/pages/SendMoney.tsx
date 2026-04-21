import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Phone } from "lucide-react";

const methods = [
  { key: "treasurit", label: "Treasurit User" },
  { key: "mtn", label: "MTN MoMo" },
  { key: "orange", label: "Orange Money" },
];

const SendMoney = () => {
  const [method, setMethod] = useState("treasurit");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [pin, setPin] = useState("");

  const [phoneDialog, setPhoneDialog] = useState<null | "mtn" | "orange">(null);
  const [phoneInput, setPhoneInput] = useState("");

  const selectMethod = (key: string) => {
    if (key === "mtn" || key === "orange") {
      setPhoneInput(method === key ? recipient : "");
      setPhoneDialog(key);
      return;
    }
    setMethod(key);
    setRecipient("");
  };

  const confirmPhone = () => {
    const cleaned = phoneInput.replace(/\s+/g, "");
    if (!/^\d{9}$/.test(cleaned)) {
      toast.error("Enter a valid 9-digit phone number");
      return;
    }
    setMethod(phoneDialog!);
    setRecipient(cleaned);
    setPhoneDialog(null);
    setPhoneInput("");
  };

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

  const recipientLabel =
    method === "treasurit" ? "Name or Phone" :
    method === "mtn" ? "MTN MoMo Number" : "Orange Money Number";

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 pt-6 animate-fade-in">
        <PageHeader title="Send Money" subtitle="Transfer funds securely" />

        <div className="space-y-5">
          <div>
            <Label className="text-sm font-semibold mb-2 block">How do you want to send?</Label>
            <div className="grid grid-cols-3 gap-2">
              {methods.map((m) => (
                <button
                  key={m.key}
                  onClick={() => selectMethod(m.key)}
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
            <Label className="text-sm font-semibold">{recipientLabel}</Label>
            <Input
              placeholder={method === "treasurit" ? "Search contact..." : "e.g. 6XX XXX XXX"}
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="mt-1.5"
            />
          </div>

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

      {/* Phone number dialog for MoMo / Orange */}
      <Dialog open={!!phoneDialog} onOpenChange={(o) => { if (!o) { setPhoneDialog(null); setPhoneInput(""); } }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Phone size={18} className="text-primary" />
              {phoneDialog === "mtn" ? "MTN MoMo Number" : "Orange Money Number"}
            </DialogTitle>
            <DialogDescription>
              Enter the recipient's 9-digit phone number.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-muted-foreground">+237</span>
            <Input
              type="tel"
              inputMode="numeric"
              maxLength={9}
              placeholder="6XX XXX XXX"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ""))}
              className="h-12 text-base font-semibold tracking-wider"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setPhoneDialog(null); setPhoneInput(""); }}>Cancel</Button>
            <Button onClick={confirmPhone} className="gradient-primary text-primary-foreground">Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SendMoney;
