import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getAllLayoffs, getLayoffBySlug } from "@/lib/getLayoffs";
import { formatDate, getInitials } from "@/lib/format";
import { getTagStyle } from "@/lib/tagStyles";

export function generateStaticParams() {
  return getAllLayoffs().map((entry) => ({ slug: entry.id }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const entry = getLayoffBySlug(params.slug);
  if (!entry) return {};

  const title = `${entry.company}: ${entry.employeesAffected.toLocaleString()} laid off | Layoff Tracker`;

  return {
    title,
    description: entry.summary,
    openGraph: {
      title,
      description: entry.summary,
      type: "article",
      publishedTime: entry.dateAnnounced,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: entry.summary,
    },
  };
}

export default function LayoffDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const entry = getLayoffBySlug(params.slug);
  if (!entry) notFound();

  const primaryTagStyle = getTagStyle(entry.tags[0]);
  const paragraphs = entry.body ?? [entry.summary];

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link
        href="/"
        className="mb-10 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-text-secondary transition-colors hover:text-text-primary"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        Back to the feed
      </Link>

      <div className="mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs uppercase tracking-wide text-text-secondary">
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

      <div className="mb-8 flex items-center gap-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border font-serif text-lg"
          style={{ backgroundColor: primaryTagStyle.bg, color: primaryTagStyle.text }}
        >
          {getInitials(entry.company)}
        </div>
        <h1 className="font-serif text-3xl font-medium sm:text-4xl">{entry.company}</h1>
      </div>

      <div className="mb-8 flex flex-wrap items-baseline gap-x-2 gap-y-1 border-y border-border py-5">
        <span className="font-serif text-4xl font-semibold text-text-accent">
          {entry.employeesAffected.toLocaleString()}
        </span>
        <span className="text-xs uppercase tracking-wide text-text-secondary">
          employees affected
          {entry.percentageAffected !== undefined
            ? ` · ${entry.percentageAffected}% of workforce`
            : ""}
        </span>
      </div>

      <div className="space-y-4 text-[17px] leading-relaxed text-text-primary">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-12 border-t border-border pt-6">
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-text-secondary">
          Sources
        </h2>
        <ul className="space-y-2">
          {entry.sources.map((source) => (
            <li key={source.url}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[15px] text-text-accent hover:underline"
              >
                {source.label ?? source.url}
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
