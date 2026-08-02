import AuthInput from "../../auth/AuthInput";

function ResumePreferenceStep({
  formData,
  errors,
  onChange,
  onResumeChange,
}) {
  return (
    <div className="space-y-6">

      {/* Resume Upload */}
      <div className="rounded-2xl border border-border bg-background p-5">

        <h3 className="text-lg font-semibold text-text-primary">
          Resume
        </h3>

        <p className="mt-1 text-sm text-text-secondary">
          Upload your latest resume in PDF format (Maximum 5 MB).
        </p>

        <div className="mt-6">

          <label
            htmlFor="resume-upload"
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface px-6 py-10 transition hover:border-primary hover:bg-primary/5"
          >

            <div className="text-5xl">
              📄
            </div>

            <h4 className="mt-4 text-base font-semibold text-text-primary">
              Upload Resume
            </h4>

            <p className="mt-2 text-center text-sm text-text-secondary">
              Click to upload your resume in PDF format.
            </p>

          </label>

          <input
            id="resume-upload"
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => {
              onResumeChange(e.target.files?.[0]);
              e.target.value = "";
            }}
          />

        {formData.resume && (
          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">

            <div className="flex items-center justify-between">

              <div>

                <p className="font-medium text-green-700">
                  📄 {formData.resume.name}
                </p>

                <p className="text-xs text-green-600">
                  {(formData.resume.size / 1024 / 1024).toFixed(2)} MB
                </p>

              </div>

              <button
                type="button"
                onClick={() => onResumeChange(null)}
                className="text-sm font-medium text-red-600 hover:underline"
              >
              Remove
            </button>

          </div>

        </div>
      )}

      {errors.resume && (
        <p className="mt-3 text-sm text-red-500">
          {errors.resume}
        </p>
      )}

        </div>

      </div>

      {/* Employment Preferences */}
      <div className="rounded-2xl border border-border bg-background p-5">

        <h3 className="text-lg font-semibold text-text-primary">
          Employment Preferences
        </h3>

        <p className="mt-1 text-sm text-text-secondary">
          Tell us about the opportunities you are looking for.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">

          <div className="space-y-2">

            <label className="text-sm font-medium text-text-primary">
              Employment Type
            </label>

            <select
              name="employment_type"
              value={formData.employment_type}
              onChange={onChange}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none transition focus:border-primary"
            >
              <option value="">
                Select Employment Type
              </option>

              <option value="FULL_TIME">
                Full Time
              </option>

              <option value="PART_TIME">
                Part Time
              </option>

              <option value="INTERNSHIP">
                Internship
              </option>

              <option value="CONTRACT">
                Contract
              </option>

            </select>

          </div>

          <div className="space-y-2">

            <label className="text-sm font-medium text-text-primary">
              Preferred Work Mode
            </label>

            <select
              name="work_mode"
              value={formData.work_mode}
              onChange={onChange}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none transition focus:border-primary"
            >
              <option value="">
                Select Work Mode
              </option>

              <option value="ONSITE">
                On-site
              </option>

              <option value="HYBRID">
                Hybrid
              </option>

              <option value="REMOTE">
                Remote
              </option>

            </select>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ResumePreferenceStep;