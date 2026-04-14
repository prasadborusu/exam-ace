import { GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/50 py-6">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <GraduationCap className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-gradient">ExamAce</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Premium Exam Preparation Platform &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
