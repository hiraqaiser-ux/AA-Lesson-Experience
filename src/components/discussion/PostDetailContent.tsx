/**
 * PostDetailContent — body of the post detail popup: post + reactions on the
 * left, comments + composer on the right (composer pinned at the column bottom).
 * Like toggles; not-enrolled actions route through onRequireEnroll.
 */
import { useState } from "react";
import type { ReactNode } from "react";
import { ReactionPill } from "./DiscussionParts";
import { CommentList } from "./CommentList";
import { CommentComposer } from "./CommentComposer";
import type { AvatarColor, Comment, Mentionable, Post } from "../../data/discussions";

export function PostDetailContent({
  post,
  enrolled,
  onRequireEnroll,
  header,
  mentionables,
  currentUser,
}: {
  post: Post;
  enrolled: boolean;
  onRequireEnroll: () => void;
  /** Optional content rendered at the top of the post column (e.g. author header). */
  header?: ReactNode;
  /** People who can be @mentioned in comments. Enables mention autocomplete + highlighting. */
  mentionables?: Mentionable[];
  /** Identity used when posting a new comment. Defaults to "Hira" when omitted. */
  currentUser?: { name: string; initials: string; color: AvatarColor };
}) {
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [value, setValue] = useState("");
  const [liked, setLiked] = useState(false);

  const likePost = () => {
    if (!enrolled) return onRequireEnroll();
    setLiked((l) => !l);
  };
  const send = () => {
    if (!enrolled) return onRequireEnroll();
    const text = value.trim();
    if (!text) return;
    setComments((c) => [
      {
        id: `new-${c.length}`,
        name: currentUser?.name ?? "Hira",
        initials: currentUser?.initials ?? "H",
        color: currentUser?.color ?? "blue",
        time: "Just now",
        text,
        likes: 0,
      },
      ...c,
    ]);
    setValue("");
  };
  const editComment = (id: string, text: string) =>
    setComments((c) => c.map((m) => (m.id === id ? { ...m, text } : m)));
  const deleteComment = (id: string) => setComments((c) => c.filter((m) => m.id !== id));

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
      {/* Post */}
      <div className="flex flex-col gap-16 px-24 py-24 lg:flex-1 lg:overflow-y-auto lg:px-32">
        {header}
        <p className="whitespace-pre-wrap text-md leading-[30px] text-neutral-0">{post.text}</p>
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt=""
            className="max-h-[360px] w-fit rounded-md object-cover"
          />
        )}
        <div className="flex items-center gap-8 px-4">
          <button type="button" onClick={likePost} aria-label="Like" aria-pressed={liked}>
            <ReactionPill icon="heart" count={post.likes + (liked ? 1 : 0)} iconSize={20} active={liked} />
          </button>
          <button type="button" onClick={() => !enrolled && onRequireEnroll()} aria-label="Comment">
            <ReactionPill icon="message-circle" count={comments.length} iconSize={20} />
          </button>
        </div>
      </div>

      {/* Comments + composer */}
      <div className="flex min-h-0 flex-col gap-16 border-t border-secondary-950 px-24 py-24 lg:flex-1 lg:border-l lg:border-t-0 lg:px-32">
        <h3 className="shrink-0 text-lg-2 font-bold text-neutral-0">All Comments ({comments.length})</h3>
        <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
          <CommentList
            comments={comments}
            enrolled={enrolled}
            onRequireEnroll={onRequireEnroll}
            onEditComment={editComment}
            onDeleteComment={deleteComment}
            highlightMentions={!!mentionables}
          />
        </div>
        <div className="sticky bottom-0 z-10 -mx-24 border-t border-secondary-950 bg-secondary-1000 px-24 py-12 lg:static lg:z-auto lg:mx-0 lg:border-t-0 lg:bg-transparent lg:px-0 lg:py-0">
          <CommentComposer
            enrolled={enrolled}
            value={value}
            onChange={setValue}
            onSend={send}
            onLockedClick={onRequireEnroll}
            mentionables={mentionables}
          />
        </div>
      </div>
    </div>
  );
}
