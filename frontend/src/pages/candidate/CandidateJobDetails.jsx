import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Bookmark,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Circle,
  GraduationCap,
  MapPin,
  X,
} from "lucide-react";

import CandidateDashboardSidebar from "../../components/candidate/dashboard/CandidateDashboardSidebar";

import { getCandidateJobById } from "../../services/candidate/candidateJobService";

import {
  applyForJob,
  getCandidateApplications,
} from "../../services/candidate/candidateJobApplicationService";


const CandidateJobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const [applyError, setApplyError] = useState("");
  const [applySuccess, setApplySuccess] = useState("");

  const [showApplyConfirm, setShowApplyConfirm] = useState(false);
  const [showApplySuccess, setShowApplySuccess] = useState(false);


  // Recruitment pipeline stages

  const recruitmentStages = [
    {
      key: "SEARCH",
      title: "Search Job",
      description:
        "Candidate discovers and reviews the available job opportunity.",
    },
    {
      key: "APPLIED",
      title: "Apply",
      description:
        "Candidate submits an application for the selected position.",
    },
    {
      key: "RESUME_SCREENING",
      title: "AI Resume Screening",
      description:
        "AI reviews the candidate's resume against the job requirements.",
    },
    {
      key: "AI_INTERVIEW",
      title: "AI Interview",
      description:
        "Candidate completes the AI-powered screening interview.",
    },
    {
      key: "CLASSIFIED",
      title: "Candidate Classification",
      description:
        "Candidate is classified based on resume and interview results.",
    },
    {
      key: "SELECTED",
      title: "Candidate Selection",
      description:
        "Qualified candidates are selected for the next stage of hiring.",
    },
    {
      key: "FINAL_INTERVIEW",
      title: "Final Interview",
      description:
        "Selected candidate attends the final interview with the company.",
    },
    {
      key: "HIRED",
      title: "Hired",
      description:
        "The candidate is selected and the hiring process is completed.",
    },
  ];


  // Fetch job details

