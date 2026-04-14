import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";

function catName(c) { return typeof c==="object" ? c?.name : c || "News"; }

/**
 * EditorPickWidget — a unique dark sidebar card for the Trending section.
 * Shows one featured "Editor's Choice" story in a premium design,
 * plus 2 smaller picks below.
 */
export default function EditorPickWidget({ posts = [] }) {
  if (!posts.length) return null;
  const [pick, ...rest] = posts;

  return (
    <div className="bg-gray-950 h-full flex flex-col rounded-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-800">
        <Sparkles size={13} className="text-amber-400" />
        <span className="text-[10.5px] font-black uppercase tracking-[0.28em] text-amber-400 font-[Inter]">
          Editor's Pick
        </span>
      </div>

      {/* Main Pick */}
      {pick && (
        <Link href={`/news/${pick.slug}`} className="group block relative overflow-hidden flex-shrink-0">
          <div className="relative w-full aspect-[16/9]">
            <Image
              src={pick.featuredImage || pick.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600"}
              alt={pick.title}
              fill unoptimized
              sizes="(max-width:768px) 100vw, 30vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <span className="text-[9px] font-black text-primary uppercase tracking-widest block mb-1.5 font-[Inter]">
                {catName(pick.category)}
              </span>
              <h3 className="text-white text-[15px] font-bold leading-snug font-[Playfair_Display] group-hover:text-amber-300 transition-colors line-clamp-2">
                {pick.title}
              </h3>
            </div>
          </div>
        </Link>
      )}

      {/* Divider */}
      <div className="mx-5 my-3 h-px bg-gray-800" />

      {/* 2 smaller picks — title only */}
      <div className="flex-1 flex flex-col divide-y divide-gray-800 px-1">
        {rest.slice(0, 2).map((s, i) => (
          <Link
            key={s.id}
            href={`/news/${s.slug}`}
            className="group flex items-start gap-3 px-4 py-3.5 hover:bg-gray-900 transition-colors"
          >
            <span className="text-[22px] font-black leading-none text-gray-800 group-hover:text-amber-400/30 transition-colors shrink-0 font-[Playfair_Display]">
              {i + 2}
            </span>
            <h4 className="text-[12.5px] font-semibold text-gray-400 group-hover:text-white transition-colors leading-snug font-[Inter] line-clamp-2">
              {s.title}
            </h4>
          </Link>
        ))}
      </div>

      {/* Footer tag */}
      <div className="px-5 py-3 border-t border-gray-800">
        <p className="text-[9px] font-bold text-gray-700 uppercase tracking-[0.3em] font-[Inter]">
          Curated · LabourPulse Desk
        </p>
      </div>
    </div>
  );
}
