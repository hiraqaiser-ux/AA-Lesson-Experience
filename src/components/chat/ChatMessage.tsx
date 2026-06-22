/**
 * ChatMessage
 *
 * Wrapper for one message in the assignment thread. Handles:
 *  • Alignment (teacher = left/incoming, student = right/outgoing)
 *  • Sender row (name, optional Teacher badge, timestamp)
 *  • Bubble styling (incoming = Secondary/950, outgoing = Secondary/800)
 *  • Entrance animation (animate-message-in) on mount
 *
 * Brand-only palette. Distinction is by tone + alignment, not status color.
 */
import type { ReactNode } from "react";

export type MessageSender = "teacher" | "student";

export interface ChatMessageProps {
  sender: MessageSender;
  name: string;
  time: string;
  /** Show the lime "Teacher" badge next to the name */
  showTeacherBadge?: boolean;
  children: ReactNode;
}

function TeacherBadge() {
  return (
    <span className="inline-flex items-center gap-4 rounded-full bg-secondary-1000 px-8 py-4">
      <span className="size-4 rounded-full bg-primary-500" />
      <span className="text-xs font-medium text-primary-500">Teacher</span>
    </span>
  );
}

export function ChatMessage({
  sender,
  name,
  time,
  showTeacherBadge = false,
  children,
}: ChatMessageProps) {
  const isStudent = sender === "student";

  return (
    <div
      className={[
        "animate-message-in flex w-full flex-col gap-8",
        isStudent ? "items-end" : "items-start",
      ].join(" ")}
    >
      {/* Sender row — the learner's own name is not shown (only the time) */}
      <div className="flex items-center gap-8">
        {!isStudent && <span className="text-sm font-semibold text-text-primary">{name}</span>}
        {showTeacherBadge && <TeacherBadge />}
        <span className="text-xs text-neutral-600">{time}</span>
      </div>

      {/* Bubble */}
      <div
        className={[
          "max-w-[440px] px-16 py-12 text-sm leading-6",
          isStudent
            ? "bg-secondary-800 text-neutral-0 rounded-[12px] rounded-br-[4px]"
            : "bg-secondary-950 text-text-primary rounded-[12px] rounded-tl-[4px]",
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
}
