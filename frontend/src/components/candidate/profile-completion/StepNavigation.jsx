import AuthButton from "../../auth/AuthButton";

function StepNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  isSubmitting = false,
}) {
  return (
    <div className="mt-8 flex items-center justify-between border-t border-border pt-6">

      <div>
        {currentStep > 1 && (
          <button
            type="button"
            onClick={onPrevious}
            className="rounded-lg border border-border px-6 py-3 font-medium transition hover:bg-gray-50"
          >
            ← Previous
          </button>
        )}
      </div>

      <div>
        {currentStep === totalSteps ? (
          <AuthButton
            type="button"
            onClick={onNext}
            disabled={isSubmitting}
            className="w-44"
          >
            {isSubmitting ? "Submitting..." : "Complete Profile"}
          </AuthButton>
        ) : (
          <AuthButton
            type="button"
            onClick={onNext}
            className="w-40"
          >
            Continue →
          </AuthButton>
        )}
      </div>

    </div>
  );
}

export default StepNavigation;