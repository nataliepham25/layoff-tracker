"use client";

import { useState } from "react";

export default function FilterBar({ tags }: { tags: string[] }) {
  const filters = ["All", ...tags];
  const [active, setActive] = useState<string>(filters[0]);

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const isActive = filter === active;
          return (
            <button
              key={filter}
              type="button"
              onClick={() => setActive(filter)}
              className={
                isActive
                  ? "rounded bg-accent px-3 py-1 text-[13px] text-text-accent"
                  : "rounded border border-border px-3 py-1 text-[13px] text-text-secondary hover:text-text-primary"
              }
            >
              {filter}
            </button>
          );
        })}
      </div>
      <select
        className="rounded border border-border bg-background px-2 py-1 text-[13px] text-text-secondary"
        defaultValue="Newest first"
      >
        <option>Newest first</option>
        <option>Largest first</option>
      </select>
    </div>
  );
}
