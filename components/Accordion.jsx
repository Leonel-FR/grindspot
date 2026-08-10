"use client";

import { createContext, useContext, useId, useState } from "react";
import { cn } from "@/lib/utils";

const AccordionContext = createContext(null);
const AccordionPanelContext = createContext(null);

function ChevronIcon({ open }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        "h-5 w-5 shrink-0 text-[#FF5A5F] transition-transform duration-225 ease-out",
        open && "rotate-180",
      )}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function Accordion({
  className,
  defaultValue = null,
  value,
  onValueChange,
  children,
  ...props
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const activeValue = isControlled ? value : internalValue;

  const toggleValue = (panelValue) => {
    const next = activeValue === panelValue ? null : panelValue;
    if (!isControlled) setInternalValue(next);
    onValueChange?.(next);
  };

  return (
    <AccordionContext.Provider value={{ activeValue, toggleValue }}>
      <div className={cn("flex flex-col gap-4", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

function AccordionPanel({ className, value, children, ...props }) {
  const { activeValue } = useContext(AccordionContext);
  const panelId = useId();
  const isOpen = activeValue === value;

  return (
    <AccordionPanelContext.Provider value={{ value, isOpen, panelId }}>
      <div
        className={cn(
          "overflow-hidden rounded-2xl border border-gray-300 bg-white",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </AccordionPanelContext.Provider>
  );
}

function AccordionTrigger({ className, children, ...props }) {
  const { toggleValue } = useContext(AccordionContext);
  const { value, isOpen, panelId } = useContext(AccordionPanelContext);

  return (
    <button
      type="button"
      aria-expanded={isOpen}
      aria-controls={panelId}
      onClick={() => toggleValue(value)}
      className={cn(
        "flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left font-bold text-gray-800 transition-colors duration-200 hover:text-[#FF5A5F] focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-[#FF5A5F] sm:p-6 sm:text-lg",
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      <ChevronIcon open={isOpen} />
    </button>
  );
}

function AccordionContent({ className, children, ...props }) {
  const { isOpen, panelId } = useContext(AccordionPanelContext);

  return (
    <div
      id={panelId}
      role="region"
      className={cn(
        "grid transition-[grid-template-rows] duration-300 ease-out",
        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
      )}
    >
      <div className="overflow-hidden">
        <div
          className={cn(
            "px-5 pb-5 text-sm text-gray-500 sm:px-6 sm:pb-6 sm:text-base",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export { Accordion, AccordionContent, AccordionPanel, AccordionTrigger };
