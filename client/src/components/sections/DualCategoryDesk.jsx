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
 * DualCategoryDesk — Two big desks side by side (e.g. Politics + Economy).
 * Left desk: Lead full-width image + 2 secondary images in a row.
 * Right desk: 2 top images + 1 lead image below (reversed pyramid).
 * ALL cards have images. Layout inspired by CNN's "More Top Stories" + BBC asymmetric.
 */
function DeskLeft({ category, posts = [] }) {
  if (!posts.length) return null;
  const [lead, second, third, ...rest] = posts;
  return (
    <div className="flex flex-col gap-0 min-w-0">
      {/* Desk header */}
      <div className="flex items-center justify-between border-b-[3px] border-primary pb-2 mb-4">
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

      {/* Lead — full width image */}
      {lead && (
        <Link href={`/news/${lead.slug}`} className="group block mb-4">
          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-sm mb-2.5">
            <Image
              src={imgSrc(lead)}
              alt={lead.title}
              fill unoptimized
              sizes="(max-width:768px) 100vw, 45vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <span className="absolute top-2 left-2 bg-primary text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 font-[Inter]">
              {catLabel(lead.category)}
            </span>
          </div>
          <h3 className="text-[15px] md:text-[16px] font-bold text-gray-950 font-[Playfair_Display] leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {lead.title}
          </h3>
          {lead.excerpt && (
            <p className="text-[12px] text-gray-500 mt-1 line-clamp-1 font-[Inter]">{lead.excerpt}</p>
          )}
          <p className="text-[10px] text-gray-400 mt-1 font-[Inter]">{fmtDate(lead)}</p>
        </Link>
      )}

      {/* Two secondary cards side by side */}
      <div className="grid grid-cols-2 gap-3">
        {[second, third].filter(Boolean).map((p) => (
          <Link key={p.id} href={`/news/${p.slug}`} className="group block">
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-sm mb-2">
              <Image
                src={imgSrc(p)}
                alt={p.title}
                fill unoptimized
                sizes="(max-width:768px) 50vw, 20vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h4 className="text-[12px] font-bold text-gray-900 font-[Inter] leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {p.title}
            </h4>
            <p className="text-[10px] text-gray-400 mt-1 font-[Inter]">{fmtDate(p)}</p>
          </Link>
        ))}
      </div>

      {/* Extra text-image rows for more stories */}
      {rest.slice(0, 2).length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-2.5">
          {rest.slice(0, 2).map((p) => (
            <Link key={p.id} href={`/news/${p.slug}`} className="group flex gap-3 items-start">
              <div className="relative w-16 h-12 shrink-0 rounded-sm overflow-hidden bg-gray-100">
                <Image src={imgSrc(p)} alt={p.title} fill unoptimized sizes="64px" className="object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11.5px] font-semibold text-gray-900 font-[Inter] leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {p.title}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5 font-[Inter]">{fmtDate(p)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function DeskRight({ category, posts = [] }) {
  if (!posts.length) return null;
  const [first, second, lead, ...rest] = posts;
  return (
    <div className="flex flex-col gap-0 min-w-0">
      {/* Desk header */}
      <div className="flex items-center justify-between border-b-[3px] border-accent pb-2 mb-4">
        <h2 className="text-[13px] font-black uppercase tracking-[0.18em] text-gray-900 font-[Inter]">
          {category.name}
        </h2>
        <Link
          href={`/${category.slug}`}
          className="flex items-center gap-0.5 text-[10px] font-bold text-gray-400 hover:text-accent transition-colors uppercase tracking-wide font-[Inter]"
        >
          More <ChevronRight size={11} />
        </Link>
      </div>

      {/* Two top cards side by side */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[first, second].filter(Boolean).map((p) => (
          <Link key={p.id} href={`/news/${p.slug}`} className="group block">
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-sm mb-2">
              <Image
                src={imgSrc(p)}
                alt={p.title}
                fill unoptimized
                sizes="(max-width:768px) 50vw, 20vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-2 left-2 bg-accent text-white text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 font-[Inter]">
                {catLabel(p.category)}
              </span>
            </div>
            <h4 className="text-[12px] font-bold text-gray-900 font-[Inter] leading-snug line-clamp-2 group-hover:text-accent transition-colors">
              {p.title}
            </h4>
            <p className="text-[10px] text-gray-400 mt-1 font-[Inter]">{fmtDate(p)}</p>
          </Link>
        ))}
      </div>

      {/* Big lead image below */}
      {lead && (
        <Link href={`/news/${lead.slug}`} className="group block mb-4">
          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-sm mb-2.5">
            <Image
              src={imgSrc(lead)}
              alt={lead.title}
              fill unoptimized
              sizes="(max-width:768px) 100vw, 45vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
          <h3 className="text-[15px] md:text-[16px] font-bold text-gray-950 font-[Playfair_Display] leading-snug group-hover:text-accent transition-colors line-clamp-2">
            {lead.title}
          </h3>
          <p className="text-[10px] text-gray-400 mt-1 font-[Inter]">{fmtDate(lead)}</p>
        </Link>
      )}

      {/* Extra rows */}
      {rest.slice(0, 2).length > 0 && (
        <div className="mt-1 pt-3 border-t border-gray-100 space-y-2.5">
          {rest.slice(0, 2).map((p) => (
            <Link key={p.id} href={`/news/${p.slug}`} className="group flex gap-3 items-start">
              <div className="relative w-16 h-12 shrink-0 rounded-sm overflow-hidden bg-gray-100">
                <Image src={imgSrc(p)} alt={p.title} fill unoptimized sizes="64px" className="object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11.5px] font-semibold text-gray-900 font-[Inter] leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                  {p.title}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5 font-[Inter]">{fmtDate(p)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DualCategoryDesk({ leftCategory, leftPosts = [], rightCategory, rightPosts = [] }) {
  if (!leftPosts.length && !rightPosts.length) return null;
  return (
    <section className="bg-[#f8f9fa] border-t border-gray-200 py-10 md:py-12">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <DeskLeft category={leftCategory} posts={leftPosts} />
          <div className="lg:border-l lg:border-gray-200 lg:pl-12">
            <DeskRight category={rightCategory} posts={rightPosts} />
          </div>
        </div>
      </div>
    </section>
  );
}
