import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Layoff Tracker",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="mb-1.5 font-serif text-[28px] font-medium">About Layoff Tracker</h1>
        <p className="text-sm text-text-secondary">
          Layoff Tracker follows tech industry layoffs in real time, giving a
          clear, up-to-date picture of which companies are cutting jobs, how
          many people are affected, and why.
        </p>
      </div>
      <div className="space-y-4 rounded-xl border border-border bg-surface-2 p-6 text-sm text-text-secondary">
        <p>
          We pull together publicly reported layoffs from across the tech
          industry — big tech, startups, and everything in between — so
          job seekers, journalists, and researchers have one place to check.
        </p>
        <p>
          Spotted something we&apos;re missing? Head over to{" "}
          <a href="/submit" className="text-text-accent">
            Submit a tip
          </a>{" "}
          and let us know.
        </p>
      </div>
    </main>
  );
}
