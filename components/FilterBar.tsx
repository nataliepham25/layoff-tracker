export type SortOption = "newest" | "largest";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "largest", label: "Largest cut" },
];

type FilterBarProps = {
  tags: string[];
  activeTag: string;
  onTagChange: (tag: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
};

export default function FilterBar({
  tags,
  activeTag,
  onTagChange,
  sortBy,
  onSortChange,
}: FilterBarProps) {
  const filters = ["All", ...tags];

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const isActive = filter === activeTag;
          return (
            <button
              key={filter}
              type="button"
              onClick={() => onTagChange(filter)}
              aria-pressed={isActive}
              className={
                isActive
                  ? "rounded-full bg-text-primary px-3.5 py-1.5 text-xs font-medium uppercase tracking-wide text-background"
                  : "rounded-full border border-border px-3.5 py-1.5 text-xs font-medium uppercase tracking-wide text-text-secondary transition-colors hover:border-text-primary hover:text-text-primary"
              }
            >
              {filter}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-text-secondary">
        <span>Sort</span>
        <div className="flex overflow-hidden rounded-full border border-border">
          {sortOptions.map((option) => {
            const isActive = option.value === sortBy;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onSortChange(option.value)}
                aria-pressed={isActive}
                className={
                  isActive
                    ? "bg-text-accent px-3 py-1.5 font-medium text-background"
                    : "px-3 py-1.5 text-text-secondary transition-colors hover:text-text-primary"
                }
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
