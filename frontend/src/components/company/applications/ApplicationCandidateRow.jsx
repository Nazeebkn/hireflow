import { Eye, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ApplicationCandidateRow({ application }) {
  const navigate = useNavigate();

  if (!application) {
    return null;
  }

  const candidateName =
    application.candidate_name || "Candidate";

  const initials =
    application.candidate_initials ||
    candidateName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const status = application.status || "APPLIED";

  const statusLabel = status.replaceAll("_", " ");

  const appliedDate = application.applied_at
    ? new Date(
        application.applied_at
      ).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Date not available";

  const getStatusClasses = () => {
    switch (status) {
      case "APPLIED":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400";

      case "RESUME_SCREENING":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";

      case "SHORTLISTED":
        return "bg-green-500/10 text-green-600 dark:text-green-400";

      case "AI_INTERVIEW":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400";

      case "SELECTED":
        return "bg-green-500/10 text-green-600 dark:text-green-400";

      case "FINAL_INTERVIEW":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400";

      case "HIRED":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";

      case "REJECTED":
        return "bg-red-500/10 text-red-600 dark:text-red-400";

      default:
        return "bg-background text-text-secondary";
    }
  };

  const handleView = () => {
    navigate(
      `/company/applications/${application.id}`
    );
  };

  return (
    <div
      className="
        rounded-xl
        border
        border-border
        bg-surface
        px-4
        py-3
        transition-shadow
        duration-200
        hover:shadow-sm
      "
    >
      <div className="flex items-center justify-between gap-4">

        {/* Candidate Information */}

        <div className="flex min-w-0 items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {initials}
          </div>

          <div className="min-w-0">

            <h3 className="truncate text-base font-semibold text-text">
              {candidateName}
            </h3>

            <div className="mt-1 flex items-center gap-1.5 text-sm text-text-secondary">

              <CalendarDays
                size={13}
                strokeWidth={1.8}
              />

              <span>
                Applied {appliedDate}
              </span>

            </div>

          </div>

        </div>

        {/* Status + Action */}

        <div className="flex shrink-0 items-center gap-2">

          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getStatusClasses()}`}
          >
            {statusLabel.toLowerCase()}
          </span>

          <button
            type="button"
            onClick={handleView}
            title="View candidate application"
            className="
              inline-flex
              h-9
              items-center
              gap-1.5
              rounded-lg
              border
              border-border
              bg-background
              px-3
              text-sm
              font-medium
              text-text-secondary
              transition
              hover:border-primary
              hover:text-primary
              hover:bg-primary/5
            "
          >

            <Eye
              size={15}
              strokeWidth={1.8}
            />

            <span>View</span>

          </button>

        </div>

      </div>
    </div>
  );
}

export default ApplicationCandidateRow;