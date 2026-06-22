/**
 * AssignmentLesson — Image & Audio assignment screens with a working flow:
 *  student writes an answer → teacher replies with a (functional) audio message
 *  → teacher marks the assignment complete → student is notified via the
 *  completion header (Lottie upload-complete animation).
 *
 * Header, instructions/media, chat thread and composer share one centered
 * 720px column so their widths line up (per design).
 */
import { useEffect, useRef, useState } from "react";
import { LessonLayout } from "../../components/LessonLayout";
import { ResponseInput, ResponseInputState } from "../../components/ResponseInput";
import { ChatMessage } from "../../components/chat/ChatMessage";
import { AudioMessage } from "../../components/chat/AudioMessage";
import { Icon } from "../../components/Icon";
import { getLesson } from "../../data/lessons";

// Assignment content spans the full width of the main column (per design).
// Assignment header / content / composer share one left-aligned 70% column on
// desktop (full width on mobile); the Next button sits to the right of it.
const COL = "w-full lg:w-[70%]";

interface Msg {
  id: number;
  sender: "student" | "teacher";
  name: string;
  time: string;
  kind: "text" | "audio" | "image";
  text?: string;
  durationSec?: number;
  imageUrl?: string;
}

function fmt(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

export function AssignmentLesson({
  activeId,
  onNavigate,
  onBack,
}: {
  activeId: string;
  onNavigate: (id: string) => void;
  onBack: () => void;
}) {
  const lesson = getLesson(activeId);
  const isAudio = lesson?.icon === "audio-waveform";

  const [value, setValue] = useState("");
  const [composerState, setComposerState] = useState<ResponseInputState>("default");
  const [recSecs, setRecSecs] = useState(0);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [completed, setCompleted] = useState(false);
  const [attachment, setAttachment] = useState<{ url: string; name: string } | null>(null);
  const nextId = useRef(1);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const attachImage = (file: File) => {
    setAttachment((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return { url: URL.createObjectURL(file), name: file.name };
    });
  };

  const removeAttachment = () => {
    setAttachment((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return null;
    });
  };

  const eyebrow = isAudio ? "ASSIGNMENT · AUDIO" : "ASSIGNMENT · IMAGE";
  // Image assignment's screen heading differs from its sidebar lesson name
  // ("Describe what you see") per design — the heading reads "Read what you see".
  const title = isAudio ? lesson?.title ?? "Submit your recitation" : "Read what you see";
  const instructions = isAudio
    ? "Read the passage below and record yourself reciting it with correct Tajweed."
    : "Look closely at the image and describe what you see in Arabic. Mention at least three things.";
  // Arabic passage the learner recites (audio assignment) — shown inside the
  // Instructions card per Figma frame 42721:54407.
  const versePassage = isAudio
    ? "ابطترسا ھ ج ک ل ج ف ئ ت ی ہپ پ ل ک ھ ر ت ع و ا د ا  ابطترسا ھ ج ک ل ج ف ئ ت ی ہپ پ ل ک ھ ر ت ع و ا د ا ابطترسا ھ ج ک ل ج ف ئ ت ی ہپ پ ل ک ھ ر ت ع و ا د ا  ابطترسا ھ ج ک ل ج ف ئ ت ی."
    : undefined;

  const add = (m: Omit<Msg, "id">) => setMessages((p) => [...p, { ...m, id: nextId.current++ }]);

  const handleSend = (text: string) => {
    const caption = text.trim();
    if (completed || (!caption && !attachment)) return;
    if (attachment) {
      // Image submission — the message takes ownership of the object URL, so we
      // clear the pending attachment WITHOUT revoking it (the bubble still uses it).
      add({
        sender: "student",
        name: "Usman",
        time: "Just now",
        kind: "image",
        imageUrl: attachment.url,
        text: caption || undefined,
      });
      setAttachment(null);
    } else {
      add({ sender: "student", name: "Usman", time: "Just now", kind: "text", text: caption });
    }
    setValue("");
    // Teacher replies with an audio message, then marks the assignment complete.
    timers.current.push(
      setTimeout(
        () =>
          add({
            sender: "teacher",
            name: "Abdul Haseeb",
            time: "Just now",
            kind: "audio",
            durationSec: 50,
          }),
        1300
      )
    );
    timers.current.push(setTimeout(() => setCompleted(true), 3600));
  };

  return (
    <LessonLayout
      activeId={activeId}
      onNavigate={onNavigate}
      onBack={onBack}
      variant="assignment"
      header={
        <>
          {completed && (
            <div className="animate-banner-in -mx-24 -mt-24 mb-24 flex items-center justify-center gap-12 bg-overlay-success px-16 pb-16 pt-12">
              {/* Lime check chip — pops in with a gentle overshoot (check-pop),
                  sequenced just after the banner slides in. */}
              <span
                className="animate-check-pop grid size-20 shrink-0 place-items-center rounded-full bg-primary-500"
                style={{ animationDelay: "180ms" }}
              >
                <Icon name="check" size={12} className="text-secondary-800" />
              </span>
              <span className="text-sm font-medium text-neutral-0">
                This assignment is marked complete!
              </span>
            </div>
          )}
          <div className={`${COL} flex items-start justify-between gap-16`}>
            <div className="flex flex-col gap-8">
              <span className="text-xs font-medium uppercase tracking-wide text-secondary-300">
                {eyebrow}
              </span>
              <h1 className="text-xl font-semibold text-neutral-0">{title}</h1>
            </div>
            <button
              type="button"
              className="shrink-0 rounded-full border border-secondary-800 px-16 py-8 text-sm font-medium text-neutral-0 hover:bg-overlay-white-8"
            >
              Feedback
            </button>
          </div>
        </>
      }
      action={
        <ResponseInput
          className="w-full"
          placeholder="Write your answer here…"
          value={value}
          onChange={setValue}
          onSend={handleSend}
          attachmentPreview={attachment?.url}
          onAttachImage={attachImage}
          onRemoveAttachment={removeAttachment}
          onRecord={() => {
            setRecSecs(0);
            setComposerState("recording");
          }}
          onStopRecording={() => {
            add({ sender: "student", name: "Usman", time: "Just now", kind: "audio", durationSec: Math.max(3, recSecs) });
            setComposerState("default");
          }}
          recordingTime={fmt(recSecs)}
          state={composerState === "recording" ? "recording" : undefined}
        />
      }
    >
      <div className="flex w-full flex-col gap-16 lg:w-[70%]">
        {/* Instructions */}
        <div className="flex flex-col gap-8 rounded-md bg-secondary-950 p-16">
          <span className="text-sm font-medium text-secondary-300">Instructions</span>
          <p className="text-md text-text-primary">{instructions}</p>
          {versePassage && (
            <p
              dir="rtl"
              lang="ur"
              className="text-right text-lg-2 font-semibold leading-[40px] text-neutral-0"
            >
              {versePassage}
            </p>
          )}
        </div>

        {/* Assignment media — the passage image (audio: 234×110 per frame, image: 390 wide) */}
        {isAudio ? (
          <img
            src="/assignment-arabic.png"
            alt="Passage to recite"
            className="h-[110px] w-[234px] max-w-full rounded-sm object-cover"
          />
        ) : (
          <img
            src="/assignment-arabic.png"
            alt="Arabic text to describe"
            className="w-full max-w-[390px] rounded-md"
          />
        )}

        {/* Conversation */}
        {messages.length > 0 && (
          <div className="flex flex-col gap-20 pt-8">
            <div className="flex justify-center px-12 py-4">
              <span className="text-xs font-medium text-secondary-200">10/24/2023 3:30pm</span>
            </div>
            {messages.map((m) => (
              <ChatMessage
                key={m.id}
                sender={m.sender}
                name={m.name}
                time={m.time}
                showTeacherBadge={m.sender === "teacher"}
              >
                {m.kind === "text" && <span>{m.text}</span>}
                {m.kind === "audio" && <AudioMessage durationSec={m.durationSec ?? 10} />}
                {m.kind === "image" && (
                  <div className="flex flex-col gap-8">
                    <img
                      src={m.imageUrl}
                      alt="Submitted attachment"
                      className="max-w-[280px] rounded-md"
                    />
                    {m.text && <span>{m.text}</span>}
                  </div>
                )}
              </ChatMessage>
            ))}
          </div>
        )}
      </div>
    </LessonLayout>
  );
}
