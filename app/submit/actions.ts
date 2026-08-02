"use server";

import fs from "node:fs";
import path from "node:path";
import type { TipSubmission } from "@/lib/types";

const SUBMISSIONS_DIR = path.join(process.cwd(), "data", "submissions");

export type SubmitTipState = { error?: string; success?: boolean };

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function submitTipAction(
  _prevState: SubmitTipState,
  formData: FormData
): Promise<SubmitTipState> {
  const company = String(formData.get("company") ?? "").trim();
  if (!company) return { error: '"Company" is required.' };

  const details = String(formData.get("details") ?? "").trim();
  if (!details) return { error: '"What happened?" is required.' };

  const sourceLink = String(formData.get("sourceLink") ?? "").trim();
  if (!sourceLink) return { error: '"Source link" is required.' };

  const note = String(formData.get("note") ?? "").trim();

  const submission: Omit<TipSubmission, "id"> = {
    company,
    details,
    sourceLink,
    note: note || undefined,
    submittedAt: new Date().toISOString(),
  };

  fs.mkdirSync(SUBMISSIONS_DIR, { recursive: true });

  const slug = slugify(company) || "tip";
  let id = `${slug}-${Date.now()}`;
  let suffix = 2;
  while (fs.existsSync(path.join(SUBMISSIONS_DIR, `${id}.json`))) {
    id = `${slug}-${Date.now()}-${suffix}`;
    suffix += 1;
  }

  fs.writeFileSync(
    path.join(SUBMISSIONS_DIR, `${id}.json`),
    JSON.stringify(submission, null, 2) + "\n"
  );

  return { success: true };
}
