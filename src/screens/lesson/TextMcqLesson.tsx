/**
 * TextMcqLesson — "Practice with Alif" (Lessons - Text MCQ).
 * Listen & identify → pick an option → Check reveals correct (lime) / wrong (red),
 * then the same button turns into Next. The footer shows only this button.
 */
import { useState } from "react";
import { Icon } from "../../components/Icon";
import { LessonLayout } from "../../components/LessonLayout";
import { SpokenArabic } from "../../components/SpokenArabic";
import { nextLesson } from "../../data/lessons";

const OPTIONS = ["Noon", "Baa", "Alif", "Daal"];
const CORRECT = 2; // Alif

export function TextMcqLesson({
  activeId,
  onNavigate,
  onBack,
}: {
  activeId: string;
  onNavigate: (id: string) => void;
  onBack: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  const next = nextLesson(activeId);
  const goNext = () => (next ? onNavigate(next.id) : onBack());

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
      hidePrev
      hideNext
      action={
        <button
          type="button"
          onClick={() => (checked ? goNext() : selected !== null && setChecked(true))}
          disabled={selected === null}
          className={[
            "flex items-center gap-8 rounded-full px-24 py-12 text-sm font-semibold transition-all duration-micro ease-in-out-soft",
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
          Listen &amp; Identify
        </span>

        <SpokenArabic words={["أ"]} size={34} wordMs={900} />

        <h2 className="text-lg font-semibold text-neutral-0">Select the right option</h2>

        <div className="grid w-full grid-cols-1 gap-16 sm:grid-cols-2">
          {OPTIONS.map((opt, i) => (
            <button
              key={opt}
              type="button"
              disabled={checked}
              onClick={() => setSelected(i)}
              className={[
                "rounded-md border px-24 py-16 text-md font-medium text-neutral-0 transition-colors duration-200",
                optionClass(i),
              ].join(" ")}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </LessonLayout>
  );
}
