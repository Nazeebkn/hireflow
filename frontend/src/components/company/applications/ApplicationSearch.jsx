import { Search, X } from "lucide-react";

function ApplicationSearch({
  value = "",
  onChange,
  placeholder = "Search candidates...",
}) {
  const handleClear = () => {
    onChange("");
  };

  return (
    <div className="relative w-full">
      <Search
        size={19}
        strokeWidth={1.8}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
      />

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-border bg-background pl-11 pr-11 text-sm text-text outline-none transition-all placeholder:text-text-secondary focus:border-primary focus:ring-2 focus:ring-primary/10 sm:h-12 sm:text-base"
      />

      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface hover:text-text"
        >
          <X size={17} strokeWidth={1.8} />
        </button>
      )}
    </div>
  );
}

export default ApplicationSearch;