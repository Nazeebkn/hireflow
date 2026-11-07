
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { validateEmail } from "../../utils/validation";
import { toast } from "sonner";
import { GoogleLogin } from "@react-oauth/google";

import FullScreenLoader from "../../components/common/FullScreenLoader";

import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";
import AuthButton from "../../components/auth/AuthButton";
import BrandingPanel from "../../components/auth/BrandingPanel";
import LoginCard from "../../components/auth/LoginCard";

import { login, googleLogin } from "../../services/authService";

// Save authentication data consistently
const saveAuthData = (data, rememberMe) => {
  const keys = ["accessToken", "refreshToken", "user"];

  // Clear stale authentication data
  keys.forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });

  // Save new authentication data
  const storage = rememberMe ? localStorage : sessionStorage;

  storage.setItem("accessToken", data.access);
  storage.setItem("refreshToken", data.refresh);
  storage.setItem("user", JSON.stringify(data.user));
};

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    const newErrors = {
      email: validateEmail(email),
      password: "",
    };

    if (!password.trim()) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);

    return !newErrors.email && !newErrors.password;
  };

  const redirectUser = (user) => {
    setRedirecting(true);

    setTimeout(() => {
      if (user.role === "CANDIDATE") {
        if (!user.profile_completed) {
          navigate("/candidate/profile-completion");
        } else {
          navigate("/candidate/dashboard");
        }
      } else if (user.role === "COMPANY") {
        if (!user.profile_completed) {
          navigate("/company/profile-completion");
        } else if (user.approval_status === "PENDING") {
          navigate("/company/pending-approval");
        } else if (user.approval_status === "APPROVED") {
          navigate("/company/dashboard");
        } else if (user.approval_status === "REJECTED") {
          navigate("/company/rejected");
        }
      } else if (user.role === "ADMIN") {
        navigate("/admin/dashboard");
      }
    }, 1000);
  };

  // Normal Email Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const data = await login(email, password);

      console.log("LOGIN USER DATA:", data.user);

      saveAuthData(data, rememberMe);

      toast.success(data.message);

      redirectUser(data.user);
    } catch (error) {
      const responseData = error.response?.data;

      const message =
        responseData?.message ||
        responseData?.detail ||
        responseData?.non_field_errors?.[0] ||
        responseData?.email?.[0] ||
        responseData?.password?.[0] ||
        "Invalid email or password.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (redirecting) {
    return <FullScreenLoader title="Setting up your workspace..." />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <BrandingPanel />

      <LoginCard>
        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthInput
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {errors.email && (
            <p className="text-sm text-red-500 -mt-3">
              {errors.email}
            </p>
          )}

          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {errors.password && (
            <p className="text-sm text-red-500 -mt-3">
              {errors.password}
            </p>
          )}

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-text-secondary">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>

            <Link
              to="/forgot-password"
              className="text-sm font-medium text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <AuthButton type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </AuthButton>

          <div className="relative flex items-center">
            <div className="flex-grow border-t border-border"></div>

            <span className="mx-4 bg-surface px-2 text-sm text-text-secondary">
              OR
            </span>

            <div className="flex-grow border-t border-border"></div>
          </div>

          {/* Google Login */}
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                setLoading(true);

                if (!credentialResponse.credential) {
                  throw new Error("Google credential not received.");
                }

                const data = await googleLogin(
                  credentialResponse.credential
                );

                saveAuthData(data, rememberMe);

                toast.success(data.message);

                redirectUser(data.user);
              } catch (error) {
                const responseData = error.response?.data;

                const message =
                  responseData?.message ||
                  responseData?.detail ||
                  responseData?.non_field_errors?.[0] ||
                  responseData?.token?.[0] ||
                  error.message ||
                  "Google Login Failed.";

                toast.error(message);
              } finally {
                setLoading(false);
              }
            }}
            onError={() => {
              toast.error("Google Login Failed.");
            }}
          />

          <p className="text-center text-sm text-text-secondary">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-primary hover:underline"
            >
              Create Account
            </Link>
          </p>
        </form>
      </LoginCard>
    </div>
  );
}

export default Login;
