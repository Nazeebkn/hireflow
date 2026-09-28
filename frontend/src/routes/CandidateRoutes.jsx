import { Route } from "react-router-dom";

import ProfileCompletion from "../pages/candidate/ProfileCompletion";
import CandidateDashboard from "../pages/candidate/CandidateDashboard";
import Jobs from "../pages/candidate/Jobs";
import CandidateJobDetails from "../pages/candidate/CandidateJobDetails";
import MyApplications from "../pages/candidate/MyApplications";
import CandidateApplicationDetail from "../pages/candidate/CandidateApplicationDetail";
import CandidateProfile from "../pages/candidate/CandidateProfile";
import CandidateSettings from "../pages/candidate/settings/CandidateSettings";
import AIInterviewPage from "../pages/candidate/ai-interview/AIInterviewPage";
import AIInterviewSession from "../pages/candidate/ai-interview/AIInterviewSession";

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

      <Route
        path="profile"
        element={<CandidateProfile />}
      />

      <Route
        path="settings"
        element={<CandidateSettings />}
      />

      <Route
        path="interviews/:interviewId"
        element={<AIInterviewPage />}
      />

      <Route
    path="interviews/:interviewId/session"
    element={<AIInterviewSession />}
/>
    </Route>
  );
}


export default CandidateRoutes;