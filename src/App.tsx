import { Agentation } from "agentation";
import { useState } from "react";
import { CourseDetail } from "./screens/CourseDetail";
import { LessonExperience } from "./screens/lesson/LessonExperience";
import { PostDetailPage } from "./components/discussion/PostDetailPage";
import type { Post } from "./data/discussions";

const ENROLLED_KEY = "aa_enrolled";

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
