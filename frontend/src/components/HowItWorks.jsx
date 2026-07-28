import {
  BriefcaseBusiness,
  FileSearch,
  BrainCircuit,
  Users,
  BadgeCheck,
} from "lucide-react";

function HowItWorks() {
  const steps = [
    {
      icon: <BriefcaseBusiness size={28} />,
      title: "Create Job",
      description:
        "Create a job posting by adding the role, required skills, and experience.",
    },
    {
      icon: <FileSearch size={28} />,
      title: "AI Resume Screening",
      description:
        "HireFlow automatically analyzes resumes and shortlists the best candidates.",
    },
    {
      icon: <BrainCircuit size={28} />,
      title: "AI Interview",
      description:
        "Candidates complete an AI-powered interview with instant evaluation.",
    },
    {
      icon: <Users size={28} />,
      title: "HR Interview",
      description:
        "Qualified candidates move to the final HR interview conducted by the company.",
    },
    {
      icon: <BadgeCheck size={28} />,
      title: "Hire Candidate",
      description:
        "Select the best candidate and send the offer directly through HireFlow.",
    },
  ];

  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-accent">
            HOW IT WORKS
          </span>

          <h2 className="mt-5 text-4xl font-bold text-text">
            Hire Smarter in 5 Simple Steps
          </h2>

          <p className="mt-5 text-lg leading-8 text-text-secondary">
            From creating a job to hiring the right candidate, HireFlow
            automates every stage of your recruitment process.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative rounded-2xl border border-border bg-surface p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-accent">
                {step.icon}
              </div>

              <h3 className="mb-3 text-lg font-semibold text-text">
                {step.title}
              </h3>

              <p className="text-sm leading-6 text-text-secondary">
                {step.description}
              </p>

              <div className="absolute -top-3 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;