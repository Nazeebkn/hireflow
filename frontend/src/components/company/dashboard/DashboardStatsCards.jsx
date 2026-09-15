import {
  BriefcaseBusiness,
  CheckCircle2,
  FileEdit,
  CircleAlert,
  ArrowUpRight,
  Loader2,
} from "lucide-react";

const statItems = [
  {
    key: "total",
    label: "Total Jobs",
    description: "All job postings",
    valueKey: "total_jobs",
    trend: "All jobs",
    icon: BriefcaseBusiness,

    card:
      "border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50",

    glow: "bg-blue-200/30",

    iconBg:
      "bg-blue-100 ring-blue-200",

    iconColor: "text-blue-600",

    valueColor: "text-blue-950",

    titleColor: "text-blue-700",

    descriptionColor: "text-blue-600",

    trendBg: "bg-blue-100",

    trendColor: "text-blue-700",
  },

  {
    key: "published",
    label: "Published Jobs",
    description: "Currently active",
    valueKey: "published_jobs",
    trend: "Active",
    icon: CheckCircle2,

    card:
      "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-green-50",

    glow: "bg-emerald-200/30",

    iconBg:
      "bg-emerald-100 ring-emerald-200",

    iconColor: "text-emerald-600",

    valueColor: "text-emerald-950",

    titleColor: "text-emerald-700",

    descriptionColor: "text-emerald-600",

    trendBg: "bg-emerald-100",

    trendColor: "text-emerald-700",
  },

  {
    key: "draft",
    label: "Draft Jobs",
    description: "Not published",
    valueKey: "draft_jobs",
    trend: "Draft",
    icon: FileEdit,

    card:
      "border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50",

    glow: "bg-amber-200/30",

    iconBg:
      "bg-amber-100 ring-amber-200",

    iconColor: "text-amber-600",

    valueColor: "text-amber-950",

    titleColor: "text-amber-700",

    descriptionColor: "text-amber-600",

    trendBg: "bg-amber-100",

    trendColor: "text-amber-700",
  },

  {
    key: "closed",
    label: "Closed Jobs",
    description: "No longer active",
    valueKey: "closed_jobs",
    trend: "Closed",
    icon: CircleAlert,

    card:
      "border-rose-200 bg-gradient-to-br from-rose-50 via-white to-pink-50",

    glow: "bg-rose-200/30",

    iconBg:
      "bg-rose-100 ring-rose-200",

    iconColor: "text-rose-600",

    valueColor: "text-rose-950",

    titleColor: "text-rose-700",

    descriptionColor: "text-rose-600",

    trendBg: "bg-rose-100",

    trendColor: "text-rose-700",
  },
];

function DashboardStatsCards({ stats, loading }) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

      {statItems.map((item) => {
        const Icon = item.icon;

        // Get the dynamic value from backend dashboard stats.
        const value = stats?.[item.valueKey] ?? 0;

        return (
          <div
            key={item.key}
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
                    {item.label}
                  </p>

                  {loading ? (
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
                  ) : (
                    <h2
                      className={`mt-2 truncate text-2xl font-bold tracking-tight ${item.valueColor}`}
                    >
                      {value}
                    </h2>
                  )}

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

export default DashboardStatsCards;