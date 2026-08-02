function AuthInput({
  label,
  name,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = "",
}) {
  return (
    <div className="space-y-2">

      {label && (
        <label
          htmlFor={id || name}
          className="text-sm font-medium text-text"
        >
          {label}

          {required && (
            <span className="text-red-500 ml-1">
              *
            </span>
          )}
        </label>
      )}

      <input
        id={id || name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full rounded-lg border border-border bg-background px-4 py-3 outline-none transition-all duration-200 focus:border-primary disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      />

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

    </div>
  );
}

export default AuthInput;