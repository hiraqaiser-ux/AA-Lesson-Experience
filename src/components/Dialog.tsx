/**
 * Dialog — reusable popup shell (the saved Athan popup design).
 * Dimmed backdrop + centered card: rounded-[20px], bg secondary-3, soft shadow,
 * NO stroke, optional close button, Escape-to-close. Compose any popup content
 * as children. Pass layout utilities (gap, items-*) via `className`.
 */
import { useEffect } from "react";
import type { ReactNode } from "react";
import { Icon } from "./Icon";

export function Dialog({
  onClose,
  children,
  showClose = true,
  className = "",
}: {
  onClose: () => void;
  children: ReactNode;
  showClose?: boolean;
  className?: string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

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
        className={`animate-message-in relative flex w-full max-w-[520px] flex-col rounded-[20px] bg-secondary-3 px-32 pb-40 pt-32 shadow-2xl ${className}`}
      >
        {showClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-16 top-16 grid size-32 place-items-center rounded-full bg-overlay-white-12 text-neutral-0 transition-transform hover:scale-105"
          >
            <Icon name="x" size={14} />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
