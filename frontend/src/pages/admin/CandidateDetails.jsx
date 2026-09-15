import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Globe,
  MapPin,
  MoreVertical,
  Phone,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserRound,
  Ban,
  X,
} from "lucide-react";

import DashboardSidebar from "../../components/admin/dashboard/DashboardSidebar";
import DashboardNavbar from "../../components/admin/dashboard/DashboardNavbar";

import CandidateKpiCards from "../../components/admin/candidate-details/CandidateKpiCards";
import CandidateTabs from "../../components/admin/candidate-details/CandidateTabs";
import CandidateOverview from "../../components/admin/candidate-details/CandidateOverview";
import CandidateApplications from "../../components/admin/candidate-details/CandidateApplications";
import CandidateHiringTimeline from "../../components/admin/candidate-details/CandidateHiringTimeline";

import {
  getCandidateDetails,
  getCandidateApplications,
  suspendCandidate,
  activateCandidate,
} from "../../services/admin/adminService";


/* =========================================================
   HELPERS
========================================================= */

function formatDate(dateValue) {
  if (!dateValue) {
    return "Not specified";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Not specified";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}


/* =========================================================
   MAIN COMPONENT
========================================================= */

function CandidateDetails() {
  const navigate = useNavigate();
  const { candidateId } = useParams();

  const [candidate, setCandidate] = useState(null);
const [applications, setApplications] = useState([]);

const [applicationStats, setApplicationStats] = useState({
  total_applications: 0,
  selected_applications: 0,
  interview_count: 0,
  hired_count: 0,
});
  const [loading, setLoading] = useState(true);
  const [applicationsLoading, setApplicationsLoading] =
    useState(false);

  const [activeTab, setActiveTab] = useState("overview");

  const [showMenu, setShowMenu] = useState(false);

  const [showSuspendModal, setShowSuspendModal] =
    useState(false);

  const [suspending, setSuspending] = useState(false);
  const [activating, setActivating] = useState(false);


  /* =====================================================
     FETCH CANDIDATE
  ===================================================== */

  const fetchCandidateDetails = async () => {
    try {
      setLoading(true);

      const data = await getCandidateDetails(candidateId);

      console.log("CANDIDATE DETAILS:", data);

      setCandidate(data);
    } catch (error) {
      console.error(
        "Failed to fetch candidate details:",
        error
      );
    } finally {
      setLoading(false);
    }
  };


  /* =====================================================
     FETCH APPLICATIONS
  ===================================================== */
const fetchCandidateApplications = async () => {
  try {
    setApplicationsLoading(true);

    const data = await getCandidateApplications(candidateId);

    console.log("CANDIDATE APPLICATIONS:", data);

    setApplications(
      Array.isArray(data?.applications)
        ? data.applications
        : []
    );

    setApplicationStats({
      total_applications:
        data?.total_applications ?? 0,

      selected_applications:
        data?.selected_applications ?? 0,

      interview_count:
        data?.interview_count ?? 0,

      hired_count:
        data?.hired_count ?? 0,
    });
  } catch (error) {
    console.error(
      "Failed to fetch candidate applications:",
      error
    );

    setApplications([]);

    setApplicationStats({
      total_applications: 0,
      selected_applications: 0,
      interview_count: 0,
      hired_count: 0,
    });
  } finally {
    setApplicationsLoading(false);
  }
};
  /* =====================================================
     INITIAL FETCH
  ===================================================== */

  useEffect(() => {
    fetchCandidateDetails();
    fetchCandidateApplications();
  }, [candidateId]);


  /* =====================================================
     SUSPEND
  ===================================================== */

  const handleSuspend = async () => {
    if (!candidate?.user) {
      alert("Candidate user ID not found.");
      return;
    }

    try {
      setSuspending(true);

      await suspendCandidate(candidate.user);

      setShowSuspendModal(false);

      await fetchCandidateDetails();
    } catch (error) {
      console.error(
        "Failed to suspend candidate:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to suspend candidate."
      );
    } finally {
      setSuspending(false);
    }
  };


  /* =====================================================
     ACTIVATE
  ===================================================== */

  const handleActivate = async () => {
    if (!candidate?.user) {
      alert("Candidate user ID not found.");
      return;
    }

    try {
      setActivating(true);

      await activateCandidate(candidate.user);

      await fetchCandidateDetails();
    } catch (error) {
      console.error(
        "Failed to activate candidate:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to activate candidate."
      );
    } finally {
      setActivating(false);
    }
  };


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <AdminPageShell>
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">

            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />

            <p className="text-sm text-text-secondary">
              Loading candidate details...
            </p>

          </div>
        </div>
      </AdminPageShell>
    );
  }


  /* =====================================================
     NOT FOUND
  ===================================================== */

  if (!candidate) {
    return (
      <AdminPageShell>
        <div className="flex min-h-[70vh] items-center justify-center px-6">

          <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-primary">
              <UserRound size={30} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-text">
              Candidate not found
            </h2>

            <p className="mt-2 text-sm text-text-secondary">
              The requested candidate could not be found.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/admin/candidates")
              }
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              <ArrowLeft size={17} />
              Back to Candidates
            </button>

          </div>

        </div>
      </AdminPageShell>
    );
  }


  /* =====================================================
     DATA
  ===================================================== */

  const isActive = candidate.is_active === true;

 const candidateWithApplications = {
  ...candidate,
  applications,
  application_count:
    applicationStats.total_applications,
  selected_applications:
    applicationStats.selected_applications,
  interview_count:
    applicationStats.interview_count,
  hired_count:
    applicationStats.hired_count,
};

  return (
    <AdminPageShell>

      <div className="min-h-screen bg-[#f8f9ff]">

        <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">


          {/* =================================================
              BREADCRUMB
          ================================================= */}

          <div className="mb-5 flex items-center gap-2 overflow-x-auto whitespace-nowrap text-sm text-text-secondary">

            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="transition hover:text-primary"
            >
              Dashboard
            </button>

            <ChevronRight size={15} />

            <button
              type="button"
              onClick={() =>
                navigate("/admin/candidates")
              }
              className="transition hover:text-primary"
            >
              Candidates
            </button>

            <ChevronRight size={15} />

            <span className="font-semibold text-primary">
              {candidate.first_name}{" "}
              {candidate.last_name}
            </span>

          </div>


          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div className="min-w-0">

              <div className="flex items-center gap-2">

                <h1 className="truncate text-2xl font-bold tracking-tight text-text sm:text-3xl">
                  {candidate.first_name}{" "}
                  {candidate.last_name}
                </h1>

                <CheckCircle2
                  size={21}
                  className="shrink-0 text-secondary"
                  fill="currentColor"
                />

              </div>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary sm:text-base">
                Review candidate profile, applications,
                account status and hiring activity.
              </p>

            </div>


            {/* ACTIONS */}

            <div className="flex items-center gap-2">

              {isActive ? (
                <button
                  type="button"
                  onClick={() =>
                    setShowSuspendModal(true)
                  }
                  className="rounded-lg bg-red-100 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-200"
                >
                  Suspend Candidate
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleActivate}
                  disabled={activating}
                  className="rounded-lg bg-emerald-100 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-200 disabled:opacity-60"
                >
                  {activating
                    ? "Activating..."
                    : "Activate Candidate"}
                </button>
              )}


              <div className="relative">

                <button
                  type="button"
                  onClick={() =>
                    setShowMenu(
                      (previous) => !previous
                    )
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-white text-text-secondary transition hover:bg-slate-100 hover:text-text"
                >
                  <MoreVertical size={18} />
                </button>


                {showMenu && (
                  <div className="absolute right-0 top-12 z-30 w-48 rounded-xl border border-border bg-white p-1 shadow-xl">

                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        navigate(
                          "/admin/candidates"
                        );
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-text transition hover:bg-slate-50"
                    >
                      <ArrowLeft size={16} />
                      Back to Candidates
                    </button>

                  </div>
                )}

              </div>

            </div>

          </div>


          {/* =================================================
              CANDIDATE HERO
          ================================================= */}

          <section className="mb-6 rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-7">

            <div className="flex flex-col gap-6 md:flex-row md:items-center">


              {/* PROFILE IMAGE */}

              <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-slate-50">

                {candidate.profile_picture ? (
                  <img
                    src={candidate.profile_picture}
                    alt={`${candidate.first_name || ""} ${
                      candidate.last_name || ""
                    }`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound
                    size={38}
                    className="text-primary"
                  />
                )}

              </div>


              {/* CANDIDATE DETAILS */}

              <div className="min-w-0 flex-1">

                <div className="mb-4 flex flex-wrap gap-2">

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white">

                    <Sparkles size={13} />

                    Candidate Profile

                  </span>


                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                      isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >

                    <span
                      className={`h-2 w-2 rounded-full ${
                        isActive
                          ? "bg-emerald-500"
                          : "bg-red-500"
                      }`}
                    />

                    {isActive
                      ? "Active"
                      : "Suspended"}

                  </span>

                </div>


                <h2 className="text-2xl font-bold text-text sm:text-3xl">
                  {candidate.first_name}{" "}
                  {candidate.last_name}
                </h2>


                {candidate.headline && (
                  <p className="mt-1.5 text-sm font-medium text-text-secondary">
                    {candidate.headline}
                  </p>
                )}


                <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">

                  <HeroInfo
                    icon={MapPin}
                    value={
                      candidate.location ||
                      "Location not provided"
                    }
                  />

                  <HeroInfo
                    icon={Phone}
                    value={
                      candidate.phone_number ||
                      "Phone not provided"
                    }
                  />

                  <HeroInfo
                    icon={CalendarDays}
                    value={formatDate(
                      candidate.date_of_birth
                    )}
                  />

                  <HeroInfo
                    icon={UserRound}
                    value={
                      candidate.gender ||
                      "Gender not provided"
                    }
                  />

                  <HeroInfo
                    icon={CalendarDays}
                    value={`Joined ${formatDate(
                      candidate.created_at
                    )}`}
                  />

                  {candidate.linkedin_url ? (
                    <a
                      href={candidate.linkedin_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex min-w-0 items-center gap-2 text-sm text-text-secondary transition hover:text-primary"
                    >
                      <Globe
                        size={17}
                        className="shrink-0"
                      />

                      <span className="truncate">
                        LinkedIn Profile
                      </span>

                      <ExternalLink
                        size={13}
                        className="shrink-0"
                      />
                    </a>
                  ) : (
                    <HeroInfo
                      icon={Globe}
                      value="LinkedIn not provided"
                    />
                  )}

                </div>

              </div>

            </div>


            {/* =================================================
                CANDIDATE INFORMATION CARDS
            ================================================= */}

            <div className="mt-7 grid grid-cols-1 gap-3 border-t border-border pt-6 sm:grid-cols-2 lg:grid-cols-3">

              <CandidateInfoCard
                label="Full Name"
                value={`${candidate.first_name || ""} ${
                  candidate.last_name || ""
                }`.trim()}
                icon={UserRound}
              />

              <CandidateInfoCard
                label="Gender"
                value={
                  candidate.gender ||
                  "Not specified"
                }
                icon={UserRound}
              />

              <CandidateInfoCard
                label="Date of Birth"
                value={formatDate(
                  candidate.date_of_birth
                )}
                icon={CalendarDays}
              />

              <CandidateInfoCard
                label="Location"
                value={
                  candidate.location ||
                  "Not specified"
                }
                icon={MapPin}
              />

              <CandidateInfoCard
                label="Phone"
                value={
                  candidate.phone_number ||
                  "Not specified"
                }
                icon={Phone}
              />

              <CandidateInfoCard
                label="Account Status"
                value={
                  isActive
                    ? "Active Account"
                    : "Suspended Account"
                }
                icon={
                  isActive
                    ? ShieldCheck
                    : ShieldAlert
                }
                success={isActive}
              />

            </div>

          </section>


          {/* =================================================
              KPI CARDS
          ================================================= */}

          <div className="mb-6">

            <CandidateKpiCards
              candidate={candidateWithApplications}
            />

          </div>


          {/* =================================================
              TABS
          ================================================= */}

          <div className="mb-6 overflow-x-auto border-b border-border">

            <CandidateTabs
              activeTab={activeTab}
              onChange={setActiveTab}
            />

          </div>


          {/* =================================================
              OVERVIEW
          ================================================= */}

          {activeTab === "overview" && (
            <CandidateOverview
              candidate={candidate}
            />
          )}


          {/* =================================================
              APPLICATIONS
          ================================================= */}

          {activeTab === "applications" && (

            <div className="space-y-5">

              {applicationsLoading ? (
                <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-border bg-white">

                  <div className="flex flex-col items-center gap-4">

                    <div className="h-9 w-9 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />

                    <p className="text-sm text-text-secondary">
                      Loading applications...
                    </p>

                  </div>

                </div>
              ) : (
                <CandidateApplications
                  applications={applications}
                />
              )}

            </div>

          )}


          {/* =================================================
              HIRING TIMELINE
          ================================================= */}

          {activeTab === "timeline" && (
            <CandidateHiringTimeline
              candidate={candidate}
            />
          )}


          {/* =================================================
              ACCOUNT MANAGEMENT
          ================================================= */}

          <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">

            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

              <div className="flex items-center gap-3">

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    isActive
                      ? "bg-red-100 text-red-600"
                      : "bg-emerald-100 text-emerald-600"
                  }`}
                >
                  {isActive ? (
                    <Ban size={18} />
                  ) : (
                    <ShieldCheck size={18} />
                  )}
                </div>

                <div>

                  <h3 className="text-sm font-bold text-text">
                    Account Management
                  </h3>

                  <p className="mt-0.5 text-xs text-text-secondary">
                    Manage candidate login access.
                  </p>

                </div>

              </div>


              {isActive ? (
                <button
                  type="button"
                  onClick={() =>
                    setShowSuspendModal(true)
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  <Ban size={16} />
                  Suspend Candidate
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleActivate}
                  disabled={activating}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                >
                  <ShieldCheck size={16} />

                  {activating
                    ? "Activating..."
                    : "Activate Candidate"}
                </button>
              )}

            </div>

          </section>

        </div>

      </div>


      {/* =====================================================
          SUSPEND MODAL
      ===================================================== */}

      {showSuspendModal && (
        <ConfirmModal
          loading={suspending}
          candidateName={`${candidate.first_name || ""} ${
            candidate.last_name || ""
          }`.trim()}
          onCancel={() =>
            setShowSuspendModal(false)
          }
          onConfirm={handleSuspend}
        />
      )}

    </AdminPageShell>
  );
}


/* =========================================================
   ADMIN PAGE SHELL
========================================================= */

function AdminPageShell({ children }) {
  return (
    <div className="h-screen overflow-hidden bg-[#f8f9ff]">

      <DashboardSidebar />

      <main className="ml-0 h-screen md:ml-72">

        <div className="fixed left-0 right-0 top-0 z-50 md:left-72">
          <DashboardNavbar />
        </div>

        <div className="h-screen overflow-y-auto pt-20">
          {children}
        </div>

      </main>

    </div>
  );
}


/* =========================================================
   HERO INFO
========================================================= */

function HeroInfo({
  icon: Icon,
  value,
}) {
  return (
    <div className="flex min-w-0 items-center gap-2 text-sm text-text-secondary">

      <Icon
        size={17}
        className="shrink-0"
      />

      <span className="truncate">
        {value}
      </span>

    </div>
  );
}


/* =========================================================
   CANDIDATE INFORMATION CARD
========================================================= */

function CandidateInfoCard({
  label,
  value,
  icon: Icon,
  success = false,
}) {
  return (
    <div className="rounded-xl border border-border bg-slate-50/70 p-4 transition hover:border-blue-100 hover:bg-blue-50/30">

      <div className="flex items-start gap-3">

        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
            success
              ? "bg-emerald-100 text-emerald-600"
              : "bg-blue-100 text-primary"
          }`}
        >
          <Icon size={17} />
        </div>

        <div className="min-w-0">

          <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
            {label}
          </p>

          <p
            className={`mt-1.5 break-words text-sm font-semibold ${
              success
                ? "text-emerald-700"
                : "text-text"
            }`}
          >
            {value || "Not specified"}
          </p>

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   CONFIRM MODAL
========================================================= */

function ConfirmModal({
  candidateName,
  loading,
  onCancel,
  onConfirm,
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">

      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">


        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-border px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <Ban size={20} />
            </div>

            <div>

              <h2 className="font-bold text-text">
                Suspend Candidate
              </h2>

              <p className="mt-0.5 text-xs text-text-secondary">
                Account access restriction
              </p>

            </div>

          </div>


          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition hover:bg-slate-100 disabled:opacity-50"
          >
            <X size={17} />
          </button>

        </div>


        {/* BODY */}

        <div className="p-6">

          <div className="rounded-xl border border-red-200 bg-red-50 p-4">

            <p className="text-sm leading-6 text-red-700">

              Are you sure you want to suspend{" "}

              <span className="font-bold">
                {candidateName}
              </span>

              ? The candidate will no longer be able
              to log in until the account is reactivated.

            </p>

          </div>


          {/* ACTIONS */}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-text-secondary transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>


            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Suspending...
                </>
              ) : (
                <>
                  <Ban size={16} />
                  Suspend
                </>
              )}

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}


export default CandidateDetails;