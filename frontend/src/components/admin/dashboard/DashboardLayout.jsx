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
    <div className="flex h-screen overflow-hidden bg-background">

      {/* ================================================= */}
      {/* SIDEBAR */}
      {/* ================================================= */}

      <DashboardSidebar />

      {/* ================================================= */}
      {/* MAIN CONTENT */}
      {/* ================================================= */}

      <main className="ml-72 flex-1 overflow-y-auto">

        {/* ================================================= */}
        {/* NAVBAR */}
        {/* ================================================= */}

        <DashboardNavbar />

        {/* ================================================= */}
        {/* DASHBOARD CONTENT */}
        {/* ================================================= */}

        <div className="px-6 pb-10">

          {/* Dashboard Header */}

          <DashboardHeader />

          {/* Dashboard Stats */}

          <DashboardStats />

          {/* ================================================= */}
          {/* MAIN DASHBOARD COLUMNS */}
          {/* ================================================= */}

          <div className="mt-8 grid grid-cols-12 items-start gap-6">

            {/* ================================================= */}
            {/* LEFT COLUMN */}
            {/* ================================================= */}

            <div className="col-span-8 space-y-6">

              {/* Pending Companies */}

              <PendingCompaniesTable />

              {/* Recent Candidates */}

              <RecentCandidatesTable />

            </div>

            {/* ================================================= */}
            {/* RIGHT COLUMN */}
            {/* ================================================= */}

            <div className="col-span-4 space-y-6">

              {/* Company Activity */}

              <CompanyActivity />

              {/* Candidate Activity */}

              <CandidateActivity />

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default DashboardLayout;