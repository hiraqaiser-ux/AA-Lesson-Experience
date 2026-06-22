# Athan Academy — Learning Experience (React)

Vite + React + TypeScript + Tailwind. Recreates three screens from the Figma file:
**Course detail (Enrolled)**, **Lessons**, and the **Video Lesson player** (Coursera-style
sidebar + player + finish-watching modal).

## Run it

> Requires Node.js 18+ (not installed on this machine yet — install from
> https://nodejs.org or `brew install node`).

```bash
npm install
npm run dev
```

Vite prints a local URL (default **http://localhost:5173**). Use the top switcher to
move between the three screens; clicking a lesson opens the video player.

## Design-system fidelity

- **Tokens are the single source of truth.** All hex/px values live only in
  `src/styles/tokens.css` (generated from the Figma DS variables) + mirrored in
  `src/tokens.json`. `tailwind.config.js` and every component reference token
  variables / classes — no hardcoded hex in components.
- **Spacing** uses the `Primitive/Spacing/*` scale (all 4px multiples) via Tailwind
  keys (`p-16`, `gap-12`, …).
- **Colors** map to `Primitive/Brand/*`, `Neutral/*`, `Status/*`, `Overlay/White*`.

## Not in the design system (flagged)

- **Black scrim overlays** for video controls + modal backdrop (`--c-overlay-black-*`) —
  derived from `Neutral/1000` + alpha; the DS only ships white overlays.
- **Radius** values (8/12/16/100) — the DS has no radius tokens (values are 4px multiples).
- **Display font size 28px** (`--font-2xl`) — DS typography tops out at `xl` = 24px.
- **Icons** are local inline SVGs (Lucide-style); the Figma Lucide set isn't exported to code.
