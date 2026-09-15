import { useMemo } from "react";
import { BriefcaseBusiness } from "lucide-react";

import ApplicationJobItem from "./ApplicationJobItem";
import ApplicationSearch from "./ApplicationSearch";
import ApplicationFilters from "./ApplicationFilters";

function ApplicationJobList({
  jobs = [],
  selectedJobId,
  onSelectJob,
  loading = false,
  error = "",
  search = "",
  onSearchChange,
  statusFilter = "ALL",
  onStatusFilterChange,
}) {
  /*
   * Job status options
   */
  const jobStatusOptions = [
    { value: "ALL", label: "All Status" },
    { value: "DRAFT", label: "Draft" },
    { value: "PUBLISHED", label: "Published" },
    { value: "CLOSED", label: "Closed" },
  ];

  /*
   * Filter jobs based on search and status
   */
  const filteredJobs = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return jobs.filter((job) => {
      const jobTitle = (
        job.title || ""
      ).toLowerCase();

      const matchesSearch =
        !searchValue ||
        jobTitle.includes(searchValue);

      const matchesStatus =
        statusFilter === "ALL" ||
        job.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [jobs, search, statusFilter]);

  return (
    <aside
      className="
        flex
        h-full
        min-h-0
        flex-col
      "
    >
      {/* Header */}
      <div className="shrink-0 border-b border-border bg-surface px-5 py-5 sm:px-6">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BriefcaseBusiness
              size={19}
              strokeWidth={1.8}
            />
          </div>

          <div className="min-w-0">
            <h2 className="text-base font-semibold text-text sm:text-lg">
              Jobs
            </h2>

            <p className="mt-0.5 text-sm text-text-secondary">
              Select a job to view applications
            </p>
          </div>

        </div>

        {/* Search */}
        <div className="mt-5">
          <ApplicationSearch
            value={search}
            onChange={onSearchChange}
            placeholder="Search jobs..."
          />
        </div>

        {/* Status Filter */}
        <div className="mt-3">
          <ApplicationFilters
            value={statusFilter}
            onChange={onStatusFilterChange}
            options={jobStatusOptions}
          />
        </div>

        {/* Job Count */}
        {!loading && !error && (
          <div className="mt-4 flex items-center justify-between">

            <p className="text-sm text-text-secondary">
              Showing{" "}
              <span className="font-semibold text-text">
                {filteredJobs.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-text">
                {jobs.length}
              </span>{" "}
              jobs
            </p>

            {(search || statusFilter !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  onSearchChange("");
                  onStatusFilterChange("ALL");
                }}
                className="text-sm font-semibold text-primary hover:underline"
              >
                Clear
              </button>
            )}

          </div>
        )}

      </div>

      {/* Scrollable Job List */}
      <div
        className="
          min-h-0
          flex-1
          overflow-y-auto
          overscroll-contain
          p-3
          sm:p-4
        "
      >

        {/* Loading */}
        {loading && (
          <div className="space-y-3">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-xl bg-background"
              />
            ))}

          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl border border-error/20 bg-error/5 p-4 sm:p-5">

            <p className="text-sm font-medium text-error">
              {error}
            </p>

          </div>
        )}

        {/* No matching jobs */}
        {!loading &&
          !error &&
          filteredJobs.length === 0 && (
            <div className="flex flex-col items-center px-5 py-12 text-center">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BriefcaseBusiness
                  size={22}
                  strokeWidth={1.8}
                />
              </div>

              <h3 className="mt-4 text-base font-semibold text-text">
                No jobs found
              </h3>

              <p className="mt-1.5 max-w-xs text-sm leading-5 text-text-secondary">
                Try changing your search or status filter.
              </p>

            </div>
          )}

        {/* Jobs */}
        {!loading &&
          !error &&
          filteredJobs.length > 0 && (
            <div className="space-y-3">

              {filteredJobs.map((job) => (
                <ApplicationJobItem
                  key={job.id}
                  job={job}
                  isSelected={
                    job.id === selectedJobId
                  }
                  onSelect={onSelectJob}
                />
              ))}

            </div>
          )}

      </div>
    </aside>
  );
}

export default ApplicationJobList;