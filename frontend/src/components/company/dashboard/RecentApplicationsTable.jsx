import {
  Users,
  CalendarDays,
  BriefcaseBusiness,
} from "lucide-react";


function formatApplicationStatus(status) {
  const labels = {
    APPLIED: "Applied",
    RESUME_SCREENING: "Resume Screening",
    AI_INTERVIEW: "AI Interview",
    CLASSIFIED: "Classified",
    SELECTED: "Selected",
    FINAL_INTERVIEW: "Final Interview",
    HIRED: "Hired",
    REJECTED: "Rejected",
  };

  return labels[status] || status || "-";
}


function getStatusClasses(status) {
  const classes = {
    APPLIED: "bg-blue-50 text-blue-700",
    RESUME_SCREENING: "bg-amber-50 text-amber-700",
    AI_INTERVIEW: "bg-violet-50 text-violet-700",
    CLASSIFIED: "bg-cyan-50 text-cyan-700",
    SELECTED: "bg-emerald-50 text-emerald-700",
    FINAL_INTERVIEW: "bg-indigo-50 text-indigo-700",
    HIRED: "bg-green-50 text-green-700",
    REJECTED: "bg-rose-50 text-rose-700",
  };

  return (
    classes[status] ||
    "bg-slate-50 text-slate-700"
  );
}


function formatAppliedDate(dateValue) {
  if (!dateValue) {
    return "-";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}


function RecentApplicationsTable({
  applications = [],
  loading = false,
}) {
  return (
    <div className="overflow-hidden">

      {/* Loading State */}
      {loading ? (

        <div className="space-y-2 p-4">

          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-12 animate-pulse rounded-lg bg-background"
            />
          ))}

        </div>

      ) : applications.length === 0 ? (

        /* Empty State */
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users
              size={23}
              strokeWidth={1.7}
            />
          </div>

          <h3 className="mt-4 text-base font-semibold text-text">
            No applications yet
          </h3>

          <p className="mx-auto mt-1.5 max-w-sm text-sm leading-5 text-text-secondary">
            Applications from candidates will appear here when they
            apply to your published jobs.
          </p>

        </div>

      ) : (

        /* Applications Table */
        <div className="overflow-x-auto">

          <table className="w-full table-fixed">

            <thead className="border-b border-border bg-background">

              <tr>

                <th className="w-[32%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Candidate
                </th>

                <th className="w-[30%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Job
                </th>

                <th className="w-[20%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Status
                </th>

                <th className="w-[18%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Applied
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-border">

              {applications.slice(0, 5).map((application) => (

                <tr
                  key={application.id}
                  className="transition-colors hover:bg-background/60"
                >

                  {/* Candidate */}
                  <td className="px-4 py-3">

                    <div className="flex items-center gap-2.5">

                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Users size={15} />
                      </div>

                      <div className="min-w-0">

                        <p className="truncate text-sm font-semibold text-text">
                          {application.candidate_name || "Candidate"}
                        </p>

                        <p className="mt-0.5 text-xs text-text-secondary">
                          Application #{application.id}
                        </p>

                      </div>

                    </div>

                  </td>


                  {/* Job */}
                  <td className="px-4 py-3">

                    <div className="flex min-w-0 items-center gap-2">

                      <BriefcaseBusiness
                        size={14}
                        className="shrink-0 text-primary"
                      />

                      <p className="truncate text-sm text-text">
                        {application.job_title || "-"}
                      </p>

                    </div>

                  </td>


                  {/* Status */}
                  <td className="px-4 py-3">

                    <span
                      className={`inline-flex max-w-full items-center truncate rounded-full px-2 py-1 text-xs font-semibold ${getStatusClasses(
                        application.status
                      )}`}
                    >
                      {formatApplicationStatus(
                        application.status
                      )}
                    </span>

                  </td>


                  {/* Applied */}
                  <td className="whitespace-nowrap px-4 py-3">

                    <div className="flex items-center gap-1.5 text-xs text-text-secondary">

                      <CalendarDays size={13} />

                      {formatAppliedDate(
                        application.applied_at
                      )}

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}

export default RecentApplicationsTable;