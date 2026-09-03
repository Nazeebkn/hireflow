import { useEffect, useMemo, useState } from "react";

import {
  Eye,
  Search,
  Users,
  UserCheck,
  UserX,
  UserRound,
  ChevronLeft,
  ChevronRight,
  X,
  Phone,
  Clock3,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import DashboardSidebar from "../../components/admin/dashboard/DashboardSidebar";
import DashboardNavbar from "../../components/admin/dashboard/DashboardNavbar";

import { getCandidates } from "../../services/admin/adminService";

function Candidates() {
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const ITEMS_PER_PAGE = 5;

  // =====================================================
  // FETCH CANDIDATES
  // =====================================================

  const fetchCandidates = async () => {
    try {
      setLoading(true);

      const data = await getCandidates("", 1);

      console.log("Candidates API Response:", data);

      const candidateList = Array.isArray(data)
        ? data
        : data?.results || [];

      console.log("Candidate List:", candidateList);

      setCandidates(candidateList);
    } catch (error) {
      console.error(
        "Failed to fetch candidates:",
        error,
      );

      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  // =====================================================
  // KPI DATA
  // =====================================================

  const totalCandidates = candidates.length;

  const activeCandidates = candidates.filter(
    (candidate) =>
      candidate.is_active === true,
  ).length;

  const suspendedCandidates = candidates.filter(
    (candidate) =>
      candidate.is_active === false,
  ).length;

  const recentCandidates = candidates.filter(
    (candidate) => {
      if (!candidate.created_at) {
        return false;
      }

      const createdDate = new Date(
        candidate.created_at,
      );

      const sevenDaysAgo = new Date();

      sevenDaysAgo.setDate(
        sevenDaysAgo.getDate() - 7,
      );

      return createdDate >= sevenDaysAgo;
    },
  ).length;

  // =====================================================
  // SEARCH + FILTER + SORT
  // =====================================================

  const filteredCandidates = useMemo(() => {
    let result = [...candidates];

    if (search.trim()) {
      const query = search
        .toLowerCase()
        .trim();

      result = result.filter(
        (candidate) => {
          const fullName =
            `${candidate.first_name || ""} ${
              candidate.last_name || ""
            }`.toLowerCase();

          return (
            fullName.includes(query) ||
            candidate.email
              ?.toLowerCase()
              .includes(query) ||
            candidate.phone_number
              ?.toLowerCase()
              .includes(query) ||
            candidate.location
              ?.toLowerCase()
              .includes(query)
          );
        },
      );
    }

    if (statusFilter === "ACTIVE") {
      result = result.filter(
        (candidate) =>
          candidate.is_active === true,
      );
    }

    if (statusFilter === "SUSPENDED") {
      result = result.filter(
        (candidate) =>
          candidate.is_active === false,
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(
        a.created_at || 0,
      );

      const dateB = new Date(
        b.created_at || 0,
      );

      return sortOrder === "newest"
        ? dateB - dateA
        : dateA - dateB;
    });

    return result;
  }, [
    candidates,
    search,
    statusFilter,
    sortOrder,
  ]);

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredCandidates.length /
        ITEMS_PER_PAGE,
    ),
  );

  const paginatedCandidates =
    filteredCandidates.slice(
      (currentPage - 1) *
        ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE,
    );

  // =====================================================
  // LATEST ACTIVITY
  // =====================================================

  const latestActivities = useMemo(() => {
    return [...candidates]
      .sort(
        (a, b) =>
          new Date(b.created_at || 0) -
          new Date(a.created_at || 0),
      )
      .slice(0, 5);
  }, [candidates]);

  // =====================================================
  // RESET PAGE
  // =====================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    statusFilter,
    sortOrder,
  ]);

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
        totalPages,
      ),
    );
  };

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setSortOrder("newest");
    setCurrentPage(1);
  };

  const hasFilters =
    search.trim() ||
    statusFilter ||
    sortOrder !== "newest";

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

            <div className="mx-auto w-full max-w-[1450px]">

              {/* ================================================= */}
              {/* HEADER */}
              {/* ================================================= */}

              <div className="mb-7">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <div className="mb-3 flex items-center gap-2">

                      <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 ring-1 ring-inset ring-violet-200">

                        <Users size={13} />

                        Candidate Management

                      </span>

                    </div>

                    <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                      Candidates
                    </h1>

                    <p className="mt-2 text-sm text-text-secondary sm:text-base">
                      Manage all registered candidates on HireFlow.
                    </p>

                  </div>

                  <div className="flex w-fit items-center gap-2 rounded-full bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary">

                    <Users size={18} />

                    <span>
                      {totalCandidates}{" "}
                      {totalCandidates === 1
                        ? "candidate"
                        : "candidates"}
                    </span>

                  </div>

                </div>

              </div>

              {/* ================================================= */}
              {/* KPI CARDS */}
              {/* ================================================= */}

              <div className="mb-7 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

                <KpiCard
                  title="Total Candidates"
                  value={totalCandidates}
                  description="All registered candidates"
                  icon={Users}
                  card="border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50"
                  iconBg="bg-blue-100 ring-blue-200"
                  iconColor="text-blue-600"
                  titleColor="text-blue-700"
                  valueColor="text-blue-950"
                  descriptionColor="text-blue-600"
                />

                <KpiCard
                  title="Active Candidates"
                  value={activeCandidates}
                  description="Currently active"
                  icon={UserCheck}
                  card="border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-green-50"
                  iconBg="bg-emerald-100 ring-emerald-200"
                  iconColor="text-emerald-600"
                  titleColor="text-emerald-700"
                  valueColor="text-emerald-950"
                  descriptionColor="text-emerald-600"
                />

                <KpiCard
                  title="Recent Registrations"
                  value={recentCandidates}
                  description="Registered in last 7 days"
                  icon={UserRound}
                  card="border-violet-200 bg-gradient-to-br from-violet-50 via-white to-purple-50"
                  iconBg="bg-violet-100 ring-violet-200"
                  iconColor="text-violet-600"
                  titleColor="text-violet-700"
                  valueColor="text-violet-950"
                  descriptionColor="text-violet-600"
                />

                <KpiCard
                  title="Suspended Candidates"
                  value={suspendedCandidates}
                  description="Access currently suspended"
                  icon={UserX}
                  card="border-rose-200 bg-gradient-to-br from-rose-50 via-white to-red-50"
                  iconBg="bg-rose-100 ring-rose-200"
                  iconColor="text-rose-600"
                  titleColor="text-rose-700"
                  valueColor="text-rose-950"
                  descriptionColor="text-rose-600"
                />

              </div>

              {/* ================================================= */}
              {/* TABLE + LATEST ACTIVITY */}
              {/* ================================================= */}

              <div className="grid grid-cols-[minmax(0,1fr)_270px] items-stretch gap-5">

                {/* ================================================= */}
                {/* CANDIDATE DIRECTORY */}
                {/* ================================================= */}

                <section className="min-w-0 overflow-hidden rounded-3xl border border-border bg-white shadow-sm">

                  {/* HEADER */}

                  <div className="border-b border-border p-6 sm:p-7">

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                      <div>

                        <h2 className="text-xl font-semibold text-text-primary">
                          Candidate Directory
                        </h2>

                        <p className="mt-1.5 text-sm text-text-secondary">
                          Manage and monitor all registered candidates.
                        </p>

                      </div>

                      <div className="text-sm text-text-secondary">

                        <span className="font-semibold text-text-primary">
                          {filteredCandidates.length}
                        </span>{" "}

                        {filteredCandidates.length ===
                        1
                          ? "candidate"
                          : "candidates"}

                      </div>

                    </div>

                    {/* FILTERS */}

                    <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_180px_180px_auto]">

                      <div className="relative">

                        <Search
                          size={18}
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                          type="text"
                          placeholder="Search candidate, email, phone or location..."
                          value={search}
                          onChange={(e) =>
                            setSearch(
                              e.target.value,
                            )
                          }
                          className="h-12 w-full rounded-xl border border-border bg-[#fafbfc] pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                        />

                      </div>

                      <select
                        value={statusFilter}
                        onChange={(e) =>
                          setStatusFilter(
                            e.target.value,
                          )
                        }
                        className="h-12 w-full rounded-xl border border-border bg-[#fafbfc] px-4 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
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
                          setSortOrder(
                            e.target.value,
                          )
                        }
                        className="h-12 w-full rounded-xl border border-border bg-[#fafbfc] px-4 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                      >

                        <option value="newest">
                          Newest First
                        </option>

                        <option value="oldest">
                          Oldest First
                        </option>

                      </select>

                      {hasFilters && (
                        <button
                          onClick={clearFilters}
                          className="h-12 rounded-xl border border-border px-5 text-sm font-medium text-text-secondary transition hover:bg-gray-50 hover:text-text-primary"
                        >

                          <span className="inline-flex items-center gap-2">

                            <X size={16} />

                            Clear

                          </span>

                        </button>
                      )}

                    </div>

                  </div>

                  {/* ================================================= */}
                  {/* TABLE */}
                  {/* ================================================= */}

                  {loading ? (

                    <div className="flex min-h-[430px] items-center justify-center">

                      <div className="flex flex-col items-center gap-4">

                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />

                        <p className="text-sm text-text-secondary">
                          Loading candidates...
                        </p>

                      </div>

                    </div>

                  ) : (

                    <>

                      {/* TABLE INNER SPACING */}

                      <div className="overflow-hidden px-5">

                        <table className="w-full table-fixed">

                          <thead>

                            <tr className="border-b border-border bg-[#fafbfc]">

                              {/* REDUCED FROM 27% TO 24% */}

                              <th className="w-[24%] px-4 py-5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                                Candidate
                              </th>

                              {/* 19% → 18% */}

                              <th className="w-[18%] px-3 py-5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                                Phone
                              </th>

                              {/* 17% → 16% */}

                              <th className="w-[16%] px-3 py-5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                                Location
                              </th>

                              {/* 15% → 14% */}

                              <th className="w-[14%] px-3 py-5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                                Registered
                              </th>

                              {/* 12% → 15% */}

                              <th className="w-[15%] px-3 py-5 text-center text-xs font-semibold uppercase tracking-wider text-text-secondary">
                                Status
                              </th>

                              {/* 10% → 13% */}

                              <th className="w-[13%] py-5 pl-3 pr-6 text-center text-xs font-semibold uppercase tracking-wider text-text-secondary">
                                Action
                              </th>

                            </tr>

                          </thead>

                          <tbody>

                            {paginatedCandidates.length > 0 ? (

                              paginatedCandidates.map(
                                (candidate) => {

                                  const isCandidateActive =
                                    candidate.is_active === true;

                                  return (

                                    <tr
                                      key={
                                        candidate.id
                                      }
                                      className="group border-b border-border last:border-0 transition-colors hover:bg-[#fafcff]"
                                    >

                                      {/* CANDIDATE */}

                                      <td className="px-4 py-6">

                                        <div className="flex min-w-0 items-center gap-3">

                                          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-primary/5">

                                            {candidate.profile_image ? (

                                              <img
                                                src={
                                                  candidate.profile_image
                                                }
                                                alt={`${candidate.first_name || ""} ${candidate.last_name || ""}`}
                                                className="h-full w-full object-cover"
                                              />

                                            ) : (

                                              <UserRound
                                                size={20}
                                                className="text-primary"
                                              />

                                            )}

                                          </div>

                                          <div className="min-w-0">

                                            <p className="truncate text-sm font-semibold text-text-primary">

                                              {
                                                candidate.first_name
                                              }{" "}

                                              {
                                                candidate.last_name
                                              }

                                            </p>

                                            {candidate.email && (

                                              <p className="mt-1 truncate text-xs text-text-secondary">
                                                {
                                                  candidate.email
                                                }
                                              </p>

                                            )}

                                          </div>

                                        </div>

                                      </td>

                                      {/* PHONE */}

                                      <td className="px-3 py-6">

                                        {candidate.phone_number ? (

                                          <span className="inline-flex max-w-full items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200">

                                            <Phone
                                              size={13}
                                              className="shrink-0 text-primary"
                                            />

                                            <span className="truncate">
                                              {
                                                candidate.phone_number
                                              }
                                            </span>

                                          </span>

                                        ) : (

                                          <span className="text-sm text-text-secondary">
                                            —
                                          </span>

                                        )}

                                      </td>

                                      {/* LOCATION */}

                                      <td className="px-3 py-6">

                                        <p className="truncate text-sm text-text-secondary">
                                          {
                                            candidate.location ||
                                            "—"
                                          }
                                        </p>

                                      </td>

                                      {/* REGISTERED */}

                                      <td className="px-3 py-6">

                                        <p className="text-sm font-semibold text-text-primary">

                                          {candidate.created_at
                                            ? new Date(
                                                candidate.created_at,
                                              ).toLocaleDateString(
                                                "en-GB",
                                              )
                                            : "—"}

                                        </p>

                                        {candidate.created_at && (

                                          <p className="mt-1 text-xs text-text-secondary">

                                            {new Date(
                                              candidate.created_at,
                                            ).toLocaleTimeString(
                                              [],
                                              {
                                                hour: "2-digit",
                                                minute:
                                                  "2-digit",
                                              },
                                            )}

                                          </p>

                                        )}

                                      </td>

                                      {/* STATUS */}

                                      <td className="px-3 py-6 text-center">

                                        {isCandidateActive ? (

                                          <span className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">

                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                                            Active

                                          </span>

                                        ) : (

                                          <span className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-red-50 px-3.5 py-1.5 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-200">

                                            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />

                                            Suspended

                                          </span>

                                        )}

                                      </td>

                                      {/* ACTION */}

                                      <td className="py-6 pl-3 pr-6 text-center">

                                        <button
                                          onClick={() =>
                                            navigate(
                                              `/admin/candidates/${candidate.id}`,
                                            )
                                          }
                                          className="inline-flex min-w-[76px] items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md active:scale-[0.98]"
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
                                  className="h-[430px] px-7 text-center"
                                >

                                  <div className="mx-auto flex max-w-sm flex-col items-center">

                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">

                                      <UserRound
                                        size={30}
                                        className="text-gray-400"
                                      />

                                    </div>

                                    <h3 className="mt-5 font-semibold text-text-primary">
                                      {search ||
                                      statusFilter
                                        ? "No matching candidates"
                                        : "No candidates available"}
                                    </h3>

                                    <p className="mt-2 text-sm text-text-secondary">
                                      {search ||
                                      statusFilter
                                        ? "Try changing your search or filters."
                                        : "There are currently no registered candidates."}
                                    </p>

                                  </div>

                                </td>

                              </tr>

                            )}

                          </tbody>

                        </table>

                      </div>

                      {/* ================================================= */}
                      {/* PAGINATION */}
                      {/* ================================================= */}

                      {filteredCandidates.length > 0 && (

                        <div className="flex flex-col gap-4 border-t border-border bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

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
                                filteredCandidates.length,
                              )}
                            </span>

                            {" of "}

                            <span className="font-semibold text-text-primary">
                              {
                                filteredCandidates.length
                              }
                            </span>{" "}

                            {filteredCandidates.length ===
                            1
                              ? "candidate"
                              : "candidates"}

                          </p>

                          <div className="flex items-center gap-2">

                            <button
                              onClick={
                                goToPreviousPage
                              }
                              disabled={
                                currentPage ===
                                1
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-gray-400 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <ChevronLeft
                                size={16}
                              />
                            </button>

                            <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-primary px-3 text-sm font-semibold text-white">
                              {currentPage}
                            </span>

                            <button
                              onClick={
                                goToNextPage
                              }
                              disabled={
                                currentPage >=
                                totalPages
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-gray-400 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <ChevronRight
                                size={16}
                              />
                            </button>

                          </div>

                        </div>

                      )}

                    </>

                  )}

                </section>

                {/* ================================================= */}
                {/* LATEST ACTIVITY */}
                {/* ================================================= */}

                <section className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-border bg-white shadow-sm">

                  <div className="flex shrink-0 items-center justify-between border-b border-border bg-gradient-to-r from-violet-50 via-white to-blue-50 px-4 py-4">

                    <div className="min-w-0">

                      <h2 className="text-base font-bold text-text-primary">
                        Latest Activity
                      </h2>

                      <p className="mt-1 text-xs text-text-secondary">
                        Recent registrations
                      </p>

                    </div>

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                      <Clock3 size={15} />
                    </div>

                  </div>

                  <div className="min-h-0 flex-1 overflow-hidden">

                    <table className="w-full table-fixed">

                      <thead>

                        <tr className="border-b border-border bg-gray-50">

                          <th className="w-[55%] px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-text-secondary">
                            Candidate
                          </th>

                          <th className="w-[45%] px-2 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-text-secondary">
                            Date
                          </th>

                        </tr>

                      </thead>

                      <tbody>

                        {latestActivities.length > 0 ? (

                          latestActivities.map(
                            (candidate) => {

                              const active =
                                candidate.is_active === true;

                              return (

                                <tr
                                  key={
                                    candidate.id
                                  }
                                  onClick={() =>
                                    navigate(
                                      `/admin/candidates/${candidate.id}`,
                                    )
                                  }
                                  className="cursor-pointer border-b border-border last:border-0 transition hover:bg-violet-50/40"
                                >

                                  <td className="px-3 py-4">

                                    <div className="flex min-w-0 items-center gap-2">

                                      <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-violet-50">

                                        {candidate.profile_image ? (

                                          <img
                                            src={
                                              candidate.profile_image
                                            }
                                            alt=""
                                            className="h-full w-full object-cover"
                                          />

                                        ) : (

                                          <UserRound
                                            size={14}
                                            className="text-violet-600"
                                          />

                                        )}

                                      </div>

                                      <div className="min-w-0">

                                        <p className="truncate text-xs font-semibold text-text-primary">

                                          {
                                            candidate.first_name
                                          }{" "}

                                          {
                                            candidate.last_name
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

                                      {candidate.created_at
                                        ? new Date(
                                            candidate.created_at,
                                          ).toLocaleDateString(
                                            "en-GB",
                                          )
                                        : "—"}

                                    </p>

                                    {candidate.created_at && (

                                      <p className="mt-1 text-[10px] text-text-secondary">

                                        {new Date(
                                          candidate.created_at,
                                        ).toLocaleTimeString(
                                          [],
                                          {
                                            hour: "2-digit",
                                            minute:
                                              "2-digit",
                                          },
                                        )}

                                      </p>

                                    )}

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
  card,
  iconBg,
  iconColor,
  titleColor,
  valueColor,
  descriptionColor,
}) {
  return (
    <div
      className={`group relative min-h-[145px] overflow-hidden rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${card}`}
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
            className={`mt-2 text-3xl font-bold tracking-tight ${valueColor}`}
          >
            {value}
          </p>

          <p
            className={`mt-2 text-xs font-medium ${descriptionColor}`}
          >
            {description}
          </p>

        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 ${iconBg}`}
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

export default Candidates;