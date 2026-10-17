
export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
}) {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-[13px] font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50";

  const variants = {
    primary:
      "bg-gradient-to-r from-[#4F39F6] to-[#9810FA] text-white shadow-sm hover:opacity-95",
    secondary:
      "border border-[#E5E7EB] bg-white text-[#374151] hover:bg-violet-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant] || variants.primary} ${className}`}
    >
      {children}
    </button>
  );
}
