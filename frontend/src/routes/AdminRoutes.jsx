import { Route } from "react-router-dom";

import Dashboard from "../pages/admin/Dashboard";
import PendingCompanies from "../pages/admin/PendingCompanies";
import PendingCompanyDetails from "../pages/admin/PendingCompanyDetails";
import Companies from "../pages/admin/Companies";
import CompanyDetails from "../pages/admin/CompanyDetails";
import Candidates from "../pages/admin/Candidates";
import CandidateDetails from "../pages/admin/CandidateDetails";

function AdminRoutes() {
  return (
    <>
      <Route
        path="/admin/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/admin/pending-companies"
        element={<PendingCompanies />}
      />

      <Route
        path="/admin/pending-companies/:companyId"
        element={<PendingCompanyDetails />}
      />

      <Route
        path="/admin/companies"
        element={<Companies />}
      />

      <Route
        path="/admin/companies/:companyId"
        element={<CompanyDetails />}
      />

      <Route
        path="/admin/candidates"
        element={<Candidates />}
        />

        <Route
        path="/admin/candidates/:candidateId"
        element={<CandidateDetails />}
        />
    </>
  );
}

export default AdminRoutes;