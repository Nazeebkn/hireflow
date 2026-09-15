import { BriefcaseBusiness, Plus } from "lucide-react";


function DashboardEmptyState({ onCreateJob }) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-6 py-16 text-center">

      {/* Icon */}
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <BriefcaseBusiness
          size={26}
          strokeWidth={1.7}
        />
      </div>


      {/* Heading */}
      <h3 className="mt-5 text-lg font-semibold text-text">
        No jobs posted yet
      </h3>


      {/* Description */}
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">
        Create your first job posting and start finding the right
        candidates for your company.
      </p>


      {/* Action */}
      <button
        type="button"
        onClick={onCreateJob}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
      >
        <Plus
          size={18}
          strokeWidth={2}
        />

        Create Job
      </button>

    </div>
  );
}

export default DashboardEmptyState;