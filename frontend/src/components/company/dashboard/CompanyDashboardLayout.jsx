import { useState } from "react";

import DashboardSidebar from "./DashboardSidebar";

function CompanyDashboardLayout({ children, companyProfile }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <DashboardSidebar />
      </div>

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-surface px-4 lg:hidden">
        <div>
          <h1 className="text-xl font-bold text-primary">HireFlow</h1>

          <p className="text-xs text-text-secondary">Company Portal</p>
        </div>

        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Open menu"
          className="rounded-lg p-2 text-text-secondary transition hover:bg-background"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
            />
          </svg>
        </button>
      </header>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setIsSidebarOpen(false)}
            className="absolute inset-0 bg-black/40"
          />

          {/* Drawer */}
          <div className="absolute left-0 top-0 h-full w-72 bg-surface shadow-xl">
            <div className="flex h-full flex-col">
              {/* Mobile Brand */}
              <div className="flex items-center justify-between border-b border-border p-6">
                <div>
                  <h1 className="text-2xl font-bold text-primary">HireFlow</h1>

                  <p className="mt-1 text-sm text-text-secondary">
                    Company Portal
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(false)}
                  aria-label="Close menu"
                  className="rounded-lg p-2 text-text-secondary transition hover:bg-background"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Mobile Navigation */}
              <div className="flex-1 p-4">
                <DashboardSidebar
                  onNavigate={() => setIsSidebarOpen(false)}
                  mobile
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="min-h-screen lg:ml-72">
        {/* Desktop Top Header */}
        <header className="sticky top-0 z-40 hidden h-[92px] items-center justify-between border-b border-border bg-surface px-8 lg:flex">
          <div>
            <h2 className="text-lg font-semibold text-text">
              Company Dashboard
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Manage your recruitment activities
            </p>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Notification */}
            <button
              type="button"
              aria-label="Notifications"
              className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary transition hover:bg-background"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9a6 6 0 00-12 0v.75a8.967 8.967 0 01-2.31 6.022c1.71.614 3.524 1.072 5.454 1.31m5.713 0a24.255 24.255 0 01-5.713 0m5.713 0a3 3 0 11-5.713 0"
                />
              </svg>

              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-error" />
            </button>

            {/* Company Account */}
            <button
              type="button"
              className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-2 transition hover:bg-background"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                {(companyProfile?.company_name || "Company")
                  .trim()
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="text-left">
                <p className="text-sm font-semibold text-text">
                  {companyProfile?.company_name || "Company"}
                </p>

                <p className="text-xs text-text-secondary">Company Account</p>
              </div>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-4 w-4 text-text-secondary"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 9l6 6 6-6"
                />
              </svg>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <section className="px-5 py-7 sm:px-8 sm:py-8">
          <div className="mx-auto w-full max-w-[1500px]">{children}</div>
        </section>
      </main>
    </div>
  );
}

export default CompanyDashboardLayout;
