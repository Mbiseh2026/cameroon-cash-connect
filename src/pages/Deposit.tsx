import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Phone } from "lucide-react";

type Method = "mtn" | "orange";

const Deposit = () => {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<Method>("mtn");
  const [phone, setPhone] = useState("");
  const [accountName, setAccountName] = useState("");

  const [phoneDialog, setPhoneDialog] = useState<null | Method>(null);
  const [phoneInput, setPhoneInput] = useState("");
  const [nameInput, setNameInput] = useState("");

  const selectMethod = (key: Method) => {
    setPhoneInput(method === key ? phone : "");
    setNameInput(method === key ? accountName : "");
    setPhoneDialog(key);
  };

  const confirmPhone = () => {
    const cleaned = phoneInput.replace(/\s+/g, "");
    if (!/^\d{9}$/.test(cleaned)) {
      toast.error("Enter a valid 9-digit phone number");
      return;
    }
    if (!nameInput.trim()) {
      toast.error("Enter the account name");
      return;
    }
    setMethod(phoneDialog!);
    setPhone(cleaned);
    setAccountName(nameInput.trim());
    setPhoneDialog(null);
  };

  const handleDeposit = () => {
    const num = Number(amount);
    if (!num || num < 100) {
      toast.error("Minimum deposit is 100 FCFA");
      return;
    }
    if (!phone) {
      toast.error(`Add your ${method.toUpperCase()} phone number`);
      return;
    }
    toast.success(`Deposit of ${num.toLocaleString()} FCFA initiated via ${method.toUpperCase()}`);
    setAmount("");
  };

  const methods: { key: Method; label: string; color: string }[] = [
    { key: "mtn", label: "MTN Mobile Money", color: "bg-warning" },
    { key: "orange", label: "Orange Money", color: "bg-destructive" },
  ];

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
              {methods.map((m) => {
                const active = method === m.key;
                return (
                  <button
                    key={m.key}
                    onClick={() => selectMethod(m.key)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                      active ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card"
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full ${m.color}`} />
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{m.label}</div>
                      {active && phone ? (
                        <div className="text-xs text-muted-foreground mt-0.5">
                          +237 {phone} • {accountName}
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground mt-0.5">Tap to add phone number</div>
                      )}
                    </div>
                  </button>
                );
              })}
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

      <Dialog open={!!phoneDialog} onOpenChange={(o) => { if (!o) setPhoneDialog(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Phone size={18} className="text-primary" />
              {phoneDialog === "mtn" ? "MTN Mobile Money" : "Orange Money"}
            </DialogTitle>
            <DialogDescription>
              Enter the phone number and account name to debit.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-semibold">Phone number</Label>
              <div className="flex items-center gap-2 mt-1">
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
            </div>
            <div>
              <Label className="text-xs font-semibold">Account name</Label>
              <Input
                placeholder="Full name on the mobile money account"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="mt-1 h-11"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPhoneDialog(null)}>Cancel</Button>
            <Button onClick={confirmPhone} className="gradient-primary text-primary-foreground">Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Deposit;
