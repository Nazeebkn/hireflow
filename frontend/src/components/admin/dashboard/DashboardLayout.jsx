import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import DashboardStats from "./DashboardStats";
import DashboardNavbar from "./DashboardNavbar";

import PendingCompaniesTable from "./PendingCompaniesTable";
import CompanyActivity from "./CompanyActivity";

import RecentCandidatesTable from "./RecentCandidatesTable";
import CandidateActivity from "./CandidateActivity";
function DashboardLayout() {
  return (
    <div className="h-screen bg-background flex overflow-hidden">

      <DashboardSidebar />

      <main className="ml-72 flex-1 overflow-y-auto">

  <DashboardNavbar />

  <div className="p-8">

    <DashboardHeader />

    <DashboardStats />

    {/* Company Section */}

    <div className="grid grid-cols-12 gap-6 mt-8">

      <div className="col-span-8">
        <PendingCompaniesTable />
      </div>

      <div className="col-span-4">
        <CompanyActivity />
      </div>

    </div>

    {/* Candidate Section */}

    <div className="grid grid-cols-12 gap-6 mt-8">

      <div className="col-span-8">
        <RecentCandidatesTable />
      </div>

      <div className="col-span-4">
        <CandidateActivity />
      </div>

    </div>

  </div>

</main>

    </div>
  );
}

export default DashboardLayout;