import { Check, Loader2 } from "lucide-react";

function EducationModal({
  showEducationForm,
  editingEducationId,
  educationForm,
  educationSaving,
  educationFormErrors,
  handleEducationChange,
  handleSaveEducation,
  resetEducationForm,
  FormField,
}) {
  if (!showEducationForm) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-surface shadow-xl">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-text">
              {editingEducationId
                ? "Edit Education"
                : "Add Education"}
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Add your academic qualification details.
            </p>
          </div>

          <button
            type="button"
            onClick={resetEducationForm}
            disabled={educationSaving}
            className="rounded-lg p-2 text-text-secondary transition hover:bg-background hover:text-text disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div className="space-y-5 p-6">

          <FormField
            label="Education Level"
            name="education_level"
            value={educationForm.education_level}
            onChange={handleEducationChange}
            disabled={educationSaving}
            error={educationFormErrors.education_level}
            required
            select
            options={[
              ["SSLC", "SSLC"],
              ["HIGHER_SECONDARY", "Higher Secondary"],
              ["DIPLOMA", "Diploma"],
              ["BACHELORS", "Bachelor's Degree"],
              ["MASTERS", "Master's Degree"],
              ["DOCTORATE", "Doctorate"],
              ["CERTIFICATION", "Certification"],
            ]}
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <FormField
              label="Institution Name"
              name="institution_name"
              value={educationForm.institution_name}
              onChange={handleEducationChange}
              disabled={educationSaving}
              error={educationFormErrors.institution_name}
              required
              placeholder="e.g. ABC College"
            />

            <FormField
              label="Field of Study"
              name="field_of_study"
              value={educationForm.field_of_study}
              onChange={handleEducationChange}
              disabled={educationSaving}
              error={educationFormErrors.field_of_study}
              placeholder="e.g. Computer Science"
            />

            <FormField
              label="Start Date"
              name="start_date"
              type="date"
              value={educationForm.start_date}
              onChange={handleEducationChange}
              disabled={educationSaving}
              error={educationFormErrors.start_date}
            />

            <FormField
              label="End Date"
              name="end_date"
              type="date"
              value={educationForm.end_date}
              onChange={handleEducationChange}
              disabled={educationSaving}
              error={educationFormErrors.end_date}
            />

            <FormField
              label="Score"
              name="score"
              value={educationForm.score}
              onChange={handleEducationChange}
              disabled={educationSaving}
              error={educationFormErrors.score}
              placeholder="e.g. 85% or 8.5 CGPA"
            />

          </div>

          <FormField
            label="Description"
            name="description"
            value={educationForm.description}
            onChange={handleEducationChange}
            disabled={educationSaving}
            error={educationFormErrors.description}
            textarea
            rows={5}
            placeholder="Add any relevant details about this qualification..."
          />

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-border pt-5">

            <button
              type="button"
              onClick={resetEducationForm}
              disabled={educationSaving}
              className="rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveEducation}
              disabled={educationSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {educationSaving ? (
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

                  {editingEducationId
                    ? "Update Education"
                    : "Add Education"}
                </>
              )}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default EducationModal;