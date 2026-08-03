import AuthButton from "../../auth/AuthButton";

function CompanySubmitButton({ loading }) {
  return (
    <div className="mt-8 flex justify-end">
      <AuthButton
        type="submit"
        disabled={loading}
        className="min-w-56"
      >
        {loading ? "Submitting..." : "Submit for Approval"}
      </AuthButton>
    </div>
  );
}

export default CompanySubmitButton;