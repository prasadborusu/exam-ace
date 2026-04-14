import { GraduationCap } from "lucide-react";
import { useRouter } from "@tanstack/react-router";

export function Footer() {
  const router = useRouter();

  const handleAdminClick = () => {
    const password = window.prompt("Enter Admin Password:");
    if (password === "1212") {
      sessionStorage.setItem("examace_admin_access", "true");
      router.navigate({ to: "/admin" });
    }
  };

  return (
    <footer className="mt-auto border-t border-border/50 py-6">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <div 
          onClick={handleAdminClick}
          className="flex items-center justify-center gap-2 mb-2 cursor-default active:opacity-70 transition-opacity"
          title="ExamAce"
        >
          <GraduationCap className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-gradient select-none">ExamAce</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Premium Exam Preparation Platform &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
