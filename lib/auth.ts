import { cookies } from "next/headers";
import crypto from "node:crypto";

const SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function sha256Hex(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function verifyPassword(candidate: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const expected = Buffer.from(sha256Hex(password), "hex");
  const actual = Buffer.from(sha256Hex(candidate), "hex");
  return crypto.timingSafeEqual(expected, actual);
}

// The cookie stores a hash of the password rather than the password itself,
// so a leaked cookie doesn't directly hand over the login credential.
export function createSession(): void {
  cookies().set(SESSION_COOKIE, sha256Hex(process.env.ADMIN_PASSWORD!), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export function destroySession(): void {
  cookies().delete(SESSION_COOKIE);
}

export function isAuthenticated(): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;

  const cookie = cookies().get(SESSION_COOKIE)?.value;
  if (!cookie) return false;

  try {
    const expected = Buffer.from(sha256Hex(password), "hex");
    const actual = Buffer.from(cookie, "hex");
    return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}
