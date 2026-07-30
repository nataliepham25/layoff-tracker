import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LayoffEntry } from "@/lib/types";
import { formatDate, getInitials } from "@/lib/format";
import { getTagStyle } from "@/lib/tagStyles";

export default function LayoffCard({ entry }: { entry: LayoffEntry }) {
  const primaryTagStyle = getTagStyle(entry.tags[0]);
  const href = `/layoffs/${entry.id}`;

  return (
    <article
      className="group border-b border-border py-7 first:pt-0 last:border-b-0"
      style={{ borderLeft: `3px solid ${primaryTagStyle.text}22` }}
    >
      <div className="flex items-start gap-4 pl-4 sm:gap-5 sm:pl-5">
        <div
          className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border font-serif text-lg sm:flex"
          style={{ backgroundColor: primaryTagStyle.bg, color: primaryTagStyle.text }}
        >
          {getInitials(entry.company)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs uppercase tracking-wide text-text-secondary">
            <time dateTime={entry.dateAnnounced}>{formatDate(entry.dateAnnounced)}</time>
            <span aria-hidden="true">&middot;</span>
            <span>{entry.industry}</span>
            {entry.tags.map((tag) => {
              const style = getTagStyle(tag);
              return (
                <span
                  key={tag}
                  className="rounded-full px-2 py-0.5 normal-case tracking-normal"
                  style={{ backgroundColor: style.bg, color: style.text }}
                >
                  {tag}
                </span>
              );
            })}
          </div>

          <h3 className="mb-1.5 font-serif text-xl font-medium sm:text-[22px]">
            <Link href={href} className="transition-colors hover:text-text-accent">
              {entry.company}
            </Link>
          </h3>

          <p className="mb-4 max-w-2xl text-[15px] leading-relaxed text-text-secondary">
            {entry.summary}
          </p>

          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-2xl font-semibold text-text-accent">
                {entry.employeesAffected.toLocaleString()}
              </span>
              <span className="text-xs uppercase tracking-wide text-text-secondary">
                affected
                {entry.percentageAffected !== undefined
                  ? ` · ${entry.percentageAffected}% of workforce`
                  : ""}
              </span>
            </div>

            <Link
              href={href}
              className="flex items-center gap-1 text-[13px] font-medium text-text-accent"
            >
              Read more
              <ArrowRight
                size={12}
                className="transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
