
function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:opacity-50 disabled:pointer-events-none"

  const variants = {
    primary:
      "bg-violet-600 text-white hover:bg-violet-700",
    secondary:
      "border border-violet-100 bg-white text-violet-700 hover:bg-violet-50",
    ghost:
      "bg-transparent text-slate-600 hover:bg-violet-50",
  }

  const sizes = {
    sm: "min-h-9 px-3 text-xs",
    md: "min-h-10 px-4 text-sm",
    lg: "min-h-11 px-5 text-sm",
  }

  return (
    <button
      type={type}
      className={`${base} ${variants[variant] ?? variants.primary} ${sizes[size] ?? sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
