import { Icon, type IconName } from "./Icon";
import type { LessonType } from "./LessonRow";

type SidebarState = "default" | "active" | "completed" | "locked";

const TYPE_ICON: Record<LessonType, IconName> = {
  video: "play",
  practice: "clipboard",
  assignment: "file",
};

export interface SidebarLessonItemProps {
  title: string;
  meta: string;
  type: LessonType;
  state: SidebarState;
  onClick?: () => void;
}

/** Compact lesson nav item in the player sidebar. */
export function SidebarLessonItem({
  title,
  meta,
  type,
  state,
  onClick,
}: SidebarLessonItemProps) {
  const active = state === "active";
  const completed = state === "completed";
  const locked = state === "locked";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={locked}
      className={[
        "relative flex w-full items-center gap-12 rounded-sm px-16 py-12 text-left",
        "transition-colors duration-300 ease-in-out",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500",
        active ? "bg-surface" : "hover:bg-surface",
        locked ? "opacity-55" : "",
      ].join(" ")}
    >
      {active && (
        <span className="absolute left-0 top-12 bottom-12 w-4 rounded-full bg-primary-500" />
      )}
      <span
        className={[
          "shrink-0",
          completed
            ? "text-success"
            : active
            ? "text-primary-500"
            : "text-neutral-600",
        ].join(" ")}
      >
        <Icon name={completed ? "check" : locked ? "lock" : TYPE_ICON[type]} size={20} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-4">
        <span
          className={[
            "truncate text-sm font-medium",
            active ? "text-neutral-0" : completed ? "text-secondary-300" : "text-secondary-300",
          ].join(" ")}
        >
          {title}
        </span>
        <span className="truncate text-xs text-secondary-400">{meta}</span>
      </span>
    </button>
  );
}
