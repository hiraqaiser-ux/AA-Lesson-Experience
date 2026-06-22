/**
 * EnrollPrompt — "Join the Conversation" dialog (Figma 43053:32766).
 * Shown when a not-enrolled user tries to like, comment or post. Built on the
 * shared Dialog popup shell.
 */
import { Dialog } from "../Dialog";

export function EnrollPrompt({ onEnroll, onClose }: { onEnroll: () => void; onClose: () => void }) {
  return (
    <Dialog onClose={onClose} className="items-center gap-24">
      <div className="flex w-full flex-col items-center gap-24">
        <h3 className="text-center font-slab text-lg font-bold text-text-primary">
          Join the Conversation
        </h3>
        <hr className="w-full border-0 border-t border-secondary-950" />
      </div>

      <p className="text-center text-lg-2 text-secondary-200">
        Enroll in this course to like, comment and post in the discussion.
      </p>

      <div className="flex w-full gap-20">
        <button
          type="button"
          onClick={onClose}
          className="flex h-48 flex-1 items-center justify-center rounded-full bg-secondary-800 px-20 text-md font-semibold text-secondary-50 transition-colors hover:bg-secondary-700"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onEnroll}
          className="flex h-48 flex-1 items-center justify-center rounded-full bg-primary-500 px-20 text-md font-semibold text-secondary-1000 transition-colors hover:bg-primary-400"
        >
          Enroll Now
        </button>
      </div>
    </Dialog>
  );
}
