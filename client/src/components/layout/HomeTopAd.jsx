"use client";

import { usePathname } from "next/navigation";
import AdSlot from "@/components/ads/AdSlot";

/** Full-width leaderboard only on `/` (above Navbar via layout order). */
export default function HomeTopAd() {
  const path = usePathname();
  if (path !== "/") return null;
  return (
    <div className="w-full border-b border-gray-100 bg-white">
      {/* Full-width, centered container so it doesn't look “stuck” to the very top */}
      <div className="max-w-[1280px] mx-auto px-3 sm:px-4 py-3">
        <AdSlot slotKey="home_top_leaderboard" hideLabel className="w-full" />
      </div>
    </div>
  );
}
