"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

/** items from server: { title, slug }[] — merged breaking-tagged posts */
export default function BreakingNewsTickerClient({ items = [] }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  const safe = items.filter((x) => x?.slug && x?.title);
  const loop = safe.length > 0 ? [...safe, ...safe] : [{ title: "No breaking-tagged stories right now.", slug: "" }];

  return (
    <div className="bg-breaking flex items-center min-h-9 overflow-hidden relative border-b border-red-900/20">
      <div className="shrink-0 bg-red-900 min-h-9 flex items-center gap-2 px-3 sm:px-4 z-10 shadow-md">
        <span className="pulse-dot w-2 h-2 rounded-full bg-white shrink-0 ring-2 ring-white/40" />
        <span className="text-[10px] sm:text-[11px] font-extrabold tracking-widest text-white whitespace-nowrap font-[Inter]">
          BREAKING
        </span>
      </div>

      <div className="w-px h-3/5 bg-white/30 shrink-0 self-center" />

      <div className="flex-1 min-w-0 overflow-hidden py-1">
        <div className="ticker-track flex">
          {loop.map((item, idx) => (
            <span
              key={`${item.slug}-${idx}`}
              className="inline-flex items-center gap-2 pr-10 sm:pr-14 text-[11px] sm:text-[12px] font-medium text-white whitespace-nowrap font-[Inter]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-100 shrink-0 ring-1 ring-white/50" aria-hidden />
              {item.slug ? (
                <Link
                  href={`/news/${item.slug}`}
                  className="text-white hover:text-amber-200 transition-colors"
                >
                  {item.title}
                </Link>
              ) : (
                <span className="text-white/90">{item.title}</span>
              )}
              <span className="text-white/35 select-none">•</span>
            </span>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setVisible(false)}
        className="shrink-0 min-h-9 flex items-center px-2 sm:px-3 text-white/70 hover:text-white transition-colors z-10"
        aria-label="Close breaking ticker"
      >
        <X size={14} />
      </button>
    </div>
  );
}
