import {
  BriefcaseBusiness,
  CalendarDays,
  MapPin,
} from "lucide-react";

function ApplicationJobHeader({
  job,
  totalApplications,
}) {
  if (!job) {
    return null;
  }

  const statusLabel = job.status
    ? job.status.replaceAll("_", " ")
    : "Unknown";

  const location =
    job.location ||
    job.job_location ||
    job.city ||
    "Location not specified";

  return (
    <div className="border-b border-border bg-surface px-4 py-4 sm:px-5 sm:py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Job Information */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BriefcaseBusiness
              size={20}
              strokeWidth={1.8}
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-lg font-bold leading-6 text-text sm:text-xl">
                {job.title || "Untitled Job"}
              </h1>

              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium capitalize text-primary">
                {statusLabel.toLowerCase()}
              </span>
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-secondary">
              <div className="flex items-center gap-1.5">
                <MapPin size={14} />
                <span>{location}</span>
              </div>

              {job.created_at && (
                <div className="flex items-center gap-1.5">
                  <CalendarDays size={14} />

                  <span>
                    Posted{" "}
                    {new Date(
                      job.created_at
                    ).toLocaleDateString("en-IN")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Application Count */}
        <div className="shrink-0 rounded-xl border border-border bg-background px-4 py-2.5 text-center">
          <p className="text-xs text-text-secondary">
            Applications
          </p>

          <p className="mt-0.5 text-xl font-bold leading-6 text-text">
            {totalApplications}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ApplicationJobHeader;