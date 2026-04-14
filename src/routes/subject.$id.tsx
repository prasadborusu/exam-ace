import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/subject/$id")({
  component: () => <Outlet />,
});
