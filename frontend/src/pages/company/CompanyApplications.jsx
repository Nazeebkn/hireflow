import { useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, ChevronLeft, ChevronRight } from "lucide-react";

import CompanyDashboardLayout from "../../components/company/dashboard/CompanyDashboardLayout";

import ApplicationLayout from "../../components/company/applications/ApplicationLayout";
import ApplicationJobList from "../../components/company/applications/ApplicationJobList";
import ApplicationJobHeader from "../../components/company/applications/ApplicationJobHeader";
import ApplicationKpiCards from "../../components/company/applications/ApplicationKpiCards";
import ApplicationCandidates from "../../components/company/applications/ApplicationCandidates";
import ApplicationSearch from "../../components/company/applications/ApplicationSearch";
import ApplicationFilters from "../../components/company/applications/ApplicationFilters";

import { getCompanyJobs } from "../../services/company/jobService";
import { getJobApplications } from "../../services/company/jobApplicationService";
import { getCompanyProfile } from "../../services/company/companyService";

function CompanyApplications() {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);

  const [applications, setApplications] = useState([]);

  const [companyProfile, setCompanyProfile] = useState(null);

  // Candidate search and filter
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Job search and filter
  const [jobSearch, setJobSearch] = useState("");
  const [jobStatusFilter, setJobStatusFilter] =
    useState("ALL");

  const [jobsLoading, setJobsLoading] = useState(true);
  const [applicationsLoading, setApplicationsLoading] =
    useState(false);

  const [jobsError, setJobsError] = useState("");
  const [applicationsError, setApplicationsError] =
    useState("");

  /*
   * Pagination display
   *
   * Currently only 8 candidates are displayed.
   * Pagination UI is shown but page switching is intentionally
   * disabled for now.
   */
  const ITEMS_PER_PAGE = 8;

  /*
   * Fetch company jobs
   */
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setJobsLoading(true);
        setJobsError("");

        const data = await getCompanyJobs();

        const jobList = Array.isArray(data)
          ? data
          : Array.isArray(data?.jobs)
            ? data.jobs
            : [];

        setJobs(jobList);

        if (jobList.length > 0) {
          setSelectedJobId((currentId) => {
            const existingJob = jobList.find(
              (job) => job.id === currentId
            );

            return existingJob
              ? existingJob.id
              : jobList[0].id;
          });
        } else {
          setSelectedJobId(null);
        }
      } catch (error) {
        console.error(
          "Failed to load company jobs:",
          error?.response?.data || error
        );

        setJobs([]);
        setSelectedJobId(null);

        setJobsError(
          error?.response?.data?.message ||
            "Failed to load jobs."
        );
      } finally {
        setJobsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  /*
   * Fetch company profile
   */
  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const profile = await getCompanyProfile();

        setCompanyProfile(profile);
      } catch (error) {
        console.error(
          "Failed to load company profile:",
          error?.response?.data || error
        );
      }
    };

    fetchCompanyProfile();
  }, []);

  /*
   * Get selected job
   */
  const selectedJob = jobs.find(
    (job) => job.id === selectedJobId
  );

  /*
   * Fetch applications for selected job
   */
  useEffect(() => {
    if (!selectedJobId) {
      setApplications([]);
      return;
    }

    const fetchApplications = async () => {
      try {
        setApplicationsLoading(true);
        setApplicationsError("");

        const data = await getJobApplications(
          selectedJobId
        );

        const applicationList = Array.isArray(data)
          ? data
          : Array.isArray(data?.applications)
            ? data.applications
            : [];

        setApplications(applicationList);
      } catch (error) {
        console.error(
          "Failed to load applications:",
          error?.response?.data || error
        );

        setApplications([]);

        setApplicationsError(
          error?.response?.data?.message ||
            "Failed to load applications."
        );
      } finally {
        setApplicationsLoading(false);
      }
    };

    fetchApplications();
  }, [selectedJobId]);

  /*
   * KPI calculations
   */
  const totalApplications = applications.length;

  const applied = applications.filter(
    (application) =>
      application.status === "APPLIED"
  ).length;

  const shortlisted = applications.filter(
    (application) =>
      application.status === "SHORTLISTED" ||
      application.status === "SELECTED"
  ).length;

  const finalInterview = applications.filter(
    (application) =>
      application.status === "FINAL_INTERVIEW"
  ).length;

  const hired = applications.filter(
    (application) =>
      application.status === "HIRED"
  ).length;

  /*
   * Candidate search and status filter
   */
  const filteredApplications = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

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

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  /*
   * Pagination calculation
   *
   * Only the first 8 candidates are displayed.
   * Page switching is intentionally not implemented yet.
   */
  const totalPages = Math.ceil(
    filteredApplications.length / ITEMS_PER_PAGE
  );

  const displayedApplications =
    filteredApplications.slice(0, ITEMS_PER_PAGE);

  /*
   * Select job
   */
  const handleSelectJob = (jobId) => {
    if (jobId === selectedJobId) {
      return;
    }

    setSelectedJobId(jobId);

    // Clear candidate filters when changing job
    setSearch("");
    setStatusFilter("ALL");

    setApplications([]);
    setApplicationsError("");
  };

  return (
    <CompanyDashboardLayout
      title="Applications"
      subtitle="Review and manage candidates who applied to your jobs."
      companyProfile={companyProfile}
    >
      <div className="flex h-full min-h-0 flex-col">

        {/* Application Workspace */}
        <ApplicationLayout
          left={
            <ApplicationJobList
              jobs={jobs}
              selectedJobId={selectedJobId}
              onSelectJob={handleSelectJob}
              loading={jobsLoading}
              error={jobsError}
              search={jobSearch}
              onSearchChange={setJobSearch}
              statusFilter={jobStatusFilter}
              onStatusFilterChange={
                setJobStatusFilter
              }
            />
          }
          right={
            selectedJob ? (
              <div className="min-h-0 flex-1 overflow-y-auto">
                <div className="space-y-5 p-4 sm:p-5 lg:p-6">

                  {/* Job Header */}
                  <div className="overflow-hidden rounded-xl border border-border bg-background">
                    <ApplicationJobHeader
                      job={selectedJob}
                      totalApplications={
                        totalApplications
                      }
                    />
                  </div>

                  {/* KPI Cards */}
                  <ApplicationKpiCards
                    totalApplications={
                      totalApplications
                    }
                    applied={applied}
                    shortlisted={shortlisted}
                    finalInterview={
                      finalInterview
                    }
                    hired={hired}
                  />

                  {/* Candidate Search + Filter */}
                  <div className="rounded-xl border border-border bg-background p-4 sm:p-5">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_220px]">

                      <ApplicationSearch
                        value={search}
                        onChange={setSearch}
                        placeholder="Search candidates..."
                      />

                      <ApplicationFilters
                        value={statusFilter}
                        onChange={setStatusFilter}
                      />

                    </div>

                    {/* Result Count */}
                    {!applicationsLoading &&
                      !applicationsError &&
                      applications.length > 0 && (
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">

                          <p className="text-sm text-text-secondary">
                            Showing{" "}
                            <span className="font-semibold text-text">
                              {
                                displayedApplications.length
                              }
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-text">
                              {
                                filteredApplications.length
                              }
                            </span>{" "}
                            candidates
                          </p>

                          {(search ||
                            statusFilter !==
                              "ALL") && (
                            <button
                              type="button"
                              onClick={() => {
                                setSearch("");
                                setStatusFilter(
                                  "ALL"
                                );
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
                  <div className="overflow-hidden rounded-xl border border-border bg-background">
                    <ApplicationCandidates
                      applications={
                        displayedApplications
                      }
                      loading={applicationsLoading}
                      error={applicationsError}
                      jobId={selectedJobId}
                    />
                  </div>

                  {/* Pagination */}
                  {!applicationsLoading &&
  !applicationsError &&
  filteredApplications.length > 0 && (
                      <div className="flex items-center justify-center gap-2">

                        {/* Previous */}
                        <button
                          type="button"
                          disabled
                          className="
                            inline-flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-border
                            bg-background
                            text-text-secondary
                            opacity-50
                            cursor-not-allowed
                          "
                          aria-label="Previous page"
                        >
                          <ChevronLeft
                            size={16}
                          />
                        </button>

                        {/* Page Numbers */}
                        <div className="flex items-center gap-1">

                          {Array.from(
                            { length: totalPages },
                            (_, index) => {
                              const pageNumber =
                                index + 1;

                              return (
                                <button
                                  key={pageNumber}
                                  type="button"
                                  disabled
                                  className={`
                                    inline-flex
                                    h-9
                                    min-w-9
                                    items-center
                                    justify-center
                                    rounded-lg
                                    border
                                    px-2.5
                                    text-sm
                                    font-medium
                                    cursor-not-allowed
                                    ${
                                      pageNumber === 1
                                        ? "border-primary bg-primary text-white"
                                        : "border-border bg-background text-text-secondary opacity-60"
                                    }
                                  `}
                                  aria-label={`Page ${pageNumber}`}
                                >
                                  {pageNumber}
                                </button>
                              );
                            }
                          )}

                        </div>

                        {/* Next */}
                        <button
                          type="button"
                          disabled
                          className="
                            inline-flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-border
                            bg-background
                            text-text-secondary
                            opacity-50
                            cursor-not-allowed
                          "
                          aria-label="Next page"
                        >
                          <ChevronRight
                            size={16}
                          />
                        </button>

                      </div>
                    )}

                </div>
              </div>
            ) : (
              /* Empty State */
              <div className="flex min-h-0 flex-1 items-center justify-center p-6">
                <div className="max-w-sm text-center">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <BriefcaseBusiness size={25} />
                  </div>

                  <h2 className="mt-4 text-lg font-semibold text-text sm:text-xl">
                    Select a job
                  </h2>

                  <p className="mt-1.5 text-sm leading-6 text-text-secondary">
                    Select a job from the list to view
                    its applications and candidate
                    details.
                  </p>

                </div>
              </div>
            )
          }
        />

      </div>
    </CompanyDashboardLayout>
  );
}

export default CompanyApplications;