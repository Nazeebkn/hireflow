import { useEffect, useState } from "react";

import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  MapPin,
  Wallet,
} from "lucide-react";

import { getCandidateApplications } from "../../../services/candidate/candidateJobApplicationService";

function CandidateJobCard({
  job,
  selected = false,
  onSelect,
}) {
  const [applied, setApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(true);
  console.log("JOB DATA:", job);
  console.log("COMPANY LOGO:", job?.company_logo);
  const formatEmploymentType = (type) => {
    if (!type) return "Not specified";

    return type
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatSalary = () => {
    if (!job.minimum_salary && !job.maximum_salary) {
      return "Salary not specified";
    }

    const minimum = job.minimum_salary
      ? `₹${Number(job.minimum_salary).toLocaleString("en-IN")}`
      : "Any";

    const maximum = job.maximum_salary
      ? `₹${Number(job.maximum_salary).toLocaleString("en-IN")}`
      : "Any";

    return `${minimum} - ${maximum}`;
  };

  /*
   * Convert company logo path into a usable URL.
   */
  const getCompanyLogoUrl = (logo) => {
    if (!logo) return null;

    if (
      logo.startsWith("http://") ||
      logo.startsWith("https://")
    ) {
      return logo;
    }

    return `http://127.0.0.1:8000${logo}`;
  };

  /*
   * Check whether the candidate has already
   * applied for this particular job.
   */
  useEffect(() => {
    if (!job?.id) {
      setApplied(false);
      setCheckingApplication(false);
      return;
    }

    const checkApplicationStatus = async () => {
      try {
        setCheckingApplication(true);

        const data = await getCandidateApplications();

        const applications = Array.isArray(data)
          ? data
          : data?.results || [];

        const alreadyApplied = applications.some(
          (application) =>
            Number(application.job) === Number(job.id)
        );

        setApplied(alreadyApplied);
      } catch (error) {
        console.error(
          "Failed to check application status:",
          error?.response?.data || error
        );

        /*
         * If the status check fails,
         * don't show Applied incorrectly.
         */
        setApplied(false);
      } finally {
        setCheckingApplication(false);
      }
    };

    checkApplicationStatus();
  }, [job?.id]);

  return (
    <button
      type="button"
      onClick={() => onSelect(job)}
      className={`group relative w-full rounded-xl p-5 text-left transition-all duration-200 ${
        selected
          ? "border-2 border-primary bg-primary/5 shadow-sm"
          : "border border-border bg-surface hover:border-primary/30 hover:shadow-md"
      }`}
    >
      {/* Job Header */}
      <div className="flex gap-4 pr-10">

        {/* Company Logo */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-background p-1.5">
          {job.company_logo ? (
            <img
              src={getCompanyLogoUrl(job.company_logo)}
              alt={`${job.company_name || "Company"} logo`}
              className="h-full w-full rounded-md object-contain"
              onError={(event) => {
                event.currentTarget.style.display = "none";

                const fallback =
                  event.currentTarget.nextElementSibling;

                if (fallback) {
                  fallback.style.display = "flex";
                }
              }}
            />
          ) : null}

          {/* Default Icon */}
          <div
            className={`h-full w-full items-center justify-center ${
              job.company_logo ? "hidden" : "flex"
            }`}
          >
            <BriefcaseBusiness
              size={23}
              className="text-primary"
            />
          </div>
        </div>

        {/* Job Info */}
        <div className="min-w-0 flex-1">

          <h3 className="truncate text-base font-semibold leading-6 text-text">
            {job.title}
          </h3>

          <p className="mt-1 truncate text-sm font-medium text-primary">
            {job.company_name || "Company"}
          </p>

        </div>
      </div>

      {/* Application Status */}
      <div className="absolute right-4 top-4">

        {checkingApplication ? (
          <div className="h-5 w-5 animate-pulse rounded-full bg-primary/10" />
        ) : applied ? (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            <CheckCircle2 size={14} />
            <span>Applied</span>
          </div>
        ) : (
          <div
            title="Apply available"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary"
          >
            <BriefcaseBusiness size={16} />
          </div>
        )}

      </div>

      {/* Job Details */}
      <div className="mt-4 flex flex-wrap gap-2">

        {/* Location */}
        {job.location && (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-text-secondary">
            <MapPin size={14} />
            {job.location}
          </span>
        )}

        {/* Work Mode */}
        {job.work_mode && (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-text-secondary">
            <BriefcaseBusiness size={14} />

            {job.work_mode === "ONSITE"
              ? "On-site"
              : job.work_mode === "REMOTE"
              ? "Remote"
              : "Hybrid"}
          </span>
        )}

        {/* Salary */}
        {(job.minimum_salary || job.maximum_salary) && (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-text-secondary">
            <Wallet size={14} />
            {formatSalary()}
          </span>
        )}

      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-4">

        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <Clock3 size={14} />

          {job.published_at
            ? new Date(job.published_at).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }
              )
            : "Recently published"}
        </div>

        <span
          className={`text-xs font-bold transition-colors ${
            selected
              ? "text-primary"
              : "text-text-secondary group-hover:text-primary"
          }`}
        >
          Details →
        </span>

      </div>

      {/* Employment Type */}
      <div className="mt-3">
        <span className="inline-flex rounded-full bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
          {formatEmploymentType(job.employment_type)}
        </span>
      </div>

    </button>
  );
}

export default CandidateJobCard;