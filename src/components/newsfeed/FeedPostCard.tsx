/**
 * FeedPostCard — a single post in the newsfeed. Byline shows the author + the
 * course name (clickable, underlines on hover) with an "Enroll Now" button; the
 * body opens the post; the footer has Like + Comment (auth-gated by the parent).
 * Composed from the shared AuthorHeader + ReactionPill primitives.
 *
 * The byline is kept OUTSIDE the "open post" button so its controls aren't
 * nested inside another button (invalid + bad a11y).
 */
import { AuthorHeader, ReactionPill } from "../discussion/DiscussionParts";
import { ActionMenu, type ActionItem } from "../ActionMenu";
import type { Post } from "../../data/discussions";

export function FeedPostCard({
  post,
  onOpen,
  liked,
  onLike,
  onComment,
  onJoin,
  onOpenSchool,
  onReport,
  onEdit,
  avatarSize,
  enrollLayout,
}: {
  post: Post;
  onOpen: () => void;
  liked: boolean;
  onLike: () => void;
  onComment: () => void;
  /** Fired by the Enroll control. Omit when the viewer is already enrolled in this post's school. */
  onJoin?: () => void;
  /** Fired by clicking the course/school name in the byline. */
  onOpenSchool: () => void;
  onReport: () => void;
  /** Adds "Edit" to the kebab menu when provided — omit for viewers who shouldn't see it (e.g. a Visitor). */
  onEdit?: () => void;
  avatarSize?: number;
  /** See AuthorHeader — "inline" (default, web byline) or "stacked" (mobile post header spec). */
  enrollLayout?: "inline" | "stacked";
}) {
  const long = post.text.length > 400;
  // "stacked" only ever comes from the mobile prototype — reuse it as the "force bottom sheet" signal
  // (its simulated phone frame can sit inside an actual wide browser window).
  const forceMobile = enrollLayout === "stacked";
  const copyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?post=${post.id}`;
    navigator.clipboard?.writeText(url).catch(() => {});
  };
  const menuItems: ActionItem[] = [];
  if (onEdit) menuItems.push({ label: "Edit", icon: "edit", onSelect: onEdit });
  menuItems.push({ label: "Report", icon: "flag", onSelect: onReport });
  menuItems.push({ label: "Copy Link", icon: "clipboard", onSelect: copyLink });
  return (
    <article className="flex w-full flex-col gap-24" aria-label={`Post by ${post.author}`}>
      <div className="flex flex-col gap-12">
        <AuthorHeader
          name={post.author}
          initials={post.initials}
          color={post.color}
          avatarUrl={post.avatarUrl}
          isTeacher={post.isTeacher}
          role={post.role}
          time={post.time}
          school={post.school}
          onJoin={onJoin}
          onOpenSchool={onOpenSchool}
          avatarSize={avatarSize}
          enrollLayout={enrollLayout}
          menu={<ActionMenu label="Post actions" items={menuItems} forceMobile={forceMobile} />}
        />

        <button type="button" onClick={onOpen} className="flex flex-col gap-8 text-left">
          <p
            className={`whitespace-pre-wrap text-md leading-[30px] text-neutral-0 ${
              long ? "line-clamp-[6]" : ""
            }`}
          >
            {post.text}
          </p>
          {long && (
            <span className="text-sm font-semibold text-secondary-400 underline underline-offset-2">
              See More
            </span>
          )}
        </button>

        {post.imageUrl && (
          <button type="button" onClick={onOpen} className="w-full">
            <img
              src={post.imageUrl}
              alt=""
              className="h-[320px] w-full rounded-md object-cover"
            />
          </button>
        )}
      </div>

      <div className="flex items-center gap-12 px-4">
        <button type="button" onClick={onLike} aria-label="Like" aria-pressed={liked}>
          <ReactionPill icon="heart" count={post.likes + (liked ? 1 : 0)} active={liked} />
        </button>
        <button type="button" onClick={onComment} aria-label="Comment">
          <ReactionPill icon="message-circle" count={post.comments.length} />
        </button>
      </div>
    </article>
  );
}
