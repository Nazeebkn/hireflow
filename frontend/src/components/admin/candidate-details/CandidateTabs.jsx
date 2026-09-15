import {
  BriefcaseBusiness,
  Clock3,
  UserRound,
} from "lucide-react";

function CandidateTabs({
  activeTab,
  onChange,
}) {
  const tabs = [
    {
      key: "overview",
      label: "Overview",
      icon: UserRound,
    },
    {
      key: "applications",
      label: "Applications",
      icon: BriefcaseBusiness,
    },
    {
      key: "timeline",
      label: "Hiring Timeline",
      icon: Clock3,
    },
  ];

  return (
    <div className="overflow-x-auto border-b border-border">
      <div className="flex min-w-max items-center gap-6 px-1 sm:gap-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`
                relative
                flex
                items-center
                gap-2
                pb-3.5
                pt-1
                text-sm
                font-medium
                transition
                ${
                  isActive
                    ? "font-bold text-primary"
                    : "text-text-secondary hover:text-primary"
                }
              `}
            >
              <Icon size={16} />
              <span>{tab.label}</span>

              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CandidateTabs;