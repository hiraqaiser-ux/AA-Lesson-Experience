/**
 * LessonExperience — routes to the correct lesson screen based on the lesson's
 * screen kind (video / mcq / practice). Shared by the Lessons list and the
 * in-lesson sidebar navigation.
 */
import { getLesson } from "../../data/lessons";
import { VideoLesson } from "./VideoLesson";
import { TextMcqLesson } from "./TextMcqLesson";
import { PracticeLesson } from "./PracticeLesson";
import { AssignmentLesson } from "./AssignmentLesson";
import { ListenRepeatLesson } from "./ListenRepeatLesson";

export function LessonExperience({
  activeId,
  onNavigate,
  onBack,
}: {
  activeId: string;
  onNavigate: (id: string) => void;
  onBack: () => void;
}) {
  const lesson = getLesson(activeId);
  const props = { activeId, onNavigate, onBack };

  switch (lesson?.screen) {
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
