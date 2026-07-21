/**
 * MobileSchoolAboutTab — "About" tab of the mobile School Detail page
 * (Figma node 43882:79522, Visitor). Purely informational — no persona-
 * specific content differences beyond the same visitor-only SchoolEnrollBar
 * used on the Lesson/Discussion tabs (no Enrolled Student variant of this
 * frame was fetched, since the content itself doesn't change by persona).
 *
 * Content (course blurb, class-overview stats, benefits, weekly plan,
 * instructor bio, expertise) is transcribed verbatim from the Figma fetch —
 * none of it existed elsewhere in this codebase to reuse. One flagged
 * discrepancy: this "Weekly Plan" describes a letters/alphabet progression
 * that doesn't match the Lesson tab's actual SECTIONS data (a words/
 * vocabulary progression) — the two Figma frames appear to have been
 * designed independently. Not reconciled here; flagging rather than
 * inventing a fix on either side.
 * Reuses the existing Abdul Haseeb photo (/instructor-abdul.png, already
 * used elsewhere for this instructor) instead of downloading a duplicate.
 * "See more" reveals weeks 4–6 — a real toggle, not decorative, since all 6
 * weeks' content came from the same fetch.
 */
import { useState } from "react";
import { Icon, type IconName } from "../../components/Icon";
import { SchoolEnrollBar } from "../../components/mobile/SchoolEnrollBar";

const CLASS_OVERVIEW: { icon: IconName; label: string }[] = [
  { icon: "headphones", label: "32 Audio Assignments" },
  { icon: "list-checks", label: "175 Practice Exercises" },
  { icon: "video", label: "16 Video Lessons" },
  { icon: "award", label: "Completion Certificate" },
];

const TOP_BENEFITS = [
  "Personalized feedback from teacher",
  "Practice all your learnings",
  "Flexible weekly schedule",
  "Weekly performance updates",
  "Connect with your teachers and peers",
];

const WEEKLY_PLAN = [
  {
    week: "Week 1",
    title: "Arabic Alphabets (1-15)",
    meta: "4 lessons, 4 exercises & 2 assignments",
    image: "/week1-arabic-alphabets.png",
  },
  {
    week: "Week 2",
    title: "Arabic Alphabets (16-29)",
    meta: "4 lessons, 4 exercises & 2 assignments",
    image: "/week2-arabic-alphabets.png",
  },
  {
    week: "Week 3",
    title: "Connecting letters (1-15)",
    meta: "4 lessons, 5 exercises & 2 assignments",
    image: "/week3-connecting-letters.png",
  },
  {
    week: "Week 4",
    title: "Connecting letters (16-29)",
    meta: "4 lessons, 5 exercises & 2 assignments",
    image: "/week4-connecting-letters.png",
  },
  {
    week: "Week 5",
    title: "Fat'hah & Kasrah",
    meta: "13 exercises & 2 assignments",
    image: "/week5-fathah-kasrah.png",
  },
  {
    week: "Week 6",
    title: "Kasrah, Dhammah & Fat'hatain",
    meta: "15 exercises & 3 assignments",
    image: "/week6-kasrah-dhammah.png",
  },
];

const EXPERTISE: { icon: IconName; text: string }[] = [
  {
    icon: "award",
    text: "Has a specialization in Arabic language and holds several awards in Arabic grammar, language and Quranic logic",
  },
  {
    icon: "star",
    text: "Successfully helped more than 4,000 students improve their Quran recitation in this course so far",
  },
];

function Divider() {
  return <div aria-hidden className="h-0 border-t border-secondary-950" />;
}

export function MobileSchoolAboutTab({ enrolled, onEnroll }: { enrolled: boolean; onEnroll: () => void }) {
  const [showAllWeeks, setShowAllWeeks] = useState(false);
  const visibleWeeks = showAllWeeks ? WEEKLY_PLAN : WEEKLY_PLAN.slice(0, 3);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-16 overflow-y-auto p-16">
        <div className="flex flex-col gap-8">
          <h2 className="text-md font-bold text-neutral-0">About course</h2>
          <p className="text-sm leading-6 text-secondary-200">
            Build your Tajweed and Arabic pronunciation skills to recite Quran independently, using video lessons and
            personalized feedback from teachers
          </p>
        </div>

        <Divider />

        <div className="flex flex-col gap-8">
          <h2 className="text-md font-bold text-neutral-0">Class overview</h2>
          <div className="flex flex-wrap gap-y-8">
            {CLASS_OVERVIEW.map((item) => (
              <div key={item.label} className="flex w-1/2 items-center gap-8">
                <Icon name={item.icon} size={16} className="shrink-0 text-neutral-0" />
                <span className="text-xs text-neutral-0">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <Divider />

        <div className="flex flex-col gap-8">
          <h2 className="text-md font-bold text-neutral-0">Top Benefits</h2>
          <ol className="list-decimal pl-20 text-sm leading-6 text-secondary-200">
            {TOP_BENEFITS.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ol>
        </div>

        <Divider />

        <div className="flex flex-col gap-12">
          <h2 className="text-md font-bold text-neutral-0">Weekly Plan</h2>
          <div className="flex flex-col gap-8">
            {visibleWeeks.map((w) => (
              <div key={w.week} className="flex gap-12 rounded-lg border border-secondary-600 p-16">
                <img src={w.image} alt="" className="size-64 shrink-0 rounded-sm object-cover" />
                <div className="flex flex-col gap-4">
                  <span className="text-xs uppercase tracking-wide text-secondary-200">{w.week}</span>
                  <span className="text-sm font-extrabold text-neutral-0">{w.title}</span>
                  <span className="text-xs text-secondary-200">{w.meta}</span>
                </div>
              </div>
            ))}
          </div>
          {WEEKLY_PLAN.length > 3 && (
            <button
              type="button"
              onClick={() => setShowAllWeeks((v) => !v)}
              className="self-center rounded-full bg-secondary-800 px-16 py-8 text-sm font-bold text-neutral-0"
            >
              {showAllWeeks ? "See less" : "See more"}
            </button>
          )}
        </div>

        <Divider />

        <div className="flex flex-col gap-16">
          <div className="flex flex-col gap-16">
            <h2 className="text-md font-bold text-neutral-0">About Abdul Haseeb</h2>
            <img src="/instructor-abdul.png" alt="" className="h-[174px] w-full rounded-sm object-cover" />
            <p className="text-sm leading-6 text-secondary-200">
              Abdul Haseeb is an Aalim Course instructor at AAS Educational Complex. He has completed the Alimiyyah
              program with numerous ijazah in various Islamic sciences and methodologies. He specializes in the Arabic
              language and has a vast experience of 8 years in teaching Arabic grammar, language &amp; logic.
            </p>
          </div>

          <div className="flex flex-col gap-16">
            <h2 className="text-md font-bold text-neutral-0">Expertise</h2>
            <div className="flex flex-col gap-16">
              {EXPERTISE.map((item) => (
                <div key={item.text} className="flex gap-8 rounded-lg border border-secondary-800 p-16">
                  <Icon name={item.icon} size={20} className="shrink-0 text-neutral-0" />
                  <p className="text-sm leading-6 text-neutral-0">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {!enrolled && <SchoolEnrollBar onEnroll={onEnroll} />}
    </div>
  );
}
