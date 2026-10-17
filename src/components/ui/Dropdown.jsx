
import { ChevronDown } from "lucide-react";

function Dropdown({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  name,
  required = false,
  disabled = false,
  className = "",
}) {
  const normalizedOptions = options.map((option) =>
    typeof option === "string"
      ? { label: option, value: option }
      : option
  );

  return (
    <div className={`min-w-0 space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-xs font-medium text-slate-600"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <select
          id={name}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className="h-10 w-full appearance-none rounded-full border border-fuchsia-200 bg-white px-3 pr-9 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50"
        >
          <option value="" disabled>
            {placeholder}
          </option>

          {normalizedOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={15}
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
        />
      </div>
    </div>
  );
}

export default Dropdown;
