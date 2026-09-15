import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  UserCheck,
} from "lucide-react";

function CandidateKpiCards({ candidate }) {
  const applications = Array.isArray(candidate?.applications)
    ? candidate.applications
    : [];

  const totalApplications =
    candidate?.application_count ??
    candidate?.total_applications ??
    applications.length;

  const selectedApplications =
    candidate?.selected_applications ??
    applications.filter(
      (application) =>
        String(application?.status || "").toUpperCase() ===
        "SELECTED"
    ).length;

  const interviewCount =
    candidate?.interview_count ??
    applications.filter((application) =>
      [
        "AI_INTERVIEW",
        "FINAL_INTERVIEW",
      ].includes(
        String(application?.status || "").toUpperCase()
      )
    ).length;

  const hiredCount =
    candidate?.hired_count ??
    applications.filter(
      (application) =>
        String(application?.status || "").toUpperCase() ===
        "HIRED"
    ).length;

  const cards = [
    {
      label: "Applications",
      value: totalApplications,
      description: "Total job applications",
      icon: BriefcaseBusiness,
      cardClass:
        "border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50",
      iconClass:
        "bg-blue-100 text-blue-600 ring-blue-200",
      valueClass: "text-blue-700",
    },
    {
      label: "Selected",
      value: selectedApplications,
      description: "Applications selected",
      icon: CheckCircle2,
      cardClass:
        "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-green-50",
      iconClass:
        "bg-emerald-100 text-emerald-600 ring-emerald-200",
      valueClass: "text-emerald-700",
    },
    {
      label: "Interviews",
      value: interviewCount,
      description: "Interview stages",
      icon: Clock3,
      cardClass:
        "border-violet-200 bg-gradient-to-br from-violet-50 via-white to-purple-50",
      iconClass:
        "bg-violet-100 text-violet-600 ring-violet-200",
      valueClass: "text-violet-700",
    },
    {
      label: "Hired",
      value: hiredCount,
      description: "Successfully hired",
      icon: UserCheck,
      cardClass:
        "border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50",
      iconClass:
        "bg-amber-100 text-amber-600 ring-amber-200",
      valueClass: "text-amber-700",
    },
  ];

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
              rounded-2xl
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
            <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-white/50 blur-2xl transition-transform duration-500 group-hover:scale-125" />

            <div className="relative grid grid-cols-[minmax(0,1fr)_44px] items-start gap-3">
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
                  {Number(card.value).toLocaleString("en-IN")}
                </p>

                <p className="mt-1.5 text-xs leading-5 text-text-secondary">
                  {card.description}
                </p>
              </div>

              <div
                className={`
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  ring-1
                  ${card.iconClass}
                `}
              >
                <Icon size={20} strokeWidth={1.8} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CandidateKpiCards;