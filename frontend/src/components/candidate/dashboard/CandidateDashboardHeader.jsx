import {
  Bell,
  ChevronDown,
  UserRound,
} from "lucide-react";

function CandidateDashboardHeader({ profile }) {
  const firstName = profile?.first_name || "Candidate";
  const lastName = profile?.last_name || "";

  const fullName = `${firstName} ${lastName}`.trim();

  const getInitial = () => {
    return firstName.charAt(0).toUpperCase() || "C";
  };

  return (
    <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-border bg-surface px-6 lg:px-8">

      {/* Page Context */}
      <div>
        <h2 className="text-lg font-semibold text-text">
          Candidate Dashboard
        </h2>

        <p className="mt-0.5 text-sm text-text-secondary">
          Manage your career and job search activities
        </p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">

        {/* Notification */}
        <button
          type="button"
          className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary transition hover:bg-background hover:text-text"
        >
          <Bell size={20} />

          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* Profile */}
        <button
          type="button"
          className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-2 transition hover:bg-background"
        >
          {/* Avatar */}
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-semibold text-white">

            {profile?.profile_picture ? (
              <img
                src={profile.profile_picture}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              getInitial()
            )}

          </div>

          {/* Name */}
          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold text-text">
              {fullName}
            </p>

            <p className="text-xs text-text-secondary">
              Candidate Account
            </p>
          </div>

          <ChevronDown
            size={17}
            className="hidden text-text-secondary sm:block"
          />
        </button>

      </div>

    </header>
  );
}

export default CandidateDashboardHeader;