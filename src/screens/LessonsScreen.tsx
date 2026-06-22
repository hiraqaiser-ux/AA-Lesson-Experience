import { useState } from "react";
import { SectionGroup } from "../components/SectionGroup";
import { ProgressRing } from "../components/ProgressRing";
import { COURSE, SECTIONS } from "../data/course";

const PROGRESS_KEY = "aa_has_progress";

export function LessonsScreen({
  onOpenLesson,
  enrolled = true,
}: {
  onOpenLesson?: (lessonId: string) => void;
  /** Visitor (false): hide the progress header and per-lesson status indicators. */
  enrolled?: boolean;
}) {
  // Only one section open at a time (accordion); first section open by default.
  const [openSection, setOpenSection] = useState(0);

  // Progress header appears only once the learner has made progress
  // (e.g. opened/practised a lesson). Persisted so it survives navigation.
  const [hasProgress, setHasProgress] = useState(
    () => typeof localStorage !== "undefined" && localStorage.getItem(PROGRESS_KEY) === "1"
  );

  const handleOpenLesson = (lessonId: string) => {
    if (!hasProgress) {
      setHasProgress(true);
      try {
        localStorage.setItem(PROGRESS_KEY, "1");
      } catch {
        /* ignore */
      }
    }
    onOpenLesson?.(lessonId);
  };

  return (
    <div className="mx-auto w-full max-w-[1200px] px-16 pt-24 md:px-40">
      <div className="flex flex-col gap-24 rounded-lg border-0 p-0 md:gap-32 md:border md:border-secondary-900 md:p-40">
        {/* Progress header — only for enrolled learners who have made progress */}
        {enrolled && hasProgress && (
          <header className="flex items-center gap-16">
            <div className="flex flex-1 flex-col gap-4">
              <h1 className="text-lg-2 font-semibold text-neutral-0">You&apos;re on your way!</h1>
              <p className="text-sm text-secondary-300">{COURSE.progressLabel}</p>
            </div>
            <ProgressRing value={COURSE.progressPct} size={40} />
          </header>
        )}

        <div className="flex flex-col gap-12">
          {SECTIONS.map((section, i) => (
            <SectionGroup
              key={section.title}
              title={section.title}
              count={section.count}
              sectionIdx={i}
              open={openSection === i}
              onToggle={() => setOpenSection((cur) => (cur === i ? -1 : i))}
              chapters={section.chapters}
              onSelectLesson={handleOpenLesson}
              hideStatus={!enrolled}
              locked={!enrolled}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
