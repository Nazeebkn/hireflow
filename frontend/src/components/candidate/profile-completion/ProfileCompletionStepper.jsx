import {
  User,
  BriefcaseBusiness,
  FileText,
} from "lucide-react";

function ProfileCompletionStepper({
  currentStep,
}) {
  const steps = [
    {
      id: 1,
      title: "Personal",
      icon: User,
    },
    {
      id: 2,
      title: "Career",
      icon: BriefcaseBusiness,
    },
    {
      id: 3,
      title: "Resume",
      icon: FileText,
    },
  ];

  return (
    <div className="flex items-center justify-center">

      {steps.map((step, index) => {

        const Icon = step.icon;
        const active = currentStep >= step.id;

        return (
          <div
            key={step.id}
            className="flex items-center"
          >

            <div className="flex flex-col items-center">

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  active
                    ? "border-primary bg-primary text-white shadow-md"
                    : "border-border bg-white text-text-secondary"
                }`}
              >
                <Icon size={18} />
              </div>

              <span
                className={`mt-1 text-xs font-medium ${
                  active
                    ? "text-primary"
                    : "text-text-secondary"
                }`}
              >
                {step.title}
              </span>

            </div>

            {index !== steps.length - 1 && (
              <div
                className={`mx-4 h-1 w-16 rounded-full transition-all ${
                  currentStep > step.id
                    ? "bg-primary"
                    : "bg-border"
                }`}
              />
            )}

          </div>
        );
      })}

    </div>
  );
}

export default ProfileCompletionStepper;