import { useCallback, useEffect, useState } from "react";

import {
  Eye,
  Search,
  Building2,
  Inbox,
  CheckCircle2,
  Users,
  XCircle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Clock3,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";

import DashboardSidebar from "../../components/admin/dashboard/DashboardSidebar";
import DashboardNavbar from "../../components/admin/dashboard/DashboardNavbar";

import { getCompanies } from "../../services/admin/adminService";

function Companies() {
  const navigate = useNavigate();
  const location = useLocation();

  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const ITEMS_PER_PAGE = 6;

  // =====================================================
  // COMPANY ACTIVE STATUS
  // =====================================================

  const isCompanyActive = (company) => {
    if (typeof company?.user?.is_active === "boolean") {
      return company.user.is_active;
    }

    if (typeof company?.is_active === "boolean") {
      return company.is_active;
    }

    return true;
  };

  // =====================================================
  // FETCH COMPANIES
  // =====================================================

  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getCompanies();

      console.log("Companies API Response:", data);

      setCompanies(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch companies:", error);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies, location.key]);

  // =====================================================
  // REFRESH WHEN WINDOW FOCUSES
  // =====================================================

  useEffect(() => {
    const handleFocus = () => {
      fetchCompanies();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchCompanies]);

  // =====================================================
  // KPI COUNTS
  // =====================================================

  const totalCompanies = companies.length;

  const approvedCompanies = companies.filter(
    (company) =>
      String(company.approval_status || "")
        .trim()
        .toUpperCase() === "APPROVED",
  ).length;

  const activeCompanies = companies.filter(
    (company) => isCompanyActive(company),
  ).length;

  const suspendedCompanies = companies.filter(
    (company) => !isCompanyActive(company),
  ).length;

  // =====================================================
  // FILTER + SORT
  // =====================================================

  const filteredCompanies = [...companies]
    .filter((company) => {
      const query = search.toLowerCase().trim();

      if (!query) {
        return true;
      }

      return (
        company.company_name
          ?.toLowerCase()
          .includes(query) ||
        company.contact_person
          ?.toLowerCase()
          .includes(query) ||
        company.industry
          ?.toLowerCase()
          .includes(query)
      );
    })
    .filter((company) => {
      if (!statusFilter) {
        return true;
      }

      const active = isCompanyActive(company);

      if (statusFilter === "ACTIVE") {
        return active;
      }

      if (statusFilter === "SUSPENDED") {
        return !active;
      }

      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);

      return sortOrder === "newest"
        ? dateB - dateA
        : dateA - dateB;
    });

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.ceil(
    filteredCompanies.length / ITEMS_PER_PAGE,
  );

  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // =====================================================
  // LATEST ACTIVITY
  // =====================================================

  const latestActivities = [...companies]
    .sort(
      (a, b) =>
        new Date(b.created_at) -
        new Date(a.created_at),
    )
    .slice(0, 5);

  // =====================================================
  // RESET PAGE
  // =====================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, sortOrder]);

  // =====================================================
  // PAGINATION
  // =====================================================

  const goToPreviousPage = () => {
    setCurrentPage((previous) =>
      Math.max(previous - 1, 1),
    );
  };

  const goToNextPage = () => {
    setCurrentPage((previous) =>
      Math.min(
        previous + 1,
        Math.max(totalPages, 1),
      ),
    );
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="h-screen overflow-hidden bg-background">

      {/* SIDEBAR */}

      <DashboardSidebar />

      {/* MAIN */}

      <main className="ml-0 h-screen md:ml-72">

        {/* NAVBAR */}

        <div className="fixed left-0 right-0 top-0 z-50 md:left-72">
          <DashboardNavbar />
        </div>

        {/* CONTENT */}

        <div className="h-screen overflow-y-auto pt-[80px]">

          <div className="w-full px-4 py-7 sm:px-6 lg:px-8">

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="mb-7">

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Companies
                  </h1>

                  <p className="mt-2 text-base text-text-secondary">
                    Manage all registered companies on HireFlow.
                  </p>

                </div>

                <div className="flex w-fit items-center gap-2 rounded-full bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary">

                  <Building2 size={18} />

                  {totalCompanies}{" "}
                  {totalCompanies === 1
                    ? "company"
                    : "companies"}

                </div>

              </div>

            </div>

            {/* ================================================= */}
            {/* KPI CARDS */}
            {/* ================================================= */}

            <div className="mb-7 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

              <KpiCard
                title="Total Companies"
                value={totalCompanies}
                description="All registered companies"
                icon={Building2}
                wrapper="border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50"
                iconWrapper="bg-blue-100 ring-blue-200"
                iconColor="text-blue-600"
                titleColor="text-blue-700"
                valueColor="text-blue-950"
                descriptionColor="text-blue-600"
              />

              <KpiCard
                title="Approved Companies"
                value={approvedCompanies}
                description="Successfully approved"
                icon={CheckCircle2}
                wrapper="border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-green-50"
                iconWrapper="bg-emerald-100 ring-emerald-200"
                iconColor="text-emerald-600"
                titleColor="text-emerald-700"
                valueColor="text-emerald-950"
                descriptionColor="text-emerald-600"
              />

              <KpiCard
                title="Active Companies"
                value={activeCompanies}
                description="Currently active"
                icon={Users}
                wrapper="border-violet-200 bg-gradient-to-br from-violet-50 via-white to-purple-50"
                iconWrapper="bg-violet-100 ring-violet-200"
                iconColor="text-violet-600"
                titleColor="text-violet-700"
                valueColor="text-violet-950"
                descriptionColor="text-violet-600"
              />

              <KpiCard
                title="Suspended Companies"
                value={suspendedCompanies}
                description="Access currently suspended"
                icon={XCircle}
                wrapper="border-rose-200 bg-gradient-to-br from-rose-50 via-white to-red-50"
                iconWrapper="bg-rose-100 ring-rose-200"
                iconColor="text-rose-600"
                titleColor="text-rose-700"
                valueColor="text-rose-950"
                descriptionColor="text-rose-600"
              />

            </div>

            {/* ================================================= */}
            {/* COMPANY TABLE + LATEST ACTIVITY */}
            {/* ================================================= */}

            <div className="grid grid-cols-[minmax(0,1fr)_270px] items-stretch gap-5">

              {/* ================================================= */}
              {/* COMPANY DIRECTORY */}
              {/* ================================================= */}

              <section className="min-w-0 overflow-hidden rounded-3xl border border-border bg-white shadow-sm">

                {/* HEADER */}

                <div className="border-b border-border p-6">

                  <div className="flex items-center justify-between gap-4">

                    <div>

                      <h2 className="text-xl font-semibold text-text-primary">
                        Company Directory
                      </h2>

                      <p className="mt-1 text-sm text-text-secondary">
                        Manage registered companies.
                      </p>

                    </div>

                    <button
                      onClick={fetchCompanies}
                      disabled={loading}
                      title="Refresh"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border text-text-secondary transition hover:bg-gray-50 hover:text-primary disabled:opacity-50"
                    >

                      <RefreshCw
                        size={17}
                        className={
                          loading
                            ? "animate-spin"
                            : ""
                        }
                      />

                    </button>

                  </div>

                  {/* FILTERS */}

                  <div className="mt-5 grid grid-cols-[minmax(0,1fr)_130px_130px] gap-3">

                    <div className="relative">

                      <Search
                        size={17}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        placeholder="Search company..."
                        value={search}
                        onChange={(e) =>
                          setSearch(e.target.value)
                        }
                        className="h-11 w-full rounded-xl border border-border bg-gray-50 pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
                      />

                    </div>

                    <select
                      value={statusFilter}
                      onChange={(e) =>
                        setStatusFilter(e.target.value)
                      }
                      className="h-11 rounded-xl border border-border bg-gray-50 px-3 text-sm outline-none focus:border-primary"
                    >

                      <option value="">
                        All Status
                      </option>

                      <option value="ACTIVE">
                        Active
                      </option>

                      <option value="SUSPENDED">
                        Suspended
                      </option>

                    </select>

                    <select
                      value={sortOrder}
                      onChange={(e) =>
                        setSortOrder(e.target.value)
                      }
                      className="h-11 rounded-xl border border-border bg-gray-50 px-3 text-sm outline-none focus:border-primary"
                    >

                      <option value="newest">
                        Newest
                      </option>

                      <option value="oldest">
                        Oldest
                      </option>

                    </select>

                  </div>

                </div>

                {/* ================================================= */}
                {/* TABLE */}
                {/* ================================================= */}

                {loading ? (

                  <div className="flex h-[430px] items-center justify-center">

                    <div className="flex flex-col items-center gap-3">

                      <div className="h-9 w-9 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />

                      <p className="text-sm text-text-secondary">
                        Loading companies...
                      </p>

                    </div>

                  </div>

                ) : (

                  /*
                   * IMPORTANT:
                   * px-5 creates a real gap between the table
                   * and the Company Directory card edges.
                   */

                  <div className="overflow-hidden px-5">

                    <table className="w-full table-fixed">

                      <thead>

                        <tr className="border-b border-border bg-gray-50">

                          <th className="w-[27%] px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-text-secondary">
                            Company
                          </th>

                          <th className="w-[16%] px-3 py-4 text-left text-xs font-bold uppercase tracking-wider text-text-secondary">
                            Industry
                          </th>

                          <th className="w-[18%] px-3 py-4 text-left text-xs font-bold uppercase tracking-wider text-text-secondary">
                            Contact
                          </th>

                          <th className="w-[15%] px-3 py-4 text-left text-xs font-bold uppercase tracking-wider text-text-secondary">
                            Registered
                          </th>

                          <th className="w-[14%] px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-text-secondary">
                            Status
                          </th>

                          <th className="w-[10%] py-4 pl-3 pr-5 text-center text-xs font-bold uppercase tracking-wider text-text-secondary">
                            Action
                          </th>

                        </tr>

                      </thead>

                      <tbody>

                        {paginatedCompanies.length > 0 ? (

                          paginatedCompanies.map(
                            (company) => {

                              const active =
                                isCompanyActive(
                                  company,
                                );

                              return (

                                <tr
                                  key={company.id}
                                  className="border-b border-border last:border-0 transition hover:bg-blue-50/30"
                                >

                                  {/* COMPANY */}

                                  <td className="px-4 py-5">

                                    <div className="flex min-w-0 items-center gap-3">

                                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/10">

                                        {company.company_logo ? (

                                          <img
                                            src={
                                              company.company_logo
                                            }
                                            alt=""
                                            className="h-full w-full object-cover"
                                          />

                                        ) : (

                                          <Building2
                                            size={18}
                                            className="text-primary"
                                          />

                                        )}

                                      </div>

                                      <div className="min-w-0">

                                        <p className="truncate text-sm font-semibold text-text-primary">
                                          {
                                            company.company_name
                                          }
                                        </p>

                                        <p className="mt-1 truncate text-xs text-text-secondary">
                                          Company #
                                          {company.id}
                                        </p>

                                      </div>

                                    </div>

                                  </td>

                                  {/* INDUSTRY */}

                                  <td className="px-3 py-5">

                                    <span className="block truncate text-sm font-medium text-text-primary">
                                      {company.industry ||
                                        "—"}
                                    </span>

                                  </td>

                                  {/* CONTACT */}

                                  <td className="px-3 py-5">

                                    <span className="block truncate text-sm font-medium text-text-primary">
                                      {
                                        company.contact_person ||
                                        "—"
                                      }
                                    </span>

                                  </td>

                                  {/* REGISTERED */}

                                  <td className="px-3 py-5">

                                    <span className="text-sm font-medium text-text-primary">
                                      {new Date(
                                        company.created_at,
                                      ).toLocaleDateString(
                                        "en-GB",
                                      )}
                                    </span>

                                  </td>

                                  {/* STATUS */}

                                  <td className="px-4 py-5 text-center">

                                    {active ? (

                                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">

                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                                        Active

                                      </span>

                                    ) : (

                                      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">

                                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />

                                        Suspended

                                      </span>

                                    )}

                                  </td>

                                  {/* ACTION */}

                                  <td className="py-5 pl-3 pr-5 text-center">

                                    <button
                                      onClick={() =>
                                        navigate(
                                          `/admin/companies/${company.id}`,
                                        )
                                      }
                                      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-primary/90"
                                    >

                                      <Eye size={15} />

                                      View

                                    </button>

                                  </td>

                                </tr>

                              );
                            },
                          )

                        ) : (

                          <tr>

                            <td
                              colSpan={6}
                              className="h-[430px] px-6 text-center"
                            >

                              <Inbox
                                size={30}
                                className="mx-auto text-gray-400"
                              />

                              <p className="mt-3 text-sm font-semibold text-text-primary">
                                No companies found
                              </p>

                              <p className="mt-1 text-sm text-text-secondary">
                                Try changing your search or filters.
                              </p>

                            </td>

                          </tr>

                        )}

                      </tbody>

                    </table>

                  </div>

                )}

                {/* ================================================= */}
                {/* PAGINATION */}
                {/* ================================================= */}

                {!loading &&
                  filteredCompanies.length > 0 && (

                    <div className="flex items-center justify-between border-t border-border px-5 py-4">

                      <p className="text-sm text-text-secondary">

                        Showing{" "}

                        <span className="font-semibold text-text-primary">
                          {(currentPage - 1) *
                            ITEMS_PER_PAGE +
                            1}
                        </span>

                        {" - "}

                        <span className="font-semibold text-text-primary">
                          {Math.min(
                            currentPage *
                              ITEMS_PER_PAGE,
                            filteredCompanies.length,
                          )}
                        </span>

                        {" of "}

                        <span className="font-semibold text-text-primary">
                          {filteredCompanies.length}
                        </span>

                      </p>

                      <div className="flex items-center gap-1.5">

                        <button
                          onClick={
                            goToPreviousPage
                          }
                          disabled={
                            currentPage === 1
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <ChevronLeft size={16} />
                        </button>

                        {pageNumbers.map(
                          (page) => (

                            <button
                              key={page}
                              onClick={() =>
                                goToPage(page)
                              }
                              className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-semibold ${
                                currentPage ===
                                page
                                  ? "bg-primary text-white"
                                  : "border border-border text-text-secondary hover:bg-gray-50"
                              }`}
                            >
                              {page}
                            </button>

                          ),
                        )}

                        <button
                          onClick={
                            goToNextPage
                          }
                          disabled={
                            currentPage ===
                              totalPages ||
                            totalPages === 0
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <ChevronRight size={16} />
                        </button>

                      </div>

                    </div>

                  )}

              </section>

              {/* ================================================= */}
              {/* LATEST ACTIVITY */}
              {/* ================================================= */}

              <section className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-border bg-white shadow-sm">

                <div className="flex shrink-0 items-center justify-between border-b border-border bg-gradient-to-r from-blue-50 via-white to-indigo-50 px-4 py-4">

                  <div className="min-w-0">

                    <h2 className="text-base font-bold text-text-primary">
                      Latest Activity
                    </h2>

                    <p className="mt-1 text-xs text-text-secondary">
                      Recent registrations
                    </p>

                  </div>

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-primary">
                    <Clock3 size={15} />
                  </div>

                </div>

                <div className="min-h-0 flex-1 overflow-hidden">

                  <table className="w-full table-fixed">

                    <thead>

                      <tr className="border-b border-border bg-gray-50">

                        <th className="w-[52%] px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-text-secondary">
                          Company
                        </th>

                        <th className="w-[48%] px-2 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-text-secondary">
                          Date
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {latestActivities.length > 0 ? (

                        latestActivities.map(
                          (company) => {

                            const active =
                              isCompanyActive(
                                company,
                              );

                            return (

                              <tr
                                key={company.id}
                                onClick={() =>
                                  navigate(
                                    `/admin/companies/${company.id}`,
                                  )
                                }
                                className="cursor-pointer border-b border-border last:border-0 transition hover:bg-blue-50/40"
                              >

                                <td className="px-3 py-4">

                                  <div className="flex min-w-0 items-center gap-2">

                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">

                                      <Building2
                                        size={14}
                                        className="text-primary"
                                      />

                                    </div>

                                    <div className="min-w-0">

                                      <p className="truncate text-xs font-semibold text-text-primary">
                                        {
                                          company.company_name
                                        }
                                      </p>

                                      <div className="mt-1 flex items-center gap-1.5">

                                        <span
                                          className={`h-1.5 w-1.5 rounded-full ${
                                            active
                                              ? "bg-emerald-500"
                                              : "bg-red-500"
                                          }`}
                                        />

                                        <span className="text-[10px] text-text-secondary">
                                          {active
                                            ? "Active"
                                            : "Suspended"}
                                        </span>

                                      </div>

                                    </div>

                                  </div>

                                </td>

                                <td className="px-2 py-4">

                                  <p className="text-xs font-semibold text-text-primary">
                                    {new Date(
                                      company.created_at,
                                    ).toLocaleDateString(
                                      "en-GB",
                                    )}
                                  </p>

                                  <p className="mt-1 text-[10px] text-text-secondary">
                                    {new Date(
                                      company.created_at,
                                    ).toLocaleTimeString(
                                      [],
                                      {
                                        hour: "2-digit",
                                        minute:
                                          "2-digit",
                                      },
                                    )}
                                  </p>

                                </td>

                              </tr>

                            );
                          },
                        )

                      ) : (

                        <tr>

                          <td
                            colSpan={2}
                            className="h-[430px] px-4 text-center"
                          >

                            <Clock3
                              size={25}
                              className="mx-auto text-gray-400"
                            />

                            <p className="mt-3 text-sm font-semibold text-text-primary">
                              No recent activity
                            </p>

                          </td>

                        </tr>

                      )}

                    </tbody>

                  </table>

                </div>

                <div className="shrink-0 border-t border-border bg-gray-50/70 px-4 py-3">

                  <p className="text-center text-xs text-text-secondary">
                    Latest 5 registrations
                  </p>

                </div>

              </section>

            </div>

          </div>

        </div>

      </main>

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
      className={`group relative min-h-[145px] overflow-hidden rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${wrapper}`}
    >

      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/50 blur-2xl" />

      <div className="relative flex h-full items-center justify-between gap-4">

        <div className="min-w-0">

          <p
            className={`text-sm font-semibold ${titleColor}`}
          >
            {title}
          </p>

          <p
            className={`mt-2 text-2xl font-bold ${valueColor}`}
          >
            {value}
          </p>

          <p
            className={`mt-1 text-sm ${descriptionColor}`}
          >
            {description}
          </p>

        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 ${iconWrapper}`}
        >

          <Icon
            size={21}
            className={iconColor}
          />

        </div>

      </div>

    </div>
  );
}

export default Companies;