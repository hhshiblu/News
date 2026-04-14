import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

function catName(c) { return typeof c === "object" ? c?.name : c || "News"; }

/**
 * IndustryGrid v2 — 4 fixed equal columns, each:
 *   - Red underlined category header
 *   - ONE image card (3:2 ratio)  
 *   - 4 text-only bullets (red dot separator)
 */
function CategoryCol({ category, posts = [], borderRight = false }) {
  if (!posts.length) return null;
  const [lead, ...rest] = posts;
  return (
    <div className={`flex flex-col min-w-0 ${borderRight ? "border-r border-gray-200 pr-4" : ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b-[2.5px] border-primary pb-2 mb-4">
        <h2 className="text-[12.5px] font-black uppercase tracking-[0.15em] text-gray-900 font-[Inter]">
          {category.name}
        </h2>
        <Link href={`/${category.slug}`}
          className="text-[10px] font-bold text-gray-400 flex items-center hover:text-primary transition-colors uppercase tracking-wide font-[Inter]">
          More <ChevronRight size={11}/>
        </Link>
      </div>

      {/* Lead image card */}
      {lead && (
        <Link href={`/news/${lead.slug}`} className="group block mb-4">
          <div className="relative w-full aspect-[3/2] overflow-hidden rounded-sm mb-2.5">
            <Image
              src={lead.featuredImage || lead.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400"}
              alt={lead.title} fill unoptimized sizes="(max-width:768px) 100vw, 22vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <h3 className="text-[14px] font-bold leading-snug text-gray-900 group-hover:text-primary transition-colors font-[Playfair_Display] line-clamp-2">
            {lead.title}
          </h3>
        </Link>
      )}

      {/* Bullet headlines — title only, no image */}
      <ul className="space-y-0 divide-y divide-gray-100">
        {rest.slice(0, 4).map(s => (
          <li key={s.id}>
            <Link href={`/news/${s.slug}`}
              className="flex items-start gap-2.5 py-2.5 group hover:opacity-75 transition-opacity">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"/>
              <span className="text-[12.5px] font-semibold text-gray-800 group-hover:text-primary transition-colors leading-snug font-[Inter] line-clamp-2">
                {s.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function IndustryGrid({ categories = [], postsByCategory = {} }) {
  const activeCats = categories.filter(c => (postsByCategory[c.slug]||postsByCategory[c.id]||[]).length > 0);
  if (!activeCats.length) return null;

  return (
    <section className="border-t border-gray-200 pt-8">
      <div className={`grid gap-6`}
        style={{ gridTemplateColumns: `repeat(${Math.min(activeCats.length, 4)}, minmax(0, 1fr))`}}>
        {activeCats.map((cat, idx) => (
          <CategoryCol
            key={cat.slug || cat.id}
            category={cat}
            posts={postsByCategory[cat.slug] || postsByCategory[cat.id] || []}
            borderRight={idx < activeCats.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
