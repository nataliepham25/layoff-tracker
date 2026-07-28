import Hero from "@/components/Hero";
import StatsStrip from "@/components/StatsStrip";
import Feed from "@/components/Feed";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Hero />
      <StatsStrip />
      <Feed />
    </main>
  );
}
