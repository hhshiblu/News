import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";

function fmt(story) {
  return story.timestamp || new Date(story.createdAt).toLocaleDateString("en-BD", { day:"2-digit", month:"short", year:"numeric" });
}
function catName(c) { return typeof c === "object" ? c?.name : c || "News"; }

export default function PulseHero({ featuredPosts = [], latestPosts = [] }) {
  if (!featuredPosts.length) return null;
  const lead   = featuredPosts[0];
  const subs   = featuredPosts.slice(1, 3);           // 2 smaller image stories
  const listed = latestPosts.slice(0, 7);             // right-column headline list

  return (
    <section className="border-b-4 border-gray-900 pb-8 mb-0">
      <div className="grid grid-cols-12 gap-0">

        {/* ══ LEFT BLOCK (7 cols) ══════════════════════════════════════════ */}
        <div className="col-span-12 lg:col-span-7 border-r border-gray-200 pr-0 lg:pr-6">

          {/* Lead story */}
          <Link href={`/news/${lead.slug}`} className="group block mb-5">
            <div className="relative w-full aspect-[16/9] overflow-hidden">
              <Image
                src={lead.featuredImage || lead.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900"}
                alt={lead.title}
                fill priority unoptimized
                sizes="(max-width:768px) 100vw, 57vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 font-[Inter]">
                {catName(lead.category)}
              </span>
            </div>
            <div className="mt-3">
              <h1 className="text-[1.75rem] font-bold leading-[1.2] text-gray-950 mb-2 font-[Playfair_Display] group-hover:text-primary transition-colors">
                {lead.title}
              </h1>
              {lead.excerpt && (
                <p className="text-[14px] text-gray-600 leading-relaxed line-clamp-2 mb-2.5 font-[Inter]">
                  {lead.excerpt}
                </p>
              )}
              <p className="text-[11.5px] text-gray-500 font-[Inter] flex items-center gap-2">
                <span className="font-semibold text-gray-700">
                  {typeof lead.author==="object" ? lead.author?.name : lead.author || "LabourPulse Staff"}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1"><Clock size={10}/> {fmt(lead)}</span>
              </p>
            </div>
          </Link>

          {/* Two sub-stories — smaller, side by side */}
          {subs.length > 0 && (
            <div className="grid grid-cols-2 gap-4 pt-5 border-t border-gray-100">
              {subs.map(s => (
                <Link key={s.id} href={`/news/${s.slug}`} className="group flex gap-3 items-start">
                  <div className="relative w-[80px] h-[60px] shrink-0 overflow-hidden rounded-sm">
                    <Image
                      src={s.featuredImage || s.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200"}
                      alt={s.title} fill unoptimized sizes="80px"
                      className="object-cover group-hover:scale-105 transition-transform duration-400"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold text-primary uppercase tracking-widest block mb-0.5 font-[Inter]">{catName(s.category)}</span>
                    <h3 className="text-[12.5px] font-bold leading-snug text-gray-900 group-hover:text-primary transition-colors font-[Inter] line-clamp-3">{s.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ══ RIGHT BLOCK (5 cols) — LATEST HEADLINES ══════════════════════ */}
        <div className="col-span-12 lg:col-span-5 pl-0 lg:pl-6 mt-6 lg:mt-0">
          <div className="border-b-2 border-gray-900 pb-2.5 mb-0 flex items-center justify-between">
            <h2 className="text-[12px] font-black uppercase tracking-[0.22em] text-gray-900 font-[Inter]">Latest</h2>
            <Link href="/breaking" className="text-[10px] text-primary font-bold uppercase tracking-widest hover:underline font-[Inter]">View all →</Link>
          </div>
          {listed.map((s, i) => (
            <Link key={s.id} href={`/news/${s.slug}`}
              className="flex gap-3 items-start py-3.5 border-b border-gray-100 last:border-0 group hover:bg-gray-50/60 transition-colors -mx-1 px-1">
              <span className="text-[2rem] font-black leading-none text-gray-100 group-hover:text-primary/20 transition-colors w-7 shrink-0 font-[Playfair_Display]">{i+1}</span>
              <div className="flex-1 min-w-0">
                <span className="text-[9.5px] font-black text-primary uppercase tracking-widest block mb-0.5 font-[Inter]">{catName(s.category)}</span>
                <h3 className="text-[13.5px] font-bold leading-snug text-gray-900 group-hover:text-primary transition-colors font-[Inter] line-clamp-2">{s.title}</h3>
                <span className="text-[10.5px] text-gray-400 flex items-center gap-1 mt-1 font-[Inter]"><Clock size={9}/>{fmt(s)}</span>
              </div>
              {(s.featuredImage||s.image) && (
                <div className="relative w-[60px] h-[46px] shrink-0 overflow-hidden rounded-sm">
                  <Image src={s.featuredImage||s.image} alt={s.title} fill unoptimized sizes="60px" className="object-cover"/>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
