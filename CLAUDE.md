# CLAUDE.md

## Purpose

This file defines the design, build, and product rules for this product. Claude reads it
at the start of every session and must follow it for **all** design, UI, component, and
product work. Treat these rules as the default contract for every task. They apply unless
I explicitly override a rule in that session.

---

## Tech Stack

- **Frontend:** React
- **Styling & tokens:** per the design system (see below)
- Before assuming any of the following, ask me: TypeScript vs JavaScript, state management
  library, routing approach, and styling method (CSS Modules, Tailwind, styled-components,
  etc.). If a convention is not already established in the codebase, do not introduce a new
  one without confirming.

---

## Design System (single source of truth)

The provided design system is the source of truth. Always design and build from it —
never around it.

- Design system file (read via Figma MCP): https://www.figma.com/design/x2JTKwXZa4aO370y2r0FQj/Athan-Academy-DS?node-id=7-658&t=8NOwQ8YnzbTwUs9a-1
- See @tokens.json for the approved color palette, spacing and typography.

> Adjust the `@`-import paths above to match where these files live in this repo. If they
> do not exist yet, the rules below still apply — ask me where the design system lives
> before starting.

**Rules:**

1. Use the provided design system for everything you design or build. Do not introduce
   styles, patterns, or components that are not defined in it.
2. Before creating anything, check the design system for an existing component, pattern,
   or token that fits. Reuse before you build.
3. **If something you need is not in the design system, stop and ask me.** Do not invent,
   approximate, or substitute a "close enough" alternative on your own.

---

## Spacing, Sizing & Typography — the 4px grid

- Use a **4px base unit** for everything: margins, padding, gaps, component dimensions,
  layout, and grid.
- All values must be multiples of 4 (4, 8, 12, 16, 20, 24, 32, 40, …).
- Apply the same 4px discipline to typography — line heights and vertical rhythm should
  align to the 4px grid.
- Do not use values that break the 4px grid. If the design system defines a token for a
  value, use the token. If you think you need an off-grid value, ask me first.

---

## Color

- Use **only** the colors provided in the design system, referenced by their **token
  names**.
- **Never hardcode color values** — no hex codes, no `rgb`/`rgba`, no `hsl`, no named CSS
  colors — anywhere (components, stylesheets, inline styles, config files).
- If you need a color that does not exist as a token, do not create one. Ask me.

---

## Components (React)

- **Componentize every reusable item** as a React component. If an element could be used
  more than once (buttons, inputs, cards, badges, modals, list items, headers, etc.),
  build it as a reusable component — never a one-off.
- Use **functional components with hooks** only. No class components.
- Reuse design-system components before building new ones. If one exists, extend or
  compose it — never duplicate.
- Keep components small, composable, and single-purpose. Co-locate the component with its
  styles and tests.
- Keep components presentational where possible; lift data fetching and shared state into
  hooks or parent containers.
- Make props explicit and documented. If the project uses TypeScript, type all props — no
  `any`.
- Build accessibility in from the start: semantic HTML, labels for inputs, keyboard
  navigation, visible focus states, and ARIA only where semantics fall short.

---

## Edge Cases

Design and build for the full range of states, never just the happy path. For **every**
feature, account for:

- Empty states (no data yet)
- Loading and skeleton states
- Error and failure states
- Long content, text overflow, and truncation
- Zero, one, and many items
- Boundary values (min/max, very large numbers, very long strings)
- Disabled and read-only states
- Responsive behavior across all breakpoints
- Slow network or partial data
- Permission / unauthorized access states where relevant

If the expected behavior for an edge case is unclear, ask me — do not guess it.

---

## Product Guidelines (PM perspective)

- **Problem first, not solution first.** Before building, confirm the user problem, who
  it is for, and what success looks like. If these are not defined, ask before starting.
- **Build to acceptance criteria.** Every feature should have clear, testable acceptance
  criteria. If none are provided, propose them and confirm with me before building.
- **Scope discipline.** Build the smallest version that delivers the user value first.
  Flag "nice to haves" and scope creep separately rather than silently building them.
- **Consistency over novelty.** Match existing product patterns and flows. Do not invent
  a new interaction pattern when an established one already exists.
- **Design the whole flow.** Consider entry points, the path through, the empty/error/
  success states, and what happens after — across mobile and desktop, mobile-first.
- **Accessibility is a requirement, not an enhancement.** Target WCAG 2.1 AA.
- **Instrument key actions.** For meaningful user actions, add or flag analytics events so
  usage can be measured. If tracking is not specified, ask what to capture.
- **Clear language and small changes.** Keep user-facing copy clear and consistent, and
  surface new copy for review. Prefer small, reviewable changes and state trade-offs.

---

## When Unsure — Ask, Don't Assume

- **Do not assume anything.** If a requirement, design intent, component choice, token, or
  expected behavior is unclear or undefined, ask me **before** proceeding.
- Asking one clarifying question is always better than building the wrong thing.
- If you must proceed without an answer, state the assumption you are making explicitly
  and flag it for my review — never bury it.

---

## Definition of Done

Before considering any design or build task complete, verify:

- [ ] Solves a defined user problem and meets agreed acceptance criteria
- [ ] Built entirely from the design system (components, tokens, patterns)
- [ ] All spacing, sizing, and typography follow the 4px grid
- [ ] All colors use tokens — zero hardcoded color values
- [ ] Every reusable element is a React component, with no duplicates
- [ ] Accessible (WCAG 2.1 AA): semantic HTML, keyboard, focus, labels
- [ ] All relevant edge cases are handled
- [ ] Key user actions are instrumented (or tracking confirmed with me)
- [ ] Anything missing from the design system was raised with me, not improvised
- [ ] Any assumptions made are stated explicitly for review
