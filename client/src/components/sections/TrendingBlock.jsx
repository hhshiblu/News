import Link from "next/link";
import Image from "next/image";
import { TrendingUp, Clock } from "lucide-react";

function catName(c) {
  return typeof c === "object" ? c?.name : c || "News";
}
function fmt(s) {
  const d = s.publishedAt || s.createdAt;
  if (d) {
    try {
      const now = new Date();
      const pub = new Date(d);
      const diffMs = now - pub;
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHrs = Math.floor(diffMins / 60);
      if (diffHrs < 24) return `${diffHrs}h ago`;
      return pub.toLocaleDateString("en-US", { day: "2-digit", month: "short" });
    } catch { /* fall through */ }
  }
  return s.timestamp || "";
}
function imgSrc(p) {
  return p.featuredImage || p.image || "/placeholder.jpg";
}

/**
 * TrendingBlock v2 — Image-First Layout
 * Left: #1 trending — big featured card with large image
 * Right: #2-6 trending — each with small thumbnail image
 * NO text-only lists. Every story has a visible image.
 */
export default function TrendingBlock({ posts = [] }) {
  if (!posts.length) return null;

  const [hero, ...rest] = posts.slice(0, 6);
  const sideItems = rest.slice(0, 5);

  return (
    <section className="bg-gray-50 border-y border-gray-200 py-8 md:py-10">
      <div className="max-w-[1280px] mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp size={16} className="text-primary shrink-0" />
          <h2 className="text-[13px] md:text-sm font-black uppercase tracking-[0.22em] text-gray-900 font-[Playfair_Display]">
            Trending Now
          </h2>
          <div className="h-px flex-1 bg-gray-300 min-w-[2rem]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">

          {/* Left — #1 big image card */}
          {hero && (
            <Link
              href={`/news/${hero.slug}`}
              className="lg:col-span-5 group block relative overflow-hidden rounded-sm"
            >
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-200">
                <Image
                  src={imgSrc(hero)}
                  alt={hero.title}
                  fill unoptimized
                  sizes="(max-width:1024px) 100vw, 40vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-600"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                {/* Badge */}
                <span className="absolute top-3 left-3 bg-primary text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 font-[Inter]">
                  {catName(hero.category)}
                </span>
                {/* Number */}
                <span className="absolute top-3 right-3 text-5xl font-black text-white/20 font-[Playfair_Display] leading-none select-none">
                  01
                </span>
                {/* Caption overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white text-[17px] md:text-[19px] font-bold font-[Playfair_Display] leading-snug line-clamp-3 mb-2">
                    {hero.title}
                  </h3>
                  <span className="text-white/60 text-[11px] font-[Inter] flex items-center gap-1">
                    <Clock size={10} /> {fmt(hero)}
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* Right — #2-6 small image rows */}
          <div className="lg:col-span-7 flex flex-col divide-y divide-gray-200">
            {sideItems.map((s, i) => (
              <Link
                key={s.id}
                href={`/news/${s.slug}`}
                className="group flex gap-4 items-start py-3.5 first:pt-0 hover:bg-white hover:shadow-sm transition-all -mx-2 px-2 rounded-sm"
              >
                {/* Number */}
                <span className="text-3xl md:text-4xl font-black leading-none text-gray-100 group-hover:text-primary/20 transition-colors shrink-0 w-8 text-right font-[Playfair_Display] pt-0.5">
                  {String(i + 2).padStart(2, "0")}
                </span>
                {/* Thumbnail image */}
                <div className="relative w-[80px] h-[60px] shrink-0 rounded-sm overflow-hidden bg-gray-200">
                  <Image
                    src={imgSrc(s)}
                    alt={s.title}
                    fill unoptimized
                    sizes="80px"
                    className="object-cover group-hover:scale-105 transition-transform duration-400"
                  />
                </div>
                {/* Text */}
                <div className="flex-1 min-w-0">
                  <span className="text-[9.5px] font-black text-primary uppercase tracking-widest block mb-0.5 font-[Inter]">
                    {catName(s.category)}
                  </span>
                  <h3 className="text-[14px] md:text-[15px] font-bold leading-snug text-gray-900 group-hover:text-primary transition-colors font-[Playfair_Display] line-clamp-2">
                    {s.title}
                  </h3>
                  <span className="text-[11px] text-gray-400 mt-1 flex items-center gap-1 font-[Inter]">
                    <Clock size={10} /> {fmt(s)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
