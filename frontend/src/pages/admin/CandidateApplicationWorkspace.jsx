import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Download,
  FileText,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldAlert,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import DashboardSidebar from "../../components/admin/dashboard/DashboardSidebar";
import DashboardNavbar from "../../components/admin/dashboard/DashboardNavbar";

import { getCandidateDetails } from "../../services/admin/adminService";


function CandidateApplicationWorkspace() {
  const navigate = useNavigate();
  const { candidateId } = useParams();

  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] =
    useState("applications");

  const [search, setSearch] = useState("");


  /* =====================================================
     FETCH CANDIDATE
  ===================================================== */

  const fetchCandidate = async () => {
    try {
      setLoading(true);

      const data =
        await getCandidateDetails(candidateId);

      console.log(
        "APPLICATION WORKSPACE CANDIDATE:",
        data
      );

      setCandidate(data);
    } catch (error) {
      console.error(
        "Failed to fetch candidate:",
        error
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchCandidate();
  }, [candidateId]);


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
              Loading application workspace...
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

            <p className="mt-2 text-sm leading-6 text-text-secondary">
              The requested candidate could not be loaded.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/admin/candidates/${candidateId}`
                )
              }
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              <ArrowLeft size={16} />
              Back to Candidate
            </button>

          </div>

        </div>
      </AdminPageShell>
    );
  }


  const fullName = [
    candidate.first_name,
    candidate.last_name,
  ]
    .filter(Boolean)
    .join(" ") || "Candidate";


  const isActive =
    candidate.is_active === true;


  return (
    <AdminPageShell>

      <div className="min-h-screen bg-[#f8f9ff]">

        <div className="mx-auto w-full max-w-[1450px] px-4 py-6 sm:px-6 lg:px-8">


          {/* =================================================
              BREADCRUMB + HEADER
          ================================================= */}

          <div className="mb-7">

            <div className="mb-3 flex items-center gap-2 overflow-x-auto whitespace-nowrap text-xs text-text-secondary sm:text-sm">

              <button
                type="button"
                onClick={() =>
                  navigate("/admin")
                }
                className="transition hover:text-primary"
              >
                Dashboard
              </button>

              <ChevronRight size={14} />

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/candidates")
                }
                className="transition hover:text-primary"
              >
                Candidates
              </button>

              <ChevronRight size={14} />

              <span className="font-semibold text-primary">
                {fullName}
              </span>

            </div>


            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

              <div className="min-w-0">

                <h1 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">
                  Application Workspace
                </h1>

                <p className="mt-1.5 max-w-3xl text-sm leading-6 text-text-secondary sm:text-base">
                  Monitor this candidate's application
                  information and hiring progress.
                </p>

              </div>


              {candidate.resume && (
                <a
                  href={candidate.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90"
                >
                  <Download size={16} />
                  Download Resume
                </a>
              )}

            </div>

          </div>


          {/* =================================================
              CANDIDATE HERO
          ================================================= */}

          <section className="mb-7 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">


            {/* CANDIDATE INFORMATION */}

            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6">

              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">


                {/* IMAGE */}

                <div className="relative shrink-0">

                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border-4 border-slate-100 bg-slate-50 shadow-sm">

                    {candidate.profile_image ? (
                      <img
                        src={candidate.profile_image}
                        alt={fullName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserRound
                        size={40}
                        className="text-primary"
                      />
                    )}

                  </div>

                </div>


                {/* DETAILS */}

                <div className="min-w-0 flex-1">

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                    <div className="min-w-0">

                      <h2 className="text-xl font-bold text-text sm:text-2xl">
                        {fullName}
                      </h2>

                      {candidate.headline && (
                        <p className="mt-1 text-sm font-medium text-text-secondary">
                          {candidate.headline}
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-text-secondary sm:text-sm">

                        {candidate.location && (
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin size={14} />
                            {candidate.location}
                          </span>
                        )}

                        {candidate.email && (
                          <span className="inline-flex min-w-0 items-center gap-1.5">
                            <Mail size={14} />
                            <span className="truncate">
                              {candidate.email}
                            </span>
                          </span>
                        )}

                      </div>

                    </div>


                    <span
                      className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold ${
                        isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {isActive ? (
                        <ShieldCheck size={14} />
                      ) : (
                        <ShieldAlert size={14} />
                      )}

                      {isActive
                        ? "Active"
                        : "Suspended"}

                    </span>

                  </div>


                  {/* BASIC DETAILS */}

                  <div className="mt-5 grid grid-cols-1 gap-4 border-y border-border/70 py-4 sm:grid-cols-3">

                    <HeroInfo
                      label="Candidate"
                      value={fullName}
                      icon={UserRound}
                    />

                    <HeroInfo
                      label="Phone"
                      value={
                        candidate.phone_number ||
                        "Not available"
                      }
                      icon={Phone}
                    />

                    <HeroInfo
                      label="Location"
                      value={
                        candidate.location ||
                        "Not available"
                      }
                      icon={MapPin}
                    />

                  </div>


                  {/* SKILLS */}

                  {candidate.skills && (
                    <div className="mt-4 flex flex-wrap gap-2">

                      {String(candidate.skills)
                        .split(",")
                        .map((skill) => skill.trim())
                        .filter(Boolean)
                        .map((skill) => (
                          <span
                            key={skill}
                            className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-medium text-text-secondary"
                          >
                            {skill}
                          </span>
                        ))}

                    </div>
                  )}

                </div>

              </div>

            </div>


            {/* STATS */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:grid-cols-1">

              <StatCard
                label="Applications"
                value={
                  candidate.application_count ??
                  candidate.total_applications ??
                  "—"
                }
                icon={FileText}
              />

              <StatCard
                label="Tech Score"
                value={
                  candidate.tech_score ??
                  "—"
                }
                suffix={
                  candidate.tech_score != null
                    ? "/100"
                    : ""
                }
                icon={CheckCircle2}
              />

              <StatCard
                label="Progress"
                value={
                  candidate.progress != null
                    ? `${candidate.progress}%`
                    : "—"
                }
                icon={CalendarDays}
              />

            </div>

          </section>


          {/* =================================================
              TABS
          ================================================= */}

          <div className="mb-7 overflow-x-auto border-b border-border">

            <div className="flex min-w-max items-center gap-7">

              {[
                {
                  key: "overview",
                  label: "Overview",
                },
                {
                  key: "applications",
                  label: "Applications",
                },
                {
                  key: "technical",
                  label: "Technical Evaluation",
                },
                {
                  key: "timeline",
                  label: "Hiring Timeline",
                },
              ].map((tab) => (

                <button
                  key={tab.key}
                  type="button"
                  onClick={() =>
                    setActiveTab(tab.key)
                  }
                  className={`relative pb-3.5 text-sm font-medium transition ${
                    activeTab === tab.key
                      ? "font-bold text-primary"
                      : "text-text-secondary hover:text-primary"
                  }`}
                >

                  {tab.label}

                  {activeTab === tab.key && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />
                  )}

                </button>

              ))}

            </div>

          </div>


          {/* =================================================
              APPLICATIONS TAB
          ================================================= */}

          {activeTab === "applications" && (

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">


              {/* LEFT */}

              <div className="space-y-5">


                {/* SEARCH BAR */}

                <div className="flex flex-col gap-3 rounded-2xl border border-border bg-slate-100/70 p-3 shadow-sm sm:flex-row">

                  <div className="relative min-w-0 flex-1">

                    <Search
                      size={17}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                    />

                    <input
                      type="text"
                      value={search}
                      onChange={(event) =>
                        setSearch(
                          event.target.value
                        )
                      }
                      placeholder="Search applications..."
                      className="h-10 w-full rounded-xl border border-border bg-white pl-10 pr-4 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />

                  </div>


                  <button
                    type="button"
                    className="h-10 rounded-xl border border-border bg-white px-4 text-sm font-semibold text-text transition hover:bg-slate-50"
                  >
                    Newest First
                  </button>

                </div>


                {/* APPLICATION EMPTY STATE */}

                <section className="rounded-2xl border border-border bg-white shadow-sm">

                  <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-primary">

                      <FileText size={27} />

                    </div>

                    <h2 className="mt-5 text-lg font-bold text-text">
                      Application data unavailable
                    </h2>

                    <p className="mt-2 max-w-md text-sm leading-6 text-text-secondary">
                      Application-specific records will
                      appear here once the application API
                      provides them.
                    </p>

                  </div>

                </section>

              </div>


              {/* RIGHT SIDEBAR */}

              <aside className="space-y-5">

                <InfoWidget
                  title="Application Statistics"
                  icon={FileText}
                >

                  <StatRow
                    label="Submitted"
                    value={
                      candidate.application_count ??
                      candidate.total_applications ??
                      "—"
                    }
                  />

                  <StatRow
                    label="Active"
                    value="—"
                  />

                </InfoWidget>


                <InfoWidget
                  title="Candidate Contact"
                  icon={Mail}
                >

                  <ContactRow
                    label="Email"
                    value={
                      candidate.email ||
                      "Not provided"
                    }
                    icon={Mail}
                  />

                  <ContactRow
                    label="Phone"
                    value={
                      candidate.phone_number ||
                      "Not provided"
                    }
                    icon={Phone}
                  />

                  <ContactRow
                    label="Location"
                    value={
                      candidate.location ||
                      "Not provided"
                    }
                    icon={MapPin}
                  />

                </InfoWidget>


                <div className="rounded-2xl bg-primary p-5 text-white shadow-sm">

                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-200">
                    Candidate Status
                  </p>

                  <div className="mt-3 flex items-center gap-2">

                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        isActive
                          ? "bg-emerald-400"
                          : "bg-red-400"
                      }`}
                    />

                    <span className="font-bold">
                      {isActive
                        ? "Active Account"
                        : "Suspended Account"}
                    </span>

                  </div>

                </div>

              </aside>

            </div>

          )}


          {/* =================================================
              OTHER TABS
          ================================================= */}

          {activeTab !== "applications" && (

            <section className="rounded-2xl border border-border bg-white shadow-sm">

              <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-primary">

                  <FileText size={27} />

                </div>

                <h2 className="mt-5 text-lg font-bold text-text">
                  {activeTab === "overview"
                    ? "Overview"
                    : activeTab === "technical"
                    ? "Technical Evaluation"
                    : "Hiring Timeline"}
                </h2>

                <p className="mt-2 max-w-lg text-sm leading-6 text-text-secondary">
                  This section will be connected to the
                  corresponding application data.
                </p>

              </div>

            </section>

          )}

        </div>

      </div>

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
  label,
  value,
  icon: Icon,
}) {
  return (
    <div className="min-w-0">

      <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
        {label}
      </p>

      <div className="mt-1.5 flex items-center gap-1.5">

        <Icon
          size={14}
          className="shrink-0 text-text-secondary"
        />

        <p className="truncate text-sm font-bold text-text">
          {value}
        </p>

      </div>

    </div>
  );
}


