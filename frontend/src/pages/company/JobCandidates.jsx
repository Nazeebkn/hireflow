import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import CompanyDashboardLayout from "../../components/company/dashboard/CompanyDashboardLayout";

import ApplicationSearch from "../../components/company/applications/ApplicationSearch";
import ApplicationFilters from "../../components/company/applications/ApplicationFilters";
import ApplicationCandidateRow from "../../components/company/applications/ApplicationCandidateRow";
import ApplicationCandidateKpis from "../../components/company/applications/ApplicationCandidateKpis";

import {
  getJobApplications,
} from "../../services/company/jobApplicationService";

function JobCandidates() {
  const navigate = useNavigate();
  const { jobId } = useParams();

  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const candidatesPerPage = 10;

  /*
   * Candidate status options
   */
  const statusOptions = [
    { value: "ALL", label: "All Status" },
    {
      value: "APPLIED",
      label: "Applied",
    },
    {
      value: "RESUME_SCREENING",
      label: "Resume Screening",
    },
    {
      value: "AI_INTERVIEW",
      label: "AI Interview",
    },
 {
  value: "SHORTLISTED",
  label: "Shortlisted",
},
    {
      value: "FINAL_INTERVIEW",
      label: "Final Interview",
    },
    {
      value: "HIRED",
      label: "Hired",
    },
    {
      value: "REJECTED",
      label: "Rejected",
    },
  ];

  /*
   * Fetch applications
   */
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getJobApplications(jobId);

        const applicationList =
          Array.isArray(data)
            ? data
            : Array.isArray(data?.applications)
              ? data.applications
              : [];

        setApplications(applicationList);

        setJob({
          id: data?.job_id || jobId,
        });
      } catch (error) {
        console.error(
          "Failed to load candidates:",
          error?.response?.data || error
        );

        setApplications([]);

        setError(
          error?.response?.data?.message ||
            "Failed to load candidates."
        );
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchApplications();
    }
  }, [jobId]);

  /*
   * Filter candidates
   */
  const filteredApplications = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    return applications.filter((application) => {
      const candidateName = (
        application.candidate_name || ""
      ).toLowerCase();

      const matchesSearch =
        !searchValue ||
        candidateName.includes(searchValue);

      const matchesStatus =
        statusFilter === "ALL" ||
        application.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    applications,
    search,
    statusFilter,
  ]);

  /*
   * Pagination
   */
  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredApplications.length /
        candidatesPerPage
    )
  );

  const startIndex =
    (currentPage - 1) *
    candidatesPerPage;

  const endIndex =
    startIndex + candidatesPerPage;

  const paginatedApplications =
    filteredApplications.slice(
      startIndex,
      endIndex
    );

  /*
   * Keep current page valid
   * when search/filter changes
   */
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  /*
   * Reset pagination when
   * search or filter changes
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const handleBack = () => {
    navigate("/company/applications");
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(
        currentPage - 1
      );
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(
        currentPage + 1
      );
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <CompanyDashboardLayout>
      <div className="min-h-full">

        {/* Page Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

          <div className="flex min-w-0 items-center gap-3">

            <button
              type="button"
              onClick={handleBack}
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-border
                bg-surface
                text-text-secondary
                transition-colors
                hover:bg-background
                hover:text-text
              "
              aria-label="Back to applications"
            >
              <ArrowLeft
                size={19}
                strokeWidth={1.8}
              />
            </button>

            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-text sm:text-3xl">
                Candidates
              </h1>

              <p className="mt-1 text-sm text-text-secondary sm:text-base">
                Review all candidates who applied for this job.
              </p>
            </div>

          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5">

            <BriefcaseBusiness
              size={18}
              className="text-primary"
              strokeWidth={1.8}
            />

            <span className="text-sm font-semibold text-text">
              Job #{job?.id || jobId}
            </span>

          </div>

        </div>

        {/* KPI Cards */}
        <div className="mb-6">
          <ApplicationCandidateKpis
            totalCandidates={
              applications.length
            }
          />
        </div>

        {/* Main Content */}
        <section className="rounded-2xl border border-border bg-surface">

          {/* Search + Filter */}
          <div className="border-b border-border p-4 sm:p-5">

            <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_240px]">

              <ApplicationSearch
                value={search}
                onChange={setSearch}
                placeholder="Search candidates..."
              />

              <ApplicationFilters
                value={statusFilter}
                onChange={setStatusFilter}
                options={statusOptions}
              />

            </div>

            {!loading && !error && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">

                <p className="text-sm text-text-secondary">
                  Showing{" "}
                  <span className="font-semibold text-text">
                    {filteredApplications.length === 0
                      ? 0
                      : startIndex + 1}
                    -
                    {Math.min(
                      endIndex,
                      filteredApplications.length
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-text">
                    {filteredApplications.length}
                  </span>{" "}
                  candidates
                </p>

                {(search ||
                  statusFilter !== "ALL") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setStatusFilter("ALL");
                    }}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    Clear filters
                  </button>
                )}

              </div>
            )}

          </div>

          {/* Candidates */}
          <div className="p-4 sm:p-5">

            {/* Loading */}
            {loading && (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(
                  (item) => (
                    <div
                      key={item}
                      className="h-16 animate-pulse rounded-xl bg-background"
                    />
                  )
                )}
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-error/20 bg-error/5 p-5 text-center">

                <div>
                  <p className="text-base font-semibold text-error">
                    Unable to load candidates
                  </p>

                  <p className="mt-1 text-sm text-error/80">
                    {error}
                  </p>
                </div>

              </div>
            )}

            {/* Empty */}
            {!loading &&
              !error &&
              filteredApplications.length === 0 && (
                <div className="flex min-h-[220px] items-center justify-center text-center">

                  <div>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <BriefcaseBusiness
                        size={22}
                        strokeWidth={1.8}
                      />
                    </div>

                    <h3 className="mt-4 text-base font-semibold text-text">
                      No candidates found
                    </h3>

                    <p className="mt-1.5 text-sm text-text-secondary">
                      Try changing your search or status filter.
                    </p>
                  </div>

                </div>
              )}

            {/* Candidate List */}
            {!loading &&
              !error &&
              paginatedApplications.length > 0 && (
                <div className="space-y-3">

                  {paginatedApplications.map(
                    (application) => (
                      <ApplicationCandidateRow
                        key={application.id}
                        application={application}
                      />
                    )
                  )}

                </div>
              )}

            {/* Pagination */}
            {!loading && !error && (
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">

                {/* Previous */}
                <button
                  type="button"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="
                    inline-flex
                    h-10
                    items-center
                    gap-2
                    rounded-lg
                    border
                    border-border
                    bg-background
                    px-3
                    text-sm
                    font-medium
                    text-text
                    transition-colors
                    hover:bg-surface
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <ChevronLeft
                    size={16}
                    strokeWidth={1.8}
                  />

                  <span>Previous</span>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1.5">

                  {Array.from(
                    { length: totalPages },
                    (_, index) =>
                      index + 1
                  ).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() =>
                        handlePageChange(page)
                      }
                      disabled={
                        totalPages === 1
                      }
                      className={`
                        flex
                        h-10
                        min-w-10
                        items-center
                        justify-center
                        rounded-lg
                        border
                        px-3
                        text-sm
                        font-semibold
                        transition-colors
                        ${
                          currentPage === page
                            ? "border-primary bg-primary text-white"
                            : "border-border bg-background text-text hover:bg-surface"
                        }
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      `}
                    >
                      {page}
                    </button>
                  ))}

                </div>

                {/* Next */}
                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={
                    currentPage === totalPages
                  }
                  className="
                    inline-flex
                    h-10
                    items-center
                    gap-2
                    rounded-lg
                    border
                    border-border
                    bg-background
                    px-3
                    text-sm
                    font-medium
                    text-text
                    transition-colors
                    hover:bg-surface
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <span>Next</span>

                  <ChevronRight
                    size={16}
                    strokeWidth={1.8}
                  />
                </button>

              </div>
            )}

          </div>

        </section>

      </div>
    </CompanyDashboardLayout>
  );
}

export default JobCandidates;