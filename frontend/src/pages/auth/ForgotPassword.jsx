import { useState } from "react";
import { Link } from "react-router-dom";

import LoginCard from "../../components/auth/LoginCard";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">

      <LoginCard showHeader={false}>

        {/* Logo */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-primary">
            HireFlow
          </h1>
        </div>

        {/* Heading */}
        <div className="mb-8 text-center">

          <h2 className="text-3xl font-bold text-text-primary">
            Forgot Password?
          </h2>

          <p className="mt-3 text-text-secondary">
            Enter your registered email address and we'll send you
            a password reset link.
          </p>

        </div>

        {/* Form */}
        <form className="space-y-5">

          <AuthInput
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <AuthButton type="submit">
            Send Reset Link
          </AuthButton>

        </form>

        {/* Back */}
        <div className="mt-8 text-center">

          <Link
            to="/login"
            className="text-sm font-medium text-primary hover:underline"
          >
            ← Back to Login
          </Link>

        </div>

      </LoginCard>

    </div>
  );
}

export default ForgotPassword;