import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { resetPassword } from "../../services/authService";

import PasswordInput from "../../components/auth/PasswordInput";
import AuthButton from "../../components/auth/AuthButton";
import LoginCard from "../../components/auth/LoginCard";

import {
  validatePassword,
  validateConfirmPassword,
} from "../../utils/validation";

function ResetPassword() {

  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // 30 minutes = 1800 seconds
  const [timeLeft, setTimeLeft] = useState(30 * 60);

  const [formData, setFormData] = useState({
    new_password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({
    new_password: "",
    confirm_password: "",
  });


  // ================================
  // PASSWORD RESET TIMER
  // ================================

  useEffect(() => {

    if (timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {

      setTimeLeft((previous) => previous - 1);

    }, 1000);

    return () => clearInterval(timer);

  }, [timeLeft]);


  // Convert seconds into MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;


  // ================================
  // FORM VALIDATION
  // ================================

  const validateForm = () => {

    const newErrors = {
      new_password: validatePassword(
        formData.new_password
      ),

      confirm_password: validateConfirmPassword(
        formData.new_password,
        formData.confirm_password
      ),
    };

    setErrors(newErrors);

    return (
      !newErrors.new_password &&
      !newErrors.confirm_password
    );
  };


  // ================================
  // INPUT CHANGE
  // ================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {

      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));

    }
  };


  // ================================
  // SUBMIT
  // ================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    // Stop submission when timer expires
    if (timeLeft <= 0) {

      toast.error(
        "Reset link has expired. Please request a new password reset link."
      );

      return;
    }


    if (!validateForm()) {
      return;
    }


    setLoading(true);

    try {

      const response = await resetPassword(
        uid,
        token,
        formData.new_password,
        formData.confirm_password
      );

      toast.success(response.message);

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {

      const data = error.response?.data;

      const message =
        data?.message ||
        data?.detail ||
        data?.non_field_errors?.[0] ||
        data?.new_password?.[0] ||
        data?.confirm_password?.[0] ||
        data?.uid?.[0] ||
        data?.token?.[0] ||
        "Something went wrong.";

      toast.error(message);

    } finally {

      setLoading(false);

    }
  };


  return (

    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

      <LoginCard>

        <div className="space-y-6">

          {/* ================================
              HEADER
          ================================= */}

          <div className="text-center">

            <h1 className="text-3xl font-bold text-gray-900">
              Reset Password
            </h1>

            <p className="mt-2 text-gray-500">
              Create a new password for your HireFlow account.
            </p>

          </div>


          {/* ================================
              TIMER
          ================================= */}

          <div className="text-center">

            {timeLeft > 0 ? (

              <p className="text-sm text-gray-500">

                Reset link expires in{" "}

                <span className="font-semibold text-red-500">

                  {String(minutes).padStart(2, "0")}:
                  {String(seconds).padStart(2, "0")}

                </span>

              </p>

            ) : (

              <p className="text-sm font-semibold text-red-500">

                Reset link expired.
                Please request a new password reset link.

              </p>

            )}

          </div>


          {/* ================================
              FORM
          ================================= */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* NEW PASSWORD */}

            <PasswordInput
              label="New Password"
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
              placeholder="Enter your new password"
            />

            {errors.new_password && (

              <p className="text-sm text-red-500 -mt-3">

                {errors.new_password}

              </p>

            )}


            {/* CONFIRM PASSWORD */}

            <PasswordInput
              label="Confirm Password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              placeholder="Confirm your new password"
            />

            {errors.confirm_password && (

              <p className="text-sm text-red-500 -mt-3">

                {errors.confirm_password}

              </p>

            )}


            {/* SUBMIT BUTTON */}

            <AuthButton
              type="submit"
              disabled={loading || timeLeft <= 0}
            >

              {loading
                ? "Resetting..."
                : timeLeft <= 0
                ? "Link Expired"
                : "Reset Password"
              }

            </AuthButton>

          </form>


          {/* ================================
              BACK TO LOGIN
          ================================= */}

          <div className="text-center">

            <Link
              to="/login"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Back to Login
            </Link>

          </div>

        </div>

      </LoginCard>

    </div>

  );
}

export default ResetPassword;