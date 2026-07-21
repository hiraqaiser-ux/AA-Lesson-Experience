/**
 * InProgressCourseCard — "My Courses" card for the Enrolled Student persona
 * (Figma node 44608:9564): school name, course title, and a lessons-completed
 * progress bar. Composed from DS tokens.
 *
 * The card background is the Figma design's diagonal gradient — secondary-950
 * fading to secondary-500, both at ~20% opacity. Neither the DS nor Tailwind
 * config ships an alpha-blended pair for this, so it's mixed at render time
 * from the existing (unmodified) color tokens via `color-mix()` rather than
 * hardcoding new hex/rgba values.
 */
import type { School } from "../../data/newsfeed";

const GRADIENT_BG =
  "linear-gradient(129deg, color-mix(in srgb, var(--c-secondary-950) 20%, transparent) 0%, color-mix(in srgb, var(--c-secondary-500) 20%, transparent) 100%)";

export function InProgressCourseCard({
  course,
  onOpen,
}: {
  course: School & { progress: { completed: number; total: number } };
  onOpen: () => void;
}) {
  const pct = Math.round((course.progress.completed / course.progress.total) * 100);
  return (
    <button
      type="button"
      onClick={onOpen}
      style={{ backgroundImage: GRADIENT_BG }}
      className="flex w-full flex-col gap-20 rounded-lg border border-secondary-950 p-20 text-left transition-colors hover:border-secondary-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500"
    >
      <div className="flex flex-col gap-8">
        <span className="text-sm uppercase tracking-wide text-secondary-300">{course.name}</span>
        <h3 className="text-lg-2 font-medium leading-7 text-neutral-0">{course.course}</h3>
      </div>

      <div className="flex w-full flex-col gap-20">
        <div className="h-8 w-full overflow-hidden rounded-full bg-secondary-400">
          <div
            className="h-full rounded-full bg-primary-500 transition-[width] duration-300 ease-in-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-md text-secondary-300">
          {course.progress.completed} of {course.progress.total} lessons completed
        </p>
      </div>
    </button>
  );
}
