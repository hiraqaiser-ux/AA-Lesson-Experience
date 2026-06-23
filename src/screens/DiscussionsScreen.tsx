/**
 * DiscussionsScreen — the "Discussions" tab.
 *
 * Enrolled / visitor flow (CourseSideCard + EnrollPrompt). Post 01 (Abdul
 * Haseeb's welcome) opens the standalone full page; others open the modal.
 * Each post has a kebab menu (Edit / Delete / Report / Pin) — a dropdown on
 * desktop, a bottom sheet on mobile. Create-post is an inline composer on
 * desktop (text + image + emoji) and a floating-button → bottom sheet on mobile.
 */
import { useState } from "react";
import { Icon } from "../components/Icon";
import { AuthorHeader, ReactionPill } from "../components/discussion/DiscussionParts";
import { PostDetailModal } from "../components/discussion/PostDetailModal";
import { EnrollPrompt } from "../components/discussion/EnrollPrompt";
import { CreatePostBox } from "../components/discussion/CreatePostBox";
import { PostComposer } from "../components/discussion/PostComposer";
import { EmptyDiscussions } from "../components/discussion/EmptyDiscussions";
import { ActionMenu } from "../components/ActionMenu";
import { BottomSheet } from "../components/BottomSheet";
import { EditPostDialog, DeletePostDialog, ReportPostDialog } from "../components/discussion/PostDialogs";
import { useIsDesktop } from "../hooks/useIsDesktop";
import { POSTS, type Post } from "../data/discussions";
import { COURSE } from "../data/course";

const SCHOOLS = [
  { name: "Arabic Calligraphy for Beginners", instructor: "Shanza Syed", image: "/instructor-shanza.png", duration: "3 weeks" },
  { name: "Quranic Grammar Level 1", instructor: "Abdul Haseeb", image: "/instructor-abdul.png", duration: "3 weeks" },
  { name: "Homeschooling with Purpose", instructor: "Dalia Moghdad", image: "/instructor-dalia.png", duration: "3 weeks" },
];

/** Right-hand course card — "Enroll Now" before enrolling, "Continue Learning" after. */
function CourseSideCard({
  enrolled,
  onEnroll,
  onContinue,
}: {
  enrolled: boolean;
  onEnroll: () => void;
  onContinue: () => void;
}) {
  return (
    <div
      className="flex flex-col gap-20 rounded-lg border border-secondary-800 p-20 backdrop-blur-md"
      style={{
        backgroundImage:
          "linear-gradient(138deg, rgba(20,27,32,0.2) 0%, rgba(106,121,144,0.2) 98%)",
      }}
    >
      <div className="flex flex-col gap-8">
        {enrolled ? (
          <span className="text-md text-secondary-300">{COURSE.school}</span>
        ) : (
          <span className="text-xs font-bold uppercase tracking-wide text-secondary-300">
            {COURSE.school}
          </span>
        )}
        <span
          className={
            enrolled
              ? "text-[32px] font-extrabold leading-[35px] text-neutral-0"
              : "text-xl font-extrabold leading-[1.3] text-neutral-0"
          }
        >
          Learn to Recite Quran in 12 weeks
        </span>
      </div>

      {enrolled ? (
        <>
          <div className="flex flex-col gap-12">
            <div className="h-8 w-full overflow-hidden rounded-full bg-secondary-400">
              <div className="h-full rounded-full bg-primary-500" style={{ width: "25%" }} />
            </div>
            <p className="text-md text-secondary-300">{COURSE.progressLabel}</p>
          </div>
          <button
            type="button"
            onClick={onContinue}
            className="flex h-48 items-center justify-center rounded-full bg-primary-500 px-20 text-md font-semibold text-secondary-1000 transition-colors hover:bg-primary-400"
          >
            Continue Learning
          </button>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-12">
            <span className="flex items-center gap-8 text-md text-neutral-0">
              <Icon name="calendar" size={20} className="shrink-0 text-secondary-300" />
              Starting:&nbsp;<span className="font-medium text-primary-500">Wed 8 March, 2026</span>
            </span>
            <span className="flex items-center gap-8 text-md text-neutral-0">
              <img src="/instructor-abdul.png" alt="" className="size-28 shrink-0 rounded-full object-cover" />
              Abdul Haseeb
            </span>
          </div>
          <button
            type="button"
            onClick={onEnroll}
            className="flex h-48 items-center justify-center rounded-full bg-primary-500 px-20 text-md font-semibold text-secondary-1000 transition-colors hover:bg-primary-400"
          >
            Enroll Now
          </button>
        </>
      )}
    </div>
  );
}

