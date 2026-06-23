/**
 * LessonLayout — shared shell for every lesson screen.
 * Fixed-height app shell: NavBar on top, then a scroll-independent sidebar +
 * main column. Inside main: a pinned header (top), a scrolling content area
 * (video / question), and a sticky footer (bottom) with Previous / Next
 * navigation around an optional screen-specific action (Check button, answer
 * composer, …). Previous / Next move through lessons in reading order and cross
 * section boundaries automatically.
 *
 * Header:
 *  - non-assignment lessons → sleek chapter progress bar + "Feedback" pill
 *  - assignment lessons      → breadcrumb (no progress bar)
 */
import type { ReactNode } from "react";
import { NavBar } from "./NavBar";
import { Icon } from "./Icon";
import { LessonSidebar } from "./LessonSidebar";
import { getLesson, FLAT_LESSONS, nextLesson, prevLesson } from "../data/lessons";

export function LessonLayout({
  activeId,
  onNavigate,
  onBack,
  header,
  children,
  action,
  variant = "default",
  hidePrev = false,
  hideNext = false,
  bodyWidthClass = "",
}: {
  activeId: string;
  onNavigate: (id: string) => void;
  onBack?: () => void;
  header?: ReactNode; // custom top bar (overrides the default progress/breadcrumb)
  children: ReactNode;
  /** Optional control in the footer: a Check button, or the assignment composer. */
  action?: ReactNode;
  /**
   * "assignment" stacks the composer above the Prev/Next bar on mobile and lays
   * them inline on desktop. "default" keeps Prev / action / Next in one row.
   */
  variant?: "default" | "assignment";
  /** Hide the Previous button entirely (e.g. practice exercises). */
  hidePrev?: boolean;
  /** Hide the footer Next button (e.g. practice — its own button advances). */
  hideNext?: boolean;
  /** Width utility for the content column (e.g. assignment → "lg:w-[70%]"). */
  bodyWidthClass?: string;
}) {
  const lesson = getLesson(activeId);
  const isAssignment = lesson?.type === "assignment";

  // Previous renders mobile-only (removed from the web lesson experience).
  const prevBtn = (cls = "") => (
    <button
      type="button"
      onClick={goPrev}
      disabled={!prev}
      className={`flex shrink-0 items-center justify-center gap-8 rounded-full border border-secondary-800 px-24 py-12 text-sm font-semibold text-neutral-0 transition-colors hover:bg-overlay-white-8 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent ${cls}`}
    >
      <Icon name="chevron-left" size={16} />
      Previous
    </button>
  );
  const nextBtn = (cls = "") => (
    <button
      type="button"
      onClick={goNext}
      className={`flex shrink-0 items-center justify-center gap-8 rounded-full bg-primary-500 px-24 py-12 text-sm font-semibold text-secondary-1000 transition-all duration-micro ease-in-out-soft hover:bg-primary-400 active:scale-95 ${cls}`}
    >
      Next
      <Icon name="chevron-right" size={16} />
    </button>
  );

  // Reading-order navigation (crosses chapters + sections).
  const prev = prevLesson(activeId);
  const next = nextLesson(activeId);
  const goPrev = () => prev && onNavigate(prev.id);
  const goNext = () => (next ? onNavigate(next.id) : onBack?.());

  // Chapter progress: position of the current lesson within its chapter.
  const chapterLessons = lesson
    ? FLAT_LESSONS.filter(
        (l) => l.sectionIdx === lesson.sectionIdx && l.chapterIdx === lesson.chapterIdx
      )
    : [];
  const pos = lesson ? Math.max(0, chapterLessons.findIndex((l) => l.id === lesson.id)) : 0;
  const pct = chapterLessons.length ? ((pos + 1) / chapterLessons.length) * 100 : 0;

  const sectionNo = lesson?.sectionTitle?.split(":")[0] ?? "Week 1";
  const sectionName =
    lesson?.sectionTitle?.split(":").slice(1).join(":").trim() ?? "Understanding the basic Arabic words";

  return (
    <div className="flex h-screen flex-col bg-secondary-3">
      {/* On mobile the course-content sidebar lives inside the nav hamburger drawer. */}
      <NavBar
        userName="Usman"
        onHome={onBack}
        mobileMenu={(close) => (
          <LessonSidebar
            activeId={activeId}
            onNavigate={(id) => {
              onNavigate(id);
              close();
            }}
            onBack={onBack ? () => { onBack(); close(); } : undefined}
          />
        )}
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden overflow-y-auto lg:block">
          <LessonSidebar activeId={activeId} onNavigate={onNavigate} onBack={onBack} />
        </div>

        {/* Content column */}
        <main className="relative flex min-h-0 flex-1 flex-col px-16 md:px-24">
         <div className={`flex min-h-0 w-full flex-1 flex-col ${bodyWidthClass}`}>
          {/* Header — pinned at top */}
          <div className="shrink-0 pt-24">
            {header ?? (isAssignment ? (
              <p className="text-sm text-secondary-300">
                {sectionNo} <span className="text-secondary-500">›</span> {sectionName}
              </p>
            ) : (
              <div className="flex items-center gap-16">
                {/* Sleek chapter progress bar */}
                <div className="h-4 flex-1 overflow-hidden rounded-full bg-secondary-900">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-500 transition-[width] duration-500 ease-out-soft"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <button
                  type="button"
                  className="shrink-0 rounded-full border border-secondary-800 px-16 py-8 text-sm font-medium text-neutral-0 hover:bg-overlay-white-8"
                >
                  Feedback
                </button>
              </div>
            ))}
          </div>

          {/* Scrolling content */}
          <div className="flex flex-1 flex-col overflow-y-auto py-32">{children}</div>

          {/* Sticky footer — Previous (mobile only) / Next around the action */}
          {variant === "assignment" ? (
            <div className="flex shrink-0 flex-col gap-12 pb-24 pt-8 lg:flex-row lg:items-center">
              <div className="lg:order-1 lg:flex-1">{action}</div>
              <div className="flex items-center gap-12 lg:contents">
                {!hidePrev && prevBtn("flex-1 lg:hidden")}
                {!hideNext && nextBtn("flex-1 lg:order-2 lg:flex-none")}
              </div>
            </div>
          ) : (
            <div className="flex shrink-0 items-center gap-12 pb-24 pt-8">
              {!hidePrev && prevBtn("lg:hidden")}
              <div className="flex min-w-0 flex-1 justify-end">{action}</div>
              {!hideNext && nextBtn()}
            </div>
          )}
         </div>
        </main>
      </div>
    </div>
  );
}
