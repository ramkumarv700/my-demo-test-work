
function TextField({
  label,
  id,
  type = "text",
  error,
  className = "",
  ...props
}) {
  const inputId = id || props.name

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        type={type}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${inputId}-error` : undefined
        }
        className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 ${
          error
            ? "border-red-500"
            : "border-slate-300"
        } ${className}`}
        {...props}
      />

      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-1 text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  )
}

export default TextField
