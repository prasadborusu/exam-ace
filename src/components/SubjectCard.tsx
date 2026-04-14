import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Brain, Cpu, Binary } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  brain: Brain,
  cpu: Cpu,
  binary: Binary,
};

const glowMap: Record<string, string> = {
  brain: "glow-primary",
  cpu: "glow-accent",
  binary: "glow-gold",
};

interface SubjectCardProps {
  id: number;
  name: string;
  icon: string | null;
  index: number;
}

export function SubjectCard({ id, name, icon, index }: SubjectCardProps) {
  const IconComp = iconMap[icon || "brain"] || Brain;
  const glow = glowMap[icon || "brain"] || "glow-blue";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
    >
      <Link
        to="/subject/$id"
        params={{ id: String(id) }}
        className={`group block glass-card rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:${glow} hover:border-primary/30`}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-all duration-300">
            <IconComp className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
          </div>
          <h3 className="text-xl font-bold text-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground">Explore modules &amp; questions</p>
          <div className="mt-2 h-1 w-12 rounded-full bg-primary/30 group-hover:w-20 group-hover:bg-primary transition-all duration-500" />
        </div>
      </Link>
    </motion.div>
  );
}
