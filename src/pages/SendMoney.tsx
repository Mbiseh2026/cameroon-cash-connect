import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Phone } from "lucide-react";

type Method = "treasurit" | "mtn" | "orange";

const methods: { key: Method; label: string }[] = [
  { key: "treasurit", label: "Treasurit User" },
  { key: "mtn", label: "MTN MoMo" },
  { key: "orange", label: "Orange Money" },
];

const SendMoney = () => {
  const [method, setMethod] = useState<Method>("treasurit");
  const [recipient, setRecipient] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [pin, setPin] = useState("");

  const [phoneDialog, setPhoneDialog] = useState<null | "mtn" | "orange">(null);
  const [phoneInput, setPhoneInput] = useState("");
  const [nameInput, setNameInput] = useState("");

  const selectMethod = (key: Method) => {
    if (key === "mtn" || key === "orange") {
      setPhoneInput(method === key ? recipient : "");
      setNameInput(method === key ? recipientName : "");
      setPhoneDialog(key);
      return;
    }
    setMethod(key);
    setRecipient("");
    setRecipientName("");
  };

  const confirmPhone = () => {
    const cleaned = phoneInput.replace(/\s+/g, "");
    if (!/^\d{9}$/.test(cleaned)) {
      toast.error("Enter a valid 9-digit phone number");
      return;
    }
    if (!nameInput.trim()) {
      toast.error("Enter the recipient's name");
      return;
    }
    setMethod(phoneDialog!);
    setRecipient(cleaned);
    setRecipientName(nameInput.trim());
    setPhoneDialog(null);
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
    const target = recipientName ? `${recipientName} (+237 ${recipient})` : recipient;
    toast.success(`${Number(amount).toLocaleString()} FCFA sent to ${target}`);
    setRecipient("");
    setRecipientName("");
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
            <div className="grid grid-cols-3 gap-2">
              {methods.map((m) => {
                const active = method === m.key;
                return (
                  <button
                    key={m.key}
                    onClick={() => selectMethod(m.key)}
                    className={`text-xs font-semibold p-3 rounded-xl border transition-all ${
                      active ? "border-primary bg-primary/5" : "border-border bg-card"
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
            {(method === "mtn" || method === "orange") && recipient && (
              <p className="text-xs text-muted-foreground mt-2">
                Recipient: <span className="font-semibold text-foreground">{recipientName}</span> · +237 {recipient}
              </p>
            )}
          </div>

          {method === "treasurit" && (
            <div>
              <Label className="text-sm font-semibold">Treasurit account</Label>
              <Input
                placeholder="Search by name, @username or phone"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="mt-1.5"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Tip: names aren't unique — use a username or phone for accuracy.
              </p>
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

      <Dialog open={!!phoneDialog} onOpenChange={(o) => { if (!o) setPhoneDialog(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Phone size={18} className="text-primary" />
              {phoneDialog === "mtn" ? "MTN MoMo Recipient" : "Orange Money Recipient"}
            </DialogTitle>
            <DialogDescription>Enter the recipient's phone number and name.</DialogDescription>
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
              <Label className="text-xs font-semibold">Recipient name</Label>
              <Input
                placeholder="Full name on the account"
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

export default SendMoney;
