import { Briefcase, Plus, Pencil, Trash2 } from "lucide-react";

function ExperienceSection({
  experiences,
  experienceLoading,
  experienceSaving,
  editing,
  handleAddExperienceClick,
  handleEditExperience,
  handleDeleteExperience,
  ProfileSection,
}) {
  return (
    <ProfileSection
      title="Experience"
      description="Add your professional work experience."
      icon={<Briefcase size={20} />}
    >
      <div className="space-y-4">
        {editing && (
          <button
            type="button"
            onClick={handleAddExperienceClick}
            disabled={experienceSaving}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={17} />
            Add Experience
          </button>
        )}

        {experienceLoading ? (
          <p className="text-sm text-gray-500">
            Loading experience...
          </p>
        ) : experiences.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 px-5 py-8 text-center">
            <p className="text-sm text-gray-500">
              No experience added yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {experiences.map((experience) => (
              <div
                key={experience.id}
                className="rounded-xl border border-gray-200 bg-white p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h4 className="text-base font-semibold text-gray-900">
                      {experience.job_title || "Job Title"}
                    </h4>

                    <p className="mt-1 text-sm font-medium text-gray-700">
                      {experience.company_name || "Company"}
                    </p>

                    {experience.employment_type && (
                      <p className="mt-1 text-sm text-gray-500">
                        {experience.employment_type}
                      </p>
                    )}

                    {(experience.start_date ||
                      experience.end_date ||
                      experience.currently_working) && (
                      <p className="mt-2 text-sm text-gray-500">
                        {experience.start_date || "—"}{" "}
                        -{" "}
                        {experience.currently_working
                          ? "Present"
                          : experience.end_date || "—"}
                      </p>
                    )}

                    {experience.location && (
                      <p className="mt-1 text-sm text-gray-500">
                        {experience.location}
                      </p>
                    )}

                    {experience.description && (
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                        {experience.description}
                      </p>
                    )}
                  </div>

                  {editing && (
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleEditExperience(experience)
                        }
                        disabled={experienceSaving}
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Edit experience"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteExperience(experience.id)
                        }
                        disabled={experienceSaving}
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Delete experience"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProfileSection>
  );
}

export default ExperienceSection;