/**
 * EmptyDiscussions — shown in the feed when there are no posts yet.
 * Enrolled students get an encouraging prompt; visitors get a gentle
 * "enroll to join" message.
 *
 * NOTE: no Figma reference for this state — built from DS tokens (4px grid,
 * brand palette).
 */
import { Icon } from "../Icon";

export function EmptyDiscussions({ enrolled }: { enrolled: boolean }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-16 px-24 py-48 text-center">
      <Icon name="message-circle-plus" size={40} className="text-primary-300" />

      <div className="flex flex-col gap-8">
        <h3 className="text-lg-2 font-semibold text-neutral-0">No discussions yet</h3>
        <p className="mx-auto max-w-[360px] text-md leading-6 text-secondary-300">
          {enrolled
            ? "Be the first to start the discussion."
            : "No discussions have been posted yet. Enroll to join the conversation."}
        </p>
      </div>
    </div>
  );
}
