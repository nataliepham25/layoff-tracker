import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit a Tip | Layoff Tracker",
};

export default function SubmitPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="mb-1.5 text-[22px] font-medium">Submit a tip</h1>
        <p className="text-sm text-text-secondary">
          Know about layoffs we haven&apos;t covered? Let us know — tips can be
          anonymous.
        </p>
      </div>
      <form className="space-y-4 rounded-xl border border-border bg-surface-2 p-6">
        <div>
          <label
            htmlFor="company"
            className="mb-1.5 block text-[13px] font-medium"
          >
            Company
          </label>
          <input
            id="company"
            name="company"
            type="text"
            placeholder="e.g. Acme Corp"
            className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-text-accent"
          />
        </div>
        <div>
          <label
            htmlFor="details"
            className="mb-1.5 block text-[13px] font-medium"
          >
            What happened?
          </label>
          <textarea
            id="details"
            name="details"
            rows={5}
            placeholder="Share what you know — number of roles affected, teams impacted, source links, etc."
            className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-text-accent"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-[13px] font-medium"
          >
            Your email (optional)
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-text-accent"
          />
        </div>
        <button
          type="submit"
          disabled
          className="rounded bg-accent px-4 py-2 text-sm font-medium text-text-accent disabled:cursor-not-allowed disabled:opacity-70"
        >
          Submit tip (coming soon)
        </button>
      </form>
    </main>
  );
}
