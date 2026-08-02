import Link from "next/link";
import { dismissDraftAction } from "@/app/admin/actions";
import type { DraftEntry } from "@/lib/types";

function formatDate(isoDate: string): string {
  const parsed = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DraftsList({ drafts }: { drafts: DraftEntry[] }) {
  return (
    <section className="mb-8">
      <h2 className="mb-1.5 font-serif text-xl font-medium">
        Drafts{drafts.length > 0 ? ` (${drafts.length})` : ""}
      </h2>
      <p className="mb-3 text-sm text-text-secondary">
        Pulled automatically from Google News. Private to this page — never shown
        on the public site. Publish to review it in the form below with your own
        headcount and summary, or dismiss it if it&rsquo;s not worth tracking.
      </p>

      {drafts.length === 0 ? (
        <p className="rounded-xl border border-border bg-surface-2 px-4 py-6 text-sm text-text-secondary">
          No pending drafts.
        </p>
      ) : (
        <ul className="space-y-2">
          {drafts.map((draft) => (
            <li key={draft.id} className="rounded-xl border border-border bg-surface-2 p-4">
              <p className="text-sm font-medium">{draft.headline}</p>
              <a
                href={draft.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block truncate text-xs text-text-secondary underline"
              >
                {draft.link}
              </a>
              <div className="mt-3 flex items-center gap-4">
                <span className="text-xs text-text-secondary">{formatDate(draft.publishDate)}</span>
                <Link
                  href={`/admin?draftId=${encodeURIComponent(draft.id)}#add-a-layoff`}
                  className="text-xs font-medium text-text-accent underline"
                >
                  Publish
                </Link>
                <form action={dismissDraftAction}>
                  <input type="hidden" name="id" value={draft.id} />
                  <button
                    type="submit"
                    className="text-xs font-medium text-text-secondary underline hover:text-red-700"
                  >
                    Dismiss
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
