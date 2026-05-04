import Link from "next/link";
import Image from "next/image";

function catName(c) { return typeof c === "object" ? c?.name : c || "News"; }
function fmtDate(p) {
  const d = p?.publishedAt || p?.createdAt;
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * EditorialStrip — Light background version.
 * Left: big image 4:3 + title + excerpt
 * Middle: 2 small image+title rows
 * Right: 2 small image+title rows
 */
export default function EditorialStrip({ posts = [] }) {
  if (!posts.length) return null;

  const [a, b, c, d, e] = posts.slice(0, 5);

  return (
    <section className="bg-[#f8f9fa] py-10 border-t border-gray-100">
      <div className="max-w-[1280px] mx-auto px-4">
        {/* Label */}
        <div className="flex items-center gap-3 mb-7">
          <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-900 font-[Inter]">
            From the Desk
          </h2>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* 3-col layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-0 md:divide-x md:divide-gray-200">

          {/* Col 1 — Big image + title + excerpt */}
          {a && (
            <Link href={`/news/${a.slug}`} className="group block md:col-span-5 md:pr-8">
              <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg mb-4 bg-gray-200">
                <Image
                  src={a.featuredImage || a.image || "/placeholder.jpg"}
                  alt={a.title} fill unoptimized
                  sizes="(max-width:768px) 100vw, 40vw"
                  className="object-cover group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="absolute top-2 left-2 bg-primary text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 font-[Inter]">
                  {catName(a.category)}
                </span>
              </div>
              <h3 className="text-gray-900 text-[18px] font-bold leading-snug font-[Playfair_Display] mb-2 group-hover:text-primary transition-colors">
                {a.title}
              </h3>
              {a.excerpt && (
                <p className="text-gray-500 text-[12.5px] leading-relaxed line-clamp-2 font-[Inter]">
                  {a.excerpt}
                </p>
              )}
              <p className="text-gray-400 text-[10px] mt-2 font-[Inter]">{fmtDate(a)}</p>
            </Link>
          )}

          {/* Col 2 — 2 small image rows */}
          <div className="md:col-span-4 flex flex-col gap-0 divide-y divide-gray-200 md:px-8">
            {[b, c].filter(Boolean).map((post) => (
              <Link key={post.id} href={`/news/${post.slug}`} className="group flex gap-4 items-start py-4 first:pt-0">
                <div className="relative w-[90px] h-[68px] shrink-0 overflow-hidden rounded-lg bg-gray-200">
                  <Image
                    src={post.featuredImage || post.image || "/placeholder.jpg"}
                    alt={post.title} fill unoptimized sizes="90px"
                    className="object-cover group-hover:scale-105 transition-all duration-500"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-black text-primary uppercase tracking-[0.25em] block mb-1.5 font-[Inter]">
                    {catName(post.category)}
                  </span>
                  <h3 className="text-gray-900 text-[14px] font-bold leading-snug font-[Playfair_Display] line-clamp-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 text-[10px] mt-1 font-[Inter]">{fmtDate(post)}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Col 3 — 2 small image rows */}
          <div className="md:col-span-3 flex flex-col gap-0 divide-y divide-gray-200 md:pl-8">
            {[d, e].filter(Boolean).map((post) => (
              <Link key={post.id} href={`/news/${post.slug}`} className="group flex gap-4 items-start py-4 first:pt-0">
                <div className="relative w-[80px] h-[60px] shrink-0 overflow-hidden rounded-lg bg-gray-200">
                  <Image
                    src={post.featuredImage || post.image || "/placeholder.jpg"}
                    alt={post.title} fill unoptimized sizes="80px"
                    className="object-cover group-hover:scale-105 transition-all duration-500"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-black text-primary uppercase tracking-[0.25em] block mb-1.5 font-[Inter]">
                    {catName(post.category)}
                  </span>
                  <h3 className="text-gray-900 text-[13px] font-bold leading-snug font-[Playfair_Display] line-clamp-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 text-[10px] mt-1 font-[Inter]">{fmtDate(post)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
