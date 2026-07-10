/** CommentComposer — the comment input (with emoji). Locked ("Enroll to join…") for visitors.
 *  When `mentionables` is provided, typing `@` opens a student autocomplete
 *  (↑/↓ to move, Enter/Tab to insert, Esc to dismiss) that inserts `@handle`. */
import { useMemo, useRef, useState } from "react";
import { Icon } from "../Icon";
import { EmojiPicker } from "./EmojiPicker";
import { Avatar } from "./DiscussionParts";
import { MAX_TEXT_LENGTH, type Mentionable } from "../../data/discussions";

export function CommentComposer({
  enrolled,
  value,
  onChange,
  onSend,
  onLockedClick,
  mentionables,
}: {
  enrolled: boolean;
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onLockedClick: () => void;
  /** People who can be @mentioned. When present, enables the autocomplete. */
  mentionables?: Mentionable[];
}) {
  const [showEmoji, setShowEmoji] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [mentionOpen, setMentionOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);

  const matches = useMemo(() => {
    if (!mentionables || !mentionOpen) return [];
    const q = query.toLowerCase();
    return mentionables
      .filter((m) => m.name.toLowerCase().includes(q) || m.handle.toLowerCase().includes(q))
      .slice(0, 6);
  }, [mentionables, mentionOpen, query]);

  /** Detect a `@token` immediately before the caret and open/close the menu. */
  const syncMention = (next: string) => {
    if (!mentionables) return;
    const el = inputRef.current;
    const caret = el?.selectionStart ?? next.length;
    const m = next.slice(0, caret).match(/@(\w*)$/);
    if (m) {
      setMentionOpen(true);
      setQuery(m[1]);
      setActiveIdx(0);
    } else {
      setMentionOpen(false);
    }
  };

  const handleChange = (next: string) => {
    onChange(next);
    syncMention(next);
  };

  const insertMention = (item: Mentionable) => {
    const el = inputRef.current;
    const caret = el?.selectionStart ?? value.length;
    const before = value.slice(0, caret).replace(/@(\w*)$/, `@${item.handle} `);
    const after = value.slice(caret);
    onChange(before + after);
    setMentionOpen(false);
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(before.length, before.length);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (mentionOpen && matches.length) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => (i + 1) % matches.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => (i - 1 + matches.length) % matches.length);
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        insertMention(matches[activeIdx]);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setMentionOpen(false);
        return;
      }
    }
    if (e.key === "Enter") onSend();
  };

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
    <div className="relative w-full">
      {/* @mention autocomplete */}
      {matches.length > 0 && (
        <ul
          role="listbox"
          aria-label="Mention a student"
          className="absolute bottom-full left-0 z-50 mb-8 max-h-[220px] w-full max-w-[320px] overflow-y-auto rounded-md border border-secondary-800 bg-popup-bg p-4 shadow-xl"
        >
          {matches.map((m, i) => (
            <li key={m.id}>
              <button
                type="button"
                role="option"
                aria-selected={i === activeIdx}
                onMouseEnter={() => setActiveIdx(i)}
                onClick={() => insertMention(m)}
                className={`flex w-full items-center gap-12 rounded-sm px-12 py-8 text-left transition-colors ${
                  i === activeIdx ? "bg-overlay-white-8" : "hover:bg-overlay-white-8"
                }`}
              >
                <Avatar initials={m.initials} color={m.color} size={28} />
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-md text-neutral-0">{m.name}</span>
                  <span className="truncate text-sm text-secondary-400">@{m.handle}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex w-full items-center gap-12 rounded-sm border border-secondary-600 bg-background p-16">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={MAX_TEXT_LENGTH}
          placeholder={mentionables ? "Write a comment" : "Write your comment"}
          className="min-w-0 flex-1 bg-transparent text-md text-secondary-200 outline-none placeholder:text-secondary-600"
        />
        <span className="shrink-0 text-sm tabular-nums text-secondary-500">
          {value.length}/{MAX_TEXT_LENGTH}
        </span>
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
    </div>
  );
}
