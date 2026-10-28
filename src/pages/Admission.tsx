import { useState, type ReactNode } from "react";
import { GraduationCap, Globe, MapPin, ClipboardList, MessageCircle, Phone, Send } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useLang } from "@/lib/i18n";

const WA = "237600000000";
const CLASSES: Record<string, Record<number, string[]>> = {
  francophone: {
    0: ["Petite Section", "Moyenne Section", "Grande Section"],
    1: ["SIL", "CP", "CE1", "CE2", "CM1", "CM2"],
    2: ["6ème", "5ème", "4ème", "3ème", "2nde", "1ère", "Terminale"],
  },
  anglophone: {
    0: ["Nursery 1", "Nursery 2"],
    1: ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6"],
    2: ["Form 1", "Form 2", "Form 3", "Form 4", "Form 5", "Lower Sixth", "Upper Sixth"],
  },
};
const INTL_LEVELS = ["Advanced Level", "HND", "HPD", "Bachelor's degree", "Master's degree", "PhD", "Other"];
const selectCls = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm";

const Field = ({ id, label, req, children }: { id?: string; label: string; req?: boolean; children: ReactNode }) => (
  <div className="space-y-1.5">
    <Label htmlFor={id}>{label}{req && <span className="text-destructive"> *</span>}</Label>
    {children}
  </div>
);

const Section = ({ title, note, children }: { title: string; note?: string; children: ReactNode }) => (
  <section className="rounded-2xl border bg-card p-4 space-y-3">
    <div><h3 className="text-sm font-extrabold text-secondary dark:text-primary">{title}</h3>{note && <p className="text-[11px] text-muted-foreground">{note}</p>}</div>
    {children}
  </section>
);

const Toggle = ({ options, value, onChange }: { options: [string, string][]; value: string; onChange: (v: string) => void }) => (
  <div className="grid grid-cols-2 gap-2">
    {options.map(([v, l]) => <Button key={v} type="button" size="sm" variant={value === v ? "secondary" : "outline"} aria-pressed={value === v} onClick={() => onChange(value === v ? "" : v)}>{l}</Button>)}
  </div>
);

