/**
 * SchoolsSidebar — the newsfeed's Courses rail (right column on desktop, the
 * "Courses" tab body on mobile). A compact list of course tiles capped at
 * DEFAULT_VISIBLE, followed by a "Become a teacher" callout.
 */
import { Icon } from "../Icon";
import { Avatar } from "../discussion/DiscussionParts";
import { BecomeTeacherCard } from "./BecomeTeacherCard";
import { SCHOOLS, type School } from "../../data/newsfeed";

/** Course tiles shown in the rail. */
const DEFAULT_VISIBLE = 3;

/** First-letters fallback when a course has no instructor photo. */
function initialsOf(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** A single course tile — title on top, then instructor + duration. */
function CourseRow({ course, onOpen }: { course: School; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex w-full flex-col gap-8 py-16 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500"
    >
      <h3 className="line-clamp-2 text-md font-medium leading-6 text-neutral-0 underline-offset-2 group-hover:underline">
        {course.course}
      </h3>
      <div className="flex flex-wrap items-center gap-x-16 gap-y-8 text-md text-neutral-200">
        <span className="flex items-center gap-8">
          {course.instructorImage ? (
            <img
              src={course.instructorImage}
              alt=""
              className="size-32 shrink-0 rounded-full object-cover"
            />
          ) : (
            <Avatar initials={initialsOf(course.instructor)} color="teal" size={32} />
          )}
          {course.instructor}
        </span>
        <span aria-hidden className="size-[6px] shrink-0 rounded-full bg-overlay-white-4" />
        <span className="flex items-center gap-8">
          <Icon name="clock" size={20} className="text-secondary-400" />
          {course.duration}
        </span>
      </div>
    </button>
  );
}

export function SchoolsSidebar({
  onSelectSchool,
  onBecomeTeacher,
}: {
  /** Fired when a course row is clicked. */
  onSelectSchool: (id: string) => void;
  onBecomeTeacher: () => void;
}) {
  const visible = SCHOOLS.slice(0, DEFAULT_VISIBLE);

  return (
    <aside className="flex flex-col gap-16" aria-label="Courses">
      {/* Compact courses card */}
      <div className="flex flex-col gap-12 rounded-lg border border-overlay-white-4 p-16">
        <h2 className="text-lg-2 font-bold text-neutral-0">Popular Courses</h2>
        <div className="flex flex-col gap-0">
          {visible.map((s) => (
            <CourseRow key={s.id} course={s} onOpen={() => onSelectSchool(s.id)} />
          ))}
        </div>
      </div>

      <BecomeTeacherCard onBecomeTeacher={onBecomeTeacher} />
    </aside>
  );
}
