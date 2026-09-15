import {
  Bell,
  Search,
  SlidersHorizontal,
} from "lucide-react";

function CandidateJobSearchHeader({
  search,
  setSearch,
  onFilterClick,
  sort,
  setSort,
  jobsCount,
}) {
  return (
    <div className="space-y-3 border-b border-border pb-3">

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search jobs, companies, or skills..."
            className="h-10 w-full rounded-lg border border-border bg-surface pl-10 pr-3 text-sm text-text outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/10"
          />
        </div>

        <button
          type="button"
          onClick={onFilterClick}
          className="flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-sm font-semibold text-text transition hover:border-primary hover:text-primary"
        >
          <SlidersHorizontal size={16} />
          <span>Filters</span>
        </button>
      </div>

      {/* Quick Actions */}
      {/* <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text transition hover:border-primary hover:text-primary"
        >
          <Search size={13} />
          Saved Jobs
        </button>

        <button
          type="button"
          className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text transition hover:border-primary hover:text-primary"
        >
          <Bell size={13} />
          Job Alerts
        </button>
      </div> */}

      {/* Result Count + Sort */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold tracking-wide text-text">
            {jobsCount} {jobsCount === 1 ? "Job" : "Jobs"} Found
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="text-xs text-text-secondary">
            Sort:
          </span>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="max-w-[130px] border-0 bg-transparent text-xs font-semibold text-text outline-none"
          >
            <option value="newest">Newest</option>
            <option value="highest_salary">
              Highest Salary
            </option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

    </div>
  );
}

export default CandidateJobSearchHeader;