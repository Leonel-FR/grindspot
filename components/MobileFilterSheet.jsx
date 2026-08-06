"use client";

import { useEffect } from "react";

export default function MobileFilterSheet({
  sections,
  onClose,
  resultsCount,
  hasActiveFilters,
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const toggleOption = (section, option) => {
    section.onChange(
      section.selected.includes(option)
        ? section.selected.filter((value) => value !== option)
        : [...section.selected, option]
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Filters"
      className="fixed inset-0 z-50 flex flex-col bg-white sm:hidden"
    >
      <header className="flex items-center justify-between px-5 py-4">
        <h2 className="text-xl font-bold text-black">Filters</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close filters"
          className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-300 font-bold text-black focus:border-[#FF5A5F] focus:ring-2 focus:ring-[#ffa49f] focus:outline-none"
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
            className="h-4 w-4"
          >
            <path
              d="M5 5 15 15M15 5 5 15"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-5 pb-6">
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
                    className={`rounded-2xl border-2 px-4 py-2 font-bold text-black transition-colors ${
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
      </div>

      <button
        type="button"
        onClick={onClose}
        className="w-full bg-[#FF5A5F] py-4 text-lg font-bold text-white focus:outline-none"
      >
        Show results{hasActiveFilters ? ` (${resultsCount})` : ""}
      </button>
    </div>
  );
}
