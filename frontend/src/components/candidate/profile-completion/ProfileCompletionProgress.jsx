function ProfileCompletionProgress({
  currentStep,
  totalSteps,
}) {

  const progress =
    (currentStep / totalSteps) * 100;

  return (

    <div className="space-y-3">

      <div className="flex items-center justify-between">

        <p className="text-sm font-medium text-text-primary">
          Step {currentStep} of {totalSteps}
        </p>

        <p className="text-sm text-text-secondary">
          {Math.round(progress)}%
        </p>

      </div>

      <div className="h-2 w-full rounded-full bg-border">

        <div
          style={{
            width: `${progress}%`,
          }}
          className="h-full rounded-full bg-primary transition-all duration-300"
        />

      </div>

    </div>

  );
}

export default ProfileCompletionProgress;