import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { getImageUrl } from "@/lib/apiBaseUrl";

function fmt(story) {
  const d = story.publishedAt || story.createdAt;
  if (!d) return story.timestamp || "";
  try {
    const now = new Date();
    const pub = new Date(d);
    const diffMs = now - pub;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return pub.toLocaleDateString("en-BD", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return story.timestamp || "";
  }
}
function catName(c) { return typeof c === "object" ? c?.name : c || "News"; }

/**
 * PulseHero v2 — Asymmetric Hero
 * Left (7 cols): Lead 16:9 image + 2 sub-stories image+title side by side
 * Right (5 cols): 2 featured image cards + 3 latest image+text rows
 * ALL cards have images. No text-only lists.
 */
export default function PulseHero({ featuredPosts = [], latestPosts = [] }) {
  if (!featuredPosts.length) return null;
  const lead       = featuredPosts[0];
  const subs       = featuredPosts.slice(1, 3);      // 2 sub-stories with images
  const rightCards = featuredPosts.slice(3, 6);       // 3 featured image cards in right col
  const latestRows = latestPosts.slice(0, 7);         // denser latest list to reduce blank space

  return (
    <section className="border-b-4 border-gray-900 pb-8 mb-0">
      <div className="grid grid-cols-12 gap-0">

        {/* ══ LEFT BLOCK (7 cols) ══ */}
        <div className="col-span-12 lg:col-span-7 border-r border-gray-200 pr-0 lg:pr-6">

          {/* Lead story — large 16:9 */}
          <Link href={`/news/${lead.slug}`} className="group block mb-5">
            <div className="relative w-full aspect-video overflow-hidden">
              <Image
                src={getImageUrl(lead.featuredImage || lead.image)}
                alt={lead.title}
                fill priority unoptimized
                sizes="(max-width:768px) 100vw, 57vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/25 to-transparent" />
              <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 font-[Inter]">
                {catName(lead.category)}
              </span>
            </div>
            <div className="mt-3">
              <h1 className="text-[1.75rem] font-bold leading-[1.2] text-gray-950 mb-2 font-[Playfair_Display] group-hover:text-primary transition-colors">
                {lead.title}
              </h1>
              {lead.excerpt && (
                <p className="text-[14px] text-gray-600 leading-relaxed line-clamp-2 mb-2.5 font-[Inter]">
                  {lead.excerpt}
                </p>
              )}
              <p className="text-[11.5px] text-gray-500 font-[Inter] flex items-center gap-2">
                <span className="font-semibold text-gray-700">
                  {typeof lead.reporter === "object" ? lead.reporter?.name : lead.reporter || "LabourPulse Staff"}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1"><Clock size={10} /> {fmt(lead)}</span>
              </p>
            </div>
          </Link>

          {/* Two sub-stories — hidden on mobile */}
          {subs.length > 0 && (
            <div className="hidden md:grid grid-cols-2 gap-4 pt-5 border-t border-gray-100">
              {subs.map((s) => (
                <Link key={s.id} href={`/news/${s.slug}`} className="group flex gap-3 items-start">
                  <div className="relative w-[90px] h-[68px] shrink-0 overflow-hidden rounded-sm">
                    <Image
                      src={getImageUrl(s.featuredImage || s.image)}
                      alt={s.title} fill unoptimized sizes="90px"
                      className="object-cover group-hover:scale-105 transition-transform duration-400"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold text-primary uppercase tracking-widest block mb-0.5 font-[Inter]">{catName(s.category)}</span>
                    <h3 className="text-[12.5px] font-bold leading-snug text-gray-900 group-hover:text-primary transition-colors font-[Inter] line-clamp-3">{s.title}</h3>
                    <span className="text-[10px] text-gray-400 mt-1 flex items-center gap-1 font-[Inter]"><Clock size={9} />{fmt(s)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ══ RIGHT BLOCK (5 cols) — Featured cards + Latest image rows ══ */}
        <div className="col-span-12 lg:col-span-5 pl-0 lg:pl-6 mt-6 lg:mt-0 flex flex-col gap-4">

          {/* 2 featured image cards — equal size */}
          {rightCards.map((s) => (
            <Link key={s.id} href={`/news/${s.slug}`} className="group flex gap-3 items-start">
              <div className="relative w-[110px] h-[80px] shrink-0 overflow-hidden rounded-sm">
                <Image
                  src={getImageUrl(s.featuredImage || s.image)}
                  alt={s.title} fill unoptimized sizes="110px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-black text-primary uppercase tracking-widest block mb-0.5 font-[Inter]">{catName(s.category)}</span>
                <h3 className="text-[13.5px] font-bold leading-snug text-gray-900 group-hover:text-primary transition-colors font-[Playfair_Display] line-clamp-3">{s.title}</h3>
                <span className="text-[10px] text-gray-400 mt-1 flex items-center gap-1 font-[Inter]"><Clock size={9}/>{fmt(s)}</span>
              </div>
            </Link>
          ))}

          {/* Divider */}
          {rightCards.length > 0 && latestRows.length > 0 && (
            <div className="border-b-2 border-gray-900 pb-2 flex items-center justify-between">
              <h2 className="text-[12px] font-black uppercase tracking-[0.22em] text-gray-900 font-[Inter]">Latest</h2>
              <Link href="/breaking" className="text-[10px] text-primary font-bold uppercase tracking-widest hover:underline font-[Inter]">View all →</Link>
            </div>
          )}

          {/* Latest — small image + title */}
          {latestRows.map((s) => (
            <Link key={s.id} href={`/news/${s.slug}`}
              className="flex gap-3 items-start group hover:bg-gray-50/60 transition-colors -mx-1 px-1 py-1 rounded">
              <div className="relative w-[70px] h-[52px] shrink-0 overflow-hidden rounded-sm">
                <Image
                  src={getImageUrl(s.featuredImage || s.image)}
                  alt={s.title} fill unoptimized sizes="70px"
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9.5px] font-black text-primary uppercase tracking-widest block mb-0.5 font-[Inter]">{catName(s.category)}</span>
                <h3 className="text-[12.5px] font-bold leading-snug text-gray-900 group-hover:text-primary transition-colors font-[Inter] line-clamp-2">{s.title}</h3>
                <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5 font-[Inter]"><Clock size={9}/>{fmt(s)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
