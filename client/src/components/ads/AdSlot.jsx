"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { presetForKey } from "@/lib/adSlots";
import { getApiV1Base, getClientSiteOrigin } from "@/lib/apiBaseUrl";

function mediaOrigin() {
  return getClientSiteOrigin();
}

function resolveAdImageSrc(url) {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  const path = url.startsWith("/") ? url : `/${url}`;
  const base = mediaOrigin();
  if (!base) return path;
  return `${base}${path}`;
}

/**
 * Fetches the winning active creative for a whitelisted slotKey and renders
 * image + company line; links with rel=sponsored when targetUrl is set.
 */
export default function AdSlot({ slotKey, className = "", hideLabel = false }) {
  const preset = presetForKey(slotKey);
  const [ad, setAd] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`${getApiV1Base()}/public/ads?slotKey=${encodeURIComponent(slotKey)}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d.success) setAd(d.data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [slotKey]);

  const w = ad?.width || preset?.defaultWidth || 300;
  const h = ad?.height || preset?.defaultHeight || 250;

  if (!loaded) {
    return (
      <div className={`flex flex-col items-center ${className}`} style={{ minHeight: Math.min(h, 120) }}>
        <div className="w-full animate-pulse rounded bg-gray-100" style={{ maxWidth: w, height: Math.min(h, 90) }} />
      </div>
    );
  }

  if (!ad?.imageUrl) {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        {!hideLabel && (
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1.5 font-[Inter]">Advertisement</p>
        )}
        <div
          className="w-full max-w-full border border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center text-gray-400 text-[10px] font-[Inter] rounded-md"
          style={{ width: "100%", maxWidth: w, height: h }}
        >
          {preset?.label || slotKey}
          <span className="text-[9px] mt-0.5 tabular-nums">
            {w} × {h} px
          </span>
        </div>
      </div>
    );
  }

  const inner = (
    <div className="flex flex-col items-center w-full" style={{ maxWidth: w }}>
      {!hideLabel && (
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1.5 font-[Inter]">Advertisement</p>
      )}
      <div
        className="relative w-full overflow-hidden rounded-md border border-gray-100 bg-gray-50"
        style={{ aspectRatio: `${w} / ${h}` }}
      >
        {/* Top-right ADS badge (blinking) */}
        <div className="absolute top-1.5 right-1.5 z-10 pointer-events-none">
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-red-600/95 text-white text-[10px] font-semibold tracking-widest animate-pulse">
            ADS
          </span>
        </div>
        <Image src={resolveAdImageSrc(ad.imageUrl)} alt={ad.companyName || ""} fill unoptimized className="object-contain" sizes={`${w}px`} />
      </div>
      {ad.companyName && (
        <p className="text-[10px] text-gray-500 mt-1 font-semibold font-[Inter] text-center line-clamp-1">{ad.companyName}</p>
      )}
    </div>
  );

  if (ad.targetUrl) {
    return (
      <a
        href={ad.targetUrl}
        target="_blank"
        rel="noopener sponsored noreferrer"
        className={`block hover:opacity-95 transition-opacity ${className}`}
      >
        {inner}
      </a>
    );
  }

  return <div className={className}>{inner}</div>;
}
