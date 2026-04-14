import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Heart } from "lucide-react";
import { toast } from "sonner";

interface QuestionAccordionProps {
  id: number;
  question: string;
  answer: string;
  imageUrl?: string | null;
  isBookmarked: boolean;
  isRead: boolean;
  onToggleBookmark: (id: number) => void;
  onMarkRead: (id: number) => void;
}

export function QuestionAccordion({
  id, question, answer, imageUrl, isBookmarked, isRead, onToggleBookmark, onMarkRead,
}: QuestionAccordionProps) {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((prev) => !prev);
    if (!open && !isRead) {
      onMarkRead(id);
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleBookmark(id);
    toast.success(isBookmarked ? "Bookmark removed" : "Question bookmarked!");
  };

  return (
    <div className={`glass-card rounded-xl overflow-hidden transition-all duration-300 ${open ? "ring-1 ring-primary/20" : ""}`}>
      <button
        onClick={handleToggle}
        className="flex w-full items-center gap-3 p-4 text-left"
      >
        <div className={`h-2 w-2 rounded-full shrink-0 ${isRead ? "bg-primary" : "bg-muted-foreground/30"}`} />
        <span className="flex-1 text-sm font-medium text-foreground">{question}</span>
        <button onClick={handleBookmark} className="p-1.5 rounded-lg hover:bg-secondary transition-colors shrink-0">
          <Heart
            className={`h-4 w-4 transition-colors ${isBookmarked ? "fill-destructive text-destructive" : "text-muted-foreground"}`}
          />
        </button>
        <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0">
              <div className="rounded-lg bg-secondary/50 p-4 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {answer}
                
                {imageUrl && (
                  <div className="mt-4 rounded-xl overflow-hidden border border-border/50 bg-background/30 p-1 group">
                    <img 
                      src={imageUrl} 
                      alt="Question Diagram" 
                      className="w-full max-w-full rounded-lg object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
