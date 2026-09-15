import { useEffect, useMemo, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Banknote,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Edit3,
  GraduationCap,
  MapPin,
  MoreHorizontal,
  Users,
  X,
  XCircle,
} from "lucide-react";

import CompanyDashboardLayout from "../../components/company/dashboard/CompanyDashboardLayout";

import { getJobApplications } from "../../services/company/jobApplicationService";

import {
  closeJob,
  getCompanyJobs,
  publishJob,
} from "../../services/company/jobService";

import JobStatusBadge from "../../components/company/jobs/JobStatusBadge";


/* =========================================================
   FORMAT SALARY
========================================================= */

function formatSalary(minSalary, maxSalary) {
  const hasMin =
    minSalary !== null &&
    minSalary !== undefined &&
    minSalary !== "";

  const hasMax =
    maxSalary !== null &&
    maxSalary !== undefined &&
    maxSalary !== "";

  if (!hasMin && !hasMax) {
    return "Not disclosed";
  }

  const formatValue = (value) =>
    `₹${Number(value).toLocaleString("en-IN")}`;

  if (hasMin && hasMax) {
    return `${formatValue(minSalary)} – ${formatValue(maxSalary)}`;
  }

  if (hasMin) {
    return `From ${formatValue(minSalary)}`;
  }

  return `Up to ${formatValue(maxSalary)}`;
}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(dateValue) {
  if (!dateValue) {
    return "Not specified";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Not specified";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}


/* =========================================================
   FORMAT EMPLOYMENT TYPE
========================================================= */

function formatEmploymentType(type) {
  if (!type) {
    return "Not specified";
  }

  return type
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}


/* =========================================================
   FORMAT WORK MODE
========================================================= */

function formatWorkMode(mode) {
  if (!mode) {
    return "Not specified";
  }

  return mode
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}


/* =========================================================
   FORMAT DEADLINE
========================================================= */

function formatDeadline(deadline) {
  if (!deadline) {
    return "No deadline";
  }

  return formatDate(deadline);
}


/* =========================================================
   GET SKILLS
========================================================= */

function getSkills(skills) {
  if (!skills) {
    return [];
  }

  if (Array.isArray(skills)) {
    return skills
      .map((skill) => String(skill).trim())
      .filter(Boolean);
  }

  return String(skills)
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}


/* =========================================================
   JOB STATUS LABEL
========================================================= */

function getJobStatusLabel(status) {
  if (!status) {
    return "Draft";
  }

  return status
    .toLowerCase()
    .replace("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}


/* =========================================================
   APPLICATION STATUS LABEL
========================================================= */

function getApplicationStatusLabel(status) {
  if (!status) {
    return "Applied";
  }

  const labels = {
    APPLIED: "Applied",
    RESUME_SCREENING: "Resume Screening",
    AI_INTERVIEW: "AI Interview",
    CLASSIFIED: "Shortlisted",
    SELECTED: "Selected",
    FINAL_INTERVIEW: "Final HR",
    HIRED: "Hired",
    REJECTED: "Rejected",
  };

  return (
    labels[status] ||
    status
      .toLowerCase()
      .replace("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
  );
}


/* =========================================================
   APPLICATION STATUS STYLE
========================================================= */

function getApplicationStatusStyle(status) {
  const styles = {
    APPLIED:
      "bg-blue-50 text-blue-700 border border-blue-100",

    RESUME_SCREENING:
      "bg-amber-50 text-amber-700 border border-amber-100",

    AI_INTERVIEW:
      "bg-violet-50 text-violet-700 border border-violet-100",

    CLASSIFIED:
      "bg-amber-50 text-amber-700 border border-amber-100",

    SELECTED:
      "bg-emerald-50 text-emerald-700 border border-emerald-100",

    FINAL_INTERVIEW:
      "bg-purple-50 text-purple-700 border border-purple-100",

    HIRED:
      "bg-green-50 text-green-700 border border-green-100",

    REJECTED:
      "bg-rose-50 text-rose-700 border border-rose-100",
  };

  return (
    styles[status] ||
    "bg-slate-50 text-slate-700 border border-slate-100"
  );
}


/* =========================================================
   SUCCESS TOAST
========================================================= */

function SuccessToast({ message }) {
  if (!message) {
    return null;
  }

  return (
    <div className="fixed right-6 top-6 z-[200]">
      <div className="flex min-w-[300px] items-center gap-3 rounded-xl border border-emerald-200 bg-white px-4 py-3 shadow-lg">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 size={19} />
        </div>

        <div>
          <p className="text-sm font-semibold text-text">
            Success
          </p>

          <p className="mt-0.5 text-xs text-text-secondary">
            {message}
          </p>
        </div>

      </div>
    </div>
  );
}


/* =========================================================
   CONFIRMATION MODAL
========================================================= */

function ConfirmationModal({
  open,
  type,
  loading,
  onCancel,
  onConfirm,
}) {
  if (!open) {
    return null;
  }

  const isPublish = type === "publish";

  const Icon = isPublish
    ? CheckCircle2
    : XCircle;

  const title = isPublish
    ? "Publish Job?"
    : "Close Job?";

  const message = isPublish
    ? "Are you sure you want to publish this job? Candidates will be able to view and apply for this position."
    : "Are you sure you want to close this job? Once closed, candidates will no longer be able to apply for this position.";

  const confirmLabel = isPublish
    ? loading
      ? "Publishing..."
      : "Publish Job"
    : loading
      ? "Closing..."
      : "Close Job";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 px-4"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !loading
        ) {
          onCancel();
        }
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-surface shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-title"
      >
        <div className="p-6 sm:p-7">

          <div className="flex items-start justify-between gap-4">

            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                isPublish
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-rose-100 text-rose-600"
              }`}
            >
              <Icon size={23} />
            </div>

            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              aria-label="Close confirmation"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition hover:bg-background hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={18} />
            </button>

          </div>

          <div className="mt-5">

            <h2
              id="confirmation-title"
              className="text-lg font-semibold text-text"
            >
              {title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-text-secondary">
              {message}
            </p>

          </div>

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-text-secondary transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className={`rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                isPublish
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-rose-600 hover:bg-rose-700"
              }`}
            >
              {confirmLabel}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}


/* =========================================================
   JOB DETAILS
========================================================= */

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [job, setJob] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [applications, setApplications] =
    useState([]);

  const [applicationsLoading, setApplicationsLoading] =
    useState(true);

  const [applicationsError, setApplicationsError] =
    useState("");

  const [publishing, setPublishing] =
    useState(false);

  const [closing, setClosing] =
    useState(false);

  const [confirmationAction, setConfirmationAction] =
    useState(null);

  const [showMenu, setShowMenu] =
    useState(false);

  const [successToast, setSuccessToast] =
    useState("");


  /* =====================================================
     SUCCESS TOAST FROM EDIT
  ===================================================== */

  useEffect(() => {
    if (!location.state?.successMessage) {
      return;
    }

    setSuccessToast(
      location.state.successMessage
    );

    window.history.replaceState(
      {},
      document.title,
      window.location.pathname
    );

    const timer = setTimeout(() => {
      setSuccessToast("");
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [location]);


  /* =====================================================
     SUCCESS TOAST HELPER
  ===================================================== */

  const showSuccessToast = (message) => {
    setSuccessToast(message);

    setTimeout(() => {
      setSuccessToast("");
    }, 3000);
  };


  /* =====================================================
     FETCH JOB
  ===================================================== */

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getCompanyJobs();

        const jobs = Array.isArray(data)
          ? data
          : data?.jobs ||
            data?.results ||
            [];

        const selectedJob = jobs.find(
          (item) =>
            String(item.id) ===
            String(id)
        );

        if (!selectedJob) {
          setError("Job not found.");
          return;
        }

        setJob(selectedJob);

      } catch (fetchError) {
        console.error(
          "Failed to load job:",
          fetchError
        );

        setError(
          fetchError?.response?.data?.message ||
            "Failed to load job details."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);


  /* =====================================================
     FETCH APPLICATIONS
  ===================================================== */

  useEffect(() => {
    const fetchApplications = async () => {
      setApplicationsLoading(true);
      setApplicationsError("");

      try {
        const data =
          await getJobApplications(id);

        const applicationList =
          Array.isArray(data?.applications)
            ? data.applications
            : [];

        setApplications(
          applicationList
        );

      } catch (fetchError) {
        console.error(
          "Failed to load job applications:",
          fetchError
        );

        setApplicationsError(
          fetchError?.response?.data?.message ||
            "Failed to load applications."
        );

        setApplications([]);

      } finally {
        setApplicationsLoading(false);
      }
    };

    if (id) {
      fetchApplications();
    }
  }, [id]);


  /* =====================================================
     SKILLS
  ===================================================== */

  const skills = useMemo(() => {
    return getSkills(job?.skills);
  }, [job?.skills]);


  /* =====================================================
     APPLICATION STATISTICS
  ===================================================== */

  const applicationStats = useMemo(() => {
    const total =
      applications.length;

    const shortlisted =
      applications.filter(
        (application) =>
          application.status === "CLASSIFIED" ||
          application.status === "SELECTED"
      ).length;

    const finalHR =
      applications.filter(
        (application) =>
          application.status ===
          "FINAL_INTERVIEW"
      ).length;

    const hired =
      applications.filter(
        (application) =>
          application.status === "HIRED"
      ).length;

    return {
      total,
      shortlisted,
      finalHR,
      hired,
    };
  }, [applications]);


  /* =====================================================
     PIPELINE
  ===================================================== */

  const pipeline = useMemo(() => {
    return [
      {
        label: "Applications",
        value: applicationStats.total,
        bg: "bg-blue-50",
        text: "text-blue-700",
        bar: "bg-blue-500",
        iconBg: "bg-blue-100",
      },
      {
        label: "Shortlisted",
        value: applicationStats.shortlisted,
        bg: "bg-amber-50",
        text: "text-amber-700",
        bar: "bg-amber-500",
        iconBg: "bg-amber-100",
      },
      {
        label: "Final HR",
        value: applicationStats.finalHR,
        bg: "bg-purple-50",
        text: "text-purple-700",
        bar: "bg-purple-500",
        iconBg: "bg-purple-100",
      },
      {
        label: "Hired",
        value: applicationStats.hired,
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        bar: "bg-emerald-500",
        iconBg: "bg-emerald-100",
      },
    ];
  }, [applicationStats]);


  /* =====================================================
     PUBLISH
  ===================================================== */

  const handlePublishJob = () => {
    if (
      !job ||
      job.status !== "DRAFT" ||
      publishing
    ) {
      return;
    }

    setConfirmationAction("publish");
  };


  const handleConfirmPublish = async () => {
    if (
      !job ||
      job.status !== "DRAFT" ||
      publishing
    ) {
      return;
    }

    try {
      setPublishing(true);

      const data =
        await publishJob(job.id);

      if (data?.job) {
        setJob(data.job);
      } else {
        setJob((previous) => ({
          ...previous,
          status: "PUBLISHED",
          published_at:
            new Date().toISOString(),
        }));
      }

      setConfirmationAction(null);

      showSuccessToast(
        "Job published successfully."
      );

    } catch (publishError) {
      console.error(
        "Failed to publish job:",
        publishError
      );

      window.alert(
        publishError?.response?.data?.message ||
          "Failed to publish the job."
      );

    } finally {
      setPublishing(false);
    }
  };


  /* =====================================================
     CLOSE
  ===================================================== */

  const handleCloseJob = () => {
    if (
      !job ||
      job.status !== "PUBLISHED" ||
      closing
    ) {
      return;
    }

    setConfirmationAction("close");
  };


  const handleConfirmClose = async () => {
    if (
      !job ||
      job.status !== "PUBLISHED" ||
      closing
    ) {
      return;
    }

    try {
      setClosing(true);

      const data =
        await closeJob(job.id);

      if (data?.job) {
        setJob(data.job);
      } else {
        setJob((previous) => ({
          ...previous,
          status: "CLOSED",
          closed_at:
            new Date().toISOString(),
        }));
      }

      setConfirmationAction(null);

      showSuccessToast(
        "Job closed successfully."
      );

    } catch (closeError) {
      console.error(
        "Failed to close job:",
        closeError
      );

      window.alert(
        closeError?.response?.data?.message ||
          "Failed to close the job."
      );

    } finally {
      setClosing(false);
    }
  };


  /* =====================================================
     EDIT
  ===================================================== */

  const handleEditJob = () => {
    navigate(
      `/company/jobs/${id}/edit`
    );
  };


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <CompanyDashboardLayout>

        <div className="flex min-h-[70vh] items-center justify-center">

          <div className="flex items-center gap-3 text-text-secondary">

            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />

            <span>
              Loading job details...
            </span>

          </div>

        </div>

      </CompanyDashboardLayout>
    );
  }


  /* =====================================================
     ERROR
  ===================================================== */

  if (error || !job) {
    return (
      <CompanyDashboardLayout>

        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-6">

          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 text-center shadow-sm">

            <XCircle className="mx-auto h-12 w-12 text-error" />

            <h2 className="mt-4 text-xl font-semibold text-text">
              {error || "Job not found"}
            </h2>

            <p className="mt-2 text-sm text-text-secondary">
              We could not load the requested job.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/company/jobs")
              }
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
            >
              <ArrowLeft size={18} />
              Back to Jobs
            </button>

          </div>

        </div>

      </CompanyDashboardLayout>
    );
  }


  const isPublished =
    job.status === "PUBLISHED";

  const isClosed =
    job.status === "CLOSED";


  /* =====================================================
     MAIN
  ===================================================== */

  return (
    <>
      <CompanyDashboardLayout>

        <SuccessToast
          message={successToast}
        />


        <div className="min-h-full bg-background">

          <main className="mx-auto w-full max-w-[1440px] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">


            {/* =================================================
                BREADCRUMB
            ================================================= */}

            <div className="mb-6 flex items-center gap-2 text-sm text-text-secondary">

              <button
                type="button"
                onClick={() =>
                  navigate("/company/jobs")
                }
                className="transition hover:text-primary"
              >
                Jobs
              </button>

              <ChevronRight size={16} />

              <span className="font-medium text-text">
                {job.title}
              </span>

            </div>


            {/* =================================================
                HEADER
            ================================================= */}

            <section className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

              <div className="min-w-0">

                <div className="flex flex-wrap items-center gap-3">

                  <h1 className="max-w-full break-words text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                    {job.title}
                  </h1>

                  <JobStatusBadge
                    status={job.status}
                  />

                </div>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-text-secondary sm:text-base">
                  View complete job information, recruitment progress, and applicant activity from your centralized command center.
                </p>

              </div>


              <div className="flex shrink-0 flex-wrap items-center gap-3">

                <button
                  type="button"
                  onClick={handleEditJob}
                  className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                >
                  <Edit3 size={17} />
                  Edit Job
                </button>


                {isPublished && (
                  <button
                    type="button"
                    onClick={handleCloseJob}
                    disabled={closing}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <XCircle size={17} />

                    {closing
                      ? "Closing..."
                      : "Close Job"}
                  </button>
                )}


                <div className="relative">

                  <button
                    type="button"
                    onClick={() =>
                      setShowMenu(
                        (previous) => !previous
                      )
                    }
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-slate-100 text-text-secondary transition hover:bg-slate-200 hover:text-text"
                    aria-label="More options"
                  >
                    <MoreHorizontal size={20} />
                  </button>


                  {showMenu && (
                    <div className="absolute right-0 top-12 z-20 w-48 overflow-hidden rounded-xl border border-border bg-surface py-1 shadow-lg">

                      <button
                        type="button"
                        onClick={() => {
                          setShowMenu(false);
                          navigate(
                            "/company/jobs"
                          );
                        }}
                        className="block w-full px-4 py-2.5 text-left text-sm text-text transition hover:bg-background"
                      >
                        Back to Jobs
                      </button>

                    </div>
                  )}

                </div>

              </div>

            </section>


            {/* =================================================
                METRICS
            ================================================= */}

            <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

              <MetricCard
                icon={Users}
                label="Total Applications"
                value={
                  applicationsLoading
                    ? "..."
                    : applicationStats.total
                }
                description="All applications"
                iconBg="bg-blue-100"
                iconColor="text-blue-600"
                cardBg="bg-blue-50/40"
              />

              <MetricCard
                icon={Clock3}
                label="Final HR"
                value={
                  applicationsLoading
                    ? "..."
                    : applicationStats.finalHR
                }
                description="Candidates in HR"
                iconBg="bg-purple-100"
                iconColor="text-purple-600"
                cardBg="bg-purple-50/40"
              />

              <MetricCard
                icon={CheckCircle2}
                label="Hired"
                value={
                  applicationsLoading
                    ? "..."
                    : applicationStats.hired
                }
                description="Successfully hired"
                iconBg="bg-emerald-100"
                iconColor="text-emerald-600"
                cardBg="bg-emerald-50/40"
              />

            </section>


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">


              {/* =================================================
                  LEFT CONTENT
              ================================================= */}

              <div className="min-w-0 space-y-6">


                {/* Hiring Pipeline */}

                <section className="overflow-hidden rounded-2xl border border-blue-100 bg-surface shadow-sm">

                  <div className="border-b border-blue-100 bg-blue-50/50 px-5 py-4 sm:px-6">

                    <h2 className="text-lg font-semibold text-primary">
                      Hiring Pipeline
                    </h2>

                    <p className="mt-1 text-sm text-text-secondary">
                      Current recruitment progress for this vacancy.
                    </p>

                  </div>


                  <div className="p-5 sm:p-6">

                    {applicationsError ? (
                      <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-4 text-sm text-rose-700">
                        {applicationsError}
                      </div>
                    ) : (
                      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                        {pipeline.map(
                          (stage, index) => {

                            const percentage =
                              applicationStats.total >
                              0
                                ? (stage.value /
                                    applicationStats.total) *
                                  100
                                : 0;

                            return (
                              <div
                                key={stage.label}
                                className={`relative min-w-0 overflow-hidden rounded-xl border border-white/80 ${stage.bg} p-4 transition hover:-translate-y-0.5 hover:shadow-sm`}
                              >

                                <div className="flex min-w-0 items-center justify-between gap-2">

                                  <div className="flex min-w-0 items-center gap-2">

                                    <div
                                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${stage.iconBg}`}
                                    >
                                      <span
                                        className={`h-2.5 w-2.5 rounded-full ${stage.bar}`}
                                      />
                                    </div>

                                    <span className="min-w-0 truncate text-sm font-semibold text-text">
                                      {stage.label}
                                    </span>

                                  </div>


                                  <div
                                    className={`flex h-9 min-w-[40px] shrink-0 items-center justify-center rounded-lg ${stage.iconBg} ${stage.text}`}
                                  >
                                    <span className="px-1 text-sm font-bold leading-none">
                                      {applicationsLoading
                                        ? "..."
                                        : stage.value}
                                    </span>
                                  </div>

                                </div>


                                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/80">

                                  <div
                                    className={`h-full rounded-full ${stage.bar} transition-all duration-500`}
                                    style={{
                                      width: `${
                                        percentage
                                      }%`,
                                    }}
                                  />

                                </div>


                                {index <
                                  pipeline.length -
                                    1 && (
                                  <ChevronRight
                                    size={16}
                                    className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white text-text-secondary shadow-sm lg:block"
                                  />
                                )}

                              </div>
                            );
                          }
                        )}

                      </div>
                    )}

                  </div>

                </section>


                {/* Job Overview */}

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-surface shadow-sm">

                  <div className="border-b border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">

                    <h2 className="text-lg font-semibold text-primary">
                      Job Overview
                    </h2>

                    <p className="mt-1 text-sm text-text-secondary">
                      Key information about this position.
                    </p>

                  </div>


                  <div className="p-5 sm:p-6">

                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">

                      <OverviewItem
                        icon={BriefcaseBusiness}
                        label="Employment Type"
                        value={formatEmploymentType(
                          job.employment_type
                        )}
                        iconBg="bg-blue-50"
                        iconColor="text-blue-600"
                      />

                      <OverviewItem
                        icon={MapPin}
                        label="Location"
                        value={
                          job.location ||
                          "Not specified"
                        }
                        iconBg="bg-emerald-50"
                        iconColor="text-emerald-600"
                      />

                      <OverviewItem
                        icon={BriefcaseBusiness}
                        label="Mode"
                        value={formatWorkMode(
                          job.work_mode
                        )}
                        iconBg="bg-purple-50"
                        iconColor="text-purple-600"
                      />

                      <OverviewItem
                        icon={Clock3}
                        label="Experience"
                        value={
                          job.experience_required ||
                          "Not specified"
                        }
                        iconBg="bg-amber-50"
                        iconColor="text-amber-600"
                      />

                      <OverviewItem
                        icon={Banknote}
                        label="Salary"
                        value={formatSalary(
                          job.minimum_salary,
                          job.maximum_salary
                        )}
                        iconBg="bg-emerald-50"
                        iconColor="text-emerald-600"
                      />

                      <OverviewItem
                        icon={GraduationCap}
                        label="Education"
                        value={
                          job.education ||
                          "Not specified"
                        }
                        iconBg="bg-indigo-50"
                        iconColor="text-indigo-600"
                      />

                      <OverviewItem
                        icon={BriefcaseBusiness}
                        label="Position"
                        value={
                          job.position ||
                          job.title
                        }
                        iconBg="bg-blue-50"
                        iconColor="text-blue-600"
                      />

                      <OverviewItem
                        icon={CalendarDays}
                        label="Deadline"
                        value={formatDeadline(
                          job.application_deadline
                        )}
                        iconBg="bg-rose-50"
                        iconColor="text-rose-600"
                      />

                    </div>

                  </div>

                </section>


                {/* Job Description & Skills */}

                <section className="overflow-hidden rounded-2xl border border-indigo-100 bg-surface shadow-sm">

                  <div className="border-b border-indigo-100 bg-indigo-50/50 px-5 py-4 sm:px-6">

                    <h2 className="text-lg font-semibold text-primary">
                      Job Description & Skills
                    </h2>

                  </div>


                  <div className="p-5 sm:p-6">

                    <div>

                      <h3 className="text-sm font-semibold text-text">
                        Job Description
                      </h3>

                      <div className="mt-3 whitespace-pre-line rounded-xl bg-slate-50 p-4 text-sm leading-7 text-text-secondary">
                        {job.description ||
                          "No description available."}
                      </div>

                    </div>


                    <div className="mt-7 border-t border-border pt-6">

                      <h3 className="text-sm font-semibold text-text">
                        Required Expertise
                      </h3>


                      {skills.length > 0 ? (
                        <div className="mt-4 flex flex-wrap gap-2">

                          {skills.map(
                            (skill, index) => (
                              <span
                                key={`${skill}-${index}`}
                                className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700"
                              >
                                {skill}
                              </span>
                            )
                          )}

                        </div>
                      ) : (
                        <p className="mt-3 text-sm text-text-secondary">
                          No skills specified.
                        </p>
                      )}

                    </div>

                  </div>

                </section>

              </div>


              {/* =================================================
                  RIGHT SIDEBAR
              ================================================= */}

              <aside className="min-w-0 space-y-6">


                {/* Quick Actions */}

                <section className="overflow-hidden rounded-2xl border border-blue-100 bg-surface shadow-sm">

                  <div className="border-b border-blue-100 bg-blue-50 px-5 py-4 sm:px-6">

                    <h2 className="text-lg font-semibold text-primary">
                      Quick Actions
                    </h2>

                    <p className="mt-1 text-xs text-text-secondary">
                      Manage this job posting
                    </p>

                  </div>


                  <div className="space-y-3 p-5 sm:p-6">

                    {!isClosed && (
                      <QuickAction
                        label="Edit Job Details"
                        icon={Edit3}
                        onClick={
                          handleEditJob
                        }
                        iconBg="bg-blue-50"
                        iconColor="text-blue-600"
                      />
                    )}


                    {job.status ===
                      "DRAFT" && (
                      <QuickAction
                        label={
                          publishing
                            ? "Publishing..."
                            : "Publish Job"
                        }
                        icon={CheckCircle2}
                        onClick={
                          handlePublishJob
                        }
                        disabled={publishing}
                        iconBg="bg-emerald-50"
                        iconColor="text-emerald-600"
                      />
                    )}


                    {job.status ===
                      "PUBLISHED" && (
                      <QuickAction
                        label={
                          closing
                            ? "Closing..."
                            : "Close Job"
                        }
                        icon={XCircle}
                        onClick={
                          handleCloseJob
                        }
                        disabled={closing}
                        iconBg="bg-rose-50"
                        iconColor="text-rose-600"
                      />
                    )}


                    {isClosed && (
                      <div className="flex items-center gap-3 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">

                        <XCircle size={18} />

                        Job is closed

                      </div>
                    )}

                  </div>

                </section>


                {/* Posting Timeline */}

                <section className="overflow-hidden rounded-2xl border border-purple-100 bg-surface shadow-sm">

                  <div className="border-b border-purple-100 bg-purple-50 px-5 py-4 sm:px-6">

                    <h2 className="text-lg font-semibold text-primary">
                      Posting Timeline
                    </h2>

                  </div>


                  <div className="p-5 sm:p-6">

                    <div className="space-y-6">

                      <TimelineItem
                        title="Job Created"
                        value={formatDate(
                          job.created_at
                        )}
                        active
                        color="blue"
                      />

                      <TimelineItem
                        title="Application Deadline"
                        value={formatDeadline(
                          job.application_deadline
                        )}
                        active={Boolean(
                          job.application_deadline
                        )}
                        color="amber"
                      />

                      <TimelineItem
                        title="Current Status"
                        value={getJobStatusLabel(
                          job.status
                        )}
                        active
                        color="purple"
                      />

                      {job.closed_at && (
                        <TimelineItem
                          title="Job Closed"
                          value={formatDate(
                            job.closed_at
                          )}
                          active
                          color="rose"
                        />
                      )}

                    </div>

                  </div>

                </section>


                {/* Job Status */}

                <section className="overflow-hidden rounded-2xl border border-emerald-100 bg-surface shadow-sm">

                  <div className="bg-emerald-50 px-5 py-4 sm:px-6">

                    <h2 className="text-sm font-semibold text-emerald-800">
                      Job Status
                    </h2>

                  </div>


                  <div className="p-5 sm:p-6">

                    <div className="flex items-center gap-3">

                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                          isClosed
                            ? "bg-rose-100 text-rose-600"
                            : "bg-emerald-100 text-emerald-600"
                        }`}
                      >

                        {isClosed ? (
                          <XCircle size={21} />
                        ) : (
                          <CheckCircle2
                            size={21}
                          />
                        )}

                      </div>


                      <div>

                        <p className="text-sm font-semibold text-text">
                          {getJobStatusLabel(
                            job.status
                          )}
                        </p>

                        <p className="mt-1 text-xs text-text-secondary">
                          Current vacancy status
                        </p>

                      </div>

                    </div>

                  </div>

                </section>

              </aside>

            </div>


            {/* =================================================
                RECENT APPLICANTS
            ================================================= */}

            <section className="mt-6 overflow-hidden rounded-2xl border border-blue-100 bg-surface shadow-sm">

              <div className="flex flex-col gap-3 border-b border-blue-100 bg-blue-50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

                <div>

                  <h2 className="text-lg font-semibold text-primary">
                    Recent Applicants
                  </h2>

                  <p className="mt-1 text-sm text-text-secondary">
                    Latest candidate activity for this role.
                  </p>

                </div>


                <span className="w-fit rounded-full border border-blue-100 bg-white px-3 py-1 text-xs font-semibold text-blue-700">
                  {applicationsLoading
                    ? "Loading..."
                    : `${applications.length} Applicant${
                        applications.length === 1
                          ? ""
                          : "s"
                      }`}
                </span>

              </div>


              {applicationsLoading ? (

                <div className="space-y-3 p-6">

                  {[1, 2, 3].map(
                    (item) => (
                      <div
                        key={item}
                        className="h-14 animate-pulse rounded-lg bg-background"
                      />
                    )
                  )}

                </div>

              ) : applicationsError ? (

                <div className="px-6 py-12 text-center">

                  <XCircle className="mx-auto h-10 w-10 text-rose-500" />

                  <h3 className="mt-3 text-sm font-semibold text-text">
                    Unable to load applicants
                  </h3>

                  <p className="mt-1 text-xs text-text-secondary">
                    {applicationsError}
                  </p>

                </div>

              ) : applications.length === 0 ? (

                <div className="flex flex-col items-center justify-center px-6 py-14 text-center">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Users size={23} />
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-text">
                    No applicants yet
                  </h3>

                  <p className="mt-1.5 max-w-sm text-sm leading-5 text-text-secondary">
                    Candidates who apply for this job will appear here.
                  </p>

                </div>

              ) : (

                <div className="overflow-x-auto">

                  <table className="w-full min-w-[700px]">

                    <thead>

                      <tr className="border-b border-blue-100 bg-slate-50 text-left">

                        <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                          Candidate
                        </th>

                        <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                          Current Stage
                        </th>

                        <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                          Applied
                        </th>

                        <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-secondary">
                          Action
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {applications
                        .slice(0, 5)
                        .map((application) => (

                          <tr
                            key={application.id}
                            className="border-b border-slate-100 transition last:border-b-0 hover:bg-blue-50/30"
                          >

                            <td className="px-6 py-4">

                              <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 ring-2 ring-white">
                                  {application.candidate_initials ||
                                    "C"}
                                </div>

                                <div className="min-w-0">

                                  <p className="truncate text-sm font-semibold text-text">
                                    {application.candidate_name ||
                                      "Candidate"}
                                  </p>

                                  <p className="mt-0.5 text-xs text-text-secondary">
                                    Application #
                                    {application.id}
                                  </p>

                                </div>

                              </div>

                            </td>


                            <td className="px-6 py-4">

                              <span
                                className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${getApplicationStatusStyle(
                                  application.status
                                )}`}
                              >
                                {getApplicationStatusLabel(
                                  application.status
                                )}
                              </span>

                            </td>


                            <td className="px-6 py-4 text-sm text-text-secondary">

                              <div className="flex items-center gap-2">

                                <CalendarDays
                                  size={15}
                                />

                                {formatDate(
                                  application.applied_at
                                )}

                              </div>

                            </td>


                            <td className="px-6 py-4 text-right">

                              <button
                                type="button"
                                disabled
                                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-text-secondary opacity-60"
                              >
                                View
                              </button>

                            </td>

                          </tr>

                        ))}

                    </tbody>

                  </table>

                </div>

              )}

            </section>

          </main>

        </div>

      </CompanyDashboardLayout>


      {/* =====================================================
          CONFIRMATION MODAL
      ===================================================== */}

      <ConfirmationModal
        open={Boolean(
          confirmationAction
        )}
        type={confirmationAction}
        loading={
          publishing || closing
        }
        onCancel={() => {
          if (
            !publishing &&
            !closing
          ) {
            setConfirmationAction(
              null
            );
          }
        }}
        onConfirm={
          confirmationAction ===
          "publish"
            ? handleConfirmPublish
            : handleConfirmClose
        }
      />

    </>
  );
}


