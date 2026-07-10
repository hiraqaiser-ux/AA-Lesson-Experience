import { Agentation } from "agentation";
import { useState } from "react";
import { CourseDetail } from "./screens/CourseDetail";
import { LessonExperience } from "./screens/lesson/LessonExperience";
import { NewsfeedScreen } from "./screens/NewsfeedScreen";
import { CoursesScreen } from "./screens/CoursesScreen";
import { PostDetailPage } from "./components/discussion/PostDetailPage";
import type { Post } from "./data/discussions";

const ENROLLED_KEY = "aa_enrolled";

/** Standalone community screens live at their own links (?screen=…); the default entry is untouched. */
const screenParam =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("screen")
    : null;

type View = { type: "course" } | { type: "lesson"; id: string } | { type: "post"; post: Post };

export default function App() {
  const [view, setView] = useState<View>({ type: "course" });
  // Enrollment is shared between the Discussions tab and the standalone post page.
  const [enrolled, setEnrolled] = useState(
    () => typeof localStorage !== "undefined" && localStorage.getItem(ENROLLED_KEY) === "1"
  );
  const enroll = () => {
    setEnrolled(true);
    try {
      localStorage.setItem(ENROLLED_KEY, "1");
    } catch {
      /* ignore */
    }
  };
  const unenroll = () => {
    setEnrolled(false);
    try {
      localStorage.removeItem(ENROLLED_KEY);
    } catch {
      /* ignore */
    }
  };
  // Log out → drop enrollment and return to the course home (visitor view).
  const logout = () => {
    unenroll();
    setView({ type: "course" });
  };

  // Standalone community screens — their own concept, unrelated to the course/lesson flow.
  if (screenParam === "newsfeed" || screenParam === "courses") {
    return (
      <>
        {screenParam === "courses" ? <CoursesScreen /> : <NewsfeedScreen />}
        {import.meta.env.DEV && <Agentation />}
      </>
    );
  }

  // Reached from a course/school link in the newsfeed — same school detail page
  // (Lessons + Discussions tabs) as the default entry, with the community nav
  // bar + a "Back to home" button swapped in instead.
  const communityMode = screenParam === "school";

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <div className="flex-1">
          {view.type === "lesson" ? (
            <LessonExperience
              activeId={view.id}
              onNavigate={(id) => setView({ type: "lesson", id })}
              onBack={() => setView({ type: "course" })}
              onLogout={logout}
            />
          ) : (
            <CourseDetail
              onOpenLesson={(id) => setView({ type: "lesson", id })}
              onOpenPost={(post) => setView({ type: "post", post })}
              enrolled={enrolled}
              onEnroll={enroll}
              onUnenroll={unenroll}
              communityMode={communityMode}
            />
          )}
        </div>

        {/* Standalone post detail — full-screen overlay (CourseDetail stays mounted behind). */}
        {view.type === "post" && (
          <PostDetailPage
            post={view.post}
            onBack={() => setView({ type: "course" })}
            enrolled={enrolled}
            onEnroll={enroll}
            onLogout={logout}
          />
        )}
      </div>
      {import.meta.env.DEV && <Agentation />}
    </>
  );
}
