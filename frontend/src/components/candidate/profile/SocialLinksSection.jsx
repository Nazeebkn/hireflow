import { Link as LinkIcon } from "lucide-react";

function SocialLinksSection({
  formData,
  handleChange,
  editing,
  errors,
  ProfileSection,
  FormField,
}) {
  return (
    <ProfileSection
      title="Social & Professional Links"
      description="Add links to your professional online presence."
      icon={<LinkIcon size={20} />}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FormField
          label="LinkedIn"
          name="linkedin_url"
          value={formData.linkedin_url}
          onChange={handleChange}
          disabled={!editing}
          error={errors.linkedin_url}
          placeholder="https://linkedin.com/in/your-profile"
        />

        <FormField
          label="GitHub"
          name="github_url"
          value={formData.github_url}
          onChange={handleChange}
          disabled={!editing}
          error={errors.github_url}
          placeholder="https://github.com/your-username"
        />

        <div className="md:col-span-2">
          <FormField
            label="Portfolio"
            name="portfolio_url"
            value={formData.portfolio_url}
            onChange={handleChange}
            disabled={!editing}
            error={errors.portfolio_url}
            placeholder="https://yourportfolio.com"
          />
        </div>
      </div>
    </ProfileSection>
  );
}

export default SocialLinksSection;