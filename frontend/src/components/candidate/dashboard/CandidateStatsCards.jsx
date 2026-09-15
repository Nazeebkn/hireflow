import {
  BriefcaseBusiness,
  ClipboardList,
  Video,
  BadgeCheck,
} from "lucide-react";

function CandidateStatsCards({
  applicationCount = 0,
  activeProcessCount = 0,
  interviewCount = 0,
  offerCount = 0,
  loading = false,
}) {
  const stats = [
    {
      label: "Total Applications",
      value: applicationCount,
      icon: BriefcaseBusiness,
      description: "Jobs you have applied for",
      iconWrapper: "bg-primary/10 text-primary",
    },
    {
      label: "Active Processes",
      value: activeProcessCount,
      icon: ClipboardList,
      description: "Applications currently in process",
      iconWrapper: "bg-blue-50 text-blue-600",
    },
    {
      label: "Attended Interviews",
      value: interviewCount,
      icon: Video,
      description: "Interviews reached by your applications",
      iconWrapper: "bg-violet-50 text-violet-600",
    },
    {
      label: "Offers",
      value: offerCount,
      icon: BadgeCheck,
      description: "Job offers received",
      iconWrapper: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-surface p-5 transition hover:border-primary/20 hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.iconWrapper}`}
              >
                <Icon size={21} strokeWidth={2} />
              </div>

              {!loading && (
                <span className="rounded-full bg-background px-2.5 py-1 text-xs font-medium text-text-secondary">
                  Live
                </span>
              )}
            </div>

            <div className="mt-5">
              <p className="text-sm font-medium text-text-secondary">
                {stat.label}
              </p>

              {loading ? (
                <div className="mt-2 h-9 w-16 animate-pulse rounded-lg bg-background" />
              ) : (
                <p className="mt-1 text-3xl font-bold tracking-tight text-text">
                  {stat.value}
                </p>
              )}

              <p className="mt-1.5 text-xs leading-5 text-text-secondary">
                {stat.description}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default CandidateStatsCards;