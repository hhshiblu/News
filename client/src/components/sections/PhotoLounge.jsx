import Link from "next/link";
import Image from "next/image";
import { Camera, ChevronRight } from "lucide-react";

function catName(c) { return typeof c==="object" ? c?.name : c||"Photo"; }

/**
 * PhotoLounge — full-width dark section, photos only (no video).
 * Large panoramic lead + 3 vertical portrait cards beside it.
 */
export default function PhotoLounge({ photoPosts = [] }) {
  if (!photoPosts.length) return null;

  const lead   = photoPosts[0];
  const others = photoPosts.slice(1, 5);

  return (
    <section className="bg-[#111] py-10">
      <div className="max-w-[1280px] mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <Camera size={15} className="text-primary"/>
            <h2 className="text-[12px] font-black uppercase tracking-[0.25em] text-white font-[Inter]">
              Photo Stories
            </h2>
          </div>
          <Link href="/photo" className="text-[10px] font-bold text-gray-500 hover:text-white flex items-center gap-1 uppercase tracking-widest transition-colors font-[Inter]">
            View All <ChevronRight size={11}/>
          </Link>
        </div>

        {/* Grid: wide lead [left] + 4 portrait cards [right] */}
        <div className="grid grid-cols-12 gap-4">
          {/* Lead — big landscape */}
          {lead && (
            <Link href={`/news/${lead.slug}`} className="col-span-12 md:col-span-6 group relative overflow-hidden block">
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <Image
                  src={lead.featuredImage||lead.image||"https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800"}
                  alt={lead.title} fill unoptimized sizes="(max-width:768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"/>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="text-[9px] font-bold text-white/70 uppercase tracking-widest block mb-1 font-[Inter]">{catName(lead.category)}</span>
                  <h3 className="text-white text-[18px] font-bold leading-snug font-[Playfair_Display] line-clamp-2">{lead.title}</h3>
                </div>
              </div>
            </Link>
          )}

          {/* 4 portrait cards in a 2×2 grid */}
          <div className="col-span-12 md:col-span-6 grid grid-cols-2 gap-4">
            {others.map(s => (
              <Link key={s.id} href={`/news/${s.slug}`} className="group relative overflow-hidden block">
                <div className="relative w-full aspect-[3/4] overflow-hidden">
                  <Image
                    src={s.featuredImage||s.image||"https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400"}
                    alt={s.title} fill unoptimized sizes="(max-width:768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-600"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"/>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white text-[12px] font-bold leading-snug font-[Playfair_Display] line-clamp-2">{s.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