useEffect(() => {
  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const [jobData, applicationsData] = await Promise.all([
        getCandidateJobById(jobId),
        getCandidateApplications(),
      ]);

      setJob(jobData);

      const applications = Array.isArray(applicationsData)
        ? applicationsData
        : applicationsData?.results || [];

      const alreadyApplied = applications.some(
        (application) =>
          Number(application.job) === Number(jobId)
      );

      setApplied(alreadyApplied);
    } catch (error) {
      console.error(
        "Failed to load job details:",
        error?.response?.data || error
      );

      setError("Failed to load job details.");
    } finally {
      setLoading(false);
    }
  };

  fetchJobDetails();
}, [jobId]);


  // Open apply confirmation modal

  const handleApply = () => {
    if (applying || applied) {
      return;
    }

    setApplyError("");
    setApplySuccess("");
    setShowApplyConfirm(true);
  };


  // Confirm application

  const handleConfirmApply = async () => {
    if (applying || applied) {
      return;
    }

    try {
      setApplying(true);
      setApplyError("");
      setApplySuccess("");

      await applyForJob(jobId);

      setApplied(true);

      setApplySuccess(
        "Application submitted successfully."
      );

      setShowApplyConfirm(false);
      setShowApplySuccess(true);

    } catch (error) {
      console.log(
        "Apply Error:",
        error?.response?.data
      );

      const responseData = error?.response?.data;

      const message =
        responseData?.detail ||
        responseData?.message ||
        responseData?.non_field_errors?.[0] ||
        "Failed to submit your application.";

      setApplyError(message);

    } finally {
      setApplying(false);
    }
  };


  // Cancel application confirmation

  const handleCancelApply = () => {
    if (applying) {
      return;
    }

    setShowApplyConfirm(false);
    setApplyError("");
  };


  // Format employment type

  const formatEmploymentType = (type) => {
    if (!type) return "Not specified";

    return type
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };


  // Format work mode

  const formatWorkMode = (mode) => {
    if (mode === "REMOTE") return "Remote";
    if (mode === "HYBRID") return "Hybrid";
    if (mode === "ONSITE") return "On-site";

    return "Not specified";
  };


  // Format salary

  const formatSalary = () => {
    if (!job?.minimum_salary && !job?.maximum_salary) {
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


  // Convert skills into array

  const skills = job?.skills
    ? job.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
    : [];


  // Format deadline

  const formatDeadline = () => {
    if (!job?.application_deadline) {
      return "No deadline specified";
    }

    return new Date(
      job.application_deadline
    ).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };


  // Loading

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">

        <div className="hidden shrink-0 lg:flex">
          <CandidateDashboardSidebar />
        </div>

        <main className="flex min-w-0 flex-1 items-center justify-center">
          <p className="text-sm text-text-secondary">
            Loading job details...
          </p>
        </main>

      </div>
    );
  }


  // Error

  if (error || !job) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">

        <div className="hidden shrink-0 lg:flex">
          <CandidateDashboardSidebar />
        </div>

        <main className="flex min-w-0 flex-1 items-center justify-center px-4">

          <div className="text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface">
              <BriefcaseBusiness
                size={24}
                className="text-text-secondary"
              />
            </div>

            <h2 className="mt-4 text-base font-bold text-text">
              {error || "Job not found."}
            </h2>

            <button
              type="button"
              onClick={() => navigate("/candidate/jobs")}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <ArrowLeft size={16} />
              Back to Jobs
            </button>

          </div>

        </main>

      </div>
    );
  }


  return (
    <div className="relative flex h-screen overflow-hidden bg-background">

      {/* ================= SIDEBAR ================= */}

      <div className="hidden shrink-0 lg:flex">
        <CandidateDashboardSidebar />
      </div>


      {/* ================= MAIN ================= */}

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">


        {/* ================= TOP BAR ================= */}

        <header className="shrink-0 border-b border-border bg-background">

          <div className="flex h-12 items-center justify-between gap-3 px-4 sm:px-6 lg:px-7">

            {/* Back */}

            <button
              type="button"
              onClick={() => navigate("/candidate/jobs")}
              className="flex shrink-0 items-center gap-2 text-xs font-semibold text-text-secondary transition hover:text-primary sm:text-sm"
            >
              <ArrowLeft size={16} />

              <span>
                Job Search
              </span>
            </button>


            {/* Breadcrumb */}

            <div className="hidden min-w-0 flex-1 items-center gap-2 md:flex">

              <span className="text-text-secondary">
                /
              </span>

              <span className="truncate text-xs font-semibold text-text sm:text-sm">
                {job.title}
              </span>

            </div>


            {/* Save */}

            <button
              type="button"
              className="flex shrink-0 items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text transition hover:border-primary hover:text-primary sm:px-4 sm:py-2 sm:text-sm"
            >
              <Bookmark size={15} />

              <span className="hidden sm:inline">
                Save Job
              </span>
            </button>

          </div>

        </header>


        {/* ================= SCROLL AREA ================= */}

        <div className="min-h-0 flex-1 overflow-y-auto">

          <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-7">


            {/* ================= JOB HEADER ================= */}

            <section className="rounded-xl border border-border bg-surface px-4 py-4 shadow-sm sm:px-5 sm:py-5">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">


                {/* Left */}

                <div className="flex min-w-0 items-center gap-3 sm:gap-4">

                  {/* Logo */}

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-background p-2 sm:h-14 sm:w-14">

                    {job.company_logo ? (
                      <img
                        src={job.company_logo}
                        alt={job.company_name || "Company"}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <Building2
                        size={23}
                        className="text-primary"
                      />
                    )}

                  </div>


                  {/* Info */}

                  <div className="min-w-0">

                    <h1 className="break-words text-lg font-bold leading-6 text-text sm:text-xl">
                      {job.title}
                    </h1>

                    <p className="mt-0.5 text-xs font-semibold text-primary sm:text-sm">
                      {job.company_name || "Company"}
                    </p>


                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] text-text-secondary sm:text-xs">

                      <span className="flex items-center gap-1">
                        <MapPin size={13} />
                        {job.location || "Location not specified"}
                      </span>

                      <span className="flex items-center gap-1">
                        <BriefcaseBusiness size={13} />
                        {formatEmploymentType(job.employment_type)}
                      </span>

                      <span>
                        {formatWorkMode(job.work_mode)}
                      </span>

                    </div>

                  </div>

                </div>


                {/* Apply */}

                <button
                  type="button"
                  onClick={handleApply}
                  disabled={applying || applied}
                  className={`w-full shrink-0 rounded-lg px-6 py-2.5 text-xs font-semibold transition sm:w-auto sm:text-sm ${
                    applied
                      ? "cursor-default bg-primary/10 text-primary"
                      : "bg-primary text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  }`}
                >
                  {applying
                    ? "Submitting..."
                    : applied
                    ? "Applied ✓"
                    : "Apply Now"}
                </button>

              </div>


              {/* Meta */}

              <div className="mt-3 flex flex-wrap gap-2">

                <span className="rounded-full bg-primary/5 px-3 py-1 text-[11px] font-semibold text-primary">
                  {formatEmploymentType(job.employment_type)}
                </span>

                <span className="rounded-full bg-background px-3 py-1 text-[11px] font-semibold text-text-secondary">
                  {formatWorkMode(job.work_mode)}
                </span>

                <span className="rounded-full bg-background px-3 py-1 text-[11px] font-semibold text-text-secondary">
                  {formatSalary()}
                </span>

              </div>


              {/* Apply Error */}

              {applyError && !showApplyConfirm && !showApplySuccess && (
                <p className="mt-3 text-xs font-medium text-red-500">
                  {applyError}
                </p>
              )}

            </section>


            {/* ================= TWO COLUMN AREA ================= */}

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_300px]">


              {/* ================= MAIN DETAILS ================= */}

              <div className="min-w-0 rounded-xl border border-border bg-surface px-5 py-5 shadow-sm sm:px-6 sm:py-6">


                {/* Job Overview */}

                <section>

                  <h2 className="text-base font-bold text-text sm:text-lg">
                    Job Overview
                  </h2>

                  <p className="mt-3 whitespace-pre-line text-sm leading-6 text-text-secondary sm:text-[15px] sm:leading-7">
                    {job.description ||
                      "No job description available."}
                  </p>

                </section>


                {/* Role Context */}

                <section className="mt-8">

                  <h2 className="text-base font-bold text-text sm:text-lg">
                    Role Context
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-text-secondary sm:text-[15px] sm:leading-7">
                    This position is designed for a candidate
                    who can contribute effectively to the team,
                    work with the required technologies, and
                    support the organization in achieving its
                    business goals.
                  </p>

                </section>


                {/* Responsibilities */}

                <section className="mt-8">

                  <h2 className="text-base font-bold text-text sm:text-lg">
                    Responsibilities
                  </h2>

                  <ul className="mt-3 space-y-2.5">

                    {[
                      "Work on responsibilities related to the advertised role.",
                      "Build and maintain high-quality solutions.",
                      "Collaborate effectively with team members.",
                      "Follow development and organizational best practices.",
                      "Debug, test, and improve application performance.",
                    ].map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm leading-6 text-text-secondary sm:text-[15px]"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />

                        <span>
                          {item}
                        </span>

                      </li>
                    ))}

                  </ul>

                </section>


                {/* Requirements */}

                <section className="mt-8">

                  <h2 className="text-base font-bold text-text sm:text-lg">
                    Requirements
                  </h2>


                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">

                    {/* Experience */}

                    <div className="rounded-lg border border-border bg-background p-4">

                      <div className="flex items-center gap-2">

                        <BriefcaseBusiness
                          size={16}
                          className="text-primary"
                        />

                        <h3 className="text-sm font-semibold text-text">
                          Experience
                        </h3>

                      </div>

                      <p className="mt-2 text-sm leading-6 text-text-secondary">
                        {job.experience_required ||
                          "Not specified"}
                      </p>

                    </div>


                    {/* Education */}

                    <div className="rounded-lg border border-border bg-background p-4">

                      <div className="flex items-center gap-2">

                        <GraduationCap
                          size={16}
                          className="text-primary"
                        />

                        <h3 className="text-sm font-semibold text-text">
                          Education
                        </h3>

                      </div>

                      <p className="mt-2 text-sm leading-6 text-text-secondary">
                        {job.education ||
                          "Not specified"}
                      </p>

                    </div>

                  </div>

                </section>


                {/* Required Skills */}

                <section className="mt-8">

                  <h2 className="text-base font-bold text-text sm:text-lg">
                    Required Skills
                  </h2>

                  {skills.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">

                      {skills.map((skill, index) => (
                        <span
                          key={`${skill}-${index}`}
                          className="rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary sm:text-sm"
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


                {/* Benefits */}

                <section className="mt-8">

                  <h2 className="text-base font-bold text-text sm:text-lg">
                    Benefits
                  </h2>

                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">

                    {[
                      "Professional growth opportunities",
                      "Collaborative work environment",
                      "Learning and development",
                      "Career advancement",
                    ].map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2.5"
                      >

                        <CheckCircle2
                          size={16}
                          className="shrink-0 text-primary"
                        />

                        <span className="text-sm text-text">
                          {benefit}
                        </span>

                      </div>
                    ))}

                  </div>

                </section>


                {/* About HireFlow */}

                <section className="mt-8">

                  <h2 className="text-base font-bold text-text sm:text-lg">
                    About HireFlow
                  </h2>

                  <div className="mt-3 rounded-lg border border-border bg-background p-4">

                    <p className="text-sm leading-6 text-text-secondary sm:text-[15px] sm:leading-7">
                      HireFlow is a modern recruitment
                      platform designed to connect candidates
                      with companies through an efficient and
                      technology-driven hiring process.
                    </p>

                  </div>

                </section>


                {/* ================= RECRUITMENT PIPELINE ================= */}

                <section className="mt-8">

                  <div>

                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
                      Hiring Process
                    </p>

                    <h2 className="mt-1 text-base font-bold text-text sm:text-lg">
                      Recruitment Process
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                      Follow the candidate journey from job
                      discovery to final hiring.
                    </p>

                  </div>


                  <div className="mt-4 rounded-xl border border-border bg-background p-4 sm:p-5">

                    <div className="space-y-0">

                      {recruitmentStages.map(
                        (stage, index) => {

                          const isLast =
                            index ===
                            recruitmentStages.length - 1;

                          const isCompleted = applied
                            ? index <= 1
                            : index === 0;

                          return (
                            <div
                              key={stage.key}
                              className="relative flex gap-3 sm:gap-4"
                            >

                              {/* Timeline Icon */}

                              <div className="relative flex w-7 shrink-0 justify-center">

                                <div
                                  className={`z-10 flex h-7 w-7 items-center justify-center rounded-full ${
                                    isCompleted
                                      ? "bg-primary text-white"
                                      : "border-2 border-border bg-surface text-text-secondary"
                                  }`}
                                >

                                  {isCompleted ? (
                                    <CheckCircle2 size={15} />
                                  ) : (
                                    <Circle size={10} />
                                  )}

                                </div>


                                {!isLast && (
                                  <div
                                    className={`absolute left-1/2 top-7 h-full w-px -translate-x-1/2 ${
                                      isCompleted
                                        ? "bg-primary/30"
                                        : "bg-border"
                                    }`}
                                  />
                                )}

                              </div>


                              {/* Stage Content */}

                              <div
                                className={
                                  isLast
                                    ? "min-w-0"
                                    : "min-w-0 pb-6"
                                }
                              >

                                <div className="flex flex-wrap items-center gap-2">

                                  <h3 className="text-sm font-semibold text-text">
                                    {stage.title}
                                  </h3>

                                  {isCompleted && (
                                    <span className="rounded-full bg-primary/5 px-2 py-0.5 text-[9px] font-semibold text-primary">
                                      Completed
                                    </span>
                                  )}

                                </div>


                                <p className="mt-1 text-xs leading-5 text-text-secondary sm:text-sm">
                                  {stage.description}
                                </p>

                              </div>

                            </div>
                          );
                        }
                      )}

                    </div>

                  </div>

                </section>

              </div>


              {/* ================= RIGHT SIDE ================= */}

              <aside className="h-fit space-y-4 lg:sticky lg:top-4">


                {/* Job Summary */}

                <div className="rounded-xl border border-border bg-surface p-4 shadow-sm sm:p-5">

                  <h2 className="text-base font-bold text-text">
                    {job.title}
                  </h2>

                  <p className="mt-1 text-xs font-semibold text-primary">
                    {job.company_name || "Company"}
                  </p>


                  {/* Salary */}

                  <div className="mt-4">

                    <p className="text-[11px] text-text-secondary">
                      Salary
                    </p>

                    <p className="mt-1 text-base font-bold text-text">
                      {formatSalary()}
                    </p>

                  </div>


                  {/* Summary Grid */}

                  <div className="mt-4 grid grid-cols-2 gap-2">

                    <div className="rounded-lg bg-background p-3">

                      <MapPin
                        size={15}
                        className="text-primary"
                      />

                      <p className="mt-2 text-[10px] text-text-secondary">
                        Location
                      </p>

                      <p className="mt-1 break-words text-xs font-semibold text-text">
                        {job.location || "Not specified"}
                      </p>

                    </div>


                    <div className="rounded-lg bg-background p-3">

                      <BriefcaseBusiness
                        size={15}
                        className="text-primary"
                      />

                      <p className="mt-2 text-[10px] text-text-secondary">
                        Work Mode
                      </p>

                      <p className="mt-1 text-xs font-semibold text-text">
                        {formatWorkMode(job.work_mode)}
                      </p>

                    </div>


                    <div className="rounded-lg bg-background p-3">

                      <BriefcaseBusiness
                        size={15}
                        className="text-primary"
                      />

                      <p className="mt-2 text-[10px] text-text-secondary">
                        Employment
                      </p>

                      <p className="mt-1 text-xs font-semibold text-text">
                        {formatEmploymentType(
                          job.employment_type
                        )}
                      </p>

                    </div>


                    <div className="rounded-lg bg-background p-3">

                      <CalendarDays
                        size={15}
                        className="text-primary"
                      />

                      <p className="mt-2 text-[10px] text-text-secondary">
                        Deadline
                      </p>

                      <p className="mt-1 break-words text-xs font-semibold text-text">
                        {formatDeadline()}
                      </p>

                    </div>

                  </div>

                </div>


                {/* Apply Card */}

                <div className="rounded-xl border border-border bg-surface p-4 shadow-sm sm:p-5">

                  <p className="text-sm font-semibold text-text">
                    Interested in this role?
                  </p>

                  <p className="mt-2 text-xs leading-5 text-text-secondary">
                    Submit your application and take the
                    next step in your career.
                  </p>

                  <button
                    type="button"
                    onClick={handleApply}
                    disabled={applying || applied}
                    className={`mt-4 w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                      applied
                        ? "cursor-default bg-primary/10 text-primary"
                        : "bg-primary text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    }`}
                  >
                    {applying
                      ? "Submitting..."
                      : applied
                      ? "Applied ✓"
                      : "Apply Now"}
                  </button>

                  <button
                    type="button"
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-text transition hover:border-primary hover:text-primary"
                  >
                    <Bookmark size={15} />
                    Save Job
                  </button>

                </div>


                {/* Deadline Notice */}

                <div className="rounded-xl border border-primary/15 bg-primary/5 p-4">

                  <div className="flex gap-3">

                    <CalendarDays
                      size={17}
                      className="mt-0.5 shrink-0 text-primary"
                    />

                    <div>

                      <p className="text-xs font-bold text-primary">
                        Application Deadline
                      </p>

                      <p className="mt-1 text-xs leading-5 text-text-secondary">
                        {formatDeadline()}
                      </p>

                    </div>

                  </div>

                </div>

              </aside>

            </div>

          </div>

        </div>

      </main>


      {/* ================= APPLY CONFIRMATION MODAL ================= */}

      {showApplyConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-5 shadow-2xl">

            {/* Modal Header */}

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


              {/* Close */}

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

                {/* Company Logo */}

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


                {/* Job Info */}

                <div className="min-w-0">

                  <h3 className="truncate text-sm font-bold text-text">
                    {job.title}
                  </h3>

                  <p className="mt-0.5 truncate text-xs font-semibold text-primary">
                    {job.company_name || "Company"}
                  </p>

                </div>

              </div>


              {/* Confirmation Message */}

              <div className="mt-4 rounded-lg bg-surface p-3">

                <p className="text-xs leading-5 text-text-secondary">
                  Are you sure you want to apply for this position?
                  Your current resume will be submitted with your application.
                </p>

              </div>

            </div>


            {/* Apply Error */}

            {applyError && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">

                <p className="text-xs font-medium text-red-600">
                  {applyError}
                </p>

              </div>
            )}


            {/* Modal Actions */}

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row">

              {/* Cancel */}

              <button
                type="button"
                onClick={handleCancelApply}
                disabled={applying}
                className="flex-1 rounded-lg border border-border px-4 py-2.5 text-xs font-semibold text-text transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>


              {/* Confirm Apply */}

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


      {/* ================= APPLY SUCCESS MODAL ================= */}

      {showApplySuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-5 shadow-2xl">

            {/* Modal Header */}

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


              {/* Close */}

              <button
                type="button"
                onClick={() => setShowApplySuccess(false)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-secondary transition hover:bg-background hover:text-text"
              >
                <X size={18} />
              </button>

            </div>


            {/* Job Details */}

            <div className="mt-5 rounded-xl border border-border bg-background p-4">

              <div className="flex items-center gap-3">

                {/* Company Logo */}

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


                {/* Job Info */}

                <div className="min-w-0">

                  <h3 className="truncate text-sm font-bold text-text">
                    {job.title}
                  </h3>

                  <p className="mt-0.5 truncate text-xs font-semibold text-primary">
                    {job.company_name || "Company"}
                  </p>

                </div>

              </div>


              {/* Small Job Details */}

              <div className="mt-4 grid grid-cols-2 gap-2">

                <div className="rounded-lg bg-surface p-2.5">

                  <p className="text-[10px] text-text-secondary">
                    Location
                  </p>

                  <p className="mt-1 truncate text-xs font-semibold text-text">
                    {job.location || "Not specified"}
                  </p>

                </div>


                <div className="rounded-lg bg-surface p-2.5">

                  <p className="text-[10px] text-text-secondary">
                    Employment
                  </p>

                  <p className="mt-1 truncate text-xs font-semibold text-text">
                    {formatEmploymentType(
                      job.employment_type
                    )}
                  </p>

                </div>

              </div>

            </div>


            {/* Modal Actions */}

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">

              {/* View Applications */}

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


              {/* Continue Browsing */}

              <button
                type="button"
                onClick={() => {
                  setShowApplySuccess(false);
                  navigate("/candidate/jobs");
                }}
                className="flex-1 rounded-lg border border-border px-4 py-2.5 text-xs font-semibold text-text transition hover:border-primary hover:text-primary"
              >
                Continue Browsing
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};


export default CandidateJobDetails;