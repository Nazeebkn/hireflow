import CandidateJobCard from "./CandidateJobCard";

function CandidateJobList({
  jobs,
  selectedJob,
  onSelectJob,
}) {
  if (jobs.length === 0) {
    return (
      <div className="flex min-h-[240px] items-center justify-center rounded-xl border border-border bg-surface p-5 text-center sm:min-h-[300px] sm:p-8">
        <div className="max-w-sm">
          <h3 className="text-sm font-bold text-text sm:text-base">
            No jobs found
          </h3>

          <p className="mt-2 text-xs leading-5 text-text-secondary sm:text-sm">
            Try changing your search or filter options.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {jobs.map((job) => (
        <CandidateJobCard
          key={job.id}
          job={job}
          selected={selectedJob?.id === job.id}
          onSelect={onSelectJob}
        />
      ))}
    </div>
  );
}

export default CandidateJobList;