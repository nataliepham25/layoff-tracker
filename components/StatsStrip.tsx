type Stat = { label: string; value: string };

const SM_COLS: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
};

export default function StatsStrip({ stats }: { stats: Stat[] }) {
  const smCols = SM_COLS[stats.length] ?? "sm:grid-cols-3";

  return (
    <div
      className={`mb-8 grid grid-cols-1 divide-y divide-border border-y border-border sm:divide-x sm:divide-y-0 ${smCols}`}
    >
      {stats.map((stat) => (
        <div key={stat.label} className="px-1 py-4 first:pt-4 sm:px-6 sm:first:pl-0">
          <p className="mb-1 text-xs uppercase tracking-wide text-text-secondary">
            {stat.label}
          </p>
          <p className="font-serif text-3xl font-medium text-text-accent">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
