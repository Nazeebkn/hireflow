import { Route } from "react-router-dom";

import ProfileCompletion from "../pages/candidate/ProfileCompletion";

function CandidateRoutes() {
  return (
    <Route path="/candidate">
      <Route
        path="profile-completion"
        element={<ProfileCompletion />}
      />
    </Route>
  );
}

export default CandidateRoutes;