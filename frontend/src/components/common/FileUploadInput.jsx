function FileUploadInput({
  label,
  name,
  accept,
  file,
  onChange,
  error,
  required = false,
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text-primary">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <input
        type="file"
        name={name}
        accept={accept}
        onChange={onChange}
        className="block w-full rounded-xl border border-border bg-background px-3 py-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white hover:file:opacity-90"
      />

      {file && (
        <p className="text-sm text-green-600">
          Selected: {file.name}
        </p>
      )}

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export default FileUploadInput;