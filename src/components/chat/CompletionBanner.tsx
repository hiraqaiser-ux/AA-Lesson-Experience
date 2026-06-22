/**
 * CompletionBanner
 *
 * Shown when the student submits the assignment. Animates:
 *  • Banner reveal (animate-banner-in: rise + fade)
 *  • Check mark pop with overshoot (animate-check-pop)
 *
 * Minimal brand treatment: Secondary/950 surface, subtle Secondary/800 border,
 * lime Primary check + label. No status-green.
 */
import { Icon } from "../Icon";

export function CompletionBanner() {
  return (
    <div
      role="status"
      className={[
        "animate-banner-in flex w-full items-center justify-center gap-8",
        "rounded-[12px] border border-secondary-800 bg-secondary-950 px-16 py-16",
      ].join(" ")}
    >
      <span className="animate-check-pop grid size-20 place-items-center rounded-full bg-primary-500">
        <Icon name="check" size={12} className="text-secondary-1000" />
      </span>
      <span className="text-sm font-semibold text-primary-500">
        This assignment is marked complete!
      </span>
    </div>
  );
}
