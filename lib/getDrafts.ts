import fs from "node:fs";
import path from "node:path";
import type { DraftEntry } from "./types";

const DRAFTS_DIR = path.join(process.cwd(), "data", "drafts");

/**
 * Reads every JSON file in /data/drafts. Only ever called from admin-only
 * code paths (see app/admin) — this data must never reach a public page.
 * Malformed files are skipped rather than throwing, since these are
 * machine-written by the scheduled fetch script, not hand-edited.
 */
export function getAllDrafts(): DraftEntry[] {
  if (!fs.existsSync(DRAFTS_DIR)) return [];

  const fileNames = fs
    .readdirSync(DRAFTS_DIR)
    .filter((fileName) => fileName.endsWith(".json"));

  const drafts: DraftEntry[] = [];
  for (const fileName of fileNames) {
    try {
      const raw = JSON.parse(
        fs.readFileSync(path.join(DRAFTS_DIR, fileName), "utf-8")
      );
      if (
        typeof raw.headline !== "string" ||
        typeof raw.link !== "string" ||
        typeof raw.publishDate !== "string" ||
        typeof raw.fetchedAt !== "string"
      ) {
        continue;
      }
      drafts.push({
        id: fileName.replace(/\.json$/, ""),
        headline: raw.headline,
        link: raw.link,
        publishDate: raw.publishDate,
        fetchedAt: raw.fetchedAt,
      });
    } catch {
      continue;
    }
  }

  return drafts.sort((a, b) => Date.parse(b.fetchedAt) - Date.parse(a.fetchedAt));
}

export function getDraftById(id: string): DraftEntry | undefined {
  return getAllDrafts().find((draft) => draft.id === id);
}
