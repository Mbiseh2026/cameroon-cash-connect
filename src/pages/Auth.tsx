import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ChevronLeft, MessageCircle, Phone, Mail, KeyRound, ShieldCheck, UserCircle2, AtSign, LogIn, UserPlus } from "lucide-react";
import Stepper from "@/components/Stepper";
import { setUser, VerifyChannel, getUser } from "@/lib/userStore";
import { useLang } from "@/lib/i18n";
import logo from "@/assets/eduvest-logo.png";

type Mode = "signup" | "signin";

const Auth = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { t } = useLang();
  const [mode, setMode] = useState<Mode>(params.get("mode") === "login" ? "signin" : "signup");

  // ----- SIGN IN (lightweight) -----
  const [siPhone, setSiPhone] = useState("");
  const [siPin, setSiPin] = useState("");
  const doSignIn = () => {
    if (!/^\d{9}$/.test(siPhone)) return toast.error(t("err_phone"));
    if (siPin.length !== 4) return toast.error(t("err_pin_len"));
    const u = getUser();
    const savedPin = localStorage.getItem("userPin");
    if (!u.phone || u.phone !== siPhone || savedPin !== siPin) {
      return toast.error("No matching account on this device");
    }
    toast.success("Welcome back");
    navigate("/");
  };

  // ----- SIGN UP (4 screens + 2 popups) -----
  const [step, setStep] = useState(0); // 0 identity, 1 phone, 2 email, 3 pin
  const STEPS = [t("s_identity"), t("s_phone"), t("s_email"), t("s_pin")];

  // identity
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("Cameroon");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");

  // phone + otp popup
  const [phone, setPhone] = useState("");
  const [channel, setChannel] = useState<VerifyChannel>("sms");
  const [primaryPay, setPrimaryPay] = useState(true);
  const [otpOpen, setOtpOpen] = useState(false);
  const [otp, setOtp] = useState("");

  // email + username
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [verifyEmailNow, setVerifyEmailNow] = useState(false);

  // pin + confirm popup
  const [pin, setPin] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pin2, setPin2] = useState("");

  const back = () => (step === 0 ? navigate("/welcome") : setStep((s) => s - 1));

  const next = () => {
    if (step === 0) {
      if (!firstName.trim() || !lastName.trim() || !country.trim() || !region.trim() || !city.trim())
        return toast.error(t("err_required"));
      setStep(1);
      return;
    }
    if (step === 1) {
      if (!/^\d{9}$/.test(phone)) return toast.error(t("err_phone"));
      toast.success(`${t("ok_otp_sent")} · ${t("otp_demo")}: 1234`);
      setOtp(""); setOtpOpen(true);
      return;
    }
    if (step === 2) {
      if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error(t("err_email"));
      if (!username.trim()) return toast.error(t("err_required"));
      setStep(3);
      return;
    }
    if (step === 3) {
      if (pin.length !== 4) return toast.error(t("err_pin_len"));
      setPin2(""); setConfirmOpen(true);
    }
  };

  const verifyOtp = () => {
    if (otp !== "1234") return toast.error(t("otp_wrong"));
    setOtpOpen(false);
    setStep(2);
  };

  const finalizeAccount = () => {
    if (pin2 !== pin) return toast.error(t("err_pin_match"));
    localStorage.setItem("userPin", pin);
    setUser({
      firstName, lastName, country, region, city,
      phone, verifyChannel: channel, phoneVerified: true, phoneIsPrimaryPay: primaryPay,
      email, username, emailVerified: verifyEmailNow,
    });
    setConfirmOpen(false);
    toast.success(t("account_created"));
    navigate("/onboarding");
  };

  // ----- shared header with sign-up / sign-in tabs -----
  const Header = (
    <div className="flex items-center gap-3 mb-4">
      <button onClick={() => navigate("/welcome")} className="p-2 rounded-xl bg-card border border-border hover:bg-muted">
        <ChevronLeft size={20} />
      </button>
      <img src={logo} alt="Eduvest" className="h-9 w-auto" />
      <div className="ml-auto flex bg-muted rounded-full p-1">
        <button onClick={() => setMode("signup")}
          className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 ${mode === "signup" ? "bg-card shadow text-primary" : "text-muted-foreground"}`}>
          <UserPlus size={13} /> {t("sign_up")}
        </button>
        <button onClick={() => setMode("signin")}
          className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 ${mode === "signin" ? "bg-card shadow text-primary" : "text-muted-foreground"}`}>
          <LogIn size={13} /> {t("sign_in")}
        </button>
      </div>
    </div>
  );

  if (mode === "signin") {
    return (
      <div className="min-h-screen bg-background pb-10">
        <div className="max-w-md mx-auto px-4 pt-6 animate-fade-in">
          {Header}
          <section className="space-y-4 mt-4">
            <div>
              <h2 className="text-lg font-bold">{t("sign_in")}</h2>
              <p className="text-xs text-muted-foreground">Use your phone number and 4-digit PIN.</p>
            </div>
            <div>
              <Label className="text-sm font-semibold">{t("phone_label")}</Label>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-sm font-semibold text-muted-foreground">+237</span>
                <Input type="tel" inputMode="numeric" maxLength={9} value={siPhone}
                  onChange={(e) => setSiPhone(e.target.value.replace(/\D/g, ""))} className="h-12" autoFocus />
              </div>
            </div>
            <div>
              <Label className="text-sm font-semibold">PIN</Label>
              <Input type="password" inputMode="numeric" maxLength={4} value={siPin}
                onChange={(e) => setSiPin(e.target.value.replace(/\D/g, ""))}
                className="text-center text-2xl tracking-[1em] h-14 mt-1.5" />
            </div>
            <Button onClick={doSignIn} className="w-full h-12 gradient-primary text-primary-foreground font-bold">
              {t("sign_in")}
            </Button>
            <button onClick={() => setMode("signup")} className="w-full text-xs font-semibold text-primary">
              No account? {t("sign_up")}
            </button>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="max-w-md mx-auto px-4 pt-6 animate-fade-in">
        {Header}
        <div className="text-[11px] text-muted-foreground font-semibold mb-2">{t("step")} {step + 1}/4</div>
        <Stepper steps={STEPS} current={step} />

        {step === 0 && (
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2"><UserCircle2 size={18} className="text-primary" /> {t("identity_title")}</h2>
              <p className="text-xs text-muted-foreground">{t("identity_desc")}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-bold">{t("first_name")}</Label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-1.5" autoFocus />
              </div>
              <div>
                <Label className="text-xs font-bold">{t("last_name")}</Label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label className="text-xs font-bold">{t("country")}</Label>
              <Input value={country} onChange={(e) => setCountry(e.target.value)} className="mt-1.5" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-bold">{t("region")}</Label>
                <Input value={region} onChange={(e) => setRegion(e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label className="text-xs font-bold">{t("city")}</Label>
                <Input value={city} onChange={(e) => setCity(e.target.value)} className="mt-1.5" />
              </div>
            </div>
          </section>
        )}

        {step === 1 && (
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-bold">{t("phone_title")}</h2>
              <p className="text-xs text-muted-foreground">{t("phone_desc")}</p>
            </div>
            <div>
              <Label className="text-sm font-semibold">{t("phone_label")}</Label>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-sm font-semibold text-muted-foreground">+237</span>
                <Input type="tel" inputMode="numeric" maxLength={9} placeholder="6XX XXX XXX" value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} className="h-12" autoFocus />
              </div>
            </div>
            <div>
              <Label className="text-sm font-semibold mb-2 block">{t("otp_channel")}</Label>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setChannel("whatsapp")}
                  className={`p-3 rounded-xl border text-left ${channel === "whatsapp" ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
                  <MessageCircle size={18} className="text-primary mb-1" />
                  <p className="text-sm font-bold">{t("whatsapp")}</p>
                  <p className="text-[10px] text-muted-foreground">{t("whatsapp_hint")}</p>
                </button>
                <button onClick={() => setChannel("sms")}
                  className={`p-3 rounded-xl border text-left ${channel === "sms" ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
                  <Phone size={18} className="text-primary mb-1" />
                  <p className="text-sm font-bold">{t("sms")}</p>
                  <p className="text-[10px] text-muted-foreground">{t("sms_hint")}</p>
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
              <div className="pr-2">
                <p className="text-xs font-bold">{t("primary_pay_title")}</p>
                <p className="text-[10px] text-muted-foreground">{t("primary_pay_desc")}</p>
              </div>
              <Switch checked={primaryPay} onCheckedChange={setPrimaryPay} />
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-bold">{t("email_title")}</h2>
              <p className="text-xs text-muted-foreground">{t("email_desc")}</p>
            </div>
            <div>
              <Label className="text-sm font-semibold flex items-center gap-1"><Mail size={14} /> {t("email")}</Label>
              <Input type="email" placeholder="you@example.com" value={email}
                onChange={(e) => setEmail(e.target.value)} className="mt-1.5 h-12" autoFocus />
            </div>
            <div>
              <Label className="text-sm font-semibold flex items-center gap-1"><AtSign size={14} /> {t("username")}</Label>
              <Input placeholder="emma237" value={username}
                onChange={(e) => setUsername(e.target.value.replace(/\s/g, "").toLowerCase())} className="mt-1.5 h-12" />
              <p className="text-[10px] text-muted-foreground mt-1">{t("username_hint")}</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
              <div className="pr-2">
                <p className="text-xs font-bold">{t("verify_now")}</p>
                <p className="text-[10px] text-muted-foreground">{t("verify_later")}</p>
              </div>
              <Switch checked={verifyEmailNow} onCheckedChange={setVerifyEmailNow} />
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2"><KeyRound size={18} className="text-primary" /> {t("pin_title")}</h2>
              <p className="text-xs text-muted-foreground">{t("pin_desc")}</p>
            </div>
            <Input type="password" inputMode="numeric" maxLength={4} placeholder="••••" value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              className="text-center text-2xl tracking-[1em] h-14" autoFocus />
          </section>
        )}

        <Button onClick={next} className="w-full h-12 mt-6 gradient-primary text-primary-foreground font-bold">
          {step === 3 ? t("create_account") : t("continue")}
        </Button>
        <p className="text-[10px] text-muted-foreground text-center mt-3">{t("terms_note")}</p>
      </div>

      {/* OTP half-screen popup */}
      <Dialog open={otpOpen} onOpenChange={setOtpOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("otp_title")}</DialogTitle>
            <DialogDescription>
              {t("otp_sent_via")} +237 {phone} ({channel === "whatsapp" ? t("whatsapp") : t("sms")}). {t("otp_demo")}: <b>1234</b>
            </DialogDescription>
          </DialogHeader>
          <Input type="tel" inputMode="numeric" maxLength={4} placeholder="••••" value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            className="text-center text-2xl tracking-[1em] h-14" autoFocus />
          <button onClick={() => toast.success(t("ok_resent"))} className="text-xs font-semibold text-primary text-left">
            {t("resend")}
          </button>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOtpOpen(false)}>{t("cancel")}</Button>
            <Button onClick={verifyOtp} className="gradient-primary text-primary-foreground">{t("verify")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm PIN half-screen popup */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><ShieldCheck size={18} className="text-primary" /> {t("pin_confirm_title")}</DialogTitle>
            <DialogDescription>{t("pin_confirm_desc")}</DialogDescription>
          </DialogHeader>
          <Input type="password" inputMode="numeric" maxLength={4} placeholder="••••" value={pin2}
            onChange={(e) => setPin2(e.target.value.replace(/\D/g, ""))}
            className="text-center text-2xl tracking-[1em] h-14" autoFocus />
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>{t("cancel")}</Button>
            <Button onClick={finalizeAccount} className="gradient-primary text-primary-foreground">{t("create_account")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Auth;
