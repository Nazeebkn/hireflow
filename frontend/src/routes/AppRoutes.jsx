import { Routes, Route } from "react-router-dom";

import LandingPage from "../pages/LandingPage";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import CompanyRoutes from "./CompanyRoutes";
import CandidateRoutes from "./CandidateRoutes";
import AdminRoutes from "./AdminRoutes";
import VerifyEmail from "../pages/auth/VerifyEmail";


function AppRoutes() {
  return (
    <Routes>

      {/* Landing */}
      <Route
        path="/"
        element={<LandingPage />}
      />

      {/* Authentication */}
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password/:uid/:token"
        element={<ResetPassword />}
      />

      <Route
      path="/verify-email/:uid/:token/"
      element={<VerifyEmail />}
    />

      {/* Candidate */}
      {CandidateRoutes()}


      {/* Company */}
      {CompanyRoutes()}


      {/* Admin */}
      {AdminRoutes()}
    </Routes>
  );
}

export default AppRoutes;