import { useNavigate } from "react-router-dom";
import { Plus, ArrowRight } from "lucide-react";


function QuickActions({ onCreateJob }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap items-center gap-3">

      <button
        type="button"
        onClick={onCreateJob}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
      >
        <Plus size={18} strokeWidth={2} />
        Create Job
      </button>


      <button
        type="button"
        onClick={() => navigate("/company/jobs")}
        className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 text-sm font-medium text-text transition-colors hover:bg-background"
      >
        View All Jobs
        <ArrowRight size={17} strokeWidth={1.8} />
      </button>

    </div>
  );
}

export default QuickActions;