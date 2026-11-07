import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    ArrowLeft,
    BriefcaseBusiness,
    CalendarDays,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock3,
    MapPin,
    RefreshCw,
    UserRound,
    Users,
    XCircle,
} from "lucide-react";

import DashboardSidebar from "../../components/admin/dashboard/DashboardSidebar";
import DashboardNavbar from "../../components/admin/dashboard/DashboardNavbar";

import { getCompanyJobDetails } from "../../services/admin/adminService";

/* =========================================================
   CONSTANTS
========================================================= */

const ITEMS_PER_PAGE = 8;

/* =========================================================
   HELPERS
========================================================= */

const formatDate = (value) => {
    if (!value) {
        return "Not specified";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Not specified";
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const formatValue = (value) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "Not specified";
    }

    return String(value)
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

/* =========================================================
   APPLICATION STATUS
========================================================= */

const getApplicationStatusClass = (status) => {
    switch (status) {
        case "SELECTED":
        case "HIRED":
            return "border-emerald-200 bg-emerald-50 text-emerald-700";

        case "SHORTLISTED":
            return "border-blue-200 bg-blue-50 text-blue-700";

        case "REJECTED":
            return "border-rose-200 bg-rose-50 text-rose-700";

        case "AI_INTERVIEW":
            return "border-violet-200 bg-violet-50 text-violet-700";

        case "RESUME_SCREENING":
            return "border-amber-200 bg-amber-50 text-amber-700";

        case "APPLIED":
            return "border-slate-200 bg-slate-50 text-slate-700";

        default:
            return "border-slate-200 bg-slate-50 text-slate-600";
    }
};

/* =========================================================
   INTERVIEW STATUS
========================================================= */

const getInterviewStatusClass = (status) => {
    switch (status) {
        case "COMPLETED":
            return "border-emerald-200 bg-emerald-50 text-emerald-700";

        case "SCHEDULED":
            return "border-blue-200 bg-blue-50 text-blue-700";

        case "MISSED":
            return "border-rose-200 bg-rose-50 text-rose-700";

        case "IN_PROGRESS":
            return "border-violet-200 bg-violet-50 text-violet-700";

        default:
            return "border-slate-200 bg-slate-50 text-slate-600";
    }
};

/* =========================================================
   KPI CARD
========================================================= */

const KpiCard = ({
    title,
    value,
    description,
    icon: Icon,
    cardClass,
    iconClass,
    valueClass,
}) => {
    return (
        <div
            className={`min-w-0 rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${cardClass}`}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {title}
                    </p>

                    <p
                        className={`mt-2 text-3xl font-bold leading-none tracking-tight ${valueClass}`}
                    >
                        {value}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                        {description}
                    </p>
                </div>

                <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
                >
                    <Icon size={21} />
                </div>
            </div>
        </div>
    );
};

/* =========================================================
   PAGINATION
========================================================= */

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const hasPagination = totalPages > 1;

    const goToPrevious = () => {
        if (!hasPagination) {
            return;
        }

        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const goToNext = () => {
        if (!hasPagination) {
            return;
        }

        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="flex flex-col gap-4 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Result Information */}

            <p className="text-sm text-slate-500">
                Page{" "}
                <span className="font-semibold text-slate-700">
                    {currentPage}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700">
                    {totalPages}
                </span>
            </p>

            {/* Pagination Controls */}

            <div className="flex items-center gap-2">
                {/* Previous */}

                <button
                    type="button"
                    onClick={goToPrevious}
                    disabled={
                        !hasPagination ||
                        currentPage === 1
                    }
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <ChevronLeft size={16} />
                   
                </button>

                {/* Page Numbers */}

                <div className="flex items-center gap-1">
                    {Array.from(
                        { length: totalPages },
                        (_, index) => index + 1
                    ).map((page) => (
                        <button
                            key={page}
                            type="button"
                            onClick={() => {
                                if (hasPagination) {
                                    onPageChange(page);
                                }
                            }}
                            disabled={!hasPagination}
                            className={`h-9 min-w-9 rounded-lg px-2 text-sm font-semibold transition ${
                                currentPage === page
                                    ? "bg-[#234b78] text-white"
                                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            } disabled:cursor-not-allowed disabled:opacity-40`}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                {/* Next */}

                <button
                    type="button"
                    onClick={goToNext}
                    disabled={
                        !hasPagination ||
                        currentPage === totalPages
                    }
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

function AdminJobDetails() {
    const navigate = useNavigate();

    const { companyId, jobId } = useParams();

    const [job, setJob] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [refreshing, setRefreshing] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);

    /* =====================================================
       FETCH JOB DETAILS
    ===================================================== */

    const fetchJobDetails = async () => {
        try {
            setError("");

            const data = await getCompanyJobDetails(
                companyId,
                jobId
            );

            console.log(
                "ADMIN JOB DETAILS:",
                data
            );

            setJob(data);

            // Always start from first page after fresh fetch
            setCurrentPage(1);
        } catch (err) {
            console.error(
                "Failed to fetch admin job details:",
                err?.response?.data || err
            );

            setError(
                err?.response?.data?.detail ||
                    err?.response?.data?.message ||
                    "Failed to load job details."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchJobDetails();
    }, [companyId, jobId]);

    /* =====================================================
       REFRESH
    ===================================================== */

    const handleRefresh = () => {
        setRefreshing(true);
        fetchJobDetails();
    };

    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8f9fc]">
                <DashboardSidebar />

                <main className="min-h-screen md:ml-72">
                    <div className="fixed left-0 right-0 top-0 z-50 md:left-72">
                        <DashboardNavbar />
                    </div>

                    <div className="flex min-h-screen items-center justify-center px-6 pt-20">
                        <div className="flex flex-col items-center gap-3">
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-[#234b78]" />

                            <p className="text-sm text-slate-500">
                                Loading job details...
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    /* =====================================================
       ERROR
    ===================================================== */

    if (error || !job) {
        return (
            <div className="min-h-screen bg-[#f8f9fc]">
                <DashboardSidebar />

                <main className="min-h-screen md:ml-72">
                    <div className="fixed left-0 right-0 top-0 z-50 md:left-72">
                        <DashboardNavbar />
                    </div>

                    <div className="flex min-h-screen items-center justify-center px-6 pt-20">
                        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50">
                                <XCircle
                                    size={24}
                                    className="text-rose-500"
                                />
                            </div>

                            <h2 className="mt-4 text-lg font-semibold text-slate-900">
                                Unable to load job
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                {error ||
                                    "Job details not found."}
                            </p>

                            <div className="mt-6 flex justify-center gap-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(-1)
                                    }
                                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                >
                                    <ArrowLeft size={16} />
                                    Back
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleRefresh
                                    }
                                    className="inline-flex items-center gap-2 rounded-lg bg-[#234b78] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1d4168]"
                                >
                                    <RefreshCw size={16} />
                                    Retry
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    /* =====================================================
       DATA
    ===================================================== */

    const applicants = Array.isArray(
        job.applicants
    )
        ? job.applicants
        : [];

    const totalApplications =
        Number(job.application_count) ||
        applicants.length;

    /* =====================================================
       KPI COUNTS
       IMPORTANT:
       These use ALL applicants, not current page.
    ===================================================== */

    const shortlistedCount = applicants.filter(
        (applicant) =>
            applicant?.status ===
            "SHORTLISTED"
    ).length;

    const completedInterviews =
        applicants.filter(
            (applicant) =>
                applicant?.ai_interview
                    ?.status === "COMPLETED"
        ).length;

    const selectedCount = applicants.filter(
        (applicant) =>
            applicant?.status === "SELECTED" ||
            applicant?.status === "HIRED"
    ).length;

    const rejectedCount = applicants.filter(
        (applicant) =>
            applicant?.status === "REJECTED"
    ).length;

    /* =====================================================
       PAGINATION DATA
    ===================================================== */

    const totalPages = Math.max(
        1,
        Math.ceil(
            applicants.length /
                ITEMS_PER_PAGE
        )
    );

    /*
     * If applicants are:
     *
     * 1 - 8     => page 1
     * 9 - 16    => page 2
     * 17 - 24   => page 3
     */

    const startIndex =
        (currentPage - 1) *
        ITEMS_PER_PAGE;

    const endIndex =
        startIndex + ITEMS_PER_PAGE;

    const paginatedApplicants =
        applicants.slice(
            startIndex,
            endIndex
        );

    /* =====================================================
       UI
    ===================================================== */

    return (
        <div className="min-h-screen bg-[#f8f9fc]">
            {/* =================================================
                SIDEBAR
            ================================================= */}

            <DashboardSidebar />

            {/* =================================================
                MAIN AREA
            ================================================= */}

            <main className="min-h-screen md:ml-72">
                {/* =================================================
                    NAVBAR
                ================================================= */}

                <div className="fixed left-0 right-0 top-0 z-50 md:left-72">
                    <DashboardNavbar />
                </div>

                {/* =================================================
                    SCROLLABLE CONTENT
                ================================================= */}

                <div className="min-h-screen overflow-y-auto pt-20">
                    <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">

                        {/* =================================================
                            TOP BAR
                        ================================================= */}

                        <div className="mb-6 flex items-center justify-between gap-4">
                            <button
                                type="button"
                                onClick={() =>
                                    navigate(-1)
                                }
                                className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-[#234b78]"
                            >
                                <ArrowLeft
                                    size={18}
                                />

                                Back to Company
                            </button>

                            <button
                                type="button"
                                onClick={
                                    handleRefresh
                                }
                                disabled={
                                    refreshing
                                }
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <RefreshCw
                                    size={16}
                                    className={
                                        refreshing
                                            ? "animate-spin"
                                            : ""
                                    }
                                />

                                Refresh
                            </button>
                        </div>

                        {/* =================================================
                            JOB HEADER
                        ================================================= */}

                        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="px-6 py-7 sm:px-8">
                                <div className="flex flex-col gap-5">
                                    <div className="flex items-start gap-4">

                                        {/* Job Icon */}

                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#234b78]">
                                            <BriefcaseBusiness
                                                size={27}
                                            />
                                        </div>

                                        {/* Job Information */}

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h1 className="break-words text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                                    {
                                                        job.title
                                                    }
                                                </h1>

                                                <span
                                                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${getApplicationStatusClass(
                                                        job.status
                                                    )}`}
                                                >
                                                    {formatValue(
                                                        job.status
                                                    )}
                                                </span>
                                            </div>

                                            <p className="mt-2 text-sm font-medium text-slate-500">
                                                {job.company_name ||
                                                    "Company"}
                                            </p>

                                            {/* Job Meta */}

                                            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <MapPin
                                                        size={16}
                                                    />

                                                    {formatValue(
                                                        job.location
                                                    )}
                                                </span>

                                                <span className="inline-flex items-center gap-1.5">
                                                    <BriefcaseBusiness
                                                        size={16}
                                                    />

                                                    {formatValue(
                                                        job.employment_type
                                                    )}
                                                </span>

                                                <span className="inline-flex items-center gap-1.5">
                                                    <CalendarDays
                                                        size={16}
                                                    />

                                                    Deadline:{" "}
                                                    {formatDate(
                                                        job.application_deadline
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* =================================================
                            KPI CARDS
                        ================================================= */}

                        <section className="mt-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

                                <KpiCard
                                    title="Applications"
                                    value={
                                        totalApplications
                                    }
                                    description="Total candidates"
                                    icon={Users}
                                    cardClass="border-blue-200 bg-blue-50/70"
                                    iconClass="bg-blue-100 text-blue-600"
                                    valueClass="text-blue-700"
                                />

                                <KpiCard
                                    title="Shortlisted"
                                    value={
                                        shortlistedCount
                                    }
                                    description="Candidates shortlisted"
                                    icon={
                                        CheckCircle2
                                    }
                                    cardClass="border-amber-200 bg-amber-50/70"
                                    iconClass="bg-amber-100 text-amber-600"
                                    valueClass="text-amber-700"
                                />

                                <KpiCard
                                    title="Interviews Completed"
                                    value={
                                        completedInterviews
                                    }
                                    description="AI interviews completed"
                                    icon={Clock3}
                                    cardClass="border-violet-200 bg-violet-50/70"
                                    iconClass="bg-violet-100 text-violet-600"
                                    valueClass="text-violet-700"
                                />

                                <KpiCard
                                    title="Selected"
                                    value={
                                        selectedCount
                                    }
                                    description="Selected / hired"
                                    icon={
                                        CheckCircle2
                                    }
                                    cardClass="border-emerald-200 bg-emerald-50/70"
                                    iconClass="bg-emerald-100 text-emerald-600"
                                    valueClass="text-emerald-700"
                                />

                                <KpiCard
                                    title="Rejected"
                                    value={
                                        rejectedCount
                                    }
                                    description="Rejected candidates"
                                    icon={XCircle}
                                    cardClass="border-rose-200 bg-rose-50/70"
                                    iconClass="bg-rose-100 text-rose-600"
                                    valueClass="text-rose-700"
                                />
                            </div>
                        </section>

                        {/* =================================================
                            APPLICANTS
                        ================================================= */}

                        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                            {/* Header */}

                            <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">
                                        Applicants
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Candidates who applied
                                        for this job
                                    </p>
                                </div>

                                <div className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                                    {totalApplications}{" "}
                                    {totalApplications ===
                                    1
                                        ? "Candidate"
                                        : "Candidates"}
                                </div>
                            </div>

                            {/* Candidate List */}

                            {applicants.length ===
                            0 ? (
                                <div className="flex min-h-[220px] flex-col items-center justify-center px-6 text-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                        <UserRound
                                            size={22}
                                        />
                                    </div>

                                    <h3 className="mt-4 text-sm font-semibold text-slate-900">
                                        No applicants yet
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500">
                                        No candidates have
                                        applied for this
                                        job.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Desktop Header */}

                                    <div className="hidden border-b border-slate-100 bg-slate-50/70 px-6 py-3 md:grid md:grid-cols-[minmax(240px,1.8fr)_minmax(120px,0.8fr)_minmax(150px,0.9fr)_minmax(150px,0.9fr)] md:gap-4">
                                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                            Candidate
                                        </p>

                                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                            Applied
                                        </p>

                                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                            Application
                                        </p>

                                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                            AI Interview
                                        </p>
                                    </div>

                                    {/* =================================================
                                        PAGINATED APPLICANTS
                                    ================================================= */}

                                    <div className="divide-y divide-slate-100">
                                        {paginatedApplicants.map(
                                            (
                                                applicant,
                                                index
                                            ) => {
                                                const candidateName =
                                                    applicant?.candidate_name ||
                                                    "Candidate";

                                                const initials =
                                                    applicant?.candidate_initials ||
                                                    candidateName
                                                        .split(
                                                            " "
                                                        )
                                                        .map(
                                                            (
                                                                part
                                                            ) =>
                                                                part?.[0] ||
                                                                ""
                                                        )
                                                        .join(
                                                            ""
                                                        )
                                                        .slice(
                                                            0,
                                                            2
                                                        )
                                                        .toUpperCase();

                                                const interviewStatus =
                                                    applicant
                                                        ?.ai_interview
                                                        ?.status;

                                                return (
                                                    <div
                                                        key={
                                                            applicant?.id ??
                                                            index
                                                        }
                                                        className="px-6 py-4 transition hover:bg-slate-50"
                                                    >
                                                        {/* =================================================
                                                            DESKTOP
                                                        ================================================= */}

                                                        <div className="hidden md:grid md:grid-cols-[minmax(240px,1.8fr)_minmax(120px,0.8fr)_minmax(150px,0.9fr)_minmax(150px,0.9fr)] md:items-center md:gap-4">

                                                            {/* Candidate */}

                                                            <div className="flex min-w-0 items-center gap-3">
                                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#234b78] text-sm font-bold text-white">
                                                                    {
                                                                        initials
                                                                    }
                                                                </div>

                                                                <div className="min-w-0">
                                                                    <p className="truncate text-sm font-semibold text-slate-900">
                                                                        {
                                                                            candidateName
                                                                        }
                                                                    </p>

                                                                    <p className="mt-0.5 text-xs text-slate-500">
                                                                        Application #
                                                                        {
                                                                            applicant?.id
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* Applied */}

                                                            <div>
                                                                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                                                    Applied
                                                                </p>

                                                                <p className="mt-1 text-sm font-medium text-slate-700">
                                                                    {formatDate(
                                                                        applicant?.applied_at
                                                                    )}
                                                                </p>
                                                            </div>

                                                            {/* Application */}

                                                            <div>
                                                                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                                                    Application
                                                                </p>

                                                                <span
                                                                    className={`mt-1 inline-flex max-w-full rounded-full border px-2.5 py-1 text-xs font-semibold ${getApplicationStatusClass(
                                                                        applicant?.status
                                                                    )}`}
                                                                >
                                                                    {formatValue(
                                                                        applicant?.status
                                                                    )}
                                                                </span>
                                                            </div>

                                                            {/* AI Interview */}

                                                            <div>
                                                                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                                                    AI Interview
                                                                </p>

                                                                {interviewStatus ? (
                                                                    <span
                                                                        className={`mt-1 inline-flex max-w-full rounded-full border px-2.5 py-1 text-xs font-semibold ${getInterviewStatusClass(
                                                                            interviewStatus
                                                                        )}`}
                                                                    >
                                                                        {formatValue(
                                                                            interviewStatus
                                                                        )}
                                                                    </span>
                                                                ) : (
                                                                    <span className="mt-1 inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
                                                                        Not
                                                                        started
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* =================================================
                                                            MOBILE
                                                        ================================================= */}

                                                        <div className="flex flex-col gap-4 md:hidden">

                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#234b78] text-sm font-bold text-white">
                                                                    {
                                                                        initials
                                                                    }
                                                                </div>

                                                                <div className="min-w-0">
                                                                    <p className="truncate text-sm font-semibold text-slate-900">
                                                                        {
                                                                            candidateName
                                                                        }
                                                                    </p>

                                                                    <p className="mt-0.5 text-xs text-slate-500">
                                                                        Application #
                                                                        {
                                                                            applicant?.id
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-4">

                                                                <div>
                                                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                                                        Applied
                                                                    </p>

                                                                    <p className="mt-1 text-sm font-medium text-slate-700">
                                                                        {formatDate(
                                                                            applicant?.applied_at
                                                                        )}
                                                                    </p>
                                                                </div>

                                                                <div>
                                                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                                                        Application
                                                                    </p>

                                                                    <span
                                                                        className={`mt-1 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getApplicationStatusClass(
                                                                            applicant?.status
                                                                        )}`}
                                                                    >
                                                                        {formatValue(
                                                                            applicant?.status
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                                                    AI Interview
                                                                </p>

                                                                {interviewStatus ? (
                                                                    <span
                                                                        className={`mt-1 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getInterviewStatusClass(
                                                                            interviewStatus
                                                                        )}`}
                                                                    >
                                                                        {formatValue(
                                                                            interviewStatus
                                                                        )}
                                                                    </span>
                                                                ) : (
                                                                    <span className="mt-1 inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
                                                                        Not
                                                                        started
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>

                                    {/* =================================================
                                        PAGINATION
                                    ================================================= */}

                                    <Pagination
                                        currentPage={
                                            currentPage
                                        }
                                        totalPages={
                                            totalPages
                                        }
                                        onPageChange={
                                            setCurrentPage
                                        }
                                    />
                                </>
                            )}
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AdminJobDetails;