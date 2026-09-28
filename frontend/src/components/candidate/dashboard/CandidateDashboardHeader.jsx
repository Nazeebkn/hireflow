import { useEffect, useState } from "react";
import {
  Bell,
  ChevronDown,
} from "lucide-react";

import CandidateNotificationPanel from "../notification/CandidateNotificationPanel";

import {
  getCandidateUnreadNotificationCount,
} from "../../../services/candidate/candidateNotificationService";

function CandidateDashboardHeader({ profile }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const firstName = profile?.first_name || "Candidate";
  const lastName = profile?.last_name || "";

  const fullName = `${firstName} ${lastName}`.trim();

  const getInitial = () => {
    return firstName.charAt(0).toUpperCase() || "C";
  };

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const data =
          await getCandidateUnreadNotificationCount();

        setUnreadCount(data?.unread_count || 0);
      } catch (error) {
        console.error(
          "Failed to fetch unread notification count:",
          error
        );
      }
    };

    fetchUnreadCount();
  }, []);

  const handleNotificationClose = () => {
    setShowNotifications(false);
  };

  const handleUnreadCountChange = (change) => {
    setUnreadCount((prev) =>
      Math.max(0, prev + change)
    );
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
        <div className="relative">

          <button
            type="button"
            onClick={() =>
              setShowNotifications((prev) => !prev)
            }
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary transition hover:bg-background hover:text-text"
          >
            <Bell size={20} />

            {/* Unread Badge */}
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                {unreadCount > 99
                  ? "99+"
                  : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Panel */}
          {showNotifications && (
            <CandidateNotificationPanel
              onClose={handleNotificationClose}
              onUnreadCountChange={handleUnreadCountChange}
            />
          )}

        </div>

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