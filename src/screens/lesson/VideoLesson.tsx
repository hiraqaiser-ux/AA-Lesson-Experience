/**
 * VideoLesson — "Understanding words with Baa" (Lessons - Video Lesson).
 * Breadcrumb + video player + title, inside the shared LessonLayout.
 */
import { LessonLayout } from "../../components/LessonLayout";
import { VideoPlayer } from "../../components/VideoPlayer";
import { getLesson } from "../../data/lessons";

export function VideoLesson({
  activeId,
  onNavigate,
  onBack,
  onLogout,
}: {
  activeId: string;
  onNavigate: (id: string) => void;
  onBack: () => void;
  onLogout?: () => void;
}) {
  const lesson = getLesson(activeId);

  return (
    <LessonLayout activeId={activeId} onNavigate={onNavigate} onBack={onBack} onLogout={onLogout}>
      <div className="flex w-full flex-col gap-24">
        <VideoPlayer />

        <h1 className="text-xl font-semibold text-neutral-0">
          {lesson?.title ?? "Understanding words with Baa"}
        </h1>
      </div>
    </LessonLayout>
  );
}
