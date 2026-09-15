import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  ExternalLink,
  Factory,
  FileText,
  Globe,
  Mail,
  MapPin,
  MapPinned,
  MoreVertical,
  Phone,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
  UserRound,
  Ban,
  BriefcaseBusiness,
  X,
} from "lucide-react";

import DashboardSidebar from "../../components/admin/dashboard/DashboardSidebar";
import DashboardNavbar from "../../components/admin/dashboard/DashboardNavbar";

import CompanyJobKpiCards from "../../components/admin/company-details/CompanyJobKpiCards";
import CompanyRecentJobs from "../../components/admin/company-details/CompanyRecentJobs";

import {
  getCompanyDetails,
  suspendCompany,
  activateCompany,
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

function CompanyDetails() {
  const navigate = useNavigate();
  const { companyId } = useParams();

  const [company, setCompany] = useState(null);

  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("overview");

  const [jobSearch, setJobSearch] = useState("");

  const [jobStatus, setJobStatus] = useState("ALL");

  const [showMenu, setShowMenu] = useState(false);

  const [showSuspendModal, setShowSuspendModal] =
    useState(false);

  const [showActivateModal, setShowActivateModal] =
    useState(false);

  const [suspending, setSuspending] = useState(false);

  const [activating, setActivating] = useState(false);


  /* =====================================================
     FETCH COMPANY
  ===================================================== */

  const fetchCompanyDetails = async () => {
    try {
      setLoading(true);

      const data = await getCompanyDetails(companyId);

     console.log("COMPANY DETAILS:", data);
console.log("COMPANY JOBS:", data?.jobs);

      setCompany(data);
    } catch (error) {
      console.error(
        "Failed to fetch company details:",
        error
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchCompanyDetails();
  }, [companyId]);


  /* =====================================================
     JOBS FROM API
  ===================================================== */

  const jobs = useMemo(() => {
    if (!company) {
      return [];
    }

    if (Array.isArray(company.jobs)) {
      return company.jobs;
    }

    if (Array.isArray(company.job_list)) {
      return company.job_list;
    }

    if (Array.isArray(company.job_details)) {
      return company.job_details;
    }

    return [];
  }, [company]);


  /* =====================================================
     FILTERED JOBS
     
     Used by search/filter.
     Recent Jobs component itself limits display to 5.
  ===================================================== */

  const filteredJobs = useMemo(() => {
    const searchValue =
      jobSearch.trim().toLowerCase();

    return jobs.filter((job) => {
      const title = String(
        job.title ||
          job.job_title ||
          ""
      ).toLowerCase();

      const department = String(
        job.department || ""
      ).toLowerCase();

      const location = String(
        job.location || ""
      ).toLowerCase();

      const status = String(
        job.status || ""
      ).toUpperCase();

      const matchesSearch =
        !searchValue ||
        title.includes(searchValue) ||
        department.includes(searchValue) ||
        location.includes(searchValue);

      const matchesStatus =
        jobStatus === "ALL" ||
        status === jobStatus;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    jobs,
    jobSearch,
    jobStatus,
  ]);


  /* =====================================================
     COMPANY STATUS
  ===================================================== */

  const isActive =
    company?.is_active === true;


  /* =====================================================
     SUSPEND COMPANY
  ===================================================== */

  const handleSuspend = async () => {
    if (!company?.user) {
      alert("Company user ID not found.");
      return;
    }

    try {
      setSuspending(true);

      await suspendCompany(company.user);

      setShowSuspendModal(false);

      await fetchCompanyDetails();
    } catch (error) {
      console.error(
        "Failed to suspend company:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to suspend company."
      );
    } finally {
      setSuspending(false);
    }
  };


  /* =====================================================
     ACTIVATE COMPANY
  ===================================================== */

  const handleActivate = async () => {
    if (!company?.user) {
      alert("Company user ID not found.");
      return;
    }

    try {
      setActivating(true);

      await activateCompany(company.user);

      setShowActivateModal(false);

      await fetchCompanyDetails();
    } catch (error) {
      console.error(
        "Failed to activate company:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to activate company."
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
              Loading company details...
            </p>

          </div>
        </div>
      </AdminPageShell>
    );
  }


  /* =====================================================
     COMPANY NOT FOUND
  ===================================================== */

  if (!company) {
    return (
      <AdminPageShell>
        <div className="flex min-h-[70vh] items-center justify-center px-6">

          <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-primary">
              <Building2 size={30} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-text">
              Company not found
            </h2>

            <p className="mt-2 text-sm text-text-secondary">
              The requested company could not be found.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/admin/companies")
              }
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              <ArrowLeft size={17} />
              Back to Companies
            </button>

          </div>

        </div>
      </AdminPageShell>
    );
  }


  /* =====================================================
     MAIN PAGE
  ===================================================== */

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
              onClick={() =>
                navigate("/admin")
              }
              className="transition hover:text-primary"
            >
              Dashboard
            </button>

            <ChevronRight size={15} />

            <button
              type="button"
              onClick={() =>
                navigate("/admin/companies")
              }
              className="transition hover:text-primary"
            >
              Companies
            </button>

            <ChevronRight size={15} />

            <span className="font-semibold text-primary">
              {company.company_name || "Company"}
            </span>

          </div>


          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div className="min-w-0">

              <div className="flex items-center gap-2">

                <h1 className="truncate text-2xl font-bold tracking-tight text-text sm:text-3xl">
                  {company.company_name || "Company"}
                </h1>

                <CheckCircle2
                  size={21}
                  className="shrink-0 text-secondary"
                  fill="currentColor"
                />

              </div>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary sm:text-base">
                Manage company information, jobs,
                candidates, account status and
                verification details.
              </p>

            </div>


            <div className="flex items-center gap-2">

              {isActive ? (
                <button
                  type="button"
                  onClick={() =>
                    setShowSuspendModal(true)
                  }
                  className="rounded-lg bg-red-100 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-200"
                >
                  Suspend Company
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    setShowActivateModal(true)
                  }
                  className="rounded-lg bg-emerald-100 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-200"
                >
                  Activate Company
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
                          "/admin/companies"
                        );
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-text transition hover:bg-slate-50"
                    >
                      <ArrowLeft size={16} />
                      Back to Companies
                    </button>

                  </div>
                )}

              </div>

            </div>

          </div>


          {/* =================================================
              COMPANY HERO
          ================================================= */}

          <section className="mb-6 rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-7">

            <div className="flex flex-col gap-6 md:flex-row md:items-center">


              {/* COMPANY LOGO */}

              <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-slate-50">

                {company.company_logo ? (
                  <img
                    src={company.company_logo}
                    alt={
                      company.company_name ||
                      "Company logo"
                    }
                    className="h-full w-full object-contain p-3"
                  />
                ) : (
                  <Building2
                    size={38}
                    className="text-primary"
                  />
                )}

              </div>


              {/* COMPANY DETAILS */}

              <div className="min-w-0 flex-1">

                <div className="mb-4 flex flex-wrap gap-2">

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white">

                    <Sparkles size={13} />

                    Company Profile

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
                  {company.company_name || "Company"}
                </h2>


                <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">

                  <HeroInfo
                    icon={Factory}
                    value={
                      company.industry ||
                      "Industry not provided"
                    }
                  />

                  <HeroInfo
                    icon={Users}
                    value={
                      company.company_size ||
                      "Company size not provided"
                    }
                  />

                  <HeroInfo
                    icon={MapPin}
                    value={
                      [
                        company.city,
                        company.state,
                        company.country,
                      ]
                        .filter(Boolean)
                        .join(", ") ||
                      "Location not provided"
                    }
                  />

                  <HeroInfo
                    icon={Globe}
                    value={
                      company.website ||
                      "Website not provided"
                    }
                  />

                  <HeroInfo
                    icon={Mail}
                    value={
                      company.email ||
                      company.contact_email ||
                      "Email not provided"
                    }
                  />

                  <HeroInfo
                    icon={Phone}
                    value={
                      company.contact_phone ||
                      company.phone ||
                      "Phone not provided"
                    }
                  />

                </div>

              </div>

            </div>


            {/* =================================================
                COMPANY INFORMATION CARDS
                NO COUNT STATISTICS HERE
            ================================================= */}

            <div className="mt-7 grid grid-cols-1 gap-3 border-t border-border pt-6 sm:grid-cols-2 lg:grid-cols-3">

              <CompanyInfoCard
                label="Company Type"
                value={
                  company.company_type ||
                  company.organization_type ||
                  "Private Company"
                }
                icon={Building2}
              />

              <CompanyInfoCard
                label="Industry"
                value={
                  company.industry ||
                  "Technology"
                }
                icon={Factory}
              />

              <CompanyInfoCard
                label="Company Size"
                value={
                  company.company_size ||
                  "Not specified"
                }
                icon={Users}
              />

              <CompanyInfoCard
                label="Founded"
                value={
                  company.founded_year ||
                  company.established_year ||
                  "Not specified"
                }
                icon={CalendarDays}
              />

              <CompanyInfoCard
                label="Headquarters"
                value={
                  [
                    company.city,
                    company.state,
                  ]
                    .filter(Boolean)
                    .join(", ") ||
                  "Not specified"
                }
                icon={MapPinned}
              />

              <CompanyInfoCard
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
              TABS
          ================================================= */}

          <div className="mb-6 overflow-x-auto border-b border-border">

            <div className="flex min-w-max items-center gap-7">

              {[
                {
                  key: "overview",
                  label: "Overview",
                },
                {
                  key: "jobs",
                  label: "Jobs",
                },
                // {
                //   key: "candidates",
                //   label: "Candidates",
                // },
                // {
                //   key: "subscription",
                //   label: "Subscription & Credits",
                // },
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
              OVERVIEW TAB
          ================================================= */}

          {activeTab === "overview" && (
            <OverviewTab
              company={company}
              isActive={isActive}
            />
          )}


          {/* =================================================
              JOBS TAB
          ================================================= */}

          {activeTab === "jobs" && (

            <div className="space-y-5">


              {/* =================================================
                  SEARCH + FILTER
              ================================================= */}

              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                <div className="relative w-full md:max-w-sm">

                  <Search
                    size={17}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                  />

                  <input
                    type="text"
                    value={jobSearch}
                    onChange={(event) =>
                      setJobSearch(
                        event.target.value
                      )
                    }
                    placeholder="Search jobs..."
                    className="h-10 w-full rounded-lg border border-border bg-white pl-10 pr-4 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />

                </div>


                <div className="flex flex-wrap items-center gap-2">

                  <select
                    value={jobStatus}
                    onChange={(event) =>
                      setJobStatus(
                        event.target.value
                      )
                    }
                    className="h-10 rounded-lg border border-border bg-white px-3 text-sm font-medium text-text outline-none focus:border-primary"
                  >

                    <option value="ALL">
                      All Status
                    </option>

                    <option value="PUBLISHED">
                      Published
                    </option>

                    <option value="DRAFT">
                      Draft
                    </option>

                    <option value="CLOSED">
                      Closed
                    </option>

                  </select>


                  <button
                    type="button"
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-white px-3 text-sm font-medium text-text transition hover:bg-slate-50"
                  >
                    <RefreshCw size={16} />
                    Refresh
                  </button>

                </div>

              </div>


              {/* =================================================
                  DYNAMIC KPI CARDS
              ================================================= */}

              <CompanyJobKpiCards
                jobs={jobs}
              />


              {/* =================================================
                  RECENT 5 JOBS
              ================================================= */}

              <CompanyRecentJobs
                jobs={filteredJobs}
              />

            </div>

          )}


          {/* =================================================
              CANDIDATES TAB
          ================================================= */}

          {activeTab === "candidates" && (

            <PlaceholderTab
              icon={Users}
              title="Candidates"
              description="Candidate information will appear here when candidate data is available from the company API."
            />

          )}


          {/* =================================================
              SUBSCRIPTION TAB
          ================================================= */}

          {activeTab === "subscription" && (

            <PlaceholderTab
              icon={CreditCard}
              title="Subscription & Credits"
              description="Subscription and credit information will appear here when those details are available from the company API."
            />

          )}

        </div>

      </div>


      {/* =====================================================
          SUSPEND MODAL
      ===================================================== */}

      {showSuspendModal && (
        <ConfirmModal
          type="suspend"
          companyName={company.company_name}
          loading={suspending}
          onCancel={() =>
            setShowSuspendModal(false)
          }
          onConfirm={handleSuspend}
        />
      )}


      {/* =====================================================
          ACTIVATE MODAL
      ===================================================== */}

      {showActivateModal && (
        <ConfirmModal
          type="activate"
          companyName={company.company_name}
          loading={activating}
          onCancel={() =>
            setShowActivateModal(false)
          }
          onConfirm={handleActivate}
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
   COMPANY INFORMATION CARD
========================================================= */

function CompanyInfoCard({
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
            {value}
          </p>

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   OVERVIEW TAB
========================================================= */

function OverviewTab({
  company,
  isActive,
}) {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

      <div className="space-y-5 xl:col-span-2">


        {/* COMPANY INFORMATION */}

        <InfoSection
          title="Company Information"
          description="Business and organization details"
          icon={Building2}
        >

          <InfoGrid>

            <InfoTile
              label="Company Name"
              value={company.company_name}
              icon={Building2}
            />

            <InfoTile
              label="Industry"
              value={company.industry}
              icon={Factory}
            />

            <InfoTile
              label="Company Size"
              value={company.company_size}
              icon={Users}
            />

            <InfoTile
              label="Website"
              value={company.website}
              icon={Globe}
              link
            />

          </InfoGrid>

        </InfoSection>


        {/* CONTACT */}

        <InfoSection
          title="Contact Information"
          description="Primary company contact details"
          icon={UserRound}
        >

          <InfoGrid>

            <InfoTile
              label="Contact Person"
              value={company.contact_person}
              icon={UserRound}
            />

            <InfoTile
              label="Email"
              value={
                company.email ||
                company.contact_email
              }
              icon={Mail}
            />

            <InfoTile
              label="Phone"
              value={
                company.contact_phone ||
                company.phone
              }
              icon={Phone}
            />

          </InfoGrid>

        </InfoSection>


        {/* LOCATION */}

        <InfoSection
          title="Company Location"
          description="Registered business address"
          icon={MapPinned}
        >

          <InfoGrid>

            <InfoTile
              label="Country"
              value={company.country}
              icon={Globe}
            />

            <InfoTile
              label="State"
              value={company.state}
              icon={MapPin}
            />

            <InfoTile
              label="City"
              value={company.city}
              icon={MapPinned}
            />

            <InfoTile
              label="Address"
              value={company.address}
              icon={MapPin}
            />

          </InfoGrid>

        </InfoSection>


        {/* DESCRIPTION */}

        <InfoSection
          title="Company Description"
          description="Business overview and introduction"
          icon={Sparkles}
        >

          <div className="rounded-xl bg-slate-50 p-5">

            <p className="whitespace-pre-wrap text-sm leading-7 text-text-secondary">
              {company.description ||
                "No company description provided."}
            </p>

          </div>

        </InfoSection>

      </div>


      {/* RIGHT COLUMN */}

      <div className="space-y-5">


        {/* ACCOUNT STATUS */}

        <InfoSection
          title="Account Status"
          description="Current company access status"
          icon={
            isActive
              ? ShieldCheck
              : ShieldAlert
          }
        >

          <div
            className={`rounded-xl border p-5 ${
              isActive
                ? "border-emerald-200 bg-emerald-50"
                : "border-red-200 bg-red-50"
            }`}
          >

            <div className="flex items-center gap-3">

              {isActive ? (
                <ShieldCheck
                  size={24}
                  className="text-emerald-600"
                />
              ) : (
                <ShieldAlert
                  size={24}
                  className="text-red-600"
                />
              )}

              <div>

                <p
                  className={`font-bold ${
                    isActive
                      ? "text-emerald-800"
                      : "text-red-800"
                  }`}
                >
                  {isActive
                    ? "Active Account"
                    : "Suspended Account"}
                </p>

                <p className="mt-1 text-xs text-text-secondary">
                  {isActive
                    ? "Login access enabled"
                    : "Login access disabled"}
                </p>

              </div>

            </div>

          </div>

        </InfoSection>


        {/* VERIFICATION */}

        <InfoSection
          title="Verification Document"
          description="Company verification file"
          icon={FileText}
        >

          {company.verification_document ? (

            <a
              href={
                company.verification_document
              }
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              <FileText size={17} />

              View Document

              <ExternalLink size={14} />

            </a>

          ) : (

            <div className="rounded-xl border border-dashed border-border bg-slate-50 p-5 text-center text-sm text-text-secondary">
              No verification document uploaded.
            </div>

          )}

        </InfoSection>


        {/* TIMELINE */}

        <InfoSection
          title="Company Timeline"
          description="Important account dates"
          icon={CalendarDays}
        >

          <div className="space-y-5">

            <TimelineRow
              label="Account Created"
              value={formatDate(
                company.created_at
              )}
              icon={CalendarDays}
            />

            <TimelineRow
              label="Current Status"
              value={
                isActive
                  ? "Active"
                  : "Suspended"
              }
              icon={
                isActive
                  ? ShieldCheck
                  : ShieldAlert
              }
            />

          </div>

        </InfoSection>

      </div>

    </div>
  );
}


/* =========================================================
   INFO SECTION
========================================================= */

function InfoSection({
  title,
  description,
  icon: Icon,
  children,
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">

      <div className="flex items-center gap-3 border-b border-border bg-slate-50 px-5 py-4">

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">

          <Icon size={18} />

        </div>

        <div>

          <h2 className="text-sm font-bold text-text sm:text-base">
            {title}
          </h2>

          <p className="mt-0.5 text-xs text-text-secondary">
            {description}
          </p>

        </div>

      </div>

      <div className="p-5">
        {children}
      </div>

    </section>
  );
}


/* =========================================================
   INFO GRID
========================================================= */

function InfoGrid({ children }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {children}
    </div>
  );
}


/* =========================================================
   INFO TILE
========================================================= */

function InfoTile({
  label,
  value,
  icon: Icon,
  link = false,
}) {
  return (
    <div className="rounded-xl border border-border bg-slate-50/60 p-4">

      <div className="flex items-start gap-3">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-primary">

          <Icon size={16} />

        </div>

        <div className="min-w-0">

          <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
            {label}
          </p>

          {link && value ? (

            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="mt-1.5 break-all text-sm font-semibold text-primary hover:underline"
            >
              {value}
            </a>

          ) : (

            <p className="mt-1.5 break-words text-sm font-semibold text-text">
              {value || "Not provided"}
            </p>

          )}

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   TIMELINE ROW
========================================================= */

function TimelineRow({
  label,
  value,
  icon: Icon,
}) {
  return (
    <div className="flex items-center gap-3">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-primary">

        <Icon size={17} />

      </div>

      <div className="min-w-0">

        <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
          {label}
        </p>

        <p className="mt-1 text-sm font-semibold text-text">
          {value}
        </p>

      </div>

    </div>
  );
}


/* =========================================================
   PLACEHOLDER TAB
========================================================= */

function PlaceholderTab({
  icon: Icon,
  title,
  description,
}) {
  return (
    <section className="rounded-xl border border-border bg-white shadow-sm">

      <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-primary">

          <Icon size={27} />

        </div>

        <h2 className="mt-5 text-lg font-bold text-text">
          {title}
        </h2>

        <p className="mt-2 max-w-lg text-sm leading-6 text-text-secondary">
          {description}
        </p>

      </div>

    </section>
  );
}


/* =========================================================
   CONFIRM MODAL
========================================================= */

function ConfirmModal({
  type,
  companyName,
  loading,
  onCancel,
  onConfirm,
}) {
  const isSuspend = type === "suspend";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">

      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">


        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-border px-6 py-5">

          <div className="flex items-center gap-3">

            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                isSuspend
                  ? "bg-red-100 text-red-600"
                  : "bg-emerald-100 text-emerald-600"
              }`}
            >

              {isSuspend ? (
                <Ban size={20} />
              ) : (
                <ShieldCheck size={20} />
              )}

            </div>

            <div>

              <h2 className="font-bold text-text">
                {isSuspend
                  ? "Suspend Company"
                  : "Activate Company"}
              </h2>

              <p className="mt-0.5 text-xs text-text-secondary">
                {isSuspend
                  ? "Account access restriction"
                  : "Restore account access"}
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

          <div
            className={`rounded-xl border p-4 ${
              isSuspend
                ? "border-red-200 bg-red-50"
                : "border-emerald-200 bg-emerald-50"
            }`}
          >

            <p
              className={`text-sm leading-6 ${
                isSuspend
                  ? "text-red-700"
                  : "text-emerald-700"
              }`}
            >

              Are you sure you want to{" "}

              <span className="font-bold">
                {isSuspend
                  ? "suspend"
                  : "activate"}
              </span>

              {" "}

              <span className="font-bold">
                {companyName}
              </span>
              ?

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
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 ${
                isSuspend
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >

              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                  {isSuspend
                    ? "Suspending..."
                    : "Activating..."}
                </>
              ) : (
                <>
                  {isSuspend ? (
                    <Ban size={16} />
                  ) : (
                    <ShieldCheck size={16} />
                  )}

                  {isSuspend
                    ? "Suspend"
                    : "Activate"}
                </>
              )}

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}


export default CompanyDetails;