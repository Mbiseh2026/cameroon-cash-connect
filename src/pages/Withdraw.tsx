import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Phone } from "lucide-react";

type Method = "mtn" | "orange" | "treasurit";

const Withdraw = () => {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<Method>("mtn");
  const [pin, setPin] = useState("");

  const [phone, setPhone] = useState("");
  const [accountName, setAccountName] = useState("");
  const [treasuritAccount, setTreasuritAccount] = useState("");

  const [phoneDialog, setPhoneDialog] = useState<null | "mtn" | "orange">(null);
  const [phoneInput, setPhoneInput] = useState("");
  const [nameInput, setNameInput] = useState("");

  const selectMethod = (key: Method) => {
    if (key === "mtn" || key === "orange") {
      setPhoneInput(method === key ? phone : "");
      setNameInput(method === key ? accountName : "");
      setPhoneDialog(key);
      return;
    }
    setMethod(key);
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

  const handleWithdraw = () => {
    const num = Number(amount);
    if (!num || num < 500) {
      toast.error("Minimum withdrawal is 500 FCFA");
      return;
    }
    if ((method === "mtn" || method === "orange") && !phone) {
      toast.error(`Add your ${method.toUpperCase()} phone number`);
      return;
    }
    if (method === "treasurit" && !treasuritAccount.trim()) {
      toast.error("Enter the Treasurit account");
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

  const options: { key: Method; label: string }[] = [
    { key: "mtn", label: "MTN Mobile Money" },
    { key: "orange", label: "Orange Money" },
    { key: "treasurit", label: "Treasurit User" },
  ];

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
              {options.map((m) => {
                const active = method === m.key;
                const isMobile = m.key === "mtn" || m.key === "orange";
                return (
                  <button
                    key={m.key}
                    onClick={() => selectMethod(m.key)}
                    className={`w-full text-left p-3 rounded-xl border text-sm font-semibold transition-all ${
                      active ? "border-primary bg-primary/5" : "border-border bg-card"
                    }`}
                  >
                    <div>{m.label}</div>
                    {active && isMobile && phone && (
                      <div className="text-xs font-normal text-muted-foreground mt-0.5">
                        +237 {phone} • {accountName}
                      </div>
                    )}
                    {active && isMobile && !phone && (
                      <div className="text-xs font-normal text-muted-foreground mt-0.5">Tap to add phone number</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {method === "treasurit" && (
            <div>
              <Label className="text-sm font-semibold">Treasurit account</Label>
              <Input
                placeholder="Username, phone or account ID"
                value={treasuritAccount}
                onChange={(e) => setTreasuritAccount(e.target.value)}
                className="mt-1.5"
                maxLength={80}
              />
            </div>
          )}

          <div>
            <Label className="text-sm font-semibold">Confirm PIN</Label>
            <Input type="password" maxLength={4} placeholder="••••" value={pin} onChange={(e) => setPin(e.target.value)} className="mt-1.5 text-center text-xl tracking-[1em] h-12" />
          </div>

          <Button onClick={handleWithdraw} className="w-full h-12 text-base font-bold gradient-primary text-primary-foreground">
            Confirm Withdrawal
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
            <DialogDescription>Enter the phone number and account name to receive funds.</DialogDescription>
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
                maxLength={80}
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

export default Withdraw;
