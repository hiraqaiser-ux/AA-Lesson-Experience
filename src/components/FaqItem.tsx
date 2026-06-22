import { useState } from "react";
import { Icon } from "./Icon";

export function FaqItem({
  question,
  answer,
  defaultOpen = false,
}: {
  question: string;
  answer?: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-secondary-800">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="group flex w-full items-center gap-16 py-16 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500"
      >
        <span className="flex-1 text-md font-medium text-neutral-0 transition-colors duration-300 group-hover:text-neutral-0">
          {question}
        </span>
        <span className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full border border-secondary-800 text-secondary-300">
          <Icon name={open ? "minus" : "plus"} size={18} />
        </span>
      </button>
      {open && answer && (
        <p className="pb-16 text-md leading-relaxed text-secondary-300">{answer}</p>
      )}
    </div>
  );
}
