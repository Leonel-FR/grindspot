"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

const VIEWS = ["grid", "map"];

export default function ViewSwitcher({ view, onViewChange, className = "" }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e) => {
      if (!containerRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () =>
      document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  const select = (nextView) => {
    setOpen(false);
    if (nextView !== view) onViewChange(nextView);
  };

  return (
    <div ref={containerRef} className={`relative shrink-0 ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={`flex cursor-pointer items-center gap-2 rounded-3xl border-2 bg-white px-4 py-2 font-bold text-black transition-colors focus:border-[#ffa49f] focus:ring-2 focus:ring-[#ffa49f] focus:outline-none ${
          open ? "border-[#FF5A5F]" : "border-gray-300"
        }`}
      >
        <span>{t(`filterBar.view${view === "grid" ? "Grid" : "Map"}`)}</span>
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
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-2xl border-2 border-gray-300 bg-white shadow-lg">
          <ul
            role="listbox"
            aria-label={t("filterBar.viewLabel")}
            className="p-2"
          >
            {VIEWS.map((v) => {
              const isSelected = view === v;
              return (
                <li key={v}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => select(v)}
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
                    <span>
                      {t(`filterBar.view${v === "grid" ? "Grid" : "Map"}`)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
