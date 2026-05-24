import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Users, GraduationCap, BookOpen, Briefcase, ChevronLeft, ShieldCheck,
  Camera, IdCard, Fingerprint, CheckCircle2, Building2, UserCircle2,
} from "lucide-react";
import Stepper from "@/components/Stepper";
import { setUser, setTeacherProfile, Role, getUser, Gender } from "@/lib/userStore";
import { useLang } from "@/lib/i18n";

type Stage = "role" | "teacher" | "kycIntro" | "kyc" | "done";

const Onboarding = () => {
  const navigate = useNavigate();
  const { t } = useLang();
  const u = getUser();

  const [stage, setStage] = useState<Stage>("role");
  const [role, setRole] = useState<Role | null>(null);

  // Teacher (4 steps)
  const [tStep, setTStep] = useState(0);
  const [subject, setSubject] = useState("");
  const [levels, setLevels] = useState<string[]>([]);
  const [exams, setExams] = useState("");
  const [modes, setModes] = useState<string[]>([]);
  const [city, setCity] = useState(u.city || "");
  const [quarter, setQuarter] = useState("");
  const [rate, setRate] = useState("");
  const [monthly, setMonthly] = useState("");
  const [payTimings, setPayTimings] = useState<string[]>([]);
  const [bio, setBio] = useState("");

  // KYC (4 sub-stages)
  const [kStep, setKStep] = useState(0);
  // 1: personal
  const [fullName, setFullName] = useState(`${u.firstName} ${u.lastName}`.trim());
  const [gender, setGender] = useState<Gender | "">("");
  const [dob, setDob] = useState("");
  const [citizenship, setCitizenship] = useState(u.country || "");
  const [resident, setResident] = useState(u.country || "");
  // 2: doc
  const [docType, setDocType] = useState<"id" | "passport" | "permit">("id");
  const [docNumber, setDocNumber] = useState("");
  const [front, setFront] = useState(false);
  const [backImg, setBackImg] = useState(false);
  // 3: biometric
  const [selfie, setSelfie] = useState(false);
  const [biometric, setBiometric] = useState(true);
  // 4: business (optional)
  const [bizName, setBizName] = useState("");
  const [rccm, setRccm] = useState("");
  const [taxId, setTaxId] = useState("");
  const [bizAddress, setBizAddress] = useState("");

  const KYC_STEPS = [t("kyc_s1"), t("kyc_s2"), t("kyc_s3"), t("kyc_s4")];
  const TEACH_STEPS = [t("teach_step1"), t("teach_step2"), t("teach_step3"), t("teach_step4")];
  const LEVELS = ["Nursery", "Class 1–6", "Form 1–5", "Lower 6", "Upper 6", "Tertiary / Exams"];
  const MODES = ["Online", "Onsite (home)", "Onsite (centre)", "Hybrid"];
  const PAY_TIMINGS = ["After each lesson", "Pay monthly", "Advance (1 month)"];

  const toggle = (arr: string[], v: string, set: (a: string[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const pickRole = (r: Role) => {
    setRole(r);
    setUser({ role: r });
    setStage(r === "teacher" ? "teacher" : "kycIntro");
  };

  // ---- TEACHER NAV ----
  const nextTeacher = () => {
    if (tStep === 0 && (!subject.trim() || levels.length === 0)) return toast.error(t("err_required"));
    if (tStep === 1 && modes.length === 0) return toast.error(t("err_required"));
    if (tStep < 3) return setTStep(tStep + 1);
    setTeacherProfile({ subject, levels, exams, modes, city, quarter, rate, monthly, payTimings, bio });
    setUser({ teacherProfileComplete: true });
    toast.success(t("t_saved"));
    setStage("kycIntro");
  };
  const skipTeacher = () => { toast.info(t("skip")); setStage("kycIntro"); };

  // ---- KYC NAV ----
  const nextKyc = () => {
    if (kStep === 0) {
      if (!fullName.trim() || !gender || !dob || !citizenship || !resident) return toast.error(t("err_required"));
      setUser({ gender, dob, citizenship, residentCountry: resident });
      return setKStep(1);
    }
    if (kStep === 1) {
      if (!docNumber.trim() || !front) return toast.error(t("err_required"));
      if (docType === "id" && !backImg) return toast.error(t("err_required"));
      return setKStep(2);
    }
    if (kStep === 2) {
      if (!selfie) return toast.error(t("err_required"));
      setUser({ kycComplete: true, biometricEnabled: biometric });
      if (role === "sme") return setKStep(3);
      toast.success("KYC submitted");
      return setStage("done");
    }
    if (kStep === 3) {
      if (bizName.trim() && rccm.trim()) {
        setUser({ kybComplete: true });
        toast.success("Business submitted");
      } else {
        toast.info("Business step skipped");
      }
      setStage("done");
    }
  };
  const skipKyc = () => {
    toast.info("KYC pending. Deposit, save and receive still work — send & withdraw are locked.");
    setStage("done");
  };

  const back = () => {
    if (stage === "role") return navigate("/auth");
    if (stage === "teacher") return tStep === 0 ? setStage("role") : setTStep(tStep - 1);
    if (stage === "kycIntro") return setStage(role === "teacher" ? "teacher" : "role");
    if (stage === "kyc") return kStep === 0 ? setStage("kycIntro") : setKStep(kStep - 1);
    if (stage === "done") return setStage("kyc");
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="max-w-md mx-auto px-4 pt-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={back} className="p-2 rounded-xl bg-card border border-border hover:bg-muted">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold">{t("setup_title")}</h1>
            <p className="text-xs text-muted-foreground">{t("setup_subtitle")}</p>
          </div>
        </div>

        {/* ROLE */}
        {stage === "role" && (
          <section className="space-y-3">
            <div>
              <h2 className="text-base font-bold">{t("i_am")}</h2>
              <p className="text-xs text-muted-foreground">{t("i_am_desc")}</p>
            </div>
            {([
              { k: "parent" as Role,  l: t("r_parent"),  d: t("r_parent_d"),  I: Users },
              { k: "student" as Role, l: t("r_student"), d: t("r_student_d"), I: BookOpen },
              { k: "teacher" as Role, l: t("r_teacher"), d: t("r_teacher_d"), I: GraduationCap },
              { k: "sme" as Role,     l: t("r_sme"),     d: t("r_sme_d"),     I: Briefcase },
            ]).map((r) => (
              <button key={r.k} onClick={() => pickRole(r.k)}
                className="w-full flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition text-left">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><r.I size={20} /></div>
                <div className="flex-1">
                  <p className="text-sm font-bold">{r.l}</p>
                  <p className="text-[11px] text-muted-foreground">{r.d}</p>
                </div>
              </button>
            ))}
          </section>
        )}

        {/* TEACHER 4 STEPS */}
        {stage === "teacher" && (
          <section className="space-y-4">
            <Stepper steps={TEACH_STEPS} current={tStep} />
            <div className="bg-accent/50 border border-primary/20 rounded-xl p-3">
              <p className="text-xs font-bold text-secondary">{t("teach_boost")}</p>
              <p className="text-[11px] text-muted-foreground">{t("teach_boost_d")}</p>
            </div>

            {tStep === 0 && (
              <>
                <div>
                  <Label className="text-xs font-bold">{t("t_subject")}</Label>
                  <Input placeholder="e.g. Mathematics" value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label className="text-xs font-bold mb-2 block">{t("t_levels")}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {LEVELS.map((l) => (
                      <label key={l} className={`flex items-center gap-2 p-2 rounded-lg border text-[11px] cursor-pointer ${levels.includes(l) ? "border-primary bg-primary/5" : "border-border"}`}>
                        <Checkbox checked={levels.includes(l)} onCheckedChange={() => toggle(levels, l, setLevels)} /> {l}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-bold">{t("t_exams")}</Label>
                  <Input placeholder="GCE O/L, A/L, Probatoire, IELTS…" value={exams} onChange={(e) => setExams(e.target.value)} className="mt-1.5" />
                </div>
              </>
            )}

            {tStep === 1 && (
              <>
                <div>
                  <Label className="text-xs font-bold mb-2 block">{t("t_modes")}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {MODES.map((m) => (
                      <label key={m} className={`flex items-center gap-2 p-2 rounded-lg border text-[11px] cursor-pointer ${modes.includes(m) ? "border-primary bg-primary/5" : "border-border"}`}>
                        <Checkbox checked={modes.includes(m)} onCheckedChange={() => toggle(modes, m, setModes)} /> {m}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs font-bold">{t("city")}</Label>
                    <Input value={city} onChange={(e) => setCity(e.target.value)} className="mt-1.5" />
                  </div>
                  <div>
                    <Label className="text-xs font-bold">{t("t_quarter")}</Label>
                    <Input value={quarter} onChange={(e) => setQuarter(e.target.value)} className="mt-1.5" />
                  </div>
                </div>
              </>
            )}

            {tStep === 2 && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs font-bold">{t("t_rate")}</Label>
                    <Input type="number" placeholder="5000" value={rate} onChange={(e) => setRate(e.target.value)} className="mt-1.5" />
                  </div>
                  <div>
                    <Label className="text-xs font-bold">{t("t_monthly")}</Label>
                    <Input type="number" placeholder="35000" value={monthly} onChange={(e) => setMonthly(e.target.value)} className="mt-1.5" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-bold mb-2 block">{t("t_pay_timings")}</Label>
                  <div className="space-y-2">
                    {PAY_TIMINGS.map((p) => (
                      <label key={p} className={`flex items-center gap-2 p-2 rounded-lg border text-[11px] cursor-pointer ${payTimings.includes(p) ? "border-primary bg-primary/5" : "border-border"}`}>
                        <Checkbox checked={payTimings.includes(p)} onCheckedChange={() => toggle(payTimings, p, setPayTimings)} /> {p}
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {tStep === 3 && (
              <div>
                <Label className="text-xs font-bold">{t("t_bio")}</Label>
                <Textarea placeholder="Your experience, qualifications, approach…" value={bio} onChange={(e) => setBio(e.target.value)} className="mt-1.5" rows={5} />
              </div>
            )}

            <div className="flex gap-2">
              {tStep === 0 && (
                <Button variant="outline" onClick={skipTeacher} className="flex-1 h-12">{t("skip")}</Button>
              )}
              <Button onClick={nextTeacher} className="flex-1 h-12 gradient-primary text-primary-foreground font-bold">
                {tStep === 3 ? t("save_continue") : t("next")}
              </Button>
            </div>
          </section>
        )}

        {/* KYC INTRO */}
        {stage === "kycIntro" && (
          <section className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center mb-3">
                <ShieldCheck size={28} />
              </div>
              <h2 className="text-lg font-extrabold">{t("kyc_intro_title")}</h2>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{t("kyc_intro_desc")}</p>
            </div>
            <div className="bg-warning/10 border border-warning/30 rounded-xl p-3">
              <p className="text-xs font-bold text-foreground flex items-center gap-2">
                <Camera size={14} className="text-warning" /> {t("kyc_prepare")}
              </p>
              <ul className="text-[11px] mt-2 space-y-1 text-muted-foreground">
                <li>• {t("kyc_prep_id")}</li>
                <li>• {t("kyc_prep_selfie")}</li>
                {role === "sme" && <li>• {t("kyc_prep_sme")}</li>}
              </ul>
              <p className="text-[10px] text-muted-foreground mt-2">{t("kyc_tip")}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-3 space-y-2">
              <p className="text-xs font-bold">{t("kyc_without")}</p>
              <p className="text-[11px] text-success">{t("kyc_yes")}</p>
              <p className="text-[11px] text-destructive">{t("kyc_no")}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={skipKyc} className="flex-1 h-12">{t("skip")}</Button>
              <Button onClick={() => { setStage("kyc"); setKStep(0); }} className="flex-1 h-12 gradient-primary text-primary-foreground font-bold">{t("im_ready")}</Button>
            </div>
          </section>
        )}

        {/* KYC 4 SUB-STAGES */}
        {stage === "kyc" && (
          <section className="space-y-4">
            <Stepper steps={KYC_STEPS} current={kStep} />

            {kStep === 0 && (
              <>
                <div>
                  <h2 className="text-base font-bold flex items-center gap-2"><UserCircle2 size={18} className="text-primary" /> {t("k_personal_title")}</h2>
                </div>
                <div>
                  <Label className="text-xs font-bold">{t("k_full_name")}</Label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label className="text-xs font-bold mb-2 block">{t("k_gender")}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["male", "female"] as Gender[]).map((g) => (
                      <button key={g} onClick={() => setGender(g)}
                        className={`p-3 rounded-xl border text-sm font-bold ${gender === g ? "border-primary bg-primary/5 text-primary" : "border-border"}`}>
                        {g === "male" ? t("k_male") : t("k_female")}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-bold">{t("k_dob")}</Label>
                  <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="mt-1.5" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs font-bold">{t("k_citizenship")}</Label>
                    <Input value={citizenship} onChange={(e) => setCitizenship(e.target.value)} className="mt-1.5" />
                  </div>
                  <div>
                    <Label className="text-xs font-bold">{t("k_resident")}</Label>
                    <Input value={resident} onChange={(e) => setResident(e.target.value)} className="mt-1.5" />
                  </div>
                </div>
              </>
            )}

            {kStep === 1 && (
              <>
                <div>
                  <h2 className="text-base font-bold flex items-center gap-2"><IdCard size={18} className="text-primary" /> {t("k_doc_title")}</h2>
                </div>
                <div>
                  <Label className="text-xs font-bold mb-2 block">{t("k_doc_type")}</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { k: "id" as const, l: "National ID" },
                      { k: "passport" as const, l: "Passport" },
                      { k: "permit" as const, l: "Residence" },
                    ]).map((d) => (
                      <button key={d.k} onClick={() => setDocType(d.k)}
                        className={`p-2 rounded-lg border text-xs font-bold ${docType === d.k ? "border-primary bg-primary/5 text-primary" : "border-border"}`}>{d.l}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-bold">{t("k_doc_num")}</Label>
                  <Input value={docNumber} onChange={(e) => setDocNumber(e.target.value.toUpperCase())} className="mt-1.5" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <PhotoBtn label={t("k_front")} captured={front} onClick={() => setFront(true)} />
                  {docType === "id" && <PhotoBtn label={t("k_back")} captured={backImg} onClick={() => setBackImg(true)} />}
                </div>
              </>
            )}

            {kStep === 2 && (
              <>
                <div>
                  <h2 className="text-base font-bold flex items-center gap-2"><Fingerprint size={18} className="text-primary" /> {t("k_bio_title")}</h2>
                  <p className="text-xs text-muted-foreground">{t("k_bio_desc")}</p>
                </div>
                <PhotoBtn label={t("k_selfie")} captured={selfie} onClick={() => setSelfie(true)} />
                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${biometric ? "border-primary bg-primary/5" : "border-border"}`}>
                  <Checkbox checked={biometric} onCheckedChange={(v) => setBiometric(!!v)} />
                  <div className="flex-1">
                    <p className="text-xs font-bold">{t("k_bio_enable")}</p>
                    <p className="text-[10px] text-muted-foreground">{t("k_bio_enable_d")}</p>
                  </div>
                </label>
              </>
            )}

            {kStep === 3 && (
              <>
                <div>
                  <h2 className="text-base font-bold flex items-center gap-2"><Building2 size={18} className="text-primary" /> {t("k_biz_title")}</h2>
                  <p className="text-xs text-muted-foreground">{t("k_biz_desc")}</p>
                </div>
                <div><Label className="text-xs font-bold">{t("k_biz_name")}</Label><Input value={bizName} onChange={(e) => setBizName(e.target.value)} className="mt-1.5" /></div>
                <div><Label className="text-xs font-bold">{t("k_biz_reg")}</Label><Input value={rccm} onChange={(e) => setRccm(e.target.value.toUpperCase())} className="mt-1.5" /></div>
                <div><Label className="text-xs font-bold">{t("k_biz_tax")}</Label><Input value={taxId} onChange={(e) => setTaxId(e.target.value.toUpperCase())} className="mt-1.5" /></div>
                <div><Label className="text-xs font-bold">{t("k_biz_addr")}</Label><Textarea rows={2} value={bizAddress} onChange={(e) => setBizAddress(e.target.value)} className="mt-1.5" /></div>
              </>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={skipKyc} className="flex-1 h-12">{t("skip")}</Button>
              <Button onClick={nextKyc} className="flex-1 h-12 gradient-primary text-primary-foreground font-bold">
                {kStep === 3 || (kStep === 2 && role !== "sme") ? t("submit") : t("next")}
              </Button>
            </div>
          </section>
        )}

        {stage === "done" && (
          <section className="space-y-4 text-center">
            <div className="w-20 h-20 rounded-full bg-success/10 text-success mx-auto flex items-center justify-center">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-xl font-extrabold">{t("k_done_title")}</h2>
            <p className="text-xs text-muted-foreground">{t("k_done_desc")}</p>
            <Button onClick={() => navigate("/")} className="w-full h-12 gradient-primary text-primary-foreground font-bold">{t("go_home")}</Button>
          </section>
        )}
      </div>
    </div>
  );
};

const PhotoBtn = ({ label, captured, onClick }: { label: string; captured: boolean; onClick: () => void }) => (
  <button onClick={onClick}
    className={`p-3 rounded-xl border text-left flex flex-col items-center gap-1 ${captured ? "border-success bg-success/5" : "border-dashed border-border bg-muted/30"}`}>
    <Camera size={20} className={captured ? "text-success" : "text-muted-foreground"} />
    <span className="text-[11px] font-bold">{label}</span>
    <span className="text-[10px] text-muted-foreground">{captured ? "✓ Captured" : "Tap to capture"}</span>
  </button>
);

export default Onboarding;
