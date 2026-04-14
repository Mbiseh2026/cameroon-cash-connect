import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const BalanceCard = () => {
  const [visible, setVisible] = useState(true);

  return (
    <div className="gradient-primary rounded-2xl p-5 text-primary-foreground shadow-lg">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium opacity-90">Total Balance</span>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-primary-foreground/20 px-2 py-0.5 rounded-full">🇨🇲 FCFA</span>
          <button onClick={() => setVisible(!visible)} className="opacity-80 hover:opacity-100">
            {visible ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>
      </div>
      <p className="text-3xl font-bold tracking-tight">
        {visible ? "0" : "••••••"}
        <span className="text-lg ml-1 font-semibold opacity-80">FCFA</span>
      </p>
    </div>
  );
};

export default BalanceCard;
