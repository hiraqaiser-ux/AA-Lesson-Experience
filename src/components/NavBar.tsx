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
import { NotifyMeButton } from "./NotifyMeButton";

/** A primary navigation link (e.g. Home / Courses / Blogs). */
export interface NavLink {
  label: string;
  /** Click handler (for in-app navigation). Takes precedence over `href`. */
  onClick?: () => void;
  /** Fallback link target when there's no handler. */
  href?: string;
  /** Highlights the current section. */
  active?: boolean;
}

/** One entry in the account/persona switcher. */
export interface AccountSwitcherOption {
  id: string;
  label: string;
  /** Highlights this option as the currently active account. */
  active: boolean;
  onSelect: () => void;
}

/** "Switch account" section in the profile dropdown/drawer — e.g. previewing different personas. */
export interface AccountSwitcher {
  options: AccountSwitcherOption[];
}

export function NavBar({
  userName = "Hira",
  mobileMenu,
  onHome,
  visitor = false,
  onEnroll,
  onLogout,
  links,
  elevateOnScroll = false,
  visitorCta = "login-enroll",
  mobileFooter,
  avatarUrl,
  avatarColorClassName,
  accountSwitcher,
  seatsFull = false,
  waitlisted = false,
  onNotify,
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
  /**
   * Primary nav links (Home / Courses / Blogs). When provided they replace the
   * default single "Blog" link (desktop row + mobile drawer). Omitting them
   * leaves the original nav unchanged.
   */
  links?: NavLink[];
  /** Adds a drop shadow to the (sticky) nav once the page is scrolled. */
  elevateOnScroll?: boolean;
  /**
   * Visitor call-to-action set:
   * - "login-enroll" (default): secondary Login + primary Enroll Now.
   * - "login-only": a single primary Login button.
   */
  visitorCta?: "login-enroll" | "login-only";
  /** Extra content rendered at the bottom of the mobile drawer (e.g. a callout card). */
  mobileFooter?: ReactNode;
  /** Optional profile-pill photo; falls back to the initials chip when omitted. */
  avatarUrl?: string;
  /** Background class for the initials chip when no `avatarUrl` (defaults to bg-secondary-600). */
  avatarColorClassName?: string;
  /** "Switch account" section rendered above "Log out" in the dropdown/drawer. */
  accountSwitcher?: AccountSwitcher;
  /** When the course batch is full, the "Enroll Now" CTA becomes "Notify Me". */
  seatsFull?: boolean;
  /** Whether the visitor has already joined the waitlist. */
  waitlisted?: boolean;
  /** Opens the Enrollment Unavailable popup (the "Notify Me" flow). */
  onNotify?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  // Drop shadow once the page scrolls (opt-in via `elevateOnScroll`).
  useEffect(() => {
    if (!elevateOnScroll) return;
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [elevateOnScroll]);

  /** Anchor click → run the handler (and prevent navigation) when present. */
  const onLinkClick = (link: NavLink) => (e: React.MouseEvent) => {
    if (link.onClick) {
      e.preventDefault();
      link.onClick();
    }
  };

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
    <header
      className={`sticky top-0 z-40 w-full bg-secondary-1000 transition-shadow duration-micro ${
        elevateOnScroll && scrolled ? "shadow-lg" : ""
      }`}
    >
      <div className="relative mx-auto flex max-w-[1440px] items-center justify-between px-16 py-16 lg:px-64 lg:py-20">
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

        {/* Primary nav links — centered (desktop) */}
        {links && (
          <nav
            className="absolute inset-y-0 left-1/2 hidden -translate-x-1/2 items-center gap-4 lg:flex"
            aria-label="Primary"
          >
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href ?? "#"}
                onClick={onLinkClick(l)}
                aria-current={l.active ? "page" : undefined}
                className={[
                  "rounded-sm px-12 py-8 text-md transition-colors",
                  l.active
                    ? "font-semibold text-neutral-0"
                    : "text-secondary-200 hover:text-neutral-0",
                ].join(" ")}
              >
                {l.label}
              </a>
            ))}
          </nav>
        )}

        {/* Right: Blog (desktop) + profile pill / visitor CTAs */}
        <nav className="flex items-center gap-12 lg:gap-16">
          {!links && (
            <a
              href="#"
              className="hidden rounded-sm px-12 py-8 text-lg text-neutral-0 transition-colors hover:text-secondary-200 lg:block"
            >
              Blog
            </a>
          )}

          {visitor ? (
            visitorCta === "login-only" ? (
              <button
                type="button"
                onClick={onEnroll}
                className="rounded-full bg-primary-500 px-20 py-8 text-sm font-semibold text-secondary-1000 transition-colors hover:bg-primary-400"
              >
                Sign in
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onEnroll}
                  className="hidden rounded-full bg-secondary-800 px-20 py-8 text-sm font-medium text-neutral-0 transition-colors hover:bg-secondary-700 lg:block"
                >
                  Login
                </button>
                {seatsFull ? (
                  <NotifyMeButton
                    joined={waitlisted}
                    onNotify={onNotify ?? (() => {})}
                    className="px-20 py-8 text-sm"
                    tooltipSide="bottom"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={onEnroll}
                    className="rounded-full bg-primary-500 px-20 py-8 text-sm font-semibold text-secondary-1000 transition-colors hover:bg-primary-400"
                  >
                    Enroll Now
                  </button>
                )}
              </>
            )
          ) : (
            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className={[
                  "flex items-center gap-8 rounded-lg bg-secondary-800 p-8 lg:py-8 lg:pl-8 lg:pr-12",
                  "transition-colors hover:bg-secondary-700",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500",
                ].join(" ")}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" className="size-32 shrink-0 rounded-full object-cover" />
                ) : (
                  <span
                    className={`grid size-32 place-items-center rounded-full text-md font-bold ${
                      avatarColorClassName
                        ? `${avatarColorClassName} text-neutral-0`
                        : "bg-secondary-200 text-neutral-900"
                    }`}
                  >
                    {userName.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="hidden text-sm font-bold text-neutral-0 lg:block">{userName}</span>
                <Icon
                  name="chevron-down"
                  size={16}
                  className={`text-secondary-300 transition-transform duration-micro ${menuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-50 mt-4 flex w-[220px] flex-col rounded-md border border-secondary-800 bg-secondary-1000 p-4 shadow-xl"
                >
                  {accountSwitcher && (
                    <>
                      {accountSwitcher.options.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          role="menuitemradio"
                          aria-checked={opt.active}
                          onClick={() => {
                            setMenuOpen(false);
                            opt.onSelect();
                          }}
                          className={[
                            "flex items-center justify-between gap-12 rounded-sm px-12 py-8 text-left text-md transition-colors hover:bg-overlay-white-8",
                            opt.active ? "font-semibold text-primary-500" : "text-neutral-0",
                          ].join(" ")}
                        >
                          {opt.label}
                          {opt.active && <Icon name="check" size={16} />}
                        </button>
                      ))}
                      <hr className="my-4 border-0 border-t border-secondary-900" />
                    </>
                  )}
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
                {links ? (
                  links.map((l) => (
                    <a
                      key={l.label}
                      href={l.href ?? "#"}
                      onClick={(e) => {
                        onLinkClick(l)(e);
                        close();
                      }}
                      aria-current={l.active ? "page" : undefined}
                      className={[
                        "rounded-sm px-12 py-12 text-md transition-colors hover:bg-overlay-white-8",
                        l.active ? "font-semibold text-neutral-0" : "text-neutral-0",
                      ].join(" ")}
                    >
                      {l.label}
                    </a>
                  ))
                ) : (
                  <a
                    href="#"
                    onClick={close}
                    className="rounded-sm px-12 py-12 text-md text-neutral-0 transition-colors hover:bg-overlay-white-8"
                  >
                    Blog
                  </a>
                )}
                {visitorCta === "login-only" ? (
                  <button
                    type="button"
                    onClick={() => {
                      onEnroll?.();
                      close();
                    }}
                    className="rounded-full bg-primary-500 px-20 py-12 text-md font-semibold text-secondary-1000 transition-colors hover:bg-primary-400"
                  >
                    Sign in
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        onEnroll?.();
                        close();
                      }}
                      className="rounded-full bg-secondary-800 px-20 py-12 text-md font-medium text-neutral-0 transition-colors hover:bg-secondary-700"
                    >
                      Login
                    </button>
                    {seatsFull ? (
                      <NotifyMeButton
                        joined={waitlisted}
                        onNotify={() => {
                          onNotify?.();
                          close();
                        }}
                        className="w-full px-20 py-12 text-md"
                        showCaption
                      />
                    ) : (
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
                    )}
                  </>
                )}
              </nav>
            ) : (
              <nav className="flex flex-col gap-4 px-12 py-8">
                {links ? (
                  links.map((l) => (
                    <a
                      key={l.label}
                      href={l.href ?? "#"}
                      onClick={(e) => {
                        onLinkClick(l)(e);
                        close();
                      }}
                      aria-current={l.active ? "page" : undefined}
                      className={[
                        "rounded-sm px-12 py-12 text-md transition-colors hover:bg-overlay-white-8",
                        l.active ? "font-semibold text-neutral-0" : "text-neutral-0",
                      ].join(" ")}
                    >
                      {l.label}
                    </a>
                  ))
                ) : (
                  <a
                    href="#"
                    onClick={close}
                    className="rounded-sm px-12 py-12 text-md text-neutral-0 transition-colors hover:bg-overlay-white-8"
                  >
                    Blog
                  </a>
                )}
                {accountSwitcher && (
                  <>
                    {accountSwitcher.options.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        role="menuitemradio"
                        aria-checked={opt.active}
                        onClick={() => {
                          opt.onSelect();
                          close();
                        }}
                        className={[
                          "flex items-center justify-between gap-12 rounded-sm px-12 py-12 text-left text-md transition-colors hover:bg-overlay-white-8",
                          opt.active ? "font-semibold text-primary-500" : "text-neutral-0",
                        ].join(" ")}
                      >
                        {opt.label}
                        {opt.active && <Icon name="check" size={16} />}
                      </button>
                    ))}
                  </>
                )}
                <button
                  type="button"
                  onClick={() => {
                    onLogout?.();
                    close();
                  }}
                  className="rounded-sm px-12 py-12 text-left text-md text-neutral-0 transition-colors hover:bg-overlay-white-8"
                >
                  Log out
                </button>
              </nav>
            )}

            {mobileFooter && <div className="px-12 py-8">{mobileFooter}</div>}
          </div>
        </div>
      )}
    </header>
  );
}
