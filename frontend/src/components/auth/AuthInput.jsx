function AuthInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-text">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none transition-all duration-200 focus:border-primary"
      />
    </div>
  );
}

export default AuthInput;