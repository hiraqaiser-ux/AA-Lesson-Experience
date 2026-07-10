/**
 * CourseCard — the course card on the "Explore Courses" page (Figma node
 * 43060:38557): school name, course title, description, then a single meta row
 * — duration · start date · instructor — separated by vertical dividers.
 * Composed from DS tokens + primitives.
 */
import { Icon } from "../Icon";
import { Avatar } from "../discussion/DiscussionParts";
import type { School } from "../../data/newsfeed";

/** First-letters fallback when a course has no instructor photo. */
function initialsOf(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Vertical divider between meta items — matches the thin rule in the design. */
function MetaDivider() {
  return <span aria-hidden className="block h-24 w-px shrink-0 self-center bg-secondary-800" />;
}

export function CourseCard({ course, onOpen }: { course: School; onOpen: () => void }) {
  // Cards show the start date without a leading weekday (e.g. "Wed 8 March, 2026" → "8 March, 2026").
  const startDate = course.startDate.replace(/^(mon|tue|wed|thu|fri|sat|sun),?\s+/i, "");
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full flex-col gap-20 rounded-lg border border-secondary-950 bg-secondary-950 p-24 text-left transition-colors hover:border-secondary-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500"
    >
      <div className="flex flex-col gap-8">
        <span className="text-sm uppercase tracking-wide text-secondary-300">{course.name}</span>
        <h3 className="text-lg-2 font-medium leading-7 text-neutral-0">{course.course}</h3>
        <p className="line-clamp-2 text-sm leading-6 text-neutral-300">{course.description}</p>
      </div>

      <div className="flex flex-wrap items-center gap-x-20 gap-y-12">
        <span className="flex items-center gap-8 text-md text-neutral-0">
          <Icon name="clock" size={20} className="text-secondary-400" />
          {course.duration}
        </span>

        <MetaDivider />

        <span className="flex items-center gap-8 text-md font-medium">
          <Icon name="calendar" size={20} className="text-secondary-400" />
          <span>
            <span className="text-neutral-200">Starting: </span>
            <span className="text-primary-500">{startDate}</span>
          </span>
        </span>

        <MetaDivider />

        <span className="flex items-center gap-12">
          {course.instructorImage ? (
            <img
              src={course.instructorImage}
              alt=""
              className="size-32 shrink-0 rounded-full object-cover"
            />
          ) : (
            <Avatar initials={initialsOf(course.instructor)} color="teal" size={32} />
          )}
          <span className="text-md text-neutral-200">{course.instructor}</span>
        </span>
      </div>
    </button>
  );
}
