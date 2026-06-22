import { Icon } from "./Icon";
import { ChapterCard, type ChapterCardProps } from "./ChapterCard";

type ChapterData = Omit<ChapterCardProps, "sectionIdx" | "chapterIdx" | "onSelectLesson">;

export interface SectionGroupProps {
  title: string;
  count: string;
  open: boolean;
  onToggle: () => void;
  chapters: ChapterData[];
  sectionIdx?: number;
  onSelectLesson?: (lessonId: string) => void;
  /** Visitor view: hide chapter status badges + per-lesson status icons. */
  hideStatus?: boolean;
  /** Visitor view: section is locked — shows a lock button, a Secondary/980 card, and can't expand. */
  locked?: boolean;
}

/** Section card grouping chapter cards. One chapter open at a time; locked for visitors. */
export function SectionGroup({
  title,
  count,
  open,
  onToggle,
  chapters,
  sectionIdx = 0,
  onSelectLesson,
  hideStatus = false,
  locked = false,
}: SectionGroupProps) {
  const isOpen = open && !locked;
  return (
    <section
      className={[
        // Mobile: flat (sections sit outside a card, screen owns the 16px padding).
        // Desktop (md+): card with 20px padding — Secondary/1000, or Secondary/980 when locked.
        "flex flex-col gap-16 rounded-lg p-0 md:gap-24 md:p-20",
        locked ? "md:bg-secondary-980" : "md:bg-secondary-1000",
        "transition duration-300 ease-in-out",
        // Section hover only while collapsed — when open, the chapter cards own the hover
        isOpen || locked ? "" : "md:hover:shadow-xl",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={locked ? undefined : onToggle}
        aria-expanded={locked ? undefined : open}
        disabled={locked}
        className="flex w-full items-start gap-12 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500 disabled:cursor-default md:items-center"
      >
        {/* Stacks title over count on mobile; inline on desktop. */}
        <span className="flex min-w-0 flex-1 flex-col gap-2 md:flex-row md:items-center md:gap-12">
          <span className="text-lg-2 font-semibold text-neutral-0">{title}</span>
          <span className="text-md text-secondary-300 md:whitespace-nowrap">{count}</span>
        </span>
        {locked ? (
          <span className="mt-1 grid size-32 shrink-0 place-items-center rounded-full bg-secondary-800 text-secondary-300 md:mt-0">
            <Icon name="lock" size={18} />
          </span>
        ) : (
          <Icon
            name={open ? "chevron-up" : "chevron-down"}
            size={24}
            className="mt-2 shrink-0 text-secondary-300 md:mt-0"
          />
        )}
      </button>

      {isOpen && (
        <div className="flex flex-col gap-12">
          {chapters.map((ch, j) => (
            <ChapterCard
              key={ch.title}
              {...ch}
              sectionIdx={sectionIdx}
              chapterIdx={j}
              onSelectLesson={onSelectLesson}
              hideStatus={hideStatus}
            />
          ))}
        </div>
      )}
    </section>
  );
}
