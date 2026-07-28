import { useState } from "react";

function PasswordInput({
  label,
  placeholder,
  value,
  onChange,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-text">
        {label}
      </label>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full rounded-lg border border-border bg-background px-4 py-3 pr-12 outline-none transition-all duration-200 focus:border-primary"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-secondary"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}

export default PasswordInput;