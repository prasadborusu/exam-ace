import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

interface MarksButtonProps {
  id: number;
  subjectId: number;
  moduleId: number;
  marksType: string;
  index: number;
}

export function MarksButton({ id, subjectId, moduleId, marksType, index }: MarksButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.4 }}
    >
      <Link
        to="/subject/$id/module/$moduleId/marks/$marksId"
        params={{ id: String(subjectId), moduleId: String(moduleId), marksId: String(id) }}
        className="group block glass-card rounded-2xl p-8 text-center transition-all duration-300 hover:scale-105 hover:glow-primary hover:border-primary/30"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
            <FileText className="h-7 w-7 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground">{marksType}</h3>
          <p className="text-sm text-muted-foreground">View questions</p>
        </div>
      </Link>
    </motion.div>
  );
}
