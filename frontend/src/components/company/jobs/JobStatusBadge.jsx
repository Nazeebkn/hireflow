function JobStatusBadge({ status }) {
  const normalizedStatus = (status || "").toUpperCase();

  const statusStyles = {
    DRAFT: {
      label: "Draft",
      className:
        "border-amber-200 bg-amber-50 text-amber-700",
    },

    PUBLISHED: {
      label: "Published",
      className:
        "border-emerald-200 bg-emerald-50 text-emerald-700",
    },

    CLOSED: {
      label: "Closed",
      className:
        "border-rose-200 bg-rose-50 text-rose-700",
    },
  };

  const currentStatus = statusStyles[normalizedStatus];

  const label =
    currentStatus?.label ||
    status ||
    "Unknown";

  const className =
    currentStatus?.className ||
    "border-border bg-background text-text-secondary";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

export default JobStatusBadge;