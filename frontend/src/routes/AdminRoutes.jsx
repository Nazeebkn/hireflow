import { Route } from "react-router-dom";

import Dashboard from "../pages/admin/Dashboard";

function AdminRoutes() {
  return (
    <>
      <Route
        path="/admin/dashboard"
        element={<Dashboard />}
      />
    </>
  );
}

export default AdminRoutes;