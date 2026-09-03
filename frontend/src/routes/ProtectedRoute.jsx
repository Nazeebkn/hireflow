import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ allowedRole }) {
  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user"));

  const accessToken =
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken");

  if (!accessToken || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    if (user.role === "ADMIN") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (user.role === "COMPANY") {
      if (!user.profile_completed) {
        return (
          <Navigate
            to="/company/profile-completion"
            replace
          />
        );
      }

      if (user.approval_status === "PENDING") {
        return (
          <Navigate
            to="/company/pending-approval"
            replace
          />
        );
      }

      if (user.approval_status === "REJECTED") {
        return (
          <Navigate
            to="/company/rejected"
            replace
          />
        );
      }

      return <Navigate to="/company/dashboard" replace />;
    }

    if (user.role === "CANDIDATE") {
      if (!user.profile_completed) {
        return (
          <Navigate
            to="/candidate/profile-completion"
            replace
          />
        );
      }

      return (
        <Navigate
          to="/candidate/dashboard"
          replace
        />
      );
    }

    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;