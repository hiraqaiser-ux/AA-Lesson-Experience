/**
 * PostDetailModal — the discussion post popup (Figma node 43033:35349).
 * Header + shared PostDetailContent. Side-by-side on desktop, stacked + full
 * screen on mobile.
 */
import { useEffect } from "react";
import { Icon } from "../Icon";
import { AuthorHeader } from "./DiscussionParts";
import { PostDetailContent } from "./PostDetailContent";
import type { Mentionable, Post } from "../../data/discussions";

export function PostDetailModal({
  post,
  onClose,
  enrolled,
  onRequireEnroll,
  mentionables,
}: {
  post: Post;
  onClose: () => void;
  enrolled: boolean;
  onRequireEnroll: () => void;
  /** People who can be @mentioned in comments. */
  mentionables?: Mentionable[];
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-24">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="animate-fade-in absolute inset-0"
        style={{ backgroundColor: "var(--c-overlay-black-70)" }}
      />

      <div className="animate-message-in relative flex h-full max-h-full w-full flex-col overflow-hidden bg-secondary-1000 sm:h-auto sm:max-h-[90vh] sm:max-w-[1024px] sm:rounded-lg">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-12 bg-secondary-950 px-24 py-16">
          <AuthorHeader
            name={post.author}
            initials={post.initials}
            color={post.color}
            isTeacher={post.isTeacher}
            time={post.time}
            school={post.school}
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-28 shrink-0 place-items-center rounded-sm text-neutral-0 transition-colors hover:bg-overlay-white-8"
          >
            <Icon name="x" size={24} />
          </button>
        </div>

        <PostDetailContent
          post={post}
          enrolled={enrolled}
          onRequireEnroll={onRequireEnroll}
          mentionables={mentionables}
        />
      </div>
    </div>
  );
}
