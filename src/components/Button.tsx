import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-primary-500 text-secondary-1000 hover:bg-primary-400 active:bg-primary-600",
  secondary:
    "bg-transparent text-neutral-0 border border-secondary-800 hover:bg-overlay-white-8",
  ghost: "bg-transparent text-primary-300 underline-offset-2 hover:underline",
};

const SIZES: Record<Size, string> = {
  md: "px-16 py-12 text-sm",
  lg: "px-24 py-16 text-md",
};

// Ghost is a text button — keeps the vertical rhythm/text size but no horizontal padding.
const GHOST_SIZES: Record<Size, string> = {
  md: "py-12 text-sm",
  lg: "py-16 text-md",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  ...rest
}: {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const sizeCls = variant === "ghost" ? GHOST_SIZES[size] : SIZES[size];
  return (
    <button
      className={[
        "inline-flex items-center justify-center gap-8 rounded-full font-semibold",
        "transition-colors duration-300 ease-in-out",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500",
        sizeCls,
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
