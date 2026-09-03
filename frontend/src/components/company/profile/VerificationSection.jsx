import { useState } from "react";
import FileUploadInput from "../../common/FileUploadInput";

function VerificationSection({
  formData,
  errors,
  onFileChange,
}) {
  const [documentError, setDocumentError] = useState("");

  const handleVerificationDocumentChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setDocumentError("");
      return;
    }

    // Allowed verification document types
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    // Validate actual file MIME type
    if (!allowedTypes.includes(file.type)) {
      setDocumentError(
        "Invalid document. Please upload a PDF, JPG, JPEG, or PNG file.",
      );

      // Clear invalid file
      event.target.value = "";

      return;
    }

    // Optional file size validation
    const maxSize = 5 * 1024 * 1024; // 5 MB

    if (file.size > maxSize) {
      setDocumentError(
        "Verification document must be less than 5 MB.",
      );

      event.target.value = "";

      return;
    }

    // Valid file
    setDocumentError("");

    onFileChange(event);
  };

  return (
    <div className="space-y-6">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div>
        <h2 className="text-lg font-semibold text-text-primary">
          Verification Documents
        </h2>

        <p className="mt-1 text-sm text-text-secondary">
          Upload your company logo (optional) and a verification
          document for admin review.
        </p>
      </div>

      {/* ================================================= */}
      {/* FILE INPUTS */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        {/* COMPANY LOGO */}

        <FileUploadInput
          label="Company Logo"
          name="company_logo"
          accept="image/*"
          file={formData.company_logo}
          error={errors.company_logo}
          onChange={onFileChange}
          
        />

        {/* VERIFICATION DOCUMENT */}

        <div>

          <FileUploadInput
            label="Verification Document"
            name="verification_document"
            accept=".pdf,.jpg,.jpeg,.png"
            file={formData.verification_document}
            error={
              documentError ||
              errors.verification_document
            }
            onChange={
              handleVerificationDocumentChange
            }
            required
          />

          {!documentError && (
            <p className="mt-2 text-xs text-text-secondary">
              Accepted formats: PDF, JPG, JPEG, PNG. Maximum
              size: 5 MB.
            </p>
          )}

        </div>

      </div>

    </div>
  );
}

export default VerificationSection;