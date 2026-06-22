/** EmojiPicker — small popover grid of common emojis. Calls onPick with the glyph. */
const EMOJIS = [
  "😀", "😂", "🙂", "😍", "😎", "🤔", "👍", "🙏",
  "🎉", "🔥", "💚", "❤️", "✨", "🌟", "👏", "💪",
  "📚", "✅", "🙌", "😅", "😢", "🤝", "🕌", "☪️",
];

export function EmojiPicker({ onPick }: { onPick: (emoji: string) => void }) {
  return (
    <div className="grid grid-cols-8 gap-4 rounded-md border border-secondary-800 bg-secondary-1000 p-8 shadow-xl">
      {EMOJIS.map((e) => (
        <button
          key={e}
          type="button"
          onClick={() => onPick(e)}
          className="grid size-32 place-items-center rounded-sm text-xl transition-colors hover:bg-overlay-white-8"
          aria-label={`Add ${e}`}
        >
          {e}
        </button>
      ))}
    </div>
  );
}
