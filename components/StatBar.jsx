import { useLanguage } from "@/components/LanguageProvider";

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
  const { language } = useLanguage();
  // Spanish stat labels ("⭐️ Calificación") run noticeably longer than
  // their English source and don't fit the fixed-width side label without
  // overflowing, so that language stacks the label above the bar instead.
  const stacked = language === "es";
  const fillClass = animateOnHover
    ? "w-0 transition-[width] duration-225 ease-out group-hover:w-(--fill)"
    : animateOnMount
      ? "w-(--fill) animate-fill-up"
      : "w-(--fill) transition-[width] duration-225 ease-out";

  return (
    <div className={stacked ? "flex flex-col gap-1" : "flex items-center gap-3"}>
      <span
        className={`shrink-0 text-sm ${stacked ? "" : "w-17"} ${light ? "text-muted" : "text-white"}`}
      >
        {label}
      </span>
      <div
        className={`h-6 w-full overflow-hidden rounded-full ${light ? "bg-gray-100" : "bg-white/20"}`}
      >
        <div
          className={`h-full rounded-l-full ${fillClass} ${getBarColor(value)}`}
          style={{ "--fill": `${value}%` }}
        />
      </div>
    </div>
  );
}
