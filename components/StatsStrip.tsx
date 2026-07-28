import { stats } from "@/lib/layoffs";

export default function StatsStrip() {
  return (
    <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg bg-surface-1 p-4"
        >
          <p className="mb-1 text-[13px] text-text-secondary">{stat.label}</p>
          <p className="text-2xl font-medium">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
