function ApprovalStatusBadge({ status }) {
  const normalizedStatus = (status || "").toUpperCase();

  const statusStyles = {
    APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
  };

  const statusLabels = {
    APPROVED: "Approved",
    PENDING: "Pending Approval",
    REJECTED: "Rejected",
  };

  const styles =
    statusStyles[normalizedStatus] ||
    "bg-slate-100 text-slate-600 border-slate-200";

  const label =
    statusLabels[normalizedStatus] || status || "Unknown";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${styles}`}
    >
      <span className="h-2 w-2 rounded-full bg-current" />
      {label}
    </span>
  );
}


function getInitials(name) {
  if (!name) {
    return "C";
  }

  const words = name.trim().split(/\s+/);

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}


function DashboardHeader({ companyProfile, loading }) {
  const companyName =
    companyProfile?.company_name ||
    companyProfile?.name ||
    "Your Company";

  const approvalStatus =
    companyProfile?.approval_status ||
    companyProfile?.status ||
    "APPROVED";

  return (
    <div className="mb-8">

      {/* Page Heading */}
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">

        <div>

          {/* Section Label */}
          <div className="mb-3 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5">
            <span className="text-sm font-medium text-primary">
              Company Dashboard
            </span>
          </div>


          {/* Title */}
          <h1 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Dashboard
          </h1>


          {/* Description */}
          <p className="mt-2 max-w-2xl text-base text-text-secondary">
            Manage your jobs, candidates, and recruitment activities
            from one place.
          </p>

        </div>


        {/* Company Information */}
        <div className="flex items-center gap-3">

          {/* Company Avatar */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-base font-semibold text-white">
            {loading ? "" : getInitials(companyName)}
          </div>


          {/* Company Name */}
          <div className="min-w-0">

            {loading ? (
              <>
                <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />

                <div className="mt-2 h-4 w-24 animate-pulse rounded bg-slate-100" />
              </>
            ) : (
              <>
                <p className="truncate text-base font-semibold text-text">
                  {companyName}
                </p>

                <p className="mt-0.5 text-sm text-text-secondary">
                  Company Account
                </p>
              </>
            )}

          </div>


          {/* Approval Status */}
          {!loading && (
            <ApprovalStatusBadge status={approvalStatus} />
          )}

        </div>

      </div>

    </div>
  );
}

export default DashboardHeader;