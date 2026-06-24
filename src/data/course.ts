import type { LessonRowProps } from "../components/LessonRow";
import type { LessonStatus } from "../components/StatusIcon";

export interface Chapter {
  title: string;
  desc: string;
  status: Exclude<LessonStatus, "locked">;
  progress?: number;
  lessons: LessonRowProps[];
}
export interface Section {
  title: string;
  count: string;
  chapters: Chapter[];
}

export const COURSE = {
  school: "Recite Quran School",
  title: "How to raise your teenagers in the western world?",
  blurb:
    "Embrace your identity as a young Muslim on this journey of self discovery, resilience and confidence.",
  progressLabel: "3 of 12 lessons completed",
  progressPct: 25,
  // Visitor "School Details" banner.
  startLabel: "Starting",
  startDate: "December 31",
  startYear: "2026",
  price: "$100",
  priceNote: "One Time Payment",
};

export const SECTIONS: Section[] = [
  {
    title: "Week 1: Understanding the basic Arabic words",
    count: "3 chapters",
    chapters: [
      {
        title: "Chapter 1: Arabic words and its uses",
        desc: "2 lessons · 1 assignment",
        status: "pending",
        lessons: [
          { title: "Understanding words with Baa", type: "video", time: "12 min", status: "completed", thumbnail: true },
          { title: "Practice with Alif", type: "practice", time: "8 min", status: "pending" },
          { title: "Describe what you see", type: "assignment", time: "15 min", status: "pending" },
        ],
      },
      {
        title: "Chapter 2: Arabic words and its uses",
        desc: "4 lessons · 2 assignments",
        status: "pending",
        lessons: [
          { title: "Match the correct Sound", type: "practice", time: "12 min", status: "completed" },
          { title: "Listen and repeat", type: "practice", time: "8 min", status: "pending" },
          { title: "Submit your recitition", type: "assignment", icon: "audio-waveform", label: "Text Assignment", time: "15 min", status: "pending" },
          { title: "Submit your answer", type: "assignment", icon: "audio-waveform", label: "Audio Assignment", time: "15 min", status: "pending" },
        ],
      },
    ],
  },
  {
    title: "Week 2: Learning first five words",
    count: "3 chapters",
    chapters: [
      {
        title: "Chapter 1: First words",
        desc: "2 lessons",
        status: "pending",
        lessons: [
          { title: "Your first word", type: "video", time: "4 min", status: "pending", thumbnail: true },
        ],
      },
    ],
  },
  {
    title: "Week 3: Putting it together",
    count: "3 chapters",
    chapters: [
      {
        title: "Chapter 1: Review",
        desc: "2 lessons",
        status: "pending",
        lessons: [
          { title: "Review of letters", type: "video", time: "5 min", status: "pending", thumbnail: true },
        ],
      },
    ],
  },
];

export const FAQS = [
  {
    question: "Who is this class for?",
    answer:
      "It is designed for English-speaking individuals ages 12 and above who want to master Quran recitation. In this course, you will learn to become fluent and confident in your recitation with the guidance of a teacher.",
  },
  { question: "How is this course different from “Learn to Recite Quran in 12 weeks”" },
  { question: "When does this course start?" },
  { question: "How do I enroll?" },
  { question: "Do I need any previous knowledge to start?" },
  { question: "How will the 15-week plan work?" },
];

export interface SidebarLesson {
  title: string;
  meta: string;
  type: "video" | "practice" | "assignment";
  state: "default" | "active" | "completed" | "locked";
}
export const PLAYER_NAV: { section: string; lessons: SidebarLesson[] }[] = [
  {
    section: "Week 1: Understanding the basic Arabic words",
    lessons: [
      { title: "Welcome to the lesson", meta: "Video · 5 min", type: "video", state: "completed" },
      { title: "Understanding words with Baa", meta: "Video · 12 min", type: "video", state: "active" },
      { title: "Practice with Baa", meta: "Practice · 8 min", type: "practice", state: "default" },
      { title: "Submit your work", meta: "Assignment · 15 min", type: "assignment", state: "default" },
    ],
  },
  {
    section: "Week 2: Learning first five words",
    lessons: [
      { title: "Introduction to letters", meta: "Video · 6 min", type: "video", state: "locked" },
    ],
  },
];
