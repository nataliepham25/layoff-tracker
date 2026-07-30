"use client";

import { useMemo, useState } from "react";
import FilterBar, { type SortOption } from "@/components/FilterBar";
import LayoffCard from "@/components/LayoffCard";
import type { LayoffEntry } from "@/lib/types";

export default function Feed({ entries }: { entries: LayoffEntry[] }) {
  const tags = useMemo(
    () => Array.from(new Set(entries.flatMap((entry) => entry.tags))).sort(),
    [entries]
  );

  const [activeTag, setActiveTag] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const visibleEntries = useMemo(() => {
    const filtered =
      activeTag === "All"
        ? entries
        : entries.filter((entry) => entry.tags.includes(activeTag));

    return [...filtered].sort((a, b) =>
      sortBy === "newest"
        ? Date.parse(b.dateAnnounced) - Date.parse(a.dateAnnounced)
        : b.employeesAffected - a.employeesAffected
    );
  }, [entries, activeTag, sortBy]);

  return (
    <section aria-labelledby="feed-heading">
      <h2 id="feed-heading" className="sr-only">
        Layoff feed
      </h2>
      <FilterBar
        tags={tags}
        activeTag={activeTag}
        onTagChange={setActiveTag}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      {visibleEntries.length === 0 ? (
        <p className="py-10 text-center text-sm italic text-text-secondary">
          No layoffs tagged &ldquo;{activeTag}&rdquo; yet.
        </p>
      ) : (
        <div>
          {visibleEntries.map((entry) => (
            <LayoffCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </section>
  );
}
