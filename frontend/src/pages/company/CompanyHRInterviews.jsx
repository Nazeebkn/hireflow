import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Hourglass,
  RefreshCw,
  UserRound,
  Video,
  XCircle,
  CalendarClock,
  ArrowRight,
} from "lucide-react";

import CompanyDashboardLayout from "../../components/company/dashboard/CompanyDashboardLayout";
import { getCompanyProfile } from "../../services/company/companyService";
import {
  getCompanyHRInterviews,
  scheduleCompanyHRInterview,
  cancelCompanyHRInterview,
} from "../../services/company/hrInterviewService";

const tabs = [
  { key: "pending_schedule", label: "Pending schedule" },
  { key: "scheduled", label: "Scheduled" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
  { key: "missed", label: "Missed" },
];

const kpiStyles = {
  blue: {
    card: "border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50",
    icon: "bg-blue-100 ring-blue-200 text-blue-600",
    label: "text-blue-700",
    value: "text-blue-950",
    detail: "text-blue-600",
    glow: "bg-blue-200/30",
  },
  amber: {
    card: "border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50",
    icon: "bg-amber-100 ring-amber-200 text-amber-600",
    label: "text-amber-700",
    value: "text-amber-950",
    detail: "text-amber-600",
    glow: "bg-amber-200/30",
  },
  violet: {
    card: "border-violet-200 bg-gradient-to-br from-violet-50 via-white to-purple-50",
    icon: "bg-violet-100 ring-violet-200 text-violet-600",
    label: "text-violet-700",
    value: "text-violet-950",
    detail: "text-violet-600",
    glow: "bg-violet-200/30",
  },
  emerald: {
    card: "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-green-50",
    icon: "bg-emerald-100 ring-emerald-200 text-emerald-600",
    label: "text-emerald-700",
    value: "text-emerald-950",
    detail: "text-emerald-600",
    glow: "bg-emerald-200/30",
  },
};

const statusStyles = {
  SCHEDULED: "border-blue-200 bg-blue-50 text-blue-700",
  COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  CANCELLED: "border-rose-200 bg-rose-50 text-rose-700",
  MISSED: "border-amber-200 bg-amber-50 text-amber-700",
};

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getLocalDateTimeMinimum() {
  const date = new Date();
  date.setMinutes(date.getMinutes() + 1);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function toLocalDateTimeInput(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function getTimeRemaining(value, now) {
  const target = new Date(value).getTime();
  if (!Number.isFinite(target)) return null;
  const difference = target - now;
  if (difference <= 0) return 0;
  return difference;
}

function formatCountdown(milliseconds) {
  if (milliseconds === null) return "Time unavailable";
  if (milliseconds <= 0) return "Interview time reached";

  const totalSeconds = Math.floor(milliseconds / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const clock = [hours, minutes, seconds]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");

  return days > 0 ? `${days}d ${clock}` : clock;
}

function KpiCard({ title, value, description, icon: Icon, color }) {
  const style = kpiStyles[color];

  return (
    <div
      className={`group relative min-h-[150px] overflow-hidden rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6 ${style.card}`}
    >
      <div
        className={`absolute -right-8 -top-8 h-28 w-28 rounded-full blur-2xl ${style.glow}`}
      />
      <div className="relative flex h-full items-start justify-between gap-4">
        <div className="min-w-0">
          <p className={`text-sm font-semibold ${style.label}`}>{title}</p>
          <p className={`mt-3 text-3xl font-bold tabular-nums ${style.value}`}>
            {value}
          </p>
          <p className={`mt-1.5 text-xs font-medium ${style.detail}`}>
            {description}
          </p>
        </div>
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${style.icon}`}
        >
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

function CandidateAvatar({ item }) {
  if (item.profile_picture) {
    return (
      <img
        src={item.profile_picture}
        alt={item.candidate_name || "Candidate"}
        className="h-14 w-14 rounded-2xl border border-border object-cover"
      />
    );
  }

  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-background text-text-secondary">
      <UserRound size={24} />
    </div>
  );
}

function CompanyHRInterviews() {
  const navigate = useNavigate();
  const [companyProfile, setCompanyProfile] = useState(null);
  const [interviews, setInterviews] = useState({
    pending_schedule: [],
    scheduled: [],
    completed: [],
    cancelled: [],
    missed: [],
  });

  const [activeTab, setActiveTab] = useState("pending_schedule");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [scheduledAt, setScheduledAt] = useState("");
  const [duration, setDuration] = useState("30");
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [rescheduleNote, setRescheduleNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [scheduleError, setScheduleError] = useState("");

  const [selectedCancelInterview, setSelectedCancelInterview] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [cancellationNote, setCancellationNote] = useState("");
  const [cancelSaving, setCancelSaving] = useState(false);
  const [cancelError, setCancelError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [joinNotice, setJoinNotice] = useState("");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const fetchInterviews = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      setError("");

      const data = await getCompanyHRInterviews();

      setInterviews({
        pending_schedule: data?.pending_schedule || [],
        scheduled: data?.scheduled || [],
        completed: data?.completed || [],
        cancelled: data?.cancelled || [],
        missed: data?.missed || [],
      });
    } catch (fetchError) {
      console.error(
        "Failed to load HR interviews:",
        fetchError?.response?.data || fetchError
      );

      setError(
        fetchError?.response?.data?.message ||
          fetchError?.response?.data?.detail ||
          "Unable to load HR interviews."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const loadPage = async () => {
      try {
        const profile = await getCompanyProfile();
        setCompanyProfile(profile);
      } catch (profileError) {
        console.error(
          "Failed to load company profile:",
          profileError?.response?.data || profileError
        );
      }

      await fetchInterviews();
    };

    loadPage();
  }, [fetchInterviews]);

  const openScheduleModal = (application) => {
    setSelectedApplication({
      applicationId: application.id,
      candidate_name: application.candidate_name,
      job_title: application.job_title,
      isReschedule: false,
    });

    setScheduledAt("");
    setDuration("30");
    setRescheduleReason("");
    setRescheduleNote("");
    setScheduleError("");
    setSuccessMessage("");
  };

  const openRescheduleModal = (interview) => {
    setSelectedApplication({
      applicationId: interview.application_id,
      candidate_name: interview.candidate_name,
      job_title: interview.job_title,
      isReschedule: true,
    });

    setScheduledAt(toLocalDateTimeInput(interview.scheduled_at));
    setDuration(String(interview.duration || 30));
    setRescheduleReason("");
    setRescheduleNote("");
    setScheduleError("");
    setSuccessMessage("");
  };

  const closeScheduleModal = () => {
    if (saving) return;
    setSelectedApplication(null);
    setScheduleError("");
  };

  const handleSchedule = async (event) => {
    event.preventDefault();
    if (!selectedApplication) return;

    const selectedDate = new Date(scheduledAt);

    if (
      !scheduledAt ||
      Number.isNaN(selectedDate.getTime()) ||
      selectedDate <= new Date()
    ) {
      setScheduleError("Please select a future date and time.");
      return;
    }

    const durationValue = Number(duration);

    if (!Number.isInteger(durationValue) || durationValue <= 0) {
      setScheduleError("Enter a valid interview duration.");
      return;
    }

    if (selectedApplication.isReschedule) {
      if (!rescheduleReason) {
        setScheduleError("Please select a reschedule reason.");
        return;
      }

      if (rescheduleReason === "OTHER" && !rescheduleNote.trim()) {
        setScheduleError("Please provide a reschedule explanation.");
        return;
      }

      if (
        rescheduleNote.trim() &&
        !/^[A-Za-z ]+$/.test(rescheduleNote.trim())
      ) {
        setScheduleError(
          "Only English letters and spaces are allowed."
        );
        return;
      }
    }

    try {
      setSaving(true);
      setScheduleError("");

      await scheduleCompanyHRInterview(selectedApplication.applicationId, {
        scheduled_at: selectedDate.toISOString(),
        duration: durationValue,
        ...(selectedApplication.isReschedule
          ? {
              reschedule_reason: rescheduleReason,
              reschedule_note: rescheduleNote.trim(),
            }
          : {}),
      });

      const wasRescheduled = selectedApplication.isReschedule;

      setSelectedApplication(null);
      setSuccessMessage(
        wasRescheduled
          ? "HR interview rescheduled successfully."
          : "HR interview scheduled successfully."
      );

      setActiveTab("scheduled");
      await fetchInterviews(true);
    } catch (scheduleFailure) {
      console.error(
        "Failed to save HR interview schedule:",
        scheduleFailure?.response?.data || scheduleFailure
      );

      setScheduleError(
        scheduleFailure?.response?.data?.message ||
          scheduleFailure?.response?.data?.detail ||
          "Unable to save the HR interview schedule."
      );
    } finally {
      setSaving(false);
    }
  };

  const openCancelModal = (interview) => {
    setSelectedCancelInterview(interview);
    setCancellationReason("");
    setCancellationNote("");
    setCancelError("");
  };

  const closeCancelModal = () => {
    if (cancelSaving) return;
    setSelectedCancelInterview(null);
    setCancelError("");
  };

  const handleCancelInterview = async (event) => {
    event.preventDefault();
    if (!selectedCancelInterview) return;

    if (!cancellationReason) {
      setCancelError("Please select a cancellation reason.");
      return;
    }

    if (
      cancellationReason === "OTHER" &&
      !cancellationNote.trim()
    ) {
      setCancelError("Please provide an explanation for Other.");
      return;
    }

    if (
      cancellationNote.trim() &&
      !/^[A-Za-z ]+$/.test(cancellationNote.trim())
    ) {
      setCancelError(
        "Only English letters and spaces are allowed in additional details."
      );
      return;
    }

    try {
      setCancelSaving(true);
      setCancelError("");

      await cancelCompanyHRInterview(
        selectedCancelInterview.application_id,
        {
          cancellation_reason: cancellationReason,
          cancellation_note: cancellationNote.trim(),
        }
      );

      setSelectedCancelInterview(null);
      setSuccessMessage("HR interview cancelled successfully.");
      setActiveTab("cancelled");

      await fetchInterviews(true);
    } catch (cancelFailure) {
      console.error(
        "Failed to cancel HR interview:",
        cancelFailure?.response?.data || cancelFailure
      );

      setCancelError(
        cancelFailure?.response?.data?.message ||
          cancelFailure?.response?.data?.detail ||
          cancelFailure?.response?.data?.cancellation_reason?.[0] ||
          "Unable to cancel the HR interview."
      );
    } finally {
      setCancelSaving(false);
    }
  };

  const currentItems = interviews[activeTab] || [];

  const totalInterviews =
    interviews.scheduled.length +
    interviews.completed.length +
    interviews.cancelled.length +
    interviews.missed.length;

  const todayCount = useMemo(
    () =>
      interviews.scheduled.filter((item) => {
        const date = new Date(item.scheduled_at);
        const today = new Date(now);

        return (
          date.getFullYear() === today.getFullYear() &&
          date.getMonth() === today.getMonth() &&
          date.getDate() === today.getDate()
        );
      }).length,
    [interviews.scheduled, now]
  );

  const handleJoinInterview = (item) => {
    if (!item?.id) {
      setError("Invalid HR interview ID.");
      return;
    }

    navigate(`/company/hr-interviews/${item.id}/room`);
  };

  return (
    <CompanyDashboardLayout
      title="HR Interviews"
      subtitle="Schedule and manage candidate HR interviews."
      companyProfile={companyProfile}
    >
      <div className="space-y-7">
        {/* Page heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 ring-1 ring-inset ring-violet-200">
              <Video size={14} />
              Interview management
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">
              HR Interview Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-text-secondary sm:text-base">
              Coordinate interviews with candidates who passed AI screening.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchInterviews(true)}
            disabled={refreshing || loading}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text shadow-sm transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {successMessage && (
          <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            {successMessage}
          </div>
        )}

        {joinNotice && (
          <div className="flex items-start justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <div className="flex items-start gap-2">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{joinNotice}</span>
            </div>

            <button
              type="button"
              onClick={() => setJoinNotice("")}
              className="rounded-md p-1 hover:bg-amber-100"
              aria-label="Dismiss notice"
            >
              <XCircle size={17} />
            </button>
          </div>
        )}

        {/* KPI cards */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-text">Overview</h2>
            <span className="text-xs text-text-secondary">
              Live interview counts
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              title="Pending schedule"
              value={interviews.pending_schedule.length}
              description="Waiting for a date and time"
              icon={CalendarClock}
              color="amber"
            />

            <KpiCard
              title="Scheduled interviews"
              value={interviews.scheduled.length}
              description="Upcoming interview sessions"
              icon={CalendarDays}
              color="blue"
            />

            <KpiCard
              title="Today’s interviews"
              value={todayCount}
              description="Scheduled for today"
              icon={Hourglass}
              color="violet"
            />

            <KpiCard
              title="Completed interviews"
              value={interviews.completed.length}
              description={`${totalInterviews} total recorded interviews`}
              icon={CheckCircle2}
              color="emerald"
            />
          </div>
        </section>
                {/* Tabs and list */}
        <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          <div className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <h2 className="font-semibold text-text">Interview pipeline</h2>
              <p className="mt-1 text-xs text-text-secondary">
                Review candidate schedules and interview progress.
              </p>
            </div>

            <span className="w-fit rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
              {currentItems.length}{" "}
              {currentItems.length === 1 ? "record" : "records"}
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto border-b border-border px-4 pt-3 sm:px-5">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveTab(tab.key);
                  setSuccessMessage("");
                  setJoinNotice("");
                }}
                className={`whitespace-nowrap rounded-t-lg border-b-2 px-3 py-3 text-sm font-semibold transition ${
                  activeTab === tab.key
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-transparent text-text-secondary hover:bg-background hover:text-text"
                }`}
              >
                {tab.label}
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                    activeTab === tab.key
                      ? "bg-primary/10 text-primary"
                      : "bg-background text-text-secondary"
                  }`}
                >
                  {interviews[tab.key].length}
                </span>
              </button>
            ))}
          </div>

          {error ? (
            <div className="px-6 py-14 text-center">
              <AlertCircle className="mx-auto text-rose-500" size={30} />
              <p className="mt-3 text-sm font-medium text-rose-600">
                {error}
              </p>

              <button
                type="button"
                onClick={() => fetchInterviews()}
                className="mt-4 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
              >
                Try again
              </button>
            </div>
          ) : loading ? (
            <div className="space-y-4 p-5">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-32 animate-pulse rounded-2xl bg-background"
                />
              ))}
            </div>
          ) : currentItems.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-background text-text-secondary">
                <CalendarDays size={26} />
              </div>

              <h3 className="mt-4 font-semibold text-text">
                No {tabs.find((tab) => tab.key === activeTab)?.label.toLowerCase()} interviews
              </h3>

              <p className="mx-auto mt-1 max-w-sm text-sm text-text-secondary">
                Interviews that match this stage will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3 p-4 sm:p-5">
              {currentItems.map((item) => {
                const isPending = activeTab === "pending_schedule";

                const remaining = isPending
                  ? null
                  : getTimeRemaining(item.scheduled_at, now);

                const joinEnabled = !isPending && remaining === 0;

                const rescheduleAllowed =
                  !isPending &&
                  item.status === "SCHEDULED" &&
                  remaining !== null &&
                  remaining > 60 * 60 * 1000;

                const cancelAllowed =
                  !isPending &&
                  item.status === "SCHEDULED" &&
                  remaining !== null &&
                  remaining > 0;

                return (
                  <article
                    key={`${activeTab}-${item.id}`}
                    className="rounded-2xl border border-border bg-white p-4 transition hover:border-primary/30 hover:shadow-md sm:p-5"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                      <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
                        <CandidateAvatar item={item} />

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate font-semibold text-text">
                              {item.candidate_name || "Candidate"}
                            </h3>

                            {!isPending && (
                              <span
                                className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                                  statusStyles[item.status] ||
                                  "border-border bg-background text-text-secondary"
                                }`}
                              >
                                {item.status?.toLowerCase() || "Unknown"}
                              </span>
                            )}
                          </div>

                          <p className="mt-1 truncate text-sm text-text-secondary">
                            {item.job_title || "Job title unavailable"}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-text-secondary">
                            <span>
                              AI score:{" "}
                              <strong className="text-text">
                                {item.ai_score ?? "N/A"}
                                {item.ai_score != null ? "%" : ""}
                              </strong>
                            </span>

                            {!isPending && (
                              <>
                                <span className="inline-flex items-center gap-1.5">
                                  <CalendarDays size={14} />
                                  {formatDate(item.scheduled_at)}
                                </span>

                                <span className="inline-flex items-center gap-1.5">
                                  <Clock3 size={14} />
                                  {item.duration} minutes
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {isPending ? (
                        <button
                          type="button"
                          onClick={() => openScheduleModal(item)}
                          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
                        >
                          <CalendarDays size={16} />
                          Schedule interview
                          <ArrowRight size={15} />
                        </button>
                      ) : activeTab === "scheduled" ? (
                        <div className="flex w-full flex-col gap-3 rounded-xl bg-background p-3 lg:w-[340px] lg:shrink-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-text-secondary">
                              {remaining === 0
                                ? "Scheduled start time"
                                : "Time until interview"}
                            </span>

                            <span
                              className={`text-xs font-semibold ${
                                remaining === 0
                                  ? "text-emerald-700"
                                  : "text-primary"
                              }`}
                            >
                              {remaining === 0
                                ? "Ready to start"
                                : "Upcoming"}
                            </span>
                          </div>

                          <p className="font-mono text-2xl font-bold tabular-nums tracking-tight text-text">
                            {formatCountdown(remaining)}
                          </p>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => openRescheduleModal(item)}
                              disabled={!rescheduleAllowed}
                              title={
                                rescheduleAllowed
                                  ? "Reschedule interview"
                                  : "Rescheduling closes one hour before the interview"
                              }
                              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-white px-3 py-2.5 text-xs font-semibold text-text transition hover:border-primary/40 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <RefreshCw size={14} />
                              Reschedule
                            </button>

                            <button
                              type="button"
                              onClick={() => openCancelModal(item)}
                              disabled={!cancelAllowed}
                              title={
                                cancelAllowed
                                  ? "Cancel interview"
                                  : "Interview can no longer be cancelled"
                              }
                              className="inline-flex items-center justify-center gap-2 rounded-lg border border-rose-200 bg-white px-3 py-2.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <XCircle size={14} />
                              Cancel interview
                            </button>

                            <button
                              type="button"
                              onClick={() => handleJoinInterview(item)}
                              disabled={!joinEnabled}
                              title={
                                joinEnabled
                                  ? "Interview time has arrived"
                                  : "Join will be available when the scheduled time arrives"
                              }
                              className="col-span-2 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
                            >
                              <Video size={14} />
                              Join interview
                            </button>
                          </div>

                          {!rescheduleAllowed &&
                            remaining !== null &&
                            remaining > 0 && (
                              <p className="text-[11px] text-amber-700">
                                Rescheduling closes 1 hour before the start
                                time.
                              </p>
                            )}
                        </div>
                      ) : (
                        <div className="flex shrink-0 items-center gap-2 rounded-xl bg-background px-4 py-3 text-sm font-semibold text-text-secondary">
                          {item.status === "COMPLETED" ? (
                            <CheckCircle2
                              size={17}
                              className="text-emerald-600"
                            />
                          ) : item.status === "CANCELLED" ? (
                            <XCircle size={17} className="text-rose-600" />
                          ) : (
                            <Clock3 size={17} />
                          )}

                          {item.status?.toLowerCase() || "Unknown"}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Schedule / Reschedule modal */}
      {selectedApplication && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/55 px-4 py-6 backdrop-blur-sm">
          <div className="my-auto w-full max-w-lg rounded-2xl border border-border bg-surface p-5 shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <CalendarClock size={14} />
                  {selectedApplication.isReschedule
                    ? "Update schedule"
                    : "New schedule"}
                </div>

                <h2 className="text-xl font-bold text-text">
                  {selectedApplication.isReschedule
                    ? "Reschedule HR interview"
                    : "Schedule HR interview"}
                </h2>

                <p className="mt-1 text-sm text-text-secondary">
                  {selectedApplication.candidate_name} ·{" "}
                  {selectedApplication.job_title}
                </p>
              </div>

              <button
                type="button"
                onClick={closeScheduleModal}
                disabled={saving}
                className="rounded-lg p-2 text-text-secondary transition hover:bg-background disabled:opacity-50"
                aria-label="Close modal"
              >
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleSchedule} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-text">
                  Interview date and time
                </label>

                <input
                  type="datetime-local"
                  required
                  min={getLocalDateTimeMinimum()}
                  value={scheduledAt}
                  onChange={(event) => setScheduledAt(event.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-text">
                  Interview duration
                </label>

                <select
                  value={duration}
                  onChange={(event) => setDuration(event.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </select>
              </div>

              {selectedApplication.isReschedule && (
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-text">
                      Reschedule reason{" "}
                      <span className="text-rose-600">*</span>
                    </label>

                    <select
                      required
                      value={rescheduleReason}
                      onChange={(event) => {
                        setRescheduleReason(event.target.value);
                        setRescheduleNote("");
                        setScheduleError("");
                      }}
                      className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                    >
                      <option value="">Select a reason</option>
                      <option value="INTERVIEWER_UNAVAILABLE">
                        Interviewer Unavailable
                      </option>
                      <option value="TECHNICAL_ISSUES">
                        Technical Issues
                      </option>
                      <option value="COMPANY_SCHEDULING_CONFLICT">
                        Company Scheduling Conflict
                      </option>
                      <option value="INTERNAL_OPERATIONAL_ISSUE">
                        Internal Operational Issue
                      </option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  {rescheduleReason && (
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-text">
                        Additional details{" "}
                        {rescheduleReason === "OTHER" ? (
                          <span className="text-rose-600">*</span>
                        ) : (
                          <span className="font-normal text-text-secondary">
                            (Optional)
                          </span>
                        )}
                      </label>

                      <textarea
                        required={rescheduleReason === "OTHER"}
                        rows={3}
                        maxLength={1000}
                        value={rescheduleNote}
                        onChange={(event) => {
                          setRescheduleNote(event.target.value);
                          setScheduleError("");
                        }}
                        placeholder={
                          rescheduleReason === "OTHER"
                            ? "Explain the reschedule reason..."
                            : "Add any additional details (optional)"
                        }
                        className="w-full resize-y rounded-xl border border-border bg-background px-3 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                      />
                      <p className="mt-1 text-xs text-text-secondary">
                        Use English letters and spaces only. This will be shared
                        with the candidate.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {scheduleError && (
                <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700">
                  <AlertCircle size={17} className="mt-0.5 shrink-0" />
                  {scheduleError}
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeScheduleModal}
                  disabled={saving}
                  className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-text transition hover:bg-background disabled:opacity-50"
                >
                  Close
                </button>

                <button
                  type="submit"
                  disabled={saving || !scheduledAt}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : selectedApplication.isReschedule
                      ? "Update schedule"
                      : "Confirm schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel interview modal */}
      {selectedCancelInterview && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto bg-slate-950/55 px-4 py-6 backdrop-blur-sm">
          <div className="my-auto w-full max-w-lg rounded-2xl border border-border bg-surface p-5 shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                  <XCircle size={14} />
                  Cancel interview
                </div>

                <h2 className="text-xl font-bold text-text">
                  Cancel HR interview?
                </h2>

                <p className="mt-1 text-sm text-text-secondary">
                  {selectedCancelInterview.candidate_name} ·{" "}
                  {selectedCancelInterview.job_title}
                </p>
              </div>

              <button
                type="button"
                onClick={closeCancelModal}
                disabled={cancelSaving}
                className="rounded-lg p-2 text-text-secondary transition hover:bg-background disabled:opacity-50"
                aria-label="Close modal"
              >
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleCancelInterview} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-text">
                  Cancellation reason <span className="text-rose-600">*</span>
                </label>

                <select
                  required
                  value={cancellationReason}
                  onChange={(event) => {
                    setCancellationReason(event.target.value);
                    setCancelError("");
                    if (event.target.value !== "OTHER") {
                      setCancellationNote("");
                    }
                  }}
                  className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                >
                  <option value="">Select a reason</option>
                  <option value="JOB_POSITION_CLOSED">
                    Job Position Closed
                  </option>
                  <option value="HIRING_PROCESS_STOPPED">
                    Hiring Process Stopped
                  </option>
                  <option value="COMPANY_DECIDED_NOT_TO_PROCEED">
                    Company Decided Not to Proceed
                  </option>
                  <option value="POSITION_FILLED">
                    Position Filled
                  </option>
                  <option value="DUPLICATE_INTERVIEW">
                    Duplicate Interview
                  </option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {cancellationReason === "OTHER" && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-text">
                    Additional explanation{" "}
                    <span className="text-rose-600">*</span>
                  </label>

                  <textarea
                    required
                    rows={4}
                    maxLength={1000}
                    value={cancellationNote}
                    onChange={(event) =>
                      setCancellationNote(event.target.value)
                    }
                    placeholder="Explain the cancellation reason..."
                    className="w-full resize-y rounded-xl border border-border bg-background px-3 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              )}

              {cancellationReason &&
                cancellationReason !== "OTHER" && (
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-text">
                      Additional details{" "}
                      <span className="font-normal text-text-secondary">
                        (Optional)
                      </span>
                    </label>

                    <textarea
                      rows={3}
                      maxLength={1000}
                      value={cancellationNote}
                      onChange={(event) =>
                        setCancellationNote(event.target.value)
                      }
                      placeholder="Add any additional details (optional)"
                      className="w-full resize-y rounded-xl border border-border bg-background px-3 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                )}

              <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-xs text-amber-800">
                The candidate will be notified about this cancellation by
                email and dashboard notification.
              </div>

              {cancelError && (
                <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700">
                  <AlertCircle size={17} className="mt-0.5 shrink-0" />
                  {cancelError}
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeCancelModal}
                  disabled={cancelSaving}
                  className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-text transition hover:bg-background disabled:opacity-50"
                >
                  Keep interview
                </button>

                <button
                  type="submit"
                  disabled={
                    cancelSaving ||
                    !cancellationReason ||
                    (cancellationReason === "OTHER" &&
                      !cancellationNote.trim())
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {cancelSaving ? "Cancelling..." : "Confirm cancellation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </CompanyDashboardLayout>
  );
}

export default CompanyHRInterviews;