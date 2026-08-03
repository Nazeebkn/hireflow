import { Routes, Route } from "react-router-dom";

import LandingPage from "../pages/LandingPage";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import CompanyRoutes from "./CompanyRoutes";
import CandidateRoutes from "./CandidateRoutes";

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

      {/* Candidate */}
      {CandidateRoutes()}


      {/* Company */}
      {CompanyRoutes()}
    </Routes>
  );
}

export default AppRoutes;