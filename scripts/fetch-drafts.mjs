#!/usr/bin/env node
// Fetches the Google News RSS feed for "tech layoffs" and saves each new item
// as its own JSON file in /data/drafts, skipping anything whose link already
// shows up in /data/drafts or /data/layoffs. Never touches /data/layoffs
// itself — a human has to review and publish each draft from /admin.

import fs from "node:fs";
import path from "node:path";
import { XMLParser } from "fast-xml-parser";

const FEED_URL =
  "https://news.google.com/rss/search?q=%22tech+layoffs%22&hl=en-US&gl=US&ceid=US:en";

const DRAFTS_DIR = path.join(process.cwd(), "data", "drafts");
const LAYOFFS_DIR = path.join(process.cwd(), "data", "layoffs");

function readExistingUrls(dir, extractUrls) {
  if (!fs.existsSync(dir)) return new Set();
  const urls = new Set();
  for (const fileName of fs.readdirSync(dir)) {
    if (!fileName.endsWith(".json")) continue;
    try {
      const data = JSON.parse(fs.readFileSync(path.join(dir, fileName), "utf-8"));
      for (const url of extractUrls(data)) {
        if (typeof url === "string" && url) urls.add(url);
      }
    } catch {
      // Skip unreadable/malformed files rather than aborting the whole run.
    }
  }
  return urls;
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function toIsoDate(pubDate) {
  const parsed = new Date(pubDate);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
}

async function main() {
  const res = await fetch(FEED_URL, {
    headers: { "User-Agent": "layoff-tracker-draft-bot/1.0" },
  });
  if (!res.ok) {
    throw new Error(`Feed fetch failed: ${res.status} ${res.statusText}`);
  }
  const xml = await res.text();

  const parser = new XMLParser();
  const feed = parser.parse(xml);
  const rawItems = feed?.rss?.channel?.item;
  const items = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];

  if (items.length === 0) {
    console.log("No items found in feed.");
    return;
  }

  fs.mkdirSync(DRAFTS_DIR, { recursive: true });

  const knownUrls = new Set([
    ...readExistingUrls(DRAFTS_DIR, (data) => [data.link]),
    ...readExistingUrls(LAYOFFS_DIR, (data) =>
      Array.isArray(data.sources) ? data.sources.map((s) => s?.url) : []
    ),
  ]);

  let added = 0;
  for (const item of items) {
    const headline = typeof item.title === "string" ? item.title.trim() : "";
    const link = typeof item.link === "string" ? item.link.trim() : "";
    const pubDate = typeof item.pubDate === "string" ? item.pubDate.trim() : "";

    if (!headline || !link) continue;
    if (knownUrls.has(link)) continue;

    const publishDate = toIsoDate(pubDate) ?? new Date().toISOString().slice(0, 10);
    const slug = slugify(headline) || "item";
    let id = `${publishDate}-${slug}`;
    let suffix = 2;
    while (fs.existsSync(path.join(DRAFTS_DIR, `${id}.json`))) {
      id = `${publishDate}-${slug}-${suffix}`;
      suffix += 1;
    }

    const draft = {
      headline,
      link,
      publishDate,
      fetchedAt: new Date().toISOString(),
    };

    fs.writeFileSync(
      path.join(DRAFTS_DIR, `${id}.json`),
      JSON.stringify(draft, null, 2) + "\n"
    );

    knownUrls.add(link);
    added += 1;
  }

  console.log(`Fetched ${items.length} feed item(s), added ${added} new draft(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
