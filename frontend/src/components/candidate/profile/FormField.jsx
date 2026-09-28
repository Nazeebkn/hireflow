function FormField({
  label,
  name,
  value,
  onChange,
  disabled,
  error,
  required = false,
  type = "text",
  textarea = false,
  rows = 4,
  placeholder = "",
  select = false,
  options = [],
}) {
  const baseClass =
    "w-full rounded-xl border bg-surface px-4 py-3 text-sm text-text outline-none transition";

  const normalClass =
    "border-border focus:border-primary focus:ring-2 focus:ring-primary/10";

  const disabledClass =
    "cursor-default bg-background text-text-secondary";

  const errorClass =
    "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100";

  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-text"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      {select ? (
        <select
          id={name}
          name={name}
          value={value || ""}
          onChange={onChange}
          disabled={disabled}
          className={`${baseClass} ${
            error ? errorClass : normalClass
          } ${disabled ? disabledClass : ""}`}
        >
          <option value="">
            Select {label}
          </option>

          {options.map(
            ([optionValue, optionLabel]) => (
              <option
                key={optionValue}
                value={optionValue}
              >
                {optionLabel}
              </option>
            )
          )}
        </select>
      ) : textarea ? (
        <textarea
          id={name}
          name={name}
          value={value || ""}
          onChange={onChange}
          disabled={disabled}
          rows={rows}
          placeholder={
            disabled ? "" : placeholder
          }
          className={`${baseClass} ${
            error ? errorClass : normalClass
          } ${disabled ? disabledClass : ""}`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value || ""}
          onChange={onChange}
          disabled={disabled}
          placeholder={
            disabled ? "" : placeholder
          }
          className={`${baseClass} ${
            error ? errorClass : normalClass
          } ${disabled ? disabledClass : ""}`}
        />
      )}

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default FormField;