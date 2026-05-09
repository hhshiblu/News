import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { getImageUrl } from "@/lib/apiBaseUrl";

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
    <section className="bg-white py-10 md:py-12 border-t border-gray-100">
      <div className="max-w-[1280px] mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0" />
          <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-gray-900 font-[Inter]">
            Opinion & Must Read
          </h2>
          <div className="h-px flex-1 bg-gray-200" />
          <Link href="/editorial" className="text-[10px] font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-widest font-[Inter]">
            View All →
          </Link>
        </div>

        {/* 3 horizontal image cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((post, i) => (
            <Link
              key={post.id}
              href={`/news/${post.slug}`}
              className={`group flex flex-col gap-0 rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300`}
            >
              {/* Card image */}
              <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100">
                <Image
                  src={getImageUrl(post.featuredImage || post.image)}
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
              <div className={`flex items-center gap-2 px-4 pt-4 mb-2`}>
                <div className="relative w-7 h-7 rounded-full overflow-hidden bg-gray-200 shrink-0">
                  <Image
                    src={getImageUrl(post.author?.avatar || post.author?.image)}
                    alt={typeof post.author === "object" ? post.author?.name : "Author"}
                    fill unoptimized sizes="28px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-900 font-[Inter] leading-none">
                    {typeof post.author === "object" ? post.author?.name : post.author || "Editorial"}
                  </p>
                  <p className="text-[9px] text-gray-400 font-[Inter]">Columnist</p>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-gray-900 text-[15px] md:text-[16px] font-bold font-[Playfair_Display] leading-snug line-clamp-3 group-hover:text-primary transition-colors mb-2 px-4">
                {post.title}
              </h3>
              {post.excerpt && (
                <p className="text-gray-500 text-[12px] leading-relaxed line-clamp-2 font-[Inter] mb-2 px-4">
                  {post.excerpt}
                </p>
              )}
              <span className="text-[10px] text-gray-400 flex items-center gap-1 font-[Inter] mt-auto px-4 pb-4">
                <Clock size={9} /> {fmt(post)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
