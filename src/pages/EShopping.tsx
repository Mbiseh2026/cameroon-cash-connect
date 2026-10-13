import { useState } from "react";
import { ShoppingBag, Package, Minus, Plus, ClipboardList } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useLang } from "@/lib/i18n";
import supplies from "@/assets/school-shopping.jpg";

const EShopping = () => {
  const { lang } = useLang();
  const fr = lang === "fr";
  const [mode, setMode] = useState<"retail" | "bulk">("retail");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState("");
  const [review, setReview] = useState(false);
  const items = [
    { key: "books", name: fr ? "Livres & cahiers" : "Books & exercise books" },
    { key: "stationery", name: fr ? "Fournitures scolaires" : "Stationery" },
    { key: "bags", name: fr ? "Sacs scolaires" : "School bags" },
    { key: "uniforms", name: fr ? "Uniformes" : "Uniforms" },
  ];
  const selected = items.filter(item => (quantities[item.key] || 0) > 0);
  const updateQuantity = (key: string, value: number) => setQuantities(current => ({ ...current, [key]: Math.max(0, Math.min(9999, Math.floor(value) || 0)) }));
  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="max-w-md mx-auto px-4 pt-6 space-y-5 animate-fade-in">
        <PageHeader title="E-Shopping" />
        <img src={supplies} alt={fr ? "Sac, cahiers et fournitures scolaires" : "School bag, books, stationery and uniform"} width={1024} height={768} className="w-full aspect-[4/3] object-cover rounded-lg" />
        <div role="group" aria-label={fr ? "Type de commande" : "Order type"} className="grid grid-cols-2 gap-2">
          <Button variant={mode === "retail" ? "default" : "outline"} aria-pressed={mode === "retail"} onClick={() => setMode("retail")}><ShoppingBag />{fr ? "Au détail" : "Retail"}</Button>
          <Button variant={mode === "bulk" ? "default" : "outline"} aria-pressed={mode === "bulk"} onClick={() => setMode("bulk")}><Package />{fr ? "En gros" : "Bulk Order"}</Button>
        </div>
        <h2 className="font-bold text-secondary">{fr ? "Liste de fournitures" : "School supply list"}</h2>
        <div className="divide-y divide-border">
          {items.map(item => <div key={item.key} className="flex items-center justify-between gap-3 py-3">
            <Label htmlFor={`qty-${item.key}`} className="text-xs leading-snug flex-1">{item.name}</Label>
            <div className="flex items-center gap-1 shrink-0">
              <Button variant="ghost" size="icon" aria-label={`${fr ? "Réduire" : "Decrease"} ${item.name}`} disabled={!quantities[item.key]} onClick={() => updateQuantity(item.key, (quantities[item.key] || 0) - 1)}><Minus /></Button>
              <Input id={`qty-${item.key}`} type="number" min={0} max={9999} value={quantities[item.key] || 0} onChange={e => updateQuantity(item.key, Number(e.target.value))} className="w-16 text-center" />
              <Button variant="ghost" size="icon" aria-label={`${fr ? "Augmenter" : "Increase"} ${item.name}`} onClick={() => updateQuantity(item.key, (quantities[item.key] || 0) + 1)}><Plus /></Button>
            </div>
          </div>)}
        </div>
        <div className="space-y-2"><Label htmlFor="shopping-notes">{fr ? "Précisions (facultatif)" : "Specifications (optional)"}</Label><Input id="shopping-notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder={fr ? "Titres, tailles, classe…" : "Book titles, sizes, class…"} /></div>
        <p className="text-xs text-muted-foreground">{fr ? "Vendeurs et tarifs à venir. Aucune commande ni aucun paiement n’est envoyé." : "Sellers and prices are not available yet. No order or payment will be submitted."}</p>
        <Button className="w-full" disabled={!selected.length} onClick={() => setReview(true)}><ClipboardList />{fr ? "Voir la liste" : "Review Supply List"}</Button>
      </div>
      <Dialog open={review} onOpenChange={setReview}><DialogContent className="max-w-sm"><DialogHeader><DialogTitle>{fr ? "Liste de fournitures" : "Supply List"}</DialogTitle><DialogDescription>{mode === "bulk" ? (fr ? "En gros · Brouillon" : "Bulk Order · Draft") : (fr ? "Au détail · Brouillon" : "Retail · Draft")}</DialogDescription></DialogHeader>
        <ul className="divide-y divide-border">{selected.map(item => <li key={item.key} className="py-3 flex justify-between gap-3 text-sm"><span>{item.name}</span><span className="font-bold">× {quantities[item.key]}</span></li>)}</ul>
        {notes && <p className="text-xs text-muted-foreground break-words">{notes}</p>}
        <Button variant="outline" onClick={() => setReview(false)}>{fr ? "Modifier la liste" : "Edit List"}</Button>
      </DialogContent></Dialog>
    </div>
  );
};
export default EShopping;