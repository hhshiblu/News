import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";

function catName(c) { return typeof c === "object" ? c?.name : c || "News"; }
function fmt(s) {
  const d = s.publishedAt || s.createdAt;
  try {
    if (d) return new Date(d).toLocaleDateString("en-BD", { day: "2-digit", month: "short", year: "numeric" });
  } catch { /* fall through */ }
  return s.timestamp || "";
}

/**
 * MustReadSection v2 — Opinion / Must Read
 * Dark background (#0f172a), 3 horizontal image cards.
 * Each card: image on top, author avatar + name + title below.
 * CNN Opinion bar style.
 */
export default function MustReadSection({ posts = [] }) {
  if (!posts.length) return null;
  const cards = posts.slice(0, 3);

  return (
    <section className="bg-[#0f172a] py-10 md:py-12">
      <div className="max-w-[1280px] mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0" />
          <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-gray-400 font-[Inter]">
            Opinion & Must Read
          </h2>
          <div className="h-px flex-1 bg-gray-700" />
          <Link href="/editorial" className="text-[10px] font-bold text-gray-500 hover:text-primary transition-colors uppercase tracking-widest font-[Inter]">
            View All →
          </Link>
        </div>

        {/* 3 horizontal image cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-700/60">
          {cards.map((post, i) => (
            <Link
              key={post.id}
              href={`/news/${post.slug}`}
              className={`group flex flex-col gap-0 hover:bg-white/5 transition-colors ${i === 0 ? "md:pr-7" : i === 1 ? "md:px-7" : "md:pl-7"} py-0 md:py-0`}
            >
              {/* Card image */}
              <div className="relative w-full aspect-[16/9] overflow-hidden rounded-sm mb-4 bg-gray-800">
                <Image
                  src={post.featuredImage || post.image || "/placeholder.jpg"}
                  alt={post.title}
                  fill unoptimized
                  sizes="(max-width:768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute top-2 left-2 bg-primary text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 font-[Inter]">
                  Opinion
                </span>
              </div>

              {/* Author row */}
              <div className={`flex items-center gap-2 mb-3 ${i === 0 ? "" : "mt-4 md:mt-0"}`}>
                <div className="relative w-7 h-7 rounded-full overflow-hidden bg-gray-600 shrink-0">
                  <Image
                    src={post.author?.image || "/placeholder.jpg"}
                    alt={typeof post.author === "object" ? post.author?.name : "Author"}
                    fill unoptimized sizes="28px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-300 font-[Inter] leading-none">
                    {typeof post.author === "object" ? post.author?.name : post.author || "Editorial"}
                  </p>
                  <p className="text-[9px] text-gray-500 font-[Inter]">Columnist</p>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-white text-[15px] md:text-[16px] font-bold font-[Playfair_Display] leading-snug line-clamp-3 group-hover:text-gray-300 transition-colors mb-2">
                {post.title}
              </h3>
              {post.excerpt && (
                <p className="text-gray-500 text-[12px] leading-relaxed line-clamp-2 font-[Inter] mb-2">
                  {post.excerpt}
                </p>
              )}
              <span className="text-[10px] text-gray-600 flex items-center gap-1 font-[Inter] mt-auto">
                <Clock size={9} /> {fmt(post)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