/** "Other schools" list shown beneath the course card. */
function OtherSchools() {
  return (
    <div className="flex flex-col gap-16">
      <span className="text-md font-normal uppercase tracking-wide text-secondary-300">
        Other schools
      </span>
      <div className="flex flex-col gap-16">
        {SCHOOLS.map((s) => (
          <button
            key={s.name}
            type="button"
            className="flex flex-col gap-4 border-b border-secondary-950 pb-16 text-left"
          >
            <span className="text-lg font-medium text-neutral-0">{s.name}</span>
            <div className="flex flex-wrap items-center gap-x-20 gap-y-8 text-md text-neutral-200">
              <span className="flex items-center gap-12">
                <img src={s.image} alt="" className="size-32 shrink-0 rounded-full object-cover" />
                {s.instructor}
              </span>
              <span className="size-[6px] shrink-0 rounded-full bg-secondary-500" />
              <span className="flex items-center gap-8">
                <Icon name="clock" size={16} />
                {s.duration}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function PostCard({
  post,
  onOpen,
  liked,
  onLike,
  onComment,
  onUnpin,
  menuItems,
}: {
  post: Post;
  onOpen: () => void;
  liked: boolean;
  onLike: () => void;
  onComment: () => void;
  onUnpin: () => void;
  menuItems: import("../components/ActionMenu").ActionItem[] | null;
}) {
  const long = post.text.length > 400;
  return (
    <div className="flex w-full flex-col gap-24">
      <div className="flex flex-col gap-8">
        <div className="flex items-start justify-between gap-12">
          <button type="button" onClick={onOpen} className="flex min-w-0 flex-1 flex-col gap-8 text-left">
            <AuthorHeader
              name={post.author}
              initials={post.initials}
              color={post.color}
              isTeacher={post.isTeacher}
              role={post.role}
              time={post.time}
            />
            <p
              className={`whitespace-pre-wrap text-md leading-[30px] text-neutral-0 ${
                long ? "line-clamp-[6]" : ""
              }`}
            >
              {post.text}
            </p>
            {long && (
              <span className="text-sm font-semibold text-primary-500 underline underline-offset-2">
                See More
              </span>
            )}
          </button>
          <div className="flex shrink-0 items-center gap-4">
            {post.pinned && (
              <button
                type="button"
                onClick={onUnpin}
                aria-label="Unpin post"
                className="grid size-36 place-items-center rounded-full text-success transition-colors hover:bg-overlay-white-8"
              >
                <Icon name="pin" size={18} />
              </button>
            )}
            {menuItems && <ActionMenu items={menuItems} />}
          </div>
        </div>
        {post.imageUrl && (
          <img src={post.imageUrl} alt="" className="max-h-[320px] w-fit rounded-md object-cover" />
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
    </div>
  );
}

type DialogState = { type: "edit" | "delete" | "report"; post: Post } | null;

export function DiscussionsScreen({
  onOpenPost,
  enrolled,
  onEnroll,
  onUnenroll,
}: {
  onOpenPost?: (post: Post) => void;
  enrolled: boolean;
  onEnroll: () => void;
  onUnenroll: () => void;
}) {
  const isDesktop = useIsDesktop();
  const [posts, setPosts] = useState<Post[]>(POSTS);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [openPost, setOpenPost] = useState<Post | null>(null);
  const [showEnroll, setShowEnroll] = useState(false);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [showCreateSheet, setShowCreateSheet] = useState(false);

  const requireEnroll = () => {
    if (!enrolled) setShowEnroll(true);
  };
  const handleEnroll = () => {
    onEnroll();
    setShowEnroll(false);
  };

  const toggleLike = (id: string) =>
    setLikedPosts((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const createPost = (text: string, imageUrl?: string) => {
    setPosts((prev) => [
      { id: `u-${Date.now()}`, author: "Usman", initials: "U", color: "blue", isTeacher: false, time: "Just now", text, likes: 0, comments: [], imageUrl },
      ...prev,
    ]);
    setShowCreateSheet(false);
  };
  const editPost = (id: string, text: string, imageUrl?: string) =>
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, text, imageUrl } : p)));
  const deletePost = (id: string) => setPosts((prev) => prev.filter((p) => p.id !== id));
  const togglePin = (id: string) =>
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, pinned: !p.pinned } : p)));

  // Abdul Haseeb's welcome post (p1) opens the full page; the rest open the modal.
  const openPostView = (post: Post) =>
    post.id === "p1" && onOpenPost ? onOpenPost(post) : setOpenPost(post);

  const menuFor = (post: Post): import("../components/ActionMenu").ActionItem[] => [
    { label: "Edit", icon: "edit", onSelect: () => setDialog({ type: "edit", post }) },
    { label: post.pinned ? "Unpin" : "Pin", icon: "pin", onSelect: () => togglePin(post.id) },
    { label: "Report", icon: "flag", onSelect: () => setDialog({ type: "report", post }) },
    { label: "Delete", icon: "trash", danger: true, onSelect: () => setDialog({ type: "delete", post }) },
  ];

  return (
    <div className="mx-auto w-full px-16 pt-24 md:px-40 lg:px-[92px]">
      <div className="flex flex-col gap-32 rounded-lg p-0 md:gap-40 md:border md:border-secondary-900 md:p-40">
        {/* Posts + right rail */}
        <div className="flex flex-col gap-32 lg:flex-row lg:gap-64">
          <div className="flex min-w-0 flex-1 flex-col gap-32">
            {/* Create post — inline on desktop; a floating button → sheet on mobile. */}
            {isDesktop &&
              (enrolled ? (
                <PostComposer onSubmit={createPost} />
              ) : (
                <CreatePostBox enrolled={false} onCreate={createPost} onRequireEnroll={requireEnroll} />
              ))}

            <div className="flex flex-1 flex-col">
              {posts.length === 0 ? (
                <EmptyDiscussions enrolled={enrolled} />
              ) : (
                posts.map((post, i) => (
                  <div key={post.id} className="flex flex-col">
                    {i > 0 && <hr className="my-32 border-0 border-t border-secondary-950" />}
                    <PostCard
                      post={post}
                      onOpen={() => openPostView(post)}
                      liked={likedPosts.has(post.id)}
                      onLike={() => (enrolled ? toggleLike(post.id) : requireEnroll())}
                      onComment={() => (enrolled ? openPostView(post) : requireEnroll())}
                      onUnpin={() => togglePin(post.id)}
                      menuItems={enrolled ? menuFor(post) : null}
                    />
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex flex-col gap-32 lg:w-[340px] lg:shrink-0">
            <CourseSideCard enrolled={enrolled} onEnroll={onEnroll} onContinue={onUnenroll} />
            <OtherSchools />
          </div>
        </div>
      </div>

      {/* Mobile floating create button */}
      {!isDesktop && (
        <button
          type="button"
          onClick={() => (enrolled ? setShowCreateSheet(true) : requireEnroll())}
          aria-label="Create a post"
          className={`fixed right-16 z-40 grid size-44 place-items-center rounded-full bg-primary-500 text-secondary-1000 shadow-xl transition-transform active:scale-95 ${
            enrolled ? "bottom-24" : "bottom-[132px]"
          }`}
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
        <PostDetailModal
          post={openPost}
          onClose={() => setOpenPost(null)}
          enrolled={enrolled}
          onRequireEnroll={requireEnroll}
        />
      )}
      {showEnroll && <EnrollPrompt onEnroll={handleEnroll} onClose={() => setShowEnroll(false)} />}

      {dialog?.type === "edit" && (
        <EditPostDialog
          initialText={dialog.post.text}
          initialImageUrl={dialog.post.imageUrl}
          onClose={() => setDialog(null)}
          onSave={(text, imageUrl) => {
            editPost(dialog.post.id, text, imageUrl);
            setDialog(null);
          }}
        />
      )}
      {dialog?.type === "delete" && (
        <DeletePostDialog
          onClose={() => setDialog(null)}
          onConfirm={() => {
            deletePost(dialog.post.id);
            setDialog(null);
          }}
        />
      )}
      {dialog?.type === "report" && (
        <ReportPostDialog onClose={() => setDialog(null)} onSubmit={() => setDialog(null)} />
      )}
    </div>
  );
}
