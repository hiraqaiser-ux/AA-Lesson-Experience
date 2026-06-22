/**
 * AssignmentConversation
 *
 * Interactive, animated student assignment thread. Demonstrates the three
 * motion targets:
 *   1. Message send & appear  — new bubbles rise + fade in (animate-message-in),
 *      composer clears, thread auto-scrolls to the newest message.
 *   2. Audio play / record    — AudioMessage play/progress; mic recording state
 *      (pulsing dot + timer) in the composer, producing a student audio reply.
 *   3. Submit → complete       — submit reveals the CompletionBanner (rise + fade)
 *      with a popping check.
 *
 * Brand-only palette, DS tokens, 4px grid.
 */
import { useEffect, useRef, useState } from "react";
import { ResponseInput, ResponseInputState } from "../components/ResponseInput";
import { ChatMessage } from "../components/chat/ChatMessage";
import { AudioMessage } from "../components/chat/AudioMessage";
import { CompletionBanner } from "../components/chat/CompletionBanner";

interface Msg {
  id: number;
  sender: "teacher" | "student";
  name: string;
  time: string;
  kind: "text" | "audio";
  text?: string;
  durationSec?: number;
  showTeacherBadge?: boolean;
}

const SEED: Msg[] = [
  {
    id: 1,
    sender: "teacher",
    name: "Abdul Haseeb",
    time: "Oct 24, 3:30 PM",
    kind: "text",
    text: "Please complete your assignment — describe the image in Arabic.",
    showTeacherBadge: true,
  },
  {
    id: 2,
    sender: "teacher",
    name: "Abdul Haseeb",
    time: "Oct 24, 3:30 PM",
    kind: "audio",
    durationSec: 50,
    showTeacherBadge: true,
  },
];

function fmt(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export function AssignmentConversation() {
  const [messages, setMessages] = useState<Msg[]>(SEED);
  const [value, setValue] = useState("");
  const [composerState, setComposerState] = useState<ResponseInputState>("default");
  const [recSecs, setRecSecs] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const nextId = useRef(SEED.length + 1);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to newest message / banner
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, submitted]);

  // Recording timer
  useEffect(() => {
    if (composerState !== "recording") return;
    const id = setInterval(() => setRecSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [composerState]);

  const addMessage = (m: Omit<Msg, "id">) =>
    setMessages((prev) => [...prev, { ...m, id: nextId.current++ }]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    addMessage({ sender: "student", name: "Amnah Amir", time: "Just now", kind: "text", text });
    setValue("");
  };

  const handleRecord = () => {
    setRecSecs(0);
    setComposerState("recording");
  };

  const handleStop = () => {
    addMessage({
      sender: "student",
      name: "Amnah Amir",
      time: "Just now",
      kind: "audio",
      durationSec: Math.max(3, recSecs),
    });
    setComposerState("default");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-[760px] flex-col gap-24 px-24 py-32">
        {/* Assignment header (context) */}
        <header className="flex flex-col gap-8">
          <span className="text-xs font-medium tracking-wide text-secondary-300">
            ASSIGNMENT · IMAGE
          </span>
          <h1 className="text-xl font-semibold text-neutral-0">Describe what you see</h1>
        </header>

        {/* Thread */}
        <div className="flex flex-col gap-20">
          {/* Conversation started divider */}
          <div className="flex justify-center">
            <span className="rounded-full bg-secondary-950 px-12 py-4 text-xs text-secondary-300">
              Conversation Started{" "}
              <span className="font-medium text-secondary-200">10/24/2023 3:30pm</span>
            </span>
          </div>

          {messages.map((m) => (
            <ChatMessage
              key={m.id}
              sender={m.sender}
              name={m.name}
              time={m.time}
              showTeacherBadge={m.showTeacherBadge}
            >
              {m.kind === "text" ? (
                <span>{m.text}</span>
              ) : (
                <AudioMessage durationSec={m.durationSec ?? 10} />
              )}
            </ChatMessage>
          ))}

          {submitted && <CompletionBanner />}

          <div ref={bottomRef} />
        </div>

        {/* Composer + submit (hidden once submitted) */}
        {!submitted && (
          <div className="flex flex-col gap-12">
            <ResponseInput
              placeholder="Write your answer in English or Arabic…"
              value={value}
              onChange={setValue}
              onSend={handleSend}
              onAttach={() => alert("Attach file")}
              onRecord={handleRecord}
              onStopRecording={handleStop}
              recordingTime={fmt(recSecs)}
              state={composerState === "recording" ? "recording" : undefined}
            />
            <button
              type="button"
              onClick={() => setSubmitted(true)}
              className={[
                "self-end rounded-full px-24 py-12 text-sm font-semibold transition-all duration-micro ease-in-out-soft",
                "bg-primary-500 text-secondary-1000 hover:bg-primary-400 active:scale-95",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300",
              ].join(" ")}
            >
              Submit assignment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
