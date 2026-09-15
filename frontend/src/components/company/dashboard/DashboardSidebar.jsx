import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  Users,
  Building2,
  LogOut,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { logout } from "../../../services/api";

const sidebarItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/company/dashboard",
  },
  {
    label: "Jobs",
    icon: BriefcaseBusiness,
    path: "/company/jobs",
  },
  {
    label: "Applications  ",
    icon: Users,
    path: "/company/applications",
  },
  {
    label: "Company Profile",
    icon: Building2,
    path: "/company/profile",
  },
];

function DashboardSidebar({ onNavigate }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleCancelLogout = () => {
    if (isLoggingOut) return;

    setShowLogoutModal(false);
  };

  const handleConfirmLogout = () => {
    setIsLoggingOut(true);

    setTimeout(() => {
      logout();
    }, 2000);
  };

  return (
    <>
      <aside className="fixed left-0 top-0 flex h-screen w-72 flex-col border-r border-border bg-surface">

        {/* Brand */}
        <div className="border-b border-border p-6">
          <h1 className="text-2xl font-bold text-primary">
            HireFlow
          </h1>

          <p className="mt-1 text-sm text-text-secondary">
            Company Portal
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-4">

          {sidebarItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-text-secondary hover:bg-background"
                  }`
                }
              >
                <Icon size={20} />

                <span className="font-medium">
                  {item.label}
                </span>
              </NavLink>
            );
          })}

        </nav>

        {/* Logout */}
        <div className="border-t border-border p-4">
          <button
            type="button"
            onClick={handleLogoutClick}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-text-secondary transition hover:bg-background hover:text-text"
          >
            <LogOut size={20} />

            <span className="font-medium">
              Logout
            </span>
          </button>
        </div>

      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-start justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <AlertCircle size={22} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-text">
                    Logout
                  </h2>

                  <p className="mt-0.5 text-sm text-text-secondary">
                    Confirm your logout
                  </p>
                </div>

              </div>

              {!isLoggingOut && (
                <button
                  type="button"
                  onClick={handleCancelLogout}
                  className="rounded-lg p-1.5 text-text-secondary transition hover:bg-background hover:text-text"
                >
                  <X size={20} />
                </button>
              )}

            </div>

            {/* Content */}
            {!isLoggingOut ? (
              <>
                <p className="mt-5 text-sm leading-6 text-text-secondary">
                  Are you sure you want to logout from your HireFlow
                  company account?
                </p>

                {/* Actions */}
                <div className="mt-6 flex justify-end gap-3">

                  <button
                    type="button"
                    onClick={handleCancelLogout}
                    className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-text transition hover:bg-background"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmLogout}
                    className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
                  >
                    Logout
                  </button>

                </div>
              </>
            ) : (
              /* Loading */
              <div className="flex flex-col items-center justify-center py-8">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Loader2
                    size={28}
                    className="animate-spin"
                  />
                </div>

                <h3 className="mt-4 text-base font-semibold text-text">
                  Logging out...
                </h3>

                <p className="mt-1 text-sm text-text-secondary">
                  Please wait a moment.
                </p>

              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}

export default DashboardSidebar;