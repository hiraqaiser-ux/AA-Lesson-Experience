/**
 * CoursesScreen — the "Explore Courses" page (Figma node 44303:26393): a
 * heading + a responsive 2-column grid of course cards. Reached from the
 * "Courses" nav link (?screen=courses). A standalone community concept —
 * unrelated to the course/lesson experience. Clicking a card opens the school
 * detail page (?screen=school) — same single detail page every course routes
 * to elsewhere in the newsfeed (see NewsfeedScreen's openSchoolDetail).
 */
import { useState } from "react";
import { NavBar } from "../components/NavBar";
import { Icon } from "../components/Icon";
import { CourseCard } from "../components/newsfeed/CourseCard";
import { BecomeTeacherCard } from "../components/newsfeed/BecomeTeacherCard";
import { SignInPrompt } from "../components/newsfeed/SignInPrompt";
import { communityNavLinks, goToScreen } from "../components/newsfeed/communityNav";
import { useIsDesktop } from "../hooks/useIsDesktop";
import { SCHOOLS } from "../data/newsfeed";

export function CoursesScreen() {
  const isDesktop = useIsDesktop();
  const [signedIn, setSignedIn] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  const signIn = () => {
    setSignedIn(true);
    setShowSignIn(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-secondary-1000">
      <NavBar
        visitor={!signedIn}
        onEnroll={signIn}
        onLogout={() => setSignedIn(false)}
        onHome={() => goToScreen("newsfeed")}
        userName="Hira"
        links={communityNavLinks("courses")}
        elevateOnScroll
        visitorCta="login-only"
        mobileFooter={<BecomeTeacherCard onBecomeTeacher={() => setShowSignIn(true)} />}
      />

      <main className="mx-auto w-full max-w-[1440px] flex-1 px-20 pb-[96px] pt-20 md:px-40 lg:px-[101px] lg:pb-20">
        <div className="flex flex-col gap-28">
          <h1 className="text-lg-2 font-semibold text-secondary-300">Explore Courses</h1>
          {SCHOOLS.length === 0 ? (
            <p className="text-md text-secondary-300">No courses available yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-20 lg:grid-cols-2">
              {SCHOOLS.map((s) => (
                <CourseCard key={s.id} course={s} onOpen={() => goToScreen("school")} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Mobile: bottom nav (Courses here / Feed returns to the newsfeed) */}
      {!isDesktop && (
        <nav
          aria-label="Community sections"
          className="fixed inset-x-0 bottom-0 z-40 flex border-t border-secondary-900 bg-secondary-1000"
        >
          <button
            type="button"
            onClick={() => goToScreen("newsfeed")}
            className="flex flex-1 flex-col items-center gap-4 py-12 text-sm font-medium text-secondary-400 transition-colors"
          >
            <Icon name="message-circle" size={22} />
            Feed
          </button>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-current="page"
            className="flex flex-1 flex-col items-center gap-4 py-12 text-sm font-medium text-primary-500"
          >
            <Icon name="book" size={22} />
            Courses
          </button>
        </nav>
      )}

      {showSignIn && <SignInPrompt onSignIn={signIn} onClose={() => setShowSignIn(false)} />}
    </div>
  );
}
