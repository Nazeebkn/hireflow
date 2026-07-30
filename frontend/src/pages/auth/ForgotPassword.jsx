import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import LoginCard from "../../components/auth/LoginCard";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";
import { forgotPassword } from "../../services/authService";
import { validateEmail } from "../../utils/validation";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
  });

  const validateForm = () => {
    const newErrors = {
      email: validateEmail(email),
    };

    setErrors(newErrors);

    return !newErrors.email;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const data = await forgotPassword(email);

      toast.success(data.message);

   } catch (error) {
  console.log("Status:", error.response?.status);
  console.log("Data:", error.response?.data);

  toast.error(
    error.response?.data?.message || "Something went wrong."
  );
}
  }

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
        <form onSubmit={handleSubmit} className="space-y-5">

          <AuthInput
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);

              if (errors.email) {
                setErrors((prev) => ({
                  ...prev,
                  email: "",
                }));
              }
            }}
          />


          {errors.email && (
            <p className="text-sm text-red-500 -mt-3">
              {errors.email}
            </p>
          )}

          
          <AuthButton type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
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