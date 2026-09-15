import {
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  ShieldAlert,
} from "lucide-react";


function CompanyJobKpiCards({ jobs = [] }) {
  /* =====================================================
     DYNAMIC COUNTS
  ===================================================== */

  const totalJobs = jobs.length;

  const publishedJobs = jobs.filter(
    (job) =>
      String(job.status || "").toUpperCase() ===
      "PUBLISHED"
  ).length;

  const draftJobs = jobs.filter(
    (job) =>
      String(job.status || "").toUpperCase() ===
      "DRAFT"
  ).length;

  const closedJobs = jobs.filter(
    (job) =>
      String(job.status || "").toUpperCase() ===
      "CLOSED"
  ).length;


  /* =====================================================
     KPI CARD DATA
  ===================================================== */

  const cards = [
    {
      label: "Total Jobs",
      value: totalJobs,
      description: "All job postings",
      icon: BriefcaseBusiness,

      cardClass:
        "border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50",

      iconClass:
        "bg-blue-100 text-blue-600 ring-blue-200",

      valueClass:
        "text-blue-700",
    },

    {
      label: "Published",
      value: publishedJobs,
      description: "Currently active",
      icon: CheckCircle2,

      cardClass:
        "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-green-50",

      iconClass:
        "bg-emerald-100 text-emerald-600 ring-emerald-200",

      valueClass:
        "text-emerald-700",
    },

    {
      label: "Draft",
      value: draftJobs,
      description: "Not published yet",
      icon: FileText,

      cardClass:
        "border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50",

      iconClass:
        "bg-amber-100 text-amber-600 ring-amber-200",

      valueClass:
        "text-amber-700",
    },

    {
      label: "Closed",
      value: closedJobs,
      description: "No longer active",
      icon: ShieldAlert,

      cardClass:
        "border-rose-200 bg-gradient-to-br from-rose-50 via-white to-pink-50",

      iconClass:
        "bg-rose-100 text-rose-600 ring-rose-200",

      valueClass:
        "text-rose-700",
    },
  ];


  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className={`
              group
              relative
              overflow-hidden
              rounded-xl
              border
              p-5
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:shadow-md
              ${card.cardClass}
            `}
          >

            {/* Decorative background */}

            <div
              className="
                pointer-events-none
                absolute
                -right-8
                -top-8
                h-20
                w-20
                rounded-full
                bg-white/50
                blur-2xl
                transition-transform
                duration-500
                group-hover:scale-125
              "
            />


            {/* Card content */}

            <div className="relative grid grid-cols-[minmax(0,1fr)_40px] items-start gap-3">

              {/* Text */}

              <div className="min-w-0">

                <p className="text-sm font-medium leading-5 text-text-secondary">
                  {card.label}
                </p>

                <p
                  className={`
                    mt-2
                    text-2xl
                    font-bold
                    leading-7
                    tabular-nums
                    ${card.valueClass}
                  `}
                >
                  {card.value.toLocaleString("en-IN")}
                </p>

                <p className="mt-1.5 text-xs leading-5 text-text-secondary">
                  {card.description}
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
                  rounded-xl
                  ring-1
                  ${card.iconClass}
                `}
              >
                <Icon
                  size={19}
                  strokeWidth={1.8}
                />
              </div>

            </div>

          </div>
        );
      })}

    </div>
  );
}


export default CompanyJobKpiCards;