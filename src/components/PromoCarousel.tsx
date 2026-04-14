import { useState, useEffect } from "react";
import { PiggyBank, Trophy, Landmark } from "lucide-react";

const slides = [
  {
    icon: PiggyBank,
    title: "Save & Earn",
    description:
      "Save regularly, earn rewards, and access T-Funds — zero-interest loans for committed users.",
    gradient: "from-primary to-secondary",
  },
  {
    icon: Trophy,
    title: "Loyalty Rewards",
    description:
      "The more you save, the more points you earn. Redeem rewards and unlock exclusive benefits.",
    gradient: "from-secondary to-primary",
  },
  {
    icon: Landmark,
    title: "T-Funds Access",
    description:
      "Committed savers qualify for zero-interest business funding. Build your merit score today.",
    gradient: "from-primary to-accent",
  },
];

const PromoCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <div className="relative">
      <div className="bg-card border border-border rounded-xl p-5 overflow-hidden">
        <div className="flex items-start gap-4">
          <div
            className={`shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${slide.gradient} flex items-center justify-center`}
          >
            <slide.icon size={20} className="text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground mb-1">{slide.title}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {slide.description}
            </p>
          </div>
        </div>
      </div>
      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current
                ? "w-5 bg-primary"
                : "w-1.5 bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PromoCarousel;
