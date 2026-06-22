import type { LessonStatus } from "./StatusIcon";

const MAP: Record<
  Exclude<LessonStatus, "locked">,
  { label: string; cls: string }
> = {
  pending: { label: "Pending", cls: "bg-warning-900 text-warning-300" },
  completed: { label: "Completed", cls: "bg-success-900 text-success-300" },
};

/** Pill badge shown on chapter headers. */
export function StatusBadge({
  status,
}: {
  status: Exclude<LessonStatus, "locked">;
}) {
  const { label, cls } = MAP[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-12 py-4 text-sm font-medium ${cls}`}
    >
      {label}
    </span>
  );
}
