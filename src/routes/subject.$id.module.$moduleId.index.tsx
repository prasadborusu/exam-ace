import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MarksButton } from "@/components/MarksButton";
import { CardSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { useSubject, useModule, useMarksCategories } from "@/hooks/use-supabase-data";

export const Route = createFileRoute("/subject/$id/module/$moduleId/")({
  component: ModulePage,
});

function ModulePage() {
  const { id, moduleId } = Route.useParams();
  const subjectId = parseInt(id, 10);
  const modId = parseInt(moduleId, 10);
  const { data: subject } = useSubject(subjectId);
  const { data: mod } = useModule(modId);
  const { data: categories, isLoading } = useMarksCategories(modId);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumbs
        items={[
          { label: subject?.name || "Subject", to: "/subject/$id", params: { id } },
          { label: mod?.name || "Module" },
        ]}
      />

      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-8">
        {mod?.name || "Module"} — <span className="text-gradient">Select Marks</span>
      </h1>

      {isLoading && <CardSkeleton count={2} />}
      {categories && categories.length === 0 && <EmptyState message="No marks categories available." />}
      {categories && categories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
          {categories.map((cat, i) => (
            <MarksButton
              key={cat.id}
              id={cat.id}
              subjectId={subjectId}
              moduleId={modId}
              marksType={cat.marks_type}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  );
}
