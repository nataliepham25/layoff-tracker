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
