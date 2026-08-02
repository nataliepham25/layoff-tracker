import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LayoffForm from "@/components/admin/LayoffForm";
import { logoutAction } from "@/app/admin/actions";
import { isAuthenticated } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin | Layoff Tracker",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  if (!isAuthenticated()) redirect("/admin/login");

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="mb-1.5 font-serif text-[28px] font-medium">Add a layoff</h1>
          <p className="text-sm text-text-secondary">
            Saves straight to a new JSON file in data/layoffs.
          </p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="whitespace-nowrap text-xs uppercase tracking-wide text-text-secondary hover:text-text-primary"
          >
            Log out
          </button>
        </form>
      </div>
      <LayoffForm />
    </main>
  );
}
