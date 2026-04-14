"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SubcategoryTabs({ tabs, baseSlug }) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-0 overflow-x-auto border-b border-gray-200 mb-6 scrollbar-hide">
      {tabs.map((tab) => {
        const href = `/category/${tab.slug}`;
        const isActive = pathname === href || (tab.slug === baseSlug && !tabs.slice(1).some(t => pathname === `/category/${t.slug}`));
        return (
          <Link
            key={tab.slug}
            href={href}
            className={`whitespace-nowrap px-4 py-2.5 text-[13px] font-semibold border-b-[3px] transition-colors flex-shrink-0 font-[Inter] ${
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
