import {
  BriefcaseBusiness,
  Clock3,
  CalendarDays,
  Eye,
} from "lucide-react";

import JobStatusBadge from "./JobStatusBadge";

function formatDeadline(deadline) {
  if (!deadline) {
    return {
      label: "No deadline",
      isPast: false,
    };
  }

  const deadlineDate = new Date(deadline);

  if (Number.isNaN(deadlineDate.getTime())) {
    return {
      label: "No deadline",
      isPast: false,
    };
  }

  const label = deadlineDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const isPast = deadlineDate.getTime() < Date.now();

  return {
    label,
    isPast,
  };
}

function formatEmploymentType(type) {
  const labels = {
    FULL_TIME: "Full Time",
    PART_TIME: "Part Time",
    CONTRACT: "Contract",
    INTERNSHIP: "Internship",
    FREELANCE: "Freelance",
  };

  return labels[type] || type || "-";
}

function JobTable({ jobs, onView }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-base font-semibold text-text">
            Job Postings
          </h2>

          <p className="mt-0.5 text-sm text-text-secondary">
            Manage your company's job postings
          </p>
        </div>

        <div className="hidden items-center gap-2 rounded-full bg-background px-3 py-1.5 sm:flex">
          <BriefcaseBusiness
            size={14}
            className="text-text-secondary"
          />

          <span className="text-xs font-medium text-text-secondary">
            {jobs.length} {jobs.length === 1 ? "job" : "jobs"}
          </span>
        </div>
      </div>

      {/* Desktop / Tablet Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full">

          <thead>
            <tr className="border-b border-border bg-background/70">

              {/* Job */}
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Job
              </th>

              {/* Type */}
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Type
              </th>

              {/* Deadline */}
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Deadline
              </th>

              {/* Status */}
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Status
              </th>

              {/* View */}
              <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-text-secondary">
                View
              </th>

            </tr>
          </thead>

          <tbody className="divide-y divide-border">

            {jobs.map((job) => {
              const deadline = formatDeadline(
                job.application_deadline
              );

              return (
                <tr
                  key={job.id}
                  className="group transition-colors hover:bg-background/60"
                >

                  {/* Job */}
                  <td className="px-5 py-4">
                    <div className="flex min-w-[220px] items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <BriefcaseBusiness size={18} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-text">
                          {job.title}
                        </p>

                        <p className="mt-0.5 text-xs text-text-secondary">
                          Job #{job.id}
                        </p>
                      </div>

                    </div>
                  </td>

                  {/* Type */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-text-secondary">

                      <Clock3
                        size={15}
                        className="shrink-0"
                      />

                      <span className="whitespace-nowrap">
                        {formatEmploymentType(
                          job.employment_type
                        )}
                      </span>

                    </div>
                  </td>

                  {/* Deadline */}
                  <td className="px-5 py-4">
                    <div
                      className={`flex items-center gap-2 text-sm ${
                        deadline.isPast
                          ? "font-medium text-rose-600"
                          : "text-text-secondary"
                      }`}
                    >
                      <CalendarDays size={15} />

                      <span className="whitespace-nowrap">
                        {deadline.label}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <JobStatusBadge
                      status={job.status}
                    />
                  </td>

                  {/* View */}
                  <td className="px-5 py-4">
                    <div className="flex justify-end">

                      <button
                        type="button"
                        onClick={() => onView(job)}
                        title="View job details"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-hover"
                      >
                        <Eye size={15} />
                        View
                      </button>

                    </div>
                  </td>

                </tr>
              );
            })}

          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="divide-y divide-border md:hidden">

        {jobs.map((job) => {
          const deadline = formatDeadline(
            job.application_deadline
          );

          return (
            <div
              key={job.id}
              className="p-4 transition-colors hover:bg-background/50"
            >

              {/* Job Header */}
              <div className="flex items-start justify-between gap-3">

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <BriefcaseBusiness size={18} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-text">
                      {job.title}
                    </h3>

                    <p className="mt-0.5 text-xs text-text-secondary">
                      Job #{job.id}
                    </p>
                  </div>

                </div>

                <JobStatusBadge
                  status={job.status}
                />

              </div>

              {/* Details */}
              <div className="mt-4 rounded-xl bg-background p-3">

                <div className="grid grid-cols-2 gap-4">

                  {/* Type */}
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                      <Clock3 size={13} />
                      Type
                    </div>

                    <p className="mt-1 text-sm font-medium text-text">
                      {formatEmploymentType(
                        job.employment_type
                      )}
                    </p>
                  </div>

                  {/* Deadline */}
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                      <CalendarDays size={13} />
                      Deadline
                    </div>

                    <p
                      className={`mt-1 text-sm font-medium ${
                        deadline.isPast
                          ? "text-rose-600"
                          : "text-text"
                      }`}
                    >
                      {deadline.label}
                    </p>
                  </div>

                </div>

              </div>

              {/* View Button */}
              <button
                type="button"
                onClick={() => onView(job)}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                <Eye size={15} />
                View Job
              </button>

            </div>
          );
        })}

      </div>

    </div>
  );
}

export default JobTable;