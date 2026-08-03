function SelectInput({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  required = false,
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text-primary">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      >
        <option value="">Select {label}</option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export default SelectInput;