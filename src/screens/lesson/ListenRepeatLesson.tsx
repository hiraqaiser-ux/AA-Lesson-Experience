/**
 * ListenRepeatLesson — "Listen and repeat" (Lessons - Listen & Repeat).
 * Two phases inside one screen:
 *   1. Listen  — AudioPlayControl ("Tap to listen"). Tapping it plays the verse
 *      with Spotify-style word-by-word highlighting (current word = lime). When
 *      the verse finishes (~2s) the screen switches to the record phase.
 *   2. Record  — MicRecordControl ("Now let's practice"): idle → recording →
 *      recorded (tap to play / re-record).
 * Both controls match the Athan Academy DS components exactly.
 */
import { useEffect, useRef, useState } from "react";
import { LessonLayout } from "../../components/LessonLayout";
import { AudioPlayControl, type AudioPlayState } from "../../components/AudioPlayControl";
import { MicRecordControl, type MicRecordState } from "../../components/MicRecordControl";

const VERSE = "يَوْمَ يُنفَخُ فِى الصُّورِ فَتَأْتُونَ أَفْوَاجًا";
const WORDS = VERSE.split(" ");
const TRANSLIT = "Yawma yunfakhu fiṣ-ṣūri fa-ta'tūna afwājā";
const TRANSLATION = "The Day the Horn is blown and you will come forth in crowds.";

const WORD_MS = 320; // per-word highlight cadence
const WORD_SEC = WORD_MS / 1000;
const TOTAL_SEC = WORDS.length * WORD_SEC; // ≈ 1.9s — record control appears after this

function fmt(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export function ListenRepeatLesson({
  activeId,
  onNavigate,
  onBack,
}: {
  activeId: string;
  onNavigate: (id: string) => void;
  onBack: () => void;
}) {
  const [phase, setPhase] = useState<"listen" | "record">("listen");
  const [audioState, setAudioState] = useState<AudioPlayState>("idle");
  const [elapsed, setElapsed] = useState(0); // seconds into the verse
  const [micState, setMicState] = useState<MicRecordState>("idle");
  const [recSecs, setRecSecs] = useState(0);
  const lastTs = useRef<number | null>(null);
  const recInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Word-highlight ticker — runs while the verse is "playing".
  useEffect(() => {
    if (audioState !== "playing") return;
    lastTs.current = performance.now();
    const id = setInterval(() => {
      const now = performance.now();
      const dt = (now - (lastTs.current ?? now)) / 1000;
      lastTs.current = now;
      setElapsed((e) => e + dt);
    }, 60);
    return () => clearInterval(id);
  }, [audioState]);

  // When the verse finishes, stop and reveal the record control.
  useEffect(() => {
    if (audioState === "playing" && elapsed >= TOTAL_SEC) {
      setAudioState("idle");
      setPhase("record");
    }
  }, [audioState, elapsed]);

  const clearRec = () => recInterval.current && clearInterval(recInterval.current);
  useEffect(() => () => { clearRec(); }, []);

  const toggleListen = () => {
    if (audioState === "playing") {
      setAudioState("idle"); // pause
      return;
    }
    if (elapsed >= TOTAL_SEC) setElapsed(0); // replay from start
    setAudioState("playing");
  };

  const startRecording = () => {
    setMicState("recording");
    setRecSecs(0);
    recInterval.current = setInterval(() => setRecSecs((s) => s + 1), 1000);
  };
  const stopRecording = () => {
    clearRec();
    setMicState("recorded");
  };
  const reRecord = () => {
    setRecSecs(0);
    setMicState("idle");
  };

  // Karaoke colours during the listen phase: spoken + current word = white,
  // upcoming = dimmed white. In the record phase the whole verse stays white.
  const started = audioState === "playing" || elapsed > 0;
  const current =
    phase === "listen" && started
      ? Math.min(WORDS.length - 1, Math.floor(elapsed / WORD_SEC))
      : -1;
  const colorFor = (i: number) => {
    if (phase !== "listen" || current < 0) return "text-neutral-0";
    return i <= current ? "text-neutral-0" : "text-secondary-600";
  };

  return (
    <LessonLayout activeId={activeId} onNavigate={onNavigate} onBack={onBack}>
      <div className="mx-auto flex w-full max-w-[760px] flex-col items-center gap-16 pt-8 text-center">
        <span className="text-xs font-medium uppercase tracking-wide text-secondary-300">
          {phase === "listen" ? "Listen & Repeat" : "Speak & Practice"}
        </span>

        <p dir="rtl" className="font-slab text-[40px] leading-snug">
          {WORDS.map((w, i) => (
            <span
              key={i}
              className={`transition-colors duration-300 ease-out-soft ${colorFor(i)}`}
            >
              {w}
              {i < WORDS.length - 1 ? " " : ""}
            </span>
          ))}
        </p>
        <p className="text-md font-medium text-neutral-0">{TRANSLIT}</p>
        {phase === "listen" && (
          <p className="text-sm italic text-secondary-300">&ldquo;{TRANSLATION}&rdquo;</p>
        )}

        <div className="pt-24">
          {phase === "listen" ? (
            <AudioPlayControl state={audioState} onClick={toggleListen} />
          ) : (
            <MicRecordControl
              state={micState}
              recTime={fmt(recSecs)}
              onMicClick={startRecording}
              onStop={stopRecording}
              onReRecord={reRecord}
            />
          )}
        </div>
      </div>
    </LessonLayout>
  );
}
