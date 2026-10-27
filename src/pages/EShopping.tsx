import { useState } from "react";
import { ShoppingBag, Package, Minus, Plus, ClipboardList, MessageCircle, Phone, Check } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useLang } from "@/lib/i18n";
import supplies from "@/assets/school-shopping.jpg";
import labImg from "@/assets/shop-lab.jpg";
import laptopImg from "@/assets/shop-laptop.jpg";
import booksImg from "@/assets/shop-books.jpg";
import uniformImg from "@/assets/shop-uniform.jpg";

const WHATSAPP = "https://wa.me/237600000000";
const fmt = (n: number) => `${n.toLocaleString("en-US")} FCFA`;

const EShopping = () => {
  const { lang } = useLang();
  const fr = lang === "fr";
  const [mode, setMode] = useState<"retail" | "bulk">("retail");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState("");
  const [review, setReview] = useState(false);
  const [viewing, setViewing] = useState<string | null>(null);
  const [bulkOrg, setBulkOrg] = useState("");
  const [bulkNeeds, setBulkNeeds] = useState("");

  const items = [
    { key: "books", img: booksImg, price: 2500, name: fr ? "Manuels & cahiers" : "Textbooks & exercise books", who: fr ? "Élèves" : "Students" },
    { key: "stationery", img: booksImg, price: 1500, name: fr ? "Stylos, crayons & kit géométrie" : "Pens, pencils & geometry set", who: fr ? "Élèves" : "Students" },
    { key: "bags", img: uniformImg, price: 8000, name: fr ? "Sacs scolaires" : "School bags", who: fr ? "Élèves" : "Students" },
    { key: "uniforms", img: uniformImg, price: 7500, name: fr ? "Uniformes" : "Uniforms", who: fr ? "Élèves" : "Students" },
    { key: "shoes", img: uniformImg, price: 9000, name: fr ? "Chaussures scolaires" : "School shoes", who: fr ? "Élèves" : "Students" },
    { key: "lab", img: labImg, price: 45000, name: fr ? "Kit de laboratoire (secondaire & lycée)" : "Laboratory kit (secondary & high school)", who: fr ? "Écoles & élèves" : "Schools & students" },
    { key: "goggles", img: labImg, price: 3000, name: fr ? "Lunettes & blouse de labo" : "Lab goggles & coat", who: fr ? "Élèves" : "Students" },
    { key: "calculator", img: booksImg, price: 12000, name: fr ? "Calculatrice scientifique" : "Scientific calculator", who: fr ? "Élèves" : "Students" },
    { key: "laptop", img: laptopImg, price: 185000, name: fr ? "Ordinateur portable étudiant" : "Student laptop", who: fr ? "Élèves & enseignants" : "Students & teachers" },
    { key: "teacher", img: booksImg, price: 6000, name: fr ? "Kit enseignant (craies, marqueurs, registres)" : "Teacher kit (chalk, markers, registers)", who: fr ? "Enseignants" : "Teachers" },
  ];
  const selected = items.filter(i => (quantities[i.key] || 0) > 0);
  const total = selected.reduce((s, i) => s + i.price * quantities[i.key], 0);
  const updateQuantity = (key: string, value: number) => setQuantities(c => ({ ...c, [key]: Math.max(0, Math.min(9999, Math.floor(value) || 0)) }));
  const current = items.find(i => i.key === viewing);

  const Qty = ({ k, name }: { k: string; name: string }) => (
    <div className="flex items-center gap-1 shrink-0">
      <Button variant="ghost" size="icon" aria-label={`${fr ? "Réduire" : "Decrease"} ${name}`} disabled={!quantities[k]} onClick={() => updateQuantity(k, (quantities[k] || 0) - 1)}><Minus /></Button>
      <Input aria-label={`${fr ? "Quantité" : "Quantity"} ${name}`} type="number" min={0} max={9999} value={quantities[k] || 0} onChange={e => updateQuantity(k, Number(e.target.value))} className="w-14 text-center px-1" />
      <Button variant="ghost" size="icon" aria-label={`${fr ? "Augmenter" : "Increase"} ${name}`} onClick={() => updateQuantity(k, (quantities[k] || 0) + 1)}><Plus /></Button>
    </div>
  );

  const bulkMsg = encodeURIComponent(`Hi Eduvest, I want a bulk quote.\nSchool/Organisation: ${bulkOrg}\nNeeds: ${bulkNeeds}`);

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="max-w-md mx-auto px-4 pt-6 space-y-5 animate-fade-in">
        <PageHeader title="E-Shopping" />
        <div role="group" aria-label={fr ? "Type de commande" : "Order type"} className="grid grid-cols-2 gap-2">
          <Button variant={mode === "retail" ? "default" : "outline"} aria-pressed={mode === "retail"} onClick={() => setMode("retail")}><ShoppingBag />{fr ? "Au détail" : "Retail"}</Button>
          <Button variant={mode === "bulk" ? "default" : "outline"} aria-pressed={mode === "bulk"} onClick={() => setMode("bulk")}><Package />{fr ? "En gros" : "Bulk Order"}</Button>
        </div>

        {mode === "bulk" ? (
          <section className="space-y-4">
            <div className="rounded-2xl bg-secondary text-secondary-foreground p-5 space-y-2">
              <Package size={28} />
              <h2 className="text-lg font-extrabold">{fr ? "Devis personnalisé" : "Personalised bulk quote"}</h2>
              <p className="text-xs opacity-90">{fr ? "Pour écoles, associations et revendeurs. Un conseiller vous prépare un prix adapté à vos quantités." : "For schools, PTAs and resellers. An advisor prepares a price for your exact quantities."}</p>
            </div>
            <div className="space-y-2"><Label htmlFor="bulk-org">{fr ? "École ou organisation" : "School or organisation"}</Label><Input id="bulk-org" value={bulkOrg} onChange={e => setBulkOrg(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="bulk-needs">{fr ? "Ce dont vous avez besoin" : "What you need"}</Label><Input id="bulk-needs" value={bulkNeeds} onChange={e => setBulkNeeds(e.target.value)} placeholder={fr ? "ex. 200 uniformes, 10 kits labo" : "e.g. 200 uniforms, 10 lab kits"} /></div>
            <Button asChild className="w-full"><a href={`${WHATSAPP}?text=${bulkMsg}`} target="_blank" rel="noopener noreferrer"><MessageCircle />{fr ? "Parler au service client" : "Chat with Customer Service"}</a></Button>
            <Button asChild variant="outline" className="w-full"><a href="tel:+237600000000"><Phone />{fr ? "Appeler" : "Call us"}</a></Button>
          </section>
        ) : (<>
          <img src={supplies} alt={fr ? "Fournitures scolaires" : "School supplies"} width={1024} height={768} className="w-full aspect-[16/9] object-cover rounded-lg" />
          <h2 className="font-bold text-secondary">{fr ? "Articles scolaires" : "School items"}</h2>
          <div className="grid grid-cols-2 gap-3">
            {items.map(item => (
              <div key={item.key} className="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
                <button onClick={() => setViewing(item.key)} className="text-left">
                  <img src={item.img} alt={item.name} loading="lazy" width={944} height={704} className="w-full aspect-[4/3] object-cover" />
                  <div className="p-2 space-y-0.5">
                    <p className="text-xs font-semibold leading-snug line-clamp-2">{item.name}</p>
                    <p className="text-[10px] text-muted-foreground">{item.who}</p>
                    <p className="text-sm font-extrabold text-primary">{fmt(item.price)}</p>
                  </div>
                </button>
                <div className="mt-auto pb-1 flex justify-center"><Qty k={item.key} name={item.name} /></div>
              </div>
            ))}
          </div>
          <div className="space-y-2"><Label htmlFor="shopping-notes">{fr ? "Précisions (facultatif)" : "Specifications (optional)"}</Label><Input id="shopping-notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder={fr ? "Titres, tailles, classe…" : "Book titles, sizes, class…"} /></div>
          <p className="text-xs text-muted-foreground">{fr ? "Prix indicatifs. Aucune commande ni paiement n’est encore envoyé." : "Indicative prices. No order or payment is submitted yet."}</p>
          <Button className="w-full" disabled={!selected.length} onClick={() => setReview(true)}><ClipboardList />{fr ? "Voir le panier" : "Review Cart"}{total > 0 && ` · ${fmt(total)}`}</Button>
        </>)}
      </div>

      <Dialog open={!!current} onOpenChange={o => !o && setViewing(null)}>
        <DialogContent className="max-w-sm">
          {current && <>
            <img src={current.img} alt={current.name} width={944} height={704} className="w-full aspect-[4/3] object-cover rounded-lg" />
            <DialogHeader><DialogTitle>{current.name}</DialogTitle><DialogDescription>{current.who}</DialogDescription></DialogHeader>
            <div className="flex items-center justify-between"><p className="text-lg font-extrabold text-primary">{fmt(current.price)}</p><Qty k={current.key} name={current.name} /></div>
            <Button onClick={() => { if (!quantities[current.key]) updateQuantity(current.key, 1); setViewing(null); }}><Check />{fr ? "Ajouter" : "Add to cart"}</Button>
          </>}
        </DialogContent>
      </Dialog>

      <Dialog open={review} onOpenChange={setReview}><DialogContent className="max-w-sm"><DialogHeader><DialogTitle>{fr ? "Panier" : "Cart"}</DialogTitle><DialogDescription>{fr ? "Au détail · Brouillon" : "Retail · Draft"}</DialogDescription></DialogHeader>
        <ul className="divide-y divide-border">{selected.map(i => <li key={i.key} className="py-2 flex justify-between gap-3 text-sm"><span>{i.name} × {quantities[i.key]}</span><span className="font-bold whitespace-nowrap">{fmt(i.price * quantities[i.key])}</span></li>)}</ul>
        <div className="flex justify-between font-extrabold"><span>Total</span><span className="text-primary">{fmt(total)}</span></div>
        {notes && <p className="text-xs text-muted-foreground break-words">{notes}</p>}
        <Button variant="outline" onClick={() => setReview(false)}>{fr ? "Modifier" : "Edit Cart"}</Button>
      </DialogContent></Dialog>
    </div>
  );
};
export default EShopping;
