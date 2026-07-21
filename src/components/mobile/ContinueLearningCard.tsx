/**
 * ContinueLearningCard — floating "pick up where you left off" card for the
 * enrolled course, pinned above the bottom nav on the Home tab (per
 * reference: a Substack-style "Keep reading" card — thumbnail + two lines of
 * text + a dismiss button, floating over the scrolling content).
 * Frosted-glass background reuses the same bg-overlay-white-12 +
 * backdrop-blur-md pairing as GlassTabs/VideoPlayer — the DS's existing
 * "glass" idiom, not a new effect.
 * Dismissal is local to this mount (no persistence requested).
 */
import { useState } from "react";
import { Icon } from "../Icon";
import type { School } from "../../data/newsfeed";

export function ContinueLearningCard({ school, onOpen }: { school: School; onOpen: () => void }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="pointer-events-auto flex items-center gap-12 rounded-md bg-overlay-white-12 p-8 pr-12 shadow-xl backdrop-blur-md">
      <button type="button" onClick={onOpen} className="flex min-w-0 flex-1 items-center gap-12 text-left">
        {school.instructorImage ? (
          <img src={school.instructorImage} alt="" className="size-48 shrink-0 rounded-md object-cover" />
        ) : (
          <span className="grid size-48 shrink-0 place-items-center rounded-md bg-secondary-800 text-md font-semibold text-neutral-0">
            {school.name.charAt(0)}
          </span>
        )}
        <span className="flex min-w-0 flex-col gap-4">
          <span className="text-sm text-secondary-300">Continue Learning</span>
          <span className="truncate text-md font-medium text-neutral-0">{school.course}</span>
        </span>
      </button>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="grid size-28 shrink-0 place-items-center rounded-full text-secondary-300 transition-colors hover:bg-overlay-white-8 hover:text-neutral-0"
      >
        <Icon name="x" size={16} />
      </button>
    </div>
  );
}
