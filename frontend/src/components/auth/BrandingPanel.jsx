function BrandingPanel() {
  return (
    <div className="relative hidden lg:flex w-1/2 flex-col justify-between bg-background px-12 py-10">

      {/* Logo */}
      <div>
        <h1 className="text-3xl font-bold text-primary">
          HireFlow
        </h1>
      </div>

      {/* Content */}
      <div className="max-w-md">
        <h2 className="text-4xl font-bold leading-tight text-text-primary">
          Hire Smarter with AI
        </h2>

        <p className="mt-4 text-lg text-text-secondary">
          Streamline recruitment with AI-powered resume screening,
          intelligent interviews, and smart hiring decisions.
        </p>

        {/* Dashboard Preview */}
        <div className="mt-10 rounded-2xl border border-border bg-surface p-6 shadow-lg">

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-text-primary">
                Hiring Dashboard
              </h3>

              <p className="text-sm text-text-secondary">
                Live recruitment overview
              </p>
            </div>

            <div className="rounded-xl bg-[#EEF4FF] px-4 py-2">
              <span className="text-xl font-bold text-primary">
                24
              </span>

              <p className="text-xs text-text-secondary">
                Active Jobs
              </p>
            </div>
          </div>

          <div className="space-y-4">

            <div className="rounded-xl bg-[#F8FAFC] p-4">
              <p className="text-sm text-text-secondary">
                Resume Match Score
              </p>

              <h4 className="mt-2 text-3xl font-bold text-primary">
                85%
              </h4>
            </div>

            <div className="grid grid-cols-3 gap-3">

              <div className="rounded-xl bg-[#EEF4FF] p-3 text-center">
                <p className="text-xl font-bold text-primary">
                  1240
                </p>

                <span className="text-xs text-text-secondary">
                  Applied
                </span>
              </div>

              <div className="rounded-xl bg-background p-3 text-center">
                <p className="text-xl font-bold text-primary">
                  450
                </p>

                <span className="text-xs text-text-secondary">
                  Screened
                </span>
              </div>

              <div className="rounded-xl bg-background p-3 text-center">
                <p className="text-xl font-bold text-primary">
                  12
                </p>

                <span className="text-xs text-text-secondary">
                  Interviews
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Footer */}
      <p className="text-sm text-text-secondary">
        © 2026 HireFlow. All rights reserved.
      </p>

    </div>
  );
}

export default BrandingPanel;