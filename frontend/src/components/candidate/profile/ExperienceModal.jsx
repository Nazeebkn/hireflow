import { Check, Loader2 } from "lucide-react";

function ExperienceModal({
  showExperienceForm,
  editingExperienceId,
  experienceForm,
  experienceSaving,
  experienceFormErrors,
  handleExperienceChange,
  handleSaveExperience,
  resetExperienceForm,
  FormField,
}) {
  if (!showExperienceForm) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-surface shadow-xl">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-text">
              {editingExperienceId
                ? "Edit Experience"
                : "Add Experience"}
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Add your professional work experience.
            </p>
          </div>

          <button
            type="button"
            onClick={resetExperienceForm}
            disabled={experienceSaving}
            className="rounded-lg p-2 text-text-secondary transition hover:bg-background hover:text-text disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div className="space-y-5 p-6">

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <FormField
              label="Company Name"
              name="company_name"
              value={experienceForm.company_name}
              onChange={handleExperienceChange}
              disabled={experienceSaving}
              error={experienceFormErrors.company_name}
              required
              placeholder="e.g. Google"
            />

            <FormField
              label="Job Title"
              name="job_title"
              value={experienceForm.job_title}
              onChange={handleExperienceChange}
              disabled={experienceSaving}
              error={experienceFormErrors.job_title}
              required
              placeholder="e.g. Software Developer"
            />

            <FormField
              label="Employment Type"
              name="employment_type"
              value={experienceForm.employment_type}
              onChange={handleExperienceChange}
              disabled={experienceSaving}
              error={experienceFormErrors.employment_type}
              placeholder="e.g. Full Time"
            />

            <FormField
              label="Location"
              name="location"
              value={experienceForm.location}
              onChange={handleExperienceChange}
              disabled={experienceSaving}
              error={experienceFormErrors.location}
              placeholder="e.g. Bangalore"
            />

            <FormField
              label="Start Date"
              name="start_date"
              type="date"
              value={experienceForm.start_date}
              onChange={handleExperienceChange}
              disabled={experienceSaving}
              error={experienceFormErrors.start_date}
              required
            />

            <FormField
              label="End Date"
              name="end_date"
              type="date"
              value={experienceForm.end_date}
              onChange={handleExperienceChange}
              disabled={
                experienceSaving ||
                experienceForm.currently_working
              }
              error={experienceFormErrors.end_date}
            />

          </div>

          {/* Currently Working */}
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background p-4">
            <input
              type="checkbox"
              name="currently_working"
              checked={experienceForm.currently_working}
              onChange={handleExperienceChange}
              disabled={experienceSaving}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />

            <span>
              <span className="block text-sm font-medium text-text">
                I currently work here
              </span>

              <span className="mt-0.5 block text-xs text-text-secondary">
                End date will not be required.
              </span>
            </span>
          </label>

          {/* Description */}
          <FormField
            label="Description"
            name="description"
            value={experienceForm.description}
            onChange={handleExperienceChange}
            disabled={experienceSaving}
            error={experienceFormErrors.description}
            textarea
            rows={5}
            placeholder="Describe your responsibilities and achievements..."
          />

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-border pt-5">

            <button
              type="button"
              onClick={resetExperienceForm}
              disabled={experienceSaving}
              className="rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveExperience}
              disabled={experienceSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {experienceSaving ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={17} />

                  {editingExperienceId
                    ? "Update Experience"
                    : "Add Experience"}
                </>
              )}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default ExperienceModal;