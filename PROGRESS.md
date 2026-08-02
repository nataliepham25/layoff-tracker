# Progress Log

Everything done in this project so far, in order. (`README.md` is left untouched —
this is a separate running log.)

## 1. Initial scaffold — "Layoff Tracker" homepage

- Created a new Next.js 14 app (App Router) with TypeScript and Tailwind CSS, deliberately
  pinned to Next 14.2.35 / Tailwind 3 rather than the Next 16 / Tailwind 4 that
  `create-next-app@latest` installs by default.
- Built the homepage layout from the mockup in `mockups/`:
  - `Header` — site name + nav links (Home, Stats, Submit a Tip, About)
  - `Hero` — short blurb on the tracker's purpose
  - Placeholder section for the layoff feed
  - Also added real (if minimal) `/stats`, `/submit`, `/about` pages so the nav links
    weren't dead ends
- Installed `lucide-react` for icons.
- Verified with `tsc`, `next build`, `next lint`, and Playwright screenshots at desktop
  and mobile widths (390px) — fixed a header-wrap and stats-grid cramping issue found
  at mobile width.

## 2. Data layer

- Defined `LayoffEntry` / `LayoffSource` types (`lib/types.ts`): company, industry, date
  announced, employees affected, optional percentage affected, summary, source links,
  tags.
- Storage: one JSON file per entry in `data/layoffs/`, filename doubles as the entry's
  id/slug (e.g. `oracle-2026-06-23.json`) — new layoffs are added by dropping in a new
  file, no other code changes needed.
- `lib/getLayoffs.ts`: `getAllLayoffs()` reads every JSON file, validates each field with
  file-and-field-specific error messages, and returns entries sorted by date, newest
  first.
- Added three real sample entries: Oracle, Microsoft, Lucid.
- Rewired the UI (`LayoffCard`, `StatsStrip`, `FilterBar`) to consume this data instead
  of the hardcoded sample array from step 1; `StatsStrip` numbers are now computed from
  real entries instead of being hardcoded.
- Verified the "just add a file" workflow and the validation errors directly: added a
  test entry and confirmed it sorted correctly by date, then added a deliberately broken
  entry (empty `sources`) and confirmed it failed with a specific, useful error message
  rather than rendering silently wrong.

## 3. Functional feed + editorial redesign

- Made the filter/sort controls actually work (they were previously cosmetic only):
  `Feed.tsx` became a client component owning `activeTag`/`sortBy` state; filter chips
  are derived from tags actually present in the data; sort toggles between "Newest"
  (by date) and "Largest cut" (by employees affected), and the two compose correctly.
  Verified with scripted Playwright clicks, not just visually.
- Full visual redesign toward an "editorial, human" identity instead of a SaaS
  dashboard look:
  - Added Fraunces (serif, via `next/font/google`) for headlines/company
    names/pull-numbers, paired with the existing Geist Sans for UI text.
  - Warm paper background + ink text instead of white/black; terracotta accent
    (`#a3410a`) instead of the original corporate blue.
  - Cards changed from boxed dashboard cards to a bottom-rule list with a tag-colored
    left accent stripe, byline-style avatar circle, and big serif pull-numbers for
    headcount instead of small icon+text.
  - Filter chips redesigned as rounded magazine-style toggle tabs; sort control
    changed from a native `<select>` to a segmented toggle.
  - Hero got a kicker line + large serif headline + italic dek; stats strip got serif
    numerals in a rule-divided row instead of boxed tiles.
  - Propagated the serif treatment to headings on `/stats`, `/about`, `/submit` for
    consistency.
- Fixed a mobile-width regression this introduced (header nav clipping past the
  viewport edge at 390px).

## 4. Per-entry detail pages + auto-generated OG share images

- Extended the data schema with an optional `body: string[]` field (full write-up
  paragraphs; falls back to `summary` if omitted) and matching validation.
- Added a `getLayoffBySlug()` helper.
- Built `/layoffs/[slug]` — a statically generated detail page per entry
  (`generateStaticParams`) showing the full write-up and every source link (not just
  the first, like the card does).
- Updated `LayoffCard` so the card's company name / "Read more" link to the new detail
  page instead of jumping straight to an external source.
- Built `/layoffs/[slug]/opengraph-image` using Next's `ImageResponse` (`next/og`) file
  convention — auto-wires the OG/Twitter meta tags with no manual metadata plumbing.
  Image shows company name + headcount, styled to match the site (paper background,
  terracotta flag bar, serif headline).
