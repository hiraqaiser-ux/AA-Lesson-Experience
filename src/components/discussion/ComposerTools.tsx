/**
 * ComposerTools — the image-upload + emoji-picker controls shared by the
 * create-post composer and the edit-post dialog. Renders two icon buttons and
 * an emoji popover; the parent owns the text and image state.
 */
import { useRef, useState } from "react";
import { Icon } from "../Icon";
import { EmojiPicker } from "./EmojiPicker";

export function ComposerTools({
  onAddEmoji,
  onPickImage,
}: {
  onAddEmoji: (emoji: string) => void;
  onPickImage: (file: File) => void;
}) {
  const [showEmoji, setShowEmoji] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative flex items-center gap-4">
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        aria-label="Add image"
        className="grid size-36 place-items-center rounded-full text-secondary-300 transition-colors hover:bg-overlay-white-8 hover:text-neutral-0"
      >
        <Icon name="image" size={20} />
      </button>
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
        <div className="absolute bottom-full left-0 z-50 mb-8">
          <EmojiPicker
            onPick={(e) => {
              onAddEmoji(e);
              setShowEmoji(false);
            }}
          />
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPickImage(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
