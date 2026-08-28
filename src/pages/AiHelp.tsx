import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, GraduationCap, Users, BookOpen } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { useLang } from "@/lib/i18n";
import { getUser } from "@/lib/userStore";

type Msg = { role: "user" | "ai"; text: string };

const SUGGESTIONS = {
  en: {
    student: ["Explain fractions simply", "Make me a 7-day exam plan", "Quiz me on photosynthesis"],
    teacher: ["Draft a Form 3 maths lesson plan", "Generate 10 quiz questions", "Write report card comments"],
    parent: ["How do I pay school fees?", "How can I save for tuition?", "Explain my child's weekly report"],
  },
  fr: {
    student: ["Explique les fractions simplement", "Fais-moi un plan de révision de 7 jours", "Interroge-moi sur la photosynthèse"],
    teacher: ["Rédige un plan de cours de maths", "Génère 10 questions de quiz", "Écris des commentaires de bulletin"],
    parent: ["Comment payer les frais scolaires ?", "Comment épargner pour la scolarité ?", "Explique le rapport de mon enfant"],
  },
} as const;

const AiHelp = () => {
  const { lang } = useLang();
  const fr = lang === "fr";
  const role = getUser().role;
  const group: keyof typeof SUGGESTIONS["en"] =
    role === "teacher" ? "teacher" : role === "student" ? "student" : "parent";

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text: fr
            ? "Voici une réponse de démonstration. L'assistant Eduvest sera connecté à un vrai modèle IA pour répondre en détail aux élèves, enseignants et parents."
            : "This is a demo answer. The Eduvest assistant will be connected to a real AI model to give full answers for students, teachers and parents.",
        },
      ]);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="max-w-md mx-auto px-4 pt-6 space-y-4 animate-fade-in">
        <PageHeader
          title={fr ? "Aide IA" : "AI Help"}
          subtitle={fr ? "Pour élèves, enseignants et parents" : "For students, teachers & parents"}
        />

        <section className="gradient-hero rounded-2xl p-4 text-primary-foreground">
          <div className="flex items-center gap-2">
            <Sparkles size={18} />
            <h2 className="text-lg font-extrabold">Eduvest AI</h2>
          </div>
          <p className="text-[11px] opacity-90 mt-1">
            {fr
              ? "Devoirs, plans de cours, frais scolaires et conseils d'épargne — demandez tout."
              : "Homework, lesson plans, school fees and savings advice — just ask."}
          </p>
          <div className="grid grid-cols-3 gap-2 mt-3 text-center">
            {[
              { Icon: BookOpen, l: fr ? "Élèves" : "Students" },
              { Icon: GraduationCap, l: fr ? "Enseignants" : "Teachers" },
              { Icon: Users, l: fr ? "Parents" : "Parents" },
            ].map(({ Icon, l }) => (
              <div key={l} className="bg-primary/20 rounded-lg py-2">
                <Icon size={16} className="mx-auto" />
                <p className="text-[10px] font-semibold mt-1">{l}</p>
              </div>
            ))}
          </div>
        </section>

        {messages.length === 0 && (
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-secondary">{fr ? "Suggestions" : "Try asking"}</h3>
            {SUGGESTIONS[fr ? "fr" : "en"][group].map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="w-full text-left text-sm font-semibold bg-card border border-border rounded-xl p-3 hover:shadow-sm transition"
              >
                {s}
              </button>
            ))}
          </section>
        )}

        <section className="space-y-2">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-card border border-border rounded-bl-sm"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-sm text-muted-foreground">
                {fr ? "Rédaction…" : "Typing…"}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </section>
      </div>

      <div className="fixed bottom-20 left-0 right-0 z-40">
        <div className="max-w-md mx-auto px-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 bg-card border border-border rounded-2xl p-2 shadow-lg"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={fr ? "Posez votre question…" : "Ask anything…"}
              className="border-0 focus-visible:ring-0 text-sm"
            />
            <button
              type="submit"
              className="w-10 h-10 shrink-0 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40"
              disabled={!input.trim()}
              aria-label={fr ? "Envoyer" : "Send"}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AiHelp;
