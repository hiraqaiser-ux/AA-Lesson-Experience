/**
 * Minimal Lucide-style icon set. Strokes use `currentColor`, so color is driven
 * by the parent's text color (a DS token class) — never a hardcoded hex.
 */
import type { CSSProperties } from "react";

export type IconName =
  | "play" | "pause" | "check" | "lock" | "chevron-down" | "chevron-up"
  | "chevron-left" | "chevron-right" | "clipboard" | "file" | "book"
  | "volume" | "rewind" | "forward" | "settings" | "maximize" | "bookmark"
  | "help" | "plus" | "minus" | "bell" | "external"
  | "paperclip" | "mic" | "square" | "send" | "award" | "check-circle" | "star"
  | "video" | "list-checks" | "image" | "headphones" | "audio-waveform"
  | "x" | "arrow-up" | "arrow-right" | "menu"
  | "loader" | "rotate-cw" | "rotate-ccw" | "mic-off"
  | "heart" | "message-circle" | "message-circle-plus" | "info" | "calendar" | "clock"
  | "more-vertical" | "edit" | "trash" | "flag" | "pin" | "smile" | "instagram" | "plus-circle" | "log-out";

const PATHS: Record<IconName, string> = {
  play: "M6 3l14 9-14 9V3z",
  pause: "M8 4h3v16H8zM13 4h3v16h-3z",
  check: "M20 6L9 17l-5-5",
  lock: "M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4",
  "chevron-down": "M6 9l6 6 6-6",
  "chevron-up": "M6 15l6-6 6 6",
  "chevron-left": "M15 18l-6-6 6-6",
  "chevron-right": "M9 18l6-6-6-6",
  clipboard: "M9 4h6v3H9zM7 5H5v16h14V5h-2M9 12h6M9 16h4",
  file: "M14 3H6v18h12V7zM14 3v4h4M9 13h6M9 17h6",
  book: "M3 5h7a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H3zM21 5h-7a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h7z",
  volume: "M5 9v6h4l5 4V5L9 9zM17 8a5 5 0 0 1 0 8",
  rewind: "M3 12a9 9 0 1 0 3-6.7M3 4v4h4",
  forward: "M21 12a9 9 0 1 1-3-6.7M21 4v4h-4",
  settings: "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM19 12l2 1-2 4-2-1a7 7 0 0 1-2 1l-1 2h-4l-1-2a7 7 0 0 1-2-1l-2 1-2-4 2-1a7 7 0 0 1 0-2L1 8l2-4 2 1a7 7 0 0 1 2-1l1-2h4l1 2a7 7 0 0 1 2 1l2-1 2 4-2 1a7 7 0 0 1 0 2z",
  maximize: "M8 3H3v5M21 8V3h-5M16 21h5v-5M3 16v5h5",
  bookmark: "M6 3h12v18l-6-4-6 4z",
  help: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9 9a3 3 0 0 1 5 2c0 2-3 2-3 4M12 17h.01",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  bell: "M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0",
  external: "M15 3h6v6M10 14L21 3M21 14v7H3V3h7",
  paperclip: "M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.41 17.73a2 2 0 0 1-2.83-2.83l8.49-8.48",
  mic: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8",
  square: "M3 3h18v18H3z",
  send: "M22 2L11 13M22 2L15 22l-4-9-9-4z",
  award: "M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM8.5 13.5L7 22l5-3 5 3-1.5-8.5",
  "check-circle": "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  video: "M6 3l14 9-14 9V3z",
  "list-checks": "M3 17l2 2 4-4M3 7l2 2 4-4M13 6h8M13 12h8M13 18h8",
  image: "M4 4h16v16H4zM4 16l4-4 3 3 5-5 4 4M9 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0",
  headphones: "M4 14v-2a8 8 0 0 1 16 0v2M4 14h3a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zM20 14h-3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z",
  "audio-waveform": "M2 10v4M6 7v10M10 4v16M14 8v8M18 6v12M22 10v4",
  x: "M18 6L6 18M6 6l12 12",
  "arrow-up": "M12 19V5M5 12l7-7 7 7",
  "arrow-right": "M5 12h14M12 5l7 7-7 7",
  menu: "M3 6h18M3 12h18M3 18h18",
  loader: "M21 12a9 9 0 1 1-6.219-8.56",
  "rotate-cw": "M21 12a9 9 0 1 1-3-6.7M21 3v5h-5",
  "rotate-ccw": "M3 12a9 9 0 1 0 3-6.7M3 3v5h5",
  "mic-off": "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3M19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8M3 3l18 18",
  heart: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.49 4.04 3 5.5l7 7z",
  "message-circle": "M7.9 20A9 9 0 1 0 4 16.1L2 22z",
  "message-circle-plus": "M7.9 20A9 9 0 1 0 4 16.1L2 22z M8 12h8 M12 8v8",
  info: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16v-4M12 8h.01",
  calendar: "M8 2v4M16 2v4M3 10h18M21 6v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
  "more-vertical":
    "M12 3.4a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4M12 10.3a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4M12 17.2a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4",
  edit: "M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z",
  trash:
    "M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6",
  flag: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7",
  pin: "M12 17v5M9 4h6l-1 6 3 3H7l3-3z",
  smile: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01",
  instagram:
    "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zM16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01",
  "plus-circle": "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 8v8M8 12h8",
  "log-out": "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
};

const SOLID: IconName[] = ["play", "pause", "square", "star", "more-vertical"];

export function Icon({
  name,
  size = 20,
  className = "",
  style,
}: {
  name: IconName;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const solid = SOLID.includes(name);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={solid ? "currentColor" : "none"}
      stroke={solid ? "none" : "currentColor"}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
