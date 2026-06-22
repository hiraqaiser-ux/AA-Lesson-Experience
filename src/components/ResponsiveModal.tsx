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
}: {
  onClose: () => void;
  title?: string;
  children: ReactNode;
}) {
  const isDesktop = useIsDesktop();

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
