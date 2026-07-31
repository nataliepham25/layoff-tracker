import type { LayoffEntry } from "./types";

export function getLayoffStats(entries: LayoffEntry[]) {
  const layoffsTracked = entries.length;
  const peopleAffected = entries.reduce(
    (sum, entry) => sum + entry.employeesAffected,
    0
  );
  const companies = new Set(entries.map((entry) => entry.company)).size;

  return [
    { label: "Layoffs tracked", value: layoffsTracked.toLocaleString() },
    { label: "People affected", value: peopleAffected.toLocaleString() },
    { label: "Companies", value: companies.toLocaleString() },
  ];
}

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function entriesForYear(entries: LayoffEntry[], year: number): LayoffEntry[] {
  return entries.filter(
    (entry) => new Date(entry.dateAnnounced).getUTCFullYear() === year
  );
}

export function getYearToDateStats(entries: LayoffEntry[], year: number) {
  const yearEntries = entriesForYear(entries, year);
  const layoffsTracked = yearEntries.length;
  const peopleAffected = yearEntries.reduce(
    (sum, entry) => sum + entry.employeesAffected,
    0
  );

  return [
    { label: `Layoffs tracked in ${year}`, value: layoffsTracked.toLocaleString() },
    { label: `People affected in ${year}`, value: peopleAffected.toLocaleString() },
  ];
}

export type MonthlyTotal = { month: string; total: number; count: number };

export function getMonthlyTotals(
  entries: LayoffEntry[],
  year: number
): MonthlyTotal[] {
  const totals = MONTH_LABELS.map((month) => ({ month, total: 0, count: 0 }));

  for (const entry of entriesForYear(entries, year)) {
    const monthIndex = new Date(entry.dateAnnounced).getUTCMonth();
    totals[monthIndex].total += entry.employeesAffected;
    totals[monthIndex].count += 1;
  }

  return totals;
}

export type CompanyLeaderboardEntry = {
  company: string;
  total: number;
  count: number;
};

export function getCompanyLeaderboard(
  entries: LayoffEntry[],
  limit = 8
): CompanyLeaderboardEntry[] {
  const byCompany = new Map<string, CompanyLeaderboardEntry>();

  for (const entry of entries) {
    const existing = byCompany.get(entry.company);
    if (existing) {
      existing.total += entry.employeesAffected;
      existing.count += 1;
    } else {
      byCompany.set(entry.company, {
        company: entry.company,
        total: entry.employeesAffected,
        count: 1,
      });
    }
  }

  return Array.from(byCompany.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}
