/** CommentComposer — the comment input (with emoji). Locked ("Enroll to join…") for visitors. */
import { useState } from "react";
import { Icon } from "../Icon";
import { EmojiPicker } from "./EmojiPicker";

export function CommentComposer({
  enrolled,
  value,
  onChange,
  onSend,
  onLockedClick,
}: {
  enrolled: boolean;
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onLockedClick: () => void;
}) {
  const [showEmoji, setShowEmoji] = useState(false);
  if (!enrolled) {
    return (
      <button
        type="button"
        onClick={onLockedClick}
        className="flex w-full items-center gap-12 rounded-sm border border-secondary-600 bg-background p-16 text-left"
      >
        <Icon name="lock" size={18} className="shrink-0 text-secondary-500" />
        <span className="min-w-0 flex-1 text-md text-secondary-600">
          Enroll to join the conversation
        </span>
        <span className="grid size-36 shrink-0 place-items-center rounded-full bg-secondary-800 text-secondary-600">
          <Icon name="arrow-up" size={20} />
        </span>
      </button>
    );
  }

  return (
    <div className="flex w-full items-center gap-12 rounded-sm border border-secondary-600 bg-background p-16">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSend()}
        placeholder="Write your comment"
        className="min-w-0 flex-1 bg-transparent text-md text-secondary-200 outline-none placeholder:text-secondary-600"
      />
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={() => setShowEmoji((s) => !s)}
          aria-label="Add emoji"
          aria-expanded={showEmoji}
          className="grid size-36 place-items-center rounded-full text-secondary-300 transition-colors hover:bg-overlay-white-8 hover:text-neutral-0"
        >
          <Icon name="smile" size={20} />
        </button>
        {showEmoji && (
          <div className="absolute bottom-full right-0 z-50 mb-8">
            <EmojiPicker
              onPick={(e) => {
                onChange(value + e);
                setShowEmoji(false);
              }}
            />
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={onSend}
        aria-label="Send comment"
        disabled={!value.trim()}
        className={[
          "grid size-36 shrink-0 place-items-center rounded-full transition-colors",
          value.trim()
            ? "bg-primary-500 text-secondary-1000 hover:bg-primary-400"
            : "cursor-not-allowed bg-secondary-800 text-secondary-600",
        ].join(" ")}
      >
        <Icon name="arrow-up" size={20} />
      </button>
    </div>
  );
}
