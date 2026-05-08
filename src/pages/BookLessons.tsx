import PageHeader from "@/components/PageHeader";
import { GraduationCap, Star, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const TEACHERS = [
  { name: "Mme Ngono", subject: "Mathematics — Grade 10-12", rate: "5,000 FCFA / hr", rating: 4.9, reviews: 128 },
  { name: "Mr. Tabi", subject: "Physics & Chemistry", rate: "6,000 FCFA / hr", rating: 4.8, reviews: 92 },
  { name: "Mme Achu", subject: "English & Literature", rate: "4,500 FCFA / hr", rating: 4.7, reviews: 76 },
  { name: "Mr. Fombu", subject: "Computer Science / Coding", rate: "8,000 FCFA / hr", rating: 5.0, reviews: 54 },
];

const BookLessons = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-4 pt-6 animate-fade-in">
        <PageHeader title="Book Lessons" subtitle="Find a verified teacher" />

        <div className="bg-accent rounded-2xl p-4 mb-5 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
            <GraduationCap size={22} />
          </div>
          <div className="text-xs">
            <p className="font-bold text-secondary">Verified tutors</p>
            <p className="text-muted-foreground">Pay securely through Eduvest. Every lesson builds your Trust Score.</p>
          </div>
        </div>

        <div className="space-y-3">
          {TEACHERS.map((t) => (
            <div key={t.name} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                  {t.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{t.subject}</p>
                  <div className="flex items-center gap-1 text-[11px] text-warning mt-0.5">
                    <Star size={12} fill="currentColor" />
                    <span className="font-semibold">{t.rating}</span>
                    <span className="text-muted-foreground">({t.reviews})</span>
                  </div>
                </div>
                <p className="text-xs font-bold text-primary">{t.rate}</p>
              </div>
              <Button
                onClick={() => toast.success(`Booking request sent to ${t.name}`)}
                className="w-full h-9 text-xs"
              >
                <Calendar size={14} className="mr-1.5" /> Book a lesson
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookLessons;
