function AuthButton({
  children,
  type = "submit",
  disabled = false,
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className="w-full rounded-lg bg-primary px-6 py-3 font-medium text-white transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}

export default AuthButton;