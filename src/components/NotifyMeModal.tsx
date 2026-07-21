/**
 * NotifyMeModal — the "Enrollment Unavailable" popup (Figma node 41701:29378).
 * Shown when a visitor taps "Notify Me" on a course whose seats are full.
 * Renders as a centered dialog on desktop and a bottom sheet on mobile via
 * ResponsiveModal. Confirming ("Notify Me") joins the waitlist.
 */
import { ResponsiveModal } from "./ResponsiveModal";

export function NotifyMeModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  /** Fired by the popup's "Notify Me" — joins the waitlist. */
  onConfirm: () => void;
}) {
  return (
    <ResponsiveModal onClose={onClose}>
      <div className="flex flex-col gap-24">
        <div className="flex flex-col gap-24">
          <h2 className="text-center font-slab text-lg font-bold text-neutral-0">
            Enrollment Unavailable
          </h2>
          <hr className="border-0 border-t border-secondary-800" />
        </div>

        <p className="text-center text-lg-2 leading-normal text-secondary-200">
          You just missed this batch, but the next one is coming! Click the button and we&apos;ll
          send you an email the moment enrolments open.
        </p>

        <div className="flex gap-20">
          <button
            type="button"
            onClick={onClose}
            className="flex h-48 flex-1 items-center justify-center rounded-full bg-secondary-800 px-20 text-md font-semibold text-secondary-50 transition-colors hover:bg-secondary-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex h-48 flex-1 items-center justify-center rounded-full bg-primary-500 px-20 text-md font-semibold text-secondary-1000 transition-colors hover:bg-primary-400"
          >
            Notify Me
          </button>
        </div>
      </div>
    </ResponsiveModal>
  );
}
