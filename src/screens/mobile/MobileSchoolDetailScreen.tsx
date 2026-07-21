/**
 * MobileSchoolDetailScreen — full-screen "School Detail" page (Figma: Visitor
 * nodes 43882:79450 Lesson / 43882:79522 About / 44968:38745 Discussion;
 * Enrolled Student nodes 43888:21233 / 43888:21288 / 43888:21444 — no Teacher
 * variant exists in Figma, out of scope per prior decision).
 * Header (back + course title) + Lesson/Discussion/About tabs, matching the
 * plain underline-tab style shown in this reference — distinct from
 * GlassTabs' frosted-pill style used elsewhere in this app, so it gets its
 * own small tab row rather than forcing GlassTabs to fit a different look.
 * Same fixed-full-screen pattern as MobilePostDetailPage — no bottom tab
 * nav while inside this sub-page.
 */
import { useState } from "react";
import { Icon } from "../../components/Icon";
import { MobileSchoolLessonTab } from "./MobileSchoolLessonTab";
import { MobileSchoolDiscussionTab } from "./MobileSchoolDiscussionTab";
import { MobileSchoolAboutTab } from "./MobileSchoolAboutTab";
import type { PersonaId } from "../../data/personas";

type DetailTab = "lesson" | "discussion" | "about";
const TABS: { id: DetailTab; label: string }[] = [
  { id: "lesson", label: "Lesson" },
  { id: "discussion", label: "Discussion" },
  { id: "about", label: "About" },
];

export function MobileSchoolDetailScreen({
  courseTitle,
  persona,
  onBack,
  onEnroll,
}: {
  courseTitle: string;
  persona: PersonaId;
  onBack: () => void;
  onEnroll: () => void;
}) {
  const [tab, setTab] = useState<DetailTab>("lesson");
  const enrolled = persona !== "visitor";

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-secondary-1000">
      <div className="flex h-[52px] shrink-0 items-center gap-16 border-b border-neutral-800 px-16">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="grid size-24 shrink-0 place-items-center text-neutral-0"
        >
          <Icon name="chevron-left" size={20} />
        </button>
        <span className="flex-1 truncate text-md font-medium text-neutral-0">{courseTitle}</span>
      </div>

      <div className="flex shrink-0 gap-16 border-b border-secondary-950 px-16 pt-16">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={[
              "flex flex-col items-center gap-8 pb-8 text-md transition-colors",
              t.id === tab ? "text-secondary-100" : "text-secondary-400",
            ].join(" ")}
          >
            {t.label}
            <span className={`h-[2px] w-full rounded-t-sm ${t.id === tab ? "bg-secondary-100" : "bg-transparent"}`} />
          </button>
        ))}
      </div>

      {tab === "lesson" ? (
        <MobileSchoolLessonTab enrolled={enrolled} onEnroll={onEnroll} />
      ) : tab === "discussion" ? (
        <MobileSchoolDiscussionTab persona={persona} onEnroll={onEnroll} />
      ) : (
        <MobileSchoolAboutTab enrolled={enrolled} onEnroll={onEnroll} />
      )}
    </div>
  );
}
