/**
 * MobileHomeScreen — "Home" tab as a personalized feed: "my courses", the
 * community feed ("Latest Posts"), then other schools to discover. What
 * counts as "mine" — and the Enrolled vs. Unenrolled post header per post —
 * varies by the active persona (Visitor / Enrolled Student / Teacher, see
 * MobilePersonaSwitcher): progress-based for a student, taught-by for a
 * teacher, none for a visitor. The single "current" enrolled course (student
 * only) lives in the floating ContinueLearningCard (see
 * MobileNewsfeedScreen) instead of this row — with 2+ courses, the rest
 * surface here so they're still reachable.
 * Each section falls back to nothing when its list is empty (e.g. the
 * Visitor persona, which has no courses of its own).
 * Reuses FeedPostCard/SchoolTile + the existing FEED_POSTS/SCHOOLS data (plus
 * one local-only demo post from a school the viewer isn't enrolled in, so
 * both post-header states are visible — see UNENROLLED_DEMO_POST).
 * Tapping a school tile or a post's byline both open MobileSchoolDetailScreen
 * via onOpenSchool — every school routes to the same page regardless of
 * which was tapped (only Recite Quran has real content; "id accepted but
 * unused", same convention already used on web).
 */
import { useState, type ReactNode } from "react";
import { Icon } from "../../components/Icon";
import { FeedPostCard } from "../../components/newsfeed/FeedPostCard";
import { SchoolTile } from "../../components/mobile/SchoolTile";
import { SCHOOLS, FEED_POSTS, getCurrentEnrolledSchool, type School } from "../../data/newsfeed";
import type { Post } from "../../data/discussions";
import { getMySchools, type PersonaId } from "../../data/personas";
import { MobileEnrollSheet } from "../../components/discussion/EnrollPrompt";
import { EditPostDialog, ReportPostDialog } from "../../components/discussion/PostDialogs";
import { MobilePostDetailPage } from "./MobilePostDetailPage";

/**
 * A post from a school the viewer isn't enrolled in — demonstrates the
 * "Unenrolled" post header (Figma node 44973:39099, Enroll link) alongside
 * the "Enrolled" ones already covered by FEED_POSTS. Local to this screen
 * (not added to the shared FEED_POSTS/POSTS data) so the web Newsfeed feed
 * is unaffected.
 */
const UNENROLLED_DEMO_POST: Post = {
  id: "mobile-demo-unenrolled",
  author: "Shanza Syed",
  initials: "SS",
  color: "blue",
  isTeacher: true,
  avatarUrl: "/instructor-shanza.png",
  time: "2h",
  text:
    "Assalamu Alaikum! Registration for the next Arabic Calligraphy for Beginners batch is now open — " +
    "we'll cover letterforms, proportions, and your first full composition. Would love to see new faces join us.",
  likes: 9,
  comments: [],
  school: "Arabic Calligraphy for Beginners",
};

/**
 * More community posts, shown after "Other Schools" — continuing the feed
 * rather than a new section (matches the original layout sketch: schools row,
 * posts, schools row, more posts, no extra heading). Deliberately text-only
 * (no imageUrl) for visual variety against the image posts above. Local to
 * this screen, same reasoning as UNENROLLED_DEMO_POST.
 */
const TEXT_DEMO_POSTS: Post[] = [
  {
    id: "mobile-demo-text-1",
    author: "Aisha Rahman",
    initials: "AR",
    color: "teal",
    isTeacher: false,
    time: "3h",
    text: "Just finished this week's grammar drills — the verb conjugation section finally clicked. Anyone else found the audio examples helpful?",
    likes: 5,
    comments: [],
    school: "Learn Quranic Arabic Grammar",
  },
  {
    id: "mobile-demo-text-2",
    author: "Omar Farooq",
    initials: "OF",
    color: "red",
    isTeacher: false,
    time: "5h",
    text: "Question for the group: how are you all keeping up with the daily reflections? Looking for a routine that actually sticks.",
    likes: 2,
    comments: [],
    school: "Foundations of Aqeedah",
  },
  {
    id: "mobile-demo-text-3",
    author: "Dalia Moghdad",
    initials: "DM",
    color: "orange",
    isTeacher: true,
    time: "1d",
    text: "Reminder: this week's homeschool planning session covers curriculum choices for early readers. Bring your questions!",
    likes: 6,
    comments: [],
    school: "Muslim Homeschool Foundations",
  },
];

