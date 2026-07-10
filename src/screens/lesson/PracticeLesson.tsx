/**
 * PracticeLesson — "Describe what you see" (Lessons - Practice Lesson).
 * Choose the correct pronunciation → Check reveals correctness, then the same
 * button turns into Next. The footer shows only this button.
 */
import { useState } from "react";
import { Icon } from "../../components/Icon";
import { LessonLayout } from "../../components/LessonLayout";
import { SpokenArabic } from "../../components/SpokenArabic";
import { nextStep } from "../../data/lessons";

const PHRASE = ["يَوْمَ", "يُنفَخُ", "فِى", "الصُّورِ"];

const OPTIONS = ["Option 1", "Option 2", "Option 3", "Option 4"];
const CORRECT = 0;

export function PracticeLesson({
  activeId,
  onNavigate,
  onBack,
  onLogout,
}: {
  activeId: string;
  onNavigate: (id: string) => void;
  onBack: () => void;
  onLogout?: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  const next = nextStep(activeId);
  const goNext = () => (next ? onNavigate(next.stepId) : onBack());

  function optionClass(i: number): string {
    if (checked) {
      if (i === CORRECT) return "border-primary-500";
      if (i === selected) return "border-error";
      return "border-secondary-800";
    }
    return selected === i ? "border-secondary-300" : "border-secondary-800 hover:border-secondary-600";
  }

  return (
    <LessonLayout
      activeId={activeId}
      onNavigate={onNavigate}
      onBack={onBack}
      onLogout={onLogout}
      hideNext
      action={
        <button
          type="button"
          onClick={() => (checked ? goNext() : selected !== null && setChecked(true))}
          disabled={selected === null}
          className={[
            "flex flex-1 items-center justify-center gap-8 rounded-full px-24 py-12 text-sm font-semibold transition-all duration-micro ease-in-out-soft lg:flex-none",
            selected === null
              ? "cursor-not-allowed bg-secondary-800 text-secondary-600"
              : "bg-primary-500 text-secondary-1000 hover:bg-primary-400 active:scale-95",
          ].join(" ")}
        >
          {checked ? "Next" : "Check"}
          <Icon name={checked ? "chevron-right" : "check"} size={16} />
        </button>
      }
    >
      <div className="mx-auto flex w-full max-w-[760px] flex-col items-center gap-24 pt-8">
        <span className="text-xs font-medium uppercase tracking-wide text-secondary-300">
          Choose the pronunciation
        </span>

        <SpokenArabic words={PHRASE} size={34} wordMs={650} />

        <h2 className="text-lg font-semibold text-neutral-0">
          Choose the correct pronunciation from the options below
        </h2>

        <div className="grid w-full grid-cols-1 gap-16 sm:grid-cols-2">
          {OPTIONS.map((opt, i) => (
            <button
              key={opt}
              type="button"
              disabled={checked}
              onClick={() => setSelected(i)}
              className={[
                "flex items-center gap-12 rounded-md border px-24 py-16 text-md font-medium text-neutral-0 transition-colors duration-200",
                optionClass(i),
              ].join(" ")}
            >
              <Icon name="video" size={20} className="shrink-0 text-primary-500" />
              <span className="flex-1 text-center">{opt}</span>
            </button>
          ))}
        </div>
      </div>
    </LessonLayout>
  );
}
