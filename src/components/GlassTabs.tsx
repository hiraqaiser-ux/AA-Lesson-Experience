/**
 * Pill tabs with a frosted-glass selected state (About / Lessons / Discussions).
 * `dense` tightens spacing/size for the docked (floating) variant.
 * `dot` renders a lime status dot on the given tab (e.g. Discussions).
 */
export function GlassTabs({
  tabs,
  active,
  onChange,
  dense = false,
  dot,
}: {
  tabs: string[];
  active: string;
  onChange: (t: string) => void;
  dense?: boolean;
  dot?: string;
}) {
  return (
    <div className={["flex items-center justify-center", dense ? "gap-8" : "gap-4 sm:gap-32"].join(" ")}>
      {tabs.map((t) => {
        const isActive = t === active;
        return (
          <button
            key={t}
            type="button"
            onClick={() => onChange(t)}
            className={[
              "relative rounded-full font-medium transition-colors duration-300 ease-in-out",
              dense ? "px-16 py-8 text-md" : "px-12 py-8 text-md sm:px-16 sm:text-lg-2",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500",
              isActive
                ? "bg-overlay-white-12 text-neutral-0 backdrop-blur-md"
                : "text-secondary-400 hover:bg-overlay-white-8 hover:text-neutral-0",
            ].join(" ")}
          >
            {t}
            {dot === t && (
              <span className="absolute right-8 top-8 size-8 rounded-full bg-primary-500" />
            )}
          </button>
        );
      })}
    </div>
  );
}
