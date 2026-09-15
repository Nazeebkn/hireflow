import JobStatusBadge from "../jobs/JobStatusBadge";


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


function formatCreatedDate(dateValue) {
  if (!dateValue) {
    return "-";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}


function RecentJobsTable({ jobs, onEdit }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">

      {/* Desktop Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full">

          <thead className="border-b border-border bg-background">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Job Title
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Location
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Type
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Status
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Created
              </th>

              
            </tr>
          </thead>


          <tbody className="divide-y divide-border">

            {jobs.map((job) => (
              <tr
                key={job.id}
                className="transition-colors hover:bg-background/70"
              >

                {/* Job Title */}
                <td className="px-6 py-5">
                  <div>
                    <p className="text-sm font-semibold text-text">
                      {job.title}
                    </p>

                    {job.description && (
                      <p className="mt-1 max-w-xs truncate text-xs text-text-secondary">
                        {job.description}
                      </p>
                    )}
                  </div>
                </td>


                {/* Location */}
                <td className="px-6 py-5 text-sm text-text-secondary">
                  {job.location || "-"}
                </td>


                {/* Employment Type */}
                <td className="px-6 py-5 text-sm text-text-secondary">
                  {formatEmploymentType(job.employment_type)}
                </td>


                {/* Status */}
                <td className="px-6 py-5">
                  <JobStatusBadge status={job.status} />
                </td>


                {/* Created */}
                <td className="px-6 py-5 text-sm text-text-secondary">
                  {formatCreatedDate(job.created_at)}
                </td>


              

              </tr>
            ))}

          </tbody>

        </table>
      </div>


      {/* Mobile Cards */}
      <div className="divide-y divide-border md:hidden">

        {jobs.map((job) => (
          <div
            key={job.id}
            className="p-5"
          >

            <div className="flex items-start justify-between gap-4">

              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-text">
                  {job.title}
                </h3>

                <p className="mt-1 text-sm text-text-secondary">
                  {job.location || "-"}
                </p>
              </div>

              <JobStatusBadge status={job.status} />

            </div>


            <div className="mt-4 grid grid-cols-2 gap-4">

              <div>
                <p className="text-xs font-medium text-slate-400">
                  Employment Type
                </p>

                <p className="mt-1 text-sm text-text-secondary">
                  {formatEmploymentType(job.employment_type)}
                </p>
              </div>


              <div>
                <p className="text-xs font-medium text-slate-400">
                  Created
                </p>

                <p className="mt-1 text-sm text-text-secondary">
                  {formatCreatedDate(job.created_at)}
                </p>
              </div>

            </div>


            <button
              type="button"
              onClick={() => onEdit(job)}
              className="mt-5 inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
            >
              Edit Job
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}

export default RecentJobsTable;