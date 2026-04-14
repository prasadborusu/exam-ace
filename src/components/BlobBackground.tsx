import { motion } from "framer-motion";

export function BlobBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-background transition-colors duration-500" />
      <div 
        className="absolute inset-0 opacity-40 dark:opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(at 0% 0%, var(--gold-muted) 0px, transparent 50%),
            radial-gradient(at 100% 0%, oklch(0.2 0.05 240 / 10%) 0px, transparent 50%),
            radial-gradient(at 100% 100%, var(--gold-muted) 0px, transparent 50%),
            radial-gradient(at 0% 100%, oklch(0.15 0.05 250 / 10%) 0px, transparent 50%),
            radial-gradient(at 50% 50%, var(--slate-muted) 0px, transparent 50%)
          `,
          filter: "blur(80px)",
        }}
      />
      <motion.div
        className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full opacity-20"
        style={{ background: "var(--color-gold)" }}
        animate={{ 
          x: [0, 100, 0], 
          y: [0, 50, 0],
          scale: [1, 1.2, 1] 
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[60%] left-[60%] h-[50%] w-[50%] rounded-full opacity-10"
        style={{ background: "var(--color-gold)" }}
        animate={{ 
          x: [0, -80, 0], 
          y: [0, -60, 0],
          scale: [1, 1.1, 1] 
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
