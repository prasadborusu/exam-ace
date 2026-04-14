import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SearchBar } from "@/components/SearchBar";
import { ProgressTracker } from "@/components/ProgressTracker";
import { QuestionAccordion } from "@/components/QuestionAccordion";
import { QuestionSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { useSubject, useModule, useMarksCategory, useQuestions } from "@/hooks/use-supabase-data";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useProgress } from "@/hooks/use-progress";

export const Route = createFileRoute("/subject/$id/module/$moduleId/marks/$marksId")({
  component: QuestionsPage,
});

function QuestionsPage() {
  const { id, moduleId, marksId } = Route.useParams();
  const subjectId = parseInt(id, 10);
  const modId = parseInt(moduleId, 10);
  const marksCatId = parseInt(marksId, 10);

  const { data: subject } = useSubject(subjectId);
  const { data: mod } = useModule(modId);
  const { data: marksCat } = useMarksCategory(marksCatId);
  const { data: questions, isLoading } = useQuestions(marksCatId);

  const [search, setSearch] = useState("");
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const { markAsRead, isRead, getProgress } = useProgress();

  const filtered = questions?.filter((q) =>
    q.question.toLowerCase().includes(search.toLowerCase())
  );

  const progress = questions ? getProgress(questions.map((q) => q.id)) : { read: 0, total: 0 };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Breadcrumbs
        items={[
          { label: subject?.name || "Subject", to: "/subject/$id", params: { id } },
          { label: mod?.name || "Module", to: "/subject/$id/module/$moduleId", params: { id, moduleId } },
          { label: marksCat?.marks_type || "Questions" },
        ]}
      />

      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
        {marksCat?.marks_type || "Questions"}
      </h1>

      <div className="space-y-4 mb-6">
        <ProgressTracker read={progress.read} total={progress.total} />
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {isLoading && <QuestionSkeleton count={4} />}

      {filtered && filtered.length === 0 && (
        <EmptyState message={search ? "No questions match your search." : "No questions available yet."} />
      )}

      {filtered && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((q) => (
            <QuestionAccordion
              key={q.id}
              id={q.id}
              question={q.question}
              answer={q.answer}
              isBookmarked={isBookmarked(q.id)}
              isRead={isRead(q.id)}
              onToggleBookmark={toggleBookmark}
              onMarkRead={markAsRead}
            />
          ))}
        </div>
      )}
    </div>
  );
}
