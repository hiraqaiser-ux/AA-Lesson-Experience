/**
 * BottomSheet — mobile-first sheet that slides up from the bottom edge.
 * Dimmed backdrop + rounded-top panel with a drag handle. Escape / backdrop
 * close. Used for menus and popups on mobile (the desktop counterpart is Dialog).
 */
import { useEffect } from "react";
import type { ReactNode } from "react";
import { Icon } from "./Icon";

export function BottomSheet({
  onClose,
  title,
  children,
  showClose = true,
}: {
  onClose: () => void;
  title?: string;
  children: ReactNode;
  showClose?: boolean;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex flex-col justify-end">
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
        className="animate-sheet-in relative flex max-h-[85vh] w-full flex-col gap-20 rounded-t-[28px] bg-secondary-3 px-20 pb-32 pt-12"
      >
        <span className="mx-auto h-4 w-40 shrink-0 rounded-full bg-secondary-700" />
        {(title || showClose) && (
          <div className="relative flex min-h-[32px] items-center justify-center">
            {title && <h2 className="text-lg font-semibold text-neutral-0">{title}</h2>}
            {showClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute right-0 top-1/2 grid size-32 -translate-y-1/2 place-items-center rounded-full bg-overlay-white-12 text-neutral-0 transition-transform hover:scale-105"
              >
                <Icon name="x" size={14} />
              </button>
            )}
          </div>
        )}
        <div className="flex min-h-0 flex-1 flex-col gap-24 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
