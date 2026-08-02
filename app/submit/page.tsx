import type { Metadata } from "next";
import SubmitTipForm from "@/components/SubmitTipForm";

export const metadata: Metadata = {
  title: "Submit a Tip | Layoff Tracker",
};

export default function SubmitPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="mb-1.5 font-serif text-[28px] font-medium">Submit a tip</h1>
        <p className="text-sm text-text-secondary">
          Know about layoffs we haven&apos;t covered? Let us know — tips are
          anonymous and reviewed before anything is published.
        </p>
      </div>
      <SubmitTipForm />
    </main>
  );
}
