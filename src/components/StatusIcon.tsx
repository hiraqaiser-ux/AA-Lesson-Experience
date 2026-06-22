import { Icon } from "./Icon";

export type LessonStatus = "pending" | "completed" | "locked";

/** Status indicator used in lesson rows + chapter headers. */
export function StatusIcon({
  status,
  size = 32,
}: {
  status: LessonStatus;
  size?: number;
}) {
  const box = { width: size, height: size };

  if (status === "completed") {
    return (
      <span
        className="flex shrink-0 items-center justify-center rounded-full bg-success text-neutral-0"
        style={box}
      >
        <Icon name="check" size={Math.round(size * 0.55)} />
      </span>
    );
  }
  if (status === "locked") {
    return (
      <span
        className="flex shrink-0 items-center justify-center text-neutral-300"
        style={box}
      >
        <Icon name="lock" size={Math.round(size * 0.6)} />
      </span>
    );
  }
  // pending — a hollow ring
  return (
    <span
      className="block shrink-0 rounded-full border-2 border-solid border-neutral-300"
      style={box}
    />
  );
}
