import { Route } from "react-router-dom";

import CompanyProfileCompletion from "../pages/company/CompanyProfileCompletion";
import PendingApproval from "../pages/company/PendingApproval";


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
    </>
  );
}

export default CompanyRoutes;