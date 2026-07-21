/**
 * LoginModal — the "Login or Signup" popup (Figma node 40042:5767) shown when a
 * visitor tries to enroll without being logged in. Email + Continue, plus Google
 * / Apple, and a "Start your school" promo panel (desktop only).
 *
 * This is a prototype gate: any of Continue / Google / Apple calls `onSuccess`
 * (no real auth yet). Renders as a centered dialog on desktop and a bottom sheet
 * on mobile; the promo panel is desktop-only (the sheet shows just the form).
 *
 * NOTE: a couple of Figma values fall outside the design system — flagged for
 * review: the 50px field/social-button height is snapped to the 48px grid, the
 * brand logos (Google/Apple marks) are omitted (not in the icon set), and the
 * promo panel's dark-green gradient has no token so it uses secondary-1000 +
 * a primary-900 (olive) border instead.
 */
import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { BottomSheet } from "./BottomSheet";
import { useIsDesktop } from "../hooks/useIsDesktop";

function Divider() {
  return <hr className="border-0 border-t border-secondary-800" />;
}

/** The email + social sign-in controls, shared by the desktop dialog and mobile sheet. */
function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");

  return (
    <form
      className="flex w-full flex-col gap-16"
      onSubmit={(e) => {
        e.preventDefault();
        onSuccess();
      }}
    >
      <label className="sr-only" htmlFor="login-email">
        Email
      </label>
      <input
        id="login-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="h-48 w-full rounded-sm border border-secondary-600 bg-transparent px-16 text-md font-medium text-neutral-0 placeholder:font-normal placeholder:text-secondary-400 focus:border-secondary-400 focus:outline-none"
      />

      <button
        type="submit"
        className="flex h-40 w-full items-center justify-center rounded-full bg-primary-500 text-md font-semibold text-secondary-1000 transition-colors hover:bg-primary-400"
      >
        Continue
      </button>

      <div className="flex items-center gap-12" aria-hidden="true">
        <span className="h-px flex-1 bg-secondary-800" />
        <span className="text-md font-bold text-neutral-0">or</span>
        <span className="h-px flex-1 bg-secondary-800" />
      </div>

      <button
        type="button"
        onClick={onSuccess}
        className="flex h-48 w-full items-center justify-center rounded-full border border-secondary-600 text-md font-bold text-neutral-0 transition-colors hover:bg-overlay-white-8"
      >
        Continue with Google
      </button>
      <button
        type="button"
        onClick={onSuccess}
        className="flex h-48 w-full items-center justify-center rounded-full border border-secondary-600 text-md font-bold text-neutral-0 transition-colors hover:bg-overlay-white-8"
      >
        Continue with Apple
      </button>
    </form>
  );
}

/** Desktop-only "Start your school" upsell shown beside the login form. */
function PromoPanel() {
  return (
    <div className="hidden w-[312px] shrink-0 flex-col justify-between gap-24 rounded-sm border border-primary-900 bg-secondary-1000 p-20 md:flex">
      <div className="flex flex-col gap-16">
        <h3 className="text-2xl font-bold leading-tight text-neutral-0">
          Start your school on Athan Academy
        </h3>
        <p className="text-md leading-6 text-neutral-0">
          Create courses, grow your audience and help Muslims gain practical skills.
        </p>
      </div>
      <button
        type="button"
        className="flex items-center gap-8 self-start text-md font-semibold text-primary-500 underline transition-colors hover:text-primary-400"
      >
        Apply Now
        <Icon name="external" size={20} />
      </button>
    </div>
  );
}

export function LoginModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  /** Fired on Continue / Google / Apple — the prototype's "logged in" signal. */
  onSuccess: () => void;
}) {
  const isDesktop = useIsDesktop();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!isDesktop) {
    return (
      <BottomSheet onClose={onClose} title="Login or Signup">
        <LoginForm onSuccess={onSuccess} />
      </BottomSheet>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-16">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="animate-fade-in absolute inset-0"
        style={{ backgroundColor: "var(--c-overlay-black-70)" }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Login or Signup"
        className="animate-message-in relative flex w-full max-w-[820px] gap-24 rounded-[20px] bg-secondary-3 px-32 pb-40 pt-32 shadow-2xl"
      >
        {/* Left: heading + form */}
        <div className="flex min-w-0 flex-1 flex-col gap-24">
          <div className="flex flex-col gap-24">
            <h2 className="text-center font-slab text-lg font-bold text-neutral-0">
              Login or Signup
            </h2>
            <Divider />
          </div>
          <LoginForm onSuccess={onSuccess} />
        </div>

        <span aria-hidden className="w-px shrink-0 self-stretch bg-secondary-800" />

        <PromoPanel />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-16 top-16 grid size-32 place-items-center rounded-full bg-overlay-white-12 text-neutral-0 transition-transform hover:scale-105"
        >
          <Icon name="x" size={14} />
        </button>
      </div>
    </div>
  );
}
