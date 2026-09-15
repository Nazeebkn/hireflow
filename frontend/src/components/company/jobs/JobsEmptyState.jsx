function JobsEmptyState({ onCreateJob }) {

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-6 py-14 text-center">

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-8 w-8 text-slate-300"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 7.5h16.5M3.75 7.5a1.5 1.5 0 011.5-1.5h4.5l1.5 1.5h7.5a1.5 1.5 0 011.5 1.5v9a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-9z"
        />
      </svg>

      <h3 className="mt-4 text-base font-semibold text-slate-900">
        No jobs yet
      </h3>

      <p className="mt-1 max-w-sm text-sm text-slate-500">
        Create your first job posting to start receiving applications from candidates.
      </p>

      <button
        type="button"
        onClick={onCreateJob}
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
      >
        Create Job
      </button>

    </div>
  );
}

export default JobsEmptyState;