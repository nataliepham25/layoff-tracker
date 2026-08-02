import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { isAdminConfigured, isAuthenticated } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin login | Layoff Tracker",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  if (isAuthenticated()) redirect("/admin");

  return (
    <main className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="mb-1.5 font-serif text-[28px] font-medium">Admin</h1>
      <p className="mb-6 text-sm text-text-secondary">
        Sign in to add a new layoff entry.
      </p>
      {!isAdminConfigured() && (
        <p className="mb-4 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          ADMIN_PASSWORD isn&apos;t set. Add it to .env.local, then restart the
          dev server.
        </p>
      )}
      <LoginForm />
    </main>
  );
}
