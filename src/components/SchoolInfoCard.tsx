/**
 * SchoolInfoCard — visitor-only banner shown beneath the tab bar (Figma
 * "School Details", node 43147:20981). Surfaces the start date, price and an
 * "Enroll Now" CTA. Subtle glass gradient on a secondary-900 stroke.
 */
import { COURSE } from "../data/course";

export function SchoolInfoCard({ onEnroll }: { onEnroll: () => void }) {
  return (
    <div
      className="flex flex-col gap-20 rounded-lg border border-secondary-900 p-24 md:flex-row md:items-center md:justify-between"
      style={{
        backgroundImage:
          "linear-gradient(268deg, rgba(255,255,255,0.04) 32%, rgba(249,252,255,0.08) 99%)",
      }}
    >
      {/* Start date */}
      <div className="flex flex-col gap-8">
        <span className="text-lg text-secondary-200">{COURSE.startLabel}</span>
        <div className="flex flex-col gap-4">
          <span className="text-xl font-semibold text-neutral-0">{COURSE.startDate}</span>
          <span className="text-lg-2 text-neutral-0">{COURSE.startYear}</span>
        </div>
      </div>

      {/* Price — hidden on mobile (shown in the sticky bottom bar instead). */}
      <div className="hidden flex-col gap-8 lg:flex">
        <span className="text-lg text-secondary-200">Start with</span>
        <div className="flex flex-col gap-4">
          <span className="font-semibold text-primary-500">
            <span className="text-[32px]">{COURSE.price}</span>
            <span className="text-xl">/month</span>
          </span>
          <span className="text-lg text-secondary-200">{COURSE.priceNote}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onEnroll}
        className="hidden h-48 shrink-0 items-center justify-center rounded-full bg-primary-500 px-20 text-md font-semibold text-secondary-1000 transition-colors hover:bg-primary-400 lg:flex"
      >
        Enroll Now
      </button>
    </div>
  );
}
