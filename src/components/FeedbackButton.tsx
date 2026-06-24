/**
 * FeedbackButton — the lesson "Feedback" pill plus its popup.
 * Clicking opens "Share Your Feedback": a single textarea + a Send button.
 * Renders as a centered dialog on desktop and a bottom sheet on mobile
 * (via ResponsiveModal). Used in the lesson header and assignment header.
 */
import { useState } from "react";
import { ResponsiveModal } from "./ResponsiveModal";

const PILL =
  "shrink-0 rounded-full border border-secondary-800 px-16 py-8 text-sm font-medium text-neutral-0 transition-colors hover:bg-overlay-white-8";

export function FeedbackButton({ className = PILL }: { className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        Feedback
      </button>
      {open && <FeedbackModal onClose={() => setOpen(false)} />}
    </>
  );
}

function FeedbackModal({ onClose }: { onClose: () => void }) {
  const [value, setValue] = useState("");
  const canSend = !!value.trim();

  const submit = () => {
    if (!canSend) return;
    // TODO: wire to the feedback endpoint when available.
    onClose();
  };

  return (
    <ResponsiveModal onClose={onClose} title="Share Your Feedback">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={5}
        autoFocus
        placeholder="Type your feedback here…"
        aria-label="Your feedback"
        className="w-full resize-none rounded-md border border-secondary-800 bg-secondary-950 p-16 text-md leading-[28px] text-neutral-0 outline-none transition-colors placeholder:text-secondary-400 focus:border-secondary-600"
      />
      <button
        type="button"
        onClick={submit}
        disabled={!canSend}
        className={[
          "flex h-48 w-full items-center justify-center rounded-full text-md font-semibold transition-colors",
          canSend
            ? "bg-primary-500 text-secondary-1000 hover:bg-primary-400"
            : "cursor-not-allowed bg-secondary-800 text-secondary-400",
        ].join(" ")}
      >
        Send Feedback
      </button>
    </ResponsiveModal>
  );
}
