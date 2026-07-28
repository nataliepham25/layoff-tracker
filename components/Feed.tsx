import FilterBar from "@/components/FilterBar";
import LayoffCard from "@/components/LayoffCard";
import { sampleLayoffs } from "@/lib/layoffs";

export default function Feed() {
  return (
    <section aria-labelledby="feed-heading">
      <h2 id="feed-heading" className="sr-only">
        Layoff feed
      </h2>
      <FilterBar />
      <div>
        {sampleLayoffs.map((layoff) => (
          <LayoffCard key={layoff.id} layoff={layoff} />
        ))}
      </div>
    </section>
  );
}
