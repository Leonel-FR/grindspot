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
    ? "w-0 transition-[width] duration-225 ease-out group-hover:w-(--fill) group-data-[revealed=true]:w-(--fill)"
    : animateOnMount
      ? "w-(--fill) animate-fill-up"
      : "w-(--fill) transition-[width] duration-225 ease-out";

  // `contents` drops this wrapper from the box tree so the label and bar
  // become direct items of the parent's grid — that's what lets every
  // StatBar in a group share one label-column width (sized to the longest
  // label) and one bar-column width, instead of each row sizing itself
  // independently and drifting out of alignment.
  return (
    <div className="contents">
      <span className={`text-sm ${light ? "text-muted" : "text-white"}`}>
        {label}
      </span>
      <div
        className={`h-6 min-w-0 overflow-hidden rounded-full ${light ? "bg-gray-100" : "bg-white/20"}`}
      >
        <div
          className={`h-full rounded-l-full ${fillClass} ${getBarColor(value)}`}
          style={{ "--fill": `${value}%` }}
        />
      </div>
    </div>
  );
}
