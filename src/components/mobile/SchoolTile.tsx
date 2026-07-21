/**
 * SchoolTile — compact card for the horizontal-scrolling school rows on the
 * mobile Home feed ("Enrolled Schools" / "Other Schools"). A narrower sibling
 * of InProgressCourseCard/CourseCard for a fixed-width scroller instead of a
 * full-width stack.
 */
import type { School } from "../../data/newsfeed";

export function SchoolTile({
  school,
  onOpen,
  fullWidth = false,
}: {
  school: School;
  onOpen: () => void;
  /** Fills its wrapper instead of sizing itself — used when the row controls per-item width (e.g. a 90%-width scroller). */
  fullWidth?: boolean;
}) {
  const startDate = school.startDate.replace(/^(mon|tue|wed|thu|fri|sat|sun),?\s+/i, "");
  const pct = school.progress
    ? Math.round((school.progress.completed / school.progress.total) * 100)
    : null;

  return (
    <button
      type="button"
      onClick={onOpen}
      className={[
        "flex flex-col gap-12 rounded-lg border border-secondary-900 bg-secondary-950 p-16 text-left transition-colors hover:border-secondary-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500",
        fullWidth ? "w-full" : "min-w-[160px] flex-1",
      ].join(" ")}
    >
      <div className="flex flex-col gap-4">
        <span className="truncate text-sm uppercase tracking-wide text-secondary-300">
          {school.name}
        </span>
        <h3 className="line-clamp-2 text-md font-medium leading-6 text-neutral-0">{school.course}</h3>
      </div>

      {pct !== null && school.progress ? (
        <div className="flex flex-col gap-8">
          <div className="h-4 w-full overflow-hidden rounded-full bg-secondary-800">
            <div className="h-full rounded-full bg-primary-500" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-sm text-secondary-300">
            {school.progress.completed}/{school.progress.total} lessons
          </p>
        </div>
      ) : (
        <p className="text-sm text-secondary-300">
          Starting <span className="text-primary-500">{startDate}</span>
        </p>
      )}
    </button>
  );
}
