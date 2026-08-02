# Draft scraper — how to run it and test the draft queue

This covers the Google News RSS scraper that feeds `/admin`'s Drafts section, and how
to manually test the whole draft-queue feature on localhost.

## Running the scraper

From the project root, with no dev server required:

```bash
npm run fetch-drafts
```

This runs `scripts/fetch-drafts.mjs`, which:

1. Fetches the Google News RSS feed for `"tech layoffs"`.
2. Extracts headline, source link, and publish date for each item.
3. Skips any item whose link already exists in `/data/drafts` or as a
   `sources[].url` in `/data/layoffs` (no duplicates).
4. Writes one new JSON file per new item into `/data/drafts`.

You'll see output like:

```
Fetched 100 feed item(s), added 37 new draft(s).
```

Run it again right away and you should see far fewer (or zero) new drafts added,
since most links were already saved the first time — that's the dedup working.

In production this runs automatically once a day via `.github/workflows/fetch-drafts.yml`
(GitHub Actions cron), which commits any new draft files and pushes, triggering a
normal Vercel deploy.

## Seeding a draft by hand (optional)

If you'd rather not hit the live feed, drop in a fake draft directly:

```bash
cat > data/drafts/2026-08-01-test-company-layoffs.json <<'EOF'
{
  "headline": "Test Company lays off 300 employees - Some News Site",
  "link": "https://example.com/test-company-layoffs",
  "publishDate": "2026-08-01",
  "fetchedAt": "2026-08-02T12:00:00.000Z"
}
EOF
```

## Testing on localhost

1. Make sure `.env.local` has `ADMIN_PASSWORD` set (copy from `.env.local.example`
   if needed).
2. Run the scraper (or seed a draft by hand) as above.
3. Start the dev server: `npm run dev`.
4. Go to `http://localhost:3000/admin` and log in.

### What to look for

- A **"Drafts (N)"** section above the "Add a layoff" form, listing each draft's
  headline, its source link (clickable, opens in a new tab), and the date.

### Test "Publish"

- Click **Publish** on any draft. The URL changes to `/admin?draftId=...` and the
  page jumps down to the "Add a layoff" form.
- Confirm the form is pre-filled: **Date announced**, **Summary** (from the
  headline), and the first **Sources** row (label "Google News" + the article URL).
- Fill in Company, Industry, Employees affected, and Tags (required), then click
  **Save entry**.
- Confirm: it reports saving with a link to the new entry, the draft disappears
  from the Drafts list, and a new file appears in `/data/layoffs`.

### Test "Dismiss"

- Click **Dismiss** on another draft. Confirm it disappears from the list
  immediately, and its file is gone from `/data/drafts` (`ls data/drafts`).

### Confirm privacy

- Browse the public site (`/`, `/stats`, `/layoffs/[slug]`) — nothing about drafts
  should appear anywhere. No public route reads `/data/drafts`.

## Cleaning up test data

```bash
rm data/drafts/*.json   # keep .gitkeep
```
