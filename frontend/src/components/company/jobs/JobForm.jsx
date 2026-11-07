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

  const [questions, setQuestions] = useState(
    Array.isArray(job?.questions) ? job.questions : []
  );

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
  // APPLICATION QUESTION HANDLERS
  // ==========================================

  const addQuestion = () => {
    if (questions.length >= 8) {
      toast.error("Maximum 8 questions allowed.");
      return;
    }

    setQuestions((previous) => [
      ...previous,
      {
        question_text: "",
        question_type: "SHORT_TEXT",
        options: [],
        display_order: previous.length,
      },
    ]);
  };

  const updateQuestion = (index, field, value) => {
    setQuestions((previous) =>
      previous.map((question, questionIndex) => {
        if (questionIndex !== index) {
          return question;
        }

        const updatedQuestion = {
          ...question,
          [field]: value,
        };

        if (field === "question_type" && value !== "MULTIPLE_CHOICE") {
          updatedQuestion.options = [];
        }

        return updatedQuestion;
      })
    );
  };

  const removeQuestion = (index) => {
    setQuestions((previous) =>
      previous
        .filter((_, questionIndex) => questionIndex !== index)
        .map((question, questionIndex) => ({
          ...question,
          display_order: questionIndex,
        }))
    );
  };

  const moveQuestion = (index, direction) => {
    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= questions.length) {
      return;
    }

    setQuestions((previous) => {
      const updated = [...previous];
      [updated[index], updated[newIndex]] = [
        updated[newIndex],
        updated[index],
      ];

      return updated.map((question, questionIndex) => ({
        ...question,
        display_order: questionIndex,
      }));
    });
  };

  // ==========================================
  // HANDLE SUBMIT
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Questions are optional, but if added there must be 3 to 8.
    if (questions.length > 0 && (questions.length < 3 || questions.length > 8)) {
      toast.error("Add either 0 questions or between 3 and 8 questions.");
      return;
    }

    for (let index = 0; index < questions.length; index += 1) {
      const question = questions[index];

      if (!question.question_text?.trim()) {
        toast.error(`Enter the text for question ${index + 1}.`);
        return;
      }

      if (question.question_type === "MULTIPLE_CHOICE") {
        const options = Array.isArray(question.options)
          ? question.options.map((option) => option.trim()).filter(Boolean)
          : [];
        const uniqueOptions = new Set(
          options.map((option) => option.toLowerCase())
        );

        if (options.length < 2) {
          toast.error(`Question ${index + 1} needs at least 2 options.`);
          return;
        }

        if (uniqueOptions.size !== options.length) {
          toast.error(`Question ${index + 1} has duplicate options.`);
          return;
        }
      }
    }

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

        questions: questions.map((question, index) => ({
          question_text: question.question_text.trim(),
          question_type: question.question_type,
          options:
            question.question_type === "MULTIPLE_CHOICE"
              ? question.options.map((option) => option.trim()).filter(Boolean)
              : [],
          display_order: index,
        })),
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
          APPLICATION QUESTIONS
      ========================= */}

      <section className="border-t border-border pt-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-text">
              Application Questions <span className="font-normal text-text-secondary">(Optional)</span>
            </h3>
            <p className="mt-1 text-xs text-text-secondary">
              Ask candidates for job-specific information. If you add questions, add between 3 and 8. All questions are mandatory for applicants.
            </p>
          </div>

        </div>

        {questions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border px-4 py-6 text-center">
            <p className="text-sm text-text-secondary">
              No application questions added. Candidates can apply without answering extra questions.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div
                key={question.id || `question-${index}`}
                className="rounded-xl border border-border bg-surface p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-text">
                    Question {index + 1}
                  </p>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveQuestion(index, -1)}
                      disabled={loading || index === 0}
                      aria-label={`Move question ${index + 1} up`}
                      className="rounded-lg border border-border px-2.5 py-1.5 text-xs text-text-secondary hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveQuestion(index, 1)}
                      disabled={loading || index === questions.length - 1}
                      aria-label={`Move question ${index + 1} down`}
                      className="rounded-lg border border-border px-2.5 py-1.5 text-xs text-text-secondary hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      disabled={loading}
                      className="rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className={labelClass}>
                      Question Text
                    </label>
                    <input
                      type="text"
                      value={question.question_text || ""}
                      onChange={(event) =>
                        updateQuestion(index, "question_text", event.target.value)
                      }
                      maxLength={500}
                      placeholder="e.g. How many years of experience do you have?"
                      className={inputClass()}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Answer Type
                    </label>
                    <select
                      value={question.question_type}
                      onChange={(event) =>
                        updateQuestion(index, "question_type", event.target.value)
                      }
                      className={inputClass()}
                    >
                      <option value="SHORT_TEXT">Short Text</option>
                      <option value="YES_NO">Yes / No</option>
                      <option value="NUMBER">Number</option>
                      <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                    </select>
                  </div>

                  {question.question_type === "MULTIPLE_CHOICE" && (
                    <div>
                      <label className={labelClass}>
                        Options (one option per line)
                      </label>
                      <textarea
                        rows={3}
                        value={(question.options || []).join("\n")}
                        onChange={(event) =>
                          updateQuestion(
                            index,
                            "options",
                            event.target.value.split("\n")
                          )
                        }
                        placeholder={"Option 1\nOption 2\nOption 3"}
                        className={`${inputClass()} resize-y`}
                      />
                      <p className="mt-1 text-xs text-text-secondary">
                        Add at least 2 different options. Candidates can select multiple options.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="sticky bottom-0 z-20 -mx-1 mt-4 border-t border-border/70 bg-surface/95 px-1 pb-2 pt-3 backdrop-blur-sm">
          <button
            type="button"
            onClick={addQuestion}
            disabled={loading || questions.length >= 8}
            className="w-full rounded-xl border border-dashed border-primary/40 bg-surface px-4 py-3 text-sm font-semibold text-primary shadow-sm transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {questions.length === 0 ? "+ Add First Question" : "+ Add Another Question"}
          </button>

          <p className="mt-2 text-center text-xs text-text-secondary">
            {questions.length} of 8 questions added
          </p>
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