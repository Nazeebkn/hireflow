import {
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import CandidateApplicationCard from "./CandidateApplicationCard";

function CandidateApplications({
  applications = [],
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [currentPage, setCurrentPage] =
    useState(1);

  const APPLICATIONS_PER_PAGE = 8;

  /* =========================================================
     FILTER APPLICATIONS
  ========================================================= */

  const filteredApplications = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return applications.filter(
      (application) => {
        const title = String(
          application?.job_title ||
            application?.job?.title ||
            application?.title ||
            ""
        ).toLowerCase();

        const company = String(
          application?.company_name ||
            application?.job?.company_name ||
            application?.company?.company_name ||
            ""
        ).toLowerCase();

        const status = String(
          application?.status || ""
        ).toUpperCase();

        const matchesSearch =
          !searchValue ||
          title.includes(searchValue) ||
          company.includes(searchValue);

        const matchesStatus =
          statusFilter === "ALL" ||
          status === statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );
  }, [
    applications,
    search,
    statusFilter,
  ]);

  /* =========================================================
     RESET PAGE WHEN SEARCH / FILTER CHANGES
  ========================================================= */

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  /* =========================================================
     PAGINATION
  ========================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredApplications.length /
        APPLICATIONS_PER_PAGE
    )
  );

  const startIndex =
    (currentPage - 1) *
    APPLICATIONS_PER_PAGE;

  const endIndex =
    startIndex + APPLICATIONS_PER_PAGE;

  const currentApplications =
    filteredApplications.slice(
      startIndex,
      endIndex
    );

  const goToPreviousPage = () => {
    setCurrentPage((page) =>
      Math.max(1, page - 1)
    );
  };

  const goToNextPage = () => {
    setCurrentPage((page) =>
      Math.min(totalPages, page + 1)
    );
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  /* =========================================================
     DISPLAY RANGE
  ========================================================= */

  const showingFrom =
    filteredApplications.length > 0
      ? startIndex + 1
      : 0;

  const showingTo =
    filteredApplications.length > 0
      ? Math.min(
          endIndex,
          filteredApplications.length
        )
      : 0;

  return (
    <div className="space-y-4">

      {/* =====================================================
          SEARCH + FILTER
      ===================================================== */}

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-4 shadow-sm md:flex-row md:items-center">

        {/* SEARCH */}

        <div className="relative min-w-0 flex-1">

          <Search
            size={17}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search applications..."
            className="h-10 w-full rounded-xl border border-border bg-slate-50 pl-10 pr-4 text-sm text-text outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
          />

        </div>


        {/* STATUS FILTER */}

        <div className="flex h-10 items-center gap-2 rounded-xl border border-border bg-slate-50 px-3">

          <Filter
            size={15}
            className="shrink-0 text-text-secondary"
          />

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
            className="bg-transparent text-sm font-medium text-text outline-none"
          >
            <option value="ALL">
              All Status
            </option>

            <option value="APPLIED">
              Applied
            </option>

            <option value="RESUME_SCREENING">
              Resume Screening
            </option>

            <option value="AI_INTERVIEW">
              AI Interview
            </option>

            <option value="CLASSIFIED">
              Classified
            </option>

            <option value="SELECTED">
              Selected
            </option>

            <option value="FINAL_INTERVIEW">
              Final Interview
            </option>

            <option value="HIRED">
              Hired
            </option>

            <option value="REJECTED">
              Rejected
            </option>
          </select>

        </div>

      </div>


      {/* =====================================================
          APPLICATION HEADER
      ===================================================== */}

      <div className="flex items-center justify-between gap-3">

        <div className="flex items-center gap-2">

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-primary">
            <BriefcaseBusiness size={15} />
          </div>

          <div>

            <h2 className="text-sm font-bold text-text">
              Applications
            </h2>

            <p className="text-xs text-text-secondary">
              {filteredApplications.length} application
              {filteredApplications.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>

          </div>

        </div>


        <p className="text-xs font-medium text-text-secondary">
          Page {currentPage} of {totalPages}
        </p>

      </div>


      {/* =====================================================
          SINGLE TABLE CONTAINER
      ===================================================== */}

      {filteredApplications.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">

          {/* TABLE */}

          <div className="overflow-x-auto">

            <table className="w-full min-w-[760px]">

              <tbody>

                {currentApplications.map(
                  (application, index) => (
                    <CandidateApplicationCard
                      key={
                        application?.id ||
                        `${
                          application?.job_id ||
                          "job"
                        }-${startIndex + index}`
                      }
                      application={application}
                    />
                  )
                )}

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
                {filteredApplications.length}
              </span>

            </p>


            {/* PAGINATION */}

            <div className="flex items-center justify-center gap-1.5">

              {/* PREVIOUS */}

              <button
                type="button"
                onClick={goToPreviousPage}
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
                      goToPage(page)
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
                onClick={goToNextPage}
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

        </div>

      ) : (

        /* =====================================================
           EMPTY STATE
        ===================================================== */

        <div className="rounded-2xl border border-border bg-white shadow-sm">

          <div className="flex min-h-[260px] flex-col items-center justify-center px-6 text-center">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-primary">
              <BriefcaseBusiness size={27} />
            </div>

            <h3 className="mt-4 text-base font-bold text-text">
              No applications found
            </h3>

            <p className="mt-1.5 max-w-md text-sm leading-6 text-text-secondary">
              No applications match the current
              search or status filter.
            </p>

          </div>

        </div>

      )}

    </div>
  );
}

export default CandidateApplications;