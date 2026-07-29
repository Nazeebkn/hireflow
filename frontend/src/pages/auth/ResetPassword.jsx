import { useState } from "react";
import { Link, useParams, useNavigate  } from "react-router-dom";
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

  const [formData, setFormData] = useState({
    new_password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({
    new_password: "",
    confirm_password: "",
  });


  const validateForm = () => {
      const newErrors = {
        new_password: validatePassword(formData.new_password),
        confirm_password: validateConfirmPassword(
          formData.new_password,
          formData.confirm_password
        ),
      };

      setErrors(newErrors);

      return !newErrors.new_password &&
            !newErrors.confirm_password;
    };

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


    
    const handleSubmit = async (e) => {


      e.preventDefault();

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
        toast.error(
          error.response?.data?.non_field_errors?.[0] ||
          error.response?.data?.detail ||
          "Something went wrong."
        );

      } finally {
        setLoading(false);
      }
    };

  return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

        <LoginCard>
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">
                Reset Password
              </h1>

              <p className="mt-2 text-gray-500">
                Create a new password for your HireFlow account.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
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

              <AuthButton type="submit" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </AuthButton>
            </form>

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