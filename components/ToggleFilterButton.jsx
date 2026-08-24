export default function ToggleFilterButton({
  checked,
  onChange,
  label,
  className = "",
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={(e) => {
        onChange(!checked);
        e.currentTarget.blur();
      }}
      className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-3xl border-2 bg-white px-4 py-2 font-bold text-black transition-colors focus:border-[#ffa49f] focus:ring-2 focus:ring-[#ffa49f] focus:outline-none ${
        checked ? "border-[#FF5A5F]" : "border-gray-300"
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
          checked ? "border-[#FF5A5F] bg-[#FF5A5F]" : "border-gray-300"
        }`}
      >
        {checked && (
          <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5">
            <path
              d="M4.5 10.5 8.5 14.5 15.5 6"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      {label}
    </button>
  );
}
