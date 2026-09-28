import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowUpDown,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronDown,
  Filter,
  Lightbulb,
  MapPin,
  Search,
} from "lucide-react";

import CandidateDashboardSidebar from "../../components/candidate/dashboard/CandidateDashboardSidebar";

import {
  getCandidateApplications,
} from "../../services/candidate/candidateJobApplicationService";


const MyApplications = () => {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("newest");

  const [showStatusFilter, setShowStatusFilter] = useState(false);


  // ================= FETCH APPLICATIONS =================

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getCandidateApplications();

        setApplications(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(
          "Failed to fetch applications:",
          error?.response?.data
        );

        setError(
          error?.response?.data?.detail ||
          "Failed to load your applications."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);


  // ================= STATUS CONFIG =================

  const statusLabels = {
    APPLIED: "Applied",
    RESUME_SCREENING: "AI Resume Screening",
    SHORTLISTED: "Shortlisted",
    AI_INTERVIEW: "AI Interview",
    SELECTED: "Selected",
    FINAL_INTERVIEW: "Final Interview",
    HIRED: "Hired",
    REJECTED: "Rejected",
  };


  // ================= NORMAL PIPELINE =================

  const pipelineStages = [
    {
      key: "APPLIED",
      label: "Applied",
    },
    {
      key: "RESUME_SCREENING",
      label: "AI Resume",
    },
    {
      key: "SHORTLISTED",
      label: "Shortlisted",
    },
    {
      key: "AI_INTERVIEW",
      label: "AI Interview",
    },
    {
      key: "SELECTED",
      label: "Selected",
    },
    {
      key: "FINAL_INTERVIEW",
      label: "Final Interview",
    },
    {
      key: "HIRED",
      label: "Hired",
    },
  ];


  // ================= GET APPLICATION PIPELINE =================

  const getApplicationPipeline = (status) => {

    /*
     * Rejected applications are shown as:
     *
     * Applied → AI Resume → Rejected
     *
     * Later recruitment stages are hidden because
     * the application did not progress further.
     */

    if (status === "REJECTED") {
      return [
        {
          key: "APPLIED",
          label: "Applied",
        },
        {
          key: "RESUME_SCREENING",
          label: "AI Resume",
        },
        {
          key: "REJECTED",
          label: "Rejected",
          rejected: true,
        },
      ];
    }

    return pipelineStages;
  };


  // ================= FORMAT DATE =================

  const formatDate = (date) => {
    if (!date) {
      return "Date not available";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };


  // ================= FORMAT STATUS =================

  const formatStatus = (status) => {
    return (
      statusLabels[status] ||
      status ||
      "Unknown"
    );
  };


  // ================= FORMAT VALUE =================

  const formatValue = (value) => {
    if (!value) {
      return "Not specified";
    }

    return value
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };


  // ================= GET CURRENT STAGE =================

  const getStageIndex = (status) => {
    const stages = getApplicationPipeline(status);

    const index = stages.findIndex(
      (stage) => stage.key === status
    );

    /*
     * For REJECTED, the dynamic pipeline contains
     * REJECTED as the final stage.
     */
    if (status === "REJECTED") {
      return stages.findIndex(
        (stage) => stage.key === "REJECTED"
      );
    }

    return index === -1 ? 0 : index;
  };


  // ================= FILTER + SORT =================

  const filteredApplications = useMemo(() => {
    let result = [...applications];

    const searchValue = search
      .trim()
      .toLowerCase();

    if (searchValue) {
      result = result.filter((application) => {
        const jobTitle =
          application.job_title?.toLowerCase() || "";

        const companyName =
          application.company_name?.toLowerCase() || "";

        return (
          jobTitle.includes(searchValue) ||
          companyName.includes(searchValue)
        );
      });
    }

    if (statusFilter !== "ALL") {
      result = result.filter(
        (application) =>
          application.status === statusFilter
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(
        a.applied_at || 0
      ).getTime();

      const dateB = new Date(
        b.applied_at || 0
      ).getTime();

      return sortOrder === "newest"
        ? dateB - dateA
        : dateA - dateB;
    });

    return result;
  }, [
    applications,
    search,
    statusFilter,
    sortOrder,
  ]);


  // ================= STATISTICS =================

  const totalApplications = applications.length;

  const activeApplications = applications.filter(
    (application) =>
      [
        "APPLIED",
        "RESUME_SCREENING",
        "SHORTLISTED",
        "AI_INTERVIEW",
        "SELECTED",
        "FINAL_INTERVIEW",
      ].includes(application.status)
  ).length;

  const interviewApplications = applications.filter(
    (application) =>
      [
        "AI_INTERVIEW",
        "FINAL_INTERVIEW",
      ].includes(application.status)
  ).length;

  const offerApplications = applications.filter(
    (application) =>
      application.status === "SELECTED" ||
      application.status === "HIRED"
  ).length;

  const rejectedApplications = applications.filter(
    (application) =>
      application.status === "REJECTED"
  ).length;


  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">

        <div className="hidden shrink-0 lg:flex">
          <CandidateDashboardSidebar />
        </div>

        <main className="flex min-w-0 flex-1 items-center justify-center">

          <p className="text-sm text-text-secondary">
            Loading your applications...
          </p>

        </main>

      </div>
    );
  }


  // ================= PAGE =================

  return (
    <div className="flex h-screen overflow-hidden bg-background">

      {/* ================= SIDEBAR ================= */}

      <div className="hidden shrink-0 lg:flex">
        <CandidateDashboardSidebar />
      </div>


      {/* ================= MAIN AREA ================= */}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">


        {/* ================= TOP BAR ================= */}

        <header className="flex shrink-0 items-center justify-between border-b border-border bg-background px-4 py-3 sm:px-6 lg:px-7">

          <div>

            <h1 className="text-lg font-bold text-primary sm:text-xl">
              My Applications
            </h1>

            <p className="mt-0.5 text-xs text-text-secondary sm:text-sm">
              Monitor every application throughout the hiring journey.
            </p>

          </div>


          {/* Header Search */}

          <div className="hidden w-72 lg:block">

            <div className="relative">

              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search applications..."
                className="w-full rounded-xl border border-border bg-surface py-2 pl-10 pr-3 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />

            </div>

          </div>

        </header>


        {/* ================= CONTENT AREA ================= */}

        <div className="flex min-h-0 flex-1 overflow-hidden">


          {/* ================= SCROLLABLE APPLICATION AREA ================= */}

          <div className="min-w-0 flex-1 overflow-y-auto">

            <div className="p-4 sm:p-6 lg:p-7">

              <div className="space-y-5">


                {/* ================= MOBILE SEARCH ================= */}

                <div className="lg:hidden">

                  <div className="relative">

                    <Search
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                    />

                    <input
                      type="text"
                      value={search}
                      onChange={(event) =>
                        setSearch(event.target.value)
                      }
                      placeholder="Search by job title or company..."
                      className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-3 text-sm text-text outline-none focus:border-primary"
                    />

                  </div>

                </div>


                {/* ================= STATISTICS ================= */}

                <section className="grid grid-cols-2 gap-3 md:grid-cols-5">

                  <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">

                    <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                      Total
                    </p>

                    <p className="mt-1 text-2xl font-bold text-text">
                      {totalApplications}
                    </p>

                  </div>


                  <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">

                    <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                      Active
                    </p>

                    <p className="mt-1 text-2xl font-bold text-text">
                      {activeApplications}
                    </p>

                  </div>


                  <div className="rounded-xl border border-border border-l-4 border-l-primary bg-surface p-4 shadow-sm">

                    <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      Interviews
                    </p>

                    <p className="mt-1 text-2xl font-bold text-text">
                      {interviewApplications}
                    </p>

                  </div>


                  <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">

                    <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      Offers
                    </p>

                    <p className="mt-1 text-2xl font-bold text-text">
                      {offerApplications}
                    </p>

                  </div>


                  <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">

                    <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                      Rejected
                    </p>

                    <p className="mt-1 text-2xl font-bold text-text">
                      {rejectedApplications}
                    </p>

                  </div>

                </section>


                {/* ================= FILTER BAR ================= */}

                <section className="sticky top-0 z-20 bg-background/95 py-1 backdrop-blur-md">

                  <div className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-2 shadow-sm sm:flex-row sm:items-center">


                    {/* Search */}

                    <div className="relative min-w-0 flex-1">

                      <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                      />

                      <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                          setSearch(event.target.value)
                        }
                        placeholder="Search by job title or company..."
                        className="w-full bg-transparent py-2 pl-10 pr-3 text-sm text-text outline-none"
                      />

                    </div>


                    {/* Status Filter */}

                    <div className="relative">

                      <button
                        type="button"
                        onClick={() =>
                          setShowStatusFilter(
                            (previous) => !previous
                          )
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-text-secondary transition hover:bg-background sm:w-auto"
                      >

                        <Filter size={17} />

                        <span>
                          {statusFilter === "ALL"
                            ? "Status"
                            : formatStatus(statusFilter)}
                        </span>

                        <ChevronDown size={16} />

                      </button>


                      {showStatusFilter && (
                        <div className="absolute right-0 top-full z-30 mt-2 w-52 rounded-xl border border-border bg-surface p-1.5 shadow-xl">

                          {[
                            "ALL",
                            "APPLIED",
                            "RESUME_SCREENING",
                            "SHORTLISTED",
                            "AI_INTERVIEW",
                            "SELECTED",
                            "FINAL_INTERVIEW",
                            "HIRED",
                            "REJECTED",
                          ].map((status) => (

                            <button
                              key={status}
                              type="button"
                              onClick={() => {
                                setStatusFilter(status);
                                setShowStatusFilter(false);
                              }}
                              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition hover:bg-background ${
                                statusFilter === status
                                  ? "font-semibold text-primary"
                                  : "text-text"
                              }`}
                            >

                              <span>
                                {status === "ALL"
                                  ? "All Applications"
                                  : formatStatus(status)}
                              </span>

                              {statusFilter === status && (
                                <Check size={15} />
                              )}

                            </button>

                          ))}

                        </div>
                      )}

                    </div>


                    {/* Sort */}

                    <button
                      type="button"
                      onClick={() =>
                        setSortOrder((current) =>
                          current === "newest"
                            ? "oldest"
                            : "newest"
                        )
                      }
                      className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-text-secondary transition hover:bg-background"
                    >

                      <span>
                        Sort:{" "}
                        {sortOrder === "newest"
                          ? "Newest"
                          : "Oldest"}
                      </span>

                      <ArrowUpDown size={17} />

                    </button>

                  </div>

                </section>


                {/* ================= ERROR ================= */}

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                    <p className="text-sm font-medium text-red-600">
                      {error}
                    </p>

                  </div>
                )}


                {/* ================= EMPTY ================= */}

                {!error &&
                  filteredApplications.length === 0 && (
                    <div className="rounded-2xl border border-border bg-surface p-10 text-center shadow-sm">

                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-background">

                        <BriefcaseBusiness
                          size={24}
                          className="text-text-secondary"
                        />

                      </div>

                      <h2 className="mt-4 text-base font-bold text-text">
                        No applications found
                      </h2>

                      <p className="mt-1 text-sm text-text-secondary">
                        {applications.length === 0
                          ? "You have not applied for any jobs yet."
                          : "Try changing your search or status filter."}
                      </p>

                      {applications.length === 0 && (
                        <button
                          type="button"
                          onClick={() =>
                            navigate("/candidate/jobs")
                          }
                          className="mt-5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                        >
                          Browse Jobs
                        </button>
                      )}

                    </div>
                  )}


                {/* ================= APPLICATION LIST ================= */}

                <section className="space-y-4">

                  {filteredApplications.map(
                    (application) => {

                      const isRejected =
                        application.status ===
                        "REJECTED";

                      const applicationPipeline =
                        getApplicationPipeline(
                          application.status
                        );

                      const currentStageIndex =
                        getStageIndex(
                          application.status
                        );

                      return (
                        <div
                          key={application.id}
                          className="rounded-2xl border border-border bg-surface p-4 shadow-sm transition hover:shadow-md sm:p-5"
                        >


                          {/* ================= APPLICATION HEADER ================= */}

                          <div className="flex flex-col gap-4 md:flex-row md:items-start">


                            {/* Company Logo */}

                            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-background p-2">

                              {application.company_logo ? (
                                <img
                                  src={application.company_logo}
                                  alt={
                                    application.company_name ||
                                    "Company"
                                  }
                                  className="h-full w-full object-contain"
                                />
                              ) : (
                                <BriefcaseBusiness
                                  size={24}
                                  className="text-primary"
                                />
                              )}

                            </div>


                            {/* Job Information */}

                            <div className="min-w-0 flex-1">

                              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">


                                <div>

                                  <h3 className="text-base font-bold leading-6 text-text sm:text-lg">
                                    {application.job_title ||
                                      "Job Title"}
                                  </h3>


                                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-text-secondary sm:text-sm">

                                    <span className="font-semibold text-primary">
                                      {application.company_name ||
                                        "Company"}
                                    </span>

                                    <span>
                                      •
                                    </span>

                                    <span className="flex items-center gap-1">
                                      <MapPin size={14} />

                                      {application.job_location ||
                                        "Location not specified"}
                                    </span>

                                    <span>
                                      •
                                    </span>

                                    <span>
                                      {formatValue(
                                        application.work_mode
                                      )}
                                    </span>

                                    <span>
                                      •
                                    </span>

                                    <span>
                                      {formatValue(
                                        application.employment_type
                                      )}
                                    </span>

                                    <span>
                                      •
                                    </span>

                                    <span>
                                      Applied{" "}
                                      {formatDate(
                                        application.applied_at
                                      )}
                                    </span>

                                  </div>

                                </div>


                                {/* ================= CURRENT STATUS ================= */}

                                <div
                                  className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold ${
                                    isRejected
                                      ? "bg-red-50 text-red-600"
                                      : "bg-primary/10 text-primary"
                                  }`}
                                >

                                  <span
                                    className={`h-2 w-2 rounded-full ${
                                      isRejected
                                        ? "bg-red-500"
                                        : "bg-primary"
                                    }`}
                                  />

                                  {formatStatus(
                                    application.status
                                  )}

                                </div>

                              </div>


                              {/* ================= PIPELINE ================= */}

                              <div className="mt-6 overflow-x-auto pb-2">

                                <div
                                  className={`${
                                    isRejected
                                      ? "min-w-[360px]"
                                      : "min-w-[680px]"
                                  }`}
                                >

                                  <div className="relative">


                                    {/* ================= BACKGROUND LINE ================= */}

                                    <div className="absolute left-0 right-0 top-3.5 h-0.5 bg-border" />


                                    {/* ================= PROGRESS LINE ================= */}

                                    <div
                                      className={`absolute left-0 top-3.5 h-0.5 ${
                                        isRejected
                                          ? "bg-red-500"
                                          : "bg-primary"
                                      }`}
                                      style={{
                                        width: `${
                                          applicationPipeline.length <=
                                          1
                                            ? 0
                                            : (currentStageIndex /
                                                (applicationPipeline.length -
                                                  1)) *
                                              100
                                        }%`,
                                      }}
                                    />


                                    {/* ================= PIPELINE STAGES ================= */}

                                    <div className="relative z-10 flex justify-between">

                                      {applicationPipeline.map(
                                        (
                                          stage,
                                          index
                                        ) => {

                                          const isCurrent =
                                            index ===
                                            currentStageIndex;

                                          const isRejectedStage =
                                            stage.key ===
                                            "REJECTED";

                                          const completed =
                                            index <
                                            currentStageIndex;

                                          return (
                                            <div
                                              key={
                                                stage.key
                                              }
                                              className="flex w-24 flex-col items-center gap-2"
                                            >

                                              {/* Stage Circle */}

                                              <div
                                                className={`flex h-7 w-7 items-center justify-center rounded-full ${
                                                  isRejectedStage
                                                    ? "bg-red-500 text-white ring-4 ring-red-500/10"
                                                    : completed ||
                                                      isCurrent
                                                    ? "bg-primary text-white"
                                                    : "border-2 border-border bg-surface text-text-secondary"
                                                }`}
                                              >

                                                {isRejectedStage ? (
                                                  <span className="text-xs font-bold">
                                                    ×
                                                  </span>
                                                ) : completed ||
                                                  isCurrent ? (
                                                  <Check size={14} />
                                                ) : (
                                                  <span className="h-2 w-2 rounded-full bg-current opacity-50" />
                                                )}

                                              </div>


                                              {/* Stage Label */}

                                              <span
                                                className={`text-center text-[10px] ${
                                                  isRejectedStage
                                                    ? "font-bold text-red-500"
                                                    : isCurrent
                                                    ? "font-bold text-primary"
                                                    : completed
                                                    ? "font-medium text-text"
                                                    : "text-text-secondary"
                                                }`}
                                              >
                                                {
                                                  stage.label
                                                }
                                              </span>

                                            </div>
                                          );
                                        }
                                      )}

                                    </div>

                                  </div>

                                </div>

                              </div>

                            </div>

                          </div>


                          {/* ================= CARD ACTIONS ================= */}

                          <div className="mt-5 flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">

                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/candidate/applications/${application.id}`
                                )
                              }
                              className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
                            >
                              Open Workspace
                            </button>

                          </div>

                        </div>
                      );
                    }
                  )}

                </section>

              </div>

            </div>

          </div>


          {/* ================= FIXED RIGHT SIDEBAR ================= */}

          <aside className="hidden w-72 shrink-0 overflow-y-auto border-l border-border bg-background p-5 xl:block">

            <div className="space-y-5">


              {/* ================= APPLICATION STATISTICS ================= */}

              <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">

                <h3 className="text-base font-bold text-text">
                  Application Statistics
                </h3>


                <div className="mt-5 space-y-5">


                  {/* Success Rate */}

                  <div>

                    <div className="flex justify-between text-xs">

                      <span className="text-text-secondary">
                        Success Rate
                      </span>

                      <span className="font-bold text-text">
                        {totalApplications
                          ? Math.round(
                              (offerApplications /
                                totalApplications) *
                                100
                            )
                          : 0}
                        %
                      </span>

                    </div>


                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background">

                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${
                            totalApplications
                              ? Math.round(
                                  (offerApplications /
                                    totalApplications) *
                                    100
                                )
                              : 0
                          }%`,
                        }}
                      />

                    </div>

                  </div>


                  {/* Interview Conversion */}

                  <div>

                    <div className="flex justify-between text-xs">

                      <span className="text-text-secondary">
                        Interview Conversion
                      </span>

                      <span className="font-bold text-text">
                        {totalApplications
                          ? Math.round(
                              (interviewApplications /
                                totalApplications) *
                                100
                            )
                          : 0}
                        %
                      </span>

                    </div>


                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background">

                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${
                            totalApplications
                              ? Math.round(
                                  (interviewApplications /
                                    totalApplications) *
                                    100
                                )
                              : 0
                          }%`,
                        }}
                      />

                    </div>

                  </div>


                  <div className="border-t border-border pt-4">

                    <p className="text-xs italic leading-5 text-text-secondary">
                      Keep your profile and resume updated
                      to improve your chances of progressing
                      through the hiring process.
                    </p>

                  </div>

                </div>

              </div>


              {/* ================= UPCOMING ================= */}

              <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">

                <div className="flex items-center justify-between">

                  <h3 className="text-base font-bold text-text">
                    Upcoming
                  </h3>

                  <span className="rounded bg-primary px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                    Live
                  </span>

                </div>


                <div className="mt-4">

                  {interviewApplications > 0 ? (
                    <div className="flex gap-3">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-background">

                        <BriefcaseBusiness
                          size={17}
                          className="text-primary"
                        />

                      </div>


                      <div>

                        <p className="text-sm font-bold text-text">
                          AI Interview
                        </p>

                        <p className="mt-1 text-xs text-text-secondary">
                          Check your application for
                          interview details.
                        </p>

                      </div>

                    </div>
                  ) : (
                    <p className="text-xs leading-5 text-text-secondary">
                      No upcoming interviews at the moment.
                    </p>
                  )}

                </div>

              </div>


              {/* ================= PRO TIP ================= */}

              <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-5">

                <Lightbulb
                  size={45}
                  className="absolute right-2 top-2 text-primary opacity-10"
                />

                <h3 className="flex items-center gap-2 text-sm font-bold text-primary">

                  <CheckCircle2 size={17} />

                  Pro Tip

                </h3>

                <p className="mt-2 text-xs leading-5 text-text-secondary">
                  Candidates who keep their profile and
                  resume updated are more likely to progress
                  through recruitment stages.
                </p>

              </div>


            </div>

          </aside>

        </div>

      </div>

    </div>
  );
};


export default MyApplications;