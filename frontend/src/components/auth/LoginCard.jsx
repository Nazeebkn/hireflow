function LoginCard({
  children,
  showHeader = true,
}) {
  return (
    <div className="flex w-full items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">

        {showHeader && (
          <div className="mb-8 text-center">

            <h1 className="text-3xl font-bold text-text-primary">
              Welcome Back
            </h1>

            <p className="mt-2 text-text-secondary">
              Enter your credentials to access your HireFlow workspace.
            </p>

          </div>
        )}

        <div className="rounded-2xl border border-border bg-surface p-8 shadow-lg">
          {children}
        </div>

      </div>
    </div>
  );
}

export default LoginCard;