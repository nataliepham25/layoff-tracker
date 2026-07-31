import type { CompanyLeaderboardEntry } from "@/lib/stats";
import { getInitials } from "@/lib/format";

export default function CompanyLeaderboard({
  entries,
}: {
  entries: CompanyLeaderboardEntry[];
}) {
  if (entries.length === 0) {
    return (
      <p className="py-6 text-center text-sm italic text-text-secondary">
        No companies tracked yet.
      </p>
    );
  }

  const maxTotal = entries[0].total;

  return (
    <ol className="space-y-3">
      {entries.map((entry, index) => {
        const widthPct = maxTotal > 0 ? (entry.total / maxTotal) * 100 : 0;
        return (
          <li key={entry.company} className="flex items-center gap-3">
            <span className="w-5 shrink-0 text-right font-serif text-sm text-text-secondary">
              {index + 1}
            </span>
            <span
              className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border font-serif text-xs sm:flex"
              aria-hidden="true"
            >
              {getInitials(entry.company)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <span className="truncate text-sm font-medium text-text-primary">
                  {entry.company}
                </span>
                <span className="shrink-0 text-right text-sm tabular-nums text-text-primary">
                  {entry.total.toLocaleString()}
                  <span className="ml-1 text-xs font-normal text-text-secondary">
                    {entry.count} {entry.count === 1 ? "layoff" : "layoffs"}
                  </span>
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-accent">
                <div
                  className="h-2 rounded-full bg-text-accent"
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
