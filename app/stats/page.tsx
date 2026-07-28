import type { Metadata } from "next";
import StatsStrip from "@/components/StatsStrip";

export const metadata: Metadata = {
  title: "Stats | Layoff Tracker",
};

export default function StatsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="mb-1.5 text-[22px] font-medium">Stats</h1>
        <p className="text-sm text-text-secondary">
          A closer look at the numbers behind this year&apos;s layoffs.
        </p>
      </div>
      <StatsStrip />
      <div className="rounded-xl border border-border bg-surface-2 p-6 text-center text-sm text-text-secondary">
        Detailed charts and breakdowns are coming soon.
      </div>
    </main>
  );
}