const Admission = () => {
  const { lang } = useLang();
  const fr = lang === "fr";
  const L = (en: string, f: string) => (fr ? f : en);
  const [scope, setScope] = useState<"national" | "international">("national");
  const [review, setReview] = useState(false);
  const [f, setF] = useState<Record<string, string>>({ year: "2026/2027" });
  const [agree, setAgree] = useState(false);
  const set = (k: string) => (v: string) => setF(p => ({ ...p, [k]: v }));
  const inp = (k: string, label: string, opts: { req?: boolean; type?: string; ph?: string } = {}) => (
    <Field id={k} label={label} req={opts.req}>
      <Input id={k} type={opts.type || "text"} placeholder={opts.ph} value={f[k] || ""} onChange={e => set(k)(e.target.value)} />
    </Field>
  );

  const levels = fr ? ["Maternelle", "Primaire", "Secondaire", "Supérieur"] : ["Nursery", "Primary", "Secondary", "Tertiary"];
  const lvl = f.level === undefined || f.level === "" ? -1 : Number(f.level);
  const needsSystem = lvl >= 0 && lvl < 3;
  const classList = needsSystem && f.system ? CLASSES[f.system][lvl] : [];

  const nationalOk = !!(f.name?.trim() && f.institution?.trim() && f.dob && f.cls?.trim() && f.g1phone?.trim() && lvl >= 0 && (!needsSystem || f.system));
  const intlOk = !!(f.name?.trim() && f.dob && f.ilevel && f.country?.trim() && f.iprog?.trim());

  const nationalRows: [string, string | undefined][] = [
    [L("Academic year", "Année académique"), f.year], [L("Level", "Niveau"), levels[lvl]],
    [L("System", "Système"), f.system], [L("Class", "Classe"), f.cls], [L("Campus", "Régime"), f.campus],
    [L("School", "Établissement"), f.institution], [L("Student", "Élève"), f.name], [L("Date of birth", "Date de naissance"), f.dob],
    [L("Place of birth", "Lieu de naissance"), f.pob], [L("Gender", "Sexe"), f.gender], [L("Nationality", "Nationalité"), f.nat],
    [L("Address", "Adresse"), f.addr], [L("City", "Ville"), f.city],
    [L("Guardian 1", "Tuteur 1"), [f.g1name, f.g1rel].filter(Boolean).join(" · ")], [L("Guardian 1 phone", "Tél. tuteur 1"), f.g1phone],
    [L("Guardian 2", "Tuteur 2"), [f.g2name, f.g2rel].filter(Boolean).join(" · ")], [L("Guardian 2 phone", "Tél. tuteur 2"), f.g2phone],
    [L("Previous school", "Ancienne école"), f.prev === "yes" ? f.lastSchool : f.prev],
    [L("Blood group", "Groupe sanguin"), f.blood], [L("Emergency contact", "Contact d'urgence"), [f.emName, f.emPhone].filter(Boolean).join(" · ")],
    [L("Payment plan", "Mode de paiement"), f.pay],
  ];
  const intlRows: [string, string | undefined][] = [
    [L("Applicant", "Candidat"), f.name], [L("Date of birth", "Date de naissance"), f.dob],
    [L("Education level", "Niveau d'études"), f.ilevel === "Other" ? f.ilevelOther || "Other" : f.ilevel],
    [L("Destination country", "Pays souhaité"), f.country], [L("Preferred programme", "Programme souhaité"), f.iprog],
  ];
  const rows = (scope === "national" ? nationalRows : intlRows).filter(([, v]) => v);
  const waText = `Hi Eduvest, ${scope === "national" ? "national admission application" : "international admission request"}:\n` + rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const waHref = `https://wa.me/${WA}?text=${encodeURIComponent(waText)}`;

  const actions = (
    <div className="space-y-2">
      <Button asChild className="w-full"><a href={waHref} target="_blank" rel="noopener noreferrer"><Send />{L("Submit via WhatsApp", "Soumettre via WhatsApp")}</a></Button>
      <div className="grid grid-cols-2 gap-2">
        <Button asChild variant="outline"><a href={`https://wa.me/${WA}?text=${encodeURIComponent("Hi Eduvest, I'd like to talk to an admission consultant.")}`} target="_blank" rel="noopener noreferrer"><MessageCircle />{L("Consultant", "Conseiller")}</a></Button>
        <Button asChild variant="outline"><a href={`tel:+${WA}`}><Phone />{L("Call us", "Appeler")}</a></Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="max-w-md mx-auto px-4 pt-6 space-y-5 animate-fade-in">
        <PageHeader title="Admission" />
        <div className="flex items-center gap-3 text-primary"><GraduationCap size={32} /><h2 className="text-sm font-bold">{L("Your next chapter", "Votre prochaine étape")}</h2></div>
        <div role="group" aria-label={L("Admission destination", "Destination")} className="grid grid-cols-2 gap-2">
          <Button variant={scope === "national" ? "default" : "outline"} aria-pressed={scope === "national"} onClick={() => setScope("national")}><MapPin />{L("National", "Nationale")}</Button>
          <Button variant={scope === "international" ? "default" : "outline"} aria-pressed={scope === "international"} onClick={() => setScope("international")}><Globe />{L("International", "Internationale")}</Button>
        </div>
        <p className="text-[11px] text-muted-foreground"><span className="text-destructive font-bold">*</span> {L("Required. Everything else is optional.", "Obligatoire. Le reste est optionnel.")}</p>

        {scope === "international" ? (
          <section className="space-y-4">
            <div className="rounded-2xl bg-secondary text-secondary-foreground p-5 space-y-2">
              <Globe size={28} />
              <h2 className="text-lg font-extrabold">{L("International admission consultant", "Conseiller en admission internationale")}</h2>
              <p className="text-xs opacity-90">{L("A consultant reviews your eligibility requirements, documents, visa and budget before you apply.", "Un conseiller examine vos conditions d’éligibilité, documents, visa et budget avant de postuler.")}</p>
            </div>
            {inp("name", L("Applicant name", "Nom du candidat"), { req: true })}
            {inp("dob", L("Date of birth", "Date de naissance"), { req: true, type: "date" })}
            <Field label={L("Current level of education", "Niveau d'études actuel")} req>
              <div className="grid grid-cols-2 gap-2">{INTL_LEVELS.map(l => <Button key={l} type="button" size="sm" variant={f.ilevel === l ? "secondary" : "outline"} aria-pressed={f.ilevel === l} onClick={() => set("ilevel")(l)}>{l === "Other" ? L("Other", "Autre") : l}</Button>)}</div>
            </Field>
            {f.ilevel === "Other" && inp("ilevelOther", L("Specify level", "Précisez le niveau"))}
            {inp("country", L("Country you want to study in", "Pays où vous voulez étudier"), { req: true })}
            {inp("iprog", L("Preferred programme (course you want to study)", "Programme souhaité (filière)"), { req: true })}
            <Button variant="outline" className="w-full" disabled={!intlOk} onClick={() => setReview(true)}><ClipboardList />{L("Review request", "Voir la demande")}</Button>
            {actions}
          </section>
        ) : (
          <div className="space-y-4">
            <Section title={L("1. Admission details", "1. Détails de l'admission")}>
              {inp("year", L("Academic year", "Année académique"), { ph: "2026/2027" })}
              {inp("institution", L("School to apply to", "Établissement souhaité"), { req: true })}
              <Field label={L("Study level", "Niveau d’études")} req>
                <div className="grid grid-cols-2 gap-2">{levels.map((l, i) => <Button key={l} type="button" size="sm" variant={lvl === i ? "secondary" : "outline"} aria-pressed={lvl === i} onClick={() => setF(p => ({ ...p, level: String(i), cls: "" }))}>{l}</Button>)}</div>
              </Field>
              {needsSystem && (
                <Field label={L("System", "Système")} req>
                  <Toggle value={f.system || ""} onChange={v => setF(p => ({ ...p, system: v, cls: "" }))} options={[["francophone", "Francophone"], ["anglophone", "Anglophone"]]} />
                </Field>
              )}
              {lvl === 3 ? inp("cls", L("Class / programme applying for", "Classe / programme"), { req: true, ph: "e.g. Year 1 Computer Science" })
                : classList.length > 0 && (
                  <Field id="cls" label={L("Class applying for", "Classe demandée")} req>
                    <select id="cls" className={selectCls} value={f.cls || ""} onChange={e => set("cls")(e.target.value)}>
                      <option value="">{L("Select class", "Choisir la classe")}</option>
                      {classList.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </Field>
                )}
              <Field label={L("Campus / Section", "Régime")}><Toggle value={f.campus || ""} onChange={set("campus")} options={[[L("Day", "Externat"), L("Day", "Externat")], [L("Boarding", "Internat"), L("Boarding", "Internat")]]} /></Field>
              <Field label={L("Previous school?", "Ancienne école ?")}><Toggle value={f.prev || ""} onChange={set("prev")} options={[["yes", L("Yes", "Oui")], ["no", L("No", "Non")]]} /></Field>
            </Section>

            <Section title={L("2. Student personal information", "2. Informations de l'élève")}>
              {inp("name", L("Full name (as on birth certificate)", "Nom complet (selon l'acte de naissance)"), { req: true })}
              {inp("dob", L("Date of birth", "Date de naissance"), { req: true, type: "date" })}
              {inp("pob", L("Place of birth", "Lieu de naissance"))}
              <Field label={L("Gender", "Sexe")}><Toggle value={f.gender || ""} onChange={set("gender")} options={[[L("Male", "Masculin"), L("Male", "Masculin")], [L("Female", "Féminin"), L("Female", "Féminin")]]} /></Field>
              {inp("nat", L("Nationality", "Nationalité"), { ph: "Cameroonian" })}
              {inp("addr", L("Address / Quarter", "Adresse / Quartier"), { ph: "Terminus Mimboman" })}
              {inp("city", L("City", "Ville"), { ph: "Yaoundé" })}
            </Section>

            <Section title={L("3. Parent / Guardian information", "3. Parents / Tuteurs")} note={L("Add up to 2 guardians.", "Jusqu'à 2 tuteurs.")}>
              {[1, 2].map(n => (
                <div key={n} className="space-y-3 rounded-xl bg-muted/40 p-3">
                  <p className="text-xs font-bold">{n === 1 ? L("Father / Mother / Guardian 1", "Père / Mère / Tuteur 1") : L("Guardian 2", "Tuteur 2")}</p>
                  {inp(`g${n}name`, L("Full name", "Nom complet"))}
                  {inp(`g${n}rel`, L("Relationship to child", "Lien avec l'enfant"))}
                  {inp(`g${n}phone`, L("Phone number (MTN/Orange) — for Eduvest SMS", "Téléphone (MTN/Orange) — SMS Eduvest"), { req: n === 1, type: "tel" })}
                  {inp(`g${n}wa`, L("WhatsApp number", "Numéro WhatsApp"), { type: "tel" })}
                  {inp(`g${n}email`, "Email", { type: "email" })}
                  {inp(`g${n}job`, L("Profession", "Profession"))}
                  {inp(`g${n}cni`, L("ID card number (CNI)", "Numéro CNI"))}
                  {inp(`g${n}addr`, L("Address", "Adresse"))}
                </div>
              ))}
            </Section>

            {f.prev !== "no" && (
              <Section title={L("4. Previous school information", "4. Ancienne école")}>
                {inp("lastSchool", L("Last school name", "Nom de l'ancienne école"))}
                {inp("lastClass", L("Last class attended", "Dernière classe fréquentée"))}
                {inp("leaveReason", L("Reason for leaving", "Motif du départ"), { ph: L("Transfer, end of cycle…", "Transfert, fin de cycle…") })}
                <Field id="report" label={L("Last report card / bulletin (PDF/JPG)", "Dernier bulletin (PDF/JPG)")}>
                  <Input id="report" type="file" accept=".pdf,image/jpeg,image/png" onChange={e => set("report")(e.target.files?.[0]?.name || "")} />
                </Field>
                {inp("results", L("Average / results", "Moyenne / résultats"), { ph: "CEP, FSLC, BEPC, Probatoire, GCE O/L" })}
              </Section>
            )}

            <Section title={L("5. Medical & health information", "5. Informations médicales")} note={L("Optional but important.", "Optionnel mais important.")}>
              <Field id="blood" label={L("Blood group", "Groupe sanguin")}>
                <select id="blood" className={selectCls} value={f.blood || ""} onChange={e => set("blood")(e.target.value)}>
                  <option value="">—</option>{["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(b => <option key={b}>{b}</option>)}
                </select>
              </Field>
              {inp("chronic", L("Chronic illness", "Maladie chronique"), { ph: L("Asthma, sickle cell…", "Asthme, drépanocytose…") })}
              {inp("allergies", L("Allergies", "Allergies"))}
              {inp("special", L("Disability / special needs", "Handicap / besoins spécifiques"))}
              <Field label={L("Vaccination up to date? (yellow card)", "Vaccins à jour ? (carnet jaune)")}><Toggle value={f.vacc || ""} onChange={set("vacc")} options={[["yes", L("Yes", "Oui")], ["no", L("No", "Non")]]} /></Field>
              {inp("emName", L("Emergency contact name (not a parent)", "Contact d'urgence (autre que parents)"))}
              {inp("emPhone", L("Emergency contact phone", "Téléphone d'urgence"), { type: "tel" })}
              <Field label={L("Authorised to give first aid?", "Autorisation premiers soins ?")}><Toggle value={f.firstAid || ""} onChange={set("firstAid")} options={[["yes", L("Yes", "Oui")], ["no", L("No", "Non")]]} /></Field>
            </Section>

            <Section title={L("6. Fees & payment declaration", "6. Frais & paiement")}>
              <Field label={L("How will you pay?", "Comment paierez-vous ?")}>
                <div className="grid gap-2">{[L("One-time", "En une fois"), L("Two installments", "Deux tranches"), L("Monthly via Eduvest Savings", "Mensuel via Épargne Eduvest")].map(o => <Button key={o} type="button" size="sm" variant={f.pay === o ? "secondary" : "outline"} aria-pressed={f.pay === o} onClick={() => set("pay")(o)}>{o}</Button>)}</div>
              </Field>
              <label className="flex items-center gap-2 text-sm"><Checkbox checked={agree} onCheckedChange={v => setAgree(!!v)} />{L("I agree to the school rules", "J'accepte le règlement intérieur")}</label>
            </Section>

            <Button variant="outline" className="w-full" disabled={!nationalOk} onClick={() => setReview(true)}><ClipboardList />{L("Review admission draft", "Voir le brouillon")}</Button>
            {nationalOk ? actions : <p className="text-xs text-destructive text-center">{L("Fill the fields marked * to review or submit.", "Remplissez les champs * pour continuer.")}</p>}
          </div>
        )}
      </div>
      <Dialog open={review} onOpenChange={setReview}><DialogContent className="max-w-sm max-h-[85vh] overflow-y-auto"><DialogHeader><DialogTitle>{L("Admission Draft", "Brouillon d’admission")}</DialogTitle><DialogDescription>{scope === "national" ? L("National · Cameroon", "Nationale · Cameroun") : L("International", "Internationale")}</DialogDescription></DialogHeader>
        <dl className="space-y-3 text-sm">{rows.map(([label, value]) => <div key={label}><dt className="text-xs text-muted-foreground">{label}</dt><dd className="font-semibold break-words">{value}</dd></div>)}</dl>
        <Button variant="outline" onClick={() => setReview(false)}>{L("Edit Draft", "Modifier")}</Button>
        {actions}
      </DialogContent></Dialog>
    </div>
  );
};
export default Admission;
