import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  X,
} from "lucide-react";

import {
  applyForJob,
  getCandidateApplications,
} from "../../../services/candidate/candidateJobApplicationService";
function CandidateJobPreview({ job }) {
  const navigate = useNavigate();

  const [applied, setApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(false);

  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState("");

  const [showApplyConfirm, setShowApplyConfirm] = useState(false);
  const [showApplySuccess, setShowApplySuccess] = useState(false);

  /*
   * Check whether the candidate has already
   * applied for the selected job.
   */
  useEffect(() => {
    if (!job?.id) {
      setApplied(false);
      return;
    }

    const checkApplication = async () => {
      try {
        setCheckingApplication(true);
        setApplyError("");

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
      } finally {
        setCheckingApplication(false);
      }
    };

    checkApplication();
  }, [job?.id]);

  /*
   * Open confirmation modal.
   */
  const handleApply = () => {
    if (applying || applied || checkingApplication) {
      return;
    }

    setApplyError("");
    setShowApplyConfirm(true);
  };

  /*
   * Confirm and submit application.
   */
  const handleConfirmApply = async () => {
    if (applying || applied) {
      return;
    }

    try {
      setApplying(true);
      setApplyError("");

      await applyForJob(job.id);

      setApplied(true);
      setShowApplyConfirm(false);
      setShowApplySuccess(true);
    } catch (error) {
      console.error(
        "Apply Error:",
        error?.response?.data || error
      );

      const responseData = error?.response?.data;

      const message =
        responseData?.detail ||
        responseData?.message ||
        responseData?.non_field_errors?.[0] ||
        (Array.isArray(responseData)
          ? responseData[0]
          : null) ||
        "Failed to submit your application.";

      setApplyError(message);
    } finally {
      setApplying(false);
    }
  };

  /*
   * Cancel confirmation modal.
   */
  const handleCancelApply = () => {
    if (applying) {
      return;
    }

    setShowApplyConfirm(false);
    setApplyError("");
  };

  if (!job) {
    return (
      <div className="flex h-full min-h-[350px] items-center justify-center rounded-xl border border-border bg-surface p-6 text-center sm:min-h-[500px] sm:p-8">
        <div>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-background sm:h-14 sm:w-14">
            <BriefcaseBusiness
              size={22}
              className="text-text-secondary sm:h-6 sm:w-6"
            />
          </div>

          <h3 className="mt-4 text-sm font-bold text-text sm:text-base">
            Select a job
          </h3>

          <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-text-secondary sm:text-sm">
            Select a job from the list to view its details.
          </p>
        </div>
      </div>
    );
  }

  const formatEmploymentType = (type) => {
    if (!type) return "Not specified";

    return type
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatWorkMode = (mode) => {
    if (mode === "REMOTE") return "Remote";
    if (mode === "HYBRID") return "Hybrid";
    if (mode === "ONSITE") return "On-site";

    return "Not specified";
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

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const skills = job.skills
    ? job.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
    : [];

  return (
    <>
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface">

        {/* Header */}
        <div className="shrink-0 border-b border-border p-4 sm:p-5 lg:p-6">

          {/* Job Header */}
          <div className="flex gap-3 sm:gap-4">

            {/* Company Logo */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-background p-2 sm:h-14 sm:w-14">
              {job.company_logo ? (
                <img
                  src={job.company_logo}
                  alt={job.company_name || "Company"}
                  className="h-full w-full object-contain"
                />
              ) : (
                <Building2
                  size={22}
                  className="text-primary sm:h-6 sm:w-6"
                />
              )}
            </div>

            {/* Job Info */}
            <div className="min-w-0 flex-1 pr-1">

              <h2 className="break-words text-base font-bold leading-6 text-text sm:text-lg">
                {job.title}
              </h2>

              <p className="mt-1 break-words text-sm font-semibold text-primary sm:text-base">
                {job.company_name || "Company"}
              </p>

              <div className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-text-secondary sm:text-sm">
                <MapPin
                  size={14}
                  className="mt-0.5 shrink-0"
                />

                <span className="break-words">
                  {job.location || "Location not specified"}
                </span>
              </div>

            </div>

          </div>

          {/* Job Meta */}
          <div className="mt-4 flex flex-wrap gap-2 sm:mt-5">

            <span className="rounded-full bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">
              {formatEmploymentType(job.employment_type)}
            </span>

            <span className="rounded-full bg-background px-3 py-1.5 text-xs font-semibold text-text-secondary">
              {formatWorkMode(job.work_mode)}
            </span>

            <span className="rounded-full bg-background px-3 py-1.5 text-xs font-semibold text-text-secondary">
              {formatSalary()}
            </span>

          </div>

          {/* Job Quick Information */}
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">

            {/* Experience */}
            <div className="rounded-xl border border-border bg-background px-3.5 py-3">
              <div className="flex items-center gap-2">
                <BriefcaseBusiness
                  size={15}
                  className="shrink-0 text-primary"
                />

                <p className="text-[11px] font-medium uppercase tracking-wide text-text-secondary">
                  Experience
                </p>
              </div>

              <p className="mt-1 text-xs font-semibold text-text sm:text-sm">
                {job.experience_required || "Not specified"}
              </p>
            </div>

            {/* Deadline */}
            <div className="rounded-xl border border-border bg-background px-3.5 py-3">
              <div className="flex items-center gap-2">
                <Clock3
                  size={15}
                  className="shrink-0 text-primary"
                />

                <p className="text-[11px] font-medium uppercase tracking-wide text-text-secondary">
                  Deadline
                </p>
              </div>

              <p className="mt-1 text-xs font-semibold text-text sm:text-sm">
                {formatDate(job.application_deadline)}
              </p>
            </div>

            {/* Posted */}
            <div className="rounded-xl border border-border bg-background px-3.5 py-3">
              <div className="flex items-center gap-2">
                <CalendarDays
                  size={15}
                  className="shrink-0 text-primary"
                />

                <p className="text-[11px] font-medium uppercase tracking-wide text-text-secondary">
                  Posted
                </p>
              </div>

              <p className="mt-1 text-xs font-semibold text-text sm:text-sm">
                {formatDate(job.created_at)}
              </p>
            </div>

          </div>

          {/* Actions */}
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">

            {/* Apply */}
            <button
              type="button"
              onClick={handleApply}
              disabled={
                applying ||
                applied ||
                checkingApplication
              }
              className={`flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition sm:text-sm ${
                applied
                  ? "cursor-default bg-primary/10 text-primary"
                  : "bg-primary text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              }`}
            >
              {checkingApplication ? (
                "Checking..."
              ) : applying ? (
                "Submitting..."
              ) : applied ? (
                <>
                  <CheckCircle2 size={16} />
                  Applied
                </>
              ) : (
                <>
                  Apply Now
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {/* Full Details */}
            <button
              type="button"
              onClick={() =>
                navigate(`/candidate/jobs/${job.id}`)
              }
              className="flex min-h-10 items-center justify-center rounded-lg border border-border bg-background px-4 py-2.5 text-xs font-semibold text-text transition hover:border-primary hover:text-primary sm:text-sm"
            >
              View Full Job Details
            </button>

          </div>

          {/* Apply Error */}
          {applyError &&
            !showApplyConfirm &&
            !showApplySuccess && (
              <p className="mt-3 text-xs font-medium text-red-500">
                {applyError}
              </p>
            )}

        </div>

        {/* Scrollable Content */}
        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6">

          <div className="space-y-6 sm:space-y-7">

            {/* Job Description */}
            <section>
              <h3 className="text-sm font-bold text-text sm:text-base">
                Job Description
              </h3>

              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-text-secondary sm:mt-3">
                {job.description ||
                  "No job description available."}
              </p>
            </section>

            {/* Required Skills */}
            <section>
              <h3 className="text-sm font-bold text-text sm:text-base">
                Required Skills
              </h3>

              {skills.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-text sm:text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-text-secondary">
                  No specific skills listed.
                </p>
              )}
            </section>

            {/* Application Deadline */}
            <section>
              <h3 className="text-sm font-bold text-text sm:text-base">
                Application Deadline
              </h3>

              <p className="mt-2 text-sm text-text-secondary">
                {job.application_deadline
                  ? new Date(
                      job.application_deadline
                    ).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "No deadline specified"}
              </p>
            </section>

          </div>

        </div>
      </div>

      {/* ================= APPLY CONFIRMATION MODAL ================= */}

      {showApplyConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-5 shadow-2xl">

            {/* Header */}
            <div className="flex items-start justify-between gap-4">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <BriefcaseBusiness
                    size={22}
                    className="text-primary"
                  />
                </div>

                <div>
                  <h2 className="text-base font-bold text-text">
                    Confirm Application
                  </h2>

                  <p className="mt-0.5 text-xs text-text-secondary">
                    Review your application before submitting.
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={handleCancelApply}
                disabled={applying}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-secondary transition hover:bg-background hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={18} />
              </button>

            </div>

            {/* Job Information */}
            <div className="mt-5 rounded-xl border border-border bg-background p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface p-2">

                  {job.company_logo ? (
                    <img
                      src={job.company_logo}
                      alt={job.company_name || "Company"}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <Building2
                      size={21}
                      className="text-primary"
                    />
                  )}

                </div>

                <div className="min-w-0">

                  <h3 className="truncate text-sm font-bold text-text">
                    {job.title}
                  </h3>

                  <p className="mt-0.5 truncate text-xs font-semibold text-primary">
                    {job.company_name || "Company"}
                  </p>

                </div>

              </div>

              <div className="mt-4 rounded-lg bg-surface p-3">
                <p className="text-xs leading-5 text-text-secondary">
                  Are you sure you want to apply for this position?
                  Your current resume will be submitted with your
                  application.
                </p>
              </div>

            </div>

            {/* Error */}
            {applyError && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
                <p className="text-xs font-medium text-red-600">
                  {applyError}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row">

              <button
                type="button"
                onClick={handleCancelApply}
                disabled={applying}
                className="flex-1 rounded-lg border border-border px-4 py-2.5 text-xs font-semibold text-text transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmApply}
                disabled={applying}
                className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {applying
                  ? "Submitting..."
                  : "Confirm Apply"}
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ================= SUCCESS MODAL ================= */}

      {showApplySuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-5 shadow-2xl">

            <div className="flex items-start justify-between gap-4">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2
                    size={24}
                    className="text-primary"
                  />
                </div>

                <div>
                  <h2 className="text-base font-bold text-text">
                    Application Submitted
                  </h2>

                  <p className="mt-0.5 text-xs text-text-secondary">
                    Your application has been submitted successfully.
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={() => setShowApplySuccess(false)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-secondary transition hover:bg-background hover:text-text"
              >
                <X size={18} />
              </button>

            </div>

            <div className="mt-5 rounded-xl border border-border bg-background p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface p-2">

                  {job.company_logo ? (
                    <img
                      src={job.company_logo}
                      alt={job.company_name || "Company"}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <Building2
                      size={21}
                      className="text-primary"
                    />
                  )}

                </div>

                <div className="min-w-0">

                  <h3 className="truncate text-sm font-bold text-text">
                    {job.title}
                  </h3>

                  <p className="mt-0.5 truncate text-xs font-semibold text-primary">
                    {job.company_name || "Company"}
                  </p>

                </div>

              </div>

            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">

              <button
                type="button"
                onClick={() => {
                  setShowApplySuccess(false);
                  navigate("/candidate/applications");
                }}
                className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-white transition hover:opacity-90"
              >
                View My Applications
              </button>

              <button
                type="button"
                onClick={() => setShowApplySuccess(false)}
                className="flex-1 rounded-lg border border-border px-4 py-2.5 text-xs font-semibold text-text transition hover:border-primary hover:text-primary"
              >
                Continue Browsing
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default CandidateJobPreview;