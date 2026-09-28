import { Filter } from "lucide-react";

function ApplicationFilters({
  value = "ALL",
  onChange,
  options = [],
}) {
  const defaultOptions = [
    { value: "ALL", label: "All Status" },
    { value: "APPLIED", label: "Applied" },
    {
      value: "RESUME_SCREENING",
      label: "Resume Screening",
    },
    {
      value: "SHORTLISTED",
      label: "Shortlisted",
    },
    {
      value: "AI_INTERVIEW",
      label: "AI Interview",
    },
    {
      value: "FINAL_INTERVIEW",
      label: "Final Interview",
    },
    { value: "HIRED", label: "Hired" },
    { value: "REJECTED", label: "Rejected" },
  ];

  const filterOptions =
    options.length > 0
      ? options
      : defaultOptions;

  return (
    <div className="flex w-full items-center gap-3">
      {/* Filter Icon */}

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-12 sm:w-12">
        <Filter
          size={19}
          strokeWidth={1.8}
        />
      </div>

      {/* Select */}

      <div className="min-w-0 flex-1">
        <label
          htmlFor="application-status-filter"
          className="sr-only"
        >
          Filter applications
        </label>

        <select
          id="application-status-filter"
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="
            h-11
            w-full
            cursor-pointer
            rounded-xl
            border
            border-border
            bg-background
            px-3
            text-sm
            font-medium
            text-text
            outline-none
            transition-all
            focus:border-primary
            focus:ring-2
            focus:ring-primary/10
            sm:h-12
            sm:px-4
            sm:text-base
          "
        >
          {filterOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default ApplicationFilters;