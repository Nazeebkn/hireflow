import { Users } from "lucide-react";

function ApplicationCandidateKpis({
  totalCandidates = 0,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="rounded-xl border border-border bg-surface p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-text-secondary">
              Total Candidates
            </p>

            <p className="mt-1 text-2xl font-bold text-text">
              {totalCandidates}
            </p>
          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users
              size={19}
              strokeWidth={1.8}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicationCandidateKpis;