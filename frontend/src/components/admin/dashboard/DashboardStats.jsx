import {
  Clock3,
  Building2,
  CheckCircle2,
  Users,
  Briefcase,
  CreditCard,
} from "lucide-react";

const stats = [
  {
    title: "Pending Companies",
    value: "12",
    icon: Clock3,
    accent: "border-l-amber-500",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    title: "Approved Companies",
    value: "48",
    icon: CheckCircle2,
    accent: "border-l-emerald-500",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    title: "Total Companies",
    value: "60",
    icon: Building2,
    accent: "border-l-blue-500",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "Candidates",
    value: "520",
    icon: Users,
    accent: "border-l-violet-500",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  {
    title: "Active Jobs",
    value: "36",
    icon: Briefcase,
    accent: "border-l-cyan-500",
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
  {
    title: "Revenue",
    value: "₹18,500",
    icon: CreditCard,
    accent: "border-l-rose-500",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
  },
];

function DashboardStats() {
  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className={`rounded-2xl border border-border border-l-4 ${item.accent} bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">
                  {item.title}
                </p>

                <h2 className="mt-3 text-3xl font-bold text-text-primary">
                  {item.value}
                </h2>
              </div>

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.iconBg}`}
              >
                <Icon size={26} className={item.iconColor} />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default DashboardStats;