/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  label,
  value,
  suffix = "",
  icon: Icon,
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-white p-5 shadow-sm">

      <div>

        <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
          {label}
        </p>

        <div className="mt-2 flex items-baseline gap-1">

          <p className="text-xl font-bold text-text">
            {value}
          </p>

          {suffix && (
            <span className="text-xs text-text-secondary">
              {suffix}
            </span>
          )}

        </div>

      </div>

      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-primary">
        <Icon size={20} />
      </div>

    </div>
  );
}


/* =========================================================
   INFO WIDGET
========================================================= */

function InfoWidget({
  title,
  icon: Icon,
  children,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">

      <div className="flex items-center gap-2 border-b border-border bg-slate-50 px-5 py-4">

        <Icon
          size={18}
          className="text-primary"
        />

        <h3 className="text-sm font-bold text-text">
          {title}
        </h3>

      </div>

      <div className="p-5">
        {children}
      </div>

    </section>
  );
}


/* =========================================================
   STAT ROW
========================================================= */

function StatRow({
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between py-2">

      <span className="text-sm text-text-secondary">
        {label}
      </span>

      <span className="text-sm font-bold text-text">
        {value}
      </span>

    </div>
  );
}


/* =========================================================
   CONTACT ROW
========================================================= */

function ContactRow({
  label,
  value,
  icon: Icon,
}) {
  return (
    <div className="flex items-start gap-3 py-2">

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-primary">
        <Icon size={15} />
      </div>

      <div className="min-w-0">

        <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-text">
          {value}
        </p>

      </div>

    </div>
  );
}


export default CandidateApplicationWorkspace;