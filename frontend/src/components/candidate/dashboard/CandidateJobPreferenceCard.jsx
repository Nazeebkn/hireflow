import { useState } from "react";
import {
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  Clock3,
  Globe,
  MapPin,
} from "lucide-react";

function CandidateJobPreferenceCard({
  jobPreference,
  loading = false,
}) {
  const [showComingSoon, setShowComingSoon] = useState(false);

  const formatEmploymentType = (type) => {
    if (!type) return "Not specified";

    return type
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatSalary = (salary) => {
    if (!salary) return null;

    return `₹${Number(salary).toLocaleString("en-IN")}`;
  };

  const handleEditPreferences = () => {
    setShowComingSoon(true);
  };

  if (loading) {
    return (
      <section className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-5 w-40 animate-pulse rounded bg-slate-100" />
            <div className="mt-2 h-4 w-56 animate-pulse rounded bg-slate-100" />
          </div>

          <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-100" />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-16 animate-pulse rounded-xl bg-slate-100"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!jobPreference) {
    return (
      <>
        <section className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BriefcaseBusiness size={21} />
              </div>

              <h2 className="mt-4 text-lg font-semibold text-text">
                Job Preferences
              </h2>

              <p className="mt-1 text-sm leading-6 text-text-secondary">
                Set your preferred job roles, locations, salary range,
                and work preferences.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleEditPreferences}
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-text-secondary transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
          >
            Add Preferences
            <ArrowRight size={16} />
          </button>
        </section>

        {showComingSoon && (
          <ComingSoonModal
            onClose={() => setShowComingSoon(false)}
          />
        )}
      </>
    );
  }

  const locations = Array.isArray(
    jobPreference.preferred_locations
  )
    ? jobPreference.preferred_locations
    : [];

  const salaryRange =
    jobPreference.minimum_salary ||
    jobPreference.maximum_salary
      ? `${formatSalary(jobPreference.minimum_salary) || "Any"} - ${
          formatSalary(jobPreference.maximum_salary) || "Any"
        }`
      : "Not specified";

  return (
    <>
      <section className="rounded-2xl border border-border bg-surface p-6 transition hover:border-primary/20 hover:shadow-sm">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BriefcaseBusiness size={21} />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-text">
              Job Preferences
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Your preferred career opportunities
            </p>
          </div>

          <button
            type="button"
            onClick={handleEditPreferences}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition hover:underline"
          >
            Edit
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Preferred Role */}
        <div className="mt-6 rounded-xl border border-border bg-background p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
            Preferred Job Role
          </p>

          <p className="mt-1 text-sm font-semibold text-text">
            {jobPreference.preferred_job_role || "Not specified"}
          </p>
        </div>

        {/* Details */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* Locations */}
          <div className="rounded-xl border border-border bg-background p-4">
            <div className="flex items-center gap-2">
              <MapPin size={17} className="text-primary" />

              <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                Preferred Locations
              </p>
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {locations.length > 0 ? (
                locations.slice(0, 4).map((location, index) => (
                  <span
                    key={`${location}-${index}`}
                    className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                  >
                    {location}
                  </span>
                ))
              ) : (
                <span className="text-sm text-text-secondary">
                  Not specified
                </span>
              )}
            </div>
          </div>

          {/* Employment Type */}
          <div className="rounded-xl border border-border bg-background p-4">
            <div className="flex items-center gap-2">
              <BriefcaseBusiness
                size={17}
                className="text-primary"
              />

              <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                Employment Type
              </p>
            </div>

            <p className="mt-2 text-sm font-semibold text-text">
              {formatEmploymentType(
                jobPreference.employment_type
              )}
            </p>
          </div>

          {/* Salary */}
          <div className="rounded-xl border border-border bg-background p-4">
            <div className="flex items-center gap-2">
              <Globe size={17} className="text-primary" />

              <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                Salary Range
              </p>
            </div>

            <p className="mt-2 text-sm font-semibold text-text">
              {salaryRange}
            </p>
          </div>

          {/* Remote */}
          <div className="rounded-xl border border-border bg-background p-4">
            <div className="flex items-center gap-2">
              <Globe size={17} className="text-primary" />

              <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                Work Preference
              </p>
            </div>

            <p className="mt-2 text-sm font-semibold text-text">
              {jobPreference.remote_only
                ? "Remote Only"
                : "Open to Work Modes"}
            </p>
          </div>

        </div>
      </section>

      {/* Coming Soon Modal */}
      {showComingSoon && (
        <ComingSoonModal
          onClose={() => setShowComingSoon(false)}
        />
      )}
    </>
  );
}

function ComingSoonModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-xl">

        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Clock3 size={24} />
        </div>

        <div className="mt-4 text-center">
          <h2 className="text-lg font-semibold text-text">
            Coming Soon
          </h2>

          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Job preference management will be available through
            the Settings section in a future update.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
        >
          Got it
        </button>

      </div>
    </div>
  );
}

export default CandidateJobPreferenceCard;