/** Post list + empty state, shared by the two feed sections on this screen. */
function PostList({
  posts,
  likedPosts,
  signedIn,
  onOpen,
  onLike,
  onComment,
  onReport,
  onEdit,
  onOpenSchool,
  isEnrolledInPost,
}: {
  posts: Post[];
  likedPosts: Set<string>;
  /** Edit only shows in the kebab menu for a signed-in viewer (Enrolled Student/Teacher) — matches the web Discussions gate. */
  signedIn: boolean;
  onOpen: (post: Post) => void;
  onLike: (post: Post) => void;
  onComment: (post: Post) => void;
  onReport: (post: Post) => void;
  onEdit: (post: Post) => void;
  /** Fired by clicking the school name in a post's byline. */
  onOpenSchool: () => void;
  isEnrolledInPost: (school?: string) => boolean;
}) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-16 py-32 text-center">
        <Icon name="message-circle-plus" size={32} className="text-primary-300" />
        <p className="text-md text-secondary-300">Be the first to share something with the community.</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-24">
      {posts.map((post) => (
        <FeedPostCard
          key={post.id}
          post={post}
          onOpen={() => onOpen(post)}
          liked={likedPosts.has(post.id)}
          onLike={() => onLike(post)}
          onComment={() => onComment(post)}
          onJoin={isEnrolledInPost(post.school) ? undefined : () => {}}
          onOpenSchool={onOpenSchool}
          onReport={() => onReport(post)}
          onEdit={signedIn ? () => onEdit(post) : undefined}
          avatarSize={40}
          enrollLayout="stacked"
        />
      ))}
    </div>
  );
}

function SchoolRow({
  title,
  schools,
  renderItem,
  /** Wraps each item (e.g. "w-[90%] shrink-0 snap-center" for a 90%-width scroller). Unset = let each item size itself. */
  itemClassName,
}: {
  title: string;
  schools: School[];
  renderItem: (school: School) => ReactNode;
  itemClassName?: string;
}) {
  if (schools.length === 0) return null;
  return (
    <div className="flex flex-col gap-12">
      <h2 className="text-lg font-medium text-neutral-0">{title}</h2>
      <div className="flex snap-x snap-mandatory gap-16 overflow-x-auto">
        {schools.map((school) =>
          itemClassName ? (
            <div key={school.id} className={itemClassName}>
              {renderItem(school)}
            </div>
          ) : (
            renderItem(school)
          )
        )}
      </div>
    </div>
  );
}

