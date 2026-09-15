import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  FileEdit,
  CircleAlert,
  Plus,
  ArrowRight,
} from "lucide-react";

import { getCompanyDashboard } from "../../services/company/dashboardService";
import { getCompanyJobs } from "../../services/company/jobService";
import { getCompanyProfile } from "../../services/company/companyService";

import CompanyDashboardLayout from "../../components/company/dashboard/CompanyDashboardLayout";
import DashboardStatsCards from "../../components/company/dashboard/DashboardStatsCards";
import RecentApplicationsTable from "../../components/company/dashboard/RecentApplicationsTable";
import JobStatusBadge from "../../components/company/jobs/JobStatusBadge";
import JobFormModal from "../../components/company/jobs/JobFormModal";
import CompanyWelcomeBanner from "../../components/company/dashboard/CompanyWelcomeBanner";

function formatEmploymentType(type) {
  const labels = {
    FULL_TIME: "Full Time",
    PART_TIME: "Part Time",
    CONTRACT: "Contract",
    INTERNSHIP: "Internship",
    FREELANCE: "Freelance",
  };

  return labels[type] || type || "-";
}


function formatCreatedDate(dateValue) {
  if (!dateValue) {
    return "-";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}


function CompanyDashboard() {
  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [companyProfile, setCompanyProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);


  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [dashboardStats, jobs, profile] = await Promise.all([
        getCompanyDashboard(),
        getCompanyJobs(),
        getCompanyProfile(),
      ]);

      setStats(dashboardStats);
      setCompanyProfile(profile);

      const jobsList = Array.isArray(jobs)
        ? jobs
        : jobs?.jobs || [];

      const sortedJobs = [...jobsList].sort(
        (a, b) =>
          new Date(b.created_at) - new Date(a.created_at)
      );

      setRecentJobs(sortedJobs.slice(0, 5));
    } catch (fetchError) {
      const data = fetchError.response?.data;

      const message =
        data?.message ||
        data?.detail ||
        "Unable to load your dashboard right now.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchDashboardData();
  }, []);


  const handleCreateJob = () => {
    setEditingJob(null);
    setIsFormModalOpen(true);
  };


  const handleEditJob = (job) => {
    setEditingJob(job);
    setIsFormModalOpen(true);
  };


  const handleCloseModal = () => {
    setIsFormModalOpen(false);
    setEditingJob(null);
  };


  const handleFormSuccess = () => {
    setIsFormModalOpen(false);
    setEditingJob(null);
    fetchDashboardData();
  };


  return (
    <CompanyDashboardLayout companyProfile={companyProfile}>

      <div className="space-y-6">

        {/* Page Heading */}
        <section>
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5">
            <span className="text-sm font-medium text-primary">
              Company Dashboard
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Dashboard
          </h1>

          <p className="mt-1.5 text-base text-text-secondary">
            Manage your jobs, candidates, and recruitment activities
            from one place.
          </p>
        </section>


        {/* Welcome Banner */}
<CompanyWelcomeBanner profile={companyProfile} />


        {/* KPI Cards */}
        <section>
          <DashboardStatsCards
            stats={stats?.stats}
            loading={loading}
          />
        </section>


        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-6 text-center">

            <p className="text-sm font-medium text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchDashboardData}
              className="mt-4 rounded-xl border border-red-300 bg-white px-5 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100"
            >
              Retry
            </button>

          </div>
        )}


        {!error && (
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">

            {/* ===================================================== */}
            {/* LEFT COLUMN */}
            {/* ===================================================== */}

            <div className="min-w-0 space-y-6">


              {/* Recent Jobs */}
              <div className="overflow-hidden rounded-2xl border border-border bg-surface">

                <div className="flex flex-col gap-4 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                  <div className="min-w-0">

                    <div className="flex items-center gap-3">

                      <h2 className="text-lg font-semibold text-text">
                        Recent Jobs
                      </h2>

                      <span className="inline-flex shrink-0 items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                        Latest
                      </span>

                    </div>

                    <p className="mt-1 text-sm text-text-secondary">
                      View and manage your latest job postings.
                    </p>

                  </div>


                  <div className="flex shrink-0 gap-2">

                    {/* <button
                      type="button"
                      onClick={handleCreateJob}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
                    >
                      <Plus size={17} />
                      Create Job
                    </button> */}


                    <button
                      type="button"
                      onClick={() =>
                        (window.location.href = "/company/jobs")
                      }
                      className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text transition hover:bg-background"
                    >
                      View All
                      <ArrowRight size={16} />
                    </button>

                  </div>

                </div>


                {loading ? (

                  <div className="space-y-2 p-4">

                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="h-11 animate-pulse rounded-lg bg-background"
                      />
                    ))}

                  </div>

                ) : recentJobs.length === 0 ? (

                  <div className="flex flex-col items-center justify-center px-6 py-12 text-center">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <BriefcaseBusiness size={24} />
                    </div>

                    <h3 className="mt-4 text-base font-semibold text-text">
                      No jobs posted yet
                    </h3>

                    <p className="mt-1 max-w-sm text-sm text-text-secondary">
                      Create your first job posting to start finding
                      candidates.
                    </p>

                  </div>

                ) : (

                  <div className="overflow-x-auto">

                    <table className="w-full table-fixed">

                      <thead className="border-b border-border bg-background">

                        <tr>

                          <th className="w-[27%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                            Job Title
                          </th>

                          <th className="w-[17%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                            Location
                          </th>

                          <th className="w-[15%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                            Type
                          </th>

                          <th className="w-[15%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                            Status
                          </th>

                          <th className="w-[16%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                            Created
                          </th>

                          

                        </tr>

                      </thead>


                      <tbody className="divide-y divide-border">

                        {recentJobs.map((job) => (

                          <tr
                            key={job.id}
                            className="transition-colors hover:bg-background/60"
                          >

                            <td className="px-4 py-3">
                              <p className="truncate text-sm font-medium text-text">
                                {job.title}
                              </p>
                            </td>


                            <td className="px-4 py-3 text-sm text-text-secondary">
                              <p className="truncate">
                                {job.location || "-"}
                              </p>
                            </td>


                            <td className="px-4 py-3 text-sm text-text-secondary">
                              {formatEmploymentType(
                                job.employment_type
                              )}
                            </td>


                            <td className="px-4 py-3">
                              <JobStatusBadge status={job.status} />
                            </td>


                            <td className="whitespace-nowrap px-4 py-3 text-sm text-text-secondary">
                              {formatCreatedDate(job.created_at)}
                            </td>



                          </tr>

                        ))}

                      </tbody>

                    </table>

                  </div>

                )}

              </div>


              {/* Jobs Requiring Attention */}
              <div className="overflow-hidden rounded-2xl border border-amber-200 bg-surface">

                <div className="flex items-center justify-between border-b border-border px-5 py-4">

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                      <CircleAlert size={19} />
                    </div>

                    <div className="min-w-0">

                      <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
                        Needs Attention
                      </p>

                      <h2 className="mt-0.5 truncate text-base font-semibold text-text">
                        Jobs Requiring Attention
                      </h2>

                    </div>

                  </div>


                  <span className="shrink-0 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-600">
                    {stats?.attention_jobs?.length ?? 0} Jobs
                  </span>

                </div>


                {loading ? (

                  <div className="space-y-2 p-4">

                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="h-11 animate-pulse rounded-lg bg-background"
                      />
                    ))}

                  </div>

                ) : stats?.attention_jobs?.length === 0 ? (

                  <div className="flex flex-col items-center justify-center px-6 py-10 text-center">

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                      <CircleAlert size={22} />
                    </div>

                    <h3 className="mt-3 text-sm font-semibold text-text">
                      No jobs require attention
                    </h3>

                    <p className="mt-1 text-xs text-text-secondary">
                      All your job postings are up to date.
                    </p>

                  </div>

                ) : (

                  <div className="divide-y divide-border">

                    {stats.attention_jobs.map((job) => (

                      <div
                        key={job.id}
                        className="flex items-center gap-3 px-4 py-3"
                      >

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                          <CircleAlert size={15} />
                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="truncate text-sm font-semibold text-text">
                            {job.title}
                          </p>

                          <p className="mt-0.5 truncate text-xs text-text-secondary">
                            {job.reason}
                          </p>

                        </div>

                        <JobStatusBadge status={job.status} />

                      </div>

                    ))}

                  </div>

                )}

              </div>

            </div>


            {/* ===================================================== */}
            {/* RIGHT COLUMN */}
            {/* ===================================================== */}

            <div className="min-w-0 space-y-6">


              {/* Recent Applications */}
              <div className="overflow-hidden rounded-2xl border border-border bg-surface">

                <div className="flex items-center justify-between border-b border-border px-5 py-4">

                  <div className="min-w-0">

                    <div className="flex items-center gap-3">

                      <h2 className="text-lg font-semibold text-text">
                        Recent Applications
                      </h2>

                      <span className="inline-flex shrink-0 items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                        Latest
                      </span>

                    </div>

                    <p className="mt-1 truncate text-sm text-text-secondary">
                      Latest candidates who applied to your jobs.
                    </p>

                  </div>


                  <button
                    type="button"
                    className="hidden shrink-0 items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-medium text-text transition hover:bg-background sm:inline-flex"
                  >
                    View All
                    <ArrowRight size={15} />
                  </button>

                </div>


                <RecentApplicationsTable
                  applications={stats?.recent_applications ?? []}
                  loading={loading}
                />

              </div>


              {/* Recent Activity */}
              <div className="overflow-hidden rounded-2xl border border-border bg-surface">

                <div className="flex items-center justify-between border-b border-border px-5 py-4">

                  <div>

                    <h2 className="text-lg font-semibold text-text">
                      Recent Activity
                    </h2>

                    <p className="mt-1 text-sm text-text-secondary">
                      Latest activity on your company account.
                    </p>

                  </div>


                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Live
                  </span>

                </div>


                {loading ? (

                  <div className="space-y-2 p-4">

                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        className="h-11 animate-pulse rounded-lg bg-background"
                      />
                    ))}

                  </div>

                ) : stats?.recent_activity?.length === 0 ? (

                  <div className="flex flex-col items-center justify-center px-6 py-10 text-center">

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background text-text-secondary">
                      <BriefcaseBusiness size={22} />
                    </div>

                    <h3 className="mt-3 text-sm font-semibold text-text">
                      No recent activity
                    </h3>

                    <p className="mt-1 text-xs text-text-secondary">
                      Your recent job activities will appear here.
                    </p>

                  </div>

                ) : (

                  <div className="divide-y divide-border">

                    {stats.recent_activity
                      .slice(0, 4)
                      .map((activity) => {

                        const activityConfig = {
                          PUBLISHED: {
                            title: "Job published",
                            description:
                              "A job posting has been published.",
                            icon: BriefcaseBusiness,
                            wrapper:
                              "bg-emerald-50 text-emerald-600",
                          },

                          DRAFT: {
                            title: "Job created",
                            description:
                              "A new job has been created as draft.",
                            icon: FileEdit,
                            wrapper:
                              "bg-amber-50 text-amber-600",
                          },

                          CLOSED: {
                            title: "Job closed",
                            description:
                              "A job posting has been closed.",
                            icon: CircleAlert,
                            wrapper:
                              "bg-rose-50 text-rose-600",
                          },
                        };


                        const config =
                          activityConfig[activity.status] || {
                            title: "Job updated",
                            description:
                              "A job posting has been updated.",
                            icon: FileEdit,
                            wrapper:
                              "bg-blue-50 text-blue-600",
                          };


                        const ActivityIcon = config.icon;


                        return (
                          <div
                            key={activity.id}
                            className="flex items-center gap-3 px-4 py-3"
                          >

                            <div
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.wrapper}`}
                            >
                              <ActivityIcon size={15} />
                            </div>


                            <div className="min-w-0 flex-1">

                              <p className="truncate text-sm font-semibold text-text">
                                {config.title}
                              </p>

                              <p className="truncate text-xs text-text-secondary">
                                {activity.title
                                  ? `${activity.title} — ${config.description}`
                                  : config.description}
                              </p>

                            </div>


                            <span className="whitespace-nowrap text-xs text-text-secondary">
                              {formatCreatedDate(
                                activity.updated_at
                              )}
                            </span>

                          </div>
                        );
                      })}

                  </div>

                )}

              </div>

            </div>

          </section>
        )}

      </div>


      {/* Job Modal */}
      <JobFormModal
        open={isFormModalOpen}
        job={editingJob}
        onClose={handleCloseModal}
        onSuccess={handleFormSuccess}
      />

    </CompanyDashboardLayout>
  );
}

export default CompanyDashboard;