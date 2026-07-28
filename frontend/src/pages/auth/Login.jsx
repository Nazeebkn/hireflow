import { useState } from "react";
import { Link } from "react-router-dom";

import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";
import AuthButton from "../../components/auth/AuthButton";
import BrandingPanel from "../../components/auth/BrandingPanel";
import LoginCard from "../../components/auth/LoginCard";

import { login } from "../../services/authService";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
    };

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailPattern.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
        const data = await login(email, password);

        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);
        localStorage.setItem("user", JSON.stringify(data.user));

        console.log("Login Successful");

    } catch (error) {
        console.error("Login Failed:", error);

    } finally {
        setLoading(false);
        }
  };

  return(

  
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

    <button
      type="button"
      className="w-full rounded-xl border border-border bg-background py-3 font-medium transition hover:bg-surface"
    >
      Continue with Google
    </button>

    <button
      type="button"
      className="w-full rounded-xl border border-border bg-background py-3 font-medium transition hover:bg-surface"
    >
      Continue with Microsoft
    </button>

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