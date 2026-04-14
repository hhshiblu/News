import Link from "next/link";
import Image from "next/image";
import { Zap } from "lucide-react";

/**
 * BreakingRow — full-width scrollable horizontal strip of image cards
 * Appears just below the Market Ticker.
 */
export default function BreakingRow({ posts = [] }) {
  if (!posts.length) return null;
  return (
    <section className="bg-white border-b border-gray-200 py-6">
      <div className="max-w-[1280px] mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <span className="flex items-center gap-1.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 font-[Inter]">
            <Zap size={10} className="fill-white" /> Breaking
          </span>
          <div className="h-px flex-1 bg-gray-200" />
          <Link href="/breaking" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-primary transition-colors font-[Inter]">
            View All →
          </Link>
        </div>

        {/* Scrollable row of image cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {posts.slice(0, 5).map(s => {
            const catName = typeof s.category==="object" ? s.category?.name : s.category || "News";
            const date = s.timestamp || new Date(s.createdAt).toLocaleDateString("en-BD",{day:"2-digit",month:"short"});
            return (
              <Link key={s.id} href={`/news/${s.slug}`} className="group block relative overflow-hidden">
                <div className="relative aspect-[3/2] overflow-hidden rounded-sm">
                  <Image
                    src={s.featuredImage || s.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400"}
                    alt={s.title} fill unoptimized sizes="(max-width:768px) 50vw, 20vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"/>
                  <span className="absolute top-2 left-2 bg-primary text-white text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 font-[Inter]">
                    {catName}
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white text-[12px] font-bold leading-snug font-[Playfair_Display] line-clamp-2">
                      {s.title}
                    </h3>
                    <span className="text-white/60 text-[9px] font-[Inter] mt-1 block">{date}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
