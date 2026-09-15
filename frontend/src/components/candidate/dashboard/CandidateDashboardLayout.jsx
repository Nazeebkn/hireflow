import CandidateDashboardHeader from "./CandidateDashboardHeader";
import CandidateDashboardSidebar from "./CandidateDashboardSidebar";

function CandidateDashboardLayout({ children, profile }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">

      {/* Sidebar */}
      <CandidateDashboardSidebar />

      {/* Main Area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

        {/* Header */}
        <CandidateDashboardHeader profile={profile} />

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-background p-5 lg:p-7">
          <div className="mx-auto w-full max-w-[1600px]">
            {children}
          </div>
        </main>

      </div>

    </div>
  );
}

export default CandidateDashboardLayout;