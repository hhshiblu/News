import Image from "next/image";
import Link from "next/link";

function ChevronRightIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Grid of related posts + View all → parent category hub (e.g. /politics)
 */
export default function RelatedArticles({ articles, viewAllHref, viewAllLabel = "View all" }) {
  const list = (articles || []).slice(0, 10);
  if (list.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {list.map((article) => (
          <Link
            key={article.id}
            href={`/news/${article.slug}`}
            className="group flex flex-col bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-primary/25 hover:shadow-md transition-all"
          >
            <div className="relative aspect-[16/10] bg-gray-100">
              <Image
                src={article.image || article.featuredImage || "/placeholder.jpg"}
                alt=""
                fill
                className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, 20vw"
                unoptimized
              />
            </div>
            <div className="p-2.5 flex flex-col flex-1 min-h-0">
              <h3 className="text-[12px] font-bold text-gray-900 leading-snug group-hover:text-primary transition-colors font-[Inter] line-clamp-3">
                {article.title}
              </h3>
              {article.timestamp && (
                <p className="mt-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-wide">
                  {article.timestamp}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
      {viewAllHref && (
        <div className="flex justify-center pt-1">
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-[0.15em] text-primary hover:text-primary/80 font-[Inter] border-b-2 border-primary/40 hover:border-primary pb-0.5"
          >
            {viewAllLabel}
            <ChevronRightIcon className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  );
}
