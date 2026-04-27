import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

function imgSrc(p) {
  return p?.featuredImage || p?.image || "/placeholder.jpg";
}

function GridHalf({ category, posts = [] }) {
  const [lead, m1, m2, s1, s2, s3] = posts;

  if (!posts.length) {
    return (
      <div className="flex flex-col min-w-0 h-full">
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
        <div className="flex items-center justify-center bg-gray-50 h-[300px] border border-gray-100 rounded-sm">
          <p className="text-sm text-gray-400 font-[Inter]">No stories published yet.</p>
        </div>
      </div>
    );
  }

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

      {/* Grid of up to 9 items */}
      <div className="grid grid-cols-6 gap-3">
        {/* Big Lead (1) */}
        {lead && (
          <Link href={`/news/${lead.slug}`} className="col-span-6 group block relative rounded-sm overflow-hidden aspect-[16/9] bg-gray-900 mb-1">
            <Image
              src={imgSrc(lead)}
              alt={lead.title}
              fill unoptimized
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
              <span className="bg-primary text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 mb-2 inline-block">
                {category.name}
              </span>
              <h3 className="text-[16px] md:text-[20px] font-bold text-white font-[Playfair_Display] leading-snug line-clamp-2">
                {lead.title}
              </h3>
            </div>
          </Link>
        )}

        {/* Medium (2) */}
        {[m1, m2].filter(Boolean).map((p, i) => (
          <Link key={p.id || i} href={`/news/${p.slug}`} className="col-span-3 group block relative rounded-sm overflow-hidden aspect-[4/3] bg-gray-900 mb-1">
            <Image
              src={imgSrc(p)}
              alt={p.title}
              fill unoptimized
              sizes="(max-width:1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h3 className="text-[12px] md:text-[14px] font-bold text-white font-[Playfair_Display] leading-snug line-clamp-2">
                {p.title}
              </h3>
            </div>
          </Link>
        ))}

        {/* Small (3) */}
        {[s1, s2, s3].filter(Boolean).map((p, i) => (
          <Link key={p.id || i} href={`/news/${p.slug}`} className="col-span-2 group block relative rounded-sm overflow-hidden aspect-[4/3] bg-gray-900">
            <Image
              src={imgSrc(p)}
              alt={p.title}
              fill unoptimized
              sizes="(max-width:1024px) 33vw, 16vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-2 md:p-2.5">
              <h3 className="text-[10px] md:text-[11px] font-semibold text-white font-[Inter] leading-tight line-clamp-2">
                {p.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function CategoryImageGridDesk({ desks = [] }) {
  if (!desks.length) return null;

  // Chunk into pairs of 2 for the 2-column layout
  const pairs = [];
  for (let i = 0; i < desks.length; i += 2) {
    pairs.push(desks.slice(i, i + 2));
  }

  return (
    <div className="bg-white">
      {pairs.map((pair, index) => (
        <section key={index} className="border-t border-gray-200 py-10 md:py-12">
          <div className="max-w-[1280px] mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <GridHalf category={pair[0].category} posts={pair[0].posts} />
              {pair[1] && (
                <div className="lg:border-l lg:border-gray-200 lg:pl-12">
                  <GridHalf category={pair[1].category} posts={pair[1].posts} />
                </div>
              )}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
