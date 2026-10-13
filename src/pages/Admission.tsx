import { useState } from "react";
import { GraduationCap, Globe, MapPin, ClipboardList } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useLang } from "@/lib/i18n";

const Admission = () => {
  const { lang } = useLang();
  const fr = lang === "fr";
  const [scope, setScope] = useState<"national" | "international">("national");
  const [level, setLevel] = useState("");
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [programme, setProgramme] = useState("");
  const [country, setCountry] = useState("");
  const [review, setReview] = useState(false);
  const levels = fr ? ["Maternelle", "Primaire", "Secondaire", "Supérieur"] : ["Nursery", "Primary", "Secondary", "Tertiary"];
  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="max-w-md mx-auto px-4 pt-6 space-y-5 animate-fade-in">
        <PageHeader title="Admission" />
        <div className="flex items-center gap-3 text-primary"><GraduationCap size={32} /><h2 className="text-sm font-bold">{fr ? "Votre prochaine étape" : "Your next chapter"}</h2></div>
        <div role="group" aria-label={fr ? "Destination" : "Admission destination"} className="grid grid-cols-2 gap-2">
          <Button variant={scope === "national" ? "default" : "outline"} aria-pressed={scope === "national"} onClick={() => setScope("national")}><MapPin />{fr ? "Nationale" : "National"}</Button>
          <Button variant={scope === "international" ? "default" : "outline"} aria-pressed={scope === "international"} onClick={() => setScope("international")}><Globe />{fr ? "Internationale" : "International"}</Button>
        </div>
        <div className="space-y-2"><Label>{fr ? "Niveau d’études" : "Study level"}</Label><div className="grid grid-cols-2 gap-2">{levels.map((label, index) => <Button key={label} variant={level === String(index) ? "secondary" : "outline"} aria-pressed={level === String(index)} onClick={() => setLevel(String(index))}>{label}</Button>)}</div></div>
        <div className="space-y-4">
          <div className="space-y-2"><Label htmlFor="applicant">{fr ? "Nom du candidat" : "Applicant name"}</Label><Input id="applicant" value={name} onChange={e => setName(e.target.value)} autoComplete="name" /></div>
          {scope === "international" && <div className="space-y-2"><Label htmlFor="destination-country">{fr ? "Pays souhaité" : "Destination country"}</Label><Input id="destination-country" value={country} onChange={e => setCountry(e.target.value)} /></div>}
          <div className="space-y-2"><Label htmlFor="institution">{fr ? "Établissement souhaité" : "Preferred school or university"}</Label><Input id="institution" value={institution} onChange={e => setInstitution(e.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="programme">{fr ? "Classe ou programme" : "Class or programme"}</Label><Input id="programme" value={programme} onChange={e => setProgramme(e.target.value)} /></div>
        </div>
        <p className="text-xs text-muted-foreground">{fr ? "Les établissements partenaires ne sont pas encore disponibles. Ce brouillon ne constitue pas une demande d’admission." : "Partner institutions are not available yet. This draft is not an admission application."}</p>
        <Button className="w-full" disabled={!name.trim() || !institution.trim() || !programme.trim() || !level || (scope === "international" && !country.trim())} onClick={() => setReview(true)}><ClipboardList />{fr ? "Voir le brouillon" : "Review Admission Draft"}</Button>
      </div>
      <Dialog open={review} onOpenChange={setReview}><DialogContent className="max-w-sm"><DialogHeader><DialogTitle>{fr ? "Brouillon d’admission" : "Admission Draft"}</DialogTitle><DialogDescription>{scope === "national" ? (fr ? "Nationale · Cameroun" : "National · Cameroon") : (fr ? "Internationale" : "International")}</DialogDescription></DialogHeader>
        <dl className="space-y-3 text-sm">{[
          [fr ? "Candidat" : "Applicant", name], [fr ? "Pays" : "Country", scope === "national" ? "Cameroon" : country],
          [fr ? "Niveau" : "Level", levels[Number(level)]], [fr ? "Établissement" : "Institution", institution], [fr ? "Programme" : "Programme", programme],
        ].map(([label, value]) => <div key={label}><dt className="text-xs text-muted-foreground">{label}</dt><dd className="font-semibold break-words">{value}</dd></div>)}</dl>
        <Button variant="outline" onClick={() => setReview(false)}>{fr ? "Modifier" : "Edit Draft"}</Button>
      </DialogContent></Dialog>
    </div>
  );
};
export default Admission;