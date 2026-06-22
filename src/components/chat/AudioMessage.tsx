/**
 * AudioMessage
 *
 * Audio player used inside chat bubbles. Animates:
 *  • Play ⇄ Pause toggle (micro transition on the button)
 *  • Progress fill + knob advancing in real time (requestAnimationFrame)
 *  • Elapsed timer counting up
 *
 * Brand-only palette: lime Primary for play/progress, slate Secondary for the
 * track. No status colors. All tokens, all 4px grid.
 */
import { useEffect, useRef, useState } from "react";
import { Icon } from "../Icon";

export interface AudioMessageProps {
  /** Total clip length in seconds */
  durationSec: number;
}

function fmt(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export function AudioMessage({ durationSec }: AudioMessageProps) {
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const lastRef = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) return;
    lastRef.current = performance.now();
    // Interval + timestamp delta — advances even when rAF is throttled
    // (backgrounded/headless tabs), while staying smooth enough for a bar.
    const id = setInterval(() => {
      const now = performance.now();
      const dt = (now - (lastRef.current ?? now)) / 1000;
      lastRef.current = now;
      setElapsed((e) => {
        const next = e + dt;
        if (next >= durationSec) {
          setPlaying(false);
          return durationSec;
        }
        return next;
      });
    }, 50);
    return () => clearInterval(id);
  }, [playing, durationSec]);

  const pct = Math.min(1, elapsed / durationSec);

  const toggle = () => {
    if (elapsed >= durationSec) setElapsed(0); // restart when finished
    setPlaying((p) => !p);
  };

  return (
    <div className="flex items-center gap-12">
      {/* Play / Pause */}
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause audio" : "Play audio"}
        className={[
          // Design: translucent white-12 fill + neutral-700 hairline border, light glyph.
          "grid place-items-center size-28 shrink-0 rounded-full",
          "border border-neutral-700 bg-overlay-white-12 text-neutral-0",
          "transition-transform duration-micro ease-in-out-soft",
          "hover:scale-105 active:scale-90",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300",
        ].join(" ")}
      >
        <Icon name={playing ? "pause" : "play"} size={14} />
      </button>

      {/* Track + timer */}
      <div className="flex flex-col gap-4 w-[210px]">
        <div className="relative h-16 flex items-center">
          {/* base track */}
          <div className="absolute inset-x-0 h-4 rounded-full bg-secondary-600" />
          {/* filled portion */}
          <div
            className="absolute left-0 h-4 rounded-full bg-primary-500"
            style={{ width: `${pct * 100}%` }}
          />
          {/* knob */}
          <div
            className="absolute size-12 rounded-full bg-primary-500"
            style={{ left: `calc(${pct * 100}% - 6px)` }}
          />
        </div>
        <span className="text-xs tabular-nums text-secondary-300">
          {fmt(playing || elapsed > 0 ? elapsed : durationSec)}
        </span>
      </div>
    </div>
  );
}
