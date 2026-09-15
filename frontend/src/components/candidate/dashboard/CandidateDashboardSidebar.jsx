import { useState } from "react";
import {
  LayoutDashboard,
  Search,
  FileText,
  UserRound,
  Settings,
  Upload,
  LogOut,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { logout } from "../../../services/api";

function CandidateDashboardSidebar() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menuItems = [
    {
      label: "Dashboard",
      path: "/candidate/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Search Jobs",
      path: "/candidate/jobs",
      icon: Search,
    },
    {
      label: "My Applications",
      path: "/candidate/applications",
      icon: FileText,
    },
    {
      label: "Profile",
      path: "/candidate/profile",
      icon: UserRound,
    },
    {
      label: "Settings",
      path: "/candidate/settings",
      icon: Settings,
    },
  ];

  const currentPath = window.location.pathname;

  const handleNavigation = (path) => {
    window.location.href = path;
  };

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
      <aside className="flex h-screen w-[250px] shrink-0 flex-col border-r border-border bg-surface">

        {/* Logo */}
        <div className="border-b border-border px-7 py-6">
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            HireFlow
          </h1>

          <p className="mt-1 text-sm text-text-secondary">
            Candidate Portal
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-5">
          <div className="space-y-1.5">

            {menuItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                currentPath === item.path ||
                (item.path !== "/candidate/dashboard" &&
                  currentPath.startsWith(item.path));

              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleNavigation(item.path)}
                  className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-text-secondary hover:bg-background hover:text-text"
                  }`}
                >
                  <Icon
                    size={19}
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />

                  <span>{item.label}</span>
                </button>
              );
            })}

          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="space-y-2 border-t border-border p-4">

          {/* Upload Resume */}
          {/*
          <button
            type="button"
            onClick={() =>
              (window.location.href = "/candidate/profile-completion")
            }
            className="flex w-full items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10"
          >
            <Upload size={18} />
            <span>Upload Resume</span>
          </button>
          */}

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogoutClick}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-text-secondary transition hover:bg-background hover:text-text"
          >
            <LogOut size={18} />

            <span>Logout</span>
          </button>

        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">

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

            {/* Modal Content */}
            {!isLoggingOut ? (
              <>
                <p className="mt-5 text-sm leading-6 text-text-secondary">
                  Are you sure you want to logout from your HireFlow
                  candidate account?
                </p>

                {/* Modal Actions */}
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
              /* Logout Loading State */
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

export default CandidateDashboardSidebar;