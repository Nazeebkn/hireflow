import AuthInput from "../../auth/AuthInput";

function CareerDetailsStep({
  formData,
  errors,
  onChange,
}) {
  return (
    <div className="space-y-6">

      {/* Education */}
      <div className="rounded-2xl border border-border bg-background p-5">

        <h3 className="text-lg font-semibold text-text-primary">
          Education
        </h3>

        <p className="mt-1 text-sm text-text-secondary">
          Tell us about your highest qualification.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">

          <div className="space-y-2">

            <label className="text-sm font-medium text-text">
              Highest Education
            </label>

            <select
              name="education"
              value={formData.education}
              onChange={onChange}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none transition focus:border-primary"
            >
              <option value="">
                Select Education
              </option>

              <option value="HIGHER_SECONDARY">
                Higher Secondary (+2)
              </option>

              <option value="DIPLOMA">
                Diploma
              </option>

              <option value="BACHELORS">
                Bachelor's Degree
              </option>

              <option value="MASTERS">
                Master's Degree
              </option>

              <option value="PHD">
                PhD
              </option>

            </select>

            {errors.education && (
              <p className="text-sm text-red-500">
                {errors.education}
              </p>
            )}

          </div>

         {formData.education === "HIGHER_SECONDARY" && (
            <>
              <AuthInput
                name="institution_name"
                label="School Name"
                placeholder="GHSS Chundale"
                value={formData.institution_name}
                onChange={onChange}
                error={errors.institution_name}
              />

              <AuthInput
                name="qualification"
                label="Stream"
                placeholder="Science / Commerce / Humanities"
                value={formData.qualification}
                onChange={onChange}
                error={errors.qualification}
              />
            </>
          )}

          {formData.education === "DIPLOMA" && (
            <>
              <AuthInput
                name="institution_name"
                label="Institute Name"
                placeholder="GPTC Kozhikode"
                value={formData.institution_name}
                onChange={onChange}
                error={errors.institution_name}
              />

              <AuthInput
                name="qualification"
                label="Diploma Course"
                placeholder="Diploma in Mechanical Engineering"
                value={formData.qualification}
                onChange={onChange}
                error={errors.qualification}
              />
            </>
          )}

          {["BACHELORS", "MASTERS", "PHD"].includes(formData.education) && (
            <>
              <AuthInput
                name="institution_name"
                label="College / University"
                placeholder="Government Engineering College"
                value={formData.institution_name}
                onChange={onChange}
                error={errors.institution_name}
              />

              <AuthInput
                name="qualification"
                label="Degree"
                placeholder="B.Tech Computer Science"
                value={formData.qualification}
                onChange={onChange}
                error={errors.qualification}
              />
            </>
          )}

          <AuthInput
            name="graduation_year"
            label={
              ["HIGHER_SECONDARY", "DIPLOMA"].includes(formData.education)
                ? "Passing Year"
                : "Graduation Year"
            }
            type="number"
            placeholder="2026"
            value={formData.graduation_year}
            onChange={onChange}
            error={errors.graduation_year}
          />

        </div>

      </div>

          {/* Experience */}
    <div className="rounded-2xl border border-border bg-background p-5">

      <h3 className="text-lg font-semibold text-text-primary">
        Experience
      </h3>

      <p className="mt-1 text-sm text-text-secondary">
        Tell us about your current professional experience.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">

        <div className="space-y-2">

          <label className="text-sm font-medium text-text">
            Experience Level
          </label>

          <select
            name="experience_level"
            value={formData.experience_level}
            onChange={onChange}
            className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none transition focus:border-primary"
          >
            <option value="">
              Select Experience
            </option>

            <option value="FRESHER">
              Fresher
            </option>

            <option value="0-1">
              0 - 1 Years
            </option>

            <option value="1-3">
              1 - 3 Years
            </option>

            <option value="3-5">
              3 - 5 Years
            </option>

            <option value="5+">
              5+ Years
            </option>

          </select>

          {errors.experience_level && (
            <p className="text-sm text-red-500">
              {errors.experience_level}
            </p>
          )}

        </div>

       {formData.experience_level !== "FRESHER" &&
        formData.experience_level !== "" && (
          <>
            <AuthInput
              name="current_job_title"
              label="Current Job Title"
              placeholder="Backend Developer"
              value={formData.current_job_title}
              onChange={onChange}
              error={errors.current_job_title}
            />

            <AuthInput
              name="current_company"
              label="Current Company"
              placeholder="ABC Technologies"
              value={formData.current_company}
              onChange={onChange}
              error={errors.current_company}
            />
          </>
        )}

      </div>

      </div>

      {/* Career Preferences */}
  <div className="rounded-2xl border border-border bg-background p-5">

    <h3 className="text-lg font-semibold text-text-primary">
      Career Preferences
    </h3>

    <p className="mt-1 text-sm text-text-secondary">
      Tell us about the type of opportunities you are looking for.
    </p>

    <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">

      <AuthInput
        name="primary_skill"
        label="Primary Skill"
        placeholder="React, Django, Java..."
        value={formData.primary_skill}
        onChange={onChange}
        error={errors.primary_skill}
      />

      <AuthInput
        name="preferred_job_role"
        label="Preferred Job Role"
        placeholder="Backend Developer"
        value={formData.preferred_job_role}
        onChange={onChange}
        error={errors.preferred_job_role}
      />

      <AuthInput
        name="preferred_location"
        label="Preferred Job Location"
        placeholder="Bangalore"
        value={formData.preferred_location}
        onChange={onChange}
        error={errors.preferred_location}
      />

      <AuthInput
        name="expected_salary"
        label="Expected Annual CTC (₹)"
        type="number"
        placeholder="e.g. 600000"
        value={formData.expected_salary}
        onChange={onChange}
        error={errors.expected_salary}
      />
        </div>

      </div>

    </div>

  );
}

export default CareerDetailsStep;