import { Link } from "@tanstack/react-router";
import { GraduationCap, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 group-hover:glow-primary transition-all duration-300">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-gradient">ExamAce</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link 
              to="/admin" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Admin
            </Link>
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/50 hover:bg-secondary transition-all duration-300 hover:scale-105"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-foreground" />
              ) : (
                <Moon className="h-4 w-4 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
