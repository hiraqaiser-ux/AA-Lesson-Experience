/**
 * AudioPlayControl — the "Tap to listen" audio control.
 * Replicates the Athan Academy DS component (node 42442:24682): a 64px circle
 * with a label beneath, gap-12. Brand-only palette, all tokens.
 *
 * States (matching the DS component):
 *   • idle     → play  · "Tap to listen"
 *   • playing  → pause · "Playing…"
 *   • loading  → spinner · "Loading…"
 *   • failed   → retry · "Couldn't load · Tap to retry" (error-300)
 */
import { Icon, type IconName } from "./Icon";

export type AudioPlayState = "idle" | "playing" | "loading" | "failed";

const CONFIG: Record<AudioPlayState, { icon: IconName; label: string }> = {
  idle: { icon: "play", label: "Tap to listen" },
  playing: { icon: "pause", label: "Playing…" },
  loading: { icon: "loader", label: "Loading…" },
  failed: { icon: "rotate-cw", label: "Couldn’t load · Tap to retry" },
};

export function AudioPlayControl({
  state = "idle",
  onClick,
  className = "",
}: {
  state?: AudioPlayState;
  onClick?: () => void;
  className?: string;
}) {
  const { icon, label } = CONFIG[state];
  const isFailed = state === "failed";
  const isLoading = state === "loading";

  const circle = (
    <span
      className={[
        // Filled neutral disc (overlay-white-12 is invisible on the dark bg, so we
        // use neutral-700 — the grey the Figma component actually renders as).
        "grid size-64 place-items-center rounded-full border bg-neutral-700",
        "transition-transform duration-micro ease-in-out-soft",
        isFailed ? "border-error-300 text-error-300" : "border-neutral-700 text-neutral-0",
      ].join(" ")}
    >
      <Icon name={icon} size={28} className={isLoading ? "animate-spin" : ""} />
    </span>
  );

  const text = (
    <span
      className={[
        "text-sm font-medium",
        isFailed ? "text-error-300" : "text-secondary-300",
      ].join(" ")}
    >
      {label}
    </span>
  );

  // Loading is non-interactive; the others are tappable.
  if (isLoading) {
    return (
      <div className={`flex flex-col items-center gap-12 ${className}`} aria-busy="true">
        {circle}
        {text}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={[
        "flex flex-col items-center gap-12",
        "transition-transform duration-micro ease-in-out-soft hover:scale-[1.03] active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 focus-visible:ring-offset-secondary-3 rounded-lg",
        className,
      ].join(" ")}
    >
      {circle}
      {text}
    </button>
  );
}
