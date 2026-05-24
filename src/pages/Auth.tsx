import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ChevronLeft, MessageCircle, Phone, Mail, KeyRound, ShieldCheck } from "lucide-react";
import Stepper from "@/components/Stepper";
import { setUser, VerifyChannel } from "@/lib/userStore";
import logo from "@/assets/eduvest-logo.png";

const STEPS = ["Phone", "Verify", "Email", "PIN", "Confirm"];

const Auth = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const [phone, setPhone] = useState("");
  const [channel, setChannel] = useState<VerifyChannel>("sms");
  const [primaryPay, setPrimaryPay] = useState(true);

  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [verifyEmailNow, setVerifyEmailNow] = useState(false);

  const [pin, setPin] = useState("");
  const [pin2, setPin2] = useState("");

  const back = () => (step === 0 ? navigate("/welcome") : setStep((s) => s - 1));

  const next = () => {
    if (step === 0) {
      if (!/^\d{9}$/.test(phone)) return toast.error("Enter a valid 9-digit number");
      toast.success(`Code sent via ${channel === "whatsapp" ? "WhatsApp" : "SMS"} (demo: 1234)`);
      setStep(1);
      return;
    }
    if (step === 1) {
      if (otp !== "1234") return toast.error("Wrong code. Demo code is 1234");
      setStep(2);
      return;
    }
    if (step === 2) {
      if (email && !/^\S+@\S+\.\S+$/.test(email)) return toast.error("Invalid email");
      setStep(3);
      return;
    }
    if (step === 3) {
      if (pin.length !== 4) return toast.error("PIN must be 4 digits");
      setStep(4);
      return;
    }
    if (step === 4) {
      if (pin2 !== pin) return toast.error("PINs don't match");
      localStorage.setItem("userPin", pin);
      setUser({
        phone,
        verifyChannel: channel,
        phoneVerified: true,
        phoneIsPrimaryPay: primaryPay,
        email: email || undefined,
        emailVerified: email ? verifyEmailNow : false,
      });
      toast.success("Account created");
      navigate("/onboarding");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="max-w-md mx-auto px-4 pt-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={back} className="p-2 rounded-xl bg-card border border-border hover:bg-muted">
            <ChevronLeft size={20} />
          </button>
          <img src={logo} alt="Eduvest" className="h-9 w-auto" />
          <div className="ml-auto text-[11px] text-muted-foreground font-semibold">Step {step + 1}/5</div>
        </div>

        <Stepper steps={STEPS} current={step} />

        {step === 0 && (
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-bold">Your mobile number</h2>
              <p className="text-xs text-muted-foreground">We use it to sign you in and confirm payments.</p>
            </div>
            <div>
              <Label className="text-sm font-semibold">Phone number</Label>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-sm font-semibold text-muted-foreground">+237</span>
                <Input type="tel" inputMode="numeric" maxLength={9} placeholder="6XX XXX XXX" value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} className="h-12" autoFocus />
              </div>
            </div>
            <div>
              <Label className="text-sm font-semibold mb-2 block">Verify code via</Label>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setChannel("whatsapp")}
                  className={`p-3 rounded-xl border text-left ${channel === "whatsapp" ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
                  <MessageCircle size={18} className="text-primary mb-1" />
                  <p className="text-sm font-bold">WhatsApp</p>
                  <p className="text-[10px] text-muted-foreground">Free if you have data</p>
                </button>
                <button onClick={() => setChannel("sms")}
                  className={`p-3 rounded-xl border text-left ${channel === "sms" ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
                  <Phone size={18} className="text-primary mb-1" />
                  <p className="text-sm font-bold">SMS</p>
                  <p className="text-[10px] text-muted-foreground">Works without internet</p>
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
              <div className="pr-2">
                <p className="text-xs font-bold">Use this number as my primary payment number</p>
                <p className="text-[10px] text-muted-foreground">MoMo / Orange deposits & withdrawals will default to this number.</p>
              </div>
              <Switch checked={primaryPay} onCheckedChange={setPrimaryPay} />
            </div>
          </section>
        )}

        {step === 1 && (
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-bold">Enter the 4-digit code</h2>
              <p className="text-xs text-muted-foreground">
                Sent to +237 {phone} via {channel === "whatsapp" ? "WhatsApp" : "SMS"}. Demo code: <b>1234</b>
              </p>
            </div>
            <Input type="tel" inputMode="numeric" maxLength={4} placeholder="••••" value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="text-center text-2xl tracking-[1em] h-14" autoFocus />
            <button onClick={() => toast.success("Code resent")} className="text-xs font-semibold text-primary">
              Didn't get it? Resend
            </button>
          </section>
        )}

        {step === 2 && (
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-bold">Add your email <span className="text-xs font-normal text-muted-foreground">(optional)</span></h2>
              <p className="text-xs text-muted-foreground">For receipts, password recovery and Trust Score reports.</p>
            </div>
            <div>
              <Label className="text-sm font-semibold flex items-center gap-1"><Mail size={14} /> Email</Label>
              <Input type="email" placeholder="you@example.com" value={email}
                onChange={(e) => setEmail(e.target.value)} className="mt-1.5 h-12" />
            </div>
            {email && (
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                <div className="pr-2">
                  <p className="text-xs font-bold">Verify email now</p>
                  <p className="text-[10px] text-muted-foreground">If you skip, we'll remind you in your Profile.</p>
                </div>
                <Switch checked={verifyEmailNow} onCheckedChange={setVerifyEmailNow} />
              </div>
            )}
            {!email && (
              <p className="text-[11px] text-muted-foreground">No email? You can add one later from Profile.</p>
            )}
          </section>
        )}

        {step === 3 && (
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2"><KeyRound size={18} className="text-primary" /> Create your 4-digit PIN</h2>
              <p className="text-xs text-muted-foreground">Used to authorise every payment. Don't share it.</p>
            </div>
            <Input type="password" inputMode="numeric" maxLength={4} placeholder="••••" value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              className="text-center text-2xl tracking-[1em] h-14" autoFocus />
          </section>
        )}

        {step === 4 && (
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2"><ShieldCheck size={18} className="text-primary" /> Confirm your PIN</h2>
              <p className="text-xs text-muted-foreground">Re-enter the same 4-digit PIN.</p>
            </div>
            <Input type="password" inputMode="numeric" maxLength={4} placeholder="••••" value={pin2}
              onChange={(e) => setPin2(e.target.value.replace(/\D/g, ""))}
              className="text-center text-2xl tracking-[1em] h-14" autoFocus />
          </section>
        )}

        <Button onClick={next} className="w-full h-12 mt-6 gradient-primary text-primary-foreground font-bold">
          {step === 4 ? "Create account" : "Continue"}
        </Button>
        <p className="text-[10px] text-muted-foreground text-center mt-3">
          By continuing you accept Eduvest's Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
};
export default Auth;
