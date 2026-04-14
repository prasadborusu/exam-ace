import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SubjectCard } from "@/components/SubjectCard";
import { CardSkeleton } from "@/components/LoadingSkeleton";
import { useSubjects } from "@/hooks/use-supabase-data";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "ExamAce — Premium Exam Preparation" },
      { name: "description", content: "Ace your exams with ExamAce. Premium exam preparation for AI, OS, and TOC subjects." },
    ],
  }),
});

function Index() {
  const { data: subjects, isLoading, error } = useSubjects();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 mb-6">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-wider">Premium Learning</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
          Choose Your <span className="text-gradient">Subject</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Select a subject to start your exam preparation journey
        </p>
      </motion.div>

      {isLoading && <CardSkeleton count={3} />}
      {error && (
        <div className="glass-card rounded-2xl p-8 text-center max-w-lg mx-auto border-destructive/20">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Failed to load content</h3>
          <p className="text-sm text-muted-foreground mb-6">
            We couldn't reach the database. Please check your connection and try refreshing.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:glow-primary"
          >
            Retry Connection
          </button>
        </div>
      )}
      {subjects && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject: any, i: number) => (
            <SubjectCard
              key={subject.id}
              id={subject.id}
              name={subject.name}
              icon={subject.icon}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  );
}
