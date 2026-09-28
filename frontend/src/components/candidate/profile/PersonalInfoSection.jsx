import { UserRound } from "lucide-react";

function PersonalInfoSection({
  formData,
  handleChange,
  editing,
  errors,
  ProfileSection,
  FormField,
}) {
  return (
    <ProfileSection
      title="Personal Information"
      description="Your basic personal and contact information."
      icon={<UserRound size={20} />}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FormField
          label="First Name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          disabled={!editing}
          error={errors.first_name}
          required
        />

        <FormField
          label="Last Name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          disabled={!editing}
          error={errors.last_name}
          required
        />

        <FormField
          label="Phone Number"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          disabled={!editing}
          error={errors.phone_number}
          required
        />

        <FormField
          label="Date of Birth"
          name="date_of_birth"
          type="date"
          value={formData.date_of_birth}
          onChange={handleChange}
          disabled={!editing}
          error={errors.date_of_birth}
          required
        />

        <FormField
          label="Gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          disabled={!editing}
          error={errors.gender}
        />

        <FormField
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          disabled={!editing}
          error={errors.location}
          required
        />
      </div>
    </ProfileSection>
  );
}

export default PersonalInfoSection;