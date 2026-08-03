import AuthInput from "../../auth/AuthInput";
import SelectInput from "../../common/SelectInput";
import TextAreaInput from "../../common/TextAreaInput";

function CompanyInformationSection({
  formData,
  errors,
  onChange,
  industryOptions,
  companySizeOptions,
}) {
  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-lg font-semibold text-text-primary">
          Company Information
        </h2>

        <p className="mt-1 text-sm text-text-secondary">
          Provide your basic company details.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        <div>
          <AuthInput
            label="Company Name"
            name="company_name"
            type="text"
            placeholder="Enter company name"
            value={formData.company_name}
            onChange={onChange}
            required
          />

          {errors.company_name && (
            <p className="mt-1 text-sm text-red-500">
              {errors.company_name}
            </p>
          )}
        </div>

        <div>
          <SelectInput
            label="Industry"
            name="industry"
            value={formData.industry}
            options={industryOptions}
            onChange={onChange}
            required
          />

          {errors.industry && (
            <p className="mt-1 text-sm text-red-500">
              {errors.industry}
            </p>
          )}
        </div>

        <div>
          <SelectInput
            label="Company Size"
            name="company_size"
            value={formData.company_size}
            options={companySizeOptions}
            onChange={onChange}
            required
          />

          {errors.company_size && (
            <p className="mt-1 text-sm text-red-500">
              {errors.company_size}
            </p>
          )}
        </div>

        <div>
          <AuthInput
            label="Website"
            name="website"
            type="url"
            placeholder="https://example.com"
            value={formData.website}
            onChange={onChange}
          />

          {errors.website && (
            <p className="mt-1 text-sm text-red-500">
              {errors.website}
            </p>
          )}
        </div>

      </div>

      <div>
        <TextAreaInput
          label="Company Description"
          name="description"
          placeholder="Tell us about your company..."
          value={formData.description}
          onChange={onChange}
          rows={5}
          required
        />

        {errors.description && (
          <p className="mt-1 text-sm text-red-500">
            {errors.description}
          </p>
        )}
      </div>

    </div>
  );
}

export default CompanyInformationSection;