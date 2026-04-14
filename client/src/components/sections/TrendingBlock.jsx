import Link from "next/link";
import Image from "next/image";
import { TrendingUp, Clock, Radio } from "lucide-react";

function catName(c) {
  return typeof c === "object" ? c?.name : c || "News";
}

function authorOrCategory(s) {
  const auth = typeof s.author === "object" ? s.author?.name : s.author;
  if (auth && String(auth).trim()) return String(auth).toUpperCase();
  return String(catName(s.category)).toUpperCase();
}

function fmt(s) {
  const d = s.publishedAt || s.createdAt;
  if (d) {
    try {
      return new Date(d).toLocaleDateString("en-US", { day: "2-digit", month: "short" });
    } catch {
      /* fall through */
    }
  }
  return s.timestamp || "";
}

function imgSrc(p) {
  return p.featuredImage || p.image || "/placeholder.jpg";
}

/**
 * Left: numbered trending list (up to 5).
 * Right: “Fresh from the wire” — latest headlines with small thumbs (fills empty space on wide screens).
 */
export default function TrendingBlock({ posts = [], sidePosts = [] }) {
  if (!posts.length && !sidePosts.length) return null;

  const trending = posts.slice(0, 5);
  const wire = sidePosts.filter(Boolean).slice(0, 5);

  return (
    <section className="bg-gray-50 border-y border-gray-200 py-8 md:py-10">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Left — Trending */}
          <div className="lg:col-span-7 min-w-0">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp size={16} className="text-primary shrink-0" />
              <h2 className="text-[13px] md:text-sm font-black uppercase tracking-[0.22em] text-gray-900 font-[Playfair_Display]">
                Trending Now
              </h2>
              <div className="h-px flex-1 bg-gray-300 min-w-[2rem]" />
            </div>

            {trending.length === 0 ? (
              <p className="text-[13px] text-gray-400 font-[Inter]">No trending items this hour.</p>
            ) : (
              <div className="divide-y divide-gray-200 border-t border-gray-200">
                {trending.map((s, i) => (
                  <Link
                    key={s.id}
                    href={`/news/${s.slug}`}
                    className="flex items-start gap-4 py-4 group hover:bg-white hover:shadow-sm transition-all -mx-2 px-2 rounded-sm"
                  >
                    <span className="text-4xl md:text-5xl font-black leading-none text-gray-100 group-hover:text-primary/25 transition-colors shrink-0 w-9 md:w-10 text-right font-[Playfair_Display]">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="text-[9.5px] font-black text-primary uppercase tracking-widest block mb-1 font-[Inter]">
                        {authorOrCategory(s)}
                      </span>
                      <h3 className="text-[14px] md:text-[15px] font-bold leading-snug text-gray-900 group-hover:text-primary transition-colors font-[Playfair_Display] line-clamp-3">
                        {s.title}
                      </h3>
                      <span className="text-[11px] text-gray-400 mt-1 flex items-center gap-1 font-[Inter]">
                        <Clock size={11} /> {fmt(s)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right — Wire snapshot */}
          <div className="lg:col-span-5 min-w-0 lg:border-l border-gray-200 lg:pl-10 pt-2 lg:pt-0">
            <div className="flex items-center gap-3 mb-6">
              <Radio size={16} className="text-primary shrink-0" />
              <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-gray-900 font-[Inter]">
                Fresh from the wire
              </h2>
              <div className="h-px flex-1 bg-gray-300 min-w-[2rem]" />
            </div>

            {wire.length === 0 ? (
              <p className="text-[12px] text-gray-400 font-[Inter] leading-relaxed">
                Latest headlines will appear here as the home feed updates.
              </p>
            ) : (
              <ul className="space-y-3">
                {wire.map((s) => (
                  <li key={s.id}>
                    <Link
                      href={`/news/${s.slug}`}
                      className="flex gap-3 p-2 -mx-2 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-sm transition-all group"
                    >
                      <div className="relative w-14 h-14 shrink-0 rounded-md overflow-hidden bg-gray-200">
                        <Image
                          src={imgSrc(s)}
                          alt=""
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform"
                          sizes="56px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-bold text-primary uppercase tracking-wider font-[Inter] line-clamp-1">
                          {catName(s.category)}
                        </span>
                        <p className="text-[12px] font-semibold text-gray-900 font-[Inter] leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                          {s.title}
                        </p>
                        <span className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1 font-[Inter]">
                          <Clock size={10} /> {fmt(s)}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
