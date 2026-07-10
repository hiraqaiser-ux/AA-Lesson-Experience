/**
 * SignInPrompt — shown when a signed-out visitor tries to like, comment, post,
 * or join. Composes the shared Dialog shell (same pattern as EnrollPrompt) with
 * community-specific copy + Sign in / Join now actions.
 */
import { Dialog } from "../Dialog";

export function SignInPrompt({
  onSignIn,
  onClose,
}: {
  onSignIn: () => void;
  onClose: () => void;
}) {
  return (
    <Dialog onClose={onClose} className="items-center gap-24">
      <div className="flex w-full flex-col items-center gap-24">
        <h3 className="text-center font-slab text-lg font-bold text-text-primary">
          Join the community
        </h3>
        <hr className="w-full border-0 border-t border-secondary-950" />
      </div>

      <p className="text-center text-lg-2 text-secondary-200">
        Sign in or create an account to like, comment and post in the community.
      </p>

      <div className="flex w-full gap-20">
        <button
          type="button"
          onClick={onSignIn}
          className="flex h-48 flex-1 items-center justify-center rounded-full bg-secondary-800 px-20 text-md font-semibold text-secondary-50 transition-colors hover:bg-secondary-700"
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={onSignIn}
          className="flex h-48 flex-1 items-center justify-center rounded-full bg-primary-500 px-20 text-md font-semibold text-secondary-1000 transition-colors hover:bg-primary-400"
        >
          Join now
        </button>
      </div>
    </Dialog>
  );
}
