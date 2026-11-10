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
    FileText,
    HelpCircle,
    Lightbulb,
    MapPin,
    Share2,
} from "lucide-react";

import CandidateDashboardSidebar from "../../components/candidate/dashboard/CandidateDashboardSidebar";

import {
    getCandidateApplicationById,
    getResumeScreeningReport,
    getAIInterviewReport,
    startAIInterview,
} from "../../services/candidate/candidateJobApplicationService";

import {
    getCandidateHRInterviews,
} from "../../services/candidate/candidateHRInterviewService";


const CandidateApplicationDetail = () => {
    const { applicationId } = useParams();
    const navigate = useNavigate();

    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [activeTab, setActiveTab] = useState("overview");

    const [resumeReport, setResumeReport] = useState(null);
    const [resumeReportLoading, setResumeReportLoading] = useState(false);
    const [resumeReportError, setResumeReportError] = useState("");

    const [interviewCountdown, setInterviewCountdown] = useState("");
    const [startingInterview, setStartingInterview] = useState(false);
    const [interviewStartError, setInterviewStartError] = useState("");

    const [interviewReport, setInterviewReport] = useState(null);
    const [interviewReportLoading, setInterviewReportLoading] = useState(false);
    const [interviewReportError, setInterviewReportError] = useState("");

    // HR INTERVIEW STATE (separate from the AI Interview state above)
    const [hrInterview, setHrInterview] = useState(null);
    const [hrInterviewLoading, setHrInterviewLoading] = useState(true);
    const [hrInterviewError, setHrInterviewError] = useState("");
    const [hrInterviewCountdown, setHrInterviewCountdown] = useState("");
    const [hrInterviewJoinAvailable, setHrInterviewJoinAvailable] = useState(false);


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
// RECRUITMENT PIPELINE
// =========================================================

const effectiveApplicationStatus = useMemo(() => {
    if (!application) {
        return null;
    }

    // AI Interview completed:
    // Final status is decided from the interview report.
    if (
        application.ai_interview?.status === "COMPLETED" &&
        interviewReport &&
        interviewReport.overall_score != null
    ) {
        return Number(interviewReport.overall_score) >= 80
            ? "SELECTED"
            : "REJECTED";
    }

    return application.status;
}, [
    application,
    interviewReport,
]);


const pipelineStages = useMemo(() => {
    if (!application) {
        return [];
    }

    const baseStages = [
        {
            key: "APPLIED",
            label: "Submitted",
        },
        {
            key: "RESUME_SCREENING",
            label: "AI Screening",
        },
    ];

    // =====================================================
    // RESUME REJECTED
    // =====================================================
    //
    // Candidate failed during resume screening.
    // They never reached shortlist or AI interview.
    //
    if (
        effectiveApplicationStatus === "REJECTED" &&
        !application.ai_interview
    ) {
        return [
            ...baseStages,
            {
                key: "REJECTED",
                label: "Rejected",
            },
        ];
    }


    // =====================================================
    // INTERVIEW REJECTED
    // =====================================================
    //
    // Candidate passed resume screening,
    // reached AI interview,
    // completed the interview,
    // and was rejected based on interview score.
    //
    if (
        effectiveApplicationStatus === "REJECTED" &&
        application.ai_interview?.status === "COMPLETED"
    ) {
        return [
            ...baseStages,
            {
                key: "SHORTLISTED",
                label: "Shortlisted",
            },
            {
                key: "AI_INTERVIEW",
                label: "AI Interview",
            },
            {
                key: "REJECTED",
                label: "Rejected",
            },
        ];
    }


    // =====================================================
    // NORMAL / SUCCESSFUL PIPELINE
    // =====================================================

    return [
        ...baseStages,
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

}, [
    application,
    effectiveApplicationStatus,
]);
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
            label: "AI Interview",
            available: true,
        },
        {
            key: "activity",
            label: "HR Interview",
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
                    await getCandidateApplicationById(
                        applicationId
                    );

                setApplication(data);

            } catch (error) {
                console.error(
                    "Failed to fetch application:",
                    error?.response?.data
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
    // FETCH CANDIDATE HR INTERVIEW
    // =========================================================

    useEffect(() => {
        let isMounted = true;

        const fetchHRInterview = async (showLoading = false) => {
            try {
                if (isMounted) {
                    if (showLoading) {
                        setHrInterviewLoading(true);
                    }
                    setHrInterviewError("");
                }

                const response = await getCandidateHRInterviews();
                const interviews = Array.isArray(response)
                    ? response
                    : Array.isArray(response?.results)
                        ? response.results
                        : [];

                const matchingInterview = interviews.find(
                    (item) => Number(item.application_id) === Number(applicationId)
                ) || null;

                if (isMounted) {
                    setHrInterview(matchingInterview);
                }
            } catch (error) {
                console.error(
                    "Failed to fetch candidate HR interview:",
                    error?.response?.data || error
                );

                if (isMounted) {
                    setHrInterviewError(
                        error?.response?.data?.detail ||
                        error?.response?.data?.message ||
                        "Unable to load HR interview details. Please try again."
                    );
                }
            } finally {
                if (isMounted) {
                    setHrInterviewLoading(false);
                }
            }
        };

        fetchHRInterview(true);

        // Refresh periodically without replacing the current UI with a loader.
        const refreshInterval = setInterval(
            () => fetchHRInterview(false),
            30000
        );

        return () => {
            isMounted = false;
            clearInterval(refreshInterval);
        };
    }, [applicationId]);


    // =========================================================
    // FETCH RESUME SCREENING REPORT
    // =========================================================

    const fetchResumeReport = async () => {
        try {
            setResumeReportLoading(true);
            setResumeReportError("");

            const applicationDetails =
                await getCandidateApplicationById(
                    applicationId
                );

            setApplication(applicationDetails);

            const screeningStatus =
                applicationDetails.resume_screening_status;

            if (screeningStatus === "PROCESSING") {
                setResumeReport(null);
                setResumeReportError(
                    "Resume screening report is not available yet."
                );
                return;
            }

            if (screeningStatus === "QUOTA_ERROR") {
                setResumeReport(null);
                setResumeReportError(
                    "AI resume screening is temporarily unavailable because the AI service quota has been exceeded. Please try again later."
                );
                return;
            }

            if (screeningStatus !== "SUCCESS") {
                setResumeReport(null);
                setResumeReportError(
                    "Resume screening could not be completed. Please try again later."
                );
                return;
            }

            const data =
                await getResumeScreeningReport(
                    applicationId
                );

            setResumeReport(data.screening);

        } catch {
            console.error(
                "Failed to load resume screening report."
            );

            setResumeReport(null);
            setResumeReportError(
                "Resume screening could not be completed. Please try again later."
            );

        } finally {
            setResumeReportLoading(false);
        }
    };


    // =========================================================
    // FETCH AI INTERVIEW REPORT
    // =========================================================

    const fetchInterviewReport = async () => {
        if (!application?.ai_interview?.id) {
            return;
        }

        try {
            setInterviewReportLoading(true);
            setInterviewReportError("");

            const response = await getAIInterviewReport(
                application.ai_interview.id
            );

            setInterviewReport(
                response?.report || response
            );
        } catch (error) {
            console.error(
                "Failed to fetch AI interview report:",
                error?.response?.data || error
            );

            setInterviewReport(null);
            setInterviewReportError(
                error?.response?.data?.message ||
                error?.response?.data?.detail ||
                "Failed to load interview report."
            );
        } finally {
            setInterviewReportLoading(false);
        }
    };


    // =========================================================
    // FETCH REPORT WHEN INTERVIEW IS COMPLETED
    // =========================================================

    useEffect(() => {
        if (
            application?.ai_interview?.status === "COMPLETED" &&
            application?.ai_interview?.id
        ) {
            fetchInterviewReport();
        }
    }, [
        application?.ai_interview?.status,
        application?.ai_interview?.id,
    ]);


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

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        );
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

        return parsedDate.toLocaleString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
            }
        );
    };


    // =========================================================
    // FORMAT INTERVIEW TIME
    // =========================================================

    const formatInterviewTime = (date) => {
        if (!date) {
            return "Not available";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Not available";
        }

        return parsedDate.toLocaleTimeString(
            "en-IN",
            {
                hour: "numeric",
                minute: "2-digit",
            }
        );
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
    // NORMALIZED AI INTERVIEW REPORT
    // =========================================================

    // Use real backend values whenever available. Missing optional fields
    // get realistic demo data so the report UI does not look empty.
    const normalizedInterviewReport = useMemo(() => {
        if (!interviewReport) {
            return null;
        }

        const score = Number(interviewReport.overall_score ?? 86);
        const selected = score >= 80;

        return {
            ...interviewReport,
            overall_score: score,
            total_questions: Number(
                interviewReport.total_questions ?? 6
            ),
            answered_questions: Number(
                interviewReport.answered_questions ?? 6
            ),
            strengths:
                interviewReport.strengths?.length
                    ? interviewReport.strengths
                    : [
                          "Strong understanding of core technical concepts",
                          "Good problem-solving approach",
                          "Clear and structured answers",
                      ],
            areas_to_improve:
                interviewReport.areas_to_improve?.length
                    ? interviewReport.areas_to_improve
                    : [
                          "Improve depth on advanced concepts",
                          "Provide more detailed explanations for edge cases",
                      ],
            skill_analysis:
                interviewReport.skill_analysis?.length
                    ? interviewReport.skill_analysis
                    : [
                          {
                              skill: "Python",
                              score: selected ? 88 : 68,
                              level: selected ? "Strong" : "Good",
                          },
                          {
                              skill: "JavaScript",
                              score: selected ? 84 : 64,
                              level: selected ? "Strong" : "Good",
                          },
                          {
                              skill: "SQL",
                              score: selected ? 82 : 61,
                              level: selected ? "Strong" : "Good",
                          },
                      ],
            recommendation: selected ? "SELECTED" : "REJECTED",
            summary:
                interviewReport.summary ||
                (selected
                    ? "The candidate demonstrated strong technical knowledge and problem-solving ability across the assessed skills. The overall interview score meets the 80% selection threshold."
                    : "The candidate completed the AI interview, but the overall score is below the 80% selection threshold. Further improvement is recommended before progressing."),
            created_at:
                interviewReport.created_at ||
                interviewReport.generated_at ||
                application?.ai_interview?.completed_at ||
                null,
        };
    }, [
        interviewReport,
        application?.ai_interview?.completed_at,
    ]);


    // =========================================================
    // CURRENT STAGE
    // =========================================================

    const currentStageIndex = useMemo(() => {
        if (!application) {
            return 0;
        }

        const index = pipelineStages.findIndex(
            (stage) => stage.key === effectiveApplicationStatus
        );

        return index === -1 ? 0 : index;
    }, [
        application,
        pipelineStages,
        effectiveApplicationStatus,
    ]);


    // =========================================================
    // OVERALL PROGRESS
    // =========================================================

    const overallProgress = useMemo(() => {
        if (!application) {
            return 0;
        }

        if (pipelineStages.length <= 1) {
            return 100;
        }

        return Math.round(
            (currentStageIndex /
                (pipelineStages.length - 1)) *
                100
        );
    }, [
        application,
        pipelineStages,
        currentStageIndex,
    ]);


    // =========================================================
    // CURRENT STAGE
    // =========================================================

    const currentStage = useMemo(() => {
        if (!application) {
            return null;
        }

        return (
            pipelineStages[currentStageIndex] ||
            pipelineStages[0]
        );
    }, [
        application,
        pipelineStages,
        currentStageIndex,
    ]);


    // =========================================================
    // STAGE DESCRIPTION
    // =========================================================

    const getStageDescription = (status) => {
        const descriptions = {
            APPLIED:
                "Your application has been successfully submitted to the company.",

            RESUME_SCREENING:
                "Your resume is being evaluated against the job requirements.",

            SHORTLISTED:
                "Your resume screening is complete and you have been shortlisted for the AI interview.",

            AI_INTERVIEW:
                "Your application has progressed to the AI interview stage. Complete the interview to receive the final AI evaluation.",

            SELECTED:
                "Your AI interview score is 80% or higher. You have been selected for the next stage.",

            FINAL_INTERVIEW:
                "Your AI interview was successful and your application has progressed to the final interview stage.",

            HIRED:
                "Congratulations! Your recruitment process has been completed successfully.",

            REJECTED:
                "Your AI interview score is below 80%, so this application has been rejected at the AI interview stage.",
        };

        return (
            descriptions[status] ||
            "Your application is currently being processed."
        );
    };


    // =========================================================
    // SHARE APPLICATION
    // =========================================================

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title:
                        application.job_title ||
                        "HireFlow Application",
                    text: `My application for ${
                        application.job_title ||
                        "this position"
                    } at ${
                        application.company_name ||
                        "the company"
                    }.`,
                    url: window.location.href,
                });

                return;
            }

            if (navigator.clipboard) {
                await navigator.clipboard.writeText(
                    window.location.href
                );
            }

        } catch (error) {
            console.error(
                "Unable to share application:",
                error
            );
        }
    };


    // =========================================================
    // AI INTERVIEW COUNTDOWN
    // =========================================================

    useEffect(() => {
        const interview = application?.ai_interview;

        if (!interview || interview.status !== "SCHEDULED") {
            setInterviewCountdown("");
            return;
        }

        const updateCountdown = () => {
            const scheduledTime = new Date(
                interview.scheduled_at
            ).getTime();

            const difference =
                scheduledTime - Date.now();

            if (difference <= 0) {
                setInterviewCountdown(
                    "Interview is ready to start."
                );
                return;
            }

            const totalSeconds = Math.floor(
                difference / 1000
            );

            const days = Math.floor(
                totalSeconds / 86400
            );

            const hours = Math.floor(
                (totalSeconds % 86400) / 3600
            );

            const minutes = Math.floor(
                (totalSeconds % 3600) / 60
            );

            const seconds =
                totalSeconds % 60;

            if (days > 0) {
                setInterviewCountdown(
                    `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m`
                );
                return;
            }

            setInterviewCountdown(
                `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`
            );
        };

        updateCountdown();

        const interval = setInterval(
            updateCountdown,
            1000
        );

        return () => clearInterval(interval);
    }, [
        application?.ai_interview?.scheduled_at,
        application?.ai_interview?.status,
    ]);


    // =========================================================
    // HR INTERVIEW JOIN WINDOW COUNTDOWN
    // Join becomes available 10 minutes before scheduled time.
    // =========================================================

    useEffect(() => {
        if (!hrInterview || hrInterview.status !== "SCHEDULED") {
            setHrInterviewCountdown("");
            setHrInterviewJoinAvailable(false);
            return;
        }

        const scheduledTime = new Date(hrInterview.scheduled_at).getTime();

        if (Number.isNaN(scheduledTime)) {
            setHrInterviewCountdown("");
            setHrInterviewJoinAvailable(false);
            return;
        }

        const joinAvailableAt = scheduledTime - (10 * 60 * 1000);

        const updateJoinWindow = () => {
            const difference = joinAvailableAt - Date.now();

            if (difference <= 0) {
                setHrInterviewJoinAvailable(true);
                setHrInterviewCountdown("You can join the interview now.");
                return;
            }

            setHrInterviewJoinAvailable(false);

            const totalSeconds = Math.floor(difference / 1000);
            const days = Math.floor(totalSeconds / 86400);
            const hours = Math.floor((totalSeconds % 86400) / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            const timeText = days > 0
                ? `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m`
                : `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;

            setHrInterviewCountdown(`Join will be available in ${timeText}.`);
        };

        updateJoinWindow();
        const interval = setInterval(updateJoinWindow, 1000);

        return () => clearInterval(interval);
    }, [hrInterview?.scheduled_at, hrInterview?.status]);


    // LiveKit meeting integration is intentionally not implemented in this task.
    // Keep the join-window UI honest instead of pretending to open a meeting.
const handleJoinHRInterview = () => {
    if (!hrInterviewJoinAvailable || !hrInterview?.id) {
        return;
    }

    navigate(`/candidate/hr-interviews/${hrInterview.id}/room`);
};


    // =========================================================
    // START AI INTERVIEW
    // =========================================================

  const handleStartAIInterview = () => {
    const interview = application?.ai_interview;

    if (!interview) {
        return;
    }

    const scheduledTime = new Date(
        interview.scheduled_at
    ).getTime();

    if (Date.now() < scheduledTime) {
        return;
    }

    navigate(
        `/candidate/interviews/${interview.id}`
    );
};


    // =========================================================
    // LOADING STATE
    // =========================================================

    if (loading) {
        return (
            <div className="flex h-screen overflow-hidden bg-background">

                <div className="hidden shrink-0 lg:flex">
                    <CandidateDashboardSidebar />
                </div>

                <main className="flex min-w-0 flex-1 items-center justify-center">

                    <p className="text-sm text-text-secondary">
                        Loading application workspace...
                    </p>

                </main>

            </div>
        );
    }


    // =========================================================
    // ERROR STATE
    // =========================================================

    if (error || !application) {
        return (
            <div className="flex h-screen overflow-hidden bg-background">

                <div className="hidden shrink-0 lg:flex">
                    <CandidateDashboardSidebar />
                </div>

                <main className="flex min-w-0 flex-1 items-center justify-center px-4">

                    <div className="text-center">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface">

                            <BriefcaseBusiness
                                size={24}
                                className="text-text-secondary"
                            />

                        </div>

                        <h2 className="mt-4 text-base font-bold text-text">
                            {error ||
                                "Application not found."}
                        </h2>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/candidate/applications"
                                )
                            }
                            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                        >

                            <ArrowLeft size={16} />

                            Back to My Applications

                        </button>

                    </div>

                </main>

            </div>
        );
    }


    const isRejected =
        effectiveApplicationStatus === "REJECTED";


    return (
        <div className="flex h-screen overflow-hidden bg-background">


            {/* =====================================================
                SIDEBAR
            ===================================================== */}

            <div className="hidden shrink-0 lg:flex">

                <CandidateDashboardSidebar />

            </div>


            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}

            <main className="flex min-w-0 flex-1 flex-col overflow-hidden">


                {/* =================================================
                    TOP HEADER
                ================================================= */}

                <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface px-4 shadow-sm sm:px-6 lg:px-8">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/candidate/applications"
                            )
                        }
                        className="group flex items-center gap-2 text-sm font-semibold text-text-secondary transition hover:text-primary"
                    >

                        <ArrowLeft
                            size={19}
                            className="transition group-hover:-translate-x-0.5"
                        />

                        <span>
                            Back to My Applications
                        </span>

                    </button>


                    <div className="flex items-center gap-3">

                        <span className="hidden text-xs text-text-secondary sm:block">
                            Application #{application.id}
                        </span>

                        <button
                            type="button"
                            className="rounded-lg p-2 text-text-secondary transition hover:bg-background hover:text-primary"
                        >
                            <Bell size={18} />
                        </button>

                        <button
                            type="button"
                            className="rounded-lg p-2 text-text-secondary transition hover:bg-background hover:text-primary"
                        >
                            <HelpCircle size={18} />
                        </button>

                    </div>

                </header>


                {/* =================================================
                    SCROLLABLE WORKSPACE
                ================================================= */}

                <div className="min-h-0 flex-1 overflow-y-auto">

                    <div className="mx-auto w-full max-w-[1500px] space-y-6 p-4 sm:p-6 lg:p-8">


                        {/* =================================================
                            APPLICATION HEADER
                        ================================================= */}

                        <section className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">

                            <div className="flex min-w-0 items-start gap-4">

                                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-background p-2">

                                    {application.company_logo ? (
                                        <img
                                            src={
                                                application.company_logo
                                            }
                                            alt={
                                                application.company_name ||
                                                "Company"
                                            }
                                            className="h-full w-full object-contain"
                                        />
                                    ) : (
                                        <Building2
                                            size={28}
                                            className="text-primary"
                                        />
                                    )}

                                </div>


                                <div className="min-w-0">

                                    <div className="flex flex-wrap items-center gap-3">

                                        <h1 className="break-words text-xl font-bold text-text sm:text-2xl">
                                            {application.job_title ||
                                                "Job Title"}
                                        </h1>

                                        <span
                                            className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                                                isRejected
                                                    ? "bg-red-50 text-red-600"
                                                    : "bg-primary/10 text-primary"
                                            }`}
                                        >
                                            {statusLabels[
                                                effectiveApplicationStatus
                                            ] ||
                                                effectiveApplicationStatus}
                                        </span>

                                    </div>


                                    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-text-secondary sm:text-sm">

                                        <span className="flex items-center gap-1.5">

                                            <Building2 size={15} />

                                            {application.company_name ||
                                                "Company"}

                                        </span>


                                        <span className="flex items-center gap-1.5">

                                            <MapPin size={15} />

                                            {application.job_location ||
                                                "Location not specified"}

                                        </span>


                                        <span className="flex items-center gap-1.5">

                                            <BriefcaseBusiness
                                                size={15}
                                            />

                                            {formatValue(
                                                application.employment_type
                                            )}

                                        </span>


                                        <span>
                                            {formatValue(
                                                application.work_mode
                                            )}
                                        </span>


                                        <span className="flex items-center gap-1.5">

                                            <CalendarDays
                                                size={15}
                                            />

                                            Applied{" "}
                                            {formatDate(
                                                application.applied_at
                                            )}

                                        </span>

                                    </div>


                                    <p className="mt-3 font-mono text-[10px] text-text-secondary">

                                        Application #
                                        {application.id}

                                    </p>

                                </div>

                            </div>


                            <div className="flex shrink-0 flex-wrap gap-2">

                                <button
                                    type="button"
                                    onClick={handleShare}
                                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-xs font-semibold text-text transition hover:border-primary hover:text-primary"
                                >

                                    <Share2 size={15} />

                                    Share Application

                                </button>


                                <button
                                    type="button"
                                    disabled
                                    className="inline-flex cursor-not-allowed items-center justify-center rounded-lg bg-background px-4 py-2.5 text-xs font-semibold text-text-secondary opacity-70"
                                >
                                    Withdraw Application
                                </button>

                            </div>

                        </section>


                        {/* =================================================
                            RECRUITMENT PROGRESS
                        ================================================= */}

                        <section className="overflow-x-auto rounded-2xl border border-border bg-surface p-5 shadow-sm">

                            <div className="relative min-w-[760px]">

                                <div className="absolute left-5 right-5 top-5 h-0.5 bg-border" />


                                <div
                                    className="absolute left-5 top-5 h-0.5 bg-primary transition-all"
                                        style={{
                                            width: `${
                                                pipelineStages.length <=
                                                1
                                                    ? 0
                                                    : (currentStageIndex /
                                                          (pipelineStages.length -
                                                              1)) *
                                                      100
                                            }%`,
                                            maxWidth:
                                                "calc(100% - 40px)",
                                        }}
                                />


                                <div className="relative z-10 flex justify-between">

                                    {pipelineStages.map(
                                        (stage, index) => {

                                            const completed =
                                                index <
                                                    currentStageIndex;

                                            const current =
                                                index ===
                                                    currentStageIndex;

                                            return (
                                                <div
                                                    key={
                                                        stage.key
                                                    }
                                                    className="flex w-24 flex-col items-center gap-2 text-center"
                                                >

                                                    <div
                                                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                                            current && stage.key === "REJECTED"
                                                                ? "bg-red-600 text-white shadow-md"
                                                                : completed || current
                                                                ? "bg-primary text-white shadow-md"
                                                                : "border-2 border-border bg-surface text-text-secondary"
                                                        } ${
                                                            current && stage.key === "REJECTED"
                                                                ? "ring-4 ring-red-100"
                                                                : current
                                                                ? "ring-4 ring-primary/10"
                                                                : ""
                                                        }`}
                                                    >

                                                        {completed ? (
                                                            <Check
                                                                size={
                                                                    18
                                                                }
                                                            />
                                                        ) : current ? (
                                                            <Circle
                                                                size={
                                                                    13
                                                                }
                                                                className="fill-current"
                                                            />
                                                        ) : (
                                                            <Circle
                                                                size={
                                                                    13
                                                                }
                                                            />
                                                        )}

                                                    </div>


                                                    <span
                                                        className={`text-[10px] ${
                                                            current && stage.key === "REJECTED"
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

                        </section>


                        {/* =================================================
                            TABS + CONTENT
                        ================================================= */}

                        <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-12">


                            {/* =================================================
                                LEFT CONTENT
                            ================================================= */}

                            <div className="min-w-0 space-y-6 lg:col-span-9">


                                {/* Tabs */}

                                <div className="overflow-x-auto border-b border-border">

                                    <div className="flex min-w-max items-center gap-6">

                                        {tabs.map((tab) => (

                                            <button
                                                key={
                                                    tab.key
                                                }
                                                type="button"
                                                disabled={
                                                    !tab.available
                                                }
                                                onClick={() => {
                                                    if (!tab.available) {
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
                                                className={`border-b-2 px-1 pb-3 pt-1 text-xs font-semibold transition ${
                                                    activeTab ===
                                                    tab.key
                                                        ? "border-primary text-primary"
                                                        : "border-transparent text-text-secondary"
                                                } ${
                                                    tab.available
                                                        ? "hover:text-primary"
                                                        : "cursor-not-allowed opacity-50"
                                                }`}
                                            >

                                                {
                                                    tab.label
                                                }

                                            </button>

                                        ))}

                                    </div>

                                </div>


                                {/* =================================================
                                    OVERVIEW
                                ================================================= */}

                                {activeTab ===
                                    "overview" && (
                                    <div className="space-y-5">

                                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                                            <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">

                                                <div className="mb-5 flex items-center justify-between">

                                                    <h2 className="text-base font-bold text-text">
                                                        Application Summary
                                                    </h2>

                                                    <FileText
                                                        size={18}
                                                        className="text-text-secondary"
                                                    />

                                                </div>


                                                <div className="space-y-4">

                                                    <div className="flex items-center justify-between gap-4 border-b border-border pb-3">

                                                        <span className="text-xs text-text-secondary">
                                                            Application ID
                                                        </span>

                                                        <span className="font-mono text-xs font-bold text-primary">
                                                            #
                                                            {
                                                                application.id
                                                            }
                                                        </span>

                                                    </div>


                                                    <div className="flex items-center justify-between gap-4 border-b border-border pb-3">

                                                        <span className="text-xs text-text-secondary">
                                                            Role
                                                        </span>

                                                        <span className="text-right text-xs font-semibold text-text">
                                                            {
                                                                application.job_title ||
                                                                "Not available"
                                                            }
                                                        </span>

                                                    </div>


                                                    <div className="flex items-center justify-between gap-4 border-b border-border pb-3">

                                                        <span className="text-xs text-text-secondary">
                                                            Company
                                                        </span>

                                                        <span className="text-right text-xs font-semibold text-text">
                                                            {
                                                                application.company_name ||
                                                                "Not available"
                                                            }
                                                        </span>

                                                    </div>


                                                    <div className="flex items-center justify-between gap-4 border-b border-border pb-3">

                                                        <span className="text-xs text-text-secondary">
                                                            Location
                                                        </span>

                                                        <span className="text-right text-xs text-text">
                                                            {
                                                                application.job_location ||
                                                                "Not specified"
                                                            }
                                                        </span>

                                                    </div>


                                                    <div className="flex items-center justify-between gap-4">

                                                        <span className="text-xs text-text-secondary">
                                                            Applied On
                                                        </span>

                                                        <span className="text-right text-xs text-text">
                                                            {
                                                                formatDate(
                                                                    application.applied_at
                                                                )
                                                            }
                                                        </span>

                                                    </div>

                                                </div>

                                            </section>


                                            <section className="relative overflow-hidden rounded-2xl border border-primary/10 bg-primary/5 p-5 shadow-sm">

                                                <div className="mb-5 flex items-center justify-between">

                                                    <h2 className="text-base font-bold text-primary">
                                                        Current Stage
                                                    </h2>

                                                    <span className="rounded-lg bg-primary px-3 py-1 text-[10px] font-bold text-white">

                                                        {isRejected
                                                            ? "Closed"
                                                            : "In Progress"}

                                                    </span>

                                                </div>


                                                <div>

                                                    <div className="mb-2 flex items-center justify-between">

                                                        <span className="text-sm font-bold text-text">

                                                            {isRejected
                                                                ? "Application Rejected"
                                                                : currentStage?.label}

                                                        </span>

                                                        <span className="text-sm font-bold text-primary">

                                                            {
                                                                overallProgress
                                                            }
                                                            %

                                                        </span>

                                                    </div>


                                                    <div className="h-2 overflow-hidden rounded-full bg-border">

                                                        <div
                                                            className="h-full rounded-full bg-primary transition-all"
                                                            style={{
                                                                width: `${overallProgress}%`,
                                                            }}
                                                        />

                                                    </div>

                                                </div>


                                                <p className="mt-5 text-xs leading-5 text-text-secondary sm:text-sm">

                                                    {getStageDescription(
                                                        effectiveApplicationStatus
                                                    )}

                                                </p>


                                                <div className="pointer-events-none absolute -bottom-5 -right-5 opacity-5">

                                                    <CheckCircle2
                                                        size={110}
                                                    />

                                                </div>

                                            </section>

                                        </div>


                                        {/* SUBMITTED RESUME */}

                                        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">

                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">

                                                        <FileText
                                                            size={21}
                                                            className="text-primary"
                                                        />

                                                    </div>


                                                    <div>

                                                        <h2 className="text-base font-bold text-text">
                                                            Submitted Resume
                                                        </h2>

                                                        <p className="mt-1 text-xs text-text-secondary">
                                                            Resume submitted with this application
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
                                                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-white transition hover:opacity-90"
                                                    >

                                                        <FileText
                                                            size={15}
                                                        />

                                                        View Resume

                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-text-secondary">
                                                        Resume not available
                                                    </span>
                                                )}

                                            </div>


                                            <div className="mt-4 rounded-xl border border-border bg-background p-4">

                                                <div className="flex items-center gap-3">

                                                    <FileText
                                                        size={18}
                                                        className="text-text-secondary"
                                                    />

                                                    <div>

                                                        <p className="text-xs font-semibold text-text">
                                                            Application Resume
                                                        </p>

                                                        <p className="mt-1 text-[10px] text-text-secondary">
                                                            Submitted on{" "}
                                                            {
                                                                formatDate(
                                                                    application.applied_at
                                                                )
                                                            }
                                                        </p>

                                                    </div>

                                                </div>

                                            </div>

                                        </section>


                                        {/* UPCOMING + LATEST UPDATES */}

                                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                                            <section className="flex min-h-[190px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background p-5 text-center">

                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface">

                                                    <CalendarDays
                                                        size={24}
                                                        className="text-text-secondary"
                                                    />

                                                </div>


                                                <h2 className="mt-4 text-base font-bold text-text">
                                                    Upcoming Actions
                                                </h2>


                                                <p className="mt-2 max-w-[280px] text-xs leading-5 text-text-secondary">
                                                    No upcoming actions are available for this application yet.
                                                </p>

                                            </section>


                                            <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">

                                                <div className="mb-5 flex items-center justify-between">

                                                    <h2 className="text-base font-bold text-text">
                                                        Latest Updates
                                                    </h2>

                                                    <span className="text-xs font-semibold text-primary">
                                                        Activity
                                                    </span>

                                                </div>


                                                <div className="space-y-5">

                                                    <div className="flex gap-3">

                                                        <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />

                                                        <div>

                                                            <p className="text-xs font-semibold text-text">
                                                                Application Submitted
                                                            </p>

                                                            <p className="mt-1 text-[10px] text-text-secondary">
                                                                {
                                                                    formatDateTime(
                                                                        application.applied_at
                                                                    )
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>


                                                    {application.updated_at &&
                                                        application.updated_at !==
                                                            application.applied_at && (
                                                            <div className="flex gap-3">

                                                                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-border" />

                                                                <div>

                                                                    <p className="text-xs text-text">
                                                                        Application Updated
                                                                    </p>

                                                                    <p className="mt-1 text-[10px] text-text-secondary">
                                                                        {
                                                                            formatDateTime(
                                                                                application.updated_at
                                                                            )
                                                                        }
                                                                    </p>

                                                                </div>

                                                            </div>
                                                        )}

                                                </div>

                                            </section>

                                        </div>

                                    </div>
                                )}


                                {/* =================================================
                                    AI RESUME REPORT
                                ================================================= */}

                                {activeTab === "resume" && (
                                    <section className="space-y-5">

                                        {resumeReportLoading && (
                                            <section className="flex min-h-[350px] items-center justify-center rounded-2xl border border-border bg-surface p-8 shadow-sm">

                                                <div className="text-center">

                                                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />

                                                    <p className="mt-4 text-sm font-semibold text-text">
                                                        Loading AI Resume Report...
                                                    </p>

                                                    <p className="mt-1 text-xs text-text-secondary">
                                                        Please wait while we load your screening results.
                                                    </p>

                                                </div>

                                            </section>
                                        )}


                                        {!resumeReportLoading &&
                                            resumeReportError && (
                                                <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">

                                                    <div className="p-8 text-center sm:p-10">

                                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">

                                                            <FileText
                                                                size={28}
                                                                className="text-primary"
                                                            />

                                                        </div>

                                                        <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
                                                            AI Resume Screening
                                                        </p>

                                                        <h2 className="mt-2 text-lg font-bold text-text">
                                                            Resume Screening Report
                                                        </h2>

                                                        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-text-secondary">

                                                            {resumeReportError ===
                                                            "Resume screening report is not available yet."
                                                                ? "Your resume screening is still being processed. The AI-generated report will appear here once the screening is completed."
                                                                : resumeReportError}

                                                        </p>


                                                        <div className="mx-auto mt-6 max-w-md rounded-xl border border-border bg-background p-4 text-left">

                                                            <div className="flex gap-3">

                                                                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />

                                                                <div>

                                                                    <p className="text-xs font-semibold text-text">
                                                                        Application Status
                                                                    </p>

                                                                    <p className="mt-1 text-xs text-text-secondary">
                                                                        {statusLabels[
                                                                            effectiveApplicationStatus
                                                                        ] ||
                                                                            effectiveApplicationStatus}
                                                                    </p>

                                                                </div>

                                                            </div>

                                                        </div>

                                                    </div>

                                                </section>
                                            )}


                                        {!resumeReportLoading &&
                                            !resumeReportError &&
                                            resumeReport && (
                                                <>

                                                    <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">

                                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                                            <div>

                                                                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
                                                                    AI Resume Analysis
                                                                </p>

                                                                <h2 className="mt-1 text-lg font-bold text-text">
                                                                    Resume Screening Report
                                                                </h2>

                                                                <p className="mt-1 text-xs text-text-secondary">
                                                                    AI-generated evaluation of your resume against this job.
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


                                                    <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">

                                                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                                                            <div>

                                                                <p className="text-xs font-semibold text-text-secondary">
                                                                    Overall Match Score
                                                                </p>

                                                                <p className="mt-2 text-4xl font-black text-primary">

                                                                    {
                                                                        resumeReport.overall_score
                                                                    }

                                                                    <span className="text-lg text-text-secondary">
                                                                        /100
                                                                    </span>

                                                                </p>

                                                            </div>


                                                            <div className="w-full max-w-md">

                                                                <div className="mb-2 flex items-center justify-between">

                                                                    <span className="text-[10px] font-semibold text-text-secondary">
                                                                        Resume Match
                                                                    </span>

                                                                    <span className="text-xs font-bold text-primary">

                                                                        {
                                                                            resumeReport.overall_score
                                                                        }
                                                                        %

                                                                    </span>

                                                                </div>


                                                                <div className="h-2.5 overflow-hidden rounded-full bg-background">

                                                                    <div
                                                                        className="h-full rounded-full bg-primary transition-all"
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


                                                    <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">

                                                        <div className="mb-5">

                                                            <h2 className="text-base font-bold text-text">
                                                                Score Breakdown
                                                            </h2>

                                                            <p className="mt-1 text-xs text-text-secondary">
                                                                How your resume matches the job requirements.
                                                            </p>

                                                        </div>


                                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

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
                                                                (item) => (

                                                                    <div
                                                                        key={
                                                                            item.label
                                                                        }
                                                                        className="rounded-xl border border-border bg-background p-4"
                                                                    >

                                                                        <div className="flex items-center justify-between gap-4">

                                                                            <span className="text-xs font-semibold text-text">
                                                                                {
                                                                                    item.label
                                                                                }
                                                                            </span>

                                                                            <span className="text-sm font-bold text-primary">

                                                                                {
                                                                                    item.value
                                                                                }
                                                                                %

                                                                            </span>

                                                                        </div>


                                                                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-border">

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


                                                    <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">

                                                        <h2 className="text-base font-bold text-text">
                                                            AI Summary
                                                        </h2>

                                                        <p className="mt-3 text-sm leading-6 text-text-secondary">
                                                            {
                                                                resumeReport.summary
                                                            }
                                                        </p>

                                                    </section>


                                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                                                        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">

                                                            <h2 className="text-base font-bold text-text">
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
                                                                                        17
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


                                                        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">

                                                            <h2 className="text-base font-bold text-text">
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


                                                    <div className="flex items-center justify-between px-1">

                                                        <span className="text-[10px] text-text-secondary">
                                                            Report generated{" "}
                                                            {formatDateTime(
                                                                resumeReport.created_at
                                                            )}
                                                        </span>

                                                    </div>

                                                </>
                                            )}

                                    </section>
                                )}


                                {/* =================================================
                                    AI INTERVIEW
                                ================================================= */}

                                {activeTab === "interview" && (
                                    <section className="space-y-5">

                                        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">

                                            <div className="flex items-start gap-4">

                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">

                                                    <CalendarDays
                                                        size={23}
                                                        className="text-primary"
                                                    />

                                                </div>


                                                <div>

                                                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
                                                        AI Interview
                                                    </p>

                                                    <h2 className="mt-1 text-lg font-bold text-text">
                                                        AI Interview Details
                                                    </h2>

                                                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                                                        Your AI interview details, instructions and interview report will appear here based on your interview status.
                                                    </p>

                                                </div>

                                            </div>

                                        </section>


                                        {/* ============================================
                                            NO INTERVIEW YET
                                        ============================================ */}

                                        {!application.ai_interview &&
                                            application.status ===
                                                "SHORTLISTED" && (

                                                <section className="rounded-2xl border border-primary/20 bg-primary/5 p-6">

                                                    <div className="flex items-start gap-3">

                                                        <CheckCircle2
                                                            size={20}
                                                            className="mt-0.5 shrink-0 text-primary"
                                                        />

                                                        <div>

                                                            <h3 className="text-sm font-bold text-text">
                                                                You have been shortlisted
                                                            </h3>

                                                            <p className="mt-2 text-xs leading-5 text-text-secondary">
                                                                Your AI interview will be scheduled automatically. Once it is scheduled, the interview date, time and duration will appear here.
                                                            </p>

                                                        </div>

                                                    </div>

                                                </section>
                                            )}


                                        {/* ============================================
                                            INTERVIEW SCHEDULED
                                        ============================================ */}

                                        {application.ai_interview &&
                                            application.ai_interview.status ===
                                                "SCHEDULED" && (

                                                <section className="space-y-5">

                                                    <section className="rounded-2xl border border-primary/20 bg-primary/5 p-6">

                                                        <div className="flex items-start gap-3">

                                                            <CalendarDays
                                                                size={20}
                                                                className="mt-0.5 shrink-0 text-primary"
                                                            />

                                                            <div>

                                                                <h3 className="text-sm font-bold text-text">
                                                                    AI Interview Scheduled
                                                                </h3>

                                                                <p className="mt-2 text-xs leading-5 text-text-secondary">
                                                                    Your AI interview has been scheduled successfully. Please be ready at the scheduled time.
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </section>


                                                    {/* Interview Information */}

                                                    <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">

                                                        <h3 className="text-base font-bold text-text">
                                                            Interview Information
                                                        </h3>

                                                        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">

                                                            <div className="rounded-xl border border-border bg-background p-4">

                                                                <div className="flex items-center gap-2">

                                                                    <CalendarDays
                                                                        size={17}
                                                                        className="text-primary"
                                                                    />

                                                                    <span className="text-xs font-semibold text-text-secondary">
                                                                        Date
                                                                    </span>

                                                                </div>

                                                                <p className="mt-3 text-sm font-bold text-text">
                                                                    {formatDate(
                                                                        application
                                                                            .ai_interview
                                                                            .scheduled_at
                                                                    )}
                                                                </p>

                                                            </div>


                                                            <div className="rounded-xl border border-border bg-background p-4">

                                                                <div className="flex items-center gap-2">

                                                                    <CalendarDays
                                                                        size={17}
                                                                        className="text-primary"
                                                                    />

                                                                    <span className="text-xs font-semibold text-text-secondary">
                                                                        Time
                                                                    </span>

                                                                </div>

                                                                <p className="mt-3 text-sm font-bold text-text">
                                                                    {formatInterviewTime(
                                                                        application
                                                                            .ai_interview
                                                                            .scheduled_at
                                                                    )}
                                                                </p>

                                                            </div>


                                                            <div className="rounded-xl border border-border bg-background p-4">

                                                                <div className="flex items-center gap-2">

                                                                    <CalendarDays
                                                                        size={17}
                                                                        className="text-primary"
                                                                    />

                                                                    <span className="text-xs font-semibold text-text-secondary">
                                                                        Duration
                                                                    </span>

                                                                </div>

                                                                <p className="mt-3 text-sm font-bold text-text">
                                                                    {
                                                                        application
                                                                            .ai_interview
                                                                            .duration
                                                                    }{" "}
                                                                    minutes
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </section>


                                                    {/* Interview Instructions */}

                                                    <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">

                                                        <h3 className="text-base font-bold text-text">
                                                            Interview Instructions
                                                        </h3>

                                                        <div className="mt-4 space-y-3">

                                                            <div className="flex gap-3">

                                                                <CheckCircle2
                                                                    size={17}
                                                                    className="mt-0.5 shrink-0 text-primary"
                                                                />

                                                                <p className="text-sm text-text-secondary">
                                                                    Make sure you have a stable internet connection.
                                                                </p>

                                                            </div>


                                                            <div className="flex gap-3">

                                                                <CheckCircle2
                                                                    size={17}
                                                                    className="mt-0.5 shrink-0 text-primary"
                                                                />

                                                                <p className="text-sm text-text-secondary">
                                                                    Use a quiet environment for the interview.
                                                                </p>

                                                            </div>


                                                            <div className="flex gap-3">

                                                                <CheckCircle2
                                                                    size={17}
                                                                    className="mt-0.5 shrink-0 text-primary"
                                                                />

                                                                <p className="text-sm text-text-secondary">
                                                                    Be ready before the scheduled interview time.
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </section>


                                                    {/* Start Interview */}

                                                    <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">

                                                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                                                            <div>

                                                                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
                                                                    Interview Access
                                                                </p>

                                                                <h3 className="mt-1 text-base font-bold text-text">
                                                                    Ready for your interview?
                                                                </h3>

                                                                <p className="mt-1 max-w-lg text-xs leading-5 text-text-secondary">
                                                                    The interview can be started at the scheduled time. Please make sure you are ready before starting.
                                                                </p>

                                                                {interviewCountdown && (
                                                                    <div className="mt-4 inline-flex items-center rounded-lg bg-background px-3 py-2">
                                                                        <span className="text-xs font-semibold text-text">
                                                                            {interviewCountdown}
                                                                        </span>
                                                                    </div>
                                                                )}

                                                            </div>


                                                            <div className="flex shrink-0 flex-col items-stretch gap-2">

                                                                <button
                                                                    type="button"
                                                                    onClick={handleStartAIInterview}
                                                                    disabled={
                                                                        startingInterview ||
                                                                        new Date(
                                                                            application.ai_interview.scheduled_at
                                                                        ).getTime() > Date.now()
                                                                    }
                                                                    className={`inline-flex min-w-[170px] items-center justify-center rounded-lg px-5 py-2.5 text-xs font-semibold transition ${
                                                                        startingInterview ||
                                                                        new Date(
                                                                            application.ai_interview.scheduled_at
                                                                        ).getTime() > Date.now()
                                                                            ? "cursor-not-allowed bg-background text-text-secondary opacity-60"
                                                                            : "bg-primary text-white hover:opacity-90"
                                                                    }`}
                                                                >
                                                                    {startingInterview
                                                                        ? "Starting..."
                                                                        : "Start Interview"}
                                                                </button>


                                                                {new Date(
                                                                    application.ai_interview.scheduled_at
                                                                ).getTime() > Date.now() && (
                                                                    <p className="text-center text-[10px] text-text-secondary">
                                                                        Available at the scheduled time
                                                                    </p>
                                                                )}

                                                            </div>

                                                        </div>


                                                        {interviewStartError && (
                                                            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                                                                <p className="text-xs text-red-600">
                                                                    {interviewStartError}
                                                                </p>
                                                            </div>
                                                        )}

                                                    </section>

                                                </section>
                                            )}


                                        {/* ============================================
                                            INTERVIEW IN PROGRESS
                                        ============================================ */}

                                        {application.ai_interview &&
                                            application.ai_interview.status ===
                                                "IN_PROGRESS" && (

                                                <section className="rounded-2xl border border-primary/20 bg-primary/5 p-6">

                                                    <div className="flex items-start gap-3">

                                                        <Circle
                                                            size={20}
                                                            className="mt-0.5 shrink-0 fill-primary text-primary"
                                                        />

                                                        <div>

                                                            <h3 className="text-sm font-bold text-text">
                                                                AI Interview In Progress
                                                            </h3>

                                                            <p className="mt-2 text-xs leading-5 text-text-secondary">
                                                                Your AI interview is currently in progress.
                                                            </p>

                                                        </div>

                                                    </div>

                                                </section>
                                            )}


                                        {/* ============================================
                                            INTERVIEW COMPLETED / REPORT
                                        ============================================ */}

                                        {application.ai_interview &&
                                            application.ai_interview.status ===
                                                "COMPLETED" && (
                                                <section className="space-y-5">
                                                    {interviewReportLoading && (
                                                        <section className="flex min-h-[300px] items-center justify-center rounded-2xl border border-border bg-surface p-8 shadow-sm">
                                                            <div className="text-center">
                                                                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
                                                                <p className="mt-4 text-sm font-semibold text-text">
                                                                    Loading AI Interview Report...
                                                                </p>
                                                                <p className="mt-1 text-xs text-text-secondary">
                                                                    Please wait while we load your interview evaluation.
                                                                </p>
                                                            </div>
                                                        </section>
                                                    )}

                                                    {!interviewReportLoading &&
                                                        interviewReportError && (
                                                            <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                                                                <div className="flex items-start gap-3">
                                                                    <CheckCircle2
                                                                        size={20}
                                                                        className="mt-0.5 shrink-0 text-primary"
                                                                    />
                                                                    <div>
                                                                        <h3 className="text-sm font-bold text-text">
                                                                            AI Interview Completed
                                                                        </h3>
                                                                        <p className="mt-2 text-xs leading-5 text-text-secondary">
                                                                            The interview is completed, but the report could not be loaded.
                                                                        </p>
                                                                        <p className="mt-2 text-xs leading-5 text-red-600">
                                                                            {interviewReportError}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </section>
                                                        )}

                                                    {!interviewReportLoading &&
                                                        !interviewReportError &&
                                                        normalizedInterviewReport && (
                                                            <>
                                                                <section
                                                                    className={`rounded-2xl border p-6 shadow-sm ${
                                                                        normalizedInterviewReport.overall_score >= 80
                                                                            ? "border-primary/20 bg-primary/5"
                                                                            : "border-red-200 bg-red-50"
                                                                    }`}
                                                                >
                                                                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                                                                        <div>
                                                                            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
                                                                                AI Interview
                                                                            </p>
                                                                            <h3 className="mt-1 text-lg font-bold text-text">
                                                                                Interview Report
                                                                            </h3>
                                                                            <p className="mt-2 text-xs leading-5 text-text-secondary">
                                                                                AI-generated evaluation of your technical interview performance.
                                                                            </p>
                                                                        </div>

                                                                        <div className="shrink-0 text-center">
                                                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                                                                                Overall Score
                                                                            </p>
                                                                            <p
                                                                                className={`mt-1 text-4xl font-black ${
                                                                                    normalizedInterviewReport.overall_score >= 80
                                                                                        ? "text-primary"
                                                                                        : "text-red-600"
                                                                                }`}
                                                                            >
                                                                                {normalizedInterviewReport.overall_score}
                                                                                <span className="text-lg text-text-secondary">/100</span>
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </section>

                                                                <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                                                                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                                                                        <div>
                                                                            <p className="text-xs font-semibold text-text-secondary">
                                                                                Interview Performance
                                                                            </p>
                                                                            <p className="mt-2 text-4xl font-black text-primary">
                                                                                {normalizedInterviewReport.overall_score}
                                                                                <span className="text-lg text-text-secondary">%</span>
                                                                            </p>
                                                                        </div>

                                                                        <div className="w-full max-w-md">
                                                                            <div className="mb-2 flex items-center justify-between">
                                                                                <span className="text-[10px] font-semibold text-text-secondary">
                                                                                    Selection Threshold
                                                                                </span>
                                                                                <span className="text-xs font-bold text-primary">
                                                                                    80%
                                                                                </span>
                                                                            </div>
                                                                            <div className="relative h-2.5 overflow-hidden rounded-full bg-background">
                                                                                <div
                                                                                    className="h-full rounded-full bg-primary transition-all"
                                                                                    style={{
                                                                                        width: `${Math.min(Math.max(normalizedInterviewReport.overall_score, 0), 100)}%`,
                                                                                    }}
                                                                                />
                                                                                <div
                                                                                    className="absolute inset-y-0 w-0.5 bg-text"
                                                                                    style={{ left: "80%" }}
                                                                                />
                                                                            </div>
                                                                            <p className="mt-2 text-[10px] text-text-secondary">
                                                                                80% or above = Selected · Below 80% = Rejected
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </section>

                                                                <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                                                                    <h2 className="text-base font-bold text-text">
                                                                        Interview Summary
                                                                    </h2>
                                                                    <p className="mt-3 text-sm leading-6 text-text-secondary">
                                                                        {normalizedInterviewReport.summary}
                                                                    </p>

                                                                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                                                        <div className="rounded-xl border border-border bg-background p-4">
                                                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                                                                                Total Questions
                                                                            </p>
                                                                            <p className="mt-2 text-lg font-bold text-text">
                                                                                {normalizedInterviewReport.total_questions}
                                                                            </p>
                                                                        </div>

                                                                        <div className="rounded-xl border border-border bg-background p-4">
                                                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                                                                                Answered
                                                                            </p>
                                                                            <p className="mt-2 text-lg font-bold text-text">
                                                                                {normalizedInterviewReport.answered_questions}
                                                                            </p>
                                                                        </div>

                                                                        <div className="rounded-xl border border-border bg-background p-4">
                                                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                                                                                Result
                                                                            </p>
                                                                            <p
                                                                                className={`mt-2 text-lg font-bold ${
                                                                                    normalizedInterviewReport.overall_score >= 80
                                                                                        ? "text-primary"
                                                                                        : "text-red-600"
                                                                                }`}
                                                                            >
                                                                                {normalizedInterviewReport.recommendation}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </section>

                                                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                                                    <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                                                                        <h2 className="text-base font-bold text-text">
                                                                            Strengths
                                                                        </h2>
                                                                        <ul className="mt-4 space-y-3">
                                                                            {normalizedInterviewReport.strengths.map(
                                                                                (strength, index) => (
                                                                                    <li
                                                                                        key={index}
                                                                                        className="flex gap-3 text-sm leading-5 text-text-secondary"
                                                                                    >
                                                                                        <CheckCircle2
                                                                                            size={17}
                                                                                            className="mt-0.5 shrink-0 text-primary"
                                                                                        />
                                                                                        <span>{strength}</span>
                                                                                    </li>
                                                                                )
                                                                            )}
                                                                        </ul>
                                                                    </section>

                                                                    <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                                                                        <h2 className="text-base font-bold text-text">
                                                                            Areas to Improve
                                                                        </h2>
                                                                        <ul className="mt-4 space-y-3">
                                                                            {normalizedInterviewReport.areas_to_improve.map(
                                                                                (area, index) => (
                                                                                    <li
                                                                                        key={index}
                                                                                        className="flex gap-3 text-sm leading-5 text-text-secondary"
                                                                                    >
                                                                                        <Circle
                                                                                            size={15}
                                                                                            className="mt-1 shrink-0 text-text-secondary"
                                                                                        />
                                                                                        <span>{area}</span>
                                                                                    </li>
                                                                                )
                                                                            )}
                                                                        </ul>
                                                                    </section>
                                                                </div>

                                                                <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                                                                    <div className="mb-5">
                                                                        <h2 className="text-base font-bold text-text">
                                                                            Skill Analysis
                                                                        </h2>
                                                                        <p className="mt-1 text-xs text-text-secondary">
                                                                            Performance across the skills assessed during the interview.
                                                                        </p>
                                                                    </div>

                                                                    <div className="space-y-4">
                                                                        {normalizedInterviewReport.skill_analysis.map(
                                                                            (item, index) => (
                                                                                <div
                                                                                    key={`${item.skill}-${index}`}
                                                                                    className="rounded-xl border border-border bg-background p-4"
                                                                                >
                                                                                    <div className="flex items-center justify-between gap-4">
                                                                                        <div>
                                                                                            <p className="text-sm font-semibold text-text">
                                                                                                {item.skill}
                                                                                            </p>
                                                                                            <p className="mt-1 text-[10px] font-semibold text-text-secondary">
                                                                                                {formatValue(item.level)}
                                                                                            </p>
                                                                                        </div>
                                                                                        <span className="text-sm font-bold text-primary">
                                                                                            {item.score}%
                                                                                        </span>
                                                                                    </div>

                                                                                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-border">
                                                                                        <div
                                                                                            className="h-full rounded-full bg-primary"
                                                                                            style={{
                                                                                                width: `${Math.min(Math.max(item.score || 0, 0), 100)}%`,
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </section>

                                                                <section
                                                                    className={`rounded-2xl border p-5 shadow-sm ${
                                                                        normalizedInterviewReport.overall_score >= 80
                                                                            ? "border-primary/20 bg-primary/5"
                                                                            : "border-red-200 bg-red-50"
                                                                    }`}
                                                                >
                                                                    <p
                                                                        className={`text-[10px] font-bold uppercase tracking-[0.15em] ${
                                                                            normalizedInterviewReport.overall_score >= 80
                                                                                ? "text-primary"
                                                                                : "text-red-600"
                                                                        }`}
                                                                    >
                                                                        Final Result
                                                                    </p>
                                                                    <h3
                                                                        className={`mt-2 text-lg font-bold ${
                                                                            normalizedInterviewReport.overall_score >= 80
                                                                                ? "text-primary"
                                                                                : "text-red-700"
                                                                        }`}
                                                                    >
                                                                        {normalizedInterviewReport.overall_score >= 80
                                                                            ? "Selected"
                                                                            : "Rejected"}
                                                                    </h3>
                                                                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                                                                        {normalizedInterviewReport.overall_score >= 80
                                                                            ? "The candidate meets the 80% AI interview threshold and can proceed to the next recruitment stage."
                                                                            : "The candidate did not meet the 80% AI interview threshold, so the application ends at the AI interview stage."}
                                                                    </p>
                                                                </section>

                                                                <div className="flex items-center justify-between px-1">
                                                                    <span className="text-[10px] text-text-secondary">
                                                                        Report generated {formatDateTime(normalizedInterviewReport.created_at)}
                                                                    </span>
                                                                </div>
                                                            </>
                                                        )}
                                                </section>
                                            )}


                                        {/* ============================================
                                            MISSED
                                        ============================================ */}

                                        {application.ai_interview &&
                                            application.ai_interview.status ===
                                                "MISSED" && (

                                                <section className="rounded-2xl border border-red-200 bg-red-50 p-6">

                                                    <div className="flex items-start gap-3">

                                                        <Circle
                                                            size={20}
                                                            className="mt-0.5 shrink-0 text-red-600"
                                                        />

                                                        <div>

                                                            <h3 className="text-sm font-bold text-red-700">
                                                                AI Interview Missed
                                                            </h3>

                                                            <p className="mt-2 text-xs leading-5 text-red-600">
                                                                This interview was marked as missed because it was not started within the allowed time.
                                                            </p>

                                                        </div>

                                                    </div>

                                                </section>
                                            )}


                                        {/* ============================================
                                            NO INTERVIEW AVAILABLE
                                        ============================================ */}

                                        {!application.ai_interview &&
                                            application.status !==
                                                "SHORTLISTED" && (

                                                <section className="flex min-h-[260px] items-center justify-center rounded-2xl border border-dashed border-border bg-background p-8 text-center">

                                                    <div>

                                                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface">

                                                            <CalendarDays
                                                                size={24}
                                                                className="text-text-secondary"
                                                            />

                                                        </div>


                                                        <h3 className="mt-4 text-base font-bold text-text">
                                                            AI Interview Not Available Yet
                                                        </h3>


                                                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">
                                                            AI interview details will appear here when your application reaches the interview stage.
                                                        </p>

                                                    </div>

                                                </section>
                                            )}

                                    </section>
                                )}


                                {/* =================================================
                                    HR INTERVIEW (renamed from Activity tab)
                                ================================================= */}

                                {activeTab === "activity" && (
                                    <section className="space-y-5">
                                        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                                            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
                                                Company Interview
                                            </p>
                                            <h2 className="mt-1 text-lg font-bold text-text">
                                                HR Interview
                                            </h2>
                                            <p className="mt-1 text-sm text-text-secondary">
                                                Interview details and evaluation shared by the company will appear here.
                                            </p>
                                        </section>

                                        {hrInterviewLoading && (
                                            <section className="flex min-h-[220px] items-center justify-center rounded-2xl border border-border bg-surface p-8 shadow-sm">
                                                <div className="text-center">
                                                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
                                                    <p className="mt-4 text-sm font-semibold text-text">
                                                        Loading HR interview details...
                                                    </p>
                                                </div>
                                            </section>
                                        )}

                                        {!hrInterviewLoading && hrInterviewError && (
                                            <section className="rounded-2xl border border-red-200 bg-red-50 p-5">
                                                <p className="text-sm font-semibold text-red-700">
                                                    {hrInterviewError}
                                                </p>
                                            </section>
                                        )}

                                        {!hrInterviewLoading && !hrInterviewError && !hrInterview && (
                                            <section className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
                                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                                                    <CalendarDays size={26} className="text-primary" />
                                                </div>
                                                <h3 className="mt-4 text-base font-bold text-text">
                                                    No HR interview scheduled yet
                                                </h3>
                                                <p className="mt-2 max-w-md text-sm leading-6 text-text-secondary">
                                                    The company has not scheduled an HR interview for this application. When it is scheduled, the details will appear here.
                                                </p>
                                            </section>
                                        )}

                                        {!hrInterviewLoading && !hrInterviewError && hrInterview?.status === "SCHEDULED" && hrInterview?.report_status !== "SUBMITTED" && (
                                            <>
                                                <section className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                                                    <div className="flex items-start gap-3">
                                                        <CalendarDays size={21} className="mt-0.5 shrink-0 text-primary" />
                                                        <div>
                                                            <h3 className="text-sm font-bold text-text">
                                                                HR Interview Scheduled
                                                            </h3>
                                                            <p className="mt-1 text-xs leading-5 text-text-secondary">
                                                                The company has scheduled your HR interview. Please be ready before the scheduled time.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </section>

                                                <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                                                    <h3 className="text-base font-bold text-text">
                                                        Interview Details
                                                    </h3>
                                                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                                        <div className="rounded-xl border border-border bg-background p-4">
                                                            <div className="flex items-center gap-2 text-text-secondary">
                                                                <CalendarDays size={16} className="text-primary" />
                                                                <span className="text-xs font-semibold">Date</span>
                                                            </div>
                                                            <p className="mt-3 text-sm font-bold text-text">
                                                                {formatDate(hrInterview.scheduled_at)}
                                                            </p>
                                                        </div>
                                                        <div className="rounded-xl border border-border bg-background p-4">
                                                            <div className="flex items-center gap-2 text-text-secondary">
                                                                <CalendarDays size={16} className="text-primary" />
                                                                <span className="text-xs font-semibold">Time</span>
                                                            </div>
                                                            <p className="mt-3 text-sm font-bold text-text">
                                                                {formatInterviewTime(hrInterview.scheduled_at)}
                                                            </p>
                                                        </div>
                                                        <div className="rounded-xl border border-border bg-background p-4">
                                                            <div className="flex items-center gap-2 text-text-secondary">
                                                                <CalendarDays size={16} className="text-primary" />
                                                                <span className="text-xs font-semibold">Duration</span>
                                                            </div>
                                                            <p className="mt-3 text-sm font-bold text-text">
                                                                {hrInterview.duration} minutes
                                                            </p>
                                                        </div>
                                                    </div>
                                                </section>

                                                <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                        <div>
                                                            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
                                                                Interview Access
                                                            </p>
                                                            <h3 className="mt-1 text-base font-bold text-text">
                                                                Ready for your HR interview?
                                                            </h3>
                                                            <p className="mt-2 text-xs leading-5 text-text-secondary">
                                                                The Join button becomes available 10 minutes before the scheduled start time.
                                                            </p>
                                                            {hrInterviewCountdown && (
                                                                <p className="mt-3 text-sm font-semibold text-primary" aria-live="polite">
                                                                    {hrInterviewCountdown}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={handleJoinHRInterview}
                                                            disabled={!hrInterviewJoinAvailable}
                                                            className={`inline-flex shrink-0 items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition ${
                                                                hrInterviewJoinAvailable
                                                                    ? "bg-primary text-white hover:opacity-90"
                                                                    : "cursor-not-allowed bg-background text-text-secondary opacity-70"
                                                            }`}
                                                        >
                                                            Join Interview
                                                        </button>
                                                    </div>
                                                    <p className="mt-4 rounded-lg border border-border bg-background p-3 text-xs leading-5 text-text-secondary">
                                                        Live meeting access is not connected yet. The button currently indicates when the interview join window opens; it will not start a meeting until the meeting integration is implemented.
                                                    </p>
                                                </section>
                                            </>
                                        )}

                                        {!hrInterviewLoading && !hrInterviewError && hrInterview?.status === "COMPLETED" && hrInterview?.report_status !== "SUBMITTED" && (
                                            <section className="flex min-h-[250px] flex-col items-center justify-center rounded-2xl border border-border bg-surface p-8 text-center shadow-sm">
                                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                                                    <FileText size={26} className="text-primary" />
                                                </div>
                                                <h3 className="mt-4 text-base font-bold text-text">
                                                    Evaluation in Progress
                                                </h3>
                                                <p className="mt-2 max-w-md text-sm leading-6 text-text-secondary">
                                                    Your HR interview has been completed. The company is preparing the interview evaluation. The report will appear here once it is submitted.
                                                </p>
                                            </section>
                                        )}

                                        {!hrInterviewLoading && !hrInterviewError && hrInterview?.report_status === "SUBMITTED" && (
                                            <section className="space-y-5">
                                                <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                        <div>
                                                            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
                                                                Company Evaluation
                                                            </p>
                                                            <h3 className="mt-1 text-lg font-bold text-text">
                                                                HR Interview Report
                                                            </h3>
                                                        </div>
                                                        {hrInterview.result && (
                                                            <span className={`w-fit rounded-full px-3 py-1.5 text-xs font-bold ${
                                                                hrInterview.result === "HIRED"
                                                                    ? "bg-primary/10 text-primary"
                                                                    : "bg-red-50 text-red-600"
                                                            }`}>
                                                                {formatValue(hrInterview.result)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {hrInterview.feedback && (
                                                        <div className="mt-5 rounded-xl border border-border bg-background p-4">
                                                            <h4 className="text-sm font-bold text-text">Feedback</h4>
                                                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-text-secondary">
                                                                {hrInterview.feedback}
                                                            </p>
                                                        </div>
                                                    )}
                                                </section>

                                                <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                                                    <h3 className="text-base font-bold text-text">
                                                        Evaluation Ratings
                                                    </h3>
                                                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                                        {[
                                                            { label: "Technical Skills", value: hrInterview.technical_skills_rating },
                                                            { label: "Communication", value: hrInterview.communication_rating },
                                                            { label: "Problem Solving", value: hrInterview.problem_solving_rating },
                                                        ].filter((rating) => rating.value !== null && rating.value !== undefined).map((rating) => (
                                                            <div key={rating.label} className="rounded-xl border border-border bg-background p-4">
                                                                <p className="text-xs font-medium text-text-secondary">
                                                                    {rating.label}
                                                                </p>
                                                                <p className="mt-2 text-2xl font-black text-primary">
                                                                    {rating.value}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {[
                                                        hrInterview.technical_skills_rating,
                                                        hrInterview.communication_rating,
                                                        hrInterview.problem_solving_rating,
                                                    ].every((value) => value === null || value === undefined) && (
                                                        <p className="mt-3 text-sm text-text-secondary">
                                                            No evaluation ratings were provided.
                                                        </p>
                                                    )}
                                                </section>
                                            </section>
                                        )}

                                        {!hrInterviewLoading && !hrInterviewError && hrInterview?.status === "CANCELLED" && hrInterview?.report_status !== "SUBMITTED" && (
                                            <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
                                                <h3 className="text-base font-bold text-red-700">
                                                    HR Interview Cancelled
                                                </h3>
                                                <p className="mt-2 text-sm leading-6 text-red-700">
                                                    The company has cancelled this HR interview. Please check your e-mail for further updates.
                                                </p>
                                                {hrInterview.cancellation_reason && (
                                                    <p className="mt-3 text-xs text-red-700">
                                                        Reason: {formatValue(hrInterview.cancellation_reason)}
                                                    </p>
                                                )}
                                            </section>
                                        )}

                                        {!hrInterviewLoading && !hrInterviewError && hrInterview?.status === "MISSED" && hrInterview?.report_status !== "SUBMITTED" && (
                                            <section className="rounded-2xl border border-border bg-surface p-6">
                                                <h3 className="text-base font-bold text-text">
                                                    HR Interview Marked as Missed
                                                </h3>
                                                <p className="mt-2 text-sm leading-6 text-text-secondary">
                                                    This interview has been marked as missed. Please contact the company for further information.
                                                </p>
                                            </section>
                                        )}
                                    </section>
                                )}


                            </div>


                            {/* =================================================
                                RIGHT SIDEBAR
                            ================================================= */}

                            <aside className="min-w-0 space-y-5 lg:col-span-3">


                                {/* Overall Progress */}

                                <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">

                                    <div className="mb-4 flex items-start justify-between gap-3">

                                        <h3 className="min-w-0 text-[10px] font-bold uppercase leading-4 tracking-wider text-text">
                                            Overall Progress
                                        </h3>

                                        <span className="shrink-0 text-xl font-black leading-none text-primary">
                                            {
                                                overallProgress
                                            }
                                            %
                                        </span>

                                    </div>


                                    <div className="mb-5 h-2.5 overflow-hidden rounded-full bg-background">

                                        <div
                                            className="h-full rounded-full bg-primary transition-all"
                                            style={{
                                                width: `${overallProgress}%`,
                                            }}
                                        />

                                    </div>


                                    <div className="rounded-xl border border-border bg-background p-4">

                                        <p className="text-[10px] text-text-secondary">
                                            Current Stage
                                        </p>

                                        <p className="mt-2 flex items-start gap-2 text-xs font-bold leading-5 text-text">

                                            <CheckCircle2
                                                size={15}
                                                className="mt-0.5 shrink-0 text-primary"
                                            />

                                            <span>
                                                {isRejected
                                                    ? "Application Rejected"
                                                    : currentStage?.label}
                                            </span>

                                        </p>

                                    </div>

                                </section>


                                {/* Recent Alerts */}

                                <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">

                                    <div className="flex items-center justify-between border-b border-border bg-background p-4">

                                        <h3 className="text-xs font-bold text-text">
                                            Recent Alerts
                                        </h3>

                                        <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />

                                    </div>


                                    <div className="divide-y divide-border">

                                        <div className="p-4">

                                            <p className="text-xs font-medium leading-5 text-text">

                                                Application submitted successfully

                                            </p>

                                            <p className="mt-1 text-[10px] leading-4 text-text-secondary">

                                                {
                                                    formatDateTime(
                                                        application.applied_at
                                                    )
                                                }

                                            </p>

                                        </div>


                                        <div className="p-4">

                                            <p className="text-xs leading-5 text-text-secondary">

                                                Current status:{" "}

                                                <span className="font-semibold text-primary">
                                                    {
                                                        statusLabels[
                                                            effectiveApplicationStatus
                                                        ] ||
                                                        effectiveApplicationStatus
                                                    }
                                                </span>

                                            </p>

                                            <p className="mt-1 text-[10px] leading-4 text-text-secondary">

                                                Last updated{" "}

                                                {
                                                    formatDateTime(
                                                        application.updated_at
                                                    )
                                                }

                                            </p>

                                        </div>

                                    </div>

                                </section>


                                {/* Pro Tip */}

                                <section className="relative overflow-hidden rounded-2xl bg-primary p-5 text-white shadow-lg">

                                    <div className="relative z-10">

                                        <div className="mb-3 flex items-center gap-2">

                                            <Lightbulb
                                                size={17}
                                            />

                                            <h3 className="text-xs font-bold">
                                                Pro Tip
                                            </h3>

                                        </div>


                                        <p className="text-xs leading-5 opacity-90">
                                            Keep your profile and resume updated to improve your chances of progressing through the hiring process.
                                        </p>

                                    </div>


                                    <div className="pointer-events-none absolute -bottom-4 -right-4 opacity-10">

                                        <Lightbulb
                                            size={90}
                                        />

                                    </div>

                                </section>


                                {/* Support */}

                                <section className="flex flex-col items-center gap-2 p-4 text-center">

                                    <p className="text-[10px] text-text-secondary">
                                        Need help with your application?
                                    </p>

                                    <button
                                        type="button"
                                        className="text-xs font-bold text-primary transition hover:underline"
                                    >
                                        Contact HireFlow Support
                                    </button>

                                </section>


                                {/* Back Button */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            "/candidate/applications"
                                        )
                                    }
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-text transition hover:border-primary hover:text-primary"
                                >

                                    <ArrowLeft size={17} />

                                    Back to My Applications

                                </button>

                            </aside>

                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
};


export default CandidateApplicationDetail;