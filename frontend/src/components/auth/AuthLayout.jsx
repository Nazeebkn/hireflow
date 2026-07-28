function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-lg">
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;