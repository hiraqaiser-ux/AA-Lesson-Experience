/**
 * Flat lesson registry derived from SECTIONS — gives every lesson a stable id,
 * its screen kind, and its place in the section/chapter tree. Used to route
 * lesson clicks (from the Lessons list and the in-lesson sidebar) and to drive
 * the "Next" action.
 */
import { SECTIONS } from "./course";
import type { LessonType, LessonRowProps } from "../components/LessonRow";
import type { IconName } from "../components/Icon";

export type LessonScreen = "video" | "mcq" | "practice" | "assignment" | "listen-repeat";

/**
 * Per-lesson screen overrides (by `${sectionIdx}-${chapterIdx}-${lessonIdx}`),
 * where a lesson's screen differs from the type default.
 */
const SCREEN_OVERRIDE: Record<string, LessonScreen> = {
  "0-1-0": "practice", // Match the correct Sound → Practice Lesson (audio options)
  "0-1-1": "listen-repeat", // Listen and repeat → Listen & Repeat (listen → record)
};

const TYPE_ICON: Record<LessonType, IconName> = {
  video: "video",
  practice: "list-checks",
  assignment: "image",
};
const TYPE_LABEL: Record<LessonType, string> = {
  video: "Video Lesson",
  practice: "Practice Exercise",
  assignment: "Image Assignment",
};

export function lessonIcon(l: { type: LessonType; icon?: IconName }): IconName {
  return l.icon ?? TYPE_ICON[l.type];
}
export function lessonLabel(l: { type: LessonType; label?: string }): string {
  return l.label ?? TYPE_LABEL[l.type];
}

/** Which screen a lesson type opens (matches the Figma prototype). */
export function screenForType(type: LessonType): LessonScreen {
  if (type === "video") return "video";
  if (type === "practice") return "mcq";
  return "assignment"; // assignment → image/audio assignment screen
}

export interface FlatLesson extends LessonRowProps {
  id: string;
  sectionIdx: number;
  chapterIdx: number;
  lessonIdx: number;
  sectionTitle: string;
  chapterTitle: string;
  screen: LessonScreen;
}

export const FLAT_LESSONS: FlatLesson[] = SECTIONS.flatMap((section, si) =>
  section.chapters.flatMap((chapter, ci) =>
    chapter.lessons.map((lesson, li) => ({
      ...lesson,
      id: `${si}-${ci}-${li}`,
      sectionIdx: si,
      chapterIdx: ci,
      lessonIdx: li,
      sectionTitle: section.title,
      chapterTitle: chapter.title,
      screen: SCREEN_OVERRIDE[`${si}-${ci}-${li}`] ?? screenForType(lesson.type),
    }))
  )
);

export function getLesson(id: string): FlatLesson | undefined {
  return FLAT_LESSONS.find((l) => l.id === id);
}

/** The next lesson in reading order (for the "Next" button), or undefined. */
export function nextLesson(id: string): FlatLesson | undefined {
  const i = FLAT_LESSONS.findIndex((l) => l.id === id);
  return i >= 0 ? FLAT_LESSONS[i + 1] : undefined;
}

/** The previous lesson in reading order (for the "Previous" button), or undefined. */
export function prevLesson(id: string): FlatLesson | undefined {
  const i = FLAT_LESSONS.findIndex((l) => l.id === id);
  return i > 0 ? FLAT_LESSONS[i - 1] : undefined;
}
