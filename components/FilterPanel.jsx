"use client";

import { useLanguage } from "@/components/LanguageProvider";
import ToggleFilterButton from "@/components/ToggleFilterButton";

const VIEWS = ["grid", "map"];

// Shared body of the filter panel — the controls only, no surrounding shell.
// Rendered inside both the desktop FilterSidebar and the mobile
// MobileFilterSheet; each of those owns its own positioning, header and
// scroll container.
export default function FilterPanel({
  sections,
  openNow,
  onOpenNowChange,
  notClosingSoon,
  onNotClosingSoonChange,
  view,
  onViewChange,
  hasActiveFilters,
  onClearAll,
}) {
  const { t } = useLanguage();

  const toggleOption = (section, option) => {
    section.onChange(
      section.selected.includes(option)
        ? section.selected.filter((value) => value !== option)
        : [...section.selected, option]
    );
  };

  return (
    <div>
      {/* Grid/Map switch — only shown in the panel below lg; on lg+ it lives
          in the top bar. A plain segmented control rather than reusing
          ViewSwitcher, whose absolute dropdown would clip inside the panel's
          own overflow-y-auto. */}
      <section className="mb-6 lg:hidden">
        <h3 className="mb-3 text-xs font-bold tracking-widest text-gray-500 uppercase">
          {t("filterBar.viewLabel")}
        </h3>
        <div
          role="radiogroup"
          aria-label={t("filterBar.viewLabel")}
          className="flex gap-2"
        >
          {VIEWS.map((v) => {
            const isActive = view === v;
            return (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => onViewChange(v)}
                className={`flex-1 cursor-pointer rounded-2xl border-2 px-4 py-2 font-bold transition-colors focus:outline-none ${
                  isActive
                    ? "border-[#FF5A5F] bg-[#FF5A5F] text-white"
                    : "border-gray-300 bg-white text-black"
                }`}
              >
                {t(`filterBar.view${v === "grid" ? "Grid" : "Map"}`)}
              </button>
            );
          })}
        </div>
      </section>

      {sections.map((section) => (
        <section key={section.title} className="mb-6">
          <h3 className="mb-3 text-xs font-bold tracking-widest text-gray-500 uppercase">
            {section.title}
          </h3>
          <div className="flex flex-wrap gap-2">
            {section.options.map((option) => {
              const isSelected = section.selected.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggleOption(section, option)}
                  className={`cursor-pointer rounded-2xl border-2 px-4 py-2 font-bold text-black transition-colors ${
                    isSelected
                      ? "border-[#FF5A5F]"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </section>
      ))}

      <div className="flex flex-wrap gap-2">
        <ToggleFilterButton
          checked={openNow}
          onChange={onOpenNowChange}
          label={t("filterBar.openNow")}
        />
        <ToggleFilterButton
          checked={notClosingSoon}
          onChange={onNotClosingSoonChange}
          label={t("filterBar.notClosingSoon")}
        />
      </div>

      {hasActiveFilters && onClearAll && (
        <button
          type="button"
          onClick={onClearAll}
          className="mt-6 cursor-pointer rounded-xl px-3 py-1.5 text-sm font-bold text-gray-500 hover:bg-gray-100 hover:text-black focus:bg-gray-100 focus:outline-none"
        >
          {t("filterBar.clearAll")}
        </button>
      )}
    </div>
  );
}
