import fs from "node:fs";
import path from "node:path";
import type { LayoffEntry, LayoffSource } from "./types";

const LAYOFFS_DIR = path.join(process.cwd(), "data", "layoffs");

function fail(fileName: string, message: string): never {
  throw new Error(`Invalid layoff entry in data/layoffs/${fileName}: ${message}`);
}

function parseSources(fileName: string, value: unknown): LayoffSource[] {
  if (!Array.isArray(value) || value.length === 0) {
    fail(fileName, '"sources" must be a non-empty array');
  }

  return value.map((entry, index) => {
    if (typeof entry !== "object" || entry === null) {
      fail(fileName, `"sources[${index}]" must be an object`);
    }
    const source = entry as Record<string, unknown>;
    if (typeof source.url !== "string" || source.url.length === 0) {
      fail(fileName, `"sources[${index}].url" must be a non-empty string`);
    }
    if (source.label !== undefined && typeof source.label !== "string") {
      fail(fileName, `"sources[${index}].label" must be a string if present`);
    }
    return { url: source.url, label: source.label as string | undefined };
  });
}

function parseTags(fileName: string, value: unknown): string[] {
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    !value.every((tag) => typeof tag === "string" && tag.length > 0)
  ) {
    fail(fileName, '"tags" must be a non-empty array of strings');
  }
  return value as string[];
}

function parseBody(fileName: string, value: unknown): string[] | undefined {
  if (value === undefined) return undefined;
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    !value.every((p) => typeof p === "string" && p.length > 0)
  ) {
    fail(fileName, '"body" must be a non-empty array of strings if present');
  }
  return value as string[];
}

function parseEntry(fileName: string, raw: unknown): LayoffEntry {
  if (typeof raw !== "object" || raw === null) {
    fail(fileName, "expected a JSON object");
  }
  const data = raw as Record<string, unknown>;

  const stringFields = ["company", "industry", "dateAnnounced", "summary"] as const;
  for (const field of stringFields) {
    if (typeof data[field] !== "string" || (data[field] as string).length === 0) {
      fail(fileName, `"${field}" must be a non-empty string`);
    }
  }

  if (Number.isNaN(Date.parse(data.dateAnnounced as string))) {
    fail(fileName, '"dateAnnounced" must be a valid date string, e.g. "2026-06-23"');
  }

  if (
    typeof data.employeesAffected !== "number" ||
    !Number.isFinite(data.employeesAffected) ||
    data.employeesAffected < 0
  ) {
    fail(fileName, '"employeesAffected" must be a non-negative number');
  }

  if (data.percentageAffected !== undefined) {
    if (
      typeof data.percentageAffected !== "number" ||
      !Number.isFinite(data.percentageAffected) ||
      data.percentageAffected < 0 ||
      data.percentageAffected > 100
    ) {
      fail(fileName, '"percentageAffected" must be a number between 0 and 100 if present');
    }
  }

  return {
    id: fileName.replace(/\.json$/, ""),
    company: data.company as string,
    industry: data.industry as string,
    dateAnnounced: data.dateAnnounced as string,
    employeesAffected: data.employeesAffected as number,
    percentageAffected: data.percentageAffected as number | undefined,
    summary: data.summary as string,
    body: parseBody(fileName, data.body),
    sources: parseSources(fileName, data.sources),
    tags: parseTags(fileName, data.tags),
  };
}

/**
 * Reads every JSON file in /data/layoffs, validates it, and returns all
 * entries sorted by dateAnnounced, newest first. Add a new layoff by
 * dropping another JSON file into that directory — no other code changes
 * needed.
 */
export function getAllLayoffs(): LayoffEntry[] {
  const fileNames = fs
    .readdirSync(LAYOFFS_DIR)
    .filter((fileName) => fileName.endsWith(".json"));

  const entries = fileNames.map((fileName) => {
    const filePath = path.join(LAYOFFS_DIR, fileName);
    const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return parseEntry(fileName, raw);
  });

  return entries.sort(
    (a, b) => Date.parse(b.dateAnnounced) - Date.parse(a.dateAnnounced)
  );
}

export function getLayoffBySlug(slug: string): LayoffEntry | undefined {
  return getAllLayoffs().find((entry) => entry.id === slug);
}
