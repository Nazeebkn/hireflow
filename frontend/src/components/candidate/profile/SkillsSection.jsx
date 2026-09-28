import { Code2, Plus, X } from "lucide-react";

function SkillsSection({
  skills,
  skillName,
  setSkillName,
  skillProficiency,
  setSkillProficiency,
  skillYears,
  setSkillYears,
  handleAddSkill,
  handleRemoveSkill,
  editing,
  skillsLoading,
  skillSaving,
  skillError,
  ProfileSection,
}) {
  return (
    <ProfileSection
      title="Skills"
      description="Add the technical and professional skills you have."
      icon={<Code2 size={20} />}
    >
      <div className="space-y-5">
        {editing && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-text">
                Skill
                <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                type="text"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                placeholder="e.g. Python"
                disabled={skillSaving}
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text">
                Proficiency
                <span className="ml-1 text-red-500">*</span>
              </label>

              <select
                value={skillProficiency}
                onChange={(e) => setSkillProficiency(e.target.value)}
                disabled={skillSaving}
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">Select level</option>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
                <option value="EXPERT">Expert</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text">
                Years of Experience
              </label>

              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  value={skillYears}
                  onChange={(e) => setSkillYears(e.target.value)}
                  placeholder="0"
                  disabled={skillSaving}
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={handleAddSkill}
                  disabled={skillSaving}
                  className="flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Plus size={17} />
                  {skillSaving ? "Adding..." : "Add"}
                </button>
              </div>
            </div>
          </div>
        )}

        {skillError && (
          <p className="text-sm font-medium text-red-600">
            {skillError}
          </p>
        )}

        {skillsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : skills.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-background px-5 py-8 text-center">
            <p className="text-sm text-text-secondary">
              No skills added yet.
            </p>

            {editing && (
              <p className="mt-1 text-xs text-text-secondary">
                Add your skills using the fields above.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {skills.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-text">
                      {item.skill_name ||
                        item.skill?.name ||
                        item.name}
                    </span>

                    {item.proficiency && (
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                        {item.proficiency.replace("_", " ")}
                      </span>
                    )}
                  </div>

                  {item.years_of_experience !== undefined &&
                    item.years_of_experience !== null && (
                      <p className="mt-1 text-xs text-text-secondary">
                        {item.years_of_experience}{" "}
                        {item.years_of_experience === 1
                          ? "year"
                          : "years"}{" "}
                        of experience
                      </p>
                    )}
                </div>

                {editing && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(item.id)}
                    disabled={skillSaving}
                    className="ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-secondary transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    title="Remove skill"
                  >
                    <X size={17} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </ProfileSection>
  );
}

export default SkillsSection;