import Link from "next/link";
import Image from "next/image";
import { Flame, Clock, TrendingUp } from "lucide-react";
import AdSlot from "@/components/ads/AdSlot";

function thumb(item) {
  return item?.featuredImage || item?.image || "/placeholder.jpg";
}

function SidebarBlock({
  title,
  icon: Icon,
  accent,
  items = [],
  emptyText,
  withPulse,
  headerTint = "neutral",
}) {
  const headerBg =
    headerTint === "primary"
      ? "bg-linear-to-r from-primary/12 to-transparent"
      : "bg-linear-to-r from-gray-900/5 to-transparent";
  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className={`${headerBg} px-3 py-2.5 border-b border-gray-100 flex items-center justify-between gap-2`}>
        <h3 className="text-[11px] font-black uppercase tracking-[0.12em] text-gray-900 font-[Inter] flex items-center gap-2">
          <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${accent}`}>
            <Icon className="w-3.5 h-3.5" />
          </span>
          {title}
        </h3>
        {withPulse ? (
          <span className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-pulse shrink-0" aria-hidden />
        ) : null}
      </div>
      <ul className="divide-y divide-gray-50">
        {items.length === 0 ? (
          <li className="text-[12px] text-gray-400 font-[Inter] py-4 px-3">{emptyText}</li>
        ) : (
          items.slice(0, 5).map((item) => (
            <li key={item.id}>
              <Link
                href={`/news/${item.slug}`}
                className="flex gap-3 items-start px-3 py-2.5 hover:bg-gray-50/90 transition-colors group"
              >
                <div className="w-14 h-11 relative shrink-0 rounded-md overflow-hidden bg-gray-100">
                  <Image
                    src={thumb(item)}
                    alt={item.title || ""}
                    fill
                    unoptimized
                    sizes="56px"
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <span className="text-[12px] font-bold text-gray-800 leading-snug group-hover:text-primary transition-colors font-[Inter] line-clamp-2 min-w-0 flex-1">
                  {item.title}
                </span>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default function StoryReadingSidebar({ latestNews = [], breakingNews = [], trendingNews = [] }) {
  return (
    <aside className="space-y-3">
      <div className="flex flex-col items-center py-1.5 border-b border-gray-100">
        <span className="text-[8px] uppercase tracking-widest text-gray-400 font-[Inter] mb-1 font-black">
          Advertisement
        </span>
        <AdSlot slotKey="public_sidebar_medium" hideLabel />
      </div>

      <SidebarBlock
        title="Breaking News"
        icon={Flame}
        accent="bg-primary/15 text-primary"
        items={breakingNews}
        emptyText="No breaking stories right now."
        headerTint="primary"
        withPulse
      />

      <SidebarBlock
        title="Latest News"
        icon={Clock}
        accent="bg-gray-900/10 text-gray-900"
        items={latestNews}
        emptyText="No recent articles."
      />

      <SidebarBlock
        title="Trending"
        icon={TrendingUp}
        accent="bg-emerald-600/10 text-emerald-700"
        items={trendingNews}
        emptyText="No trending items yet."
      />
    </aside>
  );
}
