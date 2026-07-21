/**
 * WaitlistNoticeModal — shown when a waitlisted (not-yet-enrolled) user tries to
 * participate in Discussions (like / comment / post). Since the batch is full
 * they can't enrol, so instead of the "Enroll now" prompt we acknowledge their
 * waitlist spot. Centered dialog on desktop, bottom sheet on mobile.
 */
import { ResponsiveModal } from "../ResponsiveModal";

export function WaitlistNoticeModal({ onClose }: { onClose: () => void }) {
  return (
    <ResponsiveModal onClose={onClose}>
      <div className="flex flex-col gap-24">
        <div className="flex flex-col gap-12">
          <h2 className="text-center font-slab text-lg font-bold text-neutral-0">
            You're on the waitlist
          </h2>
          <p className="text-center text-md leading-6 text-secondary-200">
            You've been added to the waitlist — we'll email you as soon as enrolment opens so you
            can join the course and the discussion.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-48 w-full items-center justify-center rounded-full bg-primary-500 text-md font-semibold text-secondary-1000 transition-colors hover:bg-primary-400"
        >
          Okay
        </button>
      </div>
    </ResponsiveModal>
  );
}
