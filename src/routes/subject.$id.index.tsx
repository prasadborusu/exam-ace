import { createFileRoute } from "@tanstack/react-router";
import { ModuleCard } from "@/components/ModuleCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CardSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { useSubject, useModules } from "@/hooks/use-supabase-data";

export const Route = createFileRoute("/subject/$id/")({
  component: SubjectPage,
});

function SubjectPage() {
  const { id } = Route.useParams();
  const subjectId = parseInt(id, 10);
  const { data: subject } = useSubject(subjectId);
  const { data: modules, isLoading } = useModules(subjectId);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumbs items={[{ label: subject?.name || "Subject" }]} />

      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-8">
        {subject?.name || "Subject"} <span className="text-gradient">Modules</span>
      </h1>

      {isLoading && <CardSkeleton count={5} />}
      {modules && modules.length === 0 && <EmptyState message="No modules available." />}
      {modules && modules.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((mod, i) => (
            <ModuleCard
              key={mod.id}
              id={mod.id}
              subjectId={subjectId}
              name={mod.name}
              moduleNumber={mod.module_number}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  );
}
