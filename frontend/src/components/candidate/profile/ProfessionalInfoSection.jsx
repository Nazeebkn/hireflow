import { BriefcaseBusiness } from "lucide-react";

function ProfessionalInfoSection({
  formData,
  handleChange,
  editing,
  errors,
  ProfileSection,
  FormField,
}) {
  return (
    <ProfileSection
      title="Professional Information"
      description="Tell employers about your professional background."
      icon={<BriefcaseBusiness size={20} />}
    >
      <div className="grid grid-cols-1 gap-5">
        <FormField
          label="Professional Headline"
          name="headline"
          value={formData.headline}
          onChange={handleChange}
          disabled={!editing}
          error={errors.headline}
          required
        />

        <FormField
          label="About Me"
          name="about"
          textarea
          value={formData.about}
          onChange={handleChange}
          disabled={!editing}
          error={errors.about}
          required
          rows={5}
        />
      </div>
    </ProfileSection>
  );
}

export default ProfessionalInfoSection;