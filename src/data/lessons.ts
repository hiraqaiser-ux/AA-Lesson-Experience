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

/**
 * Multi-part lessons (by lesson id). A lesson can bundle several exercises the
 * learner steps through with Back / Next — e.g. an "Alif" exercise made of a
 * text MCQ then an audio MCQ. Parts are invisible to the user (no part
 * indicator); Next past the last part continues into the next lesson.
 */
const PARTS_OVERRIDE: Record<string, LessonScreen[]> = {
  "0-0-1": ["mcq", "practice"], // Practice with Alif → Text MCQ, then Audio MCQ
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

/** Strip the part suffix from a step id → the base lesson id (`0-0-1.1` → `0-0-1`). */
export function lessonIdOf(stepId: string): string {
  return stepId.split(".")[0];
}

export function getLesson(id: string): FlatLesson | undefined {
  return FLAT_LESSONS.find((l) => l.id === lessonIdOf(id));
}

/**
 * A single navigable step = a (lesson, part). Single-part lessons produce one
 * step whose id is the lesson id; extra parts get a `.1`, `.2` … suffix.
 */
export interface FlatStep extends FlatLesson {
  stepId: string;
  lessonId: string;
  partIndex: number;
  partCount: number;
}

export const FLAT_STEPS: FlatStep[] = FLAT_LESSONS.flatMap((lesson) => {
  const screens = PARTS_OVERRIDE[lesson.id] ?? [lesson.screen];
  return screens.map((screen, partIndex) => ({
    ...lesson,
    screen,
    stepId: partIndex === 0 ? lesson.id : `${lesson.id}.${partIndex}`,
    lessonId: lesson.id,
    partIndex,
    partCount: screens.length,
  }));
});

export function getStep(id: string): FlatStep | undefined {
  return FLAT_STEPS.find((s) => s.stepId === id);
}

/** The next step (crosses parts, then lessons, then sections), or undefined at the end. */
export function nextStep(id: string): FlatStep | undefined {
  const i = FLAT_STEPS.findIndex((s) => s.stepId === id);
  return i >= 0 ? FLAT_STEPS[i + 1] : undefined;
}

/** The previous step, or undefined at the very first step. */
export function prevStep(id: string): FlatStep | undefined {
  const i = FLAT_STEPS.findIndex((s) => s.stepId === id);
  return i > 0 ? FLAT_STEPS[i - 1] : undefined;
}
