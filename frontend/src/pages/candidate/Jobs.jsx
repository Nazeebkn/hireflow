import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

import { getCandidateJobs } from "../../services/candidate/candidateJobService";

import CandidateDashboardSidebar from "../../components/candidate/dashboard/CandidateDashboardSidebar";
import CandidateJobSearchHeader from "../../components/candidate/jobs/CandidateJobSearchHeader";
import CandidateJobFilterDrawer from "../../components/candidate/jobs/CandidateJobFilterDrawer";
import CandidateJobList from "../../components/candidate/jobs/CandidateJobList";
import CandidateJobPreview from "../../components/candidate/jobs/CandidateJobPreview";


const Jobs = () => {
    const [jobs, setJobs] = useState([]);

    const [selectedJob, setSelectedJob] = useState(null);

    const [search, setSearch] = useState("");

    const [sort, setSort] = useState("newest");

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [showMobilePreview, setShowMobilePreview] = useState(false);

    const [filters, setFilters] = useState({
        location: "",
        work_mode: "",
        employment_type: "",
        min_salary: "",
        max_salary: "",
    });

    const [appliedFilters, setAppliedFilters] = useState({
        location: "",
        work_mode: "",
        employment_type: "",
        min_salary: "",
        max_salary: "",
    });

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // Fetch jobs
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                setError("");

                const params = {
                    search: search || undefined,
                    location:
                        appliedFilters.location || undefined,
                    work_mode:
                        appliedFilters.work_mode || undefined,
                    employment_type:
                        appliedFilters.employment_type || undefined,
                    min_salary:
                        appliedFilters.min_salary || undefined,
                    max_salary:
                        appliedFilters.max_salary || undefined,
                    sort,
                };

                const data = await getCandidateJobs(params);

                setJobs(data);

                if (data.length > 0) {
                    setSelectedJob((currentJob) => {
                        const existingJob = data.find(
                            (job) => job.id === currentJob?.id
                        );

                        return existingJob || data[0];
                    });
                } else {
                    setSelectedJob(null);
                }
            } catch (error) {
                setError("Failed to load jobs.");
                setJobs([]);
                setSelectedJob(null);
            } finally {
                setLoading(false);
            }
        };


        // Search debounce
        const timer = setTimeout(() => {
            fetchJobs();
        }, 300);


        return () => clearTimeout(timer);
    }, [search, sort, appliedFilters]);


    // Select job
    const handleSelectJob = (job) => {
        setSelectedJob(job);
        setShowMobilePreview(true);
    };


    // Apply filters
    const handleApplyFilters = () => {
        setAppliedFilters(filters);
        setIsFilterOpen(false);
    };


    // Clear filters
    const handleClearFilters = () => {
        const emptyFilters = {
            location: "",
            work_mode: "",
            employment_type: "",
            min_salary: "",
            max_salary: "",
        };

        setFilters(emptyFilters);
        setAppliedFilters(emptyFilters);
        setIsFilterOpen(false);
    };


    // Retry
    const handleRetry = () => {
        setError("");

        setAppliedFilters({
            ...appliedFilters,
        });
    };


    return (
        <div className="flex h-screen overflow-hidden bg-background">

            {/* Desktop Sidebar */}
            <div className="hidden shrink-0 lg:flex">
                <CandidateDashboardSidebar />
            </div>


            {/* Main Content */}
            <main className="flex min-w-0 flex-1 flex-col overflow-hidden">

                {/* Page Heading */}
                <div className="shrink-0 border-b border-border bg-background px-4 py-4 sm:px-6 sm:py-5">
                    <h1 className="text-lg font-bold text-text sm:text-xl">
                        Job Search
                    </h1>

                    <p className="mt-1 text-xs text-text-secondary sm:text-sm">
                        Find your next career opportunity
                    </p>
                </div>


                {/* Desktop Workspace */}
                <div className="hidden min-h-0 flex-1 lg:grid lg:grid-cols-[minmax(360px,0.7fr)_minmax(0,1.3fr)]">

                    {/* Job List */}
                    <section className="flex min-h-0 min-w-0 flex-col border-r border-border">

                        {/* Search Header */}
                        <div className="shrink-0 border-b border-border bg-background px-4 py-3">
                            <CandidateJobSearchHeader
                                search={search}
                                setSearch={setSearch}
                                onFilterClick={() =>
                                    setIsFilterOpen(true)
                                }
                                sort={sort}
                                setSort={setSort}
                                jobsCount={jobs.length}
                            />
                        </div>


                        {/* Error */}
                        {error && (
                            <div className="mx-4 mt-4 shrink-0 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-xs text-red-600">
                                        {error}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={handleRetry}
                                        className="text-xs font-semibold text-red-700 underline"
                                    >
                                        Retry
                                    </button>
                                </div>
                            </div>
                        )}


                        {/* Job List */}
                        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                            {loading ? (
                                <div className="flex min-h-[250px] items-center justify-center">
                                    <p className="text-xs text-text-secondary">
                                        Loading jobs...
                                    </p>
                                </div>
                            ) : (
                                <CandidateJobList
                                    jobs={jobs}
                                    selectedJob={selectedJob}
                                    onSelectJob={handleSelectJob}
                                />
                            )}
                        </div>

                    </section>


                    {/* Job Preview */}
                    <section className="flex min-h-0 min-w-0">
                        <div className="min-h-0 flex-1 overflow-hidden p-3 sm:p-4">
                            <CandidateJobPreview
                                job={selectedJob}
                            />
                        </div>
                    </section>

                </div>


                {/* Mobile / Tablet */}
                <div className="flex min-h-0 flex-1 flex-col lg:hidden">

                    {!showMobilePreview ? (
                        <>
                            {/* Search Header */}
                            <div className="shrink-0 border-b border-border bg-background px-4 py-3 sm:px-6">
                                <CandidateJobSearchHeader
                                    search={search}
                                    setSearch={setSearch}
                                    onFilterClick={() =>
                                        setIsFilterOpen(true)
                                    }
                                    sort={sort}
                                    setSort={setSort}
                                    jobsCount={jobs.length}
                                />
                            </div>


                            {/* Error */}
                            {error && (
                                <div className="mx-4 mt-4 shrink-0 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-xs text-red-600">
                                            {error}
                                        </p>

                                        <button
                                            type="button"
                                            onClick={handleRetry}
                                            className="text-xs font-semibold text-red-700 underline"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                </div>
                            )}


                            {/* Mobile Job List */}
                            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
                                {loading ? (
                                    <div className="flex min-h-[250px] items-center justify-center">
                                        <p className="text-xs text-text-secondary">
                                            Loading jobs...
                                        </p>
                                    </div>
                                ) : (
                                    <CandidateJobList
                                        jobs={jobs}
                                        selectedJob={selectedJob}
                                        onSelectJob={handleSelectJob}
                                    />
                                )}
                            </div>
                        </>
                    ) : (

                        /* Mobile Preview */
                        <div className="flex min-h-0 flex-1 flex-col">

                            {/* Back Button */}
                            <div className="shrink-0 border-b border-border bg-background px-4 py-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowMobilePreview(false)
                                    }
                                    className="flex items-center gap-2 text-sm font-semibold text-primary"
                                >
                                    <ArrowLeft size={17} />
                                    Back to Jobs
                                </button>
                            </div>


                            {/* Preview */}
                            <div className="min-h-0 flex-1 overflow-y-auto p-4">
                                <CandidateJobPreview
                                    job={selectedJob}
                                />
                            </div>

                        </div>
                    )}

                </div>

            </main>


            {/* Filter Drawer */}
            <CandidateJobFilterDrawer
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filters={filters}
                setFilters={setFilters}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
            />

        </div>
    );
};


export default Jobs;