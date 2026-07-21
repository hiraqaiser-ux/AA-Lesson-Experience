/**
 * NewsfeedScreen — the community newsfeed landing (a standalone concept; no
 * relation to the course/lesson experience). Two columns on desktop: the post
 * feed + a schools rail. On mobile the feed fills the screen. Signed-out
 * visitors see everything but are prompted to sign in the moment they try to
 * like, comment, post, or join. Signed-in visitors are one of three personas
 * (Enrolled Student / Teacher / Teacher Assistant), switchable from the
 * account dropdown — the active persona drives the nav identity and the
 * author shown on anything they create.
 *
 * Reuses: NavBar, PostComposer, CreatePostBox, BottomSheet and the discussion
 * primitives. New/newsfeed-only pieces: FeedPostCard, SchoolsSidebar,
 * SignInPrompt, NewsfeedPostPage.
 */
import { useState } from "react";
import { NavBar } from "../components/NavBar";
import { Icon } from "../components/Icon";
import { PostComposer } from "../components/discussion/PostComposer";
import { CreatePostBox } from "../components/discussion/CreatePostBox";
import { AVATAR_BG } from "../components/discussion/DiscussionParts";
import { NewsfeedPostPage } from "../components/newsfeed/NewsfeedPostPage";
import { ReportPostDialog } from "../components/discussion/PostDialogs";
import { BottomSheet } from "../components/BottomSheet";
import { FeedPostCard } from "../components/newsfeed/FeedPostCard";
import { SchoolsSidebar } from "../components/newsfeed/SchoolsSidebar";
import { BecomeTeacherCard } from "../components/newsfeed/BecomeTeacherCard";
import { SignInPrompt } from "../components/newsfeed/SignInPrompt";
import { communityNavLinks, goToScreen } from "../components/newsfeed/communityNav";
import { useIsDesktop } from "../hooks/useIsDesktop";
import { usePersona } from "../hooks/usePersona";
import { PERSONAS, buildAccountSwitcher, type PersonaId } from "../data/personas";
import { FEED_POSTS } from "../data/newsfeed";
import type { Post } from "../data/discussions";

