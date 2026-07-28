import Hero from "@/components/Hero";
import StatsStrip from "@/components/StatsStrip";
import Feed from "@/components/Feed";
import { getAllLayoffs } from "@/lib/getLayoffs";
import { getLayoffStats } from "@/lib/stats";

export default function Home() {
  const entries = getAllLayoffs();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Hero />
      <StatsStrip stats={getLayoffStats(entries)} />
      <Feed entries={entries} />
    </main>
  );
}
