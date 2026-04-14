import Link from "next/link";
import { Hash, TrendingUp, Search, ChevronRight, Newspaper } from "lucide-react";
import { getAllTags } from "@/data/queries";

export const metadata = {
  title: "Topics & Tags — LabourPulse",
  description: "Browse news by topics, from RMG and economy to international relations and policy.",
};

export default function TagIndexPage() {
  const allTags = getAllTags();
  
  // Group tags by their first letter for the A-Z directory
  const groupedTags = allTags.reduce((acc, tag) => {
    const firstLetter = tag.name.charAt(0).toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(tag);
    return acc;
  }, {});

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const trendingTags = [...allTags].sort((a, b) => b.count - a.count).slice(0, 12);

  return (
    <main className="bg-white min-h-screen">
      {/* ── HERO SECTION ── */}
      <section className="relative py-24 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 -skew-x-12 translate-x-24" />
        
        <div className="max-w-[1280px] mx-auto px-4 relative z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-primary text-xs font-black uppercase tracking-[0.3em] mb-8 animate-pulse">
            <TrendingUp size={14} /> Discovery Hub
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white font-[Playfair_Display] leading-tight mb-6 italic">
            Explore the <span className="text-primary italic">Global Pulse</span> <br /> 
            by Specialized Topics
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl font-[Inter] leading-relaxed mb-10">
            From industrial disputes to macro-economic shifts, navigate through our comprehensive 
            index of topics shaping the future of global labour.
          </p>
          
          <div className="relative max-w-xl mx-auto md:mx-0 group">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
             <input 
               type="text" 
               placeholder="Search for a topic (e.g. RMG, Wages, Policy)..."
               className="w-full bg-white/5 border border-white/10 text-white pl-16 pr-8 py-6 rounded-2xl outline-none focus:bg-white/10 focus:border-primary transition-all font-[Inter] text-lg"
             />
          </div>
        </div>
      </section>

      {/* ── TRENDING TOPICS ── */}
      <section className="py-20 border-b border-gray-100">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-black text-gray-900 font-[Playfair_Display]">Trending Topics</h2>
            <div className="h-0.5 flex-1 bg-gray-100 mx-8 hidden md:block"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingTags.map((tag) => (
              <Link 
                key={tag.slug} 
                href={`/tag/${tag.slug}`}
                className="group p-8 bg-gray-50 border border-gray-100 rounded-3xl hover:bg-white hover:border-primary hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                    <Hash size={22} />
                  </div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{tag.count} Articles</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 font-[Inter]">{tag.name}</h3>
                <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                  Explore Hub <ChevronRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── A-Z DIRECTORY ── */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="flex items-center justify-between mb-16">
            <h2 className="text-3xl font-black text-gray-900 font-[Playfair_Display]">Alphabetical Directory</h2>
            <div className="flex gap-2">
               {alphabet.map(letter => (
                 <button 
                   key={letter}
                   disabled={!groupedTags[letter]}
                   className={`w-8 h-8 rounded flex items-center justify-center text-xs font-black transition-all ${
                     groupedTags[letter] ? 'text-gray-900 hover:bg-primary hover:text-white cursor-pointer' : 'text-gray-200'
                   }`}
                 >
                   {letter}
                 </button>
               ))}
            </div>
          </div>

          <div className="columns-1 md:columns-2 lg:columns-4 gap-12">
            {alphabet.map(letter => {
              if (!groupedTags[letter]) return null;
              return (
                <div key={letter} className="break-inside-avoid mb-12">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-4xl font-black text-primary opacity-20 font-[Playfair_Display]">{letter}</span>
                    <div className="h-[2px] flex-1 bg-gray-200"></div>
                  </div>
                  <div className="space-y-3">
                    {groupedTags[letter].map(tag => (
                      <Link 
                        key={tag.slug} 
                        href={`/tag/${tag.slug}`}
                        className="group flex items-center justify-between py-2 border-b border-gray-100/50 hover:border-primary transition-all"
                      >
                        <span className="text-[15px] font-bold text-gray-600 group-hover:text-gray-900 group-hover:translate-x-1 transition-all flex items-center gap-2">
                           <Hash size={12} className="text-gray-300 group-hover:text-primary" /> {tag.name}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 group-hover:text-primary transition-colors flex items-center gap-1">
                          <Newspaper size={10} /> {tag.count}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION ── */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
           <h2 className="text-4xl font-black text-white font-[Playfair_Display] mb-6">Can't find a specialized topic?</h2>
           <p className="text-white/80 text-xl mb-10 font-[Inter]">Our team of investigative journalists is constantly expanding our coverage. Contact our editorial desk to suggest a new area of focus.</p>
           <Link href="/contact" className="px-12 py-5 bg-white text-primary font-black rounded-2xl hover:bg-gray-900 hover:text-white transition-all shadow-xl uppercase tracking-widest text-xs">
             Contact Editorial Desk
           </Link>
        </div>
      </section>
    </main>
  );
}
