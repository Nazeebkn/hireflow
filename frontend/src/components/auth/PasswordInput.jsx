import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function PasswordInput({
  label,
  name,
  id,
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  className = "",
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">

      {label && (
        <label
          htmlFor={id || name}
          className="text-sm font-medium text-text"
        >
          {label}

          {required && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </label>
      )}

      <div className="relative">

        <input
          id={id || name}
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full rounded-lg border border-border bg-background px-4 py-3 pr-12 outline-none transition-all duration-200 focus:border-primary disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
        />

        <button
          type="button"
          onClick={() => setShowPassword((show) => !show)}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary disabled:cursor-not-allowed"
        >
          {showPassword ? (
            <EyeOff size={20} />
          ) : (
            <Eye size={20} />
          )}
        </button>

      </div>

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

    </div>
  );
}

export default PasswordInput;