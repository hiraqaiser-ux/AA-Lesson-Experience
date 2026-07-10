/**
 * NewsfeedPostPage — full-page post detail for the community newsfeed (opened
 * from a feed card instead of a popup). Community NavBar + a back link + the
 * shared PostDetailContent (post on the left, comments + composer on the right)
 * with @mention support. Signed-out actions open the SignInPrompt.
 */
import { useState } from "react";
import { NavBar, type NavLink } from "../NavBar";
import { Icon } from "../Icon";
import { AuthorHeader } from "../discussion/DiscussionParts";
import { PostDetailContent } from "../discussion/PostDetailContent";
import { SignInPrompt } from "./SignInPrompt";
import { goToScreen } from "./communityNav";
import { STUDENTS } from "../../data/newsfeed";
import type { Post } from "../../data/discussions";

export function NewsfeedPostPage({
  post,
  onBack,
  signedIn,
  onSignIn,
  onSignOut,
}: {
  post: Post;
  onBack: () => void;
  signedIn: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
}) {
  const [showSignIn, setShowSignIn] = useState(false);
  const requireSignIn = () => {
    if (!signedIn) setShowSignIn(true);
    return signedIn;
  };
  const signIn = () => {
    onSignIn();
    setShowSignIn(false);
  };

  // Home returns to the feed; Courses opens the Explore Courses page.
  const links: NavLink[] = [
    { label: "Home", active: true, onClick: onBack },
    { label: "Courses", onClick: () => goToScreen("courses") },
    { label: "Blogs", href: "#" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-secondary-1000">
      <NavBar
        visitor={!signedIn}
        onEnroll={signIn}
        onLogout={onSignOut}
        onHome={onBack}
        userName="Hira"
        links={links}
        elevateOnScroll
        visitorCta="login-only"
      />

      <div className="mx-auto flex min-h-0 w-full max-w-[1200px] flex-1 flex-col md:px-24">
        <div className="px-24 pt-16 md:px-32">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-8 text-md text-secondary-300 transition-colors hover:text-neutral-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500"
          >
            <Icon name="chevron-left" size={18} />
            Back to feed
          </button>
        </div>

        <PostDetailContent
          post={post}
          enrolled={signedIn}
          onRequireEnroll={requireSignIn}
          mentionables={STUDENTS}
          header={
            <AuthorHeader
              name={post.author}
              initials={post.initials}
              color={post.color}
              avatarUrl={post.avatarUrl}
              time={post.time}
              school={post.school}
            />
          }
        />
      </div>

      {showSignIn && <SignInPrompt onSignIn={signIn} onClose={() => setShowSignIn(false)} />}
    </div>
  );
}
