# Figma Mobile-Design Build — Handoff

## Goal
Recreate the **mobile responsive** Athan Academy experience (built in the React app in this repo) inside Figma, **for Visitor and Enrolled student separately**, using the design-system library + token variables, creating components only for reusable/multi-state elements, with **basic flow prototyping**.

Rules from the user:
1. Use colors, typography & spacing from the token library (bind variables — no hardcoded values).
2. Use the **Athan Academy DS** library (file `x2JTKwXZa4aO370y2r0FQj`, ref node `6-70`) as the design library.
3. Create components + variants only for reusable / multi-state elements; reuse DS for the rest.
4. Don't assume — ask if unsure.
5. Basic flow prototyping (tab nav + primary CTAs).

## Skills to load first (new chat)
- `figma:figma-use` (MANDATORY before any `use_figma` call)
- `figma:figma-generate-design` (build workflow)
- optionally `figma:figma-generate-library` (component creation)
Use the **`mcp__ba2b9d5f-…__use_figma`** server (works via `fileKey`). The desktop "Figma" MCP needs Dev Mode and isn't used here.

## Target location
- **File:** `LoggG0aT2WfBhamz54WSxa` (Athan-Academy)
- **Page:** "Web Lesson Experience" id `42216:25792`
- **Section:** "Mobile" id `43176:14781` — abs (36508, 24571), 33700×24688. Existing child "Home" `43176:17676` at rel (779,861), 32141×1446. **Build below it.**
- ⚠️ **SECTION children use coordinates RELATIVE to the section top-left** (0..width / 0..height). Do NOT set absolute canvas coords on section children.

## Already built (don't redo)
- **Mobile / Role Chip** component set `43217:3480` — variants `Role=Teacher|Assistant|Admin` (Teacher=Secondary/200, Assistant=Status/Info blue, Admin=Status/Star gold). At rel (779, 2907).
- **Mobile / Tabs** component set `43225:3497` — variants `Active=About|Lessons|Discussions` (active pill = Secondary/940, Discussions has a Primary/500 dot). At rel (779, 3300). NOTE: variants overlap in the set frame (cosmetic) but instances work fine — could be tidied.
- **"Visitor / 1 — About"** frame `43226:3478` at rel (779, 3900), 390 wide. Contains: cloned DS NavBar (visitor/mobile) + hero (eyebrow/title/video) + school-info card (Starting/December 31/2026) + Tabs instance (Active=About) in a sticky bar + Course Overview content + sticky bottom Enroll bar ($100 · One Time Payment). Fully token-bound. ✅ verified.

## DS components to REUSE (clone sample instances — see gotcha)
- **Nav Bar** set `39945:17862` (local). Variants: `User=Visitor|Enrolled|Teacher|Default`, `Size=Web|Mobile`, `Type=Landing Page|School Detail|Create School`. Visitor-mobile sample to clone: `42390:37116`. ⚠️ set has internal errors → `importComponentSetByKeyAsync` FAILS and `componentPropertyDefinitions` throws. **Clone an existing instance** instead of import-by-key. (Mobile nav = hamburger + logo only; Enroll Now lives in the sticky bottom bar.)
- **Buttons** set `41714:8883` (remote). Variants: `State=Default|Hover`, `Type=Primary|Secondary|Link`, `Size=Large|Medium|Small`. Sample: `42390:37141`.
- **Status** set `39974:24258`. `Property 1=Grey|Green|Orange` (use for Published/Pending/Completed badges). Sample: `42390:37149`.
- **Lucide / menu** `40075:5069`, **Lucide / smartphone** `40075:5781`.

## Token variable KEYS (library "Athan Academy", collection "global")
Import with `figma.variables.importVariableByKeyAsync(key)`; bind colors via `setBoundVariableForPaint`, spacing/size via `setBoundVariable("paddingX"/"itemSpacing"/"fontSize", v)`.

**Colors — Secondary:** 50 `dcdb91e180d4c708495db7d0760bc9c1459d6de3` · 100 `e11313bd2fcc41dad1cb35df13d1fa385e87f833` · 200 `52139a0baf709f47453a6408b6637f3e39480b11` · 300 `b70f7c1243629a5440b47433367a78cf66a6c69e` · 400 `1038dfc7db6002e3236c824553af50adb2c11085` · 500 `a8252aba2e0f1006bb9f3808cea25e200d3d8647` · 600 `e9002b025dcbaf2971c25f290d69e6224d8c4024` · 700 `95ebf5afa81117d1d504711c322d265da950c08b` · 800 `c01e91819bf4e484ed9864eeb12e8e6002068d7a` · 900 `a8e667795e53c8bdce66da426a2a197c852b315c` · 930 `94e65c52c1c2df659196399c27175f06230dfc42` · 940 `475f535d8faaaf96ed77a0a235e0b1de23e5313e` · 950 `51d862b9362e0ed4f012c8c8e0d4277637cabc82` · 980 `4e70bc01a36701f49af6fea617f1263f4c14afdd` · 1000 `b8c2832e5e77d7c9ebdf65af8050b48b5511f1c0`

