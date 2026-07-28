import { Users, ArrowRight } from "lucide-react";
import { categoryStyles, type Layoff } from "@/lib/layoffs";

export default function LayoffCard({ layoff }: { layoff: Layoff }) {
  const badge = categoryStyles[layoff.category];

  return (
    <div className="mb-3 rounded-xl border border-border bg-surface-2 p-4 last:mb-0">
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-1 text-[13px] font-medium">
            {layoff.initials}
          </div>
          <div>
            <p className="text-[15px] font-medium">{layoff.company}</p>
            <p className="text-[13px] text-text-secondary">{layoff.date}</p>
          </div>
        </div>
        <span
          className="rounded px-2.5 py-1 text-xs"
          style={{ backgroundColor: badge.bg, color: badge.text }}
        >
          {layoff.category}
        </span>
      </div>
      <p className="mb-2 text-sm text-text-secondary">{layoff.summary}</p>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-[13px] font-medium">
          <Users size={14} aria-hidden="true" />
          {layoff.affected.toLocaleString()} affected
        </span>
        <a
          href="#"
          className="flex items-center gap-1 text-[13px] text-text-accent"
        >
          Read more
          <ArrowRight size={12} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
