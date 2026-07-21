/**
 * MobilePersonaSwitcher — presentation-only control in the mobile top bar to
 * preview the experience as Visitor / Enrolled Student / Teacher. Controlled
 * (persona/onChange props) rather than calling usePersona itself — the
 * screen that owns the tab shell (MobileNewsfeedScreen) holds the single
 * usePersona() instance and threads it down, so every consumer stays in
 * sync (see PERSONAS for the same persona model the web NavBar's account
 * switcher uses).
 * Single-letter trigger (V/E/T) by request, to stay out of the way in the
 * compact top bar — this is a demo aid, not a real account switcher, so the
 * Teacher Assistant persona is intentionally left out.
 */
import { useEffect, useRef, useState } from "react";
import { PERSONAS, type PersonaId } from "../../data/personas";
import { Icon } from "../Icon";

const OPTIONS: { id: PersonaId; letter: string; label: string }[] = [
  { id: "visitor", letter: "V", label: "Visitor" },
  { id: "student", letter: "E", label: PERSONAS.student.label },
  { id: "teacher", letter: "T", label: PERSONAS.teacher.label },
];

export function MobilePersonaSwitcher({
  persona,
  onChange,
}: {
  persona: PersonaId;
  onChange: (id: PersonaId) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const active = OPTIONS.find((o) => o.id === persona) ?? OPTIONS[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Previewing as ${active.label}. Change persona`}
        className="grid size-36 place-items-center rounded-full bg-secondary-800 text-sm font-bold text-neutral-0 transition-colors hover:bg-secondary-700"
      >
        {active.letter}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-4 flex w-[176px] flex-col rounded-md border border-secondary-800 bg-secondary-1000 p-4 shadow-xl"
        >
          {OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              role="menuitemradio"
              aria-checked={opt.id === persona}
              onClick={() => {
                onChange(opt.id);
                setOpen(false);
              }}
              className={[
                "flex items-center gap-12 rounded-sm px-12 py-8 text-left text-md transition-colors hover:bg-overlay-white-8",
                opt.id === persona ? "font-semibold text-primary-500" : "text-neutral-0",
              ].join(" ")}
            >
              <span
                aria-hidden
                className="grid size-24 shrink-0 place-items-center rounded-full bg-secondary-800 text-sm font-bold"
              >
                {opt.letter}
              </span>
              {opt.label}
              {opt.id === persona && <Icon name="check" size={16} className="ml-auto" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