**Colors — Primary:** 300 `6183428912e4f9fdd8aef8434b7ee29970bc9575` · 500 `444d596deccd14626331cb47c10a4608b68a45c8` · semantic Primary `85f0345bd669b4ebf561e59470c48634163d6627`

**Colors — Status:** Star(gold) `72b68e8b1ec6730f0a73e92864bd34c9e7b40dac` · Info(blue) `4a35c345352907c6c0c1302849303417ad766ce5` · Success(green) `085e79f9a8d4043c5bd039182cdedfbb0da64885` · Warning(amber) `09666f6baaa2552debeaa64988ba690f23cdbfbf` · Error(red) `ed911516dbbce12fd53a0afb0c75a8dcf93a3c4d` · Like `273854f89d122fc47242163aa504fbb8fa945d66`

**Spacing (float):** 4 `0d84fac7e0ca3eb8d78c826f13a87699afb75193` · 8 `3e879001631aa9cc777459b04920b2211557cef6` · 12 `de7ab234002654b366e5a610c66dcbd31f6f9fa5` · 16 `29cc92a4fec1ca6843e20f75e6d22e6124d24169` · 20 `f7fd18bb7ffcc8906a543e60208e6c7ac01d24e2` · 24 `8a115c9916a7ee7dd1f3c7daf018c603b84b48a4` · 32 `947f4f09b9d908c3bd91fb5f3e82b61eb1da92b7` · 36 `23bfa04e0fe8862b196f9c718942b1d19b80f384` (no 40/48/64 → raw px)

**Type size (float):** xs `deb92be88a1e550701cb9e7662589f3a3fccbb36` · sm `491ce6796ff9b83f7d6aba3fe10d9f45c4dd581f` · md `081e3b11b8bea3262460d3fab56354eb33c9003d` · lg `0ed961b3a8ed9e3ffb7d20766e5f9384b971f80f` · lg-2 `ebefadedba035adc1316646071c75b0818954385` · xl `0259b9a493807b47ad50d628406dfa147bb7a68b` · xxl `2d6745447bf638472a970dca5d8376a024fe7a6e` · Headings `d209f0dffb0d17a1cc46dba015bb0f22a082077a` · Family(string) `72c57eda737301f30b60c39544fc1907347b015e`

**Weight (string):** regular `f3181362ea69934e46fed091c85080645ef47e1e` · medium `151d12adbe95e34a463ead61b4e2717709b0a7c6` · bold `4b839f60cd5c8af4b205f2a0772e33518fc8fa30`

## Gotchas
- Font family = **"Roboto"** (Regular / Medium / Bold; SemiBold exists). `loadFontAsync` before any text op; bind `fontSize` to size variables.
- **No radius variables** in DS → use raw px (8/12/16/100). No text/effect styles → typography via size+weight vars.
- Nav Bar set has errors → **clone sample instances**, don't import by key. `createInstance()` from a local set's variant child works (used for Tabs).
- Section children = relative coords (see above).
- Transient `ERR_NETWORK_IO_SUSPENDED` happened once → just retry (scripts are atomic).

## Remaining screens to build (FULL set) — replicate the React code exactly
**Visitor:** About ✅ done · Lessons (school card + no progress + no status icons) · Discussions (locked "Enroll to join" composer w/ disabled right-arrow + posts + FAB + sticky enroll bar) · Enroll prompt (bottom sheet) · Post detail (visitor, locked composer).
**Enrolled:** About (profile navbar, no card, no bottom bar) · Lessons (progress header "You're on your way!" + ring + chapter status badges Pending/Completed + lesson status icons) · Discussions (active composer / FAB = message-circle-plus, posts with kebab + green pin, "Continue Learning" side card) · Create-post bottom sheet (image+emoji) · Kebab action sheet (Edit/Delete/Report/Pin) · Edit / Delete / Report sheets · Post detail (author header, comments with kebab Edit/Delete) · Video lesson · Text MCQ (Check→Next) · Listen & Repeat · Image assignment (70% column, Feedback right, full-width input, Next outside) · Audio assignment.

Layout: lay Visitor frames in one row and Enrolled in another, ~200px gaps, frames 390 wide. Add a flow-overview frame + annotation legend. Prototype with `node.setReactionsAsync` (tab nav + FAB→sheet + kebab→sheet + Enroll→enrolled).

## Source of truth for the exact design (React app in this repo)
`/Users/hira.qaiser/Documents/Claude-Figma` — key files:
- `src/screens/CourseDetail.tsx` (nav + hero + school card + sticky tabs + sticky enroll bar), `LessonsScreen.tsx`, `DiscussionsScreen.tsx`
- `src/screens/lesson/*` (VideoLesson, TextMcqLesson, PracticeLesson, ListenRepeatLesson, AssignmentLesson, LessonLayout)
- `src/components/*`: NavBar, GlassTabs, SchoolInfoCard, BottomSheet, ResponsiveModal, ActionMenu, Icon; `src/components/discussion/*` (PostComposer, CommentList, CommentComposer, PostDialogs, DiscussionParts incl. RolePill, ComposerTools)
- `src/styles/tokens.css` + `tailwind.config.js` (token → variable mapping)
