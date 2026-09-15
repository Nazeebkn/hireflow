import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  MapPin,
} from "lucide-react";

function CandidateApplicationCard({
  application,
}) {
  const status = String(
    application?.status || "UNKNOWN"
  ).toUpperCase();

  const title =
    application?.job_title ||
    application?.job?.title ||
    application?.title ||
    "Job title unavailable";

  const company =
    application?.company_name ||
    application?.job?.company_name ||
    application?.company?.company_name ||
    "Company unavailable";

  const location =
    application?.location ||
    application?.job?.location ||
    "Location not available";

  const appliedAt =
    application?.applied_at ||
    application?.created_at;

  const styles = getStatusStyles(status);

  return (
    <tr className="border-t border-border transition hover:bg-slate-50/70">

      {/* JOB */}

      <td className="px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">

          <div
            className={`
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              ${styles.icon}
            `}
          >
            <BriefcaseBusiness
              size={17}
              strokeWidth={1.8}
            />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-text">
              {title}
            </p>
          </div>

        </div>
      </td>


      {/* COMPANY */}

      <td className="px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-2 text-sm text-text-secondary">

          <Building2
            size={15}
            className="shrink-0"
          />

          <span className="truncate">
            {company}
          </span>

        </div>
      </td>


      {/* LOCATION */}

      <td className="px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-2 text-sm text-text-secondary">

          <MapPin
            size={15}
            className="shrink-0"
          />

          <span className="truncate">
            {location}
          </span>

        </div>
      </td>


      {/* APPLIED DATE */}

      <td className="whitespace-nowrap px-4 py-4 sm:px-5">

        {appliedAt ? (
          <div className="flex items-center gap-2 text-sm text-text-secondary">

            <CalendarDays
              size={15}
              className="shrink-0"
            />

            <span>
              {formatDate(appliedAt)}
            </span>

          </div>
        ) : (
          <span className="text-sm text-text-secondary">
            Date unavailable
          </span>
        )}

      </td>


      {/* STATUS */}

      <td className="px-4 py-4 sm:px-5">

        <span
          className={`
            inline-flex
            whitespace-nowrap
            rounded-full
            px-2.5
            py-1
            text-[10px]
            font-bold
            uppercase
            tracking-wide
            ${styles.badge}
          `}
        >
          {formatStatus(status)}
        </span>

      </td>

    </tr>
  );
}


/* =========================================================
   STATUS STYLES
========================================================= */

function getStatusStyles(status) {
  switch (status) {
    case "APPLIED":
      return {
        icon: "bg-blue-100 text-blue-600",
        badge: "bg-blue-100 text-blue-700",
      };

    case "RESUME_SCREENING":
      return {
        icon: "bg-violet-100 text-violet-600",
        badge: "bg-violet-100 text-violet-700",
      };

    case "AI_INTERVIEW":
      return {
        icon: "bg-indigo-100 text-indigo-600",
        badge: "bg-indigo-100 text-indigo-700",
      };

    case "CLASSIFIED":
      return {
        icon: "bg-cyan-100 text-cyan-600",
        badge: "bg-cyan-100 text-cyan-700",
      };

    case "SELECTED":
      return {
        icon: "bg-emerald-100 text-emerald-600",
        badge: "bg-emerald-100 text-emerald-700",
      };

    case "FINAL_INTERVIEW":
      return {
        icon: "bg-amber-100 text-amber-600",
        badge: "bg-amber-100 text-amber-700",
      };

    case "HIRED":
      return {
        icon: "bg-green-100 text-green-600",
        badge: "bg-green-100 text-green-700",
      };

    case "REJECTED":
      return {
        icon: "bg-rose-100 text-rose-600",
        badge: "bg-rose-100 text-rose-700",
      };

    default:
      return {
        icon: "bg-slate-100 text-slate-600",
        badge: "bg-slate-100 text-slate-600",
      };
  }
}


/* =========================================================
   FORMAT STATUS
========================================================= */

function formatStatus(status) {
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

export default CandidateApplicationCard;