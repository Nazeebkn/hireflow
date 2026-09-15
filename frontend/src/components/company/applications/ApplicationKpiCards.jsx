import {
  Users,
  Send,
  UserCheck,
  Video,
  BadgeCheck,
} from "lucide-react";

const statItems = [
  {
    key: "total",
    label: "Total Applications",
    valueKey: "totalApplications",
    icon: Users,
    card:
      "border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50",
    glow: "bg-blue-200/30",
    iconBg: "bg-blue-100 ring-blue-200",
    iconColor: "text-blue-600",
    valueColor: "text-blue-950",
    titleColor: "text-blue-700",
  },

  {
    key: "applied",
    label: "Applied",
    valueKey: "applied",
    icon: Send,
    card:
      "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-green-50",
    glow: "bg-emerald-200/30",
    iconBg: "bg-emerald-100 ring-emerald-200",
    iconColor: "text-emerald-600",
    valueColor: "text-emerald-950",
    titleColor: "text-emerald-700",
  },

  {
    key: "shortlisted",
    label: "Shortlisted",
    valueKey: "shortlisted",
    icon: UserCheck,
    card:
      "border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50",
    glow: "bg-amber-200/30",
    iconBg: "bg-amber-100 ring-amber-200",
    iconColor: "text-amber-600",
    valueColor: "text-amber-950",
    titleColor: "text-amber-700",
  },

  {
    key: "finalInterview",
    label: "Final Interview",
    valueKey: "finalInterview",
    icon: Video,
    card:
      "border-orange-200 bg-gradient-to-br from-orange-50 via-white to-yellow-50",
    glow: "bg-orange-200/30",
    iconBg: "bg-orange-100 ring-orange-200",
    iconColor: "text-orange-600",
    valueColor: "text-orange-950",
    titleColor: "text-orange-700",
  },

  {
    key: "hired",
    label: "Hired",
    valueKey: "hired",
    icon: BadgeCheck,
    card:
      "border-rose-200 bg-gradient-to-br from-rose-50 via-white to-pink-50",
    glow: "bg-rose-200/30",
    iconBg: "bg-rose-100 ring-rose-200",
    iconColor: "text-rose-600",
    valueColor: "text-rose-950",
    titleColor: "text-rose-700",
  },
];

function ApplicationKpiCards({
  totalApplications = 0,
  applied = 0,
  shortlisted = 0,
  finalInterview = 0,
  hired = 0,
}) {
  const stats = {
    totalApplications,
    applied,
    shortlisted,
    finalInterview,
    hired,
  };

  return (
    <section className="grid grid-cols-2 gap-3 xl:grid-cols-5">
      {statItems.map((item) => {
        const Icon = item.icon;
        const value = stats[item.valueKey];

        return (
          <div
            key={item.key}
            className={`
              group
              relative
              min-h-[125px]
              min-w-0
              overflow-hidden
              rounded-2xl
              border
              p-4
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-lg
              ${item.card}
            `}
          >
            {/* Decorative Glow */}
            <div
              className={`
                pointer-events-none
                absolute
                -right-8
                -top-8
                h-24
                w-24
                rounded-full
                blur-2xl
                transition-transform
                duration-500
                group-hover:scale-125
                ${item.glow}
              `}
            />

            {/* Decorative Circle */}
            <div
              className="
                pointer-events-none
                absolute
                -bottom-8
                -right-6
                h-20
                w-20
                rounded-full
                border
                border-white/60
              "
            />

            {/* Main Card Content */}
            <div className="relative grid min-w-0 grid-cols-[minmax(0,1fr)_40px] gap-3">

              {/* Text */}
              <div className="min-w-0">
                <p
                  className={`
                    min-h-[40px]
                    break-words
                    text-sm
                    font-semibold
                    leading-5
                    ${item.titleColor}
                  `}
                >
                  {item.label}
                </p>

                <p
                  className={`
                    mt-2
                    text-2xl
                    font-bold
                    leading-7
                    ${item.valueColor}
                  `}
                >
                  {value}
                </p>
              </div>

              {/* Icon */}
              <div
                className={`
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  self-start
                  rounded-xl
                  ring-1
                  ${item.iconBg}
                `}
              >
                <Icon
                  size={19}
                  strokeWidth={1.8}
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

export default ApplicationKpiCards;