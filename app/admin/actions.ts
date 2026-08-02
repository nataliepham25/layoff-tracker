"use server";

import fs from "node:fs";
import path from "node:path";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createSession,
  destroySession,
  isAuthenticated,
  verifyPassword,
} from "@/lib/auth";
import type { LayoffEntry, LayoffSource } from "@/lib/types";

const LAYOFFS_DIR = path.join(process.cwd(), "data", "layoffs");
const SOURCE_ROW_COUNT = 3;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export type LoginState = { error?: string };

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  if (!verifyPassword(password)) {
    return { error: "Incorrect password." };
  }
  createSession();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  destroySession();
  redirect("/admin/login");
}

export type CreateLayoffState = { error?: string; success?: { id: string } };

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createLayoffAction(
  _prevState: CreateLayoffState,
  formData: FormData
): Promise<CreateLayoffState> {
  if (!isAuthenticated()) {
    return { error: "Session expired — please log in again." };
  }

  const company = String(formData.get("company") ?? "").trim();
  if (!company) return { error: '"Company" is required.' };

  const industry = String(formData.get("industry") ?? "").trim();
  if (!industry) return { error: '"Industry" is required.' };

  const dateAnnounced = String(formData.get("dateAnnounced") ?? "").trim();
  if (!DATE_PATTERN.test(dateAnnounced) || Number.isNaN(Date.parse(dateAnnounced))) {
    return { error: '"Date announced" must be a valid date.' };
  }

  const employeesAffectedRaw = String(formData.get("employeesAffected") ?? "").trim();
  const employeesAffected = Number(employeesAffectedRaw);
  if (
    !employeesAffectedRaw ||
    !Number.isFinite(employeesAffected) ||
    employeesAffected < 0
  ) {
    return { error: '"Employees affected" must be a non-negative number.' };
  }

  const percentageAffectedRaw = String(formData.get("percentageAffected") ?? "").trim();
  let percentageAffected: number | undefined;
  if (percentageAffectedRaw) {
    percentageAffected = Number(percentageAffectedRaw);
    if (
      !Number.isFinite(percentageAffected) ||
      percentageAffected < 0 ||
      percentageAffected > 100
    ) {
      return { error: '"Percentage affected" must be a number between 0 and 100.' };
    }
  }

  const summary = String(formData.get("summary") ?? "").trim();
  if (!summary) return { error: '"Summary" is required.' };

  const bodyRaw = String(formData.get("body") ?? "").trim();
  const body = bodyRaw
    ? bodyRaw
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
    : undefined;

  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  if (tags.length === 0) return { error: "At least one tag is required." };

  const sources: LayoffSource[] = [];
  for (let i = 0; i < SOURCE_ROW_COUNT; i++) {
    const url = String(formData.get(`sourceUrl${i}`) ?? "").trim();
    const label = String(formData.get(`sourceLabel${i}`) ?? "").trim();
    if (url) sources.push({ url, label: label || undefined });
  }
  if (sources.length === 0) {
    return { error: "At least one source URL is required." };
  }

  const entry: Omit<LayoffEntry, "id"> = {
    company,
    industry,
    dateAnnounced,
    employeesAffected,
    percentageAffected,
    summary,
    body,
    sources,
    tags,
  };

  const slug = slugify(company) || "company";
  let id = `${slug}-${dateAnnounced}`;
  let suffix = 2;
  while (fs.existsSync(path.join(LAYOFFS_DIR, `${id}.json`))) {
    id = `${slug}-${dateAnnounced}-${suffix}`;
    suffix += 1;
  }

  fs.writeFileSync(
    path.join(LAYOFFS_DIR, `${id}.json`),
    JSON.stringify(entry, null, 2) + "\n"
  );

  revalidatePath("/");
  revalidatePath("/stats");
  revalidatePath("/layoffs/[slug]", "page");

  return { success: { id } };
}
