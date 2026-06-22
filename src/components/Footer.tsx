/**
 * Footer — site footer for the main pages (logo, nav links, copyright).
 * Stacks on mobile, spreads to a row on desktop. 16px side padding on mobile.
 * NOTE: no Figma reference yet — minimal, token-only placeholder for review.
 */
const LINKS = ["About", "Blog", "Privacy", "Terms", "Contact"];

export function Footer() {
  return (
    <footer className="mt-40 border-t border-secondary-900 bg-secondary-1000">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-16 px-16 py-32 md:flex-row md:items-center md:justify-between md:px-40">
        <a href="#" className="flex items-center" aria-label="Athan Academy home">
          <img src="/aa-logo.svg" alt="Athan Academy" className="h-28 w-auto" />
        </a>

        <nav className="flex flex-wrap gap-x-24 gap-y-8">
          {LINKS.map((l) => (
            <a
              key={l}
              href="#"
              className="text-sm text-secondary-400 transition-colors hover:text-neutral-0"
            >
              {l}
            </a>
          ))}
        </nav>

        <p className="text-xs text-secondary-500">
          © 2026 Athan Academy. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
