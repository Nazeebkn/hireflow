import { useState } from "react";
import {
  ArrowRight,
  BellRing,
  CheckCircle2,
  Clock3,
  Building2,
} from "lucide-react";

function CompanyWelcomeBanner({ profile }) {
  const [showComingSoon, setShowComingSoon] = useState(false);

  const companyName =
    profile?.company_name ||
    profile?.companyName ||
    "Company";

  const profileFields = [
    profile?.company_name,
    profile?.company_email,
    profile?.phone_number,
    profile?.location,
    profile?.company_description,
    profile?.company_logo,
    profile?.website,
  ];

  const completedFields = profileFields.filter(Boolean).length;
  const totalFields = profileFields.length;

  const completion =
    totalFields > 0
      ? Math.round((completedFields / totalFields) * 100)
      : 0;

  const handleUpdateProfile = () => {
    setShowComingSoon(true);
  };

  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-primary/20 bg-primary text-white shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr]">

          {/* Welcome Content */}
          <div className="relative px-6 py-6 sm:px-7 sm:py-7">

            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5" />

            <div className="absolute -bottom-16 right-20 h-40 w-40 rounded-full bg-white/5" />

            <div className="relative">

              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                <BellRing size={14} />

                <span className="text-xs font-medium">
                  Welcome back
                </span>
              </div>

              <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                Hello, {companyName}!
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-white/80 sm:text-base">
                Manage your job postings, review candidates,
                and find the right talent for your organization.
              </p>

              {/* Actions */}
              <div className="mt-5 flex flex-wrap gap-3">

                {/* Manage Jobs */}
                <button
                  type="button"
                  onClick={() =>
                    (window.location.href = "/company/jobs")
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-white/90"
                >
                  Manage Jobs
                  <ArrowRight size={16} />
                </button>

                {/* Update Profile */}
                <button
                  type="button"
                  onClick={handleUpdateProfile}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/15"
                >
                  Update Profile
                </button>

              </div>

            </div>
          </div>

          {/* Profile Completion */}
          <div className="border-t border-white/10 bg-white/5 px-6 py-6 sm:px-7 lg:border-l lg:border-t-0">

            <div className="flex items-start justify-between gap-4">

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                  Company Profile
                </p>

                <h3 className="mt-1 text-lg font-semibold">
                  {completion}% Complete
                </h3>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                {completion >= 80 ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <Building2 size={20} />
                )}
              </div>

            </div>

            {/* Progress */}
            <div className="mt-5">

              <div className="h-2 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-white transition-all duration-500"
                  style={{
                    width: `${completion}%`,
                  }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between">

                <span className="text-xs text-white/70">
                  {completedFields} of {totalFields} completed
                </span>

                <span className="text-xs font-semibold text-white">
                  {completion}%
                </span>

              </div>

            </div>

            {/* Message */}
            <div className="mt-5 rounded-xl border border-white/10 bg-white/10 px-4 py-3">
              <p className="text-xs leading-5 text-white/80">
                {completion >= 80
                  ? "Your company profile looks great. Keep it updated to attract better candidates."
                  : "Complete your company profile to help candidates learn more about your organization."}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Coming Soon Modal */}
      {showComingSoon && (
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
                Profile management will be available through
                the Settings section in a future update.
              </p>

            </div>

            <button
              type="button"
              onClick={() => setShowComingSoon(false)}
              className="mt-5 w-full rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
            >
              Got it
            </button>

          </div>
        </div>
      )}
    </>
  );
}

export default CompanyWelcomeBanner;