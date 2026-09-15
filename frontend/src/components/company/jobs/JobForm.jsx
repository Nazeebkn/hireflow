import { useState } from "react";
import {
  BriefcaseBusiness,
  MapPin,
  Banknote,
  CalendarDays,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";

import {
  createJob,
  updateJob,
} from "../../../services/company/jobService";

import { validateJobForm } from "../../../utils/jobValidation";

function JobForm({ job = null, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: job?.title || "",
    description: job?.description || "",
    location: job?.location || "",
    work_mode: job?.work_mode || "",
    employment_type: job?.employment_type || "",
    skills: job?.skills || "",
    experience_required: job?.experience_required || "",
    education: job?.education || "",
    position: job?.position || "",
    minimum_salary: job?.minimum_salary || "",
    maximum_salary: job?.maximum_salary || "",
    application_deadline: job?.application_deadline || "",
  });

  const [errors, setErrors] = useState({});

  const isUpdateMode = Boolean(job);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }
  };

  // ==========================================
  // HANDLE SUBMIT
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Run complete job form validation
    const validationErrors = validateJobForm(formData);

    // Stop submission if validation errors exist
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Clear previous errors
    setErrors({});

    setLoading(true);

    try {
      const payload = {
        title: formData.title.trim(),

        description: formData.description.trim(),

        location: formData.location.trim(),

        work_mode: formData.work_mode,

        employment_type: formData.employment_type,

        skills: formData.skills.trim(),

        experience_required:
          formData.experience_required.trim(),

        education: formData.education.trim(),

        position: formData.position.trim(),

        minimum_salary: formData.minimum_salary
          ? Number(formData.minimum_salary)
          : null,

        maximum_salary: formData.maximum_salary
          ? Number(formData.maximum_salary)
          : null,

        application_deadline:
          formData.application_deadline || null,
      };

      // ========================================
      // UPDATE EXISTING JOB
      // ========================================

      if (isUpdateMode) {
        await updateJob(job.id, payload);

        toast.success("Job updated successfully.");
      }

      // ========================================
      // CREATE NEW JOB
      // ========================================

      else {
        await createJob(payload);

        toast.success("Job created successfully.");
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      const data = error.response?.data;

      const message =
        data?.message ||
        data?.detail ||
        data?.title?.[0] ||
        data?.description?.[0] ||
        data?.location?.[0] ||
        data?.work_mode?.[0] ||
        data?.employment_type?.[0] ||
        data?.skills?.[0] ||
        data?.experience_required?.[0] ||
        data?.education?.[0] ||
        data?.position?.[0] ||
        data?.minimum_salary?.[0] ||
        data?.maximum_salary?.[0] ||
        data?.application_deadline?.[0] ||
        "Something went wrong.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INPUT STYLES
  // ==========================================

  const inputClass = (hasError = false) =>
    `w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm text-text placeholder:text-text-secondary/60 transition-all focus:outline-none focus:ring-2 ${
      hasError
        ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10"
        : "border-border focus:border-primary focus:ring-primary/10"
    }`;

  const labelClass =
    "mb-1.5 block text-sm font-medium text-text";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* =========================
          BASIC INFORMATION
      ========================= */}

      <section>
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BriefcaseBusiness size={16} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text">
              Basic Information
            </h3>

            <p className="text-xs text-text-secondary">
              Add the main details of the job.
            </p>
          </div>
        </div>

        <div className="space-y-4">

          {/* Job Title */}
          <div>
            <label className={labelClass}>
              Job Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Senior Frontend Engineer"
              className={inputClass(errors.title)}
            />

            {errors.title && (
              <p className="mt-1.5 text-xs text-rose-600">
                {errors.title}
              </p>
            )}
          </div>

          {/* Position */}
          <div>
            <label className={labelClass}>
              Position
            </label>

            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="e.g. Frontend Developer"
              className={inputClass(errors.position)}
            />

            {errors.position && (
              <p className="mt-1.5 text-xs text-rose-600">
                {errors.position}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Describe the role, responsibilities, and requirements"
              className={`${inputClass(
                errors.description
              )} resize-none`}
            />

            {errors.description && (
              <p className="mt-1.5 text-xs text-rose-600">
                {errors.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* =========================
          JOB DETAILS
      ========================= */}

      <section className="border-t border-border pt-6">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <MapPin size={16} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text">
              Job Details
            </h3>

            <p className="text-xs text-text-secondary">
              Specify the location and employment details.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* Location */}
          <div>
            <label className={labelClass}>
              Location
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Bengaluru, India"
              className={inputClass(errors.location)}
            />

            {errors.location && (
              <p className="mt-1.5 text-xs text-rose-600">
                {errors.location}
              </p>
            )}
          </div>

          {/* Work Mode */}
          <div>
            <label className={labelClass}>
              Work Mode
            </label>

            <select
              name="work_mode"
              value={formData.work_mode}
              onChange={handleChange}
              className={inputClass(errors.work_mode)}
            >
              <option value="">
                Select work mode
              </option>

              <option value="ONSITE">
                On-site
              </option>

              <option value="REMOTE">
                Remote
              </option>

              <option value="HYBRID">
                Hybrid
              </option>
            </select>

            {errors.work_mode && (
              <p className="mt-1.5 text-xs text-rose-600">
                {errors.work_mode}
              </p>
            )}
          </div>

          {/* Employment Type */}
          <div>
            <label className={labelClass}>
              Employment Type
            </label>

            <select
              name="employment_type"
              value={formData.employment_type}
              onChange={handleChange}
              className={inputClass(
                errors.employment_type
              )}
            >
              <option value="">
                Select employment type
              </option>

              <option value="FULL_TIME">
                Full Time
              </option>

              <option value="PART_TIME">
                Part Time
              </option>

              <option value="CONTRACT">
                Contract
              </option>

              <option value="INTERNSHIP">
                Internship
              </option>

              <option value="FREELANCE">
                Freelance
              </option>
            </select>

            {errors.employment_type && (
              <p className="mt-1.5 text-xs text-rose-600">
                {errors.employment_type}
              </p>
            )}
          </div>

          {/* Experience */}
          <div>
            <label className={labelClass}>
              Experience Required
            </label>

            <input
              type="text"
              name="experience_required"
              value={formData.experience_required}
              onChange={handleChange}
              placeholder="e.g. 3-5 years"
              className={inputClass(
                errors.experience_required
              )}
            />

            {errors.experience_required && (
              <p className="mt-1.5 text-xs text-rose-600">
                {errors.experience_required}
              </p>
            )}
          </div>

          {/* Education */}
          <div>
            <label className={labelClass}>
              Education
            </label>

            <input
              type="text"
              name="education"
              value={formData.education}
              onChange={handleChange}
              placeholder="e.g. Bachelor's degree in Computer Science"
              className={inputClass(errors.education)}
            />

            {errors.education && (
              <p className="mt-1.5 text-xs text-rose-600">
                {errors.education}
              </p>
            )}
          </div>

          {/* Application Deadline */}
          <div>
            <label className={labelClass}>
              Application Deadline
            </label>

            <div className="relative">
              <CalendarDays
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
              />

              <input
                type="date"
                name="application_deadline"
                value={formData.application_deadline}
                onChange={handleChange}
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                className={`${inputClass(
                  errors.application_deadline
                )} pl-10`}
              />
            </div>

            {errors.application_deadline && (
              <p className="mt-1.5 text-xs text-rose-600">
                {errors.application_deadline}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* =========================
          SKILLS
      ========================= */}

      <section className="border-t border-border pt-6">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
            <Wrench size={16} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text">
              Skills & Qualifications
            </h3>

            <p className="text-xs text-text-secondary">
              Add the skills required for this position.
            </p>
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className={labelClass}>
            Skills
          </label>

          <textarea
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            rows={3}
            placeholder="e.g. React, JavaScript, Django, PostgreSQL"
            className={`${inputClass(
              errors.skills
            )} resize-none`}
          />

          <p className="mt-1.5 text-xs text-text-secondary">
            Separate multiple skills with commas.
          </p>

          {errors.skills && (
            <p className="mt-1.5 text-xs text-rose-600">
              {errors.skills}
            </p>
          )}
        </div>
      </section>

      {/* =========================
          SALARY
      ========================= */}

      <section className="border-t border-border pt-6">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Banknote size={16} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text">
              Salary Range
            </h3>

            <p className="text-xs text-text-secondary">
              Add the expected salary range for this position.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* Minimum Salary */}
          <div>
            <label className={labelClass}>
              Minimum Salary
            </label>

            <input
              type="number"
              name="minimum_salary"
              value={formData.minimum_salary}
              onChange={handleChange}
              min="0"
              step="1"
              inputMode="numeric"
              placeholder="e.g. 60000"
              className={inputClass(
                errors.minimum_salary
              )}
            />

            {errors.minimum_salary && (
              <p className="mt-1.5 text-xs text-rose-600">
                {errors.minimum_salary}
              </p>
            )}
          </div>

          {/* Maximum Salary */}
          <div>
            <label className={labelClass}>
              Maximum Salary
            </label>

            <input
              type="number"
              name="maximum_salary"
              value={formData.maximum_salary}
              onChange={handleChange}
              min="0"
              step="1"
              inputMode="numeric"
              placeholder="e.g. 90000"
              className={inputClass(
                errors.maximum_salary
              )}
            />

            {errors.maximum_salary && (
              <p className="mt-1.5 text-xs text-rose-600">
                {errors.maximum_salary}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* =========================
          ACTIONS
      ========================= */}

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">

        {/* Cancel */}
        <button
          type="button"
          onClick={() => {
            if (onSuccess) {
              onSuccess();
            }
          }}
          disabled={loading}
          className="rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-text-secondary transition-colors hover:bg-background hover:text-text disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-hover hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          )}

          {loading
            ? "Saving..."
            : isUpdateMode
              ? "Update Job"
              : "Create Job"}
        </button>
      </div>
    </form>
  );
}

export default JobForm;