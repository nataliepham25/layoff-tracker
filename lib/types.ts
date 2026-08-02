export type LayoffSource = {
  url: string;
  label?: string;
};

export type LayoffEntry = {
  /** Derived from the JSON file name, not stored in the file itself. */
  id: string;
  company: string;
  industry: string;
  /** ISO 8601 date, e.g. "2026-06-23". */
  dateAnnounced: string;
  employeesAffected: number;
  /** e.g. 13 for 13%. Omit if unknown. */
  percentageAffected?: number;
  summary: string;
  /** Full write-up, one paragraph per entry. Falls back to `summary` if omitted. */
  body?: string[];
  sources: LayoffSource[];
  tags: string[];
};

/**
 * A scraped headline awaiting manual review in /admin. Lives in
 * /data/drafts, never in /data/layoffs, and is never read by public pages.
 */
export type DraftEntry = {
  /** Derived from the JSON file name, not stored in the file itself. */
  id: string;
  headline: string;
  /** The article URL from the feed; doubles as the dedup key. */
  link: string;
  /** ISO 8601 date, best-effort parsed from the feed's pubDate. */
  publishDate: string;
  /** ISO 8601 timestamp of when the draft script saved this file. */
  fetchedAt: string;
};
