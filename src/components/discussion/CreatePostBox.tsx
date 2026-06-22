/**
 * CreatePostBox — "create a post" composer shown at the top of the discussion.
 * Visitor: locked "🔒 Enroll to join the conversation" (Figma 43010:32973).
 * Enrolled: a real input that posts a new discussion to the top of the feed.
 */
import { useState } from "react";
import { Icon } from "../Icon";

export function CreatePostBox({
  enrolled,
  onCreate,
  onRequireEnroll,
}: {
  enrolled: boolean;
  onCreate: (text: string) => void;
  onRequireEnroll: () => void;
}) {
  const [value, setValue] = useState("");

  if (!enrolled) {
    return (
      <button
        type="button"
        onClick={onRequireEnroll}
        className="flex w-full items-center justify-between gap-12 rounded-md border-2 border-secondary-900 p-12 text-left"
      >
        <span className="text-lg text-neutral-400">🔒 Enroll to join the conversation</span>
        <span className="grid size-40 shrink-0 place-items-center rounded-full bg-secondary-800 text-secondary-500">
          <Icon name="arrow-right" size={20} />
        </span>
      </button>
    );
  }

  const send = () => {
    const text = value.trim();
    if (!text) return;
    onCreate(text);
    setValue("");
  };

  return (
    <div className="flex w-full items-center gap-12 rounded-md border-2 border-secondary-900 p-12">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
        placeholder="Start a discussion"
        className="min-w-0 flex-1 bg-transparent text-lg text-neutral-0 outline-none placeholder:text-neutral-400"
      />
      <button
        type="button"
        onClick={send}
        aria-label="Post"
        disabled={!value.trim()}
        className={[
          "grid size-40 shrink-0 place-items-center rounded-full transition-colors",
          value.trim()
            ? "bg-primary-500 text-secondary-1000 hover:bg-primary-400"
            : "cursor-not-allowed bg-neutral-600 text-neutral-0",
        ].join(" ")}
      >
        <Icon name="arrow-up" size={20} />
      </button>
    </div>
  );
}
