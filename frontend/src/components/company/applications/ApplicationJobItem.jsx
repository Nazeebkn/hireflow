import { BriefcaseBusiness, Users } from "lucide-react";

function ApplicationJobItem({
  job,
  isSelected,
  onSelect,
}) {
  const applicantCount =
    job.application_count ?? 0;

  const status = (
    job.status || "UNKNOWN"
  ).toUpperCase();

  const statusLabel = status.replaceAll(
    "_",
    " "
  );

  const getStatusStyles = () => {
    switch (status) {
      case "PUBLISHED":
        return {
          card:
            "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-green-50",
          icon:
            "bg-emerald-100 text-emerald-600 ring-emerald-200",
          status:
            "bg-emerald-100 text-emerald-700",
          count:
            "bg-emerald-100 text-emerald-700",
          glow:
            "bg-emerald-200/30",
        };

      case "DRAFT":
        return {
          card:
            "border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50",
          icon:
            "bg-amber-100 text-amber-600 ring-amber-200",
          status:
            "bg-amber-100 text-amber-700",
          count:
            "bg-amber-100 text-amber-700",
          glow:
            "bg-amber-200/30",
        };

      case "CLOSED":
        return {
          card:
            "border-rose-200 bg-gradient-to-br from-rose-50 via-white to-pink-50",
          icon:
            "bg-rose-100 text-rose-600 ring-rose-200",
          status:
            "bg-rose-100 text-rose-700",
          count:
            "bg-rose-100 text-rose-700",
          glow:
            "bg-rose-200/30",
        };

      default:
        return {
          card:
            "border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50",
          icon:
            "bg-blue-100 text-blue-600 ring-blue-200",
          status:
            "bg-blue-100 text-blue-700",
          count:
            "bg-blue-100 text-blue-700",
          glow:
            "bg-blue-200/30",
        };
    }
  };

  const styles = getStatusStyles();

  return (
    <button
      type="button"
      onClick={() => onSelect(job.id)}
      className={`
        group
        relative
        w-full
        overflow-hidden
        rounded-xl
        border
        p-4
        text-left
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:shadow-md
        sm:p-5
        ${styles.card}
        ${
          isSelected
            ? "ring-2 ring-primary/30"
            : ""
        }
      `}
    >
      {/* Decorative Glow */}
      <div
        className={`
          pointer-events-none
          absolute
          -right-8
          -top-8
          h-20
          w-20
          rounded-full
          blur-2xl
          transition-transform
          duration-500
          group-hover:scale-125
          ${styles.glow}
        `}
      />

      {/* Job Header */}
      <div className="relative flex items-start gap-3">

        {/* Job Icon */}
        <div
          className={`
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            ring-1
            ${styles.icon}
          `}
        >
          <BriefcaseBusiness
            size={18}
            strokeWidth={1.8}
          />
        </div>

        {/* Job Information */}
        <div className="min-w-0 flex-1">

          <h3 className="truncate text-base font-semibold leading-6 text-text">
            {job.title || "Untitled Job"}
          </h3>

          <div className="mt-1.5">
            <span
              className={`
                inline-flex
                rounded-full
                px-2.5
                py-1
                text-xs
                font-semibold
                capitalize
                ${styles.status}
              `}
            >
              {statusLabel.toLowerCase()}
            </span>
          </div>

        </div>
      </div>

      {/* Applicant Info */}
      <div className="relative mt-4 flex items-center justify-between gap-3">

        <div className="flex min-w-0 items-center gap-2 text-sm text-text-secondary">

          <Users
            size={15}
            strokeWidth={1.8}
          />

          <span className="truncate">
            {applicantCount}{" "}
            {applicantCount === 1
              ? "Applicant"
              : "Applicants"}
          </span>

        </div>

        {/* Applicant Count */}
        <span
          className={`
            flex
            h-8
            min-w-8
            shrink-0
            items-center
            justify-center
            rounded-full
            px-2.5
            text-sm
            font-bold
            ${styles.count}
          `}
        >
          {applicantCount}
        </span>

      </div>
    </button>
  );
}

export default ApplicationJobItem;