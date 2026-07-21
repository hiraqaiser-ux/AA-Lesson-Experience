# Context: Align the existing mobile app to the new web UI

## What this is
**Athan Academy** — a learning platform. This repo (`/Users/hira.qaiser/Documents/Claude-Figma`) is the **new web app** (the UI source of truth). There is a **separate existing mobile application** (different codebase) that already has all the features but an older UI. The goal: **make the mobile app's UI consistent with this web app.** This is a UI-alignment task, not a rebuild — the mobile app keeps its own logic/features; we translate look-and-feel.

Web app stack: **React 18 + TypeScript + Tailwind CSS 3.4 + Vite 5**. Dark theme. Design = `src/styles/tokens.css` (CSS vars — only place raw hex lives) → `tailwind.config.js` (maps `var(--c-*)`) → components use token classes. Everything on a **4px grid**.

> The web changes are DONE and on `main` (latest commit adds multi-part lessons, step-synced progress bar, full-width mobile Back/Next). So the web UI is stable and ready to port from.

## How to work this task
1. **Gather first** (ask the user, don't assume):
   - **Mobile app location** (repo path / clone URL) — it is NOT in this repo.
   - **Mobile app stack** — React Native/Expo, Flutter, native iOS+Android, etc. (determines how tokens/components map).
   - **Scope / priority** — which screens to align first (Lessons, Discussions, Courses/Newsfeed, visitor flow).
2. **Map, don't copy-paste.** Translate the tokens + component patterns + screen layouts below into the mobile stack's equivalents (a token + component mapping). If the mobile code isn't accessible, produce a precise UI spec instead (tokens + per-screen deltas).
3. Follow `CLAUDE.md`: design-system first, tokens only (zero hardcoded colors), 4px grid, componentize reusables, handle all edge/empty/loading/error states, WCAG 2.1 AA, **ask when unsure — don't invent**.

---

## Design tokens (exact values — the visual contract)

**Primary (lime, CTAs):** 50 `#f7fee7` · 300 `#bef264` · 400 `#a3e635` · **500 `#95eb39` (main CTA)** · 600 `#65a30d` · 900 `#365314`
**Secondary (slate, the dark theme):** 50 `#f8fafc` · 100 `#eceef2` · 200 `#d5d9e2` · 300 `#b0b8c9` · 400 `#8591ab` · 500 `#657392` · 600 `#515d79` · 700 `#47516a` · 800 `#3a4152` · 900 `#333947` · 950 `#141b20` · **980 `#181c26` (locked-section card)** · 1000 `#0e1418` · **3 `#0a1014` (deep app bg)**
**Neutral:** 0 `#ffffff` · 100 `#d7d7d7` · 200 `#cccccc` · 300 `#a7a7a7` · 400 `#8f8f8f` · 600 `#606060` · 900 `#1a1a1a` · 1000 `#000000`
**Semantic:** background `#0d0d0d` · surface `#161616` · popup-bg `#0a1014` · text-primary `#f1f1f1` · text-secondary `#b3b3b3`
**Status:** success `#07c97b` (+300 `#81cf92`, +900 `#1c4d27`) · warning `#e67d37` (+300 `#ffc654`, +900 `#6b4700`) · error `#ff4d4d` (+300 `#f4827e`) · star `#ffd54f`
**Avatars (discussion users):** teal `#008d90` · red `#ff5044` · blue `#15a1ff` (orange reuses warning)
**Overlays:** white 8% `#ffffff14` · white 12% `#ffffff1f` · white 40% `#ffffff66` · black 40/55/70% `#00000066`/`8c`/`b3`

**Spacing (4px grid):** 0,4,8,12,16,20,24,28,32,36,40,44,48,64 (px)
**Type sizes:** xs 12 · sm 14 · md 16 · lg 18 · lg-2 20 · xl 24 · 2xl 28 (px). Font family in web = system/Tailwind default; the Figma DS uses **Roboto**. Weights used: regular/medium/semibold/bold.
**Radius:** sm 8 · md 12 · lg 16 · full 100 (px). (Radius is not a formal DS token.)

---

## UI patterns the mobile app should match

**Global / shell**
- Dark theme; deep bg `secondary-3 / 1000`. Lime (`primary-500`) is the single accent/CTA color.
- **NavBar:** logo left; right side = profile pill when **enrolled**, or **Login + Enroll Now** when **visitor**. Mobile: hamburger + logo, with a slide-in drawer.
- **Tabs:** About / Lessons / Discussions, glass-pill style (active = frosted pill; Discussions has a lime status dot). On mobile the navbar + tabs are **sticky** (not floating), with **8px vertical padding**.

**Visitor vs Enrolled** (web persists in localStorage `aa_enrolled`)
- Visitor: Login/Enroll-Now navbar; a **school-info card** (Starting date / `$100`/month / Enroll Now) shown above tabs across all tabs (mobile shows only "Starting …" in the card and moves price+Enroll to a **sticky bottom bar**); locked composers; like/comment → enroll prompt.
- **Locked sections (visitor):** gated content sections show a **lock button** and sit on a **`secondary-980` card** (mobile) instead of being open.
- Enrolled: profile navbar; progress shown; active composers; no price bar.

**Lessons tab**
- Sections → chapters → lessons. Enrolled shows a progress header ("You're on your way!" + ring). Chapters: status **badge** (Pending = amber, Completed = green) on the top row (web) / stacked (mobile); **no left status circle**. Lessons: status **icon** at right — pending = hollow ring, completed = green check. Only **two statuses** (Pending / Complete). Lesson rows: 12px padding, 8px-radius hover.

**Lesson experience (shared LessonLayout)**
- NavBar + a **"course content" sidebar showing only the current section** (web sidebar / mobile hamburger drawer; no "Course content" heading, no Back button on mobile). Header = thin **chapter progress bar** + Feedback pill (assignments: breadcrumb).
- **Progress bar counts PARTS (steps), not lessons** — see multi-part below; each part advances the bar within the chapter.
- **Sticky footer: secondary "Back" + primary "Next".** Back is shown on **BOTH web and mobile** (before Next), disabled at the very first step. **On mobile, Back and Next are full-container (each takes half the width, edge-to-edge); on desktop they are auto-width, right-aligned.**
- **Multi-part lessons:** a single lesson can hold multiple exercise parts that are **invisible to the learner** (no part indicator). **Next** goes to the next part; from the last part it crosses into part 1 of the next lesson (and next section). **Back** mirrors it. The sidebar highlights the parent lesson for any of its parts. (Current demo: "Practice with Alif" = Text MCQ part → Audio MCQ part.)
- Screens: **Video lesson** (player + title, no transcript); **Text MCQ / Practice** (choose option → footer shows **Back + Check**; after Check the **Check button becomes Next**); **Listen & Repeat**; **Assignment (image/audio)** — content in a **70% column**, Feedback at the column's right edge, answer **input full width with Next just outside** the column; mobile = input above a sticky Back/Next bar (full-width buttons).

**Discussions tab**
- Post feed; each post: author (avatar + name + **role chip**) + text + like/comment pills + **kebab menu**. Role chips: **Teacher** (slate), **Teacher Assistant** (blue), **Admin** (gold) — subtle, not lime.
- Kebab actions: **Edit / Delete / Report / Pin** — dropdown on web, **bottom sheet on mobile**. Edit = dialog with text + **image + emoji**; Delete = confirmation (**buttons full-width on mobile**); Report = reason picker. **Pin** shows a **green pin icon** before the kebab (click to unpin).
- **Comments AND replies** each have the same kebab with **Edit / Delete**.
- **Every text box has a 4000-character limit with a visible counter** (`MAX_TEXT_LENGTH = 4000` in `src/data/discussions.ts`): create-post, edit, comment, reply, assignment answer.
- Create-post composer with **image upload + emoji**; reply composer **also has emoji**; visitor = locked "Enroll to join" with a disabled right-arrow. **Mobile create = floating button** (chat-bubble-plus icon) → **bottom sheet** composer; FAB sits above the sticky bottom bar.
- Post detail: opens as a modal (most posts) or full page (first post); author header parallel to "All Comments (N)"; comments list + composer pinned at the bottom of the comments column.
- Right rail: course side card (Enroll Now / Continue Learning when enrolled) + "Other Schools" list.

**Courses / Newsfeed** (community home)
- Newsfeed screen with feed post cards, a course card, "Become a teacher" card, schools sidebar, sign-in prompt for visitors. Courses screen lists enrollable courses (incl. an "in-progress" course card). Same dark theme + token rules.

**Reusable building blocks (web):** NavBar, GlassTabs, SchoolInfoCard, BottomSheet, ResponsiveModal (Dialog on desktop / BottomSheet on mobile), ActionMenu (dropdown ↔ bottom sheet), Icon set, `useIsDesktop` hook, `usePersona` hook, discussion/* (PostComposer, CommentComposer, CommentList, PostDialogs, DiscussionParts incl. RolePill + ComposerTools), newsfeed/* (FeedPostCard, CourseCard, BecomeTeacherCard, SchoolsSidebar, SignInPrompt), LessonLayout + LessonSidebar + screens/lesson/*.

---

## Reference files in THIS web repo (read for exact detail)
- `CLAUDE.md` — design/build rules (DS-first, tokens only, 4px grid, componentize, edge cases, WCAG AA).
- `src/styles/tokens.css` — exact token values · `tailwind.config.js` — token→class mapping.
- `src/screens/CourseDetail.tsx`, `CoursesScreen.tsx`, `NewsfeedScreen.tsx`, `src/screens/lesson/*` (LessonExperience, VideoLesson, TextMcqLesson, PracticeLesson, AssignmentLesson, ListenRepeatLesson).
- `src/components/LessonLayout.tsx`, `LessonSidebar.tsx`, `src/components/*`, `src/components/discussion/*`, `src/components/newsfeed/*`.
- `src/data/lessons.ts` (FLAT_LESSONS / FLAT_STEPS / getStep / nextStep / prevStep / PARTS_OVERRIDE), `src/data/discussions.ts` (`MAX_TEXT_LENGTH`), `src/data/personas.ts`.
- `FIGMA_HANDOFF.md` — (only if also doing Figma) DS variable keys + node IDs for the Figma file.
- Design system Figma: https://www.figma.com/design/x2JTKwXZa4aO370y2r0FQj/Athan-Academy-DS

## Org naming conventions (apply to any written content)
Company = **VentureDive** (big V, big D, no space); short form **VenD** (internal only, never "VD"/"vd"); employees = **VenDians**. HR portal: https://sites.google.com/venturedive.com/hrportal/home.
