/**
 * PostDetailPage — standalone full-screen post detail with the product NavBar.
 * Layout mirrors the popup: post (with the author header) on the left, comments
 * + a pinned-at-bottom composer on the right. The author header and the
 * "All Comments" heading sit parallel at the top of their columns.
 * Visitor actions (like / comment / post) open the enroll prompt.
 */
import { useState } from "react";
import { NavBar } from "../NavBar";
import { AuthorHeader } from "./DiscussionParts";
import { PostDetailContent } from "./PostDetailContent";
import { EnrollPrompt } from "./EnrollPrompt";
import type { Post } from "../../data/discussions";

export function PostDetailPage({
  post,
  onBack,
  enrolled,
  onEnroll,
  onLogout,
}: {
  post: Post;
  onBack: () => void;
  enrolled: boolean;
  onEnroll: () => void;
  onLogout?: () => void;
}) {
  const [showEnroll, setShowEnroll] = useState(false);
  const requireEnroll = () => {
    if (!enrolled) setShowEnroll(true);
  };
  const enroll = () => {
    onEnroll();
    setShowEnroll(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-secondary-3">
      <NavBar userName="Hira" onHome={onBack} visitor={!enrolled} onEnroll={enroll} onLogout={onLogout} />

      <div className="mx-auto flex w-full min-h-0 max-w-[1200px] flex-1 md:px-24">
        <PostDetailContent
          post={post}
          enrolled={enrolled}
          onRequireEnroll={requireEnroll}
          header={
            <AuthorHeader
              name={post.author}
              initials={post.initials}
              color={post.color}
              isTeacher={post.isTeacher}
              time={post.time}
            />
          }
        />
      </div>

      {showEnroll && <EnrollPrompt onEnroll={enroll} onClose={() => setShowEnroll(false)} />}
    </div>
  );
}
