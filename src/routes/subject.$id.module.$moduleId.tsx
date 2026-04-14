import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/subject/$id/module/$moduleId")({
  component: () => <Outlet />,
});
