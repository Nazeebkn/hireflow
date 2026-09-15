import { useEffect, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CircleAlert,
  Globe,
  UserRound,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import { getCandidateDashboard } from "../../services/candidate/candidateDashboardService";

import CandidateDashboardLayout from "../../components/candidate/dashboard/CandidateDashboardLayout";
import CandidateWelcomeBanner from "../../components/candidate/dashboard/CandidateWelcomeBanner";
import CandidateStatsCards from "../../components/candidate/dashboard/CandidateStatsCards";
import CandidateProfileCard from "../../components/candidate/dashboard/CandidateProfileCard";
import CandidateJobPreferenceCard from "../../components/candidate/dashboard/CandidateJobPreferenceCard";

function CandidateDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comingSoon, setComingSoon] = useState(false);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getCandidateDashboard();
      setDashboard(data);
    } catch (fetchError) {
      const data = fetchError.response?.data;

      const message =
        data?.message ||
        data?.detail ||
        "Unable to load your dashboard right now.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const profile = dashboard?.profile;

  const handleComingSoon = () => {
    setComingSoon(true);
  };

  return (
    <CandidateDashboardLayout profile={profile}>
      <div className="space-y-5">

        {/* Page Heading */}
        <section>
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5">
            <span className="text-sm font-medium text-primary">
              Candidate Dashboard
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Dashboard
          </h1>

          <p className="mt-1.5 text-base text-text-secondary">
            Manage your profile, career information, and job preferences
            from one place.
          </p>
        </section>

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-6 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <CircleAlert size={22} />
            </div>

            <p className="mt-3 text-sm font-medium text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchDashboard}
              className="mt-4 rounded-xl border border-red-300 bg-white px-5 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100"
            >
              Retry
            </button>
          </div>
        )}

        {/* Dashboard */}
        {!error && (
          <>
            {/* Welcome */}
            <CandidateWelcomeBanner profile={profile} />

            {/* Statistics */}
            <CandidateStatsCards
              applicationCount={dashboard?.application_count ?? 0}
              activeProcessCount={
                dashboard?.active_process_count ?? 0
              }
              interviewCount={dashboard?.interview_count ?? 0}
              offerCount={dashboard?.offer_count ?? 0}
              loading={loading}
            />

            {/* Profile + Job Preference */}
            <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.45fr_1fr]">
              <CandidateProfileCard
                profile={profile}
                loading={loading}
              />

              <CandidateJobPreferenceCard
                jobPreference={dashboard?.job_preference}
                loading={loading}
              />
            </section>

            {/* Career Readiness */}
            {!loading && (
              <section className="overflow-hidden rounded-2xl border border-border bg-surface">
                <div className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <CheckCircle2 size={22} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                        Career Readiness
                      </p>

                      <h2 className="mt-1 text-lg font-semibold text-text">
                        Complete your profile to stand out
                      </h2>

                      <p className="mt-1 max-w-2xl text-sm leading-6 text-text-secondary">
                        A complete profile gives companies more information
                        about your skills, experience, education, and career
                        preferences.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleComingSoon}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-semibold text-text-secondary transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                  >
                    Update Profile
                    <ArrowRight size={16} />
                  </button>

                </div>
              </section>
            )}

            {/* Quick Actions */}
            <section className="grid grid-cols-1 gap-5 md:grid-cols-3">

              {/* Browse Jobs */}
              <button
                type="button"
                onClick={() =>
                  (window.location.href = "/candidate/jobs")
                }
                className="group rounded-2xl border border-border bg-surface p-5 text-left transition hover:border-primary/30 hover:bg-primary/5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <BriefcaseBusiness size={21} />
                  </div>

                  <ArrowRight
                    size={18}
                    className="text-text-secondary transition group-hover:translate-x-1 group-hover:text-primary"
                  />
                </div>

                <h3 className="mt-4 text-base font-semibold text-text">
                  Browse Jobs
                </h3>

                <p className="mt-1 text-sm leading-6 text-text-secondary">
                  Explore published job opportunities matching your career
                  goals.
                </p>
              </button>

              {/* Update Profile */}
              <button
                type="button"
                onClick={handleComingSoon}
                className="group rounded-2xl border border-border bg-surface p-5 text-left transition hover:border-primary/30 hover:bg-primary/5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <UserRound size={21} />
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-full bg-background px-2.5 py-1 text-[11px] font-semibold text-text-secondary">
                    <Clock3 size={12} />
                    Coming Soon
                  </span>
                </div>

                <h3 className="mt-4 text-base font-semibold text-text">
                  Update Profile
                </h3>

                <p className="mt-1 text-sm leading-6 text-text-secondary">
                  Profile editing will be available through Settings.
                </p>
              </button>

              {/* Career Preferences */}
              <button
                type="button"
                onClick={handleComingSoon}
                className="group rounded-2xl border border-border bg-surface p-5 text-left transition hover:border-primary/30 hover:bg-primary/5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <Globe size={21} />
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-full bg-background px-2.5 py-1 text-[11px] font-semibold text-text-secondary">
                    <Clock3 size={12} />
                    Coming Soon
                  </span>
                </div>

                <h3 className="mt-4 text-base font-semibold text-text">
                  Career Preferences
                </h3>

                <p className="mt-1 text-sm leading-6 text-text-secondary">
                  Manage your preferred roles, locations, salary, and work
                  preferences from Settings.
                </p>
              </button>

            </section>
          </>
        )}

        {/* Coming Soon Message */}
        {comingSoon && (
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
                  Profile management and career preference settings
                  will be available in the Settings section.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setComingSoon(false)}
                className="mt-5 w-full rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
              >
                Got it
              </button>

            </div>
          </div>
        )}

      </div>
    </CandidateDashboardLayout>
  );
}

export default CandidateDashboard;