# Project handoff — IGNOU MAPC study site

## Site and deployment

- Repository: `Dishan33/atbs`, branch: `main`.
- Production URL: <https://atbs-dun.vercel.app/>. Pushes to `main` deploy automatically.
- `atbs.vercel.app` is an old blank deployment. Check `atbs-dun.vercel.app` instead.
- Vercel Web Analytics is enabled.
- Latest deployment commit: `083d6f0` — `Add MPC-005 research methods resources`.

## Completed courses

- `MPC 003 - Personality/MPC003_Dashboard.html` is the original reference implementation. It uses a self-contained dashboard with tabbed study modes; standalone content loads inside dashboard panels.
- `MPC 004 - Social Psychology/` is deployed. Latest MPC-004 expansion: `d68df96`.
- `MPC 005 - Research Methods/` is deployed and linked from root `index.html` alongside MPC-003 and MPC-004.

## MPC-005 package

- Dashboard: `MPC005_Dashboard.html`.
- Flashcards: `Flashcards & Notes/MPC005_Flashcards.html` (60 cards). It includes topic filters, reveal/hide, previous/next, shuffle, reset, and keyboard controls.
- Method atlas: `Flashcards & Notes/MPC005_Themes_and_Timeline.html`.
- PYQ analysis: `MPC005_PYQ_Analysis.html`.
- Answer bank: `MPC005_PYQ_Answer_Bank.html` (20 mark-labelled frameworks).
- Four printable one-pagers in `Cheat Sheets/`, one for each block. They include print CSS and are linked from the dashboard Cheat Sheets section.
- Correct PYQ corpus: `MPC 005 - Research Methods/PYQ_MPC-005_2011-2025.pdf`, confirmed as the 65-page MPC-005 corpus covering June 2011–December 2025.
- The MPC-005 project blocks are exact binary matches for the user’s downloaded `Block-1` through `Block-4 - Research Methods.pdf` files.

## Navigation and design conventions

- Keep the course navigation uniform with MPC-003’s route order and names: **Study Desk, Flashcards, Themes, Cheat Sheets, Analysis, Answers**.
- MPC-005 uses separate pages for most routes, but each page shows the same six-route navigation. The dashboard hosts Cheat Sheets via `?view=blocks`.
- Use MPC-003 for interaction and information-architecture conventions; keep each course’s visual identity and content course-specific.
- Use MPC-003’s flashcard structure as the standard for every course: topic filter, progress, marks and tier metadata, front/back flip, key-term tags, previous/next controls, shuffle, reset, and keyboard shortcuts.
- Match MPC-003’s content depth: each answer should cover the definition, core logic, procedure or formula, interpretation, limitations, and mark-scoring terms that fit the topic. Do not use one-line answer summaries.
- The user approved `frontend-design`; read `/Users/dishan/AI/Roma Course/.agents/skills/frontend-design/SKILL.md` for visual work.
- `stop-slop` was applied only to website-facing copy (headings, route labels, intros). Preserve technical terms, definitions, PYQ evidence, and exam answer vocabulary from prescribed material.

## Working conventions

- Build locally and get the user’s explicit review approval before committing or deploying new courses.
- Use prescribed block PDFs and the confirmed PYQ corpus. Validate titles, dates, page counts and content before use.
- Test links, flashcard controls, mobile layout and browser console where available.
- Preserve unrelated local files. `MPC 004 - Social Psychology/PYQ_MPC-005_2011-2025.pdf` remains an untracked duplicate/misplaced source file; do not delete or stage it as MPC-004 content.

## Suggested next-session prompt

> Build a local MPC-006 (Statistics in Psychology) package with the depth and quality of the deployed MPC-005 package. First inspect MPC-003 for its dashboard/flashcard interaction patterns and MPC-005 for its complete content package. Verify the MPC-006 prescribed blocks and correct PYQ corpus before creating anything. Build a course-specific dashboard, 60+ meaningful flashcards, a concept/method atlas, visual PYQ analysis, a mark-labelled answer bank, and four printable block one-pagers. Use the standard route order: Study Desk, Flashcards, Themes, Cheat Sheets, Analysis, Answers. Add MPC-006 to the root library locally, test all routes and mobile layout, and do not commit, push or deploy until I explicitly approve the local version.
