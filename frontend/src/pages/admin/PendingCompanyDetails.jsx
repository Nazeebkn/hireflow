import { toast } from "sonner";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  XCircle,
  FileCheck2,
  MapPin,
  Phone,
  Globe,
  Users,
  BriefcaseBusiness,
  Clock3,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Loader2,
  UserRound,
  Factory,
  Sparkles,
} from "lucide-react";

import DashboardSidebar from "../../components/admin/dashboard/DashboardSidebar";
import DashboardNavbar from "../../components/admin/dashboard/DashboardNavbar";

import {
  getCompanyDetails,
  approveCompany,
  rejectCompany,
} from "../../services/admin/adminService";

function PendingCompanyDetails() {
  const navigate = useNavigate();
  const { companyId } = useParams();

  const [company, setCompany] = useState(null);

  // Approval modal
  const [showApproveModal, setShowApproveModal] = useState(false);

  // Reject modal
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // =====================================================
  // FETCH COMPANY DETAILS
  // =====================================================

  const fetchCompanyDetails = async () => {
    try {
      setLoading(true);

      const data = await getCompanyDetails(companyId);

      console.log("Pending Company Details:", data);

      setCompany(data);
    } catch (error) {
      console.error(
        "Failed to fetch company details:",
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyDetails();
  }, [companyId]);

  // =====================================================
  // CONFIRM APPROVE COMPANY
  // =====================================================

  const handleApprove = async () => {
    try {
      setActionLoading(true);

      await approveCompany(companyId);

      setShowApproveModal(false);

      toast.success(
        "Company approved successfully.",
      );

      navigate("/admin/pending-companies");
    } catch (error) {
      console.error(
        "Approve company failed:",
        error,
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to approve company.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // CONFIRM REJECT COMPANY
  // =====================================================

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error(
        "Please enter a rejection reason.",
      );
      return;
    }

    try {
      setActionLoading(true);

      await rejectCompany(companyId, {
        rejection_reason:
          rejectionReason.trim(),
      });

      setShowRejectModal(false);
      setRejectionReason("");

      toast.success(
        "Company rejected successfully.",
      );

      navigate("/admin/pending-companies");
    } catch (error) {
      console.error(
        "Reject company failed:",
        error,
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to reject company.",
      );
    } finally {
      setActionLoading(false);
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

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">

                <Loader2
                  size={28}
                  className="animate-spin text-primary"
                />

              </div>

              <div className="text-center">

                <p className="font-semibold text-text-primary">
                  Loading company details
                </p>

                <p className="mt-1 text-sm text-text-secondary">
                  Please wait while we fetch the application.
                </p>

              </div>

            </div>

          </div>

        </main>

      </div>
    );
  }

  // =====================================================
  // COMPANY NOT FOUND
  // =====================================================

  if (!company) {
    return (
      <div className="h-screen overflow-hidden bg-background">

        <DashboardSidebar />

        <main className="ml-0 h-screen md:ml-72">

          <div className="fixed left-0 right-0 top-0 z-50 md:left-72">
            <DashboardNavbar />
          </div>

          <div className="flex h-screen items-center justify-center px-4 pt-20">

            <div className="w-full max-w-md rounded-3xl border border-border bg-white p-8 text-center shadow-sm">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">

                <AlertTriangle
                  size={30}
                  className="text-red-500"
                />

              </div>

              <h2 className="mt-5 text-xl font-bold text-text-primary">
                Company not found
              </h2>

              <p className="mt-2 text-sm text-text-secondary">
                We couldn't load the requested company profile.
              </p>

              <button
                onClick={() =>
                  navigate(
                    "/admin/pending-companies",
                  )
                }
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
              >
                <ArrowLeft size={16} />
                Back to Pending Companies
              </button>

            </div>

          </div>

        </main>

      </div>
    );
  }

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
                onClick={() =>
                  navigate(
                    "/admin/pending-companies",
                  )
                }
                className="mb-5 inline-flex items-center gap-2 rounded-lg px-1 py-1 text-sm font-medium text-text-secondary transition hover:text-primary"
              >
                <ArrowLeft size={17} />
                Back to Pending Companies
              </button>

              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

                <div>

                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">

                    <Sparkles size={13} />

                    Company Registration Review

                  </div>

                  <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Pending Company Details
                  </h1>

                  <p className="mt-1.5 text-sm text-text-secondary sm:text-base">
                    Review the submitted company information before making a decision.
                  </p>

                </div>

                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 ring-1 ring-inset ring-amber-200">

                  <span className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_0_4px_rgba(245,158,11,0.12)]" />

                  Pending Review

                </div>

              </div>

            </div>

            {/* ================================================= */}
            {/* KPI CARDS */}
            {/* ================================================= */}

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <KpiCard
                title="Company"
                value={
                  company.company_name ||
                  "Company"
                }
                description="Registration request"
                icon={Building2}
                wrapper="border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50"
                iconWrapper="bg-blue-100 ring-blue-200"
                iconColor="text-blue-600"
                titleColor="text-blue-700"
                valueColor="text-blue-950"
                descriptionColor="text-blue-600"
              />

              <KpiCard
                title="Industry"
                value={
                  company.industry ||
                  "Not provided"
                }
                description="Business sector"
                icon={Factory}
                wrapper="border-violet-200 bg-gradient-to-br from-violet-50 via-white to-purple-50"
                iconWrapper="bg-violet-100 ring-violet-200"
                iconColor="text-violet-600"
                titleColor="text-violet-700"
                valueColor="text-violet-950"
                descriptionColor="text-violet-600"
              />

              <KpiCard
                title="Company Size"
                value={
                  company.company_size ||
                  "Not provided"
                }
                description="Organization size"
                icon={Users}
                wrapper="border-cyan-200 bg-gradient-to-br from-cyan-50 via-white to-sky-50"
                iconWrapper="bg-cyan-100 ring-cyan-200"
                iconColor="text-cyan-600"
                titleColor="text-cyan-700"
                valueColor="text-cyan-950"
                descriptionColor="text-cyan-600"
              />

              <KpiCard
                title="Review Status"
                value="Pending"
                description="Awaiting admin decision"
                icon={Clock3}
                wrapper="border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50"
                iconWrapper="bg-amber-100 ring-amber-200"
                iconColor="text-amber-600"
                titleColor="text-amber-700"
                valueColor="text-amber-950"
                descriptionColor="text-amber-600"
              />

            </div>

            {/* ================================================= */}
            {/* COMPANY PROFILE BANNER */}
            {/* ================================================= */}

            <section className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-primary to-indigo-600 shadow-xl">

              <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

              <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-blue-300/20 blur-3xl" />

              <div className="relative px-6 py-7 sm:px-8 lg:py-8">

                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                  <div className="flex min-w-0 items-center gap-5">

                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-xl ring-4 ring-white/20">

                      {company.logo ? (
                        <img
                          src={company.logo}
                          alt={company.company_name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Building2
                          size={34}
                          className="text-primary"
                        />
                      )}

                    </div>

                    <div className="min-w-0">

                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
                        Company Profile
                      </p>

                      <h2 className="mt-1 truncate text-2xl font-bold text-white sm:text-3xl">
                        {company.company_name}
                      </h2>

                      {company.industry && (
                        <p className="mt-1.5 text-sm font-medium text-blue-100">
                          {company.industry}
                        </p>
                      )}

                      {company.website && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-blue-100">

                          <Globe size={14} />

                          <span className="truncate">
                            {company.website}
                          </span>

                        </div>
                      )}

                    </div>

                  </div>

                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-primary shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
                    >
                      <Globe size={17} />
                      Visit Website
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
              {/* LEFT SIDE */}
              {/* ================================================= */}

              <div className="space-y-6 xl:col-span-8">

                {/* COMPANY INFORMATION */}

                <section className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">

                  <SectionHeader
                    icon={Building2}
                    title="Company Information"
                    description="Basic business and organization details"
                  />

                  <div className="grid grid-cols-1 gap-px bg-blue-100/60 sm:grid-cols-2">

                    <InfoTile
                      label="Company Name"
                      value={company.company_name}
                      icon={Building2}
                    />

                    <InfoTile
                      label="Industry"
                      value={company.industry}
                      icon={BriefcaseBusiness}
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

                  </div>

                </section>

                {/* CONTACT INFORMATION */}

                <section className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">

                  <SectionHeader
                    icon={UserRound}
                    title="Contact Information"
                    description="Primary company contact details"
                  />

                  <div className="grid grid-cols-1 gap-px bg-blue-100/60 sm:grid-cols-2">

                    <InfoTile
                      label="Contact Person"
                      value={company.contact_person}
                      icon={UserRound}
                    />

                    <InfoTile
                      label="Phone Number"
                      value={company.contact_phone}
                      icon={Phone}
                    />

                  </div>

                </section>

                {/* LOCATION */}

                <section className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">

                  <SectionHeader
                    icon={MapPin}
                    title="Company Location"
                    description="Registered business address"
                  />

                  <div className="grid grid-cols-1 gap-px bg-blue-100/60 sm:grid-cols-2">

                    <InfoTile
                      label="Country"
                      value={company.country}
                      icon={MapPin}
                    />

                    <InfoTile
                      label="State"
                      value={company.state}
                      icon={MapPin}
                    />

                    <InfoTile
                      label="City"
                      value={company.city}
                      icon={MapPin}
                    />

                    <InfoTile
                      label="Address"
                      value={company.address}
                      icon={MapPin}
                    />

                  </div>

                </section>

                {/* DESCRIPTION */}

                <section className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">

                  <SectionHeader
                    icon={Sparkles}
                    title="Company Description"
                    description="Business overview submitted during registration"
                  />

                  <div className="border-t border-blue-100 bg-blue-50/30 p-6 sm:p-7">

                    {company.description ? (
                      <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">

                        <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
                          {company.description}
                        </p>

                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/50 p-6 text-center">

                        <Sparkles
                          size={25}
                          className="mx-auto text-primary/50"
                        />

                        <p className="mt-3 text-sm font-medium text-blue-700">
                          No company description provided
                        </p>

                      </div>
                    )}

                  </div>

                </section>

              </div>

              {/* ================================================= */}
              {/* RIGHT SIDE */}
              {/* ================================================= */}

              <aside className="space-y-6 xl:col-span-4">

                {/* REVIEW STATUS */}

                <section className="overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-sm">

                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6">

                    <div className="flex items-start justify-between">

                      <div>

                        <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                          Application Status
                        </p>

                        <h2 className="mt-2 text-2xl font-bold text-amber-950">
                          {company.approval_status ||
                            "PENDING"}
                        </h2>

                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 ring-1 ring-amber-200">

                        <Clock3
                          size={22}
                          className="text-amber-600"
                        />

                      </div>

                    </div>

                  </div>

                  <div className="p-6">

                    <div className="flex items-start gap-3">

                      <ShieldCheck
                        size={19}
                        className="mt-0.5 shrink-0 text-slate-400"
                      />

                      <p className="text-sm leading-6 text-slate-500">
                        This company registration is waiting
                        for administrative verification and approval.
                      </p>

                    </div>

                  </div>

                </section>

                {/* VERIFICATION DOCUMENT */}

                <section className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">

                  <div className="border-b border-blue-100 bg-gradient-to-r from-blue-50 via-white to-indigo-50 px-6 py-5">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">

                        <FileCheck2
                          size={19}
                          className="text-primary"
                        />

                      </div>

                      <div>

                        <h2 className="font-bold text-text-primary">
                          Verification Document
                        </h2>

                        <p className="mt-1 text-xs text-text-secondary">
                          Submitted company document
                        </p>

                      </div>

                    </div>

                  </div>

                  <div className="p-6">

                    {company.verification_document ? (
                      <>
                        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">

                              <FileCheck2
                                size={19}
                                className="text-primary"
                              />

                            </div>

                            <div className="min-w-0">

                              <p className="text-sm font-semibold text-slate-800">
                                Verification Document
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                Official company document
                              </p>

                            </div>

                          </div>

                        </div>

                        <a
                          href={
                            company.verification_document
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
                        >
                          <FileCheck2 size={16} />
                          View Document
                          <ExternalLink size={14} />
                        </a>
                      </>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/50 p-6 text-center">

                        <FileCheck2
                          size={28}
                          className="mx-auto text-blue-300"
                        />

                        <p className="mt-3 text-sm font-semibold text-blue-700">
                          No document uploaded
                        </p>

                        <p className="mt-1 text-xs text-blue-500">
                          Verification document is unavailable.
                        </p>

                      </div>
                    )}

                  </div>

                </section>

                {/* ADMIN DECISION */}

                <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                  <div className="p-6">

                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Admin Decision
                    </p>

                    <h2 className="mt-1 text-lg font-bold text-slate-900">
                      Review this application
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Choose whether this company should receive
                      access to HireFlow.
                    </p>

                    <div className="mt-6 space-y-3">

                      {/* REJECT BUTTON */}

                      <button
                        onClick={() =>
                          setShowRejectModal(true)
                        }
                        disabled={actionLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <XCircle size={18} />
                        Reject Application
                      </button>

                      {/* APPROVE BUTTON */}

                      <button
                        onClick={() =>
                          setShowApproveModal(true)
                        }
                        disabled={actionLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <CheckCircle2 size={18} />
                        Approve Application
                      </button>

                    </div>

                  </div>

                </section>

              </aside>

            </div>

          </div>

        </div>

      </main>

      {/* ================================================= */}
      {/* APPROVE CONFIRMATION MODAL */}
      {/* ================================================= */}

      {showApproveModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">

          {/* Overlay */}

          <div
            className="absolute inset-0"
            onClick={() =>
              !actionLoading &&
              setShowApproveModal(false)
            }
          />

          {/* Modal */}

          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">

            {/* Header */}

            <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-5">

              <div className="flex items-start gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100">

                  <CheckCircle2
                    size={22}
                    className="text-emerald-600"
                  />

                </div>

                <div>

                  <h2 className="text-lg font-bold text-slate-900">
                    Approve Company
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Are you sure you want to approve this company?
                  </p>

                </div>

              </div>

            </div>

            {/* Body */}

            <div className="p-6">

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">

                <div className="flex items-start gap-3">

                  <Building2
                    size={19}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />

                  <div>

                    <p className="text-sm font-semibold text-emerald-900">
                      {company.company_name}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-emerald-700">
                      Once approved, this company will be allowed
                      to access HireFlow.
                    </p>

                  </div>

                </div>

              </div>

              {/* Actions */}

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <button
                  onClick={() =>
                    setShowApproveModal(false)
                  }
                  disabled={actionLoading}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {actionLoading ? (
                    <>
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                      Approving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      Confirm Approval
                    </>
                  )}

                </button>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* ================================================= */}
      {/* REJECT MODAL */}
      {/* ================================================= */}

      {showRejectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">

          {/* Overlay */}

          <div
            className="absolute inset-0"
            onClick={() =>
              !actionLoading &&
              setShowRejectModal(false)
            }
          />

          {/* Modal */}

          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">

            {/* Modal Header */}

            <div className="border-b border-slate-100 bg-gradient-to-r from-red-50 to-orange-50 px-6 py-5">

              <div className="flex items-start gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100">

                  <XCircle
                    size={22}
                    className="text-red-600"
                  />

                </div>

                <div>

                  <h2 className="text-lg font-bold text-slate-900">
                    Reject Company
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Provide a clear reason for rejecting this application.
                  </p>

                </div>

              </div>

            </div>

            {/* Modal Body */}

            <div className="p-6">

              <div className="rounded-2xl border border-red-100 bg-red-50/60 p-4">

                <p className="text-sm font-semibold text-red-900">
                  {company.company_name}
                </p>

                <p className="mt-1 text-xs leading-5 text-red-700">
                  The rejection reason will be recorded
                  with this application.
                </p>

              </div>

              <label className="mt-5 block text-sm font-semibold text-slate-700">
                Rejection Reason
              </label>

              <textarea
                value={rejectionReason}
                onChange={(e) =>
                  setRejectionReason(
                    e.target.value,
                  )
                }
                rows={5}
                placeholder="Explain why this company registration is being rejected..."
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-500/10"
              />

              <p className="mt-2 text-xs text-slate-400">
                Please provide a clear and valid reason.
              </p>

              {/* Modal Actions */}

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <button
                  onClick={() =>
                    setShowRejectModal(false)
                  }
                  disabled={actionLoading}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleReject}
                  disabled={
                    actionLoading ||
                    !rejectionReason.trim()
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {actionLoading ? (
                    <>
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <XCircle size={16} />
                      Confirm Rejection
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

          <p
            className={`text-sm font-medium ${titleColor}`}
          >
            {title}
          </p>

          <p
            className={`mt-2 truncate text-xl font-bold ${valueColor}`}
          >
            {value}
          </p>

          <p
            className={`mt-1 text-xs ${descriptionColor}`}
          >
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
  link = false,
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

          {link && value ? (
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
            <p className="mt-1.5 break-words text-sm font-semibold leading-6 text-slate-800">
              {value || "Not provided"}
            </p>
          )}

        </div>

      </div>

    </div>
  );
}

export default PendingCompanyDetails;