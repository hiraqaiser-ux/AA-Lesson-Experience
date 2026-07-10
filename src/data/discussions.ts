/** Discussion forum data — posts (with their comments) shown in the Discussions tab. */

/** Character limit for every text box (posts, replies, edits, answers). */
export const MAX_TEXT_LENGTH = 4000;

export type AvatarColor = "teal" | "red" | "orange" | "blue";

/** Author personas — each renders a distinct chip next to the name. */
export type Role = "teacher" | "assistant" | "admin";

/**
 * A person who can be @mentioned in a comment (e.g. a student). `handle` is the
 * single-token identifier inserted into the text as `@handle`.
 */
export interface Mentionable {
  id: string;
  name: string;
  handle: string;
  initials: string;
  color: AvatarColor;
}

export interface Comment {
  id: string;
  name: string;
  initials: string;
  color: AvatarColor;
  time: string;
  text: string;
  likes: number;
  role?: Role;
}

export interface Post {
  id: string;
  author: string;
  initials: string;
  color: AvatarColor;
  isTeacher: boolean;
  time: string;
  text: string;
  likes: number;
  comments: Comment[];
  /** Author persona — overrides isTeacher when present. */
  role?: Role;
  /** Optional attached image (object URL from the composer). */
  imageUrl?: string;
  /** Pinned posts show a green pin icon by the kebab menu. */
  pinned?: boolean;
  /** School the post belongs to — rendered (underlined) in the byline with a "Join Now" link. */
  school?: string;
  /** Optional author photo; falls back to the initials avatar when omitted. */
  avatarUrl?: string;
}

export const POSTS: Post[] = [
  {
    id: "p1",
    author: "Abdul Haseeb",
    initials: "AH",
    color: "teal",
    isTeacher: true,
    time: "20 min",
    text:
      "Assalamu Alaikum dear students,\n" +
      "Welcome to the new batch of Learn to Recite Quran in 12 Weeks, started on 24 April 2026.\n" +
      "We are happy to have you with us on this blessed journey. Stay consistent, stay motivated, and feel free to ask questions anytime.\n" +
      "May Allah grant you success and make learning the Quran easy for you.\n\n" +
      "Best wishes 💚",
    likes: 6,
    comments: [
      { id: "c1", name: "Aasif Ali", initials: "AH", color: "teal", time: "Just now", text: "Mission accepted! Loving the energy of this batch already. JazakAllah for the motivation!", likes: 28 },
      { id: "c2", name: "Mehak Adil", initials: "MA", color: "red", time: "20 min", text: "Walaikum Assalam! Thank you for the warm welcome.", likes: 4, role: "assistant" },
      { id: "c3", name: "Ravi Ahuja", initials: "RA", color: "orange", time: "15 min", text: "Looking forward to collaborating on this project.", likes: 3, role: "admin" },
      { id: "c4", name: "Sara Linton", initials: "SL", color: "blue", time: "45 min", text: "Can we reschedule our meeting to next week?", likes: 5 },
      { id: "c5", name: "Jamal Patel", initials: "JP", color: "red", time: "10 min", text: "Received your email, will respond shortly.", likes: 2 },
      { id: "c6", name: "Elena Kostova", initials: "EK", color: "orange", time: "30 min", text: "The latest design updates look fantastic!", likes: 4 },
    ],
  },
  {
    id: "p2",
    author: "Abdul Haseeb",
    initials: "AH",
    color: "teal",
    isTeacher: true,
    time: "20 min",
    text:
      "Salam and welcome to our students who joined us in last week's batch starting from April 10 🙌\n\n" +
      "It is wonderful to have you with us. I hope you’re already enjoying the lessons and submitting your assignments. Remember, consistency is the key!\n" +
      "All it takes is just 15–20 minutes of dedicated time each day to see amazing progress. 🌟\n" +
      "I hope all of you are completing the lessons and submitting the assignments on time. Consistency is the key! All you need are 15-20 minutes a day to learn.\n\n" +
      "Our mission is to empower you with the skills and confidence to master Quran recitation through simple, daily habits.",
    likes: 6,
    comments: [
      { id: "c1", name: "Aasif Ali", initials: "AH", color: "teal", time: "Just now", text: "Mission accepted! Loving the energy of this batch already. JazakAllah for the motivation!", likes: 28 },
      { id: "c2", name: "Mehak Adil", initials: "MA", color: "red", time: "20 min", text: "Walaikum Assalam! Thank you for the warm welcome.", likes: 4, role: "assistant" },
      { id: "c3", name: "Ravi Ahuja", initials: "RA", color: "orange", time: "15 min", text: "Looking forward to collaborating on this project.", likes: 3, role: "admin" },
      { id: "c4", name: "Sara Linton", initials: "SL", color: "blue", time: "45 min", text: "Can we reschedule our meeting to next week?", likes: 5 },
      { id: "c5", name: "Jamal Patel", initials: "JP", color: "red", time: "10 min", text: "Received your email, will respond shortly.", likes: 2 },
      { id: "c6", name: "Elena Kostova", initials: "EK", color: "orange", time: "30 min", text: "The latest design updates look fantastic!", likes: 4 },
    ],
  },
];
