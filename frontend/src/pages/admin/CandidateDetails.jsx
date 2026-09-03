import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  UserRound,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  BriefcaseBusiness,
  Code2,
  Globe,
  FileText,
  ShieldCheck,
  ShieldAlert,
  Ban,
  X,
  ExternalLink,
  CircleUserRound,
  Sparkles,
  UserCheck,
} from "lucide-react";

import DashboardSidebar from "../../components/admin/dashboard/DashboardSidebar";
import DashboardNavbar from "../../components/admin/dashboard/DashboardNavbar";

import {
  getCandidateDetails,
  suspendCandidate,
  activateCandidate,
} from "../../services/admin/adminService";

function CandidateDetails() {
  const navigate = useNavigate();
  const { candidateId } = useParams();

  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspending, setSuspending] = useState(false);

  // =====================================================
  // FETCH CANDIDATE
  // =====================================================

  const fetchCandidateDetails = async () => {
    try {
      setLoading(true);

      const data = await getCandidateDetails(candidateId);

      console.log("Candidate Details:", data);

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

  useEffect(() => {
    fetchCandidateDetails();
  }, [candidateId]);

  // =====================================================
  // SUSPEND CANDIDATE
  // =====================================================

  const handleSuspend = async () => {
    if (!candidate?.user) {
      console.error("Candidate user ID not found.");
      return;
    }

    try {
      setSuspending(true);

      await suspendCandidate(candidate.user);

      setShowSuspendModal(false);

      navigate("/admin/candidates");
    } catch (error) {
      console.error(
        "Failed to suspend candidate:",
        error
      );
    } finally {
      setSuspending(false);
    }
  };

  // =====================================================
  // ACTIVATE CANDIDATE
  // =====================================================

  const handleActivate = async () => {
    if (!candidate?.user) {
      console.error("Candidate user ID not found.");
      return;
    }

    try {
      setSuspending(true);

      await activateCandidate(candidate.user);

      await fetchCandidateDetails();
    } catch (error) {
      console.error(
        "Failed to activate candidate:",
        error
      );
    } finally {
      setSuspending(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="h-screen overflow-hidden bg-background">
        <DashboardSidebar />

        <main className="ml-0 h-screen md:ml-72">
          <div className="fixed left-0 right-0 top-0 z-50 md:left-72">
            <DashboardNavbar />
          </div>

          <div className="flex h-screen items-center justify-center pt-20">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />

              <p className="text-sm text-text-secondary">
                Loading candidate details...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // =====================================================
  // NOT FOUND
  // =====================================================

  if (!candidate) {
    return (
      <div className="h-screen overflow-hidden bg-background">
        <DashboardSidebar />

        <main className="ml-0 h-screen md:ml-72">
          <div className="fixed left-0 right-0 top-0 z-50 md:left-72">
            <DashboardNavbar />
          </div>

          <div className="flex h-screen items-center justify-center px-6 pt-20">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
                <UserRound
                  size={30}
                  className="text-primary"
                />
              </div>

              <h2 className="mt-5 text-xl font-semibold text-text-primary">
                Candidate not found
              </h2>

              <p className="mt-2 text-sm text-text-secondary">
                The requested candidate could not be found.
              </p>

              <button
                onClick={() =>
                  navigate("/admin/candidates")
                }
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
              >
                <ArrowLeft size={16} />
                Back to Candidates
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const isActive = candidate.is_active === true;

  return (
    <div className="h-screen overflow-hidden bg-slate-50">

      {/* ================================================= */}
      {/* SIDEBAR */}
      {/* ================================================= */}

      <DashboardSidebar />

      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <main className="ml-0 h-screen md:ml-72">

        {/* ================================================= */}
        {/* NAVBAR */}
        {/* ================================================= */}

        <div className="fixed left-0 right-0 top-0 z-50 md:left-72">
          <DashboardNavbar />
        </div>

        {/* ================================================= */}
        {/* CONTENT */}
        {/* ================================================= */}

        <div className="h-screen overflow-y-auto pt-20">

          <div className="mx-auto w-full max-w-[1450px] px-4 py-7 sm:px-6 lg:px-8">

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="mb-6">

              <button
                onClick={() => navigate(-1)}
                className="mb-5 inline-flex items-center gap-2 rounded-lg px-1 py-1 text-sm font-medium text-text-secondary transition hover:text-primary"
              >
                <ArrowLeft size={17} />
                Back to Candidates
              </button>

              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

                <div>

                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <Sparkles size={13} />
                    Candidate Management
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Candidate Details
                  </h1>

                  <p className="mt-1.5 text-sm text-text-secondary sm:text-base">
                    Review candidate profile, professional information and account status.
                  </p>

                </div>

                {isActive ? (
                  <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">

                    <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />

                    Active Account

                  </div>
                ) : (
                  <div className="inline-flex w-fit items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 ring-1 ring-inset ring-red-200">

                    <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.12)]" />

                    Suspended Account

                  </div>
                )}

              </div>
            </div>

            {/* ================================================= */}
            {/* KPI CARDS */}
            {/* ================================================= */}

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <KpiCard
                title="Profile"
                value={
                  candidate.first_name
                    ? "Complete"
                    : "Incomplete"
                }
                description="Candidate information"
                icon={CircleUserRound}
                wrapper="border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50"
                iconWrapper="bg-blue-100 ring-blue-200"
                iconColor="text-blue-600"
                titleColor="text-blue-700"
                valueColor="text-blue-950"
                descriptionColor="text-blue-600"
              />

              <KpiCard
                title="Account"
                value={
                  isActive
                    ? "Active"
                    : "Suspended"
                }
                description="Login access"
                icon={
                  isActive
                    ? ShieldCheck
                    : ShieldAlert
                }
                wrapper={
                  isActive
                    ? "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-green-50"
                    : "border-red-200 bg-gradient-to-br from-red-50 via-white to-rose-50"
                }
                iconWrapper={
                  isActive
                    ? "bg-emerald-100 ring-emerald-200"
                    : "bg-red-100 ring-red-200"
                }
                iconColor={
                  isActive
                    ? "text-emerald-600"
                    : "text-red-600"
                }
                titleColor={
                  isActive
                    ? "text-emerald-700"
                    : "text-red-700"
                }
                valueColor={
                  isActive
                    ? "text-emerald-950"
                    : "text-red-950"
                }
                descriptionColor={
                  isActive
                    ? "text-emerald-600"
                    : "text-red-600"
                }
              />

              <KpiCard
                title="Resume"
                value={
                  candidate.resume
                    ? "Available"
                    : "Missing"
                }
                description="Candidate document"
                icon={FileText}
                wrapper="border-violet-200 bg-gradient-to-br from-violet-50 via-white to-purple-50"
                iconWrapper="bg-violet-100 ring-violet-200"
                iconColor="text-violet-600"
                titleColor="text-violet-700"
                valueColor="text-violet-950"
                descriptionColor="text-violet-600"
              />

              <KpiCard
                title="Location"
                value={
                  candidate.location ||
                  "Not provided"
                }
                description="Candidate location"
                icon={MapPin}
                wrapper="border-cyan-200 bg-gradient-to-br from-cyan-50 via-white to-sky-50"
                iconWrapper="bg-cyan-100 ring-cyan-200"
                iconColor="text-cyan-600"
                titleColor="text-cyan-700"
                valueColor="text-cyan-950"
                descriptionColor="text-cyan-600"
              />

            </div>

            {/* ================================================= */}
            {/* PROFILE BANNER */}
            {/* ================================================= */}

            <section className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-primary to-indigo-600 shadow-xl">

              <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

              <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-blue-300/20 blur-3xl" />

              <div className="relative px-6 py-7 sm:px-8 lg:py-8">

                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                  <div className="flex min-w-0 items-center gap-5">

                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-xl ring-4 ring-white/20">

                      {candidate.profile_image ? (
                        <img
                          src={candidate.profile_image}
                          alt={`${candidate.first_name || ""} ${candidate.last_name || ""}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UserRound
                          size={34}
                          className="text-primary"
                        />
                      )}

                    </div>

                    <div className="min-w-0">

                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
                        Candidate Profile
                      </p>

                      <h2 className="mt-1 truncate text-2xl font-bold text-white sm:text-3xl">
                        {candidate.first_name}{" "}
                        {candidate.last_name}
                      </h2>

                      {candidate.headline && (
                        <p className="mt-1.5 text-sm font-medium text-blue-100">
                          {candidate.headline}
                        </p>
                      )}

                      {candidate.email && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-blue-100">
                          <Mail size={14} />

                          <span className="truncate">
                            {candidate.email}
                          </span>
                        </div>
                      )}

                    </div>

                  </div>

                  {candidate.resume && (
                    <a
                      href={candidate.resume}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-primary shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
                    >
                      <FileText size={17} />
                      View Resume
                      <ExternalLink size={14} />
                    </a>
                  )}

                </div>

              </div>
            </section>

            {/* ================================================= */}
            {/* MAIN GRID */}
            {/* ================================================= */}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">

              {/* ================================================= */}
              {/* LEFT */}
              {/* ================================================= */}

              <div className="space-y-6 xl:col-span-8">

                {/* ================================================= */}
                {/* PERSONAL INFORMATION */}
                {/* ================================================= */}

                <section className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">

                  <SectionHeader
                    icon={UserRound}
                    title="Personal Information"
                    description="Basic identity and personal details"
                  />

                  <div className="grid grid-cols-1 gap-px bg-blue-100/60 sm:grid-cols-2">

                    <InfoTile
                      label="First Name"
                      value={candidate.first_name}
                      icon={UserRound}
                    />

                    <InfoTile
                      label="Last Name"
                      value={candidate.last_name}
                      icon={UserRound}
                    />

                    <InfoTile
                      label="Phone Number"
                      value={candidate.phone_number}
                      icon={Phone}
                    />

                    <InfoTile
                      label="Date of Birth"
                      value={candidate.date_of_birth}
                      icon={CalendarDays}
                    />

                    <InfoTile
                      label="Gender"
                      value={candidate.gender}
                      icon={UserCheck}
                    />

                    <InfoTile
                      label="Location"
                      value={candidate.location}
                      icon={MapPin}
                    />

                  </div>
                </section>

                {/* ================================================= */}
                {/* PROFESSIONAL INFORMATION */}
                {/* ================================================= */}

                <section className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">

                  <SectionHeader
                    icon={BriefcaseBusiness}
                    title="Professional Information"
                    description="Career profile and online presence"
                  />

                  <div className="grid grid-cols-1 gap-px bg-blue-100/60 sm:grid-cols-2">

                    <InfoTile
                      label="Professional Headline"
                      value={candidate.headline}
                      icon={BriefcaseBusiness}
                      fullWidth
                    />

                    <SocialTile
                      label="LinkedIn"
                      value={candidate.linkedin_url}
                      icon={Globe}
                    />

                    <SocialTile
                      label="GitHub"
                      value={candidate.github_url}
                      icon={Code2}
                    />

                    <SocialTile
                      label="Portfolio"
                      value={candidate.portfolio_url}
                      icon={Globe}
                    />

                  </div>
                </section>

                {/* ================================================= */}
                {/* ABOUT */}
                {/* ================================================= */}

                <section className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">

                  <SectionHeader
                    icon={Sparkles}
                    title="About Candidate"
                    description="Personal introduction and professional summary"
                  />

                  <div className="border-t border-blue-100 bg-blue-50/30 p-6 sm:p-7">

                    {candidate.about ? (
                      <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">

                        <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
                          {candidate.about}
                        </p>

                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/50 p-6 text-center">

                        <Sparkles
                          size={25}
                          className="mx-auto text-primary/50"
                        />

                        <p className="mt-3 text-sm font-medium text-blue-700">
                          No information provided
                        </p>

                      </div>
                    )}

                  </div>
                </section>

              </div>

              {/* ================================================= */}
              {/* RIGHT */}
              {/* ================================================= */}

              <aside className="space-y-6 xl:col-span-4">

                {/* ================================================= */}
                {/* ACCOUNT OVERVIEW */}
                {/* ================================================= */}

                <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                  <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-blue-50 px-6 py-5">

                    <h2 className="font-bold text-text-primary">
                      Account Overview
                    </h2>

                    <p className="mt-1 text-xs text-text-secondary">
                      Account status and administrative actions.
                    </p>

                  </div>

                  <div className="p-6">

                    {/* ACCOUNT STATUS */}

                    <div
                      className={`rounded-2xl border p-5 ${
                        isActive
                          ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50"
                          : "border-red-200 bg-gradient-to-br from-red-50 to-rose-50"
                      }`}
                    >

                      <div className="flex items-center justify-between">

                        <div className="flex items-center gap-3">

                          <div
                            className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                              isActive
                                ? "bg-emerald-100"
                                : "bg-red-100"
                            }`}
                          >

                            {isActive ? (
                              <ShieldCheck
                                size={21}
                                className="text-emerald-600"
                              />
                            ) : (
                              <ShieldAlert
                                size={21}
                                className="text-red-600"
                              />
                            )}

                          </div>

                          <div>

                            <p
                              className={`text-sm font-bold ${
                                isActive
                                  ? "text-emerald-800"
                                  : "text-red-800"
                              }`}
                            >
                              {isActive
                                ? "Active Account"
                                : "Suspended Account"}
                            </p>

                            <p
                              className={`mt-0.5 text-xs ${
                                isActive
                                  ? "text-emerald-600"
                                  : "text-red-600"
                              }`}
                            >
                              {isActive
                                ? "Login access enabled"
                                : "Login access disabled"}
                            </p>

                          </div>

                        </div>

                        <span
                          className={`h-3 w-3 rounded-full ${
                            isActive
                              ? "bg-emerald-500 shadow-[0_0_0_5px_rgba(16,185,129,0.12)]"
                              : "bg-red-500 shadow-[0_0_0_5px_rgba(239,68,68,0.12)]"
                          }`}
                        />

                      </div>
                    </div>

                    {/* ================================================= */}
                    {/* RESUME */}
                    {/* ================================================= */}

                    <div className="mt-6 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-5">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">

                          <FileText
                            size={19}
                            className="text-primary"
                          />

                        </div>

                        <div>

                          <h3 className="text-sm font-bold text-blue-900">
                            Resume
                          </h3>

                          <p className="text-xs text-blue-600">
                            Candidate document
                          </p>

                        </div>

                      </div>

                      {candidate.resume ? (
                        <a
                          href={candidate.resume}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
                        >
                          <FileText size={16} />
                          Open Resume
                          <ExternalLink size={14} />
                        </a>
                      ) : (
                        <div className="mt-4 rounded-xl bg-white/70 px-4 py-3 text-center text-xs font-medium text-blue-600">
                          No resume uploaded.
                        </div>
                      )}

                    </div>

                    {/* ================================================= */}
                    {/* SUSPEND ACTION */}
                    {/* ================================================= */}

                    {isActive && (
                      <div className="mt-6 rounded-2xl border border-red-100 bg-red-50/70 p-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">

                            <Ban
                              size={18}
                              className="text-red-600"
                            />

                          </div>

                          <div>

                            <h3 className="text-sm font-bold text-red-900">
                              Account Action
                            </h3>

                            <p className="text-xs text-red-600">
                              Manage candidate access
                            </p>

                          </div>

                        </div>

                        <button
                          onClick={() =>
                            setShowSuspendModal(true)
                          }
                          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 active:scale-[0.98]"
                        >
                          <Ban size={16} />
                          Suspend Candidate
                        </button>

                      </div>
                    )}

                    {/* ================================================= */}
                    {/* ACTIVATE ACTION */}
                    {/* ================================================= */}

                    {!isActive && (
                      <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">

                            <UserCheck
                              size={18}
                              className="text-emerald-600"
                            />

                          </div>

                          <div>

                            <h3 className="text-sm font-bold text-emerald-900">
                              Account Action
                            </h3>

                            <p className="text-xs text-emerald-600">
                              Restore candidate access
                            </p>

                          </div>

                        </div>

                        <button
                          onClick={handleActivate}
                          disabled={suspending}
                          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                        >

                          {suspending ? (
                            <>
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                              Activating...
                            </>
                          ) : (
                            <>
                              <UserCheck size={16} />
                              Activate Candidate
                            </>
                          )}

                        </button>

                      </div>
                    )}

                  </div>
                </section>

                {/* ================================================= */}
                {/* CONTACT DETAILS */}
                {/* ================================================= */}

                <section className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">

                  <div className="border-b border-blue-100 bg-gradient-to-r from-blue-50 via-white to-indigo-50 px-6 py-5">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-blue-200">
                        <Mail size={18} />
                      </div>

                      <div>

                        <h2 className="font-bold text-text-primary">
                          Contact Details
                        </h2>

                        <p className="mt-1 text-xs text-text-secondary">
                          Candidate contact information.
                        </p>

                      </div>

                    </div>
                  </div>

                  <div className="p-5">

                    <ContactTile
                      label="Email"
                      value={candidate.email}
                      icon={Mail}
                    />

                    <ContactTile
                      label="Phone"
                      value={candidate.phone_number}
                      icon={Phone}
                    />

                    <ContactTile
                      label="Location"
                      value={candidate.location}
                      icon={MapPin}
                    />

                    <ContactTile
                      label="Date of Birth"
                      value={candidate.date_of_birth}
                      icon={CalendarDays}
                      last
                    />

                  </div>
                </section>

              </aside>
            </div>
          </div>
        </div>
      </main>

      {/* ================================================= */}
      {/* SUSPEND MODAL */}
      {/* ================================================= */}

      {showSuspendModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">

            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100">

                  <Ban
                    size={20}
                    className="text-red-600"
                  />

                </div>

                <div>

                  <h2 className="font-bold text-text-primary">
                    Suspend Candidate
                  </h2>

                  <p className="mt-0.5 text-xs text-text-secondary">
                    Account access restriction
                  </p>

                </div>

              </div>

              <button
                onClick={() =>
                  setShowSuspendModal(false)
                }
                disabled={suspending}
                className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={18} />
              </button>

            </div>

            <div className="px-6 py-6">

              <div className="rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-rose-50 p-5">

                <div className="flex items-start gap-3">

                  <ShieldAlert
                    size={20}
                    className="mt-0.5 shrink-0 text-red-600"
                  />

                  <p className="text-sm leading-6 text-red-700">

                    Are you sure you want to suspend{" "}

                    <span className="font-bold">
                      {candidate.first_name}{" "}
                      {candidate.last_name}
                    </span>

                    ? The candidate will no longer be able
                    to log in until the account is reactivated.

                  </p>

                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <button
                  onClick={() =>
                    setShowSuspendModal(false)
                  }
                  disabled={suspending}
                  className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-text-secondary transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSuspend}
                  disabled={suspending}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {suspending ? (
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
      )}
    </div>
  );
}

// =====================================================
// KPI CARD
// =====================================================

function KpiCard({
  title,
  value,
  description,
  icon: Icon,
  wrapper,
  iconWrapper,
  iconColor,
  titleColor,
  valueColor,
  descriptionColor,
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${wrapper}`}
    >

      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/50 blur-2xl" />

      <div className="relative flex items-center justify-between gap-4">

        <div className="min-w-0">

          <p className={`text-sm font-medium ${titleColor}`}>
            {title}
          </p>

          <p className={`mt-2 truncate text-xl font-bold ${valueColor}`}>
            {value}
          </p>

          <p className={`mt-1 text-xs ${descriptionColor}`}>
            {description}
          </p>

        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 ${iconWrapper}`}
        >
          <Icon
            size={22}
            className={iconColor}
          />
        </div>

      </div>
    </div>
  );
}

// =====================================================
// SECTION HEADER
// =====================================================

function SectionHeader({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="flex items-center justify-between border-b border-blue-100 bg-gradient-to-r from-blue-50/70 via-white to-indigo-50/40 px-6 py-5 sm:px-7">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-blue-200">
          <Icon size={19} />
        </div>

        <div>

          <h2 className="text-base font-bold text-text-primary">
            {title}
          </h2>

          <p className="mt-0.5 text-xs text-text-secondary">
            {description}
          </p>

        </div>
      </div>

      <div className="hidden h-1.5 w-10 rounded-full bg-primary/20 sm:block" />

    </div>
  );
}

// =====================================================
// INFO TILE
// =====================================================

function InfoTile({
  label,
  value,
  icon: Icon,
  fullWidth = false,
}) {
  return (
    <div
      className={`group bg-white p-5 transition-all duration-200 hover:bg-blue-50/60 ${
        fullWidth ? "sm:col-span-2" : ""
      }`}
    >

      <div className="flex items-start gap-4">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-primary ring-1 ring-blue-200 transition group-hover:scale-105 group-hover:bg-primary group-hover:text-white">

          <Icon size={17} />

        </div>

        <div className="min-w-0 flex-1">

          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
            {label}
          </p>

          <p className="mt-1.5 break-words text-sm font-semibold leading-6 text-slate-800">
            {value || "Not provided"}
          </p>

        </div>

      </div>
    </div>
  );
}

// =====================================================
// SOCIAL TILE
// =====================================================

function SocialTile({
  label,
  value,
  icon: Icon,
}) {
  return (
    <div className="group bg-white p-5 transition-all duration-200 hover:bg-blue-50/60">

      <div className="flex items-start gap-4">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-primary ring-1 ring-blue-200 transition group-hover:scale-105 group-hover:bg-primary group-hover:text-white">

          <Icon size={17} />

        </div>

        <div className="min-w-0 flex-1">

          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
            {label}
          </p>

          {value ? (
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="mt-1.5 flex items-start gap-2 break-all text-sm font-semibold leading-6 text-primary hover:underline"
            >
              <span className="break-all">
                {value}
              </span>

              <ExternalLink
                size={13}
                className="mt-1 shrink-0"
              />
            </a>
          ) : (
            <p className="mt-1.5 text-sm font-semibold text-slate-500">
              Not provided
            </p>
          )}

        </div>

      </div>
    </div>
  );
}

// =====================================================
// CONTACT TILE
// =====================================================

function ContactTile({
  label,
  value,
  icon: Icon,
  last = false,
}) {
  return (
    <div
      className={`group flex items-start gap-3 rounded-2xl p-3 transition hover:bg-blue-50/60 ${
        !last ? "mb-2" : ""
      }`}
    >

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-primary ring-1 ring-blue-200 transition group-hover:bg-primary group-hover:text-white">

        <Icon size={16} />

      </div>

      <div className="min-w-0 flex-1">

        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-slate-800">
          {value || "Not provided"}
        </p>

      </div>
    </div>
  );
}

export default CandidateDetails;