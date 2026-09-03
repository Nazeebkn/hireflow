import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import api from "../../services/api";

function VerifyEmail() {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await api.get(
          `/auth/verify-email/${uid}/${token}/`
        );

        toast.success("Email verified successfully.");

        setTimeout(() => {
          navigate("/login");
        }, 1000);

      } catch (error) {
        toast.error(
          error.response?.data?.message ||
          "Invalid or expired verification link."
        );
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [uid, token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {loading ? (
        <p>Verifying your email...</p>
      ) : (
        <p>Email verification completed.</p>
      )}
    </div>
  );
}

export default VerifyEmail;