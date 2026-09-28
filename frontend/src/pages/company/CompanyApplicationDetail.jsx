import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    ArrowLeft,
    Bell,
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    Check,
    CheckCircle2,
    Circle,
    Clock3,
    Download,
    FileText,
    HelpCircle,
    Lightbulb,
    MapPin,
    UserRound,
} from "lucide-react";

import CompanyDashboardLayout from "../../components/company/dashboard/CompanyDashboardLayout";

import {
    getCompanyApplicationById,
    getCompanyResumeScreeningReport,
} from "../../services/company/jobApplicationService";

import { getCompanyProfile } from "../../services/company/companyService";


const CompanyApplicationDetail = () => {
    const { applicationId } = useParams();
    const navigate = useNavigate();

    const [application, setApplication] = useState(null);
    const [companyProfile, setCompanyProfile] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [activeTab, setActiveTab] = useState("overview");

    const [resumeReport, setResumeReport] = useState(null);
    const [resumeReportLoading, setResumeReportLoading] =
        useState(false);
    const [resumeReportError, setResumeReportError] =
        useState("");


    // =========================================================
    // STATUS LABELS
    // =========================================================

    const statusLabels = {
        APPLIED: "Applied",
        RESUME_SCREENING: "AI Resume Screening",
        SHORTLISTED: "Shortlisted",
        AI_INTERVIEW: "AI Interview",
        SELECTED: "Selected",
        FINAL_INTERVIEW: "Final Interview",
        HIRED: "Hired",
        REJECTED: "Rejected",
    };


    // =========================================================
    // NORMAL PIPELINE
    // =========================================================

    const pipelineStages = [
        {
            key: "APPLIED",
            label: "Applied",
        },
        {
            key: "RESUME_SCREENING",
            label: "AI Resume",
        },
        {
            key: "SHORTLISTED",
            label: "Shortlisted",
        },
        {
            key: "AI_INTERVIEW",
            label: "AI Interview",
        },
        {
            key: "SELECTED",
            label: "Selected",
        },
        {
            key: "FINAL_INTERVIEW",
            label: "Final Interview",
        },
        {
            key: "HIRED",
            label: "Hired",
        },
    ];


    // =========================================================
    // DISPLAY PIPELINE
    // =========================================================

    const displayPipelineStages = useMemo(() => {
        if (application?.status === "REJECTED") {
            return [
                {
                    key: "APPLIED",
                    label: "Applied",
                },
                {
                    key: "RESUME_SCREENING",
                    label: "AI Resume",
                },
                {
                    key: "REJECTED",
                    label: "Rejected",
                },
            ];
        }

        return pipelineStages;
    }, [application]);


    // =========================================================
    // TABS
    // =========================================================

    const tabs = [
        {
            key: "overview",
            label: "Overview",
            available: true,
        },
        {
            key: "resume",
            label: "AI Resume Report",
            available: true,
        },
        {
            key: "interview",
            label: "AI Interview Report",
            available: false,
        },
        {
            key: "activity",
            label: "Activity",
            available: true,
        },
    ];


    // =========================================================
    // FETCH APPLICATION
    // =========================================================

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                setLoading(true);
                setError("");

                const data =
                    await getCompanyApplicationById(
                        applicationId
                    );

                setApplication(data);
            } catch (error) {
                console.error(
                    "Failed to fetch company application:",
                    error?.response?.data || error
                );

                setError(
                    error?.response?.data?.detail ||
                        error?.response?.data?.message ||
                        "Failed to load application details."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchApplication();
    }, [applicationId]);


    // =========================================================
    // FETCH COMPANY PROFILE
    // =========================================================

    useEffect(() => {
        const fetchCompanyProfile = async () => {
            try {
                const profile =
                    await getCompanyProfile();

                setCompanyProfile(profile);
            } catch (error) {
                console.error(
                    "Failed to fetch company profile:",
                    error?.response?.data || error
                );
            }
        };

        fetchCompanyProfile();
    }, []);


    // =========================================================
    // FETCH RESUME REPORT
    // =========================================================

    const fetchResumeReport = async () => {
        try {
            setResumeReportLoading(true);
            setResumeReportError("");

            const data =
                await getCompanyResumeScreeningReport(
                    applicationId
                );

            setResumeReport(data.screening);
        } catch (error) {
            console.error(
                "Failed to fetch resume screening report:",
                error?.response?.data || error
            );

            if (error?.response?.status === 404) {
                setResumeReportError(
                    "Resume screening report is not available yet."
                );
            } else {
                setResumeReportError(
                    error?.response?.data?.detail ||
                        error?.response?.data?.message ||
                        "Failed to load resume screening report."
                );
            }
        } finally {
            setResumeReportLoading(false);
        }
    };


    // =========================================================
    // FORMAT DATE
    // =========================================================

    const formatDate = (date) => {
        if (!date) {
            return "Not available";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Not available";
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };


    // =========================================================
    // FORMAT DATE + TIME
    // =========================================================

    const formatDateTime = (date) => {
        if (!date) {
            return "Not available";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Not available";
        }

        return parsedDate.toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };


    // =========================================================
    // FORMAT VALUE
    // =========================================================

    const formatValue = (value) => {
        if (!value) {
            return "Not specified";
        }

        return value
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (char) =>
                char.toUpperCase()
            );
    };


    // =========================================================
    // CANDIDATE
    // =========================================================

    const candidateName =
        application?.candidate_name ||
        "Candidate";

    const candidateInitials =
        application?.candidate_initials ||
        candidateName
            .split(" ")
            .map((name) => name[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();


    // =========================================================
    // REJECTED
    // =========================================================

    const isRejected =
        application?.status === "REJECTED";


    // =========================================================
    // CURRENT STAGE INDEX
    // =========================================================

    const currentStageIndex = useMemo(() => {
        if (!application) {
            return 0;
        }

        const index =
            displayPipelineStages.findIndex(
                (stage) =>
                    stage.key === application.status
            );

        return index === -1 ? 0 : index;
    }, [
        application,
        displayPipelineStages,
    ]);


    // =========================================================
    // OVERALL PROGRESS
    // =========================================================

    const overallProgress = useMemo(() => {
        if (!application) {
            return 0;
        }

        if (displayPipelineStages.length <= 1) {
            return 100;
        }

        return Math.round(
            (currentStageIndex /
                (displayPipelineStages.length - 1)) *
                100
        );
    }, [
        application,
        currentStageIndex,
        displayPipelineStages,
    ]);


    // =========================================================
    // CURRENT STAGE
    // =========================================================

    const currentStage = useMemo(() => {
        if (!application) {
            return null;
        }

        return (
            displayPipelineStages[
                currentStageIndex
            ] ||
            displayPipelineStages[0]
        );
    }, [
        application,
        currentStageIndex,
        displayPipelineStages,
    ]);


    // =========================================================
    // STAGE DESCRIPTION
    // =========================================================

    const getStageDescription = (status) => {
        const descriptions = {
            APPLIED:
                "The candidate has submitted an application for this position.",

            RESUME_SCREENING:
                "The candidate's resume is being evaluated against the job requirements.",

            SHORTLISTED:
                "The candidate passed AI resume screening and is shortlisted for the AI interview.",

            AI_INTERVIEW:
                "The candidate has progressed to the AI interview stage.",

            SELECTED:
                "The candidate has been selected for the next recruitment stage.",

            FINAL_INTERVIEW:
                "The candidate has progressed to the final interview stage.",

            HIRED:
                "The candidate has successfully completed the recruitment process.",

            REJECTED:
                "This candidate did not progress further in the recruitment process.",
        };

        return (
            descriptions[status] ||
            "This application is currently being processed."
        );
    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <CompanyDashboardLayout
                title="Application Details"
                subtitle="Review candidate application details."
                companyProfile={companyProfile}
            >
                <div className="flex min-h-[calc(100vh-120px)] items-center justify-center">

                    <div className="text-center">

                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />

                        <p className="mt-4 text-sm font-medium text-text">
                            Loading application...
                        </p>

                    </div>

                </div>
            </CompanyDashboardLayout>
        );
    }


    // =========================================================
    // ERROR
    // =========================================================

    if (error || !application) {
        return (
            <CompanyDashboardLayout
                title="Application Details"
                subtitle="Review candidate application details."
                companyProfile={companyProfile}
            >
                <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-4">

                    <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 text-center shadow-sm">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-background">

                            <BriefcaseBusiness
                                size={24}
                                className="text-text-secondary"
                            />

                        </div>

                        <h2 className="mt-4 text-lg font-bold text-text">
                            {error ||
                                "Application not found."}
                        </h2>

                        <p className="mt-2 text-sm text-text-secondary">
                            We couldn't load the requested application.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/company/applications"
                                )
                            }
                            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                        >
                            <ArrowLeft size={16} />
                            Back to Applications
                        </button>

                    </div>

                </div>
            </CompanyDashboardLayout>
        );
    }


    return (
        <CompanyDashboardLayout
            title="Application Details"
            subtitle="Review and evaluate this candidate application."
            companyProfile={companyProfile}
        >

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">


                {/* =====================================================
                    TOP BAR
                ===================================================== */}

                <header className="flex shrink-0 items-center justify-between border-b border-border bg-surface px-4 py-3 sm:px-6 lg:px-8">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/company/applications"
                            )
                        }
                        className="group inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition hover:text-primary"
                    >
                        <ArrowLeft
                            size={18}
                            className="transition group-hover:-translate-x-0.5"
                        />

                        Back to Applications
                    </button>


                    <div className="flex items-center gap-2">

                        <span className="hidden rounded-md bg-background px-2.5 py-1.5 font-mono text-[11px] font-medium text-text-secondary sm:block">
                            APP-{application.id}
                        </span>

                        <button
                            type="button"
                            className="rounded-lg p-2 text-text-secondary transition hover:bg-background hover:text-text"
                        >
                            <Bell size={17} />
                        </button>

                        <button
                            type="button"
                            className="rounded-lg p-2 text-text-secondary transition hover:bg-background hover:text-text"
                        >
                            <HelpCircle size={17} />
                        </button>

                    </div>

                </header>


                {/* =====================================================
                    WORKSPACE
                ===================================================== */}

                <div className="min-h-0 flex-1 overflow-y-auto bg-background">

                    <div className="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:p-8">


                        {/* =================================================
                            CANDIDATE HEADER
                        ================================================= */}

                        <section className="rounded-2xl border border-border bg-surface shadow-sm">

                            <div className="p-5 sm:p-6">

                                <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

                                    <div className="flex min-w-0 items-start gap-4">

                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-base font-bold text-primary sm:h-16 sm:w-16 sm:text-lg">
                                            {candidateInitials}
                                        </div>


                                        <div className="min-w-0">

                                            <div className="flex flex-wrap items-center gap-2.5">

                                                <h1 className="text-xl font-bold tracking-tight text-text sm:text-2xl">
                                                    {candidateName}
                                                </h1>

                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                                                        isRejected
                                                            ? "bg-red-50 text-red-600"
                                                            : "bg-primary/10 text-primary"
                                                    }`}
                                                >
                                                    {statusLabels[
                                                        application.status
                                                    ] ||
                                                        application.status}
                                                </span>

                                            </div>


                                            <p className="mt-1 text-sm font-medium text-text-secondary">
                                                {application.job_title ||
                                                    "Job Title"}
                                            </p>


                                            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-text-secondary">

                                                <span className="inline-flex items-center gap-1.5">
                                                    <Building2 size={14} />
                                                    {application.company_name ||
                                                        "Company"}
                                                </span>

                                                <span className="inline-flex items-center gap-1.5">
                                                    <MapPin size={14} />
                                                    {application.job_location ||
                                                        "Location not specified"}
                                                </span>

                                                <span className="inline-flex items-center gap-1.5">
                                                    <BriefcaseBusiness size={14} />
                                                    {formatValue(
                                                        application.employment_type
                                                    )}
                                                </span>

                                                <span className="inline-flex items-center gap-1.5">
                                                    <CalendarDays size={14} />
                                                    Applied{" "}
                                                    {formatDate(
                                                        application.applied_at
                                                    )}
                                                </span>

                                            </div>

                                        </div>

                                    </div>


                                    <div className="flex shrink-0 flex-wrap gap-2">

                                        {application.submitted_resume && (
                                            <a
                                                href={
                                                    application.submitted_resume
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-semibold text-text transition hover:border-primary hover:text-primary"
                                            >
                                                <FileText size={15} />
                                                View Resume
                                            </a>
                                        )}

                                    </div>

                                </div>

                            </div>


                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border bg-background px-5 py-3 text-[11px] text-text-secondary sm:px-6">

                                <span>
                                    Application ID:
                                    <span className="ml-1 font-mono font-semibold text-text">
                                        #{application.id}
                                    </span>
                                </span>

                                <span>
                                    Work Mode:
                                    <span className="ml-1 font-semibold text-text">
                                        {formatValue(
                                            application.work_mode
                                        )}
                                    </span>
                                </span>

                                <span>
                                    Last Updated:
                                    <span className="ml-1 font-semibold text-text">
                                        {formatDateTime(
                                            application.updated_at
                                        )}
                                    </span>
                                </span>

                            </div>

                        </section>


                        {/* =================================================
                            PIPELINE
                        ================================================= */}

                        <section className="mt-6 rounded-2xl border border-border bg-surface shadow-sm">

                            <div className="border-b border-border px-5 py-4 sm:px-6">

                                <div className="flex items-center justify-between gap-4">

                                    <div>
                                        <h2 className="text-sm font-bold text-text">
                                            Recruitment Pipeline
                                        </h2>

                                        <p className="mt-1 text-xs text-text-secondary">
                                            Current progress of this application.
                                        </p>
                                    </div>

                                    <span
                                        className={`text-xs font-bold ${
                                            isRejected
                                                ? "text-red-600"
                                                : "text-primary"
                                        }`}
                                    >
                                        {isRejected
                                            ? "Closed"
                                            : `${overallProgress}% complete`}
                                    </span>

                                </div>

                            </div>


                            <div className="overflow-x-auto p-5 sm:p-6">

                                <div
                                    className={`relative ${
                                        isRejected
                                            ? "min-w-[500px]"
                                            : "min-w-[720px]"
                                    }`}
                                >

                                    {/* Base Line */}

                                    <div className="absolute left-6 right-6 top-5 h-px bg-border" />


                                    {/* Progress Line */}

                                    <div
                                        className={`absolute left-6 top-5 h-px transition-all ${
                                            isRejected
                                                ? "bg-red-500"
                                                : "bg-primary"
                                        }`}
                                        style={{
                                            width:
                                                displayPipelineStages.length <=
                                                1
                                                    ? "0%"
                                                    : `calc(${overallProgress}% - 0px)`,
                                            maxWidth:
                                                "calc(100% - 48px)",
                                        }}
                                    />


                                    {/* Stages */}

                                    <div className="relative z-10 flex justify-between">

                                        {displayPipelineStages.map(
                                            (stage, index) => {

                                                const completed =
                                                    index <
                                                    currentStageIndex;

                                                const current =
                                                    index ===
                                                    currentStageIndex;

                                                const rejectedStage =
                                                    stage.key ===
                                                    "REJECTED";

                                                return (
                                                    <div
                                                        key={
                                                            stage.key
                                                        }
                                                        className="flex w-24 flex-col items-center text-center"
                                                    >

                                                        {/* Stage Circle */}

                                                        <div
                                                            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                                                                rejectedStage &&
                                                                current
                                                                    ? "border-red-500 bg-red-500 text-white"
                                                                    : completed ||
                                                                      current
                                                                    ? "border-primary bg-primary text-white"
                                                                    : "border-border bg-surface text-text-secondary"
                                                            } ${
                                                                current
                                                                    ? rejectedStage
                                                                        ? "ring-4 ring-red-500/10"
                                                                        : "ring-4 ring-primary/10"
                                                                    : ""
                                                            }`}
                                                        >

                                                            {completed ? (
                                                                <Check
                                                                    size={
                                                                        17
                                                                    }
                                                                    strokeWidth={
                                                                        2.5
                                                                    }
                                                                />
                                                            ) : current ? (
                                                                <Circle
                                                                    size={
                                                                        11
                                                                    }
                                                                    className="fill-current"
                                                                />
                                                            ) : (
                                                                <Circle
                                                                    size={
                                                                        11
                                                                    }
                                                                />
                                                            )}

                                                        </div>


                                                        {/* Stage Label */}

                                                        <span
                                                            className={`mt-2 text-[10px] leading-4 ${
                                                                rejectedStage &&
                                                                current
                                                                    ? "font-bold text-red-600"
                                                                    : current
                                                                    ? "font-bold text-primary"
                                                                    : completed
                                                                    ? "font-semibold text-text"
                                                                    : "text-text-secondary"
                                                            }`}
                                                        >
                                                            {
                                                                stage.label
                                                            }
                                                        </span>

                                                    </div>
                                                );
                                            }
                                        )}

                                    </div>

                                </div>

                            </div>

                        </section>


                        {/* =================================================
                            MAIN GRID
                        ================================================= */}

                        <div className="mt-6 grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-12">


                            {/* =================================================
                                MAIN CONTENT
                            ================================================= */}

                            <main className="min-w-0 lg:col-span-9">


                                {/* TABS */}

                                <div className="rounded-2xl border border-border bg-surface shadow-sm">

                                    <div className="overflow-x-auto border-b border-border px-5 sm:px-6">

                                        <div className="flex min-w-max gap-7">

                                            {tabs.map(
                                                (tab) => (
                                                    <button
                                                        key={
                                                            tab.key
                                                        }
                                                        type="button"
                                                        disabled={
                                                            !tab.available
                                                        }
                                                        onClick={() => {

                                                            if (
                                                                !tab.available
                                                            ) {
                                                                return;
                                                            }

                                                            setActiveTab(
                                                                tab.key
                                                            );

                                                            if (
                                                                tab.key ===
                                                                    "resume" &&
                                                                !resumeReport &&
                                                                !resumeReportLoading
                                                            ) {
                                                                fetchResumeReport();
                                                            }
                                                        }}
                                                        className={`relative border-b-2 px-1 py-4 text-xs font-semibold transition ${
                                                            activeTab ===
                                                            tab.key
                                                                ? "border-primary text-primary"
                                                                : "border-transparent text-text-secondary"
                                                        } ${
                                                            tab.available
                                                                ? "hover:text-text"
                                                                : "cursor-not-allowed opacity-40"
                                                        }`}
                                                    >
                                                        {tab.label}

                                                        {!tab.available && (
                                                            <span className="ml-1.5 rounded bg-background px-1.5 py-0.5 text-[8px] uppercase tracking-wide">
                                                                Soon
                                                            </span>
                                                        )}

                                                    </button>
                                                )
                                            )}

                                        </div>

                                    </div>


                                    {/* =================================================
                                        TAB CONTENT
                                    ================================================= */}

                                    <div className="p-5 sm:p-6">


                                        {/* =========================================
                                            OVERVIEW
                                        ========================================= */}

                                        {activeTab ===
                                            "overview" && (
                                            <div className="space-y-6">


                                                {/* Current stage */}

                                                <section className="rounded-xl border border-border bg-background p-5">

                                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                                        <div className="flex items-start gap-3">

                                                            <div
                                                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                                                                    isRejected
                                                                        ? "bg-red-50 text-red-600"
                                                                        : "bg-primary/10 text-primary"
                                                                }`}
                                                            >

                                                                {isRejected ? (
                                                                    <Circle
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <CheckCircle2
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                )}

                                                            </div>


                                                            <div>

                                                                <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                                                                    Current Stage
                                                                </p>

                                                                <h2 className="mt-1 text-base font-bold text-text">

                                                                    {isRejected
                                                                        ? "Application Rejected"
                                                                        : currentStage?.label}

                                                                </h2>

                                                                <p className="mt-1 text-xs leading-5 text-text-secondary">
                                                                    {getStageDescription(
                                                                        application.status
                                                                    )}
                                                                </p>

                                                            </div>

                                                        </div>


                                                        <div className="min-w-[150px]">

                                                            <div className="mb-1.5 flex items-center justify-between">

                                                                <span className="text-[10px] font-medium text-text-secondary">
                                                                    Progress
                                                                </span>

                                                                <span
                                                                    className={`text-xs font-bold ${
                                                                        isRejected
                                                                            ? "text-red-600"
                                                                            : "text-primary"
                                                                    }`}
                                                                >
                                                                    {
                                                                        overallProgress
                                                                    }
                                                                    %
                                                                </span>

                                                            </div>


                                                            <div className="h-1.5 overflow-hidden rounded-full bg-border">

                                                                <div
                                                                    className={`h-full rounded-full ${
                                                                        isRejected
                                                                            ? "bg-red-500"
                                                                            : "bg-primary"
                                                                    }`}
                                                                    style={{
                                                                        width: `${overallProgress}%`,
                                                                    }}
                                                                />

                                                            </div>

                                                        </div>

                                                    </div>

                                                </section>


                                                {/* Information cards */}

                                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">


                                                    {/* Application */}

                                                    <section className="rounded-xl border border-border bg-surface">

                                                        <div className="border-b border-border px-5 py-4">

                                                            <div className="flex items-center gap-2">

                                                                <FileText
                                                                    size={17}
                                                                    className="text-primary"
                                                                />

                                                                <h2 className="text-sm font-bold text-text">
                                                                    Application Details
                                                                </h2>

                                                            </div>

                                                        </div>


                                                        <div className="divide-y divide-border">

                                                            <div className="flex items-center justify-between gap-4 px-5 py-3.5">

                                                                <span className="text-xs text-text-secondary">
                                                                    Application ID
                                                                </span>

                                                                <span className="font-mono text-xs font-semibold text-text">
                                                                    #{application.id}
                                                                </span>

                                                            </div>


                                                            <div className="flex items-center justify-between gap-4 px-5 py-3.5">

                                                                <span className="text-xs text-text-secondary">
                                                                    Position
                                                                </span>

                                                                <span className="max-w-[55%] text-right text-xs font-semibold text-text">
                                                                    {application.job_title ||
                                                                        "Not available"}
                                                                </span>

                                                            </div>


                                                            <div className="flex items-center justify-between gap-4 px-5 py-3.5">

                                                                <span className="text-xs text-text-secondary">
                                                                    Employment
                                                                </span>

                                                                <span className="text-xs font-semibold text-text">
                                                                    {formatValue(
                                                                        application.employment_type
                                                                    )}
                                                                </span>

                                                            </div>


                                                            <div className="flex items-center justify-between gap-4 px-5 py-3.5">

                                                                <span className="text-xs text-text-secondary">
                                                                    Work Mode
                                                                </span>

                                                                <span className="text-xs font-semibold text-text">
                                                                    {formatValue(
                                                                        application.work_mode
                                                                    )}
                                                                </span>

                                                            </div>

                                                        </div>

                                                    </section>


                                                    {/* Candidate */}

                                                    <section className="rounded-xl border border-border bg-surface">

                                                        <div className="border-b border-border px-5 py-4">

                                                            <div className="flex items-center gap-2">

                                                                <UserRound
                                                                    size={17}
                                                                    className="text-primary"
                                                                />

                                                                <h2 className="text-sm font-bold text-text">
                                                                    Candidate
                                                                </h2>

                                                            </div>

                                                        </div>


                                                        <div className="divide-y divide-border">

                                                            <div className="flex items-center justify-between gap-4 px-5 py-3.5">

                                                                <span className="text-xs text-text-secondary">
                                                                    Name
                                                                </span>

                                                                <span className="text-right text-xs font-semibold text-text">
                                                                    {candidateName}
                                                                </span>

                                                            </div>


                                                            <div className="flex items-center justify-between gap-4 px-5 py-3.5">

                                                                <span className="text-xs text-text-secondary">
                                                                    Location
                                                                </span>

                                                                <span className="text-right text-xs font-semibold text-text">
                                                                    {application.job_location ||
                                                                        "Not specified"}
                                                                </span>

                                                            </div>


                                                            <div className="flex items-center justify-between gap-4 px-5 py-3.5">

                                                                <span className="text-xs text-text-secondary">
                                                                    Applied On
                                                                </span>

                                                                <span className="text-xs font-semibold text-text">
                                                                    {formatDate(
                                                                        application.applied_at
                                                                    )}
                                                                </span>

                                                            </div>


                                                            <div className="flex items-center justify-between gap-4 px-5 py-3.5">

                                                                <span className="text-xs text-text-secondary">
                                                                    Status
                                                                </span>

                                                                <span
                                                                    className={`text-xs font-bold ${
                                                                        isRejected
                                                                            ? "text-red-600"
                                                                            : "text-primary"
                                                                    }`}
                                                                >
                                                                    {statusLabels[
                                                                        application.status
                                                                    ] ||
                                                                        application.status}
                                                                </span>

                                                            </div>

                                                        </div>

                                                    </section>

                                                </div>


                                                {/* Resume */}

                                                <section className="rounded-xl border border-border bg-surface">

                                                    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">

                                                        <div className="flex items-center gap-3">

                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">

                                                                <FileText
                                                                    size={
                                                                        19
                                                                    }
                                                                />

                                                            </div>


                                                            <div>

                                                                <h2 className="text-sm font-bold text-text">
                                                                    Submitted Resume
                                                                </h2>

                                                                <p className="mt-1 text-xs text-text-secondary">
                                                                    Resume submitted with this application.
                                                                </p>

                                                            </div>

                                                        </div>


                                                        {application.submitted_resume ? (
                                                            <a
                                                                href={
                                                                    application.submitted_resume
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-semibold text-text transition hover:border-primary hover:text-primary"
                                                            >
                                                                <Download
                                                                    size={
                                                                        15
                                                                    }
                                                                />

                                                                Open Resume
                                                            </a>
                                                        ) : (
                                                            <span className="text-xs text-text-secondary">
                                                                Resume not available
                                                            </span>
                                                        )}

                                                    </div>

                                                </section>

                                            </div>
                                        )}


                                        {/* =========================================
                                            AI RESUME REPORT
                                        ========================================= */}

                                        {activeTab ===
                                            "resume" && (
                                            <div className="space-y-5">


                                                {resumeReportLoading && (
                                                    <div className="flex min-h-[350px] items-center justify-center">

                                                        <div className="text-center">

                                                            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />

                                                            <p className="mt-4 text-sm font-semibold text-text">
                                                                Loading AI Resume Report
                                                            </p>

                                                            <p className="mt-1 text-xs text-text-secondary">
                                                                Fetching the screening results...
                                                            </p>

                                                        </div>

                                                    </div>
                                                )}


                                                {!resumeReportLoading &&
                                                    resumeReportError && (
                                                        <div className="rounded-xl border border-border bg-background p-10 text-center">

                                                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">

                                                                <FileText
                                                                    size={
                                                                        23
                                                                    }
                                                                />

                                                            </div>

                                                            <h2 className="mt-4 text-base font-bold text-text">
                                                                Resume Screening Report
                                                            </h2>

                                                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">
                                                                {
                                                                    resumeReportError
                                                                }
                                                            </p>

                                                        </div>
                                                    )}


                                                {!resumeReportLoading &&
                                                    !resumeReportError &&
                                                    resumeReport && (
                                                        <>


                                                            {/* Report title */}

                                                            <section className="rounded-xl border border-border bg-background p-5">

                                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                                                    <div>

                                                                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
                                                                            AI Resume Screening
                                                                        </p>

                                                                        <h2 className="mt-1 text-lg font-bold text-text">
                                                                            Resume Evaluation
                                                                        </h2>

                                                                        <p className="mt-1 text-xs text-text-secondary">
                                                                            AI-generated evaluation against the job requirements.
                                                                        </p>

                                                                    </div>


                                                                    <span
                                                                        className={`inline-flex w-fit rounded-full px-3 py-1.5 text-[10px] font-bold ${
                                                                            resumeReport.recommendation ===
                                                                            "SHORTLISTED"
                                                                                ? "bg-primary/10 text-primary"
                                                                                : "bg-red-50 text-red-600"
                                                                        }`}
                                                                    >
                                                                        {formatValue(
                                                                            resumeReport.recommendation
                                                                        )}
                                                                    </span>

                                                                </div>

                                                            </section>


                                                            {/* Score */}

                                                            <section className="rounded-xl border border-border bg-surface p-5">

                                                                <div className="flex flex-col gap-5 md:flex-row md:items-center">

                                                                    <div className="shrink-0">

                                                                        <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                                                                            Overall Match
                                                                        </p>

                                                                        <div className="mt-1 flex items-baseline gap-1">

                                                                            <span className="text-4xl font-black tracking-tight text-primary">
                                                                                {
                                                                                    resumeReport.overall_score
                                                                                }
                                                                            </span>

                                                                            <span className="text-sm font-medium text-text-secondary">
                                                                                /100
                                                                            </span>

                                                                        </div>

                                                                    </div>


                                                                    <div className="h-px bg-border md:h-12 md:w-px" />


                                                                    <div className="flex-1">

                                                                        <div className="mb-2 flex items-center justify-between">

                                                                            <span className="text-xs font-semibold text-text">
                                                                                Resume Match
                                                                            </span>

                                                                            <span className="text-xs font-bold text-primary">
                                                                                {
                                                                                    resumeReport.overall_score
                                                                                }
                                                                                %
                                                                            </span>

                                                                        </div>


                                                                        <div className="h-2 overflow-hidden rounded-full bg-border">

                                                                            <div
                                                                                className="h-full rounded-full bg-primary"
                                                                                style={{
                                                                                    width: `${Math.min(
                                                                                        Math.max(
                                                                                            resumeReport.overall_score ||
                                                                                                0,
                                                                                            0
                                                                                        ),
                                                                                        100
                                                                                    )}%`,
                                                                                }}
                                                                            />

                                                                        </div>

                                                                    </div>

                                                                </div>

                                                            </section>


                                                            {/* Breakdown */}

                                                            <section className="rounded-xl border border-border bg-surface p-5">

                                                                <div className="mb-5">

                                                                    <h2 className="text-sm font-bold text-text">
                                                                        Score Breakdown
                                                                    </h2>

                                                                    <p className="mt-1 text-xs text-text-secondary">
                                                                        Match across the key evaluation criteria.
                                                                    </p>

                                                                </div>


                                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                                                                    {[
                                                                        {
                                                                            label: "Skills Match",
                                                                            value: resumeReport.skills_score,
                                                                        },
                                                                        {
                                                                            label: "Experience Match",
                                                                            value: resumeReport.experience_score,
                                                                        },
                                                                        {
                                                                            label: "Education Match",
                                                                            value: resumeReport.education_score,
                                                                        },
                                                                    ].map(
                                                                        (
                                                                            item
                                                                        ) => (

                                                                            <div
                                                                                key={
                                                                                    item.label
                                                                                }
                                                                                className="rounded-lg border border-border bg-background p-4"
                                                                            >

                                                                                <div className="flex items-center justify-between">

                                                                                    <span className="text-xs font-semibold text-text">
                                                                                        {
                                                                                            item.label
                                                                                        }
                                                                                    </span>

                                                                                    <span className="text-xs font-bold text-primary">
                                                                                        {
                                                                                            item.value
                                                                                        }
                                                                                        %
                                                                                    </span>

                                                                                </div>


                                                                                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border">

                                                                                    <div
                                                                                        className="h-full rounded-full bg-primary"
                                                                                        style={{
                                                                                            width: `${Math.min(
                                                                                                Math.max(
                                                                                                    item.value ||
                                                                                                        0,
                                                                                                    0
                                                                                                ),
                                                                                                100
                                                                                            )}%`,
                                                                                        }}
                                                                                    />

                                                                                </div>

                                                                            </div>

                                                                        )
                                                                    )}

                                                                </div>

                                                            </section>


                                                            {/* Summary */}

                                                            <section className="rounded-xl border border-border bg-surface p-5">

                                                                <div className="flex items-center gap-2">

                                                                    <FileText
                                                                        size={
                                                                            17
                                                                        }
                                                                        className="text-primary"
                                                                    />

                                                                    <h2 className="text-sm font-bold text-text">
                                                                        AI Summary
                                                                    </h2>

                                                                </div>

                                                                <p className="mt-4 text-sm leading-7 text-text-secondary">
                                                                    {
                                                                        resumeReport.summary
                                                                    }
                                                                </p>

                                                            </section>


                                                            {/* Strengths / Gaps */}

                                                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                                                                <section className="rounded-xl border border-border bg-surface p-5">

                                                                    <h2 className="text-sm font-bold text-text">
                                                                        Strengths
                                                                    </h2>

                                                                    {resumeReport.strengths?.length ? (
                                                                        <ul className="mt-4 space-y-3">

                                                                            {resumeReport.strengths.map(
                                                                                (
                                                                                    strength,
                                                                                    index
                                                                                ) => (
                                                                                    <li
                                                                                        key={
                                                                                            index
                                                                                        }
                                                                                        className="flex gap-3 text-sm leading-5 text-text-secondary"
                                                                                    >

                                                                                        <CheckCircle2
                                                                                            size={
                                                                                                16
                                                                                            }
                                                                                            className="mt-0.5 shrink-0 text-primary"
                                                                                        />

                                                                                        <span>
                                                                                            {
                                                                                                strength
                                                                                            }
                                                                                        </span>

                                                                                    </li>
                                                                                )
                                                                            )}

                                                                        </ul>
                                                                    ) : (
                                                                        <p className="mt-3 text-xs text-text-secondary">
                                                                            No strengths were identified.
                                                                        </p>
                                                                    )}

                                                                </section>


                                                                <section className="rounded-xl border border-border bg-surface p-5">

                                                                    <h2 className="text-sm font-bold text-text">
                                                                        Gaps
                                                                    </h2>

                                                                    {resumeReport.gaps?.length ? (
                                                                        <ul className="mt-4 space-y-3">

                                                                            {resumeReport.gaps.map(
                                                                                (
                                                                                    gap,
                                                                                    index
                                                                                ) => (
                                                                                    <li
                                                                                        key={
                                                                                            index
                                                                                        }
                                                                                        className="flex gap-3 text-sm leading-5 text-text-secondary"
                                                                                    >

                                                                                        <Circle
                                                                                            size={
                                                                                                15
                                                                                            }
                                                                                            className="mt-1 shrink-0 text-text-secondary"
                                                                                        />

                                                                                        <span>
                                                                                            {
                                                                                                gap
                                                                                            }
                                                                                        </span>

                                                                                    </li>
                                                                                )
                                                                            )}

                                                                        </ul>
                                                                    ) : (
                                                                        <p className="mt-3 text-xs text-text-secondary">
                                                                            No significant gaps were identified.
                                                                        </p>
                                                                    )}

                                                                </section>

                                                            </div>


                                                            <div className="flex items-center gap-2 text-[10px] text-text-secondary">

                                                                <Clock3
                                                                    size={
                                                                        13
                                                                    }
                                                                />

                                                                Report generated{" "}
                                                                {formatDateTime(
                                                                    resumeReport.created_at
                                                                )}

                                                            </div>

                                                        </>
                                                    )}

                                            </div>
                                        )}


                                        {/* =========================================
                                            ACTIVITY
                                        ========================================= */}

                                        {activeTab ===
                                            "activity" && (
                                            <section>

                                                <div className="mb-6">

                                                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
                                                        Application Activity
                                                    </p>

                                                    <h2 className="mt-1 text-lg font-bold text-text">
                                                        Activity History
                                                    </h2>

                                                    <p className="mt-1 text-xs text-text-secondary">
                                                        Timeline of activity related to this application.
                                                    </p>

                                                </div>


                                                <div className="relative">

                                                    <div className="absolute bottom-0 left-4 top-0 w-px bg-border" />


                                                    <div className="relative flex gap-4">

                                                        <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white ring-4 ring-surface">

                                                            <Check
                                                                size={
                                                                    15
                                                                }
                                                            />

                                                        </div>


                                                        <div className="pb-8">

                                                            <p className="text-sm font-semibold text-text">
                                                                Application Submitted
                                                            </p>

                                                            <p className="mt-1 text-xs text-text-secondary">
                                                                {formatDateTime(
                                                                    application.applied_at
                                                                )}
                                                            </p>

                                                        </div>

                                                    </div>


                                                    {application.updated_at &&
                                                        application.updated_at !==
                                                            application.applied_at && (
                                                            <div className="relative flex gap-4">

                                                                <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-text-secondary ring-4 ring-surface">

                                                                    <Circle
                                                                        size={
                                                                            10
                                                                        }
                                                                    />

                                                                </div>


                                                                <div>

                                                                    <p className="text-sm font-semibold text-text">
                                                                        Application Updated
                                                                    </p>

                                                                    <p className="mt-1 text-xs text-text-secondary">
                                                                        {formatDateTime(
                                                                            application.updated_at
                                                                        )}
                                                                    </p>

                                                                </div>

                                                            </div>
                                                        )}

                                                </div>

                                            </section>
                                        )}


                                        {/* =========================================
                                            INTERVIEW
                                        ========================================= */}

                                        {activeTab ===
                                            "interview" && (
                                            <div className="flex min-h-[350px] items-center justify-center text-center">

                                                <div>

                                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-background text-text-secondary">

                                                        <FileText
                                                            size={
                                                                23
                                                            }
                                                        />

                                                    </div>

                                                    <h2 className="mt-4 text-base font-bold text-text">
                                                        AI Interview Report
                                                    </h2>

                                                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">
                                                        This report will become available when the AI interview stage and evaluation data are implemented.
                                                    </p>

                                                </div>

                                            </div>
                                        )}

                                    </div>

                                </div>

                            </main>


                            {/* =================================================
                                RIGHT SIDEBAR
                            ================================================= */}

                            <aside className="min-w-0 space-y-5 lg:col-span-3">


                                {/* Candidate */}

                                <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                            {candidateInitials}
                                        </div>

                                        <div className="min-w-0">

                                            <p className="truncate text-sm font-bold text-text">
                                                {candidateName}
                                            </p>

                                            <p className="mt-1 truncate text-xs text-text-secondary">
                                                {application.job_title ||
                                                    "Candidate"}
                                            </p>

                                        </div>

                                    </div>

                                </section>


                                {/* Progress */}

                                <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">

                                    <div className="flex items-center justify-between">

                                        <h3 className="text-xs font-bold text-text">
                                            Application Progress
                                        </h3>

                                        <span
                                            className={`text-lg font-black ${
                                                isRejected
                                                    ? "text-red-600"
                                                    : "text-primary"
                                            }`}
                                        >
                                            {overallProgress}%
                                        </span>

                                    </div>


                                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-background">

                                        <div
                                            className={`h-full rounded-full ${
                                                isRejected
                                                    ? "bg-red-500"
                                                    : "bg-primary"
                                            }`}
                                            style={{
                                                width: `${overallProgress}%`,
                                            }}
                                        />

                                    </div>


                                    <div className="mt-4 rounded-xl border border-border bg-background p-3.5">

                                        <p className="text-[10px] text-text-secondary">
                                            Current Stage
                                        </p>

                                        <p
                                            className={`mt-1.5 text-xs font-bold ${
                                                isRejected
                                                    ? "text-red-600"
                                                    : "text-text"
                                            }`}
                                        >
                                            {isRejected
                                                ? "Application Rejected"
                                                : currentStage?.label}
                                        </p>

                                    </div>

                                </section>


                                {/* Information */}

                                <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">

                                    <div className="border-b border-border px-5 py-4">

                                        <h3 className="text-xs font-bold text-text">
                                            Application Information
                                        </h3>

                                    </div>


                                    <div className="divide-y divide-border">

                                        <div className="px-5 py-3.5">

                                            <p className="text-[10px] text-text-secondary">
                                                Applied On
                                            </p>

                                            <p className="mt-1 text-xs font-semibold text-text">
                                                {formatDate(
                                                    application.applied_at
                                                )}
                                            </p>

                                        </div>


                                        <div className="px-5 py-3.5">

                                            <p className="text-[10px] text-text-secondary">
                                                Status
                                            </p>

                                            <p
                                                className={`mt-1 text-xs font-bold ${
                                                    isRejected
                                                        ? "text-red-600"
                                                        : "text-primary"
                                                }`}
                                            >
                                                {statusLabels[
                                                    application.status
                                                ] ||
                                                    application.status}
                                            </p>

                                        </div>


                                        <div className="px-5 py-3.5">

                                            <p className="text-[10px] text-text-secondary">
                                                Last Updated
                                            </p>

                                            <p className="mt-1 text-xs font-semibold text-text">
                                                {formatDateTime(
                                                    application.updated_at
                                                )}
                                            </p>

                                        </div>

                                    </div>

                                </section>


                                {/* AI Tip */}

                                <section className="relative overflow-hidden rounded-2xl bg-primary p-5 text-white shadow-sm">

                                    <div className="relative z-10">

                                        <div className="flex items-center gap-2">

                                            <Lightbulb
                                                size={16}
                                            />

                                            <h3 className="text-xs font-bold">
                                                HireFlow AI
                                            </h3>

                                        </div>

                                        <p className="mt-3 text-xs leading-5 text-white/80">
                                            Review the AI Resume Report before progressing the candidate to the next recruitment stage.
                                        </p>

                                    </div>

                                    <Lightbulb
                                        size={85}
                                        className="pointer-events-none absolute -bottom-5 -right-5 opacity-10"
                                    />

                                </section>


                                {/* Back */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            "/company/applications"
                                        )
                                    }
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-xs font-semibold text-text transition hover:border-primary hover:text-primary"
                                >
                                    <ArrowLeft size={16} />
                                    Back to Applications
                                </button>

                            </aside>

                        </div>

                    </div>

                </div>

            </div>
        </CompanyDashboardLayout>
    );
};


export default CompanyApplicationDetail;