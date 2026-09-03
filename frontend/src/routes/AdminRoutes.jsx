import { Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import Dashboard from "../pages/admin/Dashboard";
import PendingCompanies from "../pages/admin/PendingCompanies";
import PendingCompanyDetails from "../pages/admin/PendingCompanyDetails";
import Companies from "../pages/admin/Companies";
import CompanyDetails from "../pages/admin/CompanyDetails";
import Candidates from "../pages/admin/Candidates";
import CandidateDetails from "../pages/admin/CandidateDetails";

function AdminRoutes() {
  return (
    <Route
      path="/admin"
      element={
        <ProtectedRoute allowedRole="ADMIN" />
      }
    >
      <Route
        path="dashboard"
        element={<Dashboard />}
      />

      <Route
        path="pending-companies"
        element={<PendingCompanies />}
      />

      <Route
        path="pending-companies/:companyId"
        element={<PendingCompanyDetails />}
      />

      <Route
        path="companies"
        element={<Companies />}
      />

      <Route
        path="companies/:companyId"
        element={<CompanyDetails />}
      />

      <Route
        path="candidates"
        element={<Candidates />}
      />

      <Route
        path="candidates/:candidateId"
        element={<CandidateDetails />}
      />
    </Route>
  );
}

export default AdminRoutes;