import { useState } from "react";
import { Icon } from "./Icon";
import { StatusBadge } from "./StatusBadge";
import { type LessonStatus } from "./StatusIcon";
import { LessonRow, type LessonRowProps } from "./LessonRow";

export interface ChapterCardProps {
  title: string;
  desc: string;
  status: Exclude<LessonStatus, "locked">;
  lessons: LessonRowProps[];
  /** indices used to build the lesson id `${sectionIdx}-${chapterIdx}-${lessonIdx}` */
  sectionIdx?: number;
  chapterIdx?: number;
  onSelectLesson?: (lessonId: string) => void;
  /** Visitor view: hide the chapter status badge + per-lesson status icons. */
  hideStatus?: boolean;
  /** Visitor's unlocked section: lessons are shown but not clickable. */
  disableLessons?: boolean;
  /** Override the open-on-mount default (otherwise: open unless completed). */
  defaultOpen?: boolean;
}

/**
 * Chapter card — a collapsible card.
 * - Mobile: stacks title + chevron, the "N lessons · M assignment" line, then
 *   the status badge below.
 * - Desktop (md+): a single row — title over the meta line on the left, and the
 *   status badge + chevron on the top-right.
 * Completed chapters start collapsed; pending chapters start open.
 */
export function ChapterCard({
  title,
  desc,
  status,
  lessons,
  sectionIdx = 0,
  chapterIdx = 0,
  onSelectLesson,
  hideStatus = false,
  disableLessons = false,
  defaultOpen,
}: ChapterCardProps) {
  const [open, setOpen] = useState(defaultOpen ?? status !== "completed");

  return (
    <div className="flex flex-col gap-16 rounded-md border border-secondary-900 p-16 transition duration-300 ease-in-out hover:border-secondary-800">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-start gap-12 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500"
      >
        {/* Title + meta line; the badge stacks below here on mobile only. */}
        <span className="flex min-w-0 flex-1 flex-col gap-8 md:gap-2">
          <span className="text-lg font-semibold text-neutral-0">{title}</span>
          <span className="text-sm text-secondary-300">{desc}</span>
          {!hideStatus && (
            <span className="md:hidden">
              <StatusBadge status={status} />
            </span>
          )}
        </span>

        {/* Status badge — desktop only, on the top row beside the chevron. */}
        {!hideStatus && (
          <span className="hidden shrink-0 md:inline-flex">
            <StatusBadge status={status} />
          </span>
        )}
        <Icon
          name={open ? "chevron-up" : "chevron-down"}
          size={20}
          className="mt-2 shrink-0 text-secondary-300"
        />
      </button>

      {open && (
        <div className="flex flex-col">
          {lessons.map((l, i) => (
            <LessonRow
              key={i}
              {...l}
              hideStatus={hideStatus}
              disabled={disableLessons}
              onClick={
                disableLessons
                  ? undefined
                  : () => onSelectLesson?.(`${sectionIdx}-${chapterIdx}-${i}`)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
