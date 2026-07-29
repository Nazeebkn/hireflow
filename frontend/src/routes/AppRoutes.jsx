import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Signup from "../pages/auth/Signup";
import ResetPassword from "../pages/auth/ResetPassword";


function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reset-password/:uid/:token"element={<ResetPassword />}
/>
    </Routes>
  );
}

export default AppRoutes;