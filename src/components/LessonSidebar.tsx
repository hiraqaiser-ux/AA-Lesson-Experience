/**
 * LessonSidebar — the "Course content" tree shown inside lesson screens.
 * Shows only the active lesson's section (chapters → lessons), with the active
 * lesson highlighted (lime rail) and every lesson clickable. Moving past the
 * last lesson of a section (via the footer's Next) loads the next section, and
 * the sidebar follows. Mirrors the Figma lesson sidebar.
 */
import { Icon } from "./Icon";
import { SECTIONS } from "../data/course";
import { getLesson, lessonIdOf, lessonIcon, lessonLabel } from "../data/lessons";

export function LessonSidebar({
  activeId,
  onNavigate,
  onBack,
}: {
  activeId: string;
  onNavigate: (id: string) => void;
  onBack?: () => void;
}) {
  const active = getLesson(activeId);
  // Only the section the learner is currently in is shown.
  const si = active?.sectionIdx ?? 0;
  const section = SECTIONS[si];

  return (
    <aside className="min-h-full w-full shrink-0 border-secondary-900 bg-secondary-3 lg:w-[340px] lg:border-r">
      <div className="flex flex-col gap-12 p-20">
        {/* Back — web only (mobile uses the nav drawer's close + logo). */}
        <button
          type="button"
          onClick={onBack}
          className="hidden items-center gap-8 text-md font-medium text-neutral-0 hover:text-secondary-200 lg:flex"
        >
          <Icon name="chevron-left" size={20} />
          <span className="underline underline-offset-4">Back</span>
        </button>

        <div className="flex flex-col gap-4">
          <div className="py-8">
            <span className="text-sm font-semibold text-neutral-0">{section.title}</span>
          </div>

          {section.chapters.map((chapter, ci) => (
            <div key={chapter.title} className="flex flex-col gap-2">
              <div className="py-8">
                <span className="text-sm font-medium text-secondary-200">{chapter.title}</span>
              </div>

              {chapter.lessons.map((lesson, li) => {
                const id = `${si}-${ci}-${li}`;
                const isActive = id === lessonIdOf(activeId);
                const completed = lesson.status === "completed";
                const locked = (lesson.status as string) === "locked";
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onNavigate(id)}
                    disabled={locked}
                    className={[
                      "relative flex w-full items-center gap-12 rounded-sm px-16 py-12 text-left",
                      "transition-colors duration-300 ease-in-out",
                      isActive ? "bg-secondary-950" : "hover:bg-secondary-1000",
                      locked ? "opacity-55" : "",
                    ].join(" ")}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-12 bottom-12 w-4 rounded-full bg-primary-500" />
                    )}
                    <span
                      className={[
                        "shrink-0",
                        completed
                          ? "text-success"
                          : isActive
                          ? "text-primary-500"
                          : "text-neutral-600",
                      ].join(" ")}
                    >
                      <Icon
                        name={completed ? "check" : locked ? "lock" : lessonIcon(lesson)}
                        size={20}
                      />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-2">
                      <span
                        className={[
                          "truncate text-sm font-medium",
                          isActive ? "text-neutral-0" : "text-secondary-300",
                        ].join(" ")}
                      >
                        {lesson.title}
                      </span>
                      <span className="truncate text-xs text-neutral-600">
                        {lessonLabel(lesson)}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
