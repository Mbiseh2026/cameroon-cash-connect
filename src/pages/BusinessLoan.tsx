import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { Upload } from "lucide-react";

const statusSteps = ["Under Review", "Approved", "Disbursed", "Repaying"];

const BusinessLoan = () => {
  const [businessType, setBusinessType] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");

  const handleApply = () => {
    if (!businessType || !loanAmount || !duration) {
      toast.error("Please fill all required fields");
      return;
    }
    toast.success("Loan application submitted for review!");
    setBusinessType("");
    setLoanAmount("");
    setDuration("");
    setDescription("");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 pt-6 animate-fade-in">
        <PageHeader title="Business Loan" subtitle="Apply for a structured loan" />

        <div className="space-y-5">
          <div>
            <Label className="text-sm font-semibold">Business Type</Label>
            <Input placeholder="e.g. Agriculture, Retail" value={businessType} onChange={(e) => setBusinessType(e.target.value)} className="mt-1.5" />
          </div>

          <div>
            <Label className="text-sm font-semibold">Requested Amount (FCFA)</Label>
            <Input type="number" placeholder="e.g. 1,000,000" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} className="mt-1.5" />
          </div>

          <div>
            <Label className="text-sm font-semibold">Duration</Label>
            <Input placeholder="e.g. 12 months" value={duration} onChange={(e) => setDuration(e.target.value)} className="mt-1.5" />
          </div>

          <div>
            <Label className="text-sm font-semibold">Business Description</Label>
            <Textarea placeholder="Brief description of your business..." value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1.5" />
          </div>

          <button className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-xl text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors">
            <Upload size={18} />
            Upload documents (ID, business plan)
          </button>

          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs font-bold mb-3">Loan Status Tracker</p>
            <div className="flex justify-between">
              {statusSteps.map((step, i) => (
                <div key={step} className="flex flex-col items-center gap-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    {i + 1}
                  </div>
                  <span className="text-[9px] text-muted-foreground text-center">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handleApply} className="w-full h-12 text-base font-bold gradient-primary text-primary-foreground">
            Apply for Loan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BusinessLoan;
