/**
 * MicRecordControl — the "Now let's practice" recording control.
 * Replicates the Athan Academy DS component (node 42444:25035): a 56px circle
 * with labels beneath, gap-12. Brand-only palette, all tokens.
 *
 * States (matching the DS component):
 *   • idle      → mic    · "Now let's practice"
 *   • recording → stop (red circle) · "Rec mm:ss" pill + privacy note
 *   • recorded  → play   · "Tap to play your recording" + "Re-record"
 *   • micDenied → mic-off · "Microphone access needed" + "Enable microphone"
 */
import { Icon } from "./Icon";

export type MicRecordState = "idle" | "recording" | "recorded" | "micDenied";

const CIRCLE_BASE = "grid size-64 place-items-center rounded-full transition-transform duration-micro ease-in-out-soft";
const TAP = "hover:scale-[1.03] active:scale-95";
const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 focus-visible:ring-offset-secondary-3";

export function MicRecordControl({
  state = "idle",
  recTime = "00:00",
  onMicClick,
  onStop,
  onPlay,
  onReRecord,
  onEnableMic,
  className = "",
}: {
  state?: MicRecordState;
  /** Elapsed recording time, e.g. "00:45" */
  recTime?: string;
  onMicClick?: () => void;
  onStop?: () => void;
  onPlay?: () => void;
  onReRecord?: () => void;
  onEnableMic?: () => void;
  className?: string;
}) {
  const wrap = `flex flex-col items-center gap-12 ${className}`;

  if (state === "recording") {
    return (
      <div className={wrap}>
        <button
          type="button"
          onClick={onStop}
          aria-label="Stop recording"
          className={`${CIRCLE_BASE} ${TAP} ${FOCUS} bg-error text-neutral-0`}
        >
          <Icon name="square" size={28} />
        </button>
        <span className="flex items-center gap-8 rounded-full bg-surface px-12 py-8">
          <span className="size-8 rounded-full bg-error" />
          <span className="text-sm font-medium tabular-nums text-neutral-0">Rec {recTime}</span>
        </span>
        <span className="text-xs text-secondary-300">
          These recordings are for practice and we don’t save them
        </span>
      </div>
    );
  }

  if (state === "recorded") {
    return (
      <div className={wrap}>
        <button
          type="button"
          onClick={onPlay}
          aria-label="Play your recording"
          className={`${CIRCLE_BASE} ${TAP} ${FOCUS} border border-neutral-700 bg-neutral-700 text-neutral-0`}
        >
          <Icon name="play" size={28} />
        </button>
        <span className="text-md font-medium text-neutral-0">Tap to play your recording</span>
        <button
          type="button"
          onClick={onReRecord}
          className="flex items-center gap-4 rounded-sm text-sm font-medium text-secondary-300 transition-colors hover:text-secondary-200"
        >
          <Icon name="rotate-ccw" size={16} />
          Re-record
        </button>
      </div>
    );
  }

  if (state === "micDenied") {
    return (
      <div className={wrap}>
        <span className={`${CIRCLE_BASE} border-[1.5px] border-secondary-800 bg-surface text-neutral-0`}>
          <Icon name="mic-off" size={28} />
        </span>
        <span className="text-md font-medium text-neutral-0">Microphone access needed</span>
        <button
          type="button"
          onClick={onEnableMic}
          className="rounded-full border border-secondary-800 px-16 py-8 text-sm font-medium text-neutral-0 transition-colors hover:bg-overlay-white-8"
        >
          Enable microphone
        </button>
      </div>
    );
  }

  // idle
  return (
    <button
      type="button"
      onClick={onMicClick}
      aria-label="Now let's practice — tap to record"
      className={`${wrap} ${TAP} ${FOCUS} rounded-lg`}
    >
      <span className={`${CIRCLE_BASE} border border-neutral-700 bg-neutral-700 text-neutral-0`}>
        <Icon name="mic" size={28} />
      </span>
      <span className="text-md font-medium text-neutral-0">Now let&apos;s practice</span>
    </button>
  );
}
