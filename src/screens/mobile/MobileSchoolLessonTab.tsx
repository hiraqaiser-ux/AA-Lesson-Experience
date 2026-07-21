/**
 * MobileSchoolLessonTab — "Lesson" tab of the mobile School Detail page
 * (Figma nodes 43882:79450 Visitor / 43888:21233 Enrolled Student). Reuses
 * the same ChapterCard/LessonRow/StatusIcon/StatusBadge + SECTIONS data as
 * the web Lessons tab (LessonsScreen.tsx) — only the navigation model
 * differs: mobile switches between weeks via a pill row instead of stacking
 * every section in a vertical accordion. Visitor locking mirrors the web
 * rule exactly (`!enrolled && i >= SECTIONS.length - 2`), applied only to
 * weeks that actually have content: only week 1 is browsable for a Visitor,
 * the rest of the REAL weeks show as locked pills.
 *
 * The pill row shows TOTAL_WEEKS (8, matching the Figma reference) even
 * though only the first 3 have real content (SECTIONS) — selecting a week
 * beyond that shows a "coming soon" placeholder rather than fabricated
 * chapters/lessons.
 *
 * Deviations from the Figma reference, flagged for review:
 * - The chapter-level status badge (ChapterCard's StatusBadge) is hidden via
 *   the new hideBadge prop, per request — per-lesson status icons (the
 *   rings/checkmarks) stay, since ChapterCard's existing hideStatus prop
 *   controls both and only the badge should disappear.
 * - No progress header ("You're on your way!" + ring) — the Figma reference
 *   doesn't show one on this screen (the web LessonsScreen does, for a
 *   different reason: it only appears after a lesson's been opened once).
 * - Unselected week pill uses secondary-900 in place of secondary-940
 *   (#212630), which isn't a token in this DS — same substitution already
 *   made elsewhere in the mobile screens.
 * - Lesson rows are flush (no side padding, no hover) via ChapterCard's
 *   flushLessons prop, per request — web's Lessons tab is unaffected since
 *   flushLessons defaults to false there.
 * - Chapter title is 16px (text-md) via ChapterCard's smallTitle prop, per
 *   request — web keeps its default 18px (text-lg).
 * - Spacing/sizing (20px header-to-lessons gap, 24px chevron) matches this
 *   Figma frame via ChapterCard's figmaSpacing prop — web's Lessons tab is
 *   unaffected (defaults to its existing 16px/20px values).
 */
import { useState } from "react";
import { Icon } from "../../components/Icon";
import { ChapterCard } from "../../components/ChapterCard";
import { SchoolEnrollBar } from "../../components/mobile/SchoolEnrollBar";
import { SECTIONS } from "../../data/course";

const TOTAL_WEEKS = 8;

export function MobileSchoolLessonTab({
  enrolled,
  onEnroll,
}: {
  enrolled: boolean;
  onEnroll: () => void;
}) {
  const [selectedWeek, setSelectedWeek] = useState(0);
  const hasContent = (i: number) => i < SECTIONS.length;
  const isLocked = (i: number) => hasContent(i) && !enrolled && i >= SECTIONS.length - 2;
  const section = hasContent(selectedWeek) ? SECTIONS[selectedWeek] : undefined;
  const weekTitle = section?.title.replace(/^Week \d+:\s*/, "");

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="flex shrink-0 gap-4 overflow-x-auto px-16 pt-20">
          {Array.from({ length: TOTAL_WEEKS }, (_, i) => {
            const locked = isLocked(i);
            const selected = i === selectedWeek;
            return (
              <button
                key={i}
                type="button"
                disabled={locked}
                onClick={() => setSelectedWeek(i)}
                className={[
                  "shrink-0 rounded-full px-8 py-4 text-md font-medium text-white transition-colors",
                  selected ? "bg-secondary-700" : "bg-secondary-900",
                  locked || !hasContent(i) ? "cursor-not-allowed opacity-40" : "",
                ].join(" ")}
              >
                W{i + 1}
              </button>
            );
          })}
        </div>

        {section ? (
          <div className="flex flex-col gap-16 px-16 py-20">
            <h2 className="text-lg font-semibold text-neutral-0">{weekTitle}</h2>
            <div className="flex flex-col gap-12">
              {section.chapters.map((ch, j) => (
                <ChapterCard
                  key={ch.title}
                  {...ch}
                  sectionIdx={selectedWeek}
                  chapterIdx={j}
                  onSelectLesson={() => {}}
                  hideStatus={!enrolled}
                  hideBadge
                  disableLessons={!enrolled}
                  defaultOpen={!enrolled ? j === 0 : undefined}
                  flushLessons
                  smallTitle
                  figmaSpacing
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8 px-16 py-32 text-center">
            <Icon name="book" size={32} className="text-primary-300" />
            <p className="text-md text-secondary-300">This week's content isn't published yet — check back soon.</p>
          </div>
        )}
      </div>

      {!enrolled && <SchoolEnrollBar onEnroll={onEnroll} />}
    </div>
  );
}
