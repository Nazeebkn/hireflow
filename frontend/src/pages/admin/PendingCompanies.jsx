import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  Search,
  Building2,
  Inbox,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  X,
  Clock3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardSidebar from "../../components/admin/dashboard/DashboardSidebar";
import DashboardNavbar from "../../components/admin/dashboard/DashboardNavbar";

import { getPendingCompanies } from "../../services/admin/adminService";

function PendingCompanies() {
  const navigate = useNavigate();

  const [pendingCompanies, setPendingCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [loading, setLoading] = useState(true);

  const fetchPendingCompanies = async () => {
    try {
      setLoading(true);

      const data = await getPendingCompanies();

      console.log("Pending Companies:", data);

      setPendingCompanies(data);
    } catch (error) {
      console.error("Failed to fetch pending companies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingCompanies();
  }, []);

  // Get unique industries from real API data
  const industries = useMemo(() => {
    return [
      ...new Set(
        pendingCompanies.map((company) => company.industry).filter(Boolean),
      ),
    ];
  }, [pendingCompanies]);

  // Filter + sort
  const filteredCompanies = useMemo(() => {
    let result = [...pendingCompanies];

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter((company) => {
        return (
          company.company_name?.toLowerCase().includes(query) ||
          company.contact_person?.toLowerCase().includes(query) ||
          company.industry?.toLowerCase().includes(query)
        );
      });
    }

    if (industryFilter) {
      result = result.filter((company) => company.industry === industryFilter);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);

      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [pendingCompanies, search, industryFilter, sortOrder]);

  const clearFilters = () => {
    setSearch("");
    setIndustryFilter("");
    setSortOrder("newest");
  };

  const hasFilters = search.trim() || industryFilter || sortOrder !== "newest";

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <DashboardSidebar />

      <main className="ml-0 flex min-h-screen flex-1 flex-col md:ml-72">
        <DashboardNavbar />

        <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1400px]">
            {/* ================= HEADER ================= */}

            <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-200">
                    <Clock3 size={13} />
                    Approval Queue
                  </span>
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                  Pending Companies
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-text-secondary sm:text-base">
                  Review newly registered companies and verify their information
                  before granting workspace access.
                </p>
              </div>

              {/* Pending count */}

              <div className="flex items-center gap-3 rounded-2xl border border-border bg-white px-5 py-4 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50">
                  <Building2 size={21} className="text-amber-600" />
                </div>

                <div>
                  <p className="text-xs font-medium text-text-secondary">
                    Awaiting Review
                  </p>

                  <p className="mt-0.5 text-2xl font-bold text-text-primary">
                    {pendingCompanies.length}
                  </p>
                </div>
              </div>
            </div>

            {/* ================= SUMMARY ================= */}

            {/* ================= KPI CARDS ================= */}

            <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Pending Companies */}
              <div className="group relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-200/30 blur-2xl" />

                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-700">
                      Pending Companies
                    </p>

                    <p className="mt-2 text-3xl font-bold text-amber-950">
                      {pendingCompanies.length}
                    </p>

                    <p className="mt-1 text-xs text-amber-600">
                      Awaiting admin review
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 ring-1 ring-amber-200">
                    <Clock3 size={22} className="text-amber-600" />
                  </div>
                </div>
              </div>

              {/* Industries */}
              <div className="group relative overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-200/30 blur-2xl" />

                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">
                      Industries
                    </p>

                    <p className="mt-2 text-3xl font-bold text-blue-950">
                      {industries.length}
                    </p>

                    <p className="mt-1 text-xs text-blue-600">
                      Different industries
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 ring-1 ring-blue-200">
                    <Building2 size={22} className="text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Review System */}
              <div className="group relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-green-50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-200/30 blur-2xl" />

                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-700">
                      Review System
                    </p>

                    <p className="mt-2 text-2xl font-bold text-emerald-950">
                      Active
                    </p>

                    <p className="mt-1 text-xs text-emerald-600">
                      Approval queue operational
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 ring-1 ring-emerald-200">
                    <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_0_5px_rgba(16,185,129,0.15)]" />
                  </div>
                </div>
              </div>

              {/* Admin Action */}
              <div className="group relative overflow-hidden rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-purple-50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-200/30 blur-2xl" />

                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-violet-700">
                      Admin Action
                    </p>

                    <p className="mt-2 text-xl font-bold text-violet-950">
                      Review Queue
                    </p>

                    <p className="mt-1 text-xs text-violet-600">
                      Process pending requests
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 ring-1 ring-violet-200">
                    <Eye size={22} className="text-violet-600" />
                  </div>
                </div>
              </div>
            </div>
            {/* ================= MAIN CARD ================= */}

            <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
              {/* Card Header */}

              <div className="border-b border-border p-5 sm:p-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-text-primary">
                      Approval Queue
                    </h2>

                    <p className="mt-1 text-sm text-text-secondary">
                      Companies waiting for verification and approval.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <span className="font-medium text-text-primary">
                      {filteredCompanies.length}
                    </span>
                    result
                    {filteredCompanies.length !== 1 && "s"}
                  </div>
                </div>

                {/* ================= FILTER BAR ================= */}

                <div className="mt-5 flex flex-col gap-3 lg:flex-row">
                  {/* Search */}

                  <div className="relative flex-1">
                    <Search
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      placeholder="Search company, contact or industry..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="h-11 w-full rounded-xl border border-border bg-[#fafbfc] pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                    />
                  </div>

                  {/* Industry */}

                  <div className="relative lg:w-56">
                    <SlidersHorizontal
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <select
                      value={industryFilter}
                      onChange={(e) => setIndustryFilter(e.target.value)}
                      className="h-11 w-full appearance-none rounded-xl border border-border bg-[#fafbfc] pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                    >
                      <option value="">All Industries</option>

                      {industries.map((industry) => (
                        <option key={industry} value={industry}>
                          {industry}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort */}

                  <div className="relative lg:w-48">
                    <ArrowUpDown
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="h-11 w-full appearance-none rounded-xl border border-border bg-[#fafbfc] pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                    >
                      <option value="newest">Newest First</option>

                      <option value="oldest">Oldest First</option>
                    </select>
                  </div>

                  {/* Clear */}

                  {hasFilters && (
                    <button
                      onClick={clearFilters}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-medium text-text-secondary transition hover:bg-gray-50 hover:text-text-primary"
                    >
                      <X size={16} />
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* ================= DESKTOP TABLE ================= */}

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b border-border bg-[#fafbfc]">
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Company
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Industry
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Primary Contact
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Submitted
                      </th>

                      <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Status
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />

                            <p className="text-sm text-text-secondary">
                              Loading approval queue...
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : filteredCompanies.length > 0 ? (
                      filteredCompanies.map((company) => (
                        <tr
                          key={company.id}
                          className="group border-b border-border last:border-0 transition-colors hover:bg-[#fafcff]"
                        >
                          {/* Company */}

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-primary/5">
                                {company.company_logo ? (
                                  <img
                                    src={company.company_logo}
                                    alt={company.company_name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <Building2
                                    size={20}
                                    className="text-primary"
                                  />
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate font-semibold text-text-primary">
                                  {company.company_name}
                                </p>

                                <p className="mt-0.5 text-xs text-text-secondary">
                                  Company registration
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Industry */}

                          <td className="px-6 py-5">
                            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
                              {company.industry || "Not specified"}
                            </span>
                          </td>

                          {/* Contact */}

                          <td className="px-6 py-5">
                            <p className="text-sm font-medium text-text-primary">
                              {company.contact_person || "—"}
                            </p>

                            {company.contact_phone && (
                              <p className="mt-1 text-xs text-text-secondary">
                                {company.contact_phone}
                              </p>
                            )}
                          </td>

                          {/* Submitted */}

                          <td className="px-6 py-5">
                            <p className="text-sm font-medium text-text-primary">
                              {new Date(company.created_at).toLocaleDateString(
                                "en-GB",
                              )}
                            </p>

                            <p className="mt-1 text-xs text-text-secondary">
                              {new Date(company.created_at).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </p>
                          </td>

                          {/* Status */}

                          <td className="px-6 py-5 text-center">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-200">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                              Pending
                            </span>
                          </td>

                          {/* Action */}

                          <td className="px-6 py-5 text-right">
                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/pending-companies/${company.id}`,
                                )
                              }
                              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary/90 hover:shadow-md active:scale-[0.98]"
                            >
                              <Eye size={16} />
                              Review
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-20 text-center">
                          <div className="mx-auto flex max-w-sm flex-col items-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                              <Inbox size={26} className="text-gray-400" />
                            </div>

                            <h3 className="mt-4 font-semibold text-text-primary">
                              {search || industryFilter
                                ? "No matching companies"
                                : "No pending companies"}
                            </h3>

                            <p className="mt-1 text-sm text-text-secondary">
                              {search || industryFilter
                                ? "Try changing your search or filters."
                                : "All company registration requests have been reviewed."}
                            </p>

                            {hasFilters && (
                              <button
                                onClick={clearFilters}
                                className="mt-4 text-sm font-semibold text-primary hover:underline"
                              >
                                Clear filters
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* ================= MOBILE ================= */}

              <div className="space-y-3 p-4 md:hidden">
                {loading ? (
                  <div className="flex flex-col items-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />

                    <p className="mt-3 text-sm text-text-secondary">
                      Loading approval queue...
                    </p>
                  </div>
                ) : filteredCompanies.length > 0 ? (
                  filteredCompanies.map((company) => (
                    <div
                      key={company.id}
                      className="rounded-2xl border border-border bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/5">
                            {company.company_logo ? (
                              <img
                                src={company.company_logo}
                                alt={company.company_name}
                                className="h-full w-full rounded-xl object-cover"
                              />
                            ) : (
                              <Building2 size={20} className="text-primary" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <h3 className="truncate font-semibold text-text-primary">
                              {company.company_name}
                            </h3>

                            <p className="mt-0.5 truncate text-xs text-text-secondary">
                              {company.industry || "Industry not specified"}
                            </p>
                          </div>
                        </div>

                        <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                          Pending
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-gray-50 p-3">
                        <div>
                          <p className="text-[11px] font-medium uppercase tracking-wide text-text-secondary">
                            Contact
                          </p>

                          <p className="mt-1 truncate text-sm font-medium text-text-primary">
                            {company.contact_person || "—"}
                          </p>
                        </div>

                        <div>
                          <p className="text-[11px] font-medium uppercase tracking-wide text-text-secondary">
                            Submitted
                          </p>

                          <p className="mt-1 text-sm font-medium text-text-primary">
                            {new Date(company.created_at).toLocaleDateString(
                              "en-GB",
                            )}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          navigate(`/admin/pending-companies/${company.id}`)
                        }
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white"
                      >
                        <Eye size={16} />
                        Review Company
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="py-14 text-center">
                    <Inbox size={36} className="mx-auto text-gray-400" />

                    <p className="mt-3 text-sm font-medium text-text-primary">
                      No pending companies
                    </p>
                  </div>
                )}
              </div>

              {/* ================= FOOTER ================= */}

              {filteredCompanies.length > 0 && (
                <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-text-secondary">
                    Showing{" "}
                    <span className="font-semibold text-text-primary">
                      {filteredCompanies.length}
                    </span>{" "}
                    pending{" "}
                    {filteredCompanies.length === 1 ? "company" : "companies"}
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      disabled
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-gray-400 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-primary px-3 text-sm font-semibold text-white">
                      1
                    </span>

                    <button
                      disabled
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-gray-400 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PendingCompanies;
