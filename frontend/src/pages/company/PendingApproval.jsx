import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import ProfileCompletionNavbar from "../../components/candidate/profile-completion/ProfileCompletionNavbar";
import ProfileCompletionFooter from "../../components/candidate/profile-completion/ProfileCompletionFooter";
import PendingApprovalCard from "../../components/company/pending/PendingApprovalCard";

import { getCompanyProfile } from "../../services/company/companyService";

function PendingApproval() {
  const navigate = useNavigate();

  useEffect(() => {
    let interval;

    const checkApprovalStatus = async () => {
      try {
        const company = await getCompanyProfile();

        console.log(
          "Company Approval Status:",
          company.approval_status
        );

        if (company.approval_status === "APPROVED") {
          clearInterval(interval);

          toast.success(
            "Your company has been approved successfully."
          );

          navigate("/company/dashboard");
        }

        if (company.approval_status === "REJECTED") {
  clearInterval(interval);

  toast.error(
    "Your company registration has been rejected."
  );

  navigate("/company/rejected");
}
      } catch (error) {
        console.error(
          "Failed to check company approval status:",
          error
        );
      }
    };

    // Check immediately
    checkApprovalStatus();

    // Check every 3 seconds
    interval = setInterval(
      checkApprovalStatus,
      3000
    );

    return () => {
      clearInterval(interval);
    };
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col bg-background">

      <ProfileCompletionNavbar />

      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <PendingApprovalCard />
      </main>

      <ProfileCompletionFooter />

    </div>
  );
}

export default PendingApproval;