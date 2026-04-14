import Link from "next/link";
import Image from "next/image";

function catName(c) { return typeof c === "object" ? c?.name : c || "News"; }

/**
 * EditorialStrip — a tight 3-column "From the Desk" strip
 * placed directly above the NewsletterSection red band.
 * Minimal, horizontal layout — no image on first card, image on the others.
 */
export default function EditorialStrip({ posts = [] }) {
  if (!posts.length) return null;

  const [a, b, c] = posts.slice(0, 3);

  return (
    <section className="bg-gray-950 py-10">
      <div className="max-w-[1280px] mx-auto px-4">
        {/* Label */}
        <div className="flex items-center gap-3 mb-7">
          <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 font-[Inter]">
            From the Desk
          </h2>
          <div className="flex-1 h-px bg-gray-800" />
        </div>

        {/* 3-col strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-800">
          
          {/* Col 1 — text only, large headline */}
          {a && (
            <Link href={`/news/${a.slug}`} className="group block p-6 md:pl-0 hover:bg-gray-900/40 transition-colors">
              <span className="text-[9px] font-black text-primary uppercase tracking-[0.25em] block mb-2 font-[Inter]">
                {catName(a.category)}
              </span>
              <h3 className="text-white text-[18px] font-bold leading-snug font-[Playfair_Display] mb-2 group-hover:text-gray-300 transition-colors">
                {a.title}
              </h3>
              {a.excerpt && (
                <p className="text-gray-500 text-[12.5px] leading-relaxed line-clamp-2 font-[Inter]">
                  {a.excerpt}
                </p>
              )}
            </Link>
          )}

          {/* Col 2 — small image + headline */}
          {b && (
            <Link href={`/news/${b.slug}`} className="group flex gap-4 items-start p-6 hover:bg-gray-900/40 transition-colors">
              <div className="relative w-[90px] h-[68px] shrink-0 overflow-hidden rounded-sm">
                <Image
                  src={b.featuredImage || b.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200"}
                  alt={b.title} fill unoptimized sizes="90px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-black text-primary uppercase tracking-[0.25em] block mb-1.5 font-[Inter]">
                  {catName(b.category)}
                </span>
                <h3 className="text-white text-[14px] font-bold leading-snug font-[Playfair_Display] line-clamp-3 group-hover:text-gray-300 transition-colors">
                  {b.title}
                </h3>
              </div>
            </Link>
          )}

          {/* Col 3 — small image + headline */}
          {c && (
            <Link href={`/news/${c.slug}`} className="group flex gap-4 items-start p-6 md:pr-0 hover:bg-gray-900/40 transition-colors">
              <div className="relative w-[90px] h-[68px] shrink-0 overflow-hidden rounded-sm">
                <Image
                  src={c.featuredImage || c.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200"}
                  alt={c.title} fill unoptimized sizes="90px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-black text-primary uppercase tracking-[0.25em] block mb-1.5 font-[Inter]">
                  {catName(c.category)}
                </span>
                <h3 className="text-white text-[14px] font-bold leading-snug font-[Playfair_Display] line-clamp-3 group-hover:text-gray-300 transition-colors">
                  {c.title}
                </h3>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
