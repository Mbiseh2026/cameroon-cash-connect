import { Trophy, Target, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const extras = [
  { icon: Clock, label: "My History", path: "/history", desc: "View transactions" },
  { icon: Trophy, label: "My Rewards", path: "/rewards", desc: "Earn points" },
  { icon: Target, label: "My Goals", path: "/goals", desc: "Track progress" },
];

const HomeExtras = () => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-3">
      {extras.map((item) => (
        <button
          key={item.label}
          onClick={() => navigate(item.path)}
          className="flex-1 flex flex-col items-center gap-1.5 p-3 bg-card rounded-xl border border-border hover:shadow-sm transition-all"
        >
          <item.icon size={20} className="text-primary" />
          <span className="text-xs font-bold text-foreground">{item.label}</span>
          <span className="text-[10px] text-muted-foreground">{item.desc}</span>
        </button>
      ))}
    </div>
  );
};

export default HomeExtras;
