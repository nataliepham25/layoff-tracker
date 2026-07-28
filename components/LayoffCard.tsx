import { Users, ArrowRight } from "lucide-react";
import type { LayoffEntry } from "@/lib/types";
import { formatDate, getInitials } from "@/lib/format";
import { getTagStyle } from "@/lib/tagStyles";

export default function LayoffCard({ entry }: { entry: LayoffEntry }) {
  const [primarySource, ...otherSources] = entry.sources;

  return (
    <div className="mb-3 rounded-xl border border-border bg-surface-2 p-4 last:mb-0">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-1 text-[13px] font-medium">
            {getInitials(entry.company)}
          </div>
          <div>
            <p className="text-[15px] font-medium">{entry.company}</p>
            <p className="text-[13px] text-text-secondary">
              {formatDate(entry.dateAnnounced)} &middot; {entry.industry}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap justify-end gap-1.5">
          {entry.tags.map((tag) => {
            const style = getTagStyle(tag);
            return (
              <span
                key={tag}
                className="whitespace-nowrap rounded px-2.5 py-1 text-xs"
                style={{ backgroundColor: style.bg, color: style.text }}
              >
                {tag}
              </span>
            );
          })}
        </div>
      </div>
      <p className="mb-2 text-sm text-text-secondary">{entry.summary}</p>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-1 text-[13px] font-medium">
          <Users size={14} aria-hidden="true" />
          {entry.employeesAffected.toLocaleString()} affected
          {entry.percentageAffected !== undefined
            ? ` (${entry.percentageAffected}% of workforce)`
            : ""}
        </span>
        <div className="flex items-center gap-3">
          <a
            href={primarySource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[13px] text-text-accent"
          >
            {primarySource.label ?? "Read more"}
            <ArrowRight size={12} aria-hidden="true" />
          </a>
          {otherSources.map((source, index) => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] text-text-accent"
            >
              {source.label ?? `Source ${index + 2}`}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
