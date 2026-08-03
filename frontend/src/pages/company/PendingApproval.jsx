import ProfileCompletionNavbar from "../../components/candidate/profile-completion/ProfileCompletionNavbar";
import ProfileCompletionFooter from "../../components/candidate/profile-completion/ProfileCompletionFooter";

import PendingApprovalCard from "../../components/company/pending/PendingApprovalCard";

function PendingApproval() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ProfileCompletionNavbar />

      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <PendingApprovalCard />
      </main>

      <ProfileCompletionFooter />
    </div>
  );
}

export default PendingApproval;