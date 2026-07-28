import {
  BrainCircuit,
  FileSearch,
  Video,
  ChartNoAxesCombined,
} from "lucide-react";

function WhyHireFlow() {
  const features = [
    {
      icon: <FileSearch size={32} />,
      title: "AI Resume Screening",
      description:
        "Automatically analyze resumes and shortlist the most qualified candidates within seconds.",
    },
    {
      icon: <Video size={32} />,
      title: "AI Interview",
      description:
        "Conduct intelligent AI-powered screening interviews with real-time candidate evaluation.",
    },
    {
      icon: <ChartNoAxesCombined size={32} />,
      title: "Smart ATS",
      description:
        "Track every candidate through an organized hiring pipeline from application to offer.",
    },
    {
      icon: <BrainCircuit size={32} />,
      title: "AI Hiring Insights",
      description:
        "Receive AI-generated insights and recommendations to make better hiring decisions.",
    },
  ];

  return (
    <section
      id="features"
      className="bg-surface py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-accent">
            WHY HIREFLOW
          </span>

          <h2 className="mt-5 text-4xl font-bold text-text">
            Everything You Need to Hire Smarter
          </h2>

          <p className="mt-5 text-lg leading-8 text-text-secondary">
            HireFlow combines Artificial Intelligence and an Applicant Tracking
            System into one powerful recruitment platform that helps companies
            hire faster, reduce manual work, and improve hiring quality.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-2xl border border-border bg-background p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-accent">
                {feature.icon}
              </div>

              <h3 className="mb-3 text-xl font-semibold text-text">
                {feature.title}
              </h3>

              <p className="leading-7 text-text-secondary">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default WhyHireFlow;