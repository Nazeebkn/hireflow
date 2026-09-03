import { useEffect, useState } from "react";

import {
  Clock3,
  Building2,
  CheckCircle2,
  Users,
  Briefcase,
  CreditCard,
  ArrowUpRight,
  Loader2,
} from "lucide-react";

import {
  getCompanies,
  getPendingCompanies,
  getCandidates,
} from "../../../services/admin/adminService";

function DashboardStats() {
  const [companies, setCompanies] = useState([]);
  const [pendingCompanies, setPendingCompanies] = useState([]);
  const [candidates, setCandidates] = useState([]);

  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      const [
        companiesData,
        pendingCompaniesData,
        candidatesData,
      ] = await Promise.all([
        getCompanies(),
        getPendingCompanies(),
        getCandidates(),
      ]);

      console.log("Dashboard Companies:", companiesData);
      console.log(
        "Dashboard Pending Companies:",
        pendingCompaniesData,
      );
      console.log(
        "Dashboard Candidates:",
        candidatesData,
      );

      setCompanies(
        Array.isArray(companiesData)
          ? companiesData
          : [],
      );

      setPendingCompanies(
        Array.isArray(pendingCompaniesData)
          ? pendingCompaniesData
          : [],
      );

      setCandidates(
        Array.isArray(candidatesData)
          ? candidatesData
          : [],
      );
    } catch (error) {
      console.error(
        "Failed to fetch dashboard statistics:",
        error,
      );

      setCompanies([]);
      setPendingCompanies([]);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // =====================================================
  // KPI VALUES
  // =====================================================

  const pendingCompanyCount = pendingCompanies.length;

  const approvedCompanyCount = companies.filter(
    (company) =>
      String(company.approval_status || "")
        .trim()
        .toUpperCase() === "APPROVED",
  ).length;

  const totalCompanyCount = companies.length;

  const candidateCount = candidates.length;

  // =====================================================
  // KPI DATA
  // =====================================================

  const stats = [
    {
      title: "Pending Companies",
      value: pendingCompanyCount,
      description: "Awaiting admin review",
      trend: "Review required",
      icon: Clock3,

      card:
        "border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50",

      glow:
        "bg-amber-200/30",

      iconBg:
        "bg-amber-100 ring-amber-200",

      iconColor:
        "text-amber-600",

      valueColor:
        "text-amber-950",

      titleColor:
        "text-amber-700",

      descriptionColor:
        "text-amber-600",

      trendBg:
        "bg-amber-100",

      trendColor:
        "text-amber-700",
    },

    {
      title: "Approved Companies",
      value: approvedCompanyCount,
      description: "Successfully approved",
      trend: "Approved",
      icon: CheckCircle2,

      card:
        "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-green-50",

      glow:
        "bg-emerald-200/30",

      iconBg:
        "bg-emerald-100 ring-emerald-200",

      iconColor:
        "text-emerald-600",

      valueColor:
        "text-emerald-950",

      titleColor:
        "text-emerald-700",

      descriptionColor:
        "text-emerald-600",

      trendBg:
        "bg-emerald-100",

      trendColor:
        "text-emerald-700",
    },

    {
      title: "Total Companies",
      value: totalCompanyCount,
      description: "Registered companies",
      trend: "All companies",
      icon: Building2,

      card:
        "border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50",

      glow:
        "bg-blue-200/30",

      iconBg:
        "bg-blue-100 ring-blue-200",

      iconColor:
        "text-blue-600",

      valueColor:
        "text-blue-950",

      titleColor:
        "text-blue-700",

      descriptionColor:
        "text-blue-600",

      trendBg:
        "bg-blue-100",

      trendColor:
        "text-blue-700",
    },

    {
      title: "Candidates",
      value: candidateCount,
      description: "Registered candidates",
      trend: "Registered users",
      icon: Users,

      card:
        "border-violet-200 bg-gradient-to-br from-violet-50 via-white to-purple-50",

      glow:
        "bg-violet-200/30",

      iconBg:
        "bg-violet-100 ring-violet-200",

      iconColor:
        "text-violet-600",

      valueColor:
        "text-violet-950",

      titleColor:
        "text-violet-700",

      descriptionColor:
        "text-violet-600",

      trendBg:
        "bg-violet-100",

      trendColor:
        "text-violet-700",
    },

    {
      title: "Active Jobs",
      value: "—",
      description: "Currently accepting applications",
      trend: "API required",
      icon: Briefcase,

      card:
        "border-cyan-200 bg-gradient-to-br from-cyan-50 via-white to-sky-50",

      glow:
        "bg-cyan-200/30",

      iconBg:
        "bg-cyan-100 ring-cyan-200",

      iconColor:
        "text-cyan-600",

      valueColor:
        "text-cyan-950",

      titleColor:
        "text-cyan-700",

      descriptionColor:
        "text-cyan-600",

      trendBg:
        "bg-cyan-100",

      trendColor:
        "text-cyan-700",
    },

    {
      title: "Revenue",
      value: "—",
      description: "Total platform revenue",
      trend: "API required",
      icon: CreditCard,

      card:
        "border-rose-200 bg-gradient-to-br from-rose-50 via-white to-pink-50",

      glow:
        "bg-rose-200/30",

      iconBg:
        "bg-rose-100 ring-rose-200",

      iconColor:
        "text-rose-600",

      valueColor:
        "text-rose-950",

      titleColor:
        "text-rose-700",

      descriptionColor:
        "text-rose-600",

      trendBg:
        "bg-rose-100",

      trendColor:
        "text-rose-700",
    },
  ];

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className={`relative min-h-[145px] overflow-hidden rounded-2xl border p-5 shadow-sm ${item.card}`}
            >
              <div className="relative flex h-full items-center justify-between">
                <div>
                  <p
                    className={`text-sm font-semibold ${item.titleColor}`}
                  >
                    {item.title}
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <Loader2
                      size={18}
                      className={`animate-spin ${item.iconColor}`}
                    />

                    <span
                      className={`text-sm font-medium ${item.descriptionColor}`}
                    >
                      Loading...
                    </span>
                  </div>
                </div>

                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ${item.iconBg}`}
                >
                  <Icon
                    size={20}
                    className={item.iconColor}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </section>
    );
  }

  // =====================================================
  // MAIN
  // =====================================================

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className={`group relative min-h-[145px] overflow-hidden rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${item.card}`}
          >
            {/* Decorative Glow */}

            <div
              className={`absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-125 ${item.glow}`}
            />

            {/* Decorative Circle */}

            <div className="absolute -bottom-8 -right-6 h-20 w-20 rounded-full border border-white/60" />

            {/* Card Content */}

            <div className="relative flex h-full flex-col justify-between">
              {/* Top */}

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p
                    className={`text-sm font-semibold ${item.titleColor}`}
                  >
                    {item.title}
                  </p>

                  <h2
                    className={`mt-2 truncate text-2xl font-bold tracking-tight ${item.valueColor}`}
                  >
                    {item.value}
                  </h2>
                </div>

                {/* Icon */}

                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ${item.iconBg}`}
                >
                  <Icon
                    size={20}
                    className={item.iconColor}
                  />
                </div>
              </div>

              {/* Bottom */}

              <div className="mt-5 flex items-center justify-between gap-2">
                <p
                  className={`truncate text-xs font-medium ${item.descriptionColor}`}
                >
                  {item.description}
                </p>

                <span
                  className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${item.trendBg} ${item.trendColor}`}
                >
                  <ArrowUpRight size={11} />

                  {item.trend}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default DashboardStats;