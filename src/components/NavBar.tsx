/**
 * NavBar — product top navigation (logged-in state), replicated from the
 * Athan Academy DS "Nav Bar" component.
 *
 * Desktop (≥lg): logo left; "Blog" link + full profile pill right.
 * Mobile  (<lg): hamburger + logo left; avatar-only profile right. The
 *   hamburger opens a slide-in drawer. Drawer content is context-aware:
 *     • default (About)  → Blog + Log out
 *     • `mobileMenu` slot → custom content (e.g. the course-content sidebar
 *       on lesson screens). Receives a `close` fn so taps can dismiss it.
 *
 * The mobile/desktop switch uses the `lg` breakpoint so it stays in lockstep
 * with the lesson sidebar (`hidden lg:block`).
 */
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Icon } from "./Icon";

export function NavBar({
  userName = "Hira",
  mobileMenu,
  onHome,
  visitor = false,
  onEnroll,
  onLogout,
}: {
  userName?: string;
  /** Custom drawer content for the hamburger menu. Falls back to Blog + Log out. */
  mobileMenu?: (close: () => void) => ReactNode;
  /** Fired when the logo is clicked — navigates to the home page. */
  onHome?: () => void;
  /** Visitor (not enrolled): show Login + Enroll Now instead of the profile pill. */
  visitor?: boolean;
  /** Fired by the "Enroll Now" CTA in visitor mode. */
  onEnroll?: () => void;
  /** Fired by the "Log out" item in the profile dropdown. */
  onLogout?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the profile dropdown on outside click.
  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full bg-secondary-1000">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-16 py-16 lg:px-64 lg:py-20">
        {/* Left: hamburger (mobile only) + logo */}
        <div className="flex items-center gap-12">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="grid size-40 place-items-center rounded-sm text-neutral-0 transition-colors hover:bg-overlay-white-8 lg:hidden"
          >
            <Icon name="menu" size={24} />
          </button>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onHome?.();
            }}
            className="flex items-center"
            aria-label="Athan Academy home"
          >
            <img src="/aa-logo.svg" alt="Athan Academy" className="h-32 w-auto lg:h-36" />
          </a>
        </div>

        {/* Right: Blog (desktop) + profile pill / visitor CTAs */}
        <nav className="flex items-center gap-12 lg:gap-16">
          <a
            href="#"
            className="hidden rounded-sm px-12 py-8 text-md text-neutral-0 transition-colors hover:text-secondary-200 lg:block"
          >
            Blog
          </a>

          {visitor ? (
            <>
              <button
                type="button"
                className="hidden rounded-full bg-secondary-800 px-20 py-8 text-sm font-medium text-neutral-0 transition-colors hover:bg-secondary-700 lg:block"
              >
                Login
              </button>
              <button
                type="button"
                onClick={onEnroll}
                className="rounded-full bg-primary-500 px-20 py-8 text-sm font-semibold text-secondary-1000 transition-colors hover:bg-primary-400"
              >
                Enroll Now
              </button>
            </>
          ) : (
            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className={[
                  "flex items-center gap-8 rounded-full bg-secondary-800 p-8 lg:py-8 lg:pl-8 lg:pr-12",
                  "transition-colors hover:bg-secondary-700",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500",
                ].join(" ")}
              >
                <span className="grid size-28 place-items-center rounded-full bg-secondary-600 text-xs font-semibold text-neutral-0">
                  {userName.charAt(0).toUpperCase()}
                </span>
                <span className="hidden text-sm font-medium text-neutral-0 lg:block">{userName}</span>
                <Icon
                  name="chevron-down"
                  size={16}
                  className={`text-secondary-300 transition-transform duration-micro ${menuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-50 mt-4 flex w-[180px] flex-col rounded-md border border-secondary-800 bg-secondary-1000 p-4 shadow-xl"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      onLogout?.();
                    }}
                    className="flex items-center gap-12 rounded-sm px-12 py-8 text-left text-md text-neutral-0 transition-colors hover:bg-overlay-white-8"
                  >
                    <Icon name="log-out" size={18} />
                    Log out
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={close}
            className="animate-fade-in absolute inset-0"
            style={{ backgroundColor: "var(--c-overlay-black-55)" }}
          />
          {/* Panel */}
          <div className="absolute inset-y-0 left-0 flex w-[320px] max-w-[85%] flex-col overflow-y-auto bg-secondary-3 shadow-xl">
            <div className="flex items-center justify-between px-16 py-16">
              <img src="/aa-logo.svg" alt="Athan Academy" className="h-32 w-auto" />
              <button
                type="button"
                onClick={close}
                aria-label="Close menu"
                className="grid size-36 place-items-center rounded-sm text-neutral-0 transition-colors hover:bg-overlay-white-8"
              >
                <Icon name="x" size={20} />
              </button>
            </div>

            {mobileMenu ? (
              mobileMenu(close)
            ) : visitor ? (
              <nav className="flex flex-col gap-8 px-12 py-8">
                <a
                  href="#"
                  onClick={close}
                  className="rounded-sm px-12 py-12 text-md text-neutral-0 transition-colors hover:bg-overlay-white-8"
                >
                  Blog
                </a>
                <button
                  type="button"
                  onClick={close}
                  className="rounded-full bg-secondary-800 px-20 py-12 text-md font-medium text-neutral-0 transition-colors hover:bg-secondary-700"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onEnroll?.();
                    close();
                  }}
                  className="rounded-full bg-primary-500 px-20 py-12 text-md font-semibold text-secondary-1000 transition-colors hover:bg-primary-400"
                >
                  Enroll Now
                </button>
              </nav>
            ) : (
              <nav className="flex flex-col gap-4 px-12 py-8">
                <a
                  href="#"
                  onClick={close}
                  className="rounded-sm px-12 py-12 text-md text-neutral-0 transition-colors hover:bg-overlay-white-8"
                >
                  Blog
                </a>
                <button
                  type="button"
                  onClick={close}
                  className="rounded-sm px-12 py-12 text-left text-md text-neutral-0 transition-colors hover:bg-overlay-white-8"
                >
                  Log out
                </button>
              </nav>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
