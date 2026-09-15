import {
  BriefcaseBusiness,
  CheckCircle2,
  FileEdit,
  Clock3,
  CalendarX2,
  XCircle,
  ArrowUpRight,
  Loader2,
} from "lucide-react";

const statItems = [
  {
    key: "total",
    label: "Total Jobs",
    description: "All job postings",
    trend: "All jobs",
    icon: BriefcaseBusiness,
    card:
      "border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50",
    glow: "bg-blue-200/30",
    iconBg: "bg-blue-100 ring-blue-200",
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
    trend: "Published",
    icon: CheckCircle2,
    card:
      "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-green-50",
    glow: "bg-emerald-200/30",
    iconBg: "bg-emerald-100 ring-emerald-200",
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
    trend: "Draft",
    icon: FileEdit,
    card:
      "border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50",
    glow: "bg-amber-200/30",
    iconBg: "bg-amber-100 ring-amber-200",
    iconColor: "text-amber-600",
    valueColor: "text-amber-950",
    titleColor: "text-amber-700",
    descriptionColor: "text-amber-600",
    trendBg: "bg-amber-100",
    trendColor: "text-amber-700",
  },

  {
    key: "closingSoon",
    label: "Closing Soon",
    description: "Deadline within 7 days",
    trend: "Upcoming",
    icon: Clock3,
    card:
      "border-orange-200 bg-gradient-to-br from-orange-50 via-white to-yellow-50",
    glow: "bg-orange-200/30",
    iconBg: "bg-orange-100 ring-orange-200",
    iconColor: "text-orange-600",
    valueColor: "text-orange-950",
    titleColor: "text-orange-700",
    descriptionColor: "text-orange-600",
    trendBg: "bg-orange-100",
    trendColor: "text-orange-700",
  },

  {
    key: "expired",
    label: "Expired Jobs",
    description: "Deadline has passed",
    trend: "Expired",
    icon: CalendarX2,
    card:
      "border-rose-200 bg-gradient-to-br from-rose-50 via-white to-pink-50",
    glow: "bg-rose-200/30",
    iconBg: "bg-rose-100 ring-rose-200",
    iconColor: "text-rose-600",
    valueColor: "text-rose-950",
    titleColor: "text-rose-700",
    descriptionColor: "text-rose-600",
    trendBg: "bg-rose-100",
    trendColor: "text-rose-700",
  },

  {
    key: "closed",
    label: "Closed Jobs",
    description: "No longer active",
    trend: "Closed",
    icon: XCircle,
    card:
      "border-slate-200 bg-gradient-to-br from-slate-50 via-white to-gray-50",
    glow: "bg-slate-200/30",
    iconBg: "bg-slate-100 ring-slate-200",
    iconColor: "text-slate-600",
    valueColor: "text-slate-950",
    titleColor: "text-slate-700",
    descriptionColor: "text-slate-600",
    trendBg: "bg-slate-100",
    trendColor: "text-slate-700",
  },
];

function JobStatsCards({ jobs = [], loading }) {
  const now = new Date();

  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(
    sevenDaysFromNow.getDate() + 7
  );

  const total = jobs.length;

  const published = jobs.filter(
    (job) =>
      (job.status || "").toUpperCase() === "PUBLISHED"
  ).length;

  const draft = jobs.filter(
    (job) =>
      (job.status || "").toUpperCase() === "DRAFT"
  ).length;

  const closed = jobs.filter(
    (job) =>
      (job.status || "").toUpperCase() === "CLOSED"
  ).length;

  const closingSoon = jobs.filter((job) => {
    if (
      (job.status || "").toUpperCase() !== "PUBLISHED" ||
      !job.application_deadline
    ) {
      return false;
    }

    const deadline = new Date(
      job.application_deadline
    );

    return (
      !Number.isNaN(deadline.getTime()) &&
      deadline >= now &&
      deadline <= sevenDaysFromNow
    );
  }).length;

  const expired = jobs.filter((job) => {
    if (!job.application_deadline) {
      return false;
    }

    const deadline = new Date(
      job.application_deadline
    );

    return (
      !Number.isNaN(deadline.getTime()) &&
      deadline < now
    );
  }).length;

  const stats = {
    total,
    published,
    draft,
    closingSoon,
    expired,
    closed,
  };

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {statItems.map((item) => {
        const Icon = item.icon;
        const value = stats[item.key];

        return (
          <div
            key={item.key}
            className={`group relative min-h-[145px] overflow-hidden rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${item.card}`}
          >
            {/* Decorative glow */}
            <div
              className={`absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-125 ${item.glow}`}
            />

            {/* Decorative circle */}
            <div className="absolute -bottom-8 -right-6 h-20 w-20 rounded-full border border-white/60" />

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
                      className={`mt-2 text-2xl font-bold tracking-tight ${item.valueColor}`}
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

export default JobStatsCards;