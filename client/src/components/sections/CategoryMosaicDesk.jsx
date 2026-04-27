import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

function imgSrc(p) {
  return p?.featuredImage || p?.image || "/placeholder.jpg";
}

export default function CategoryMosaicDesk({ desk }) {
  if (!desk || !desk.posts?.length) return null;
  const { category, posts } = desk;
  const [lead, m1, s1, s2, s3, s4] = posts;

  return (
    <section className="bg-white border-t border-gray-200 py-10 md:py-12">
      <div className="max-w-[1280px] mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b-[3px] border-primary pb-2 mb-6">
          <h2 className="text-[16px] md:text-[18px] font-black uppercase tracking-[0.18em] text-gray-900 font-[Inter]">
            {category.name}
          </h2>
          <Link
            href={`/${category.slug}`}
            className="flex items-center gap-0.5 text-[11px] font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-wide font-[Inter]"
          >
            Explore Section <ChevronRight size={13} />
          </Link>
        </div>

        {/* Mosaic Grid: 6 Items */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 md:grid-rows-3 h-auto md:h-[600px]">
          
          {/* Big Lead (Left side, spans 2 cols, 3 rows) */}
          {lead && (
            <Link
              href={`/news/${lead.slug}`}
              className="md:col-span-2 md:row-span-3 group block relative rounded-sm overflow-hidden aspect-[4/3] md:aspect-auto bg-gray-900"
            >
              <Image
                src={imgSrc(lead)}
                alt={lead.title}
                fill unoptimized
                sizes="(max-width:768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
                <span className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 mb-3 inline-block">
                  {category.name} Spotlight
                </span>
                <h3 className="text-[20px] md:text-[32px] font-bold text-white font-[Playfair_Display] leading-tight line-clamp-3">
                  {lead.title}
                </h3>
              </div>
            </Link>
          )}

          {/* Medium Top Right (Spans 2 cols, 1 row) */}
          {m1 && (
            <Link
              href={`/news/${m1.slug}`}
              className="md:col-span-2 md:row-span-1 group block relative rounded-sm overflow-hidden aspect-[16/9] md:aspect-auto bg-gray-900"
            >
              <Image
                src={imgSrc(m1)}
                alt={m1.title}
                fill unoptimized
                sizes="(max-width:768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-[16px] md:text-[18px] font-bold text-white font-[Playfair_Display] leading-snug line-clamp-2">
                  {m1.title}
                </h3>
              </div>
            </Link>
          )}

          {/* 4 Small Items (Bottom Right, 2x2 grid basically) */}
          {[s1, s2, s3, s4].filter(Boolean).map((p, i) => (
            <Link
              key={p.id || i}
              href={`/news/${p.slug}`}
              className="md:col-span-1 md:row-span-1 group block relative rounded-sm overflow-hidden aspect-square bg-gray-900"
            >
              <Image
                src={imgSrc(p)}
                alt={p.title}
                fill unoptimized
                sizes="(max-width:768px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-[11px] md:text-[13px] font-semibold text-white font-[Inter] leading-snug line-clamp-3 group-hover:text-primary-light transition-colors">
                  {p.title}
                </h3>
              </div>
            </Link>
          ))}

        </div>
      </div>
    </section>
  );
}
