/**
 * LessonExperience — routes to the correct lesson screen based on the current
 * step's screen kind (video / mcq / practice / …). A lesson may have several
 * parts (steps); the active step decides which screen renders. Shared by the
 * Lessons list and the in-lesson sidebar navigation.
 */
import { getStep } from "../../data/lessons";
import { VideoLesson } from "./VideoLesson";
import { TextMcqLesson } from "./TextMcqLesson";
import { PracticeLesson } from "./PracticeLesson";
import { AssignmentLesson } from "./AssignmentLesson";
import { ListenRepeatLesson } from "./ListenRepeatLesson";

export function LessonExperience({
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
  const step = getStep(activeId);
  const props = { activeId, onNavigate, onBack, onLogout };

  switch (step?.screen) {
    case "mcq":
      return <TextMcqLesson {...props} />;
    case "practice":
      return <PracticeLesson {...props} />;
    case "assignment":
      return <AssignmentLesson {...props} />;
    case "listen-repeat":
      return <ListenRepeatLesson {...props} />;
    case "video":
    default:
      return <VideoLesson {...props} />;
  }
}
