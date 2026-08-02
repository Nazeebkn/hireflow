function ProfileCompletionHeader({ currentStep = 1, totalSteps = 3 }) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          Complete Your Profile
        </h1>

        <p className="mt-1 text-sm text-text-secondary">
          Complete your profile to unlock personalized job recommendations and
          apply for opportunities.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text-secondary">
        Step {currentStep} of {totalSteps}
      </div>

    </div>
  );
}

export default ProfileCompletionHeader;