import CompanyProfileHeader from "./CompanyProfileHeader";
import CompanyProfileForm from "./CompanyProfileForm";

function CompanyProfileCard() {
  return (
    <div className="w-full max-w-5xl rounded-2xl border border-border bg-surface p-8 shadow-sm">
      <CompanyProfileHeader />

      <CompanyProfileForm />
    </div>
  );
}

export default CompanyProfileCard;