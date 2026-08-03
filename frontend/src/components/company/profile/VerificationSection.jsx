import FileUploadInput from "../../common/FileUploadInput";

function VerificationSection({
  formData,
  errors,
  onFileChange,
}) {
  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-lg font-semibold text-text-primary">
          Verification Documents
        </h2>

        <p className="mt-1 text-sm text-text-secondary">
          Upload your company logo (optional) and a verification document for
          admin review.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        <FileUploadInput
          label="Company Logo"
          name="company_logo"
          accept="image/*"
          file={formData.company_logo}
          error={errors.company_logo}
          onChange={onFileChange}
          required={false}
        />

        <FileUploadInput
          label="Verification Document"
          name="verification_document"
          accept=".pdf,.jpg,.jpeg,.png"
          file={formData.verification_document}
          error={errors.verification_document}
          onChange={onFileChange}
          required
        />

      </div>

    </div>
  );
}

export default VerificationSection;