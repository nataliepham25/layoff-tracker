import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LayoffForm from "@/components/admin/LayoffForm";
import DraftsList from "@/components/admin/DraftsList";
import { logoutAction } from "@/app/admin/actions";
import { isAuthenticated } from "@/lib/auth";
import { getAllDrafts, getDraftById } from "@/lib/getDrafts";

export const metadata: Metadata = {
  title: "Admin | Layoff Tracker",
  robots: { index: false, follow: false },
};

export default function AdminPage({
  searchParams,
}: {
  searchParams: { draftId?: string };
}) {
  if (!isAuthenticated()) redirect("/admin/login");

  const drafts = getAllDrafts();
  const draft = searchParams.draftId ? getDraftById(searchParams.draftId) : undefined;

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <h1 className="font-serif text-[28px] font-medium">Admin</h1>
        <form action={logoutAction}>
          <button
            type="submit"
            className="whitespace-nowrap text-xs uppercase tracking-wide text-text-secondary hover:text-text-primary"
          >
            Log out
          </button>
        </form>
      </div>

      <DraftsList drafts={drafts} />

      <h2 id="add-a-layoff" className="mb-1.5 font-serif text-xl font-medium">
        Add a layoff
      </h2>
      <p className="mb-3 text-sm text-text-secondary">
        Saves straight to a new JSON file in data/layoffs.
      </p>
      <LayoffForm
        key={draft?.id ?? "blank"}
        initialValues={
          draft
            ? {
                draftId: draft.id,
                dateAnnounced: draft.publishDate,
                summary: draft.headline,
                sourceLabel0: "Google News",
                sourceUrl0: draft.link,
              }
            : undefined
        }
      />
    </main>
  );
}
