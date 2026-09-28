import { BriefcaseBusiness, Pencil } from "lucide-react";

function JobPreferencesSection({
  jobPreference,
  editing,
  handleEditJobPreference,
  ProfileSection,
}) {
  const locations = Array.isArray(jobPreference?.preferred_locations)
    ? jobPreference.preferred_locations
    : [];

  return (
    <ProfileSection
      title="Job Preferences"
      description="Set your preferred roles, locations, salary and work preferences."
      icon={<BriefcaseBusiness size={20} />}
      action={
        editing && (
          <button
            type="button"
            onClick={handleEditJobPreference}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-blue-600"
          >
            <Pencil size={16} />
            Edit
          </button>
        )
      }
    >
      {!jobPreference ? (
        <div className="rounded-xl border border-dashed border-gray-200 px-5 py-8 text-center">
          <p className="text-sm text-gray-500">
            No job preferences added yet.
          </p>

          {editing && (
            <button
              type="button"
              onClick={handleEditJobPreference}
              className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Add Job Preferences
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Preferred Job Role
            </p>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {jobPreference.preferred_job_role || "—"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Employment Type
            </p>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {jobPreference.employment_type || "—"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Minimum Salary
            </p>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {jobPreference.minimum_salary
                ? `₹${Number(
                    jobPreference.minimum_salary
                  ).toLocaleString("en-IN")}`
                : "—"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Maximum Salary
            </p>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {jobPreference.maximum_salary
                ? `₹${Number(
                    jobPreference.maximum_salary
                  ).toLocaleString("en-IN")}`
                : "—"}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Preferred Locations
            </p>

            {locations.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {locations.map((location, index) => (
                  <span
                    key={`${location}-${index}`}
                    className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700"
                  >
                    {location}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-1 text-sm text-gray-500">—</p>
            )}
          </div>

          <div className="md:col-span-2">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Remote Preference
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              {jobPreference.remote_only
                ? "Remote Only"
                : "Open to On-site / Hybrid"}
            </p>
          </div>
        </div>
      )}
    </ProfileSection>
  );
}

export default JobPreferencesSection;