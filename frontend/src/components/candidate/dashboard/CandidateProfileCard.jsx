import { useState } from "react";
import {
  ArrowRight,
  Clock3,
  FileText,
  Globe,
  MapPin,
  UserRound,
} from "lucide-react";

function CandidateProfileCard({ profile, loading = false }) {
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handleComingSoon = () => {
    setShowComingSoon(true);
  };

  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="border-b border-border px-6 py-5">
          <div className="h-5 w-36 animate-pulse rounded bg-slate-100" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-slate-100" />
        </div>

        <div className="space-y-5 p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 animate-pulse rounded-2xl bg-slate-100" />

            <div className="space-y-2">
              <div className="h-5 w-40 animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-52 animate-pulse rounded bg-slate-100" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-12 animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <>
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="border-b border-border px-6 py-5">
            <h2 className="text-lg font-semibold text-text">
              Profile Overview
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Your professional profile information.
            </p>
          </div>

          <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <UserRound size={26} />
            </div>

            <h3 className="mt-4 text-base font-semibold text-text">
              Profile not completed
            </h3>

            <p className="mt-1 max-w-sm text-sm leading-6 text-text-secondary">
              Complete your candidate profile to showcase your professional
              information to companies.
            </p>

            <button
              type="button"
              onClick={handleComingSoon}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-text-secondary transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
            >
              Complete Profile
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {showComingSoon && (
          <ComingSoonModal
            onClose={() => setShowComingSoon(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">

        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-border px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text">
              Profile Overview
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Your professional profile information.
            </p>
          </div>

          <button
            type="button"
            onClick={handleComingSoon}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text transition hover:bg-background"
          >
            Edit Profile
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Profile Content */}
        <div className="p-6">

          {/* Candidate Identity */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary/10 text-primary">
              {profile.profile_picture ? (
                <img
                  src={profile.profile_picture}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound size={30} />
              )}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-xl font-semibold text-text">
                {profile.first_name || ""} {profile.last_name || ""}
              </h3>

              <p className="mt-1 text-sm text-text-secondary">
                {profile.headline ||
                  "Professional headline not added"}
              </p>

              {profile.location && (
                <div className="mt-2 flex items-center gap-1.5 text-sm text-text-secondary">
                  <MapPin size={15} />
                  <span>{profile.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">

            {/* Phone */}
            <div className="rounded-xl border border-border bg-background px-4 py-3">
              <p className="text-xs font-medium text-text-secondary">
                Phone Number
              </p>

              <p className="mt-1 truncate text-sm font-semibold text-text">
                {profile.phone_number || "-"}
              </p>
            </div>

            {/* Gender */}
            <div className="rounded-xl border border-border bg-background px-4 py-3">
              <p className="text-xs font-medium text-text-secondary">
                Gender
              </p>

              <p className="mt-1 text-sm font-semibold text-text">
                {profile.gender || "-"}
              </p>
            </div>

            {/* LinkedIn */}
            <div className="rounded-xl border border-border bg-background px-4 py-3">
              <p className="text-xs font-medium text-text-secondary">
                LinkedIn
              </p>

              <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-text">
                <Globe size={16} />

                {profile.linkedin_url ? (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate text-primary hover:underline"
                  >
                    View Profile
                  </a>
                ) : (
                  <span>Not added</span>
                )}
              </div>
            </div>

            {/* GitHub */}
            <div className="rounded-xl border border-border bg-background px-4 py-3">
              <p className="text-xs font-medium text-text-secondary">
                GitHub
              </p>

              <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-text">
                <Globe size={16} />

                {profile.github_url ? (
                  <a
                    href={profile.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate text-primary hover:underline"
                  >
                    View Profile
                  </a>
                ) : (
                  <span>Not added</span>
                )}
              </div>
            </div>
          </div>

          {/* Portfolio */}
          <div className="mt-3 rounded-xl border border-border bg-background px-4 py-3">
            <p className="text-xs font-medium text-text-secondary">
              Portfolio
            </p>

            <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-text">
              <Globe size={15} />

              {profile.portfolio_url ? (
                <a
                  href={profile.portfolio_url}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate text-primary hover:underline"
                >
                  View Portfolio
                </a>
              ) : (
                <span>Not added</span>
              )}
            </div>
          </div>

          {/* About */}
          <div className="mt-3 rounded-xl border border-border bg-background px-4 py-4">
            <p className="text-xs font-medium text-text-secondary">
              About
            </p>

            <p className="mt-2 text-sm leading-6 text-text">
              {profile.about ||
                "Add a professional summary to help companies understand your background and experience."}
            </p>
          </div>

          {/* Resume */}
          <div className="mt-4 flex flex-col gap-3 rounded-xl border border-border bg-background px-4 py-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText size={18} />
              </div>

              <div>
                <p className="text-sm font-semibold text-text">
                  Resume
                </p>

                <p className="text-xs text-text-secondary">
                  {profile.resume
                    ? "Resume uploaded"
                    : "No resume uploaded"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleComingSoon}
              className="text-sm font-medium text-primary hover:underline"
            >
              {profile.resume
                ? "Update Resume"
                : "Upload Resume"}
            </button>

          </div>

        </div>
      </div>

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
            Profile and resume management will be available
            through the Settings section in a future update.
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

export default CandidateProfileCard;