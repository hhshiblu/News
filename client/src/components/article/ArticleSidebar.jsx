import Link from "next/link";
import Image from "next/image";
import AdSlot from "@/components/ads/AdSlot";

function FlameIcon({ className = "w-4 h-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 23c4.97 0 9-3.58 9-8 0-3.05-1.77-5.7-4.65-7.53-.18 3.31-2.5 5.53-2.5 5.53s.5-4.5-2-8c-1.48 2.33-2 4.62-2 6.47 0 1.05.28 2.05.78 2.93C8.38 12.56 8 11.3 8 10c-3.5 3-5 5.61-5 8 0 4.42 4.03 8 9 8z" />
    </svg>
  );
}

export default function ArticleSidebar({
  breakingNews = [],
  authorPosts = [],
  authorName = "",
  authorHref = "",
}) {
  const showAuthor = authorName && authorPosts.length > 0 && authorHref;

  return (
    <aside className="space-y-3">
      <div className="flex flex-col items-center py-1.5 border-b border-gray-100">
        <span className="text-[8px] uppercase tracking-widest text-gray-400 font-[Inter] mb-1 font-black">
          Advertisement
        </span>
        <AdSlot slotKey="public_sidebar_medium" hideLabel />
      </div>

      {/* ── Breaking News ── */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-primary/12 to-transparent px-3 py-2.5 border-b border-gray-100 flex items-center justify-between gap-2">
          <h3 className="text-[11px] font-black uppercase tracking-[0.12em] text-gray-900 font-[Inter] flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <FlameIcon className="w-3.5 h-3.5" />
            </span>
            Breaking News
          </h3>
          <span className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-pulse shrink-0" />
        </div>
        <ul className="divide-y divide-gray-50">
          {breakingNews.length === 0 ? (
            <li className="text-[11px] text-gray-400 font-[Inter] py-4 px-3">
              No breaking stories right now.
            </li>
          ) : (
            breakingNews.slice(0, 5).map((item) => (
              <li key={item.id}>
                <Link
                  href={`/news/${item.slug}`}
                  className="flex gap-3 items-start px-3 py-2.5 hover:bg-gray-50/90 transition-colors group"
                >
                  {/* Thumbnail */}
                  <div className="w-14 h-11 relative shrink-0 rounded-md overflow-hidden bg-gray-100">
                    <Image
                      src={item.image || item.featuredImage || "/placeholder.jpg"}
                      alt={item.title}
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

      {/* ── From Author ── */}
      {showAuthor && (
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-gray-900/[0.06] to-transparent px-3 py-2.5 border-b border-gray-100 flex items-center justify-between gap-2">
            <h3 className="text-[11px] font-black uppercase tracking-[0.12em] text-gray-900 font-[Inter]">
              From {authorName}
            </h3>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-900 shrink-0" aria-hidden />
          </div>
          <ul className="divide-y divide-gray-50">
            {authorPosts.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/news/${item.slug}`}
                  className="flex gap-3 items-start px-3 py-2.5 hover:bg-gray-50/90 transition-colors group"
                >
                  {/* Thumbnail */}
                  <div className="w-14 h-11 relative shrink-0 rounded-md overflow-hidden bg-gray-100">
                    <Image
                      src={item.image || item.featuredImage || "/placeholder.jpg"}
                      alt={item.title}
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
            ))}
          </ul>
          <div className="px-3 py-2 border-t border-gray-50">
            <Link
              href={authorHref}
              className="inline-flex items-center justify-center w-full py-2 rounded-lg bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary-dark transition-colors font-[Inter]"
            >
              View all
            </Link>
          </div>
        </div>
      )}
    </aside>
  );
}
