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
import { ActionMenu } from "../ActionMenu";
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
}: {
  post: Post;
  onOpen: () => void;
  liked: boolean;
  onLike: () => void;
  onComment: () => void;
  onJoin: () => void;
  /** Fired by clicking the course/school name in the byline. */
  onOpenSchool: () => void;
  onReport: () => void;
}) {
  const long = post.text.length > 400;
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
          menu={
            <ActionMenu
              label="Post actions"
              items={[{ label: "Report", icon: "flag", onSelect: onReport }]}
            />
          }
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
