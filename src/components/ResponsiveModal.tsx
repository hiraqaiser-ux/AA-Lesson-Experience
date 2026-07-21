/**
 * ResponsiveModal — one popup that renders as a centered Dialog on desktop and
 * a BottomSheet on mobile. Used for the discussion Edit / Delete / Report flows.
 */
import type { ReactNode } from "react";
import { Dialog } from "./Dialog";
import { BottomSheet } from "./BottomSheet";
import { useIsDesktop } from "../hooks/useIsDesktop";

export function ResponsiveModal({
  onClose,
  title,
  children,
  forceMobile = false,
}: {
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** Always render the BottomSheet variant, ignoring actual window width — for the mobile prototype, which simulates a phone frame inside a browser window that may itself be wide. */
  forceMobile?: boolean;
}) {
  const isDesktop = useIsDesktop() && !forceMobile;

  if (isDesktop) {
    return (
      <Dialog onClose={onClose} className="gap-16">
        {title && <h2 className="text-lg-2 font-semibold text-neutral-0">{title}</h2>}
        {children}
      </Dialog>
    );
  }
  return (
    <BottomSheet onClose={onClose} title={title}>
      {children}
    </BottomSheet>
  );
}
