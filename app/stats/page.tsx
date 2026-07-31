import type { Metadata } from "next";
import StatsStrip from "@/components/StatsStrip";
import MonthlyLayoffsChart from "@/components/MonthlyLayoffsChart";
import CompanyLeaderboard from "@/components/CompanyLeaderboard";
import { getAllLayoffs } from "@/lib/getLayoffs";
import {
  getYearToDateStats,
  getMonthlyTotals,
  getCompanyLeaderboard,
} from "@/lib/stats";

export const metadata: Metadata = {
  title: "Stats | Layoff Tracker",
};

export default function StatsPage() {
  const entries = getAllLayoffs();
  const year = new Date().getFullYear();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="mb-1.5 font-serif text-[28px] font-medium">Stats</h1>
        <p className="text-sm text-text-secondary">
          A closer look at the numbers behind this year&apos;s layoffs.
        </p>
      </div>

      <StatsStrip stats={getYearToDateStats(entries, year)} />

      <section aria-labelledby="monthly-heading" className="mb-8">
        <h2 id="monthly-heading" className="mb-1 font-serif text-lg font-medium">
          Layoffs by month
        </h2>
        <p className="mb-4 text-sm text-text-secondary">
          People affected per month, {year}.
        </p>
        <div className="rounded-xl border border-border bg-surface-2 p-4 sm:p-6">
          <MonthlyLayoffsChart data={getMonthlyTotals(entries, year)} />
        </div>
      </section>

      <section aria-labelledby="leaderboard-heading">
        <h2 id="leaderboard-heading" className="mb-1 font-serif text-lg font-medium">
          Company leaderboard
        </h2>
        <p className="mb-4 text-sm text-text-secondary">
          Companies with the most people affected, all time.
        </p>
        <div className="rounded-xl border border-border bg-surface-2 p-4 sm:p-6">
          <CompanyLeaderboard entries={getCompanyLeaderboard(entries)} />
        </div>
      </section>
    </main>
  );
}
