import PageHeader from "@/components/PageHeader";
import { ArrowDownToLine, ArrowUpFromLine, SendHorizontal } from "lucide-react";

const transactions = [
  { id: "1", type: "deposit", desc: "MTN MoMo Deposit", amount: 50000, date: "2025-04-08", status: "confirmed" },
  { id: "2", type: "send", desc: "To Jean Pierre", amount: -15000, date: "2025-04-07", status: "confirmed" },
  { id: "3", type: "withdraw", desc: "Orange Money", amount: -25000, date: "2025-04-06", status: "confirmed" },
  { id: "4", type: "deposit", desc: "Goal Savings - Land", amount: -10000, date: "2025-04-05", status: "confirmed" },
  { id: "5", type: "deposit", desc: "Bank Transfer", amount: 100000, date: "2025-04-04", status: "pending" },
];

const iconMap = {
  deposit: ArrowDownToLine,
  send: SendHorizontal,
  withdraw: ArrowUpFromLine,
};

const History = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 pt-6 animate-fade-in">
        <PageHeader title="My History" subtitle="Transaction records" />

        <div className="space-y-3">
          {transactions.map((tx) => {
            const Icon = iconMap[tx.type as keyof typeof iconMap] || ArrowDownToLine;
            const isPositive = tx.amount > 0;
            return (
              <div key={tx.id} className="flex items-center gap-3 bg-card border border-border rounded-xl p-3.5">
                <div className={`p-2 rounded-lg ${isPositive ? "bg-success/10" : "bg-destructive/10"}`}>
                  <Icon size={18} className={isPositive ? "text-success" : "text-destructive"} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{tx.desc}</p>
                  <p className="text-[10px] text-muted-foreground">{tx.date}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${isPositive ? "text-success" : "text-destructive"}`}>
                    {isPositive ? "+" : ""}{tx.amount.toLocaleString()}
                  </p>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                    tx.status === "confirmed" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default History;
