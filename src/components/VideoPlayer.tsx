import { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";
import { Icon } from "./Icon";
import pauseAnimation from "../assets/pause-animation.json";

const DURATION = 321; // 5:21 in seconds

function fmt(s: number): string {
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  return `${m}:${String(ss).padStart(2, "0")}`;
}

/**
 * Video surface with a WORKING play/pause + control bar (presentational).
 * Playing advances the seek bar and time; pausing freezes them. The center
 * button shows the Lottie pause animation while playing (per Figma) and the
 * play icon when paused. Fixed video size: 1042 × 480.
 */
export function VideoPlayer({ onTimeUpdate }: { onTimeUpdate?: (sec: number) => void }) {
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(9); // starts at 0:09
  const last = useRef<number | null>(null);

  // Report playback position so callers (e.g. the transcript) can follow along.
  useEffect(() => {
    onTimeUpdate?.(elapsed);
  }, [elapsed, onTimeUpdate]);

  useEffect(() => {
    if (!playing) return;
    last.current = performance.now();
    const id = setInterval(() => {
      const now = performance.now();
      const dt = (now - (last.current ?? now)) / 1000;
      last.current = now;
      setElapsed((e) => {
        const next = e + dt;
        if (next >= DURATION) {
          setPlaying(false);
          return DURATION;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(id);
  }, [playing]);

  const pct = (elapsed / DURATION) * 100;
  const toggle = () => {
    if (elapsed >= DURATION) setElapsed(0);
    setPlaying((p) => !p);
  };

  return (
    <div
      className="relative mx-auto aspect-[1042/480] w-full max-w-[1042px] overflow-hidden rounded-md bg-neutral-1000 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/lesson-video-poster.png')" }}
    >
      {/* center play / pause — translucent white circle (per Figma) */}
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause" : "Play"}
        className="absolute left-1/2 top-1/2 flex h-64 w-64 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-overlay-white-12 text-neutral-0 backdrop-blur-sm transition-transform duration-micro ease-in-out-soft hover:scale-105 active:scale-95"
      >
        {playing ? (
          <Lottie animationData={pauseAnimation} loop style={{ width: 34, height: 34 }} />
        ) : (
          <Icon name="play" size={28} />
        )}
      </button>

      {/* seek bar */}
      <div className="absolute inset-x-16 bottom-48 h-4 overflow-hidden rounded-full bg-overlay-white-40">
        <div className="h-full rounded-full bg-primary-500" style={{ width: `${pct}%` }} />
      </div>

      {/* controls — secondary controls collapse on small screens to avoid overflow */}
      <div
        className="absolute inset-x-0 bottom-0 flex items-center gap-12 px-12 py-12 text-neutral-0 sm:gap-16 sm:px-16"
        style={{ backgroundColor: "var(--c-overlay-black-55)" }}
      >
        <button onClick={toggle} aria-label={playing ? "Pause" : "Play"}>
          <Icon name={playing ? "pause" : "play"} size={20} />
        </button>
        <Icon name="volume" size={20} />
        <Icon name="rewind" size={20} className="hidden sm:block" />
        <span className="text-sm tabular-nums">
          {fmt(elapsed)} / {fmt(DURATION)}
        </span>
        <Icon name="forward" size={20} className="hidden sm:block" />
        <span className="flex-1" />
        <span className="hidden text-sm font-medium sm:block">1x</span>
        <Icon name="settings" size={20} className="hidden sm:block" />
        <Icon name="maximize" size={20} />
      </div>
    </div>
  );
}
