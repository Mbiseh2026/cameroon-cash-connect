import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  action: "Send" | "Withdraw";
}

const KycGate = ({ open, onOpenChange, action }: Props) => {
  const navigate = useNavigate();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="w-12 h-12 rounded-full bg-warning/10 text-warning flex items-center justify-center mb-2">
            <ShieldAlert size={22} />
          </div>
          <DialogTitle>Verify your identity to {action.toLowerCase()}</DialogTitle>
          <DialogDescription>
            For your safety and Cameroon regulations, {action.toLowerCase()} is unlocked only after KYC.
            You can still deposit, save and receive money in the meantime.
          </DialogDescription>
        </DialogHeader>
        <FooterButtons onCancel={() => onOpenChange(false)} onGo={() => { onOpenChange(false); navigate("/onboarding"); }} />
      </DialogContent>
    </Dialog>
  );
};

const FooterButtons = ({ onCancel, onGo }: { onCancel: () => void; onGo: () => void }) => (
  <DialogFooter>
    <Button variant="outline" onClick={onCancel}>Later</Button>
    <Button onClick={onGo} className="gradient-primary text-primary-foreground">Verify now</Button>
  </DialogFooter>
);

export default KycGate;
