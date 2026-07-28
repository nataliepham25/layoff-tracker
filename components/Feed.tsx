import FilterBar from "@/components/FilterBar";
import LayoffCard from "@/components/LayoffCard";
import type { LayoffEntry } from "@/lib/types";

export default function Feed({ entries }: { entries: LayoffEntry[] }) {
  const tags = Array.from(new Set(entries.flatMap((entry) => entry.tags))).sort();

  return (
    <section aria-labelledby="feed-heading">
      <h2 id="feed-heading" className="sr-only">
        Layoff feed
      </h2>
      <FilterBar tags={tags} />
      <div>
        {entries.map((entry) => (
          <LayoffCard key={entry.id} entry={entry} />
        ))}
      </div>
    </section>
  );
}
