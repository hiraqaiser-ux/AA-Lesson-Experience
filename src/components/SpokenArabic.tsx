/**
 * SpokenArabic — Arabic text with Spotify-style karaoke highlighting.
 * Click play and the words/letters highlight one-by-one as they are "spoken":
 *   • already spoken → white
 *   • current word   → lime (Primary/500)
 *   • upcoming       → dimmed (Secondary/600)
 * Before playing, all words are white (readable). Play/pause is fully working.
 */
import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

export function SpokenArabic({
  words,
  size = 40,
  wordMs = 700,
}: {
  words: string[];
  size?: number;
  wordMs?: number;
}) {
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0); // seconds
  const last = useRef<number | null>(null);

  const wordSec = wordMs / 1000;
  const total = words.length * wordSec;

  // Timestamp-based ticker (advances even when backgrounded).
  useEffect(() => {
    if (!playing) return;
    last.current = performance.now();
    const id = setInterval(() => {
      const now = performance.now();
      const dt = (now - (last.current ?? now)) / 1000;
      last.current = now;
      setElapsed((e) => e + dt);
    }, 60);
    return () => clearInterval(id);
  }, [playing]);

  // Stop once every word has been spoken.
  useEffect(() => {
    if (playing && elapsed >= total) setPlaying(false);
  }, [playing, elapsed, total]);

  const started = playing || elapsed > 0;
  const current = started ? Math.min(words.length - 1, Math.floor(elapsed / wordSec)) : -1;

  const toggle = () => {
    if (playing) {
      setPlaying(false);
    } else {
      if (elapsed >= total) setElapsed(0);
      setPlaying(true);
    }
  };

  // Karaoke colours: spoken + current word = white, upcoming = dimmed white.
  const colorFor = (i: number) => {
    if (current < 0) return "text-neutral-0"; // before play: all readable
    return i <= current ? "text-neutral-0" : "text-secondary-600";
  };

  return (
    <div className="flex flex-col items-center gap-16">
      <p dir="rtl" className="text-center font-slab leading-snug" style={{ fontSize: size }}>
        {words.map((w, i) => (
          <span key={i} className={`transition-colors duration-300 ease-out-soft ${colorFor(i)}`}>
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </p>

      {/* Plain green play/pause icon (no circle) */}
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause" : "Play"}
        className="text-primary-400 transition-transform duration-micro ease-in-out-soft hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 rounded-sm"
      >
        <span key={playing ? "pause" : "play"} className="animate-fade-in block">
          <Icon name={playing ? "pause" : "video"} size={28} />
        </span>
      </button>
    </div>
  );
}
