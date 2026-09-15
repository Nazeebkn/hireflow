import {
  BriefcaseBusiness,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

function CompanyRecentJobs({ jobs = [] }) {
  const [currentPage, setCurrentPage] =
    useState(1);

  const JOBS_PER_PAGE = 8;

  /* =====================================================
     RESET PAGE WHEN JOB DATA CHANGES
  ===================================================== */

  useEffect(() => {
    setCurrentPage(1);
  }, [jobs]);


  /* =====================================================
     PAGINATION
  ===================================================== */

  const totalPages = Math.max(
    1,
    Math.ceil(
      jobs.length / JOBS_PER_PAGE
    )
  );

  const startIndex =
    (currentPage - 1) *
    JOBS_PER_PAGE;

  const endIndex =
    startIndex + JOBS_PER_PAGE;

  const currentJobs = jobs.slice(
    startIndex,
    endIndex
  );


  /* =====================================================
     PAGE NUMBERS
  ===================================================== */

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
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

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
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
          icon:
            "bg-emerald-100 text-emerald-600",
          badge:
            "bg-emerald-100 text-emerald-700",
        };

      case "DRAFT":
        return {
          icon:
            "bg-amber-100 text-amber-600",
          badge:
            "bg-amber-100 text-amber-700",
        };

      case "CLOSED":
        return {
          icon:
            "bg-rose-100 text-rose-600",
          badge:
            "bg-rose-100 text-rose-700",
        };

      default:
        return {
          icon:
            "bg-slate-100 text-slate-600",
          badge:
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
     EMPTY STATE
  ===================================================== */

  if (jobs.length === 0) {
    return (
      <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">

        <div className="flex items-center gap-3 border-b border-border bg-slate-50 px-5 py-4">

          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
            <BriefcaseBusiness size={18} />
          </div>

          <div>
            <h2 className="text-sm font-bold text-text sm:text-base">
              Jobs
            </h2>

            <p className="mt-0.5 text-xs text-text-secondary">
              Job postings from this company
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
     DISPLAY RANGE
  ===================================================== */

  const showingFrom = startIndex + 1;

  const showingTo = Math.min(
    endIndex,
    jobs.length
  );


  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex items-center justify-between gap-4 border-b border-border bg-slate-50 px-5 py-4">

        <div className="flex min-w-0 items-center gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
            <BriefcaseBusiness size={18} />
          </div>

          <div className="min-w-0">

            <h2 className="text-sm font-bold text-text sm:text-base">
              Jobs
            </h2>

            <p className="mt-0.5 text-xs text-text-secondary">
              {jobs.length} job
              {jobs.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>

          </div>

        </div>

        <p className="shrink-0 text-xs font-medium text-text-secondary">
          Page {currentPage} of {totalPages}
        </p>

      </div>


      {/* =================================================
          SINGLE TABLE
      ================================================= */}

      <div className="overflow-x-auto">

        <table className="w-full min-w-[850px]">

          <tbody>

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
                <tr
                  key={job.id}
                  className="border-t border-border transition hover:bg-slate-50/70 first:border-t-0"
                >

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

                        <p className="mt-0.5 truncate text-xs text-text-secondary">
                          {department}
                        </p>

                      </div>

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


                  {/* CREATED DATE */}

                  <td className="whitespace-nowrap px-4 py-4 sm:px-5">

                    <div className="flex items-center gap-2 text-sm text-text-secondary">

                      <CalendarDays
                        size={15}
                        className="shrink-0"
                      />

                      <span>
                        {formatDate(
                          job.created_at
                        )}
                      </span>

                    </div>

                  </td>


                  {/* APPLICATIONS */}

                  <td className="px-4 py-4 sm:px-5">

                    <div className="flex items-center gap-2">

                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-primary">

                        <Users size={15} />

                      </div>

                      <div>

                        <p className="text-[10px] font-medium uppercase tracking-wide text-text-secondary">
                          Applications
                        </p>

                        <p className="text-sm font-bold text-text">
                          {applicationCount.toLocaleString(
                            "en-IN"
                          )}
                        </p>

                      </div>

                    </div>

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
                      {getStatusLabel(status)}
                    </span>

                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>


      {/* =================================================
          PAGINATION
      ================================================= */}

      <div className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

        {/* RESULT INFO */}

        <p className="text-xs text-text-secondary">

          Showing{" "}

          <span className="font-semibold text-text">
            {showingFrom}
          </span>

          {" - "}

          <span className="font-semibold text-text">
            {showingTo}
          </span>

          {" of "}

          <span className="font-semibold text-text">
            {jobs.length}
          </span>

        </p>


        {/* PAGINATION */}

        <div className="flex items-center justify-center gap-1.5">

          {/* PREVIOUS */}

          <button
            type="button"
            onClick={() =>
              setCurrentPage((page) =>
                Math.max(1, page - 1)
              )
            }
            disabled={currentPage === 1}
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-border bg-white px-3 text-xs font-semibold text-text-secondary transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={15} />

            <span className="hidden sm:inline">
              Previous
            </span>
          </button>


          {/* PAGE NUMBERS */}

          <div className="flex items-center gap-1">

            {pageNumbers.map((page) => (
              <button
                key={page}
                type="button"
                onClick={() =>
                  setCurrentPage(page)
                }
                className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-xs font-semibold transition ${
                  currentPage === page
                    ? "bg-primary text-white shadow-sm"
                    : "border border-border bg-white text-text-secondary hover:bg-slate-50 hover:text-text"
                }`}
              >
                {page}
              </button>
            ))}

          </div>


          {/* NEXT */}

          <button
            type="button"
            onClick={() =>
              setCurrentPage((page) =>
                Math.min(
                  totalPages,
                  page + 1
                )
              )
            }
            disabled={
              currentPage === totalPages
            }
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-border bg-white px-3 text-xs font-semibold text-text-secondary transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >

            <span className="hidden sm:inline">
              Next
            </span>

            <ChevronRight size={15} />

          </button>

        </div>

      </div>

    </section>
  );
}

export default CompanyRecentJobs;