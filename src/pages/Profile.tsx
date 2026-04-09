import PageHeader from "@/components/PageHeader";
import { User, Shield, Bell, LogOut } from "lucide-react";

const Profile = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 pt-6 animate-fade-in">
        <PageHeader title="Profile" subtitle="Account settings" />

        <div className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 mb-6">
          <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center">
            <span className="text-xl font-bold text-primary-foreground">T</span>
          </div>
          <div>
            <p className="font-bold">Treasurit User</p>
            <p className="text-xs text-muted-foreground">+237 6XX XXX XXX</p>
            <span className="text-[10px] bg-success/10 text-success px-2 py-0.5 rounded-full font-bold">Verified</span>
          </div>
        </div>

        <div className="space-y-2">
          {[
            { icon: User, label: "Personal Information" },
            { icon: Shield, label: "Security & PIN" },
            { icon: Bell, label: "Notifications" },
          ].map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:bg-muted transition-colors"
            >
              <item.icon size={18} className="text-primary" />
              <span className="text-sm font-semibold">{item.label}</span>
            </button>
          ))}

          <button className="w-full flex items-center gap-3 bg-card border border-destructive/20 rounded-xl p-4 hover:bg-destructive/5 transition-colors mt-4">
            <LogOut size={18} className="text-destructive" />
            <span className="text-sm font-semibold text-destructive">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
