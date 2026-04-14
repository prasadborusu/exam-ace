import { FileQuestion } from "lucide-react";

export function EmptyState({ message = "No questions available yet." }: { message?: string }) {
  return (
    <div className="glass-card rounded-2xl p-12 text-center">
      <FileQuestion className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
