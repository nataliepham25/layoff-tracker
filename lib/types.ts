export type LayoffSource = {
  url: string;
  label?: string;
};

export type LayoffEntry = {
  /** Derived from the JSON file name, not stored in the file itself. */
  id: string;
  company: string;
  industry: string;
  /** ISO 8601 date, e.g. "2026-06-23". */
  dateAnnounced: string;
  employeesAffected: number;
  /** e.g. 13 for 13%. Omit if unknown. */
  percentageAffected?: number;
  summary: string;
  sources: LayoffSource[];
  tags: string[];
};
