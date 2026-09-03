import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

import ProfileCompletionNavbar from "../../components/candidate/profile-completion/ProfileCompletionNavbar";
import ProfileCompletionFooter from "../../components/candidate/profile-completion/ProfileCompletionFooter";
import { getCompanyProfile } from "../../services/company/companyService";

function CompanyRejected() {
  const navigate = useNavigate();

  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const company = await getCompanyProfile();

        if (company.approval_status !== "REJECTED") {
          navigate("/company/pending-approval");
          return;
        }

        setRejectionReason(
          company.rejection_reason || "No rejection reason was provided."
        );
      } catch (error) {
        console.error("Failed to fetch company status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">

      <ProfileCompletionNavbar />

      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-2xl">

          <div className="rounded-2xl border border-red-200 bg-surface p-8 shadow-sm">

            <div className="flex items-center gap-4">

              <div className="rounded-full bg-red-100 p-3">
                <AlertCircle
                  size={28}
                  className="text-red-600"
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-text-primary">
                  Company Registration Rejected
                </h1>

                <p className="mt-1 text-sm text-text-secondary">
                  Your company registration could not be approved.
                </p>
              </div>

            </div>

            <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5">

              <p className="text-sm font-semibold text-red-700">
                Reason for Rejection
              </p>

              <p className="mt-2 leading-7 text-red-700">
                {rejectionReason}
              </p>

            </div>

            <button
              onClick={() =>
                navigate("/company/profile-completion")
              }
              className="mt-6 w-full rounded-lg bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary/90"
            >
              Update Profile & Resubmit
            </button>

          </div>

        </div>
      </main>

      <ProfileCompletionFooter />

    </div>
  );
}

export default CompanyRejected;