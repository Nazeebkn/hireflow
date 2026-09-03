import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { GoogleLogin } from "@react-oauth/google";

import {
  UserRound,
  Building2,
} from "lucide-react";

import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "../../utils/validation";

import BrandingPanel from "../../components/auth/BrandingPanel";
import LoginCard from "../../components/auth/LoginCard";
import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";
import AuthButton from "../../components/auth/AuthButton";

import {
  signup,
  googleSignup,
} from "../../services/authService";


function Signup() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CANDIDATE");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [accountCreated, setAccountCreated] = useState(false);

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });


  const validateForm = () => {

    const newErrors = {
      email: validateEmail(email),

      password: validatePassword(password),

      confirmPassword: validateConfirmPassword(
        password,
        confirmPassword
      ),
    };

    setErrors(newErrors);

    return (
      !newErrors.email &&
      !newErrors.password &&
      !newErrors.confirmPassword
    );
  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {

      await signup(
        email,
        password,
        role
      );

      toast.success(
        "Account created successfully. Please check your email and click the verification link."
      );

      setAccountCreated(true);

    } catch (error) {

  const data = error.response?.data;

  const message =
    data?.message ||
    data?.email?.[0] ||
    data?.password?.[0] ||
    data?.role?.[0] ||
    "Something went wrong.";

  toast.error(message);

}finally {

      setLoading(false);

    }
  };


  return (

    <div className="min-h-screen grid lg:grid-cols-2 bg-white">

      <BrandingPanel
        title="Join HireFlow"
        subtitle="Build your future with AI-powered recruitment."
      />


      <div className="flex items-center justify-center px-10 py-8 bg-white">

        <LoginCard
          title="Create Your Account"
          subtitle="Choose how you'll use HireFlow."
        >

          {accountCreated ? (

            /* ============================= */
            /* EMAIL VERIFICATION SUCCESS */
            /* ============================= */

            <div className="text-center">

              <div className="flex justify-center mb-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">

                  <span className="text-2xl">
                    ✓
                  </span>

                </div>

              </div>


              <h2 className="text-xl font-semibold text-gray-900">
                Check Your Email
              </h2>


              <p className="mt-2 text-sm text-gray-600">
                Your account has been created successfully.
                Please check your email and click the
                verification link to verify your account.
              </p>


              <p className="mt-3 text-sm font-medium text-gray-800">
                {email}
              </p>


              <button
                type="button"
                onClick={() => navigate("/login")}
                className="mt-6 w-full rounded-lg bg-primary px-4 py-3 font-medium text-white transition hover:opacity-90"
              >
                Go to Login
              </button>

            </div>

          ) : (

            /* ============================= */
            /* SIGNUP FORM */
            /* ============================= */

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* Account Type */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Account Type
                </label>


                <div className="grid grid-cols-2 gap-3">

                  {/* Candidate */}

                  <button
                    type="button"
                    onClick={() => setRole("CANDIDATE")}
                    className={`group cursor-pointer rounded-xl border p-3 transition-all duration-300 ${
                      role === "CANDIDATE"
                        ? "border-primary bg-primary/10 ring-2 ring-primary/20 shadow-md scale-[1.02]"
                        : "border-gray-300 hover:border-primary hover:bg-primary/5 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]"
                    }`}
                  >

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">

                        <UserRound
                          size={20}
                          className="text-primary"
                        />

                      </div>


                      <div className="text-left">

                        <h3 className="font-semibold transition-colors duration-300 group-hover:text-primary">
                          Candidate
                        </h3>

                        <p className="text-xs text-gray-500">
                          Find jobs & AI interviews
                        </p>

                      </div>

                    </div>

                  </button>


                  {/* Company */}

                  <button
                    type="button"
                    onClick={() => setRole("COMPANY")}
                    className={`group cursor-pointer rounded-xl border p-3 transition-all duration-300 ${
                      role === "COMPANY"
                        ? "border-primary bg-primary/10 ring-2 ring-primary/20 shadow-md scale-[1.02]"
                        : "border-gray-300 hover:border-primary hover:bg-primary/5 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]"
                    }`}
                  >

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">

                        <Building2
                          size={20}
                          className="text-primary"
                        />

                      </div>


                      <div className="text-left">

                        <h3 className="font-semibold transition-colors duration-300 group-hover:text-primary">
                          Company
                        </h3>

                        <p className="text-xs text-gray-500">
                          Hire top talent
                        </p>

                      </div>

                    </div>

                  </button>

                </div>

              </div>


              {/* Google Signup */}

              <GoogleLogin
                onSuccess={async (credentialResponse) => {

                  try {

                    setLoading(true);

                    const data = await googleSignup(
                      credentialResponse.credential,
                      role
                    );

                    toast.success(data.message);

                    setTimeout(() => {
                      navigate("/login");
                    }, 1000);


                    } catch (error) {
  const data = error.response?.data;

  const message =
    data?.message ||
    data?.detail ||
    data?.non_field_errors?.[0] ||
    data?.token?.[0] ||
    data?.role?.[0] ||
    "Google Signup Failed.";

  toast.error(message);


                  } finally {

                    setLoading(false);

                  }

                }}

                onError={() => {
                  toast.error("Google Signup Failed.");
                }}
              />


              {/* Divider */}

              <div className="flex items-center gap-3">

                <div className="h-px flex-1 bg-gray-200"></div>

                <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  OR
                </span>

                <div className="h-px flex-1 bg-gray-200"></div>

              </div>


              {/* Email */}

              <AuthInput
                label="Email"
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


              {/* Password */}

              <PasswordInput
                label="Password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />


              {errors.password && (

                <p className="text-sm text-red-500 -mt-3">
                  {errors.password}
                </p>

              )}


              {/* Confirm Password */}

              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />


              {errors.confirmPassword && (

                <p className="text-sm text-red-500 -mt-3">
                  {errors.confirmPassword}
                </p>

              )}


              {/* Create Account */}

              <AuthButton
                type="submit"
                disabled={loading}
              >

                {loading
                  ? "Creating Account..."
                  : role === "CANDIDATE"
                    ? "Create Candidate Account"
                    : "Create Company Account"
                }

              </AuthButton>


              {/* Login */}

              <p className="text-center text-sm text-gray-600">

                Already have a HireFlow account?{" "}

                <Link
                  to="/login"
                  className="font-semibold text-primary transition-colors duration-200 hover:text-primary/80"
                >
                  Login
                </Link>

              </p>

            </form>

          )}

        </LoginCard>

      </div>

    </div>
  );
}


export default Signup;