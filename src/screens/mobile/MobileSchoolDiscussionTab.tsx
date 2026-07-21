/**
 * MobileSchoolDiscussionTab — "Discussion" tab of the mobile School Detail
 * page (Figma node 43882:79695, Visitor). Reuses the exact same post
 * infrastructure already proven mobile-responsive on the Home feed
 * (FeedPostCard with enrollLayout="stacked", MobilePostDetailPage,
 * MobileEnrollSheet, Edit/Report dialogs) — since every post in FEED_POSTS
 * already belongs to this school, the tab is just that list, unfiltered,
 * followed by the same SchoolEnrollBar as the Lesson tab.
 *
 * Two deliberate deviations from the linked Figma frame, flagged for review:
 * - No kebab menu is shown in that frame, and the author's role chip is a
 *   lime emoji pill ("🧑‍🏫 Teacher") — but MOBILE_ALIGNMENT_CONTEXT.md's own
 *   role-chip rule says "subtle, not lime", and an earlier explicit request
 *   ("Remove the teacher tag") already dropped role chips from this exact
 *   mobile post header. Built with the same FeedPostCard used everywhere
 *   else instead (kebab incl. Report/Copy Link, Edit for signed-in, no role
 *   chip) for consistency with the rest of the app over literal fidelity to
 *   this one older frame — a newer revision of this same frame
 *   (44968:38745) already matches this component's shape.
 * - Enrolled Student/Teacher get a create-post FAB + bottom-sheet composer
 *   (reusing PostComposer) — not shown in this Visitor-only frame, but
 *   needed for the tab to be usable once enrolled, and matches the same
 *   pattern already established on the web NewsfeedScreen.
 */
import { useState } from "react";
import { Icon } from "../../components/Icon";
import { BottomSheet } from "../../components/BottomSheet";
import { PostComposer } from "../../components/discussion/PostComposer";
import { FeedPostCard } from "../../components/newsfeed/FeedPostCard";
import { MobileEnrollSheet } from "../../components/discussion/EnrollPrompt";
import { EditPostDialog, ReportPostDialog } from "../../components/discussion/PostDialogs";
import { SchoolEnrollBar } from "../../components/mobile/SchoolEnrollBar";
import { MobilePostDetailPage } from "./MobilePostDetailPage";
import { FEED_POSTS } from "../../data/newsfeed";
import type { Post } from "../../data/discussions";
import type { PersonaId } from "../../data/personas";

export function MobileSchoolDiscussionTab({
  persona,
  onEnroll,
}: {
  persona: PersonaId;
  onEnroll: () => void;
}) {
  const [posts, setPosts] = useState<Post[]>(() => FEED_POSTS);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [showEnrollPrompt, setShowEnrollPrompt] = useState(false);
  const [showCreateSheet, setShowCreateSheet] = useState(false);
  const [openPost, setOpenPost] = useState<Post | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [reportingPost, setReportingPost] = useState<Post | null>(null);
  const signedIn = persona !== "visitor";

  const toggleLike = (id: string) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleLike = (post: Post) => {
    if (!signedIn) return setShowEnrollPrompt(true);
    toggleLike(post.id);
  };
  const handleComment = (post: Post) => {
    if (!signedIn) return setShowEnrollPrompt(true);
    setOpenPost(post);
  };

  const createPost = (text: string, imageUrl?: string) => {
    setPosts((prev) => [
      {
        id: `discussion-${prev.length}-${Date.now()}`,
        author: "Hira Qaiser",
        initials: "H",
        color: "blue",
        isTeacher: false,
        time: "Just now",
        text,
        imageUrl,
        likes: 0,
        comments: [],
        school: "Learn to Recite Quran in 12 weeks",
      },
      ...prev,
    ]);
    setShowCreateSheet(false);
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-24 overflow-y-auto p-16">
        {posts.map((post) => (
          <FeedPostCard
            key={post.id}
            post={post}
            onOpen={() => setOpenPost(post)}
            liked={likedPosts.has(post.id)}
            onLike={() => handleLike(post)}
            onComment={() => handleComment(post)}
            onOpenSchool={() => {}}
            onReport={() => setReportingPost(post)}
            onEdit={signedIn ? () => setEditingPost(post) : undefined}
            avatarSize={40}
            enrollLayout="stacked"
          />
        ))}
      </div>

      {!signedIn && <SchoolEnrollBar onEnroll={onEnroll} />}

      {signedIn && (
        <button
          type="button"
          onClick={() => setShowCreateSheet(true)}
          aria-label="Create a post"
          className="absolute bottom-16 right-16 grid size-48 place-items-center rounded-full bg-primary-500 text-secondary-1000 shadow-xl transition-transform active:scale-95"
        >
          <Icon name="message-circle-plus" size={24} />
        </button>
      )}

      {showCreateSheet && (
        <BottomSheet onClose={() => setShowCreateSheet(false)} title="Create a post">
          <PostComposer autoFocus onSubmit={createPost} />
        </BottomSheet>
      )}

      {openPost && (
        <MobilePostDetailPage post={openPost} persona={persona} onBack={() => setOpenPost(null)} onEnroll={onEnroll} />
      )}

      {editingPost && (
        <EditPostDialog
          initialText={editingPost.text}
          initialImageUrl={editingPost.imageUrl}
          onClose={() => setEditingPost(null)}
          onSave={(text, imageUrl) => {
            setPosts((prev) => prev.map((p) => (p.id === editingPost.id ? { ...p, text, imageUrl } : p)));
            setEditingPost(null);
          }}
          forceMobile
        />
      )}

      {reportingPost && (
        <ReportPostDialog onClose={() => setReportingPost(null)} onSubmit={() => setReportingPost(null)} forceMobile />
      )}

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
