import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  MapPin,
  Users,
} from "lucide-react";

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


function CompanyRecentJobs({ jobs = [] }) {
  const navigate = useNavigate();

  const { companyId } = useParams();

  const [currentPage, setCurrentPage] = useState(1);

  const JOBS_PER_PAGE = 5;


  /* =====================================================
     SORT JOBS BY MOST RECENT
  ===================================================== */

  const sortedJobs = [...jobs].sort((a, b) => {
    const dateA = new Date(
      a.created_at || 0
    ).getTime();

    const dateB = new Date(
      b.created_at || 0
    ).getTime();

    return dateB - dateA;
  });


  /* =====================================================
     PAGINATION
  ===================================================== */

  const totalPages = Math.ceil(
    sortedJobs.length / JOBS_PER_PAGE
  );


  const startIndex =
    (currentPage - 1) * JOBS_PER_PAGE;


  const currentJobs = sortedJobs.slice(
    startIndex,
    startIndex + JOBS_PER_PAGE
  );


  /* =====================================================
     DATE FORMAT
  ===================================================== */

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Date not available";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Date not available";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };


  /* =====================================================
     STATUS STYLES
  ===================================================== */

  const getStatusStyles = (status) => {
    switch (
      String(status || "").toUpperCase()
    ) {
      case "PUBLISHED":
        return {
          badge:
            "bg-emerald-100 text-emerald-700",
          card:
            "border-emerald-100 bg-emerald-50/30",
          icon:
            "bg-emerald-100 text-emerald-600",
        };

      case "DRAFT":
        return {
          badge:
            "bg-amber-100 text-amber-700",
          card:
            "border-amber-100 bg-amber-50/30",
          icon:
            "bg-amber-100 text-amber-600",
        };

      case "CLOSED":
        return {
          badge:
            "bg-rose-100 text-rose-700",
          card:
            "border-rose-100 bg-rose-50/30",
          icon:
            "bg-rose-100 text-rose-600",
        };

      default:
        return {
          badge:
            "bg-slate-100 text-slate-600",
          card:
            "border-border bg-slate-50/40",
          icon:
            "bg-slate-100 text-slate-600",
        };
    }
  };


  /* =====================================================
     STATUS LABEL
  ===================================================== */

  const getStatusLabel = (status) => {
    const value =
      String(status || "UNKNOWN")
        .toUpperCase();

    if (value === "PUBLISHED") {
      return "Published";
    }

    if (value === "DRAFT") {
      return "Draft";
    }

    if (value === "CLOSED") {
      return "Closed";
    }

    return value
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };


  /* =====================================================
     APPLICATION COUNT
  ===================================================== */

  const getApplicationCount = (job) => {
    return Number(
      job.application_count ??
        job.applications_count ??
        job.total_applications ??
        0
    );
  };


  /* =====================================================
     VIEW JOB
  ===================================================== */

  const handleViewJob = (job) => {
    if (!companyId || !job?.id) {
      return;
    }

    navigate(
      `/admin/companies/${companyId}/jobs/${job.id}`
    );
  };


  /* =====================================================
     PAGE CHANGE
  ===================================================== */

  const goToPreviousPage = () => {
    setCurrentPage((page) =>
      Math.max(page - 1, 1)
    );
  };


  const goToNextPage = () => {
    setCurrentPage((page) =>
      Math.min(page + 1, totalPages)
    );
  };


  /* =====================================================
     EMPTY STATE
  ===================================================== */

  if (sortedJobs.length === 0) {
    return (
      <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">

        <div className="flex items-center gap-3 border-b border-border bg-slate-50 px-5 py-4">

          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
            <BriefcaseBusiness size={18} />
          </div>

          <div>
            <h2 className="text-sm font-bold text-text sm:text-base">
              Recent Jobs
            </h2>

            <p className="mt-0.5 text-xs text-text-secondary">
              Latest job postings from this company
            </p>
          </div>

        </div>


        <div className="flex min-h-[260px] flex-col items-center justify-center px-6 text-center">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-primary">
            <BriefcaseBusiness size={27} />
          </div>

          <h3 className="mt-4 text-base font-semibold text-text">
            No jobs available
          </h3>

          <p className="mt-1.5 max-w-sm text-sm leading-6 text-text-secondary">
            This company has not created any job postings yet.
          </p>

        </div>

      </section>
    );
  }


  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">

      {/* SECTION HEADER */}

      <div className="flex items-center justify-between gap-4 border-b border-border bg-slate-50 px-5 py-4">

        <div className="flex min-w-0 items-center gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
            <BriefcaseBusiness size={18} />
          </div>

          <div className="min-w-0">

            <h2 className="text-sm font-bold text-text sm:text-base">
              Recent Jobs
            </h2>

            <p className="mt-0.5 text-xs text-text-secondary">
              Latest job postings from this company
            </p>

          </div>

        </div>


        {/* JOB COUNT */}

        <span className="shrink-0 text-xs font-medium text-text-secondary">
          {sortedJobs.length}{" "}
          {sortedJobs.length === 1
            ? "Job"
            : "Jobs"}
        </span>

      </div>


      {/* JOB LIST */}

      <div className="space-y-3 p-4 sm:p-5">

        {currentJobs.map((job) => {

          const status =
            String(
              job.status || "UNKNOWN"
            ).toUpperCase();

          const styles =
            getStatusStyles(status);

          const applicationCount =
            getApplicationCount(job);

          const title =
            job.title ||
            job.job_title ||
            "Untitled Job";

          const location =
            job.location ||
            job.job_location ||
            "Location not specified";

          const department =
            job.department ||
            job.category ||
            "Department not specified";


          return (
            <div
              key={job.id}
              className={`
                group
                rounded-xl
                border
                p-4
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:shadow-sm
                sm:p-5
                ${styles.card}
              `}
            >

              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


                {/* JOB INFORMATION */}

                <div className="flex min-w-0 items-start gap-3">

                  <div
                    className={`
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      ${styles.icon}
                    `}
                  >
                    <BriefcaseBusiness
                      size={18}
                      strokeWidth={1.8}
                    />
                  </div>


                  <div className="min-w-0 flex-1">

                    <div className="flex flex-wrap items-center gap-2">

                      <h3 className="min-w-0 truncate text-sm font-bold text-text sm:text-base">
                        {title}
                      </h3>


                      <span
                        className={`
                          shrink-0
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
                        {getStatusLabel(status)}
                      </span>

                    </div>


                    {/* JOB META */}

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-text-secondary">

                      <span className="inline-flex items-center gap-1.5">
                        <BriefcaseBusiness size={13} />
                        {department}
                      </span>


                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={13} />
                        {location}
                      </span>


                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={13} />
                        {formatDate(
                          job.created_at
                        )}
                      </span>

                    </div>

                  </div>

                </div>


                {/* APPLICATIONS + VIEW */}

                <div className="flex items-center justify-between gap-4 border-t border-border/70 pt-3 lg:border-0 lg:pt-0">

                  {/* APPLICATION COUNT */}

                  <div className="flex items-center gap-2 text-sm text-text-secondary">

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/80">
                      <Users size={15} />
                    </div>

                    <div>

                      <p className="text-[10px] font-medium uppercase tracking-wide text-text-secondary">
                        Applications
                      </p>

                      <p className="font-bold text-text">
                        {applicationCount.toLocaleString(
                          "en-IN"
                        )}
                      </p>

                    </div>

                  </div>


                  {/* VIEW BUTTON */}

                  <button
                    type="button"
                    onClick={() =>
                      handleViewJob(job)
                    }
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-3 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
                  >
                    View

                    <ArrowUpRight
                      size={15}
                    />
                  </button>

                </div>

              </div>

            </div>
          );
        })}

      </div>


      {/* =================================================
          PAGINATION
      ================================================= */}

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 border-t border-border bg-slate-50 px-4 py-3 sm:px-5">

          {/* CURRENT PAGE */}

          <span className="mr-1 text-xs font-medium text-text-secondary">
            {currentPage} / {totalPages}
          </span>


          {/* LEFT ARROW */}

          <button
            type="button"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className={`
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              border
              border-border
              bg-white
              transition
              ${
                currentPage === 1
                  ? "cursor-not-allowed opacity-40"
                  : "text-text hover:bg-primary hover:text-white"
              }
            `}
          >
            <ArrowLeft size={15} />
          </button>


          {/* RIGHT ARROW */}

          <button
            type="button"
            onClick={goToNextPage}
            disabled={
              currentPage === totalPages
            }
            aria-label="Next page"
            className={`
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              border
              border-border
              bg-white
              transition
              ${
                currentPage === totalPages
                  ? "cursor-not-allowed opacity-40"
                  : "text-text hover:bg-primary hover:text-white"
              }
            `}
          >
            <ArrowRight size={15} />
          </button>

        </div>
      )}

    </section>
  );
}


export default CompanyRecentJobs;