interface StepperProps {
  steps: string[];
  current: number;
}

const Stepper = ({ steps, current }: StepperProps) => (
  <div className="flex items-center gap-1 mb-5">
    {steps.map((s, i) => {
      const active = i === current;
      const done = i < current;
      return (
        <div key={s} className="flex-1 flex flex-col items-center">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
              done ? "bg-primary text-primary-foreground" : active ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : "bg-muted text-muted-foreground"
            }`}
          >
            {done ? "✓" : i + 1}
          </div>
          <span
            className={`text-[10px] font-semibold mt-1 leading-tight text-center ${
              active || done ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {s}
          </span>
        </div>
      );
    })}
  </div>
);

export default Stepper;
