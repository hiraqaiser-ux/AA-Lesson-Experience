/**
 * NotifyMeButton — the enrollment CTA for a course whose seats are full.
 *
 * Two states:
 *  - not joined → primary "Notify Me" button (opens the Enrollment Unavailable
 *    popup via `onNotify`).
 *  - joined → disabled "On the waitlist" pill. Because touch devices have no
 *    hover, the explanation is surfaced two ways:
 *      • desktop → a hover tooltip
 *      • mobile  → an always-visible caption below the pill (`showCaption`)
 *
 * `className` carries the size/layout for the button so each host (nav bar,
 * school card, sticky bar) can size it to its context.
 */
import { useIsDesktop } from "../hooks/useIsDesktop";

const TOOLTIP = "You're on the waitlist — we'll notify you when enrolment opens.";
const CAPTION = "We'll email you when enrolment opens.";

export function NotifyMeButton({
  joined,
  onNotify,
  className = "",
  showCaption = false,
  tooltipSide = "top",
}: {
  /** True once the visitor has joined this course's waitlist. */
  joined: boolean;
  /** Opens the Enrollment Unavailable popup. */
  onNotify: () => void;
  /** Size/layout classes applied to the button element. */
  className?: string;
  /** Mobile persistent state: render an always-visible caption under the pill. */
  showCaption?: boolean;
  /** Where the desktop hover tooltip sits relative to the pill. */
  tooltipSide?: "top" | "bottom";
}) {
  const isDesktop = useIsDesktop();

  if (!joined) {
    return (
      <button
        type="button"
        onClick={onNotify}
        className={`flex items-center justify-center gap-8 rounded-full bg-primary-500 font-semibold text-secondary-1000 transition-colors hover:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${className}`}
      >
        Notify Me
      </button>
    );
  }

  return (
    <div className="group relative flex flex-col items-stretch gap-8">
      <button
        type="button"
        disabled
        aria-disabled="true"
        aria-describedby={isDesktop ? undefined : "waitlist-note"}
        className={`flex cursor-not-allowed items-center justify-center gap-8 rounded-full bg-secondary-800 font-semibold text-secondary-400 ${className}`}
      >
        Added to waitlist
      </button>

      {isDesktop ? (
        <span
          role="tooltip"
          className={[
            "pointer-events-none absolute left-1/2 z-50 w-max max-w-[260px] -translate-x-1/2 rounded-md bg-secondary-950 px-12 py-8 text-center text-sm leading-5 text-secondary-100 opacity-0 shadow-lg transition-opacity duration-micro group-hover:opacity-100",
            tooltipSide === "top" ? "bottom-full mb-8" : "top-full mt-8",
          ].join(" ")}
        >
          {TOOLTIP}
        </span>
      ) : (
        showCaption && (
          <p id="waitlist-note" className="text-center text-sm text-secondary-300">
            {CAPTION}
          </p>
        )
      )}
    </div>
  );
}
