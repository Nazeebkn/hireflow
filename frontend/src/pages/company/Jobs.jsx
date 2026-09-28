import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Activity,
  BriefcaseBusiness,
  CheckCircle2,
  Pencil,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import {
  getCompanyJobs,
  publishJob,
  closeJob,
} from "../../services/company/jobService";

import { getCompanyProfile } from "../../services/company/companyService";

import CompanyDashboardLayout from "../../components/company/dashboard/CompanyDashboardLayout";
import JobStatsCards from "../../components/company/jobs/JobStatsCards";
import JobTable from "../../components/company/jobs/JobTable";
import JobFormModal from "../../components/company/jobs/JobFormModal";
import ConfirmActionDialog from "../../components/company/jobs/ConfirmActionDialog";
import JobsEmptyState from "../../components/company/jobs/JobsEmptyState";

const JOBS_PER_PAGE = 5;

function Jobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [companyProfile, setCompanyProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const [jobPendingClose, setJobPendingClose] = useState(null);
  const [publishingJobId, setPublishingJobId] = useState(null);
  const [closingJobId, setClosingJobId] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getCompanyJobs();

      setJobs(
        Array.isArray(data)
          ? data
          : data?.jobs || data?.results || []
      );
    } catch (fetchError) {
      const data = fetchError.response?.data;

      const message =
        data?.message ||
        data?.detail ||
        "Unable to load jobs right now.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyProfile = async () => {
    try {
      const profile = await getCompanyProfile();

      setCompanyProfile(profile);
    } catch (profileError) {
      console.error(
        "Unable to load company profile:",
        profileError
      );
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchCompanyProfile();
  }, []);

  const handleCreateJobClick = () => {
    setEditingJob(null);
    setIsFormModalOpen(true);
  };

  const handleEditJobClick = (job) => {
    setEditingJob(job);
    setIsFormModalOpen(true);
  };

  const handleViewJob = (job) => {
    navigate(`/company/jobs/${job.id}`);
  };

  const handleFormModalClose = () => {
    setIsFormModalOpen(false);
    setEditingJob(null);
  };

  const handleFormSuccess = () => {
    setIsFormModalOpen(false);
    setEditingJob(null);
    fetchJobs();
  };

  const handlePublish = async (jobId) => {
    setPublishingJobId(jobId);

    try {
      await publishJob(jobId);

      toast.success("Job published successfully.");

      fetchJobs();
    } catch (publishError) {
      const data = publishError.response?.data;

      const message =
        data?.message ||
        data?.detail ||
        "Unable to publish this job.";

      toast.error(message);
    } finally {
      setPublishingJobId(null);
    }
  };

  const handleRequestClose = (job) => {
    setJobPendingClose(job);
  };

  const handleCancelClose = () => {
    setJobPendingClose(null);
  };

  const handleConfirmClose = async () => {
    if (!jobPendingClose) {
      return;
    }

    setClosingJobId(jobPendingClose.id);

    try {
      await closeJob(jobPendingClose.id);

      toast.success("Job closed successfully.");

      setJobPendingClose(null);

      fetchJobs();
    } catch (closeError) {
      const data = closeError.response?.data;

      const message =
        data?.message ||
        data?.detail ||
        "Unable to close this job.";

      toast.error(message);
    } finally {
      setClosingJobId(null);
    }
  };

  /*
   * Search + Status Filter
   */
  const filteredJobs = jobs.filter((job) => {
    const search = searchTerm.trim().toLowerCase();

    const matchesSearch =
      !search ||
      job.title?.toLowerCase().includes(search) ||
      job.location?.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "ALL" ||
      (job.status || "").toUpperCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  /*
   * Reset pagination when search/filter changes
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  /*
   * Pagination
   */
  const totalPages = Math.max(
    1,
    Math.ceil(filteredJobs.length / JOBS_PER_PAGE)
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safeCurrentPage - 1) * JOBS_PER_PAGE;

  const paginatedJobs = filteredJobs.slice(
    startIndex,
    startIndex + JOBS_PER_PAGE
  );

  /*
   * Recent Job Activity
   */
  const recentJobs = [...jobs]
    .sort((a, b) => {
      const dateA = new Date(
        a.updated_at || a.created_at || 0
      ).getTime();

      const dateB = new Date(
        b.updated_at || b.created_at || 0
      ).getTime();

      return dateB - dateA;
    })
    .slice(0, 4);

  const getRecentActivity = (job) => {
    const status = (job.status || "").toUpperCase();

    if (status === "CLOSED") {
      return {
        label: "Closed",
        icon: XCircle,
        className: "text-rose-600 bg-rose-50",
      };
    }

    if (status === "PUBLISHED") {
      return {
        label: "Published",
        icon: CheckCircle2,
        className: "text-emerald-600 bg-emerald-50",
      };
    }

    if (status === "DRAFT") {
      return {
        label: "Created",
        icon: BriefcaseBusiness,
        className: "text-amber-600 bg-amber-50",
      };
    }

    return {
      label: "Updated",
      icon: Pencil,
      className: "text-blue-600 bg-blue-50",
    };
  };

  const formatActivityDate = (dateValue) => {
    if (!dateValue) {
      return "Recently";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Recently";
    }

    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setCurrentPage(1);
  };

  return (
    <CompanyDashboardLayout
      title="Jobs"
      subtitle="Create, publish, and manage your company's job postings."
      companyProfile={companyProfile}
    >
      <div className="space-y-5">

        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5">
              <span className="text-sm font-medium text-primary">
                Job Management
              </span>
            </div>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-text sm:text-4xl">
              Jobs
            </h1>

            <p className="mt-1.5 text-base text-text-secondary">
              Create, publish, and manage your company's job postings.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreateJobClick}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-hover hover:shadow-md"
          >
            <Plus size={18} />
            Create Job
          </button>
        </div>

        {/* Stats */}
        <section className="mt-4">
          <JobStatsCards
            jobs={jobs}
            loading={loading}
          />
        </section>

        {/* Search & Filter */}
        {!loading && !error && jobs.length > 0 && (
          <section className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

              {/* Search */}
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  placeholder="Search jobs by title or location..."
                  className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              {/* Status Filter */}
              <div className="relative lg:w-52">
                <SlidersHorizontal
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
                />

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm font-medium text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                >
                  <option value="ALL">
                    All Statuses
                  </option>

                  <option value="DRAFT">
                    Draft
                  </option>

                  <option value="PUBLISHED">
                    Published
                  </option>

                  <option value="CLOSED">
                    Closed
                  </option>
                </select>
              </div>
            </div>

            {/* Filter Result Info */}
            {(searchTerm || statusFilter !== "ALL") && (
              <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-medium text-text-secondary">
                  Showing{" "}
                  <span className="font-semibold text-text">
                    {filteredJobs.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-text">
                    {jobs.length}
                  </span>{" "}
                  jobs
                </p>

                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-left text-xs font-semibold text-primary transition hover:text-primary-hover sm:text-right"
                >
                  Clear filters
                </button>
              </div>
            )}
          </section>
        )}

        {/* Content */}
        <section className="pt-1">

          {/* Error */}
          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-8 text-center">
              <div className="mx-auto max-w-md">
                <p className="text-sm font-medium text-rose-700">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={fetchJobs}
                  className="mt-4 inline-flex items-center justify-center rounded-xl border border-rose-300 bg-white px-4 py-2.5 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-100"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Loading */}
          {!error && loading && (
            <div className="overflow-hidden rounded-2xl border border-border bg-surface">
              <div className="hidden md:block">
                <div className="border-b border-border bg-background/70 px-5 py-4">
                  <div className="grid grid-cols-8 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                      <div
                        key={item}
                        className="h-4 animate-pulse rounded bg-border/70"
                      />
                    ))}
                  </div>
                </div>

                <div className="divide-y divide-border">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="grid grid-cols-8 gap-4 px-5 py-5"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((cell) => (
                        <div
                          key={cell}
                          className="h-4 animate-pulse rounded bg-background"
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 p-4 md:hidden">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-32 animate-pulse rounded-xl bg-background"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!error && !loading && jobs.length === 0 && (
            <JobsEmptyState
              onCreateJob={handleCreateJobClick}
            />
          )}

          {/* Main Jobs + Recent Activity */}
          {!error &&
            !loading &&
            jobs.length > 0 &&
            filteredJobs.length > 0 && (
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(300px,0.8fr)]">

                {/* Job Postings */}
                <div className="min-w-0">
                  <JobTable
                    jobs={paginatedJobs}
                    onView={handleViewJob}
                  />

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-border bg-surface px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs font-medium text-text-secondary">
                        Showing{" "}
                        <span className="font-semibold text-text">
                          {startIndex + 1}
                        </span>
                        {" - "}
                        <span className="font-semibold text-text">
                          {Math.min(
                            startIndex + JOBS_PER_PAGE,
                            filteredJobs.length
                          )}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-text">
                          {filteredJobs.length}
                        </span>{" "}
                        jobs
                      </p>

                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          disabled={safeCurrentPage === 1}
                          onClick={() =>
                            setCurrentPage((page) =>
                              Math.max(1, page - 1)
                            )
                          }
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary transition-colors hover:bg-background hover:text-text disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Previous page"
                        >
                          <ChevronLeft size={16} />
                        </button>

                        {Array.from(
                          { length: totalPages },
                          (_, index) => index + 1
                        ).map((page) => (
                          <button
                            key={page}
                            type="button"
                            onClick={() =>
                              setCurrentPage(page)
                            }
                            className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-xs font-semibold transition-colors ${
                              safeCurrentPage === page
                                ? "bg-primary text-white"
                                : "border border-border bg-surface text-text-secondary hover:bg-background hover:text-text"
                            }`}
                          >
                            {page}
                          </button>
                        ))}

                        <button
                          type="button"
                          disabled={
                            safeCurrentPage === totalPages
                          }
                          onClick={() =>
                            setCurrentPage((page) =>
                              Math.min(
                                totalPages,
                                page + 1
                              )
                            )
                          }
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary transition-colors hover:bg-background hover:text-text disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Next page"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Recent Job Activity */}
                <div className="h-fit overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">

                  {/* Header */}
                  <div className="border-b border-border px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Activity size={18} />
                      </div>

                      <div>
                        <h2 className="text-base font-semibold text-text">
                          Recent Activity
                        </h2>

                        <p className="mt-0.5 text-xs text-text-secondary">
                          Latest job updates
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Activity List */}
                  <div className="divide-y divide-border">
                    {recentJobs.length > 0 ? (
                      recentJobs.map((job) => {
                        const activity =
                          getRecentActivity(job);

                        const ActivityIcon =
                          activity.icon;

                        return (
                          <div
                            key={job.id}
                            className="px-5 py-4 transition-colors hover:bg-background/50"
                          >
                            <div className="flex items-start gap-3">

                              <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${activity.className}`}
                              >
                                <ActivityIcon size={15} />
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-xs font-semibold text-text">
                                    {activity.label}
                                  </p>

                                  <span className="shrink-0 text-[10px] font-medium text-text-secondary">
                                    {formatActivityDate(
                                      job.updated_at ||
                                        job.created_at
                                    )}
                                  </span>
                                </div>

                                <p className="mt-1 truncate text-sm font-medium text-text">
                                  {job.title}
                                </p>

                                <p className="mt-0.5 text-xs text-text-secondary">
                                  Job #{job.id}
                                </p>
                              </div>

                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="px-5 py-10 text-center">
                        <Activity
                          size={24}
                          className="mx-auto text-text-secondary"
                        />

                        <p className="mt-3 text-sm font-medium text-text">
                          No recent activity
                        </p>

                        <p className="mt-1 text-xs text-text-secondary">
                          Job activity will appear here.
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

          {/* No Search / Filter Results */}
          {!error &&
            !loading &&
            jobs.length > 0 &&
            filteredJobs.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center">
                <Search
                  size={28}
                  className="mx-auto text-text-secondary"
                />

                <h3 className="mt-4 text-base font-semibold text-text">
                  No jobs found
                </h3>

                <p className="mt-1 text-sm text-text-secondary">
                  Try changing your search or status filter.
                </p>

                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-4 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
                >
                  Clear Filters
                </button>
              </div>
            )}

        </section>
      </div>

      {/* Create / Edit Modal */}
      <JobFormModal
        open={isFormModalOpen}
        job={editingJob}
        onClose={handleFormModalClose}
        onSuccess={handleFormSuccess}
      />

      {/* Close Confirmation */}
      <ConfirmActionDialog
        open={Boolean(jobPendingClose)}
        title="Close this job?"
        message={
          jobPendingClose
            ? `"${jobPendingClose.title}" will stop accepting new applications. This can't be undone from here.`
            : ""
        }
        confirmLabel="Close Job"
        loading={Boolean(closingJobId)}
        onConfirm={handleConfirmClose}
        onCancel={handleCancelClose}
      />
    </CompanyDashboardLayout>
  );
}

export default Jobs;