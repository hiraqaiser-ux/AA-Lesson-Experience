import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-primary-500 text-secondary-1000 hover:bg-primary-400 active:bg-primary-600",
  secondary:
    "bg-transparent text-neutral-0 border border-secondary-800 hover:bg-overlay-white-8",
  ghost: "bg-transparent text-primary-500 hover:bg-overlay-white-8",
};

export function Button({
  children,
  variant = "primary",
  fullWidth = false,
  className = "",
  ...rest
}: {
  children: ReactNode;
  variant?: Variant;
  fullWidth?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center gap-8 rounded-full px-16 py-12",
        "text-sm font-semibold transition-colors duration-300 ease-in-out",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500",
        VARIANTS[variant],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
}
