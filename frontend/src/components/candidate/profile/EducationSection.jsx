import { GraduationCap, Plus, Pencil, Trash2 } from "lucide-react";

function EducationSection({
  educations,
  educationLoading,
  educationSaving,
  editing,
  handleAddEducationClick,
  handleEditEducation,
  handleDeleteEducation,
  ProfileSection,
}) {
  return (
    <ProfileSection
      title="Education"
      description="Add your educational qualifications."
      icon={<GraduationCap size={20} />}
    >
      <div className="space-y-4">
        {editing && (
          <button
            type="button"
            onClick={handleAddEducationClick}
            disabled={educationSaving}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={17} />
            Add Education
          </button>
        )}

        {educationLoading ? (
          <p className="text-sm text-gray-500">
            Loading education...
          </p>
        ) : educations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 px-5 py-8 text-center">
            <p className="text-sm text-gray-500">
              No education added yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {educations.map((education) => (
              <div
                key={education.id}
                className="rounded-xl border border-gray-200 bg-white p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h4 className="text-base font-semibold text-gray-900">
                      {education.institution_name || "Institution"}
                    </h4>

                    <p className="mt-1 text-sm font-medium text-gray-700">
                      {education.education_level || "Education Level"}
                    </p>

                    {education.field_of_study && (
                      <p className="mt-1 text-sm text-gray-500">
                        {education.field_of_study}
                      </p>
                    )}

                    {(education.start_date || education.end_date) && (
                      <p className="mt-2 text-sm text-gray-500">
                        {education.start_date || "—"} -{" "}
                        {education.end_date || "Present"}
                      </p>
                    )}

                    {education.score && (
                      <p className="mt-1 text-sm text-gray-500">
                        Score: {education.score}
                      </p>
                    )}

                    {education.description && (
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                        {education.description}
                      </p>
                    )}
                  </div>

                  {editing && (
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditEducation(education)}
                        disabled={educationSaving}
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Edit education"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteEducation(education.id)
                        }
                        disabled={educationSaving}
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Delete education"
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

export default EducationSection;