export function MobileHomeScreen({
  persona,
  onEnroll,
  onOpenSchool,
}: {
  persona: PersonaId;
  /** Fired when a Visitor taps "Enroll Now" in the like/comment gate sheet — switches persona to Enrolled Student. */
  onEnroll: () => void;
  /** Opens the School Detail page. `school` is informational only — every school currently routes to the same page. */
  onOpenSchool: (school?: School) => void;
}) {
  const [posts, setPosts] = useState<Post[]>(() => [UNENROLLED_DEMO_POST, ...FEED_POSTS]);
  const [textPosts, setTextPosts] = useState<Post[]>(() => TEXT_DEMO_POSTS);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [showEnrollPrompt, setShowEnrollPrompt] = useState(false);
  const [openPost, setOpenPost] = useState<Post | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [reportingPost, setReportingPost] = useState<Post | null>(null);
  const signedIn = persona !== "visitor";

  /** Applies to whichever list actually contains this post — Edit works the same for either feed section. */
  const updatePost = (id: string, updater: (p: Post) => Post) => {
    const apply = (list: Post[]) => (list.some((p) => p.id === id) ? list.map((p) => (p.id === id ? updater(p) : p)) : list);
    setPosts(apply);
    setTextPosts(apply);
  };

  // "My courses" varies by persona: progress-based for the Enrolled Student,
  // taught-by for the Teacher, none for a Visitor — see getMySchools.
  const mySchools = getMySchools(SCHOOLS, persona);
  const currentSchool = persona === "student" ? getCurrentEnrolledSchool(mySchools) : undefined;
  const otherEnrolledSchools = mySchools.filter((s) => s.id !== currentSchool?.id);
  // Excludes the featured school (Recite Quran) — it's the app's main showcased course
  // (used throughout CourseDetail/Lessons/Discussions), not a generic discovery item —
  // most visible for a Visitor, who has no enrolled/taught schools to exclude here otherwise.
  const otherSchools = SCHOOLS.filter((s) => !mySchools.some((m) => m.id === s.id) && !s.featured);
  const myCourseTitles = new Set(mySchools.map((s) => s.course.toLowerCase()));

  const toggleLike = (id: string) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const isEnrolledInPost = (school?: string) => !!school && myCourseTitles.has(school.toLowerCase());

  // Visitors get an enroll prompt instead of the action; everyone else acts normally.
  const handleLike = (post: Post) => {
    if (persona === "visitor") return setShowEnrollPrompt(true);
    toggleLike(post.id);
  };
  // Viewing a post never requires enrollment (matches the web NewsfeedScreen) — only acting on it does.
  const handleOpen = (post: Post) => setOpenPost(post);
  const handleComment = (post: Post) => {
    if (persona === "visitor") return setShowEnrollPrompt(true);
    setOpenPost(post);
  };

  return (
    <div className="flex flex-1 flex-col gap-24 px-16 pb-96 pt-16">
      {/* Teacher's taught courses live on Explore ("My Schools") instead — a progress-bar
          card doesn't make sense for a course you teach rather than take. */}
      <SchoolRow
        title="Enrolled Courses"
        schools={persona === "teacher" ? [] : otherEnrolledSchools}
        itemClassName="w-[90%] shrink-0 snap-center"
        renderItem={(school) => <SchoolTile key={school.id} school={school} onOpen={() => onOpenSchool(school)} fullWidth />}
      />

      <div className="flex flex-col gap-16">
        <h2 className="text-lg font-medium text-neutral-0">Latest Posts</h2>
        <PostList
          posts={posts}
          likedPosts={likedPosts}
          signedIn={signedIn}
          onOpen={handleOpen}
          onLike={handleLike}
          onComment={handleComment}
          onReport={setReportingPost}
          onEdit={setEditingPost}
          onOpenSchool={() => onOpenSchool()}
          isEnrolledInPost={isEnrolledInPost}
        />
      </div>

      <SchoolRow
        title="Other Schools"
        schools={otherSchools}
        itemClassName="w-[90%] shrink-0 snap-center"
        renderItem={(school) => <SchoolTile key={school.id} school={school} onOpen={() => onOpenSchool(school)} fullWidth />}
      />

      <PostList
        posts={textPosts}
        likedPosts={likedPosts}
        signedIn={signedIn}
        onOpen={handleOpen}
        onLike={handleLike}
        onComment={handleComment}
        onReport={setReportingPost}
        onEdit={setEditingPost}
        onOpenSchool={() => onOpenSchool()}
        isEnrolledInPost={isEnrolledInPost}
      />

      {openPost && (
        <MobilePostDetailPage post={openPost} persona={persona} onBack={() => setOpenPost(null)} onEnroll={onEnroll} />
      )}

      {editingPost && (
        <EditPostDialog
          initialText={editingPost.text}
          initialImageUrl={editingPost.imageUrl}
          onClose={() => setEditingPost(null)}
          onSave={(text, imageUrl) => {
            updatePost(editingPost.id, (p) => ({ ...p, text, imageUrl }));
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
