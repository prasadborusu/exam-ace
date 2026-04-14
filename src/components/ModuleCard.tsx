import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

interface ModuleCardProps {
  id: number;
  subjectId: number;
  name: string;
  moduleNumber: number | null;
  index: number;
}

export function ModuleCard({ id, subjectId, name, moduleNumber, index }: ModuleCardProps) {
  const displayModuleNumber = moduleNumber !== null ? `Module ${moduleNumber}` : "Module";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Link
        to="/subject/$id/module/$moduleId"
        params={{ id: String(subjectId), moduleId: String(id) }}
        className="group block glass-card rounded-2xl p-6 transition-all duration-300 hover:scale-[1.03] hover:glow-primary hover:border-primary/30"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{displayModuleNumber}</p>
            <h3 className="text-lg font-semibold text-foreground">{name}</h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
