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
  /** Hide just the chapter status badge, independent of hideStatus — the per-lesson status icons stay. */
  hideBadge?: boolean;
  /** Visitor's unlocked section: lessons are shown but not clickable. */
  disableLessons?: boolean;
  /** Override the open-on-mount default (otherwise: open unless completed). */
  defaultOpen?: boolean;
  /** Lesson rows sit flush against the card edge (no side padding, no hover state) — mobile. */
  flushLessons?: boolean;
  /** Chapter title at 16px instead of the default 18px — mobile. */
  smallTitle?: boolean;
  /** Matches the mobile Lesson tab Figma frame: 20px header/lessons gap (vs 16px)
   *  and a 24px chevron (vs 20px). */
  figmaSpacing?: boolean;
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
  hideBadge = false,
  disableLessons = false,
  defaultOpen,
  flushLessons = false,
  smallTitle = false,
  figmaSpacing = false,
}: ChapterCardProps) {
  const [open, setOpen] = useState(defaultOpen ?? status !== "completed");
  const showBadge = !hideStatus && !hideBadge;

  return (
    <div
      className={[
        "flex flex-col rounded-md border border-secondary-900 p-16 transition duration-300 ease-in-out hover:border-secondary-800",
        figmaSpacing ? "gap-20" : "gap-16",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-start gap-12 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500"
      >
        {/* Title + meta line; the badge stacks below here on mobile only. */}
        <span className="flex min-w-0 flex-1 flex-col gap-8 md:gap-2">
          <span className={["font-semibold text-neutral-0", smallTitle ? "text-md" : "text-lg"].join(" ")}>
            {title}
          </span>
          <span className="text-sm text-secondary-300">{desc}</span>
          {showBadge && (
            <span className="md:hidden">
              <StatusBadge status={status} />
            </span>
          )}
        </span>

        {/* Status badge — desktop only, on the top row beside the chevron. */}
        {showBadge && (
          <span className="hidden shrink-0 md:inline-flex">
            <StatusBadge status={status} />
          </span>
        )}
        <Icon
          name={open ? "chevron-up" : "chevron-down"}
          size={figmaSpacing ? 24 : 20}
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
              flush={flushLessons}
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
