import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

function imgSrc(p) {
  return p?.featuredImage || p?.image || "/placeholder.jpg";
}
function fmtDate(p) {
  const d = p?.publishedAt || p?.createdAt;
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function catLabel(c) {
  return typeof c === "object" ? c?.name : c || "News";
}

/**
 * MosaicGrid — BBC Magazine Mosaic style.
 * Two categories side by side: Labour + International (or any two).
 * Left: 1 big card (row-span) + 2 stacked medium cards beside it.
 * Right: 2x2 equal grid of image cards.
 * ALL cells have images. White background with clean borders.
 */
function MosaicHalf({ category, posts = [], accent = "primary" }) {
  if (!posts.length) return null;
  const [lead, a, b, c, d] = posts;
  const accentClass = accent === "primary" ? "border-primary" : "border-accent";
  const hoverClass = accent === "primary" ? "group-hover:text-primary" : "group-hover:text-accent";
  const badgeClass = accent === "primary" ? "bg-primary" : "bg-accent";

  return (
    <div className="min-w-0">
      {/* Section header */}
      <div className={`flex items-center justify-between border-b-[3px] ${accentClass} pb-2 mb-5`}>
        <h2 className="text-[13px] font-black uppercase tracking-[0.18em] text-gray-900 font-[Inter]">
          {category.name}
        </h2>
        <Link
          href={`/${category.slug}`}
          className="flex items-center gap-0.5 text-[10px] font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-wide font-[Inter]"
        >
          More <ChevronRight size={11} />
        </Link>
      </div>

      {/* Mosaic layout: big left + 2 stacked right */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Big lead — spans 1 col but taller aspect */}
        {lead && (
          <Link href={`/news/${lead.slug}`} className="group block">
            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-sm mb-2">
              <Image
                src={imgSrc(lead)}
                alt={lead.title}
                fill unoptimized
                sizes="(max-width:768px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-600"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <span className={`absolute top-2 left-2 ${badgeClass} text-white text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 font-[Inter]`}>
                Lead
              </span>
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className={`text-[12px] font-black uppercase tracking-wider text-white/70 font-[Inter] mb-1`}>
                  {catLabel(lead.category)}
                </p>
                <h3 className="text-white text-[13px] font-bold font-[Playfair_Display] leading-snug line-clamp-3">
                  {lead.title}
                </h3>
              </div>
            </div>
          </Link>
        )}

        {/* Right: 2 stacked */}
        <div className="flex flex-col gap-3">
          {[a, b].filter(Boolean).map((p) => (
            <Link key={p.id} href={`/news/${p.slug}`} className="group block">
              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-sm mb-1.5">
                <Image
                  src={imgSrc(p)}
                  alt={p.title}
                  fill unoptimized
                  sizes="(max-width:768px) 50vw, 20vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h4 className={`text-[12px] font-semibold text-gray-900 font-[Inter] leading-snug line-clamp-2 ${hoverClass} transition-colors`}>
                {p.title}
              </h4>
              <p className="text-[10px] text-gray-400 mt-0.5 font-[Inter]">{fmtDate(p)}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom: 2 small horizontal image cards */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
        {[c, d].filter(Boolean).map((p) => (
          <Link key={p.id} href={`/news/${p.slug}`} className="group flex gap-2.5 items-start">
            <div className="relative w-14 h-11 shrink-0 rounded-sm overflow-hidden bg-gray-100">
              <Image src={imgSrc(p)} alt={p.title} fill unoptimized sizes="56px" className="object-cover group-hover:scale-105 transition-transform" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-[11px] font-semibold text-gray-900 font-[Inter] leading-snug line-clamp-2 ${hoverClass} transition-colors`}>
                {p.title}
              </p>
              <p className="text-[9.5px] text-gray-400 mt-0.5 font-[Inter]">{fmtDate(p)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function MosaicGrid({
  leftCategory,
  leftPosts = [],
  rightCategory,
  rightPosts = [],
}) {
  if (!leftPosts.length && !rightPosts.length) return null;
  return (
    <section className="bg-white border-t border-gray-200 py-10 md:py-12">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <MosaicHalf category={leftCategory} posts={leftPosts} accent="primary" />
          <div className="lg:border-l lg:border-gray-200 lg:pl-12">
            <MosaicHalf category={rightCategory} posts={rightPosts} accent="accent" />
          </div>
        </div>
      </div>
    </section>
  );
}
