/**
 * Discussion post dialogs — Edit, Delete (confirmation) and Report. Each renders
 * as a centered Dialog on desktop and a bottom sheet on mobile (ResponsiveModal).
 */
import { useState } from "react";
import { ResponsiveModal } from "../ResponsiveModal";
import { ComposerTools } from "./ComposerTools";
import { Icon } from "../Icon";

const PRIMARY_BTN =
  "flex h-44 items-center justify-center rounded-full bg-primary-500 px-24 text-md font-semibold text-secondary-1000 transition-colors hover:bg-primary-400 disabled:cursor-not-allowed disabled:opacity-40";
const GHOST_BTN =
  "flex h-44 items-center justify-center rounded-full bg-secondary-800 px-24 text-md font-semibold text-neutral-0 transition-colors hover:bg-secondary-700";
const DANGER_BTN =
  "flex h-44 items-center justify-center rounded-full bg-error px-24 text-md font-semibold text-neutral-0 transition-colors hover:opacity-90";

/** Edit — textarea pre-filled with the body, plus image + emoji support. */
export function EditPostDialog({
  initialText,
  initialImageUrl,
  onSave,
  onClose,
  title = "Edit post",
}: {
  initialText: string;
  initialImageUrl?: string;
  onSave: (text: string, imageUrl?: string) => void;
  onClose: () => void;
  title?: string;
}) {
  const [text, setText] = useState(initialText);
  const [image, setImage] = useState<{ url: string } | null>(
    initialImageUrl ? { url: initialImageUrl } : null
  );

  return (
    <ResponsiveModal onClose={onClose} title={title}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        autoFocus
        className="w-full resize-none rounded-md border border-secondary-800 bg-secondary-950 p-16 text-md leading-[28px] text-neutral-0 outline-none focus:border-secondary-600"
      />

      {image && (
        <div className="relative w-fit">
          <img src={image.url} alt="" className="max-h-[160px] rounded-md object-cover" />
          <button
            type="button"
            onClick={() => setImage(null)}
            aria-label="Remove image"
            className="absolute right-8 top-8 grid size-28 place-items-center rounded-full bg-overlay-black-70 text-neutral-0"
          >
            <Icon name="x" size={14} />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <ComposerTools
          onAddEmoji={(e) => setText((t) => t + e)}
          onPickImage={(file) => setImage({ url: URL.createObjectURL(file) })}
        />
        <div className="flex gap-12">
          <button type="button" onClick={onClose} className={GHOST_BTN}>
            Cancel
          </button>
          <button
            type="button"
            disabled={!text.trim() && !image}
            onClick={() => onSave(text.trim(), image?.url)}
            className={PRIMARY_BTN}
          >
            Save
          </button>
        </div>
      </div>
    </ResponsiveModal>
  );
}

/** Delete — confirmation message. */
export function DeletePostDialog({
  onConfirm,
  onClose,
  title = "Delete post?",
  body = "This post will be permanently removed from the discussion. This action can't be undone.",
}: {
  onConfirm: () => void;
  onClose: () => void;
  title?: string;
  body?: string;
}) {
  return (
    <ResponsiveModal onClose={onClose} title={title}>
      <p className="text-md leading-[26px] text-secondary-300">{body}</p>
      <div className="flex justify-end gap-12">
        <button type="button" onClick={onClose} className={GHOST_BTN}>
          Cancel
        </button>
        <button type="button" onClick={onConfirm} className={DANGER_BTN}>
          Delete
        </button>
      </div>
    </ResponsiveModal>
  );
}

const REASONS = ["Spam or misleading", "Harassment or hate", "Inappropriate content", "Other"];

/** Report — choose a reason. */
export function ReportPostDialog({
  onSubmit,
  onClose,
}: {
  onSubmit: (reason: string) => void;
  onClose: () => void;
}) {
  const [reason, setReason] = useState<string | null>(null);
  return (
    <ResponsiveModal onClose={onClose} title="Report post">
      <p className="text-md text-secondary-300">Why are you reporting this post?</p>
      <div className="flex flex-col gap-8">
        {REASONS.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setReason(r)}
            className={`flex items-center gap-12 rounded-md border px-16 py-12 text-left text-md transition-colors ${
              reason === r
                ? "border-primary-500 text-neutral-0"
                : "border-secondary-800 text-secondary-200 hover:border-secondary-600"
            }`}
          >
            <span
              className={`grid size-20 shrink-0 place-items-center rounded-full border-2 ${
                reason === r ? "border-primary-500" : "border-secondary-600"
              }`}
            >
              {reason === r && <span className="size-8 rounded-full bg-primary-500" />}
            </span>
            {r}
          </button>
        ))}
      </div>
      <div className="flex justify-end gap-12">
        <button type="button" onClick={onClose} className={GHOST_BTN}>
          Cancel
        </button>
        <button
          type="button"
          disabled={!reason}
          onClick={() => reason && onSubmit(reason)}
          className={PRIMARY_BTN}
        >
          Submit report
        </button>
      </div>
    </ResponsiveModal>
  );
}
