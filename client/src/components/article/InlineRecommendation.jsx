import Link from "next/link";
import Image from "next/image";

export default function InlineRecommendation({ articles }) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="my-10 border-t border-b border-gray-100 py-8">
      <h3 className="text-[13px] font-bold uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
        <span className="w-8 h-[2px] bg-primary"></span> Recommended For You
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles.map((article) => (
          <Link key={article.id} href={`/news/${article.slug}`} className="flex gap-4 group">
            <div className="w-24 h-24 shrink-0 relative overflow-hidden rounded-sm">
              <Image 
                src={article.image} 
                alt={article.title} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-500" 
              />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                {article.category}
              </span>
              <h4 className="text-[15px] font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors font-[Playfair_Display] line-clamp-3">
                {article.title}
              </h4>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
