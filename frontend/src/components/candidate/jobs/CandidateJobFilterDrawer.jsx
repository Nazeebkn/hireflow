import { X } from "lucide-react";

function CandidateJobFilterDrawer({
  isOpen,
  onClose,
  filters,
  setFilters,
  onApply,
  onClear,
}) {
  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50">

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 flex h-full w-[92%] max-w-sm flex-col bg-surface shadow-xl sm:w-full">

        {/* Header */}
        <div className="shrink-0 border-b border-border px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <h2 className="text-base font-bold text-text sm:text-lg">
                Filters
              </h2>

              <p className="mt-1 text-xs text-text-secondary sm:text-sm">
                Refine your job search
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-secondary transition hover:bg-background hover:text-text"
            >
              <X size={19} />
            </button>
          </div>
        </div>

        {/* Filter Fields */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">

          <div className="space-y-5">

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="mb-2 block text-sm font-semibold text-text"
              >
                Location
              </label>

              <input
                id="location"
                name="location"
                type="text"
                value={filters.location}
                onChange={handleChange}
                placeholder="e.g. Kochi"
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-text outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/10"
              />
            </div>

            {/* Work Mode */}
            <div>
              <label
                htmlFor="work_mode"
                className="mb-2 block text-sm font-semibold text-text"
              >
                Work Mode
              </label>

              <select
                id="work_mode"
                name="work_mode"
                value={filters.work_mode}
                onChange={handleChange}
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-text outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/10"
              >
                <option value="">All Work Modes</option>
                <option value="ONSITE">On-site</option>
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>

            {/* Employment Type */}
            <div>
              <label
                htmlFor="employment_type"
                className="mb-2 block text-sm font-semibold text-text"
              >
                Employment Type
              </label>

              <select
                id="employment_type"
                name="employment_type"
                value={filters.employment_type}
                onChange={handleChange}
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-text outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/10"
              >
                <option value="">All Employment Types</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="FREELANCE">Freelance</option>
              </select>
            </div>

            {/* Salary */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-text">
                Salary Range
              </label>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  name="min_salary"
                  type="number"
                  value={filters.min_salary}
                  onChange={handleChange}
                  placeholder="Min salary"
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-text outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/10"
                />

                <input
                  name="max_salary"
                  type="number"
                  value={filters.max_salary}
                  onChange={handleChange}
                  placeholder="Max salary"
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-text outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/10"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Actions */}
        <div className="shrink-0 border-t border-border bg-surface px-4 py-4 sm:px-6">
          <div className="grid grid-cols-2 gap-3">

            <button
              type="button"
              onClick={onClear}
              className="min-h-11 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-text transition hover:bg-background"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={onApply}
              className="min-h-11 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Apply Filters
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

export default CandidateJobFilterDrawer;