- Added `metadataBase` to the root layout (via Vercel's `VERCEL_URL` env var) so OG
  image URLs resolve correctly once deployed, not just on localhost.
- Debugged and fixed two real rendering bugs found by inspecting the actual generated
  PNGs (not just confirming the build succeeded):
  1. Text elements without an explicit `fontFamily` were silently inheriting whatever
     custom font got registered, and that font had been subsetted too narrowly (missing
     glyphs for letters introduced by `text-transform: uppercase`), producing
     mismatched fonts within the same word.
  2. First fix attempt tried reusing the site's local Geist variable font for UI text —
     Satori (the renderer behind `ImageResponse`) can't parse variable fonts and the
     build crashed. Replaced it with a statically-weighted Inter font fetched fresh
     from Google Fonts at generation time.
- Verified end-to-end: all three OG images render correctly, meta tags are present in
  page `<head>`, an unknown slug 404s correctly, mobile layout is clean, and a scripted
  click-through (card → detail page → back to feed) works.

## 5. Housekeeping (this session)

- Diagnosed a "UI looks completely unstyled" report: it wasn't a design regression —
  leftover `next dev`/`next start` processes from earlier testing were still listening
  on ports 3000/3001, and the one on port 3000 was serving a stale HTML page referencing
  a CSS file hash from a build that had since been overwritten, so the CSS request
  500'd and the browser fell back to unstyled default HTML.
- Killed all stale Next.js processes, confirmed no orphaned servers remain on
  3000–3002, did a clean rebuild (`rm -rf .next && npm run build`), and reverified the
  site renders correctly.

## Current state

- Last git commit: "Implemented the data model" (step 2 above). Everything from step 3
  onward (editorial redesign, detail pages, OG images) is uncommitted in the working
  directory — intentionally left for manual commit per your request.
- `tsc --noEmit`, `next build`, and `next lint` all pass clean as of the end of step 4.

## Known gaps / not yet wired up

- `/submit` is a real-looking form UI but doesn't submit anywhere (button is disabled).
- `/stats` shows the same stat strip as the homepage with a placeholder for future
  charts/breakdowns.
- No CMS/database — adding an entry means adding a JSON file and redeploying.

## 6. Draft queue — scraped headlines awaiting manual review

- New `DraftEntry` type (`lib/types.ts`) and `getAllDrafts()` / `getDraftById()`
  (`lib/getDrafts.ts`), reading `/data/drafts` — a private, admin-only mirror of the
  `/data/layoffs` reader, but tolerant of malformed files (skips rather than throws,
  since these are machine-written) and never imported by any public page or route.
- `scripts/fetch-drafts.mjs`: standalone Node script (no framework dependency) that
  fetches the Google News RSS feed for `"tech layoffs"`, parses it with
  `fast-xml-parser`, and writes one JSON file per new item to `/data/drafts`
  (headline, link, publish date, fetched-at timestamp). Skips any item whose link
  already appears as a draft's `link` or as a `sources[].url` in `/data/layoffs` —
  verified by mocking the feed response with a URL already present in the
  Lucid sample entry and confirming it was excluded while a genuinely new URL
  was saved.
- Scheduling: chose GitHub Actions (`.github/workflows/fetch-drafts.yml`, daily cron
  + `workflow_dispatch`) over Vercel Cron. Reason: this app's whole data model is
  JSON files committed to git, but Vercel's production filesystem is read-only
  outside `/tmp` and doesn't persist across invocations — a Vercel Cron function
  could fetch the feed but couldn't durably save new drafts without also scripting
  a GitHub API commit. The Action runs directly against the git checkout, writes
  the files, and `git commit && git push`es only when there's something new,
  which triggers Vercel's normal auto-deploy.
- `/admin` now has a **Drafts** section (`components/admin/DraftsList.tsx`) above the
  existing add-entry form, listing each pending draft's headline, link, and date with
  two actions:
  - **Publish** — a link to `/admin?draftId=…` that pre-fills the same Phase 5
    `LayoffForm` (date announced, a starting-point summary from the headline, and
    the first source row) via a new `initialValues` prop, so company, industry,
    exact headcount, and the real write-up are still typed by hand. On successful
    submit, `createLayoffAction` deletes the source draft file (matched by a hidden
    `draftId` field).
  - **Dismiss** — a new `dismissDraftAction` server action that deletes the draft
    file directly; both it and the draft-cleanup path in `createLayoffAction`
    guard the id against path traversal before touching the filesystem.
- Verified end-to-end with Playwright against the running dev server (not just
  `tsc`/build): logged into `/admin`, confirmed a sample draft's headline/link
  render, clicked Publish and confirmed the form fields came back pre-filled with
  the right values, submitted the form and confirmed both the new `/data/layoffs`
  entry was written correctly *and* the draft file disappeared, then separately
  confirmed Dismiss deletes a draft and the section falls back to "No pending
  drafts."
