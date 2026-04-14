import Link from "next/link";
import Image from "next/image";
import { BookOpen, Clock } from "lucide-react";

function catName(c) { return typeof c==="object" ? c?.name : c || "News"; }
function fmt(s) {
  const d = s.publishedAt || s.createdAt;
  try {
    if (d) return new Date(d).toLocaleDateString("en-BD", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    /* fall through */
  }
  return s.timestamp || "";
}

/**
 * MustReadSection — replaces the old Opinion section.
 * Layout: 1 large card (left, with image) + 3 compact text cards (right column)
 * Full-width, no sidebar. Premium editorial feel.
 */
export default function MustReadSection({ posts = [] }) {
  if (!posts.length) return null;
  const [lead, ...rest] = posts;

  return (
    <section className="border-t border-gray-200 pt-8 pb-2">
      {/* Header */}
      <div className="flex items-center gap-3 mb-7">
        <BookOpen size={16} className="text-primary" />
        <h2 className="text-[13px] font-black uppercase tracking-[0.22em] text-gray-900 font-[Inter]">
          Must Read
        </h2>
        <div className="h-px flex-1 bg-gray-200" />
        <Link href="/editorial" className="text-[10px] font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-widest font-[Inter]">
          View All →
        </Link>
      </div>
      <div className="text-[11px] text-gray-500 font-[Inter] leading-relaxed mb-6 max-w-3xl space-y-2">
        <p>
          <strong className="text-gray-700">Must read কী?</strong> প্রথমে আমরা ড্যাশবোর্ডে{" "}
          <strong>Opinion / মতামত</strong> হিসেবে মার্ক করা আর্টিকেলগুলো দেখাই (সর্বোচ্চ ৫টা)। বড় ছবি যেটা—সেটাই
          লিড; ডান পাশে আরও চারটা লিংক। যদি এ ধরনের কিছু না থাকে, তখনই আমরা <strong>সর্বশেষ নিউজ ফিড</strong>
          দিয়ে একই লেআউট ভরাই, যাতে ব্লক খালি না থাকে।
        </p>
        <p className="text-gray-400">
          <strong className="text-gray-600">EN:</strong> Opinion-tagged posts first (up to five); if none exist,
          the same slots use the latest wires from the home feed.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Lead card — large, with image */}
        {lead && (
          <Link href={`/news/${lead.slug}`} className="lg:col-span-5 group block">
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-sm mb-4">
              <Image
                src={lead.featuredImage || lead.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=700"}
                alt={lead.title} fill unoptimized
                sizes="(max-width:768px) 100vw, 42vw"
                className="object-cover group-hover:scale-105 transition-transform duration-600"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <span className="absolute top-3 left-3 bg-primary text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 font-[Inter]">
                Opinion
              </span>
            </div>

            {/* Author row */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden relative shrink-0">
                <Image
                  src={lead.author?.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64"}
                  alt="Author" fill unoptimized sizes="32px" className="object-cover"
                />
              </div>
              <div>
                <p className="text-[12px] font-bold text-gray-800 font-[Inter] leading-none">
                  {typeof lead.author==="object" ? lead.author?.name : lead.author || "Editorial"}
                </p>
                <p className="text-[10px] text-gray-400 font-[Inter]">Columnist</p>
              </div>
            </div>

            <h3 className="text-[20px] font-bold leading-snug text-gray-950 font-[Playfair_Display] group-hover:text-primary transition-colors mb-2">
              {lead.title}
            </h3>
            {lead.excerpt && (
              <p className="text-[13px] text-gray-600 leading-relaxed line-clamp-2 font-[Inter]">
                {lead.excerpt}
              </p>
            )}
          </Link>
        )}

        {/* Right: 3 compact text rows + 1 extra with thumbnail */}
        <div className="lg:col-span-7 divide-y divide-gray-100 self-start">
          {rest.slice(0, 4).map((s, i) => (
            <Link key={s.id} href={`/news/${s.slug}`}
              className="flex gap-4 items-start py-5 first:pt-0 group hover:bg-gray-50/60 -mx-2 px-2 transition-colors">
              {/* Only show thumbnail on first item */}
              {i === 0 && (s.featuredImage || s.image) && (
                <div className="relative w-[100px] h-[72px] shrink-0 overflow-hidden rounded-sm">
                  <Image src={s.featuredImage||s.image} alt={s.title} fill unoptimized sizes="100px"
                    className="object-cover group-hover:scale-105 transition-transform"/>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-black text-primary uppercase tracking-widest block mb-1 font-[Inter]">
                  {catName(s.category)}
                </span>
                <h3 className={`font-bold leading-snug text-gray-900 group-hover:text-primary transition-colors font-[Playfair_Display] line-clamp-2 ${i===0 ? "text-[16px]" : "text-[14px]"}`}>
                  {s.title}
                </h3>
                {i === 0 && s.excerpt && (
                  <p className="text-[12px] text-gray-500 mt-1 line-clamp-1 font-[Inter]">{s.excerpt}</p>
                )}
                <span className="text-[10.5px] text-gray-400 flex items-center gap-1 mt-1.5 font-[Inter]">
                  <Clock size={9}/> {fmt(s)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
