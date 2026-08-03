function PendingApprovalHeader() {
  return (
    <div className="border-b border-border pb-6">
      <h1 className="text-3xl font-bold text-text-primary">
        Company Profile Submitted
      </h1>

      <p className="mt-3 text-text-secondary">
        Your company profile has been submitted successfully.
        Our team is reviewing your company information before
        granting access to your workspace.
      </p>
    </div>
  );
}

export default PendingApprovalHeader;