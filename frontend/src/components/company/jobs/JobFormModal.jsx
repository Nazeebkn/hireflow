import { X, BriefcaseBusiness } from "lucide-react";

import JobForm from "./JobForm";

function JobFormModal({
  open,
  job = null,
  onClose,
  onSuccess,
}) {
  if (!open) {
    return null;
  }

  const isUpdateMode = Boolean(job);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 px-4 py-6 sm:items-center sm:py-8">

      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BriefcaseBusiness size={19} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-text">
                {isUpdateMode
                  ? "Edit Job"
                  : "Create Job"}
              </h2>

              <p className="mt-0.5 text-xs text-text-secondary">
                {isUpdateMode
                  ? "Update your job posting details."
                  : "Add a new job posting for candidates."}
              </p>
            </div>

          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-text-secondary transition-colors hover:bg-background hover:text-text"
          >
            <X size={19} />
          </button>

        </div>


        {/* Modal Body */}
        <div className="max-h-[78vh] overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">

          <JobForm
            job={job}
            onSuccess={onSuccess}
          />

        </div>

      </div>
    </div>
  );
}

export default JobFormModal;