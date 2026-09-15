import { Route } from "react-router-dom";

import CompanyProfileCompletion from "../pages/company/CompanyProfileCompletion";
import PendingApproval from "../pages/company/PendingApproval";
import CompanyRejected from "../pages/company/CompanyRejected";
import CompanyDashboard from "../pages/company/CompanyDashboard";
import Jobs from "../pages/company/Jobs";
import JobDetails from "../pages/company/JobDetails";
import JobEdit from "../pages/company/JobEdit";
import CompanyApplications from "../pages/company/CompanyApplications";
import JobCandidates from "../pages/company/JobCandidates";

function CompanyRoutes() {
  return (
    <>
      <Route
        path="/company/profile-completion"
        element={<CompanyProfileCompletion />}
      />

      <Route
        path="/company/pending-approval"
        element={<PendingApproval />}
      />

      <Route
        path="/company/rejected"
        element={<CompanyRejected />}
      />

      <Route
        path="/company/dashboard"
        element={<CompanyDashboard />}
      />

      <Route
        path="/company/jobs"
        element={<Jobs />}
      />

      <Route
        path="/company/jobs/:id"
        element={<JobDetails />}
      />


      <Route
        path="/company/jobs/:id/edit"
        element={<JobEdit />}
      />

    <Route
      path="/company/applications"
      element={<CompanyApplications />}
    />

    <Route
      path="/company/jobs/:jobId/candidates"
      element={<JobCandidates />}
    />

    </>
  );
}

export default CompanyRoutes;