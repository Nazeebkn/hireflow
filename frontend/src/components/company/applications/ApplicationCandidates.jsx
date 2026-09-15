import { Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import ApplicationCandidateRow from "./ApplicationCandidateRow";

function ApplicationCandidates({
  applications = [],
  loading = false,
  error = "",
  jobId,
}) {
  const navigate = useNavigate();

  // Main page-il maximum 5 candidates mathram show cheyyum
  const previewApplications = applications.slice(0, 5);

  const handleViewAll = () => {
    navigate(`/company/jobs/${jobId}/candidates`);
  };

  return (
    <section>
      {/* Candidates Header */}
      <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users size={19} strokeWidth={1.8} />
          </div>

          <div className="min-w-0">
            <h2 className="text-base font-semibold text-text sm:text-lg">
              Candidates
            </h2>

            <p className="mt-0.5 text-sm text-text-secondary">
              Review candidates who applied for this job.
            </p>
          </div>
        </div>

        {!loading && !error && (
          <span className="shrink-0 rounded-full bg-background px-3 py-1 text-sm font-semibold text-text">
            {applications.length}
          </span>
        )}
      </div>

      {/* Candidates Content */}
      <div className="p-4 sm:p-5 lg:p-6">
        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-20 animate-pulse rounded-xl bg-background"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex min-h-[180px] items-center justify-center rounded-xl border border-error/20 bg-error/5 p-5 text-center">
            <div>
              <p className="text-sm font-semibold text-error sm:text-base">
                Unable to load applications
              </p>

              <p className="mt-1 text-sm text-error/80">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          applications.length === 0 && (
            <div className="flex min-h-[220px] items-center justify-center px-5 py-10 text-center">
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Users size={22} strokeWidth={1.8} />
                </div>

                <h3 className="mt-4 text-base font-semibold text-text">
                  No applications yet
                </h3>

                <p className="mx-auto mt-1.5 max-w-sm text-sm leading-5 text-text-secondary">
                  Candidates who apply for this job will
                  appear here.
                </p>
              </div>
            </div>
          )}

        {/* Candidate Preview */}
        {!loading &&
          !error &&
          applications.length > 0 && (
            <>
              <div className="space-y-3">
                {previewApplications.map((application) => (
                  <ApplicationCandidateRow
                    key={application.id}
                    application={application}
                  />
                ))}
              </div>

              {/* View All */}
              {applications.length > 1 && (
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={handleViewAll}
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-semibold text-text transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
                  >
                    View All Candidates
                    <ArrowRight
                      size={16}
                      strokeWidth={1.8}
                    />
                  </button>
                </div>
              )}
            </>
          )}
      </div>
    </section>
  );
}

export default ApplicationCandidates;