export function NewsfeedScreen() {
  const isDesktop = useIsDesktop();
  const [persona, setPersona] = usePersona();
  const [posts, setPosts] = useState<Post[]>(FEED_POSTS);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [openPost, setOpenPost] = useState<Post | null>(null);
  const [reportPost, setReportPost] = useState<Post | null>(null);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showCreateSheet, setShowCreateSheet] = useState(false);

  const signedIn = persona !== "visitor";
  const current = persona !== "visitor" ? PERSONAS[persona] : undefined;

  /** Switching to Visitor also clears ephemeral engagement state (matches "sign out"). */
  const switchPersona = (id: PersonaId) => {
    setPersona(id);
    if (id === "visitor") setLikedPosts(new Set());
  };

  const requireSignIn = () => {
    if (!signedIn) setShowSignIn(true);
    return signedIn;
  };
  const signIn = () => {
    switchPersona("student");
    setShowSignIn(false);
  };
  const signOut = () => switchPersona("visitor");

  // Home = this newsfeed (the only mobile view now). Courses navigates to the Explore Courses page.
  const goHome = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /**
   * Open the school detail page (Lessons + Discussions). Every course
   * currently routes to the same detail page — the repo only has one such
   * page built out ("Recite Quran School"), so `id` is accepted but unused
   * for now (kept in the signature so callers don't need to change if/when
   * per-course detail pages exist).
   */
  const openSchoolDetail = (_id?: string) => goToScreen("school");
  const navLinks = communityNavLinks("home");

  const toggleLike = (id: string) => {
    if (!requireSignIn()) return;
    setLikedPosts((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const createPost = (text: string, imageUrl?: string) => {
    setPosts((prev) => [
      {
        id: `u-${prev.length}-${text.length}`,
        author: current?.name ?? "Hira",
        initials: current?.initials ?? "H",
        color: current?.color ?? "blue",
        isTeacher: false,
        role: current?.role,
        time: "Just now",
        text,
        likes: 0,
        comments: [],
        imageUrl,
        school: "Recite Quran School",
      },
      ...prev,
    ]);
    setShowCreateSheet(false);
  };

  const openComment = (post: Post) => {
    if (!requireSignIn()) return;
    setOpenPost(post);
  };

  const Feed = (
    <div className="flex min-w-0 flex-1 flex-col gap-32">
      {/* Create post — real composer when signed in; a locked prompt otherwise. */}
      {isDesktop &&
        (signedIn ? (
          <PostComposer onSubmit={createPost} />
        ) : (
          <CreatePostBox
            enrolled={false}
            onCreate={createPost}
            onRequireEnroll={requireSignIn}
            lockedLabel="🔒 Sign in to join the conversation"
          />
        ))}

      {posts.length === 0 ? (
        <div className="flex flex-col items-center gap-16 py-48 text-center">
          <Icon name="message-circle-plus" size={40} className="text-primary-300" />
          <div className="flex flex-col gap-8">
            <h3 className="text-lg-2 font-semibold text-neutral-0">No posts yet</h3>
            <p className="text-md text-secondary-300">Be the first to share something with the community.</p>
          </div>
        </div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="flex flex-col">
            <FeedPostCard
              post={post}
              onOpen={() => setOpenPost(post)}
              liked={likedPosts.has(post.id)}
              onLike={() => toggleLike(post.id)}
              onComment={() => openComment(post)}
              onJoin={() => openSchoolDetail()}
              onOpenSchool={() => openSchoolDetail()}
              onReport={() => setReportPost(post)}
            />
          </div>
        ))
      )}
    </div>
  );

  const Schools = (
    <SchoolsSidebar onSelectSchool={(id) => openSchoolDetail(id)} onBecomeTeacher={() => setShowSignIn(true)} />
  );

  return (
    <div className="flex min-h-screen flex-col bg-secondary-1000">
      <NavBar
        visitor={!signedIn}
        onEnroll={signIn}
        onLogout={signOut}
        onHome={goHome}
        userName={current?.name ?? "Hira"}
        avatarUrl={current?.avatarUrl}
        avatarColorClassName={current ? AVATAR_BG[current.color] : undefined}
        accountSwitcher={signedIn ? buildAccountSwitcher(persona, switchPersona) : undefined}
        links={navLinks}
        elevateOnScroll
        visitorCta="login-only"
        mobileFooter={<BecomeTeacherCard onBecomeTeacher={() => setShowSignIn(true)} />}
      />

      <main className="mx-auto w-full max-w-[1440px] flex-1 px-16 pb-[96px] pt-24 lg:px-64 lg:pb-40">
        {isDesktop ? (
          <div className="flex justify-between gap-64">
            {/* Feed ends near where "Blogs" ends; the courses sidebar stays right-aligned. */}
            <div className="w-full min-w-0 max-w-[780px]">{Feed}</div>
            <div className="w-[340px] shrink-0">
              <div className="sticky top-[96px]">{Schools}</div>
            </div>
          </div>
        ) : (
          Feed
        )}
      </main>

      {/* Mobile: bottom nav (Feed here / Courses opens the Explore Courses page) */}
      {!isDesktop && (
        <nav
          aria-label="Newsfeed sections"
          className="fixed inset-x-0 bottom-0 z-40 flex border-t border-secondary-900 bg-secondary-1000"
        >
          <button
            type="button"
            onClick={goHome}
            aria-current="page"
            className="flex flex-1 flex-col items-center gap-4 py-12 text-sm font-medium text-primary-500"
          >
            <Icon name="message-circle" size={22} />
            Feed
          </button>
          <button
            type="button"
            onClick={() => goToScreen("courses")}
            className="flex flex-1 flex-col items-center gap-4 py-12 text-sm font-medium text-secondary-400 transition-colors"
          >
            <Icon name="book" size={22} />
            Courses
          </button>
        </nav>
      )}

      {/* Mobile: floating create-post button */}
      {!isDesktop && (
        <button
          type="button"
          onClick={() => (signedIn ? setShowCreateSheet(true) : setShowSignIn(true))}
          aria-label="Create a post"
          className="fixed bottom-[76px] right-16 z-40 grid size-48 place-items-center rounded-full bg-primary-500 text-secondary-1000 shadow-xl transition-transform active:scale-95"
        >
          <Icon name="plus-circle" size={24} />
        </button>
      )}

      {showCreateSheet && (
        <BottomSheet onClose={() => setShowCreateSheet(false)} title="Create a post">
          <PostComposer autoFocus onSubmit={createPost} />
        </BottomSheet>
      )}

      {openPost && (
        <NewsfeedPostPage
          post={openPost}
          onBack={() => setOpenPost(null)}
          persona={persona}
          onSwitchPersona={switchPersona}
        />
      )}

      {showSignIn && <SignInPrompt onSignIn={signIn} onClose={() => setShowSignIn(false)} />}

      {reportPost && (
        <ReportPostDialog
          onClose={() => setReportPost(null)}
          onSubmit={() => setReportPost(null)}
        />
      )}
    </div>
  );
}
