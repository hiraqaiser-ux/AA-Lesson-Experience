/**
 * PostComposer — rich "create a post" composer: text + image upload + emoji.
 * Used inline at the top of the Discussions feed (desktop) and inside the
 * mobile create-post bottom sheet. Calls onSubmit(text, imageUrl?).
 */
import { useState } from "react";
import { Icon } from "../Icon";
import { ComposerTools } from "./ComposerTools";
import { MAX_TEXT_LENGTH } from "../../data/discussions";

export function PostComposer({
  onSubmit,
  autoFocus = false,
  placeholder = "Start a discussion",
}: {
  onSubmit: (text: string, imageUrl?: string) => void;
  autoFocus?: boolean;
  placeholder?: string;
}) {
  const [value, setValue] = useState("");
  const [image, setImage] = useState<{ url: string; name: string } | null>(null);

  const canSend = !!value.trim() || !!image;

  const attach = (file?: File) => {
    if (!file) return;
    setImage((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return { url: URL.createObjectURL(file), name: file.name };
    });
  };
  const removeImage = () =>
    setImage((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return null;
    });

  const send = () => {
    if (!canSend) return;
    onSubmit(value.trim(), image?.url);
    setValue("");
    setImage(null);
  };

  return (
    <div className="flex w-full flex-col gap-12 rounded-md border-2 border-secondary-900 p-12">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus={autoFocus}
        rows={2}
        maxLength={MAX_TEXT_LENGTH}
        placeholder={placeholder}
        className="min-h-[44px] w-full resize-none bg-transparent text-lg text-neutral-0 outline-none placeholder:text-neutral-400"
      />

      {image && (
        <div className="relative w-fit">
          <img src={image.url} alt="" className="max-h-[160px] rounded-md object-cover" />
          <button
            type="button"
            onClick={removeImage}
            aria-label="Remove image"
            className="absolute right-8 top-8 grid size-28 place-items-center rounded-full bg-overlay-black-70 text-neutral-0"
          >
            <Icon name="x" size={14} />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <ComposerTools onAddEmoji={(e) => setValue((v) => v + e)} onPickImage={attach} />

        <div className="flex items-center gap-12">
          <span className="text-sm tabular-nums text-secondary-500">
            {value.length}/{MAX_TEXT_LENGTH}
          </span>
          <button
          type="button"
          onClick={send}
          aria-label="Post"
          disabled={!canSend}
          className={[
            "grid size-40 shrink-0 place-items-center rounded-full transition-colors",
            canSend
              ? "bg-primary-500 text-secondary-1000 hover:bg-primary-400"
              : "cursor-not-allowed bg-neutral-600 text-neutral-0",
          ].join(" ")}
        >
          <Icon name="arrow-up" size={20} />
        </button>
        </div>
      </div>
    </div>
  );
}
