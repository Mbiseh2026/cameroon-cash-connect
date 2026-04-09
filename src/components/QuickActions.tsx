import { ArrowDownToLine, Target, Landmark, SendHorizontal, ArrowUpFromLine, Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";

const actions = [
  { icon: ArrowDownToLine, label: "Deposit", path: "/deposit", color: "bg-primary" },
  { icon: Target, label: "Goal Saving", path: "/goals", color: "bg-secondary" },
  { icon: Landmark, label: "Business Loan", path: "/loans", color: "bg-navy" },
  { icon: SendHorizontal, label: "Send Money", path: "/send", color: "bg-sky-blue" },
  { icon: ArrowUpFromLine, label: "Withdraw", path: "/withdraw", color: "bg-warning" },
  { icon: Coins, label: "T-Funds", path: "/tfunds", color: "bg-success" },
];

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-3 gap-3">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={() => navigate(action.path)}
          className="flex flex-col items-center gap-2 p-4 bg-card rounded-xl border border-border hover:shadow-md transition-all active:scale-95"
        >
          <div className={`${action.color} p-2.5 rounded-xl text-primary-foreground`}>
            <action.icon size={22} />
          </div>
          <span className="text-xs font-semibold text-foreground">{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
