import { Route } from "react-router-dom";

import ProfileCompletion from "../pages/candidate/ProfileCompletion";
import CandidateDashboard from "../pages/candidate/CandidateDashboard";
import Jobs from "../pages/candidate/Jobs";
import CandidateJobDetails from "../pages/candidate/CandidateJobDetails";
import MyApplications from "../pages/candidate/MyApplications";
import CandidateApplicationDetail from "../pages/candidate/CandidateApplicationDetail";

function CandidateRoutes() {
  return (
    <Route path="/candidate">

      <Route
        path="profile-completion"
        element={<ProfileCompletion />}
      />

      <Route
        path="dashboard"
        element={<CandidateDashboard />}
      />

      <Route
        path="jobs"
        element={<Jobs />}
      />

      <Route
        path="jobs/:jobId"
        element={<CandidateJobDetails />}
      />

      <Route
        path="applications"
        element={<MyApplications />}
      />

      <Route
        path="applications/:applicationId"
        element={<CandidateApplicationDetail />}
      />

    </Route>
  );
}


export default CandidateRoutes;