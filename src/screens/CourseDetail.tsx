import { useEffect, useRef, useState } from "react";
import { NavBar } from "../components/NavBar";
import { Button } from "../components/Button";
import { Footer } from "../components/Footer";
import { GlassTabs } from "../components/GlassTabs";
import { FaqItem } from "../components/FaqItem";
import { Icon } from "../components/Icon";
import { SchoolInfoCard } from "../components/SchoolInfoCard";
import { NotifyMeButton } from "../components/NotifyMeButton";
import { NotifyMeModal } from "../components/NotifyMeModal";
import { LoginModal } from "../components/LoginModal";
import { useWaitlist } from "../hooks/useWaitlist";
import { AVATAR_BG } from "../components/discussion/DiscussionParts";
import { LessonsScreen } from "./LessonsScreen";
import { DiscussionsScreen } from "./DiscussionsScreen";
import { communityNavLinks, goToScreen } from "../components/newsfeed/communityNav";
import { usePersona } from "../hooks/usePersona";
import { PERSONAS, buildAccountSwitcher } from "../data/personas";
import { COURSE, FAQS } from "../data/course";

const TABS = ["About", "Lessons", "Discussions"];

const BENEFITS = [
  "Get personalized feedback from teachers",
  "Pace your learning according to your busy schedule",
  "Special techniques to improve fluency and develop consistency",
  "Prepare with video lessons. Practice with exercises.",
];

const OBJECTIVES = [
  "Recite Quranic verses with correct Tajweed and pronunciation",
  "Build a consistent daily practice with teacher feedback",
  "Understand the meaning of common Arabic words and phrases",
  "Gain confidence to recite fluently and independently",
];

const ACCOMPLISHMENTS = [
  "Youth Leadership Award from the Islamic Center of Long Island for helping in the outstanding development of youth.",
  "Designed and created the Halal certification program for providing Halal food in 100+ public schools in New York.",
  "7 year Alimiyyah course with certified mastery in Fiqh, Tafseer and Hadith.",
];

const INSTRUCTOR = {
  name: "Shaykh Ibad Wali",
  bio:
    "Shaykh Ibad Wali is the Executive Director & Resident Scholar of Hillside Islamic Center, New York. He is also an Aalim Course Instructor at Darul Uloom New York. Shaykh Ibad completed the rigorous seven-year ‘Alimiyyah program with numerous authentic certifications in various Islamic sciences including Fiqh, Tafseer, Hadith, and their methodologies.",
};

const SUBNAV = [
  { id: "overview", label: "Course Overview" },
  { id: "benefits", label: "Course Benefits" },
  { id: "objectives", label: "Learning Objectives" },
  { id: "instructor", label: "About the Instructor" },
  { id: "faqs", label: "FAQ's" },
];

/** Section heading — 24px / SemiBold (matches Figma About headers). */
function SectionTitle({ id, children }: { id?: string; children: string }) {
  return (
    <h2 id={id} className="scroll-mt-[96px] text-xl font-semibold text-neutral-0">
      {children}
    </h2>
  );
}

/** Borderless list row with a lime check-circle icon — Benefits & Objectives. */
function CheckRow({ children }: { children: string }) {
  return (
    <li className="flex items-center gap-12 py-4">
      <Icon name="check-circle" size={20} className="shrink-0 text-primary-200" />
      <span className="text-md text-text-primary">{children}</span>
    </li>
  );
}

function Divider() {
  return <hr className="border-0 border-t border-secondary-900" />;
}

export function CourseDetail({
  onOpenLesson,
  onOpenPost,
  enrolled,
  onEnroll,
  onUnenroll,
  communityMode = false,
}: {
  onOpenLesson?: (lessonId: string) => void;
  onOpenPost?: (post: import("../data/discussions").Post) => void;
  enrolled: boolean;
  onEnroll: () => void;
  onUnenroll: () => void;
  /**
   * Reached from the newsfeed (a course/school link) rather than the app's own
   * entry point: swaps in the community nav bar (Home/Courses/Blogs) and adds a
   * "Back to home" ghost button. Leaves the default entry's nav untouched.
   */
  communityMode?: boolean;
}) {
  const [tab, setTab] = useState("About");
  const [floating, setFloating] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const tabsRef = useRef<HTMLDivElement>(null);

  // Waitlist ("Notify Me") flow — active only when this batch is full and the
  // visitor hasn't enrolled. The popup confirms before joining the waitlist.
  const [waitlisted, joinWaitlist, leaveWaitlist] = useWaitlist(COURSE.school);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const openNotify = () => setNotifyOpen(true);
  const confirmNotify = () => {
    joinWaitlist();
    setNotifyOpen(false);
  };

  // Persona system only applies in communityMode (reached via the newsfeed); the
  // default entry keeps using the `enrolled`/`onEnroll`/`onUnenroll` props as-is.
  const [persona, setPersona] = usePersona();
  const communityEnrolled = persona !== "visitor";
  const currentPersona = communityMode && communityEnrolled ? PERSONAS[persona] : undefined;
  const effectiveEnrolled = communityMode ? communityEnrolled : enrolled;
  // "Logged in" is broader than "enrolled": joining the waitlist logs the user
  // in (profile nav bar) without enrolling them in the (full) course.
  const loggedIn = effectiveEnrolled || waitlisted;
  // Enrolling requires logging in first: the CTA opens the login popup, and the
  // actual enroll runs only on a successful login.
  const doEnroll = communityMode ? () => setPersona("student") : onEnroll;
  // Logout drops enrollment AND the waitlist, returning to the Notify Me state.
  const handleLogout = () => {
    leaveWaitlist();
    if (communityMode) setPersona("visitor");
    else onUnenroll();
  };

  const [loginOpen, setLoginOpen] = useState(false);
  const handleEnroll = () => setLoginOpen(true);
  const onLoginSuccess = () => {
    setLoginOpen(false);
    doEnroll();
  };

  // Full batch → visitors see "Notify Me" instead of "Enroll Now". The
  // `?seats=full|open` query param overrides the data flag so a single link can
  // demo both flows (defaults to COURSE.seatsFull when the param is absent).
  const seatsParam =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("seats")
      : null;
  const seatsFullFlag =
    seatsParam === "full" ? true : seatsParam === "open" ? false : COURSE.seatsFull === true;
  const seatsFull = !effectiveEnrolled && seatsFullFlag;

  // Sticky-at-bottom tabs: dock a floating pill as soon as the inline tabs
  // scroll up near the top of the viewport (rootMargin pushes the trigger early).
  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setFloating(!entry.isIntersecting), {
      rootMargin: "-72px 0px 0px 0px",
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [tab]);

  // Scroll-spy for the left sub-nav (About tab only).
  useEffect(() => {
    if (tab !== "About") return;
    const ids = SUBNAV.map((s) => s.id);
    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        // Highlight the lowest heading that has scrolled into the top zone.
        const inView = ids.filter((id) => visible.has(id));
        if (inView.length) setActiveSection(inView[inView.length - 1]);
      },
      { rootMargin: "-96px 0px -68% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const node = document.getElementById(id);
      if (node) io.observe(node);
    });
    return () => io.disconnect();
  }, [tab]);

  const goTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className={`min-h-full bg-secondary-3 ${!effectiveEnrolled ? "pb-[120px] lg:pb-0" : ""}`}>
      <NavBar
        userName={currentPersona?.name ?? "Hira"}
        visitor={!loggedIn}
        onEnroll={handleEnroll}
        onLogout={handleLogout}
        onHome={
          communityMode
            ? () => goToScreen("newsfeed")
            : () => {
                setTab("About");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
        }
        links={communityMode ? communityNavLinks("courses") : undefined}
        elevateOnScroll={communityMode}
        visitorCta={communityMode ? "login-only" : "login-enroll"}
        avatarUrl={currentPersona?.avatarUrl}
        avatarColorClassName={currentPersona ? AVATAR_BG[currentPersona.color] : undefined}
        accountSwitcher={
          communityMode && communityEnrolled ? buildAccountSwitcher(persona, setPersona) : undefined
        }
        seatsFull={seatsFull}
        waitlisted={waitlisted}
        onNotify={openNotify}
      />

      {/* Hero */}
      <div className="mx-auto flex w-full flex-col gap-24 px-16 pt-24 md:gap-32 md:px-40 md:pt-32 lg:px-[92px]">
        {communityMode && (
          <Button
            variant="ghost"
            size="md"
            onClick={() => goToScreen("newsfeed")}
            className="self-start !pt-0"
          >
            <Icon name="chevron-left" size={16} />
            Back to home
          </Button>
        )}

        <div className="flex flex-col gap-24 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-16 md:max-w-[520px]">
            <span className="flex items-center gap-8">
              <Icon name="book" size={20} className="text-primary-500" />
              <span className="text-md font-medium text-neutral-0">{COURSE.school}</span>
              <span className="rounded-full border border-success px-8 py-4 text-xs font-semibold uppercase tracking-wide text-success">
                Published
              </span>
            </span>
            <h1 className="font-slab text-[28px] font-bold leading-[1.15] text-neutral-0 md:text-[40px] md:leading-[1.1]">
              {COURSE.title}
            </h1>
            <p className="text-md text-secondary-300">{COURSE.blurb}</p>
          </div>

          {/* Video */}
          <div className="relative flex aspect-video w-full max-w-[460px] items-center justify-center rounded-lg border border-secondary-800 bg-secondary-950">
            <span
              className="grid size-48 place-items-center rounded-full text-neutral-0"
              style={{ backgroundColor: "var(--c-overlay-white-12)" }}
            >
              <Icon name="play" size={24} />
            </span>
            <span
              className="absolute bottom-12 right-12 rounded-sm px-8 py-4 text-xs font-medium text-neutral-0"
              style={{ backgroundColor: "var(--c-overlay-black-55)" }}
            >
              03:45
            </span>
          </div>
        </div>

        {/* Visitor-only "School Details" banner — sits above the tabs. */}
        {!effectiveEnrolled && (
          <div className="mx-auto w-full max-w-[840px]">
            <SchoolInfoCard
              onEnroll={handleEnroll}
              seatsFull={seatsFull}
              waitlisted={waitlisted}
              onNotify={openNotify}
            />
          </div>
        )}
      </div>

      {/* Tabs — sticky under the nav on mobile, inline on desktop. */}
      <div
        ref={tabsRef}
        className="sticky top-[63px] z-30 border-b border-secondary-900 bg-secondary-3 lg:static lg:top-auto lg:z-auto lg:border-b-0 lg:bg-transparent"
      >
        <div className="mx-auto flex w-full justify-center px-16 py-8 md:px-40 lg:px-[92px] lg:py-40">
          <GlassTabs tabs={TABS} active={tab} onChange={setTab} dot="Discussions" />
        </div>
      </div>

      {/* Tab content */}
      {tab === "Lessons" ? (
        <LessonsScreen onOpenLesson={onOpenLesson} enrolled={effectiveEnrolled} />
      ) : tab === "Discussions" ? (
        <DiscussionsScreen
          onOpenPost={onOpenPost}
          enrolled={effectiveEnrolled}
          onEnroll={handleEnroll}
          onUnenroll={handleLogout}
          waitlisted={waitlisted}
        />
      ) : (
        <div className="mx-auto w-full px-16 pt-24 md:px-40 lg:px-[92px]">
          <div className="rounded-lg p-0 md:border md:border-secondary-900 md:p-40">
            <div className="flex flex-col gap-40 md:flex-row md:gap-48">
              {/* Left sub-nav — desktop scroll-spy aid; hidden on mobile */}
              <nav className="hidden md:block md:w-[200px] md:shrink-0">
                <ul className="flex flex-col gap-16 md:sticky md:top-32">
                  {SUBNAV.map((s) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => goTo(s.id)}
                        className={[
                          "text-left text-sm transition-colors",
                          activeSection === s.id
                            ? "font-semibold text-neutral-0"
                            : "text-secondary-400 hover:text-secondary-200",
                        ].join(" ")}
                      >
                        {s.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Right content */}
              <div className="flex flex-1 flex-col gap-32">
                <section className="flex flex-col gap-12">
                  <SectionTitle id="overview">Course Overview</SectionTitle>
                  <p className="text-md text-secondary-300">
                    Build your Tajweed and Arabic pronunciation skills to recite Quran
                    independently, using video lessons and personalized feedback from teachers.
                  </p>
                  <p className="text-sm text-secondary-400">
                    Difficulty Level: <span className="font-semibold text-neutral-0">Beginner</span>
                  </p>
                </section>

                <Divider />

                <section className="flex flex-col gap-16">
                  <SectionTitle id="benefits">Course Benefits</SectionTitle>
                  <ul className="flex flex-col gap-12">
                    {BENEFITS.map((b) => (
                      <CheckRow key={b}>{b}</CheckRow>
                    ))}
                  </ul>
                </section>

                <Divider />

                <section className="flex flex-col gap-16">
                  <SectionTitle id="objectives">Learning Objectives</SectionTitle>
                  <ul className="flex flex-col gap-12">
                    {OBJECTIVES.map((o) => (
                      <CheckRow key={o}>{o}</CheckRow>
                    ))}
                  </ul>
                </section>

                <Divider />

                <section className="flex flex-col gap-16">
                  <SectionTitle id="instructor">About the Instructor</SectionTitle>
                  <div className="flex flex-col gap-16 sm:flex-row">
                    <div
                      className="aspect-square w-[140px] shrink-0 overflow-hidden rounded-lg bg-secondary-800"
                      aria-label="Instructor photo placeholder"
                    />
                    <div className="flex flex-col gap-8">
                      <h3 className="text-lg font-semibold text-neutral-0">{INSTRUCTOR.name}</h3>
                      <p className="text-md leading-6 text-secondary-300">{INSTRUCTOR.bio}</p>
                    </div>
                  </div>

                  {/* Instructor Accomplishments */}
                  <div className="mt-8 flex flex-col gap-12">
                    <h4 className="text-md font-semibold text-neutral-0">Instructor Accomplishments</h4>
                    <ul className="flex flex-col gap-12">
                      {ACCOMPLISHMENTS.map((a) => (
                        <li key={a} className="flex items-start gap-12">
                          <Icon name="award" size={20} className="mt-2 shrink-0 text-star" />
                          <span className="text-md text-secondary-300">{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                <Divider />

                <section className="flex flex-col gap-16">
                  <SectionTitle id="faqs">Frequently Asked Questions</SectionTitle>
                  <div className="flex flex-col">
                    {FAQS.map((f, i) => (
                      <FaqItem key={f.question} {...f} defaultOpen={i === 0} />
                    ))}
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-4 self-start text-sm font-semibold text-primary-500 hover:text-primary-400"
                  >
                    See More
                    <Icon name="chevron-down" size={16} />
                  </button>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />

      {/* Mobile visitor: sticky bottom bar. Full batch → "Notify Me" + waitlist
          caption; otherwise the Enroll CTA + price. */}
      {!effectiveEnrolled && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-secondary-900 bg-secondary-1000 px-16 pb-24 pt-12 lg:hidden">
          {seatsFull ? (
            <NotifyMeButton
              joined={waitlisted}
              onNotify={openNotify}
              className="h-48 w-full text-md"
              showCaption
            />
          ) : (
            <>
              <button
                type="button"
                onClick={handleEnroll}
                className="flex h-48 w-full items-center justify-center rounded-full bg-primary-500 text-md font-semibold text-secondary-1000 transition-colors hover:bg-primary-400"
              >
                Enroll Now
              </button>
              <p className="mt-8 text-center text-md text-secondary-300">
                <span className="font-bold text-primary-500">{COURSE.price}</span> ({COURSE.priceNote})
              </p>
            </>
          )}
        </div>
      )}

      {notifyOpen && <NotifyMeModal onClose={() => setNotifyOpen(false)} onConfirm={confirmNotify} />}

      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} onSuccess={onLoginSuccess} />}

      {/* Sticky docked tabs (float in on scroll) — desktop only; mobile uses the sticky tab bar. */}
      <div
        className={[
          "fixed bottom-24 left-1/2 z-50 hidden -translate-x-1/2 transition-all duration-300 ease-out-soft lg:block",
          floating
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-16 opacity-0",
        ].join(" ")}
      >
        <div className="rounded-full bg-overlay-white-8 px-8 py-4 shadow-lg backdrop-blur-md">
          <GlassTabs tabs={TABS} active={tab} onChange={setTab} dense dot="Discussions" />
        </div>
      </div>
    </div>
  );
}
