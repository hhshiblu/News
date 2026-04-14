import Link from "next/link";

export default function TrendingList({ articles }) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="border-b-[3px] border-primary pb-2 mb-4">
        <h3 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 font-[Inter]">
          Trending Now
        </h3>
      </div>
      <div className="space-y-5">
        {articles.map((article, index) => (
          <Link 
            key={article.id} 
            href={`/news/${article.slug}`} 
            className="flex gap-4 group"
          >
            <div className="text-3xl font-bold text-gray-200 group-hover:text-primary transition-colors font-[Playfair_Display] leading-none shrink-0 w-6">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest font-[Inter] block mb-1">
                {article.category}
              </span>
              <h4 className="text-[14px] font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors line-clamp-2 font-[Playfair_Display]">
                {article.title}
              </h4>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
