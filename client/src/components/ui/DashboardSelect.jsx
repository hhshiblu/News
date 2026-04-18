"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

/**
 * Custom listbox — avoids native <select> overflow on mobile and gives padded items.
 * Mobile: full width of parent (add px-2 on parent for side margin). Desktop: compact, left-aligned.
 */
export default function DashboardSelect({
  value,
  onChange,
  options = [],
  id,
  placeholder = "Select…",
  className = "",
  buttonClassName = "",
  "aria-label": ariaLabel,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const selected = options.find((o) => o.value === value);
  const label = selected?.label ?? placeholder;

  return (
    <div
      ref={rootRef}
      className={`relative w-full min-w-0 sm:w-[min(100%,13.5rem)] sm:max-w-[220px] sm:self-start ${className}`}
    >
      <button
        type="button"
        id={id}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => !disabled && setOpen((o) => !o)}
        className={`flex w-full min-w-0 items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-left text-[13px] font-medium text-gray-800 outline-none transition-shadow focus:ring-2 focus:ring-primary/25 focus:border-primary disabled:opacity-50 ${buttonClassName}`}
      >
        <span className="min-w-0 flex-1 truncate">{label}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 opacity-60 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && !disabled && (
        <ul
          role="listbox"
          className="absolute z-[200] mt-1 max-h-60 min-w-full overflow-auto rounded-xl border border-gray-200 bg-white py-1 shadow-lg ring-1 ring-black/5 left-0 right-0 sm:right-auto sm:min-w-[12rem]"
        >
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <li key={String(opt.value)} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] font-medium transition-colors hover:bg-gray-50 ${
                    active ? "bg-primary/5 text-primary font-semibold" : "text-gray-800"
                  }`}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                >
                  {active ? <Check className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={2.5} /> : <span className="w-3.5 shrink-0" aria-hidden />}
                  <span className="min-w-0 flex-1">{opt.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
