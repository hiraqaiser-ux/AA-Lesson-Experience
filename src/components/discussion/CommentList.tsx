/**
 * CommentList — the comments under a post. Heart toggles a like (or prompts
 * enroll). Enrolled users get a per-comment kebab with Edit / Delete (dropdown
 * on web, bottom sheet on mobile), reusing the shared Edit/Delete dialogs.
 */
import { useState } from "react";
import { Icon } from "../Icon";
import { Avatar, RolePill } from "./DiscussionParts";
import { ActionMenu, type ActionItem } from "../ActionMenu";
import { EditPostDialog, DeletePostDialog } from "./PostDialogs";
import type { Comment } from "../../data/discussions";

type Dialog = { type: "edit" | "delete"; comment: Comment } | null;

export function CommentList({
  comments,
  enrolled,
  onRequireEnroll,
  onEditComment,
  onDeleteComment,
}: {
  comments: Comment[];
  enrolled: boolean;
  onRequireEnroll: () => void;
  /** Edit a comment's text. When provided (+ enrolled), the kebab menu appears. */
  onEditComment?: (id: string, text: string) => void;
  /** Delete a comment. */
  onDeleteComment?: (id: string) => void;
}) {
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [dialog, setDialog] = useState<Dialog>(null);
  const showMenu = enrolled && !!(onEditComment || onDeleteComment);

  const toggle = (id: string) => {
    if (!enrolled) return onRequireEnroll();
    setLiked((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const menuFor = (c: Comment): ActionItem[] => [
    ...(onEditComment ? [{ label: "Edit", icon: "edit" as const, onSelect: () => setDialog({ type: "edit", comment: c }) }] : []),
    ...(onDeleteComment ? [{ label: "Delete", icon: "trash" as const, danger: true, onSelect: () => setDialog({ type: "delete", comment: c }) }] : []),
  ];

  return (
    <div className="flex flex-col gap-16">
      {comments.map((c) => {
        const isLiked = liked.has(c.id);
        return (
          <div key={c.id} className="flex gap-12">
            <Avatar initials={c.initials} color={c.color} size={40} />
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              <span className="flex flex-wrap items-center gap-8">
                <span className="text-lg font-bold text-text-primary">{c.name}</span>
                {c.role && <RolePill role={c.role} />}
              </span>
              <span className="text-sm text-neutral-400">{c.time}</span>
              <p className="text-md leading-[30px] text-neutral-0">{c.text}</p>
              <button
                type="button"
                onClick={() => toggle(c.id)}
                aria-label="Like comment"
                aria-pressed={isLiked}
                className={`flex items-center gap-8 text-md font-semibold transition-colors ${
                  isLiked ? "text-primary-500" : "text-neutral-0"
                }`}
              >
                <Icon name="heart" size={20} />
                {c.likes + (isLiked ? 1 : 0)}
              </button>
            </div>
            {showMenu && <ActionMenu items={menuFor(c)} label="Comment actions" />}
          </div>
        );
      })}

      {dialog?.type === "edit" && (
        <EditPostDialog
          title="Edit comment"
          initialText={dialog.comment.text}
          onClose={() => setDialog(null)}
          onSave={(text) => {
            onEditComment?.(dialog.comment.id, text);
            setDialog(null);
          }}
        />
      )}
      {dialog?.type === "delete" && (
        <DeletePostDialog
          title="Delete comment?"
          body="This comment will be permanently removed. This action can't be undone."
          onClose={() => setDialog(null)}
          onConfirm={() => {
            onDeleteComment?.(dialog.comment.id);
            setDialog(null);
          }}
        />
      )}
    </div>
  );
}
