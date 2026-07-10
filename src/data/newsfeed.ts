/**
 * Newsfeed data — the schools/courses shown in the right rail / Courses tab and
 * the Courses page, the students who can be @mentioned in comments, and the feed
 * posts (reused from the Discussions data, tagged with a school for the byline
 * "Join Now" link).
 */
import { POSTS, type Mentionable, type Post } from "./discussions";

export interface School {
  id: string;
  /** The school/programme the course belongs to. */
  name: string;
  /** The course/programme headline shown under the school name. */
  course: string;
  instructor: string;
  /** Optional instructor photo (from /public). Falls back to an initials avatar. */
  instructorImage?: string;
  /** `null` renders a "Free" badge; a string (e.g. "$100") renders a price pill. */
  price: string | null;
  startDate: string;
  /** Course length, e.g. "12 weeks". */
  duration: string;
  /** Revealed when the card is expanded. */
  description: string;
  /** The featured school gets the highlighted card at the top of the rail. */
  featured?: boolean;
  /** External destination opened when the course is clicked (athanacademy.com). */
  url?: string;
}

/** Where a course card opens (athanacademy.com). Per-course links can be set via `School.url`. */
export const COURSES_URL = "https://athanacademy.com/";

export const SCHOOLS: School[] = [
  {
    id: "recite-quran",
    name: "Recite Quran School",
    course: "Learn to Recite Quran in 12 weeks",
    instructor: "Abdul Haseeb",
    instructorImage: "/instructor-abdul.png",
    price: "$100",
    startDate: "Wed 8 March, 2026",
    duration: "12 weeks",
    description:
      "Start from the basics and build your skills to recite Quran on your own, using the video lessons and 1 on 1 chats.",
    featured: true,
  },
  {
    id: "arabic-calligraphy",
    name: "Arabic Calligraphy School",
    course: "Arabic Calligraphy for Beginners",
    instructor: "Shanza Syed",
    instructorImage: "/instructor-shanza.png",
    price: null,
    startDate: "Fri 8 Jan, 2027",
    duration: "3 weeks",
    description:
      "Learn the fundamentals of Arabic script and the Naskh style from scratch — letterforms, proportions, and your first full composition.",
  },
  {
    id: "arabic-grammar",
    name: "Quranic Arabic School",
    course: "Learn Quranic Arabic Grammar",
    instructor: "Abdul Haseeb",
    instructorImage: "/instructor-abdul.png",
    price: "$80",
    startDate: "Fri 15 Jan, 2027",
    duration: "8 weeks",
    description:
      "Understand the grammar behind Quranic Arabic — nouns, verbs, and sentence structure — so you can follow the meaning of what you recite.",
  },
  {
    id: "homeschooling",
    name: "Homeschooling with Purpose",
    course: "Muslim Homeschool Foundations",
    instructor: "Dalia Moghdad",
    instructorImage: "/instructor-dalia.png",
    price: null,
    startDate: "Mon 1 Feb, 2027",
    duration: "6 weeks",
    description:
      "A practical framework for Muslim parents to plan a values-led homeschool — routines, curriculum choices, and keeping faith at the centre.",
  },
  {
    id: "seerah",
    name: "Madinah Seerah Institute",
    course: "Islamic Finance Beginners Guide to Buy and Sell",
    instructor: "Yusuf Rahman",
    price: "$120",
    startDate: "Fri 12 Feb, 2027",
    duration: "12 weeks",
    description:
      "A deep-dive into the Makkan period, studied through primary sources with weekly reflections and discussion.",
  },
  {
    id: "tafsir",
    name: "Wajh — Women's Tafsir",
    course: "Tafsir of Surah Maryam",
    instructor: "Aisha Siddiqui",
    price: null,
    startDate: "Sat 20 Feb, 2027",
    duration: "5 weeks",
    description:
      "A women-only circle exploring the themes of Surah Maryam verse by verse, with space for reflection and questions.",
  },
  {
    id: "aqeedah",
    name: "Yaqeen Foundation",
    course: "Foundations of Aqeedah",
    instructor: "Bilal Ahmed",
    price: "$60",
    startDate: "Mon 1 Mar, 2027",
    duration: "4 weeks",
    description:
      "Ground your belief in the essentials of Islamic creed, explained clearly for beginners with real-world questions answered.",
  },
  {
    id: "reminders",
    name: "Hikmah Pearls",
    course: "Weekly Reminders",
    instructor: "Khadija Noor",
    price: null,
    startDate: "Rolling",
    duration: "Ongoing",
    description:
      "Short, weekly reminders to keep your heart connected — bite-sized lessons you can act on the same day.",
  },
];

/** Students who can be @mentioned by a teacher in the comments. */
export const STUDENTS: Mentionable[] = [
  { id: "s1", name: "Aasif Ali", handle: "aasif", initials: "AA", color: "teal" },
  { id: "s2", name: "Mehak Adil", handle: "mehak", initials: "MA", color: "red" },
  { id: "s3", name: "Ravi Ahuja", handle: "ravi", initials: "RA", color: "orange" },
  { id: "s4", name: "Sara Linton", handle: "sara", initials: "SL", color: "blue" },
  { id: "s5", name: "Jamal Patel", handle: "jamal", initials: "JP", color: "red" },
  { id: "s6", name: "Elena Kostova", handle: "elena", initials: "EK", color: "orange" },
  { id: "s7", name: "Aisha Rahman", handle: "aisha", initials: "AR", color: "teal" },
  { id: "s8", name: "Omar Farooq", handle: "omar", initials: "OF", color: "blue" },
];

/** Images attached to the feed posts (from /public), by position. */
const POST_IMAGES = ["/lesson-video-poster.png", "/assignment-arabic.png"];

/** Feed posts, tagged with the school they belong to (byline link) + an image.
 *  Role/teacher tags are stripped — the newsfeed byline shows no persona chip. */
export const FEED_POSTS: Post[] = POSTS.map((p, i) => ({
  ...p,
  isTeacher: false,
  role: undefined,
  school: "Learn to recite Quran in 12 weeks",
  imageUrl: p.imageUrl ?? POST_IMAGES[i % POST_IMAGES.length],
  avatarUrl: p.author === "Abdul Haseeb" ? "/instructor-abdul.png" : p.avatarUrl,
}));
