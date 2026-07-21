/**
 * MobilePostDetailPage — full-screen post detail for the mobile prototype,
 * opened by tapping a post or its Comment reaction. Reuses the same
 * PostDetailContent as the web (post + comments + composer — already
 * responsive down to a single mobile column with the composer pinned at the
 * bottom, see its lg: breakpoints) with mobile-appropriate chrome (a simple
 * back bar) instead of the desktop NavBar that NewsfeedPostPage uses.
 * Not-enrolled actions route through the same MobileEnrollSheet used on Home.
 */
import { useState } from "react";
import { Icon } from "../../components/Icon";
import { AuthorHeader } from "../../components/discussion/DiscussionParts";
import { PostDetailContent } from "../../components/discussion/PostDetailContent";
import { MobileEnrollSheet } from "../../components/discussion/EnrollPrompt";
import { PERSONAS, type PersonaId } from "../../data/personas";
import { STUDENTS } from "../../data/newsfeed";
import type { Post } from "../../data/discussions";

export function MobilePostDetailPage({
  post,
  persona,
  onBack,
  onEnroll,
}: {
  post: Post;
  persona: PersonaId;
  onBack: () => void;
  onEnroll: () => void;
}) {
  const [showEnrollPrompt, setShowEnrollPrompt] = useState(false);
  const signedIn = persona !== "visitor";
  const current = signedIn ? PERSONAS[persona] : undefined;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-secondary-1000">
      <div className="flex h-[52px] shrink-0 items-center gap-8 border-b border-secondary-950 px-16">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="grid size-32 shrink-0 place-items-center rounded-full text-neutral-0 transition-colors hover:bg-overlay-white-8"
        >
          <Icon name="chevron-left" size={20} />
        </button>
        <span className="text-md font-bold text-neutral-0">Post</span>
      </div>

      <PostDetailContent
        post={post}
        enrolled={signedIn}
        onRequireEnroll={() => setShowEnrollPrompt(true)}
        mentionables={STUDENTS}
        currentUser={current}
        header={
          <AuthorHeader
            name={post.author}
            initials={post.initials}
            color={post.color}
            avatarUrl={post.avatarUrl}
            time={post.time}
            school={post.school}
            avatarSize={40}
          />
        }
      />

      {showEnrollPrompt && (
        <MobileEnrollSheet
          onClose={() => setShowEnrollPrompt(false)}
          onEnroll={() => {
            onEnroll();
            setShowEnrollPrompt(false);
          }}
        />
      )}
    </div>
  );
}
