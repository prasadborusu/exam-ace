import { CheckCircle } from "lucide-react";

interface ProgressTrackerProps {
  read: number;
  total: number;
}

export function ProgressTracker({ read, total }: ProgressTrackerProps) {
  const percentage = total > 0 ? Math.round((read / total) * 100) : 0;

  return (
    <div className="glass-card rounded-xl p-4 flex items-center gap-4">
      <CheckCircle className="h-5 w-5 text-primary shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-foreground">Progress</span>
          <span className="text-xs text-muted-foreground">{read}/{total} Completed</span>
        </div>
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
