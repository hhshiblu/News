import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";

function catName(c) { return typeof c === "object" ? c?.name : c || "News"; }
function fmtDate(p) {
  const d = p?.publishedAt || p?.createdAt;
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function imgSrc(p) {
  return p?.featuredImage || p?.image || "/placeholder.jpg";
}

/**
 * HomeHeadlinesRiver v2 — 4-column image card grid (BBC Top Stories style)
 * Replaces the old 2-col text-only river.
 * 3 rows × 4 cols = 12 image cards.
 * Light gray background (#f3f4f6).
 */
export function HomeHeadlinesRiver({ posts = [], title = "Latest Stories" }) {
  const list = posts.filter(Boolean).slice(0, 12);
  if (list.length < 4) return null;

  return (
    <section className="bg-[#f3f4f6]/80 border-t border-gray-200 py-10 md:py-12">
      <div className="max-w-[1280px] mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-6 bg-primary rounded-full shrink-0" />
          <h2 className="text-[13px] font-black uppercase tracking-[0.22em] text-gray-900 font-[Inter]">
            {title}
          </h2>
          <div className="h-px flex-1 bg-gray-300" />
        </div>

        {/* 4-col image grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {list.map((p) => (
            <Link key={p.id} href={`/news/${p.slug}`} className="group block">
              <div className="relative w-full aspect-[16/9] overflow-hidden rounded-sm mb-2.5 bg-gray-200">
                <Image
                  src={imgSrc(p)}
                  alt={p.title}
                  fill unoptimized
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                <span className="absolute top-2 left-2 bg-primary text-white text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 font-[Inter]">
                  {catName(p.category)}
                </span>
              </div>
              <h3 className="text-[13px] md:text-[14px] font-bold text-gray-900 font-[Playfair_Display] leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-1">
                {p.title}
              </h3>
              <p className="text-[10px] text-gray-400 font-[Inter] flex items-center gap-1">
                <Clock size={9} /> {fmtDate(p)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * HomeHeadlinesRiver also exports HomeMagazineDesks and HomeTitleCardBand stubs
 * to avoid breaking old imports (they are no longer used on homepage,
 * but other pages or tests may import them).
 */
export function HomeMagazineDesks() { return null; }
export function HomeTitleCardBand() { return null; }
