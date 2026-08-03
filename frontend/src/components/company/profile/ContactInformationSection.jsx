import AuthInput from "../../auth/AuthInput";

function ContactInformationSection({
  formData,
  errors,
  onChange,
}) {
  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-lg font-semibold text-text-primary">
          Contact Information
        </h2>

        <p className="mt-1 text-sm text-text-secondary">
          Provide your company contact details and office address.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        <div>
          <AuthInput
            label="Contact Person"
            name="contact_person"
            type="text"
            placeholder="Enter contact person"
            value={formData.contact_person}
            onChange={onChange}
            required
          />

          {errors.contact_person && (
            <p className="mt-1 text-sm text-red-500">
              {errors.contact_person}
            </p>
          )}
        </div>

        <div>
          <AuthInput
            label="Contact Phone"
            name="contact_phone"
            type="tel"
            placeholder="Enter contact number"
            value={formData.contact_phone}
            onChange={onChange}
            required
          />

          {errors.contact_phone && (
            <p className="mt-1 text-sm text-red-500">
              {errors.contact_phone}
            </p>
          )}
        </div>

        <div>
          <AuthInput
            label="Country"
            name="country"
            type="text"
            placeholder="Enter country"
            value={formData.country}
            onChange={onChange}
            required
          />

          {errors.country && (
            <p className="mt-1 text-sm text-red-500">
              {errors.country}
            </p>
          )}
        </div>

        <div>
          <AuthInput
            label="State"
            name="state"
            type="text"
            placeholder="Enter state"
            value={formData.state}
            onChange={onChange}
            required
          />

          {errors.state && (
            <p className="mt-1 text-sm text-red-500">
              {errors.state}
            </p>
          )}
        </div>

        <div>
          <AuthInput
            label="City"
            name="city"
            type="text"
            placeholder="Enter city"
            value={formData.city}
            onChange={onChange}
            required
          />

          {errors.city && (
            <p className="mt-1 text-sm text-red-500">
              {errors.city}
            </p>
          )}
        </div>

      </div>

      <div>
        <AuthInput
          label="Company Address"
          name="address"
          type="text"
          placeholder="Enter complete company address"
          value={formData.address}
          onChange={onChange}
          required
        />

        {errors.address && (
          <p className="mt-1 text-sm text-red-500">
            {errors.address}
          </p>
        )}
      </div>

    </div>
  );
}

export default ContactInformationSection;