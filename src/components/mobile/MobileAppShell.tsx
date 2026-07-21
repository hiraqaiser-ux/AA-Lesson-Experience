/**
 * MobileAppShell — chrome for the new mobile "Home" / "Explore" / "Settings"
 * concept (Figma nodes 43882:79195 "Home", 43882:79235 "Explore",
 * 43888:19880 "Settings"): a slim top bar (logo + persona switcher +
 * notification bell) and a 4-item bottom tab bar. Read Quran stays a visual
 * placeholder until that screen is in scope.
 */
import type { ReactNode } from "react";
import { Icon, type IconName } from "../Icon";
import { MobilePersonaSwitcher } from "./MobilePersonaSwitcher";
import type { PersonaId } from "../../data/personas";

export type MobileTab = "home" | "explore" | "read-quran" | "settings";

/** gap: icon-to-label gap. fixedWidth: false only for Read Quran, matching the Figma nav bar (node 43810:66294). */
const TABS: { id: MobileTab; label: string; icon: IconName; enabled: boolean; gap: "gap-4" | "gap-[2px]"; fixedWidth: boolean }[] = [
  { id: "home", label: "Home", icon: "home", enabled: true, gap: "gap-4", fixedWidth: true },
  { id: "explore", label: "Explore", icon: "compass", enabled: true, gap: "gap-4", fixedWidth: true },
  { id: "read-quran", label: "Read Quran", icon: "book", enabled: false, gap: "gap-[2px]", fixedWidth: false },
  { id: "settings", label: "Settings", icon: "settings", enabled: true, gap: "gap-[2px]", fixedWidth: true },
];

function MobileTopBar({
  persona,
  onChangePersona,
  hasNotification = true,
}: {
  persona: PersonaId;
  onChangePersona: (id: PersonaId) => void;
  hasNotification?: boolean;
}) {
  return (
    <div className="flex h-[68px] w-full shrink-0 items-center justify-between bg-secondary-1000 px-16">
      <img src="/aa-logo-mobile.svg" alt="Athan Academy" className="h-[25px] w-auto" />
      <div className="flex items-center gap-8">
        <MobilePersonaSwitcher persona={persona} onChange={onChangePersona} />
        <button
          type="button"
          aria-label={hasNotification ? "Notifications (unread)" : "Notifications"}
          className="relative grid size-36 place-items-center rounded-sm text-neutral-0 transition-colors hover:bg-overlay-white-8"
        >
          <Icon name="bell" size={24} />
          {hasNotification && (
            <span
              aria-hidden
              className="absolute right-[6px] top-[6px] size-8 rounded-full bg-error ring-2 ring-secondary-1000"
            />
          )}
        </button>
      </div>
    </div>
  );
}

function MobileBottomNav({
  active,
  onChange,
}: {
  active: MobileTab;
  onChange: (tab: MobileTab) => void;
}) {
  return (
    <nav
      aria-label="Primary"
      className="flex w-full shrink-0 items-center justify-center gap-24 bg-secondary-3 px-16 pb-16 pt-[10px]"
    >
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            disabled={!tab.enabled}
            aria-current={isActive ? "page" : undefined}
            onClick={() => tab.enabled && onChange(tab.id)}
            className={[
              "flex flex-col items-center rounded-sm py-4 transition-colors",
              tab.gap,
              tab.fixedWidth ? "w-[76px]" : "",
              tab.enabled ? "hover:bg-overlay-white-8" : "cursor-not-allowed opacity-40",
            ].join(" ")}
          >
            <Icon name={tab.icon} size={24} className={isActive ? "text-neutral-0" : "text-neutral-300"} />
            <span
              className={[
                "whitespace-nowrap text-sm",
                isActive ? "font-bold text-neutral-0" : "font-semibold text-neutral-300",
              ].join(" ")}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

/**
 * A single mobile-viewport-width (390px) frame with top bar + scrollable content + bottom nav.
 * `transform` (an identity transform, visually a no-op) makes this element the CSS containing
 * block for any `position: fixed` descendant — every popup/sheet/dialog in the mobile prototype
 * (BottomSheet, Dialog, MobilePostDetailPage, etc.) uses `fixed inset-0`, which would otherwise
 * cover the *actual* browser viewport instead of staying inside this simulated phone frame.
 */
export function MobileAppShell({
  active,
  onChangeTab,
  persona,
  onChangePersona,
  floating,
  children,
}: {
  active: MobileTab;
  onChangeTab: (tab: MobileTab) => void;
  persona: PersonaId;
  onChangePersona: (id: PersonaId) => void;
  /** Pinned above the content, unaffected by scroll (e.g. a "continue learning" card). */
  floating?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="relative mx-auto flex h-[812px] w-[390px] transform flex-col overflow-hidden bg-secondary-1000">
      <MobileTopBar persona={persona} onChangePersona={onChangePersona} />
      <div className="relative min-h-0 flex-1">
        <div className="absolute inset-0 flex flex-col overflow-y-auto">{children}</div>
        {floating && <div className="pointer-events-none absolute inset-x-0 bottom-16 z-30 px-16">{floating}</div>}
      </div>
      <MobileBottomNav active={active} onChange={onChangeTab} />
    </div>
  );
}
