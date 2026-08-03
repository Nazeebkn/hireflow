import ProfileCompletionNavbar from "../../components/candidate/profile-completion/ProfileCompletionNavbar";
import ProfileCompletionFooter from "../../components/candidate/profile-completion/ProfileCompletionFooter";
import CompanyProfileCard from "../../components/company/profile/CompanyProfileCard";

function CompanyProfileCompletion() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ProfileCompletionNavbar />

      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <CompanyProfileCard />
      </main>

      <ProfileCompletionFooter />
    </div>
  );
}

export default CompanyProfileCompletion;