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

const ACCENT_COLORS = ["#C41E3A", "#1E5B8A", "#B8860B"];

/**
 * ThreeColDesk — Reuters-style 3-column topic desk.
 * Each column: colored top border + lead image card + 3 small image+title rows.
 * White background, sharp dividers. ALL stories have images.
 */
function ColDesk({ category, posts = [], accentColor }) {
  if (!posts.length) return null;
  const [lead, ...rest] = posts;
  return (
    <div className="min-w-0 flex flex-col">
      {/* Colored top bar */}
      <div
        className="h-1 w-full mb-4 rounded-sm"
        style={{ background: accentColor }}
      />
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[13px] font-black uppercase tracking-[0.18em] text-gray-900 font-[Inter]">
          {category.name}
        </h2>
        <Link
          href={`/${category.slug}`}
          className="flex items-center gap-0.5 text-[10px] font-bold text-gray-400 hover:opacity-80 transition-opacity uppercase tracking-wide font-[Inter]"
          style={{ color: accentColor }}
        >
          More <ChevronRight size={11} />
        </Link>
      </div>

      {/* Lead image card */}
      {lead && (
        <Link href={`/news/${lead.slug}`} className="group block mb-4">
          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-sm mb-2.5">
            <Image
              src={imgSrc(lead)}
              alt={lead.title}
              fill unoptimized
              sizes="(max-width:768px) 100vw, 30vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <span
              className="absolute top-2 left-2 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 font-[Inter]"
              style={{ background: accentColor }}
            >
              {catLabel(lead.category)}
            </span>
          </div>
          <h3 className="text-[14px] font-bold text-gray-950 font-[Playfair_Display] leading-snug line-clamp-2 group-hover:opacity-75 transition-opacity">
            {lead.title}
          </h3>
          {lead.excerpt && (
            <p className="text-[11.5px] text-gray-500 mt-1 line-clamp-1 font-[Inter]">{lead.excerpt}</p>
          )}
          <p className="text-[10px] text-gray-400 mt-1 font-[Inter]">{fmtDate(lead)}</p>
        </Link>
      )}

      {/* 3 small image + title rows */}
      <ul className="flex flex-col divide-y divide-gray-100 mt-auto">
        {rest.slice(0, 3).map((p) => (
          <li key={p.id}>
            <Link href={`/news/${p.slug}`} className="group flex gap-3 items-start py-3 first:pt-0">
              <div className="relative w-16 h-12 shrink-0 rounded-sm overflow-hidden bg-gray-100">
                <Image
                  src={imgSrc(p)}
                  alt={p.title}
                  fill unoptimized
                  sizes="64px"
                  className="object-cover group-hover:scale-105 transition-transform duration-400"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-gray-900 font-[Inter] leading-snug line-clamp-2 group-hover:opacity-70 transition-opacity">
                  {p.title}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5 font-[Inter]">{fmtDate(p)}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ThreeColDesk({ desks = [] }) {
  // desks = [{ category, posts }, { category, posts }, { category, posts }]
  const active = desks.filter((d) => d.posts?.length > 0);
  if (!active.length) return null;

  return (
    <section className="bg-white border-t border-gray-200 py-10 md:py-12">
      <div className="max-w-[1280px] mx-auto px-4">
        <div
          className="grid gap-8 lg:gap-10"
          style={{ gridTemplateColumns: `repeat(${Math.min(active.length, 3)}, minmax(0,1fr))` }}
        >
          {active.map(({ category, posts }, i) => (
            <div
              key={category.slug || i}
              className={i > 0 ? "lg:border-l lg:border-gray-200 lg:pl-10" : ""}
            >
              <ColDesk
                category={category}
                posts={posts}
                accentColor={ACCENT_COLORS[i % ACCENT_COLORS.length]}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
