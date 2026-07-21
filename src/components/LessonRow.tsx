import { Icon, type IconName } from "./Icon";
import { StatusIcon, type LessonStatus } from "./StatusIcon";

export type LessonType = "video" | "practice" | "assignment";

const TYPE_META: Record<LessonType, { icon: IconName; label: string }> = {
  video: { icon: "video", label: "Video Lesson" },
  practice: { icon: "list-checks", label: "Practice Exercise" },
  assignment: { icon: "image", label: "Image Assignment" },
};

export interface LessonRowProps {
  title: string;
  type: LessonType;
  time: string;
  status: LessonStatus;
  thumbnail?: boolean;
  /** Override the type's default icon (e.g. Audio MCQ → headphones / mic) */
  icon?: IconName;
  /** Override the type's default label (e.g. "Audio MCQ", "Audio Assignment") */
  label?: string;
  onClick?: () => void;
  /** Visitor view: hide the status icon (no progress for visitors). */
  hideStatus?: boolean;
  /** Visitor's unlocked section: row is shown but not clickable. */
  disabled?: boolean;
  /** No horizontal padding + no hover state — the row sits flush against its container (mobile). */
  flush?: boolean;
}

/** A single lesson inside a chapter (Video / Practice / Assignment / Audio …). */
export function LessonRow({
  title,
  type,
  status,
  thumbnail = false,
  icon,
  label,
  onClick,
  hideStatus = false,
  disabled = false,
  flush = false,
}: LessonRowProps) {
  const meta = TYPE_META[type];
  const rowIcon = icon ?? meta.icon;
  const rowLabel = label ?? meta.label;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "flex w-full items-start gap-16 rounded-sm border-b border-neutral-900 py-12 text-left last:border-0",
        flush ? "" : "px-12",
        "transition-colors duration-300 ease-in-out",
        !disabled && !flush ? "hover:bg-overlay-white-8" : "",
        disabled ? "cursor-default" : "",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500",
        status === "locked" ? "opacity-55" : "",
      ].join(" ")}
    >
      {thumbnail && (
        <span className="relative size-48 shrink-0 overflow-hidden rounded-sm bg-neutral-800">
          <img src="/lesson-video-poster.png" alt="" className="size-full object-cover" />
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col gap-8">
        <span className="line-clamp-2 text-lg font-medium text-neutral-0">{title}</span>
        <span className="flex items-center gap-8 text-md text-secondary-300">
          <Icon name={rowIcon} size={20} />
          {rowLabel}
        </span>
      </span>
      {!hideStatus && <StatusIcon status={status} size={24} />}
    </button>
  );
}