/* =========================================================
   METRIC CARD
========================================================= */

function MetricCard({
  icon: Icon,
  label,
  value,
  description,
  iconBg,
  iconColor,
  cardBg,
}) {
  return (
    <div
      className={`rounded-2xl border border-border ${cardBg} p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`}
    >

      <div className="flex items-start justify-between gap-4">

        <div className="min-w-0">

          <p className="text-sm font-medium text-text-secondary">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-text">
            {value}
          </p>

          <p className="mt-1 text-xs text-text-secondary">
            {description}
          </p>

        </div>


        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
        >
          <Icon size={21} />
        </div>

      </div>

    </div>
  );
}


/* =========================================================
   OVERVIEW ITEM
========================================================= */

function OverviewItem({
  icon: Icon,
  label,
  value,
  iconBg,
  iconColor,
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl p-2 transition hover:bg-slate-50">

      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}
      >
        <Icon size={18} />
      </div>


      <div className="min-w-0">

        <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-text">
          {value}
        </p>

      </div>

    </div>
  );
}


/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  label,
  icon: Icon,
  onClick,
  disabled = false,
  iconBg = "bg-blue-50",
  iconColor = "text-blue-600",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-left transition hover:border-blue-200 hover:bg-blue-50/50 disabled:cursor-not-allowed disabled:opacity-60"
    >

      <span className="flex min-w-0 items-center gap-3">

        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}
        >
          <Icon size={17} />
        </span>

        <span className="truncate text-sm font-medium text-text">
          {label}
        </span>

      </span>


      {!disabled && (
        <ChevronRight
          size={17}
          className="ml-2 shrink-0 text-text-secondary"
        />
      )}

    </button>
  );
}


/* =========================================================
   TIMELINE ITEM
========================================================= */

function TimelineItem({
  title,
  value,
  active = false,
  color = "blue",
}) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    amber: "bg-amber-100 text-amber-600",
    purple: "bg-purple-100 text-purple-600",
    rose: "bg-rose-100 text-rose-600",
  };

  return (
    <div className="relative flex min-w-0 gap-3">

      <div
        className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          active
            ? colorClasses[color]
            : "bg-slate-100 text-slate-400"
        }`}
      >
        <Clock3 size={14} />
      </div>


      <div className="min-w-0">

        <p className="text-sm font-semibold text-text">
          {title}
        </p>

        <p className="mt-1 break-words text-xs text-text-secondary">
          {value}
        </p>

      </div>

    </div>
  );
}


export default JobDetails;