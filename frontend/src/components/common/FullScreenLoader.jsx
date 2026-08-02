function FullScreenLoader({
  title = "Loading...",
}) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">

      <div className="flex flex-col items-center">

        <h1 className="text-3xl font-bold text-primary">
          HireFlow
        </h1>

        <p className="mt-3 text-sm text-text-secondary">
          {title}
        </p>

        <div className="mt-8 h-10 w-10 animate-spin rounded-full border-4 border-border border-t-primary" />

      </div>

    </div>
  );
}

export default FullScreenLoader;