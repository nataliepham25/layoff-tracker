export type LayoffCategory = "Big tech" | "Startup" | "AI-driven";

export type Layoff = {
  id: string;
  company: string;
  initials: string;
  date: string;
  category: LayoffCategory;
  summary: string;
  affected: number;
};

export const categoryStyles: Record<
  LayoffCategory,
  { bg: string; text: string }
> = {
  "Big tech": { bg: "#E6F1FB", text: "#0C447C" },
  "AI-driven": { bg: "#E1F5EE", text: "#085041" },
  Startup: { bg: "#FAECE7", text: "#712B13" },
};

export const stats = [
  { label: "Layoffs tracked", value: "322" },
  { label: "People affected", value: "205,832" },
  { label: "Companies", value: "50" },
];

export const filters = ["All", "Big tech", "Startups", "AI-driven"] as const;

export const sampleLayoffs: Layoff[] = [
  {
    id: "oracle-2026-06-23",
    company: "Oracle",
    initials: "OR",
    date: "Jun 23, 2026",
    category: "Big tech",
    summary:
      "Cut roughly 13% of its workforce, about 21,000 roles, citing AI-driven efficiency gains across operations.",
    affected: 21000,
  },
  {
    id: "microsoft-2026-07-02",
    company: "Microsoft",
    initials: "MS",
    date: "Jul 2, 2026",
    category: "AI-driven",
    summary:
      "Reduced headcount by 4,800, mostly across the Xbox gaming division, in the latest of several rounds this year.",
    affected: 4800,
  },
  {
    id: "lucid-2026-06-14",
    company: "Lucid",
    initials: "LC",
    date: "Jun 14, 2026",
    category: "Startup",
    summary:
      "Trimmed its workforce as part of a broader cost-cutting push across EV manufacturing.",
    affected: 1200,
  },
];
