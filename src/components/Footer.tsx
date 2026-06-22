/**
 * Footer — marketing footer (per Figma node 43370:6206).
 * Top: brand mark + "download" heading (left) / QR + store badges (right).
 * Divider, then a bottom bar: social + policy links (left) / "Powered By" (right).
 * Stacks on mobile, spreads to a row from md+. Token-only; 4px grid.
 *
 * ASSET PLACEHOLDERS (flagged for review — not in the design system yet):
 *  - StoreBadge: token-styled buttons; swap for the official App Store /
 *    Google Play badge artwork when available.
 *  - PoweredBy: text + a generic mark stands in for the IslamicFinder logo.
 *
 * Provided assets: /app-icon.png (square app icon) and /download-qr.png (QR).
 */
import { Icon } from "./Icon";

const POLICY_LINKS: { label: string; bold?: boolean }[] = [
  { label: "Terms of usage" },
  { label: "Our policies" },
  { label: "Partner with us", bold: true },
];

/** Square "Academy" app icon (rounded corners baked into the artwork). */
function AppMark() {
  return <img src="/app-icon.png" alt="" aria-hidden="true" className="size-[96px] rounded-lg" />;
}

/** Download QR on a white tile with the brand blue frame. */
function QrCode() {
  return (
    <div className="rounded-md border-4 border-avatar-blue bg-neutral-0 p-8">
      <img
        src="/download-qr.png"
        alt="QR code to download the Athan Academy app"
        className="block size-[88px]"
      />
    </div>
  );
}

/** App Store / Google Play badge — token-styled button (swap for official art). */
function StoreBadge({
  glyph,
  eyebrow,
  label,
}: {
  glyph: "apple" | "play";
  eyebrow: string;
  label: string;
}) {
  return (
    <a
      href="#"
      className="flex items-center gap-8 rounded-md border border-secondary-800 bg-neutral-1000 px-12 py-8 transition-colors hover:border-secondary-700"
      aria-label={`${eyebrow} ${label}`}
    >
      <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor" className="shrink-0 text-neutral-0" aria-hidden="true">
        {glyph === "apple" ? (
          <path d="M17.05 12.04c-.03-2.6 2.13-3.84 2.22-3.9-1.21-1.78-3.1-2.02-3.77-2.05-1.6-.16-3.13.94-3.94.94-.81 0-2.07-.92-3.4-.89-1.75.03-3.36 1.02-4.26 2.58-1.82 3.16-.47 7.84 1.3 10.4.86 1.25 1.89 2.65 3.24 2.6 1.3-.05 1.79-.84 3.36-.84 1.57 0 2 .84 3.39.81 1.4-.02 2.28-1.27 3.14-2.53.99-1.45 1.4-2.86 1.42-2.93-.03-.01-2.72-1.04-2.75-4.14M14.7 4.65c.71-.86 1.19-2.06 1.06-3.25-1.02.04-2.26.68-2.99 1.53-.66.77-1.23 1.99-1.08 3.16 1.14.09 2.3-.58 3.01-1.44" />
        ) : (
          <path d="M4 3.5v17a1 1 0 0 0 1.52.85l13.5-8.5a1 1 0 0 0 0-1.7L5.52 2.65A1 1 0 0 0 4 3.5z" />
        )}
      </svg>
      <span className="flex flex-col leading-tight">
        <span className="text-xs text-secondary-300">{eyebrow}</span>
        <span className="text-sm font-semibold text-neutral-0">{label}</span>
      </span>
    </a>
  );
}

export function Footer() {
  return (
    <footer className="mt-40 bg-secondary-980">
      <div className="mx-auto flex w-full flex-col gap-32 px-16 py-40 md:px-40 lg:px-[92px]">
        {/* Top — brand + heading (left) / QR + store badges (right) */}
        <div className="flex flex-col gap-32 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-24">
            <a href="#" className="inline-flex" aria-label="Athan Academy home">
              <AppMark />
            </a>
            <h2 className="max-w-[440px] text-xl font-bold text-neutral-0 md:text-2xl">
              Let&apos;s start learning. Download Athan Academy.
            </h2>
          </div>

          <div className="flex flex-col items-start gap-12 md:items-end">
            <QrCode />
            <span className="text-sm font-semibold text-neutral-0">Scan to Download the App</span>
            <div className="flex flex-wrap items-center gap-12">
              <StoreBadge glyph="apple" eyebrow="Download on the" label="App Store" />
              <StoreBadge glyph="play" eyebrow="GET IT ON" label="Google Play" />
            </div>
          </div>
        </div>

        <hr className="border-0 border-t border-secondary-800" />

        {/* Bottom bar — social + policy links (left) / powered by (right) */}
        <div className="flex flex-col gap-16 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-24 gap-y-12">
            <a
              href="#"
              className="flex items-center gap-8 text-sm font-semibold text-neutral-0 transition-colors hover:text-primary-500"
            >
              <Icon name="instagram" size={20} />
              Follow us on Instagram
            </a>
            <span className="flex flex-wrap items-center gap-8 text-sm">
              {POLICY_LINKS.map((link, i) => (
                <span key={link.label} className="flex items-center gap-8">
                  {i > 0 && <span className="text-secondary-600" aria-hidden="true">|</span>}
                  <a
                    href="#"
                    className={[
                      "transition-colors hover:text-neutral-0",
                      link.bold ? "font-semibold text-neutral-0" : "text-secondary-200",
                    ].join(" ")}
                  >
                    {link.label}
                  </a>
                </span>
              ))}
            </span>
          </div>

          <p className="flex items-center gap-8 text-sm text-secondary-400">
            Powered By
            <span className="flex items-center gap-4 font-semibold text-neutral-0">
              <Icon name="pin" size={16} className="text-success" />
              IslamicFinder
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
