import PendingApprovalHeader from "./PendingApprovalHeader";
import PendingApprovalStatus from "./PendingApprovalStatus";

function PendingApprovalCard() {
  return (
    <div className="w-full max-w-3xl rounded-2xl border border-border bg-surface p-8 shadow-sm">
      <PendingApprovalHeader />

      <PendingApprovalStatus />
    </div>
  );
}

export default PendingApprovalCard;