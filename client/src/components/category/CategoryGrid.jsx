import Image from "next/image";
import Link from "next/link";
import { Clock, User } from "lucide-react";
import AdSlot from "@/components/ads/AdSlot";

export default function CategoryGrid({ articles }) {
  return (
    <div className="space-y-0">
      {articles.map((article, idx) => (
        <div key={article.id}>
          {/* Article row */}
          <Link href={`/news/${article.slug}`} className="group flex gap-4 py-5 border-b border-gray-100 hover:bg-gray-50 transition-colors -mx-2 px-2">
            {/* Image */}
            <div className="relative w-32 md:w-44 flex-shrink-0 overflow-hidden img-zoom" style={{ height: "100px" }}>
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 128px, 176px"
              />
            </div>
            {/* Text */}
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest font-[Inter] block mb-1.5">
                {article.category}
              </span>
              <h3 className="text-[15px] md:text-[16px] font-bold text-gray-900 leading-snug line-clamp-2 font-[Playfair_Display] group-hover:text-primary transition-colors mb-2">
                {article.title}
              </h3>
              {article.excerpt && (
                <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2 font-[Inter] mb-2 hidden md:block">
                  {article.excerpt}
                </p>
              )}
              <div className="flex items-center gap-3 text-[11px] text-gray-400 font-[Inter]">
                {article.author && <span className="flex items-center gap-1"><User size={10} /> {article.author}</span>}
                <span className="flex items-center gap-1"><Clock size={10} /> {article.timestamp}</span>
              </div>
            </div>
          </Link>

          {/* In-feed ad every 6 articles */}
          {(idx + 1) % 6 === 0 && idx < articles.length - 1 && (
            <div className="py-4">
              <p className="text-[9px] text-gray-400 uppercase tracking-widest font-[Inter] text-center mb-1.5">Advertisement</p>
              <AdSlot slotKey="category_grid_inline" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
