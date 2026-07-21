/**
 * ActionMenu — a kebab (⋮) trigger that opens a list of actions. On desktop it
 * shows an anchored dropdown; on mobile a bottom sheet. Used for the discussion
 * post menu (Edit / Delete / Report / Pin).
 */
import { useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "./Icon";
import { BottomSheet } from "./BottomSheet";
import { useIsDesktop } from "../hooks/useIsDesktop";

export interface ActionItem {
  label: string;
  icon: IconName;
  onSelect: () => void;
  danger?: boolean;
}

export function ActionMenu({
  items,
  label = "More actions",
  forceMobile = false,
}: {
  items: ActionItem[];
  label?: string;
  /** Always render the BottomSheet variant, ignoring actual window width — see ResponsiveModal. */
  forceMobile?: boolean;
}) {
  const isDesktop = useIsDesktop() && !forceMobile;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Desktop: close on outside click.
  useEffect(() => {
    if (!open || !isDesktop) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, isDesktop]);

  const run = (fn: () => void) => {
    setOpen(false);
    fn();
  };

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="grid size-36 place-items-center rounded-full text-secondary-300 transition-colors hover:bg-overlay-white-8 hover:text-neutral-0"
      >
        <Icon name="more-vertical" size={20} />
      </button>

      {open && isDesktop && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-4 flex w-[180px] flex-col rounded-md border border-secondary-800 bg-secondary-1000 p-4 shadow-xl"
        >
          {items.map((it) => (
            <button
              key={it.label}
              type="button"
              role="menuitem"
              onClick={(e) => {
                e.stopPropagation();
                run(it.onSelect);
              }}
              className={`flex items-center gap-12 rounded-sm px-12 py-8 text-left text-md transition-colors hover:bg-overlay-white-8 ${
                it.danger ? "text-error-300" : "text-neutral-0"
              }`}
            >
              <Icon name={it.icon} size={18} />
              {it.label}
            </button>
          ))}
        </div>
      )}

      {open && !isDesktop && (
        <BottomSheet onClose={() => setOpen(false)} showClose={false}>
          <div className="flex flex-col gap-4">
            {items.map((it) => (
              <button
                key={it.label}
                type="button"
                onClick={() => run(it.onSelect)}
                className={`flex items-center gap-16 rounded-sm px-12 py-16 text-left text-lg transition-colors hover:bg-overlay-white-8 ${
                  it.danger ? "text-error-300" : "text-neutral-0"
                }`}
              >
                <Icon name={it.icon} size={22} />
                {it.label}
              </button>
            ))}
          </div>
        </BottomSheet>
      )}
    </div>
  );
}
