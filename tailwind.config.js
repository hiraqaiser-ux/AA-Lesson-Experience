/**
 * Tailwind theme is wired ENTIRELY to CSS custom properties defined in
 * src/styles/tokens.css (generated from the Athan Academy Figma variables).
 * No raw hex values or off-grid spacing live here — only token references.
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    // Spacing scale === DS Primitive/Spacing/* tokens (all 4px multiples).
    spacing: {
      0: "var(--space-0)",
      4: "var(--space-4)",
      8: "var(--space-8)",
      12: "var(--space-12)",
      16: "var(--space-16)",
      20: "var(--space-20)",
      24: "var(--space-24)",
      28: "var(--space-28)",
      32: "var(--space-32)",
      36: "var(--space-36)",
      40: "var(--space-40)",
      44: "var(--space-44)",
      48: "var(--space-48)",
      64: "var(--space-64)",
    },
    borderRadius: {
      none: "0",
      sm: "var(--radius-sm)",
      md: "var(--radius-md)",
      lg: "var(--radius-lg)",
      full: "var(--radius-full)",
    },
    fontSize: {
      xs: "var(--font-xs)",
      sm: "var(--font-sm)",
      md: "var(--font-md)",
      lg: "var(--font-lg)",
      "lg-2": "var(--font-lg-2)",
      xl: "var(--font-xl)",
      "2xl": "var(--font-2xl)",
    },
    extend: {
      colors: {
        primary: {
          50: "var(--c-primary-50)",
          100: "var(--c-primary-100)",
          200: "var(--c-primary-200)",
          300: "var(--c-primary-300)",
          400: "var(--c-primary-400)",
          500: "var(--c-primary-500)",
          600: "var(--c-primary-600)",
          700: "var(--c-primary-700)",
          800: "var(--c-primary-800)",
          900: "var(--c-primary-900)",
        },
        secondary: {
          50: "var(--c-secondary-50)",
          100: "var(--c-secondary-100)",
          200: "var(--c-secondary-200)",
          300: "var(--c-secondary-300)",
          400: "var(--c-secondary-400)",
          500: "var(--c-secondary-500)",
          600: "var(--c-secondary-600)",
          700: "var(--c-secondary-700)",
          800: "var(--c-secondary-800)",
          900: "var(--c-secondary-900)",
          950: "var(--c-secondary-950)",
          980: "var(--c-secondary-980)",
          1000: "var(--c-secondary-1000)",
        },
        "secondary-3": "var(--c-secondary-3)",
        neutral: {
          0: "var(--c-neutral-0)",
          100: "var(--c-neutral-100)",
          200: "var(--c-neutral-200)",
          300: "var(--c-neutral-300)",
          400: "var(--c-neutral-400)",
          500: "var(--c-neutral-500)",
          600: "var(--c-neutral-600)",
          700: "var(--c-neutral-700)",
          800: "var(--c-neutral-800)",
          900: "var(--c-neutral-900)",
          1000: "var(--c-neutral-1000)",
        },
        success: {
          DEFAULT: "var(--c-success)",
          300: "var(--c-success-300)",
          900: "var(--c-success-900)",
        },
        warning: {
          DEFAULT: "var(--c-warning)",
          300: "var(--c-warning-300)",
          900: "var(--c-warning-900)",
        },
        error: { DEFAULT: "var(--c-error)", 300: "var(--c-error-300)" },
        star: "var(--c-star)",
        avatar: {
          teal: "var(--c-avatar-teal)",
          red: "var(--c-avatar-red)",
          blue: "var(--c-avatar-blue)",
        },
        background: "var(--c-background)",
        surface: "var(--c-surface)",
        "popup-bg": "var(--c-popup-bg)",
        "text-primary": "var(--c-text-primary)",
        "text-secondary": "var(--c-text-secondary)",
      },
      backgroundColor: {
        "overlay-white-4": "var(--c-overlay-white-4)",
        "overlay-white-8": "var(--c-overlay-white-8)",
        "overlay-white-12": "var(--c-overlay-white-12)",
        "overlay-success": "var(--c-overlay-success)",
      },
      borderColor: {
        "overlay-white-4": "var(--c-overlay-white-4)",
        "overlay-white-8": "var(--c-overlay-white-8)",
        "overlay-white-12": "var(--c-overlay-white-12)",
        "overlay-white-40": "var(--c-overlay-white-40)",
      },
      fontFamily: {
        sans: ["Roboto", "system-ui", "sans-serif"],
        slab: ["'Roboto Slab'", "Roboto", "serif"],
      },

      /* ── Motion spec — shared source of truth (matches Figma Smart Animate) ── */
      // Easings
      transitionTimingFunction: {
        // smooth decelerate — element entrances
        "out-soft": "cubic-bezier(0.16, 1, 0.3, 1)",
        // symmetric — toggles (play/pause, hover)
        "in-out-soft": "cubic-bezier(0.65, 0, 0.35, 1)",
        // gentle overshoot — pops (success check)
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      // Durations (ms)
      transitionDuration: {
        micro: "150ms", // buttons, toggles, hovers
        enter: "300ms", // message bubbles appearing
        reveal: "450ms", // banner / state reveals
      },
      keyframes: {
        // Chat bubble entrance — rise + settle
        "message-in": {
          from: { opacity: "0", transform: "translateY(8px) scale(0.98)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        // Completion banner reveal
        "banner-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        // Success check pop with overshoot
        "check-pop": {
          "0%": { opacity: "0", transform: "scale(0)" },
          "60%": { opacity: "1", transform: "scale(1.15)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        // Bottom sheet rise
        "sheet-in": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
      },
      animation: {
        "message-in": "message-in 300ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "banner-in": "banner-in 450ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "check-pop": "check-pop 350ms cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "fade-in": "fade-in 300ms ease-out both",
        "sheet-in": "sheet-in 300ms cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};
