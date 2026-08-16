"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

export default function MultiSelectDropdown({
  label,
  options,
  selected,
  onChange,
}) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const optionRefs = useRef([]);

  const hasSelection = selected.length > 0;

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e) => {
      if (!containerRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  const toggleOption = (option) => {
    onChange(
      selected.includes(option)
        ? selected.filter((value) => value !== option)
        : [...selected, option]
    );
  };

  const openAndFocus = (index) => {
    setOpen(true);
    requestAnimationFrame(() => optionRefs.current[index]?.focus());
  };

  const handleTriggerKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      openAndFocus(0);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      openAndFocus(options.length - 1);
    }
  };

  const handleListKeyDown = (e, index) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      optionRefs.current[(index + 1) % options.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      optionRefs.current[
        (index - 1 + options.length) % options.length
      ]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      optionRefs.current[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      optionRefs.current[options.length - 1]?.focus();
    } else if (e.key === "Escape") {
      setOpen(false);
      triggerRef.current?.focus();
    }
  };

  const handleBlur = (e) => {
    if (!containerRef.current?.contains(e.relatedTarget)) setOpen(false);
  };

  return (
    <div
      ref={containerRef}
      onBlur={handleBlur}
      className="relative w-full sm:w-auto"
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-3xl border-2 bg-white px-4 py-2 font-bold text-black transition-colors focus:border-[#ffa49f] focus:ring-2 focus:ring-[#ffa49f] focus:outline-none sm:w-auto sm:min-w-40 ${
          open || hasSelection ? "border-[#FF5A5F]" : "border-gray-300"
        }`}
      >
        <span className="truncate">{label}</span>
        <span className="flex shrink-0 items-center gap-1.5">
          {hasSelection && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FF5A5F] px-1.5 text-xs font-bold text-white">
              {selected.length}
            </span>
          )}
          <svg
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
            className={`h-4 w-4 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          >
            <path
              d="M5 7.5 10 12.5 15 7.5"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {open && (
        <div className="absolute left-0 z-20 mt-2 w-full overflow-hidden rounded-2xl border-2 border-gray-300 bg-white shadow-lg sm:w-56">
          <ul
            role="listbox"
            aria-label={label}
            aria-multiselectable="true"
            className="max-h-64 overflow-y-auto p-2"
          >
            {options.map((option, index) => {
              const isSelected = selected.includes(option);
              return (
                <li key={option}>
                  <button
                    ref={(el) => (optionRefs.current[index] = el)}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => toggleOption(option)}
                    onKeyDown={(e) => handleListKeyDown(e, index)}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left font-bold text-black focus:outline-none"
                  >
                    <span
                      aria-hidden="true"
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                        isSelected
                          ? "border-[#FF5A5F] bg-[#FF5A5F]"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {isSelected && (
                        <svg
                          viewBox="0 0 20 20"
                          fill="none"
                          className="h-3.5 w-3.5"
                        >
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
                    <span className="truncate">{option}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {hasSelection && (
            <div className="border-t-2 border-gray-100 p-2">
              <button
                type="button"
                onClick={() => onChange([])}
                className="w-full cursor-pointer rounded-xl px-3 py-1.5 text-sm font-bold text-gray-500 hover:bg-gray-100 hover:text-black focus:bg-gray-100 focus:outline-none"
              >
                {t("filterBar.clearAll")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
