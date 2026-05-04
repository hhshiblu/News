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

function GridHalf({ category, posts = [] }) {
  if (!posts.length) return null;
  const [lead, ...others] = posts.slice(0, 5);

  return (
    <div className="flex flex-col min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between border-b-[3px] border-primary pb-2 mb-5">
        <h2 className="text-[14px] font-black uppercase tracking-[0.18em] text-gray-900 font-[Inter]">
          {category.name}
        </h2>
        <Link
          href={`/${category.slug}`}
          className="flex items-center gap-0.5 text-[10px] font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-wide font-[Inter]"
        >
          View All <ChevronRight size={12} />
        </Link>
      </div>

      {/* Lead Item */}
      {lead && (
        <Link href={`/news/${lead.slug}`} className="group block mb-4">
          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-sm bg-gray-900">
            <Image
              src={imgSrc(lead)}
              alt={lead.title}
              fill unoptimized
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            
            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
              <h3 className="text-[18px] md:text-[22px] font-bold text-white font-[Playfair_Display] leading-tight group-hover:text-primary-light transition-colors mb-2 line-clamp-2">
                {lead.title}
              </h3>
              <p className="text-[10px] text-gray-300 font-[Inter] uppercase tracking-wider">
                {fmtDate(lead)}
              </p>
            </div>
          </div>
        </Link>
      )}

      {/* 2x2 Grid below */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
        {others.map((p, i) => (
          <Link key={p.id || i} href={`/news/${p.slug}`} className="group block">
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-sm mb-2">
              <Image
                src={imgSrc(p)}
                alt={p.title}
                fill unoptimized
                sizes="(max-width:1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h4 className="text-[12px] md:text-[13px] font-bold text-gray-800 font-[Inter] leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {p.title}
            </h4>
            <p className="text-[9px] text-gray-400 mt-1 font-[Inter]">
              {fmtDate(p)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function DualCategoryGrid({ desk1, desk2 }) {
  if (!desk1 && !desk2) return null;

  return (
    <section className="bg-white py-10 md:py-12 border-t border-gray-100">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {desk1 && <GridHalf category={desk1.category} posts={desk1.posts} />}
          {desk2 && (
            <div className="lg:border-l lg:border-gray-200 lg:pl-8">
              <GridHalf category={desk2.category} posts={desk2.posts} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
