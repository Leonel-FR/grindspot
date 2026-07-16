function getBarColor(value) {
  if (value < 40) return "bg-[#ff4843]";
  if (value < 70) return "bg-[#ffc925]";
  return "bg-[#2bde73]";
}

export default function StatBar({
  label,
  value,
  light = false,
  animateOnHover = false,
  animateOnMount = false,
}) {
  const fillClass = animateOnHover
    ? "w-0 transition-[width] duration-225 ease-out group-hover:w-(--fill)"
    : animateOnMount
      ? "w-(--fill) animate-fill-up"
      : "w-(--fill) transition-[width] duration-225 ease-out";

  return (
    <div className="flex items-center gap-3">
      <span
        className={`w-17 shrink-0 text-sm ${light ? "text-muted" : "text-white"}`}
      >
        {label}
      </span>
      <div
        className={`h-6 w-full rounded-full ${light ? "bg-gray-100" : "bg-white/20"}`}
      >
        <div
          className={`h-full rounded-l-full ${fillClass} ${getBarColor(value)}`}
          style={{ "--fill": `${value}%` }}
        />
      </div>
    </div>
  );
}
