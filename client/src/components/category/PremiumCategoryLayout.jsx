"use client";
import Link from "next/link";
import { Clock, MessageSquare, Share2, ArrowRight } from "lucide-react";
import BigCard from "@/components/news/BigCard";
import MediumCard from "@/components/news/MediumCard";
import Sidebar from "@/components/layout/Sidebar";

export default function PremiumCategoryLayout({ articles, label, icon }) {
  if (!articles || articles.length === 0) return null;

  const heroArticle = articles[0];
  const sideArticles = articles.slice(1, 5);
  const gridArticles = articles.slice(5, 8);
  const remainingArticles = articles.slice(8);

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8">
      {/* ── TOP HERO SECTION (2/3 vs 1/3) ── */}
      <section className="flex flex-col lg:flex-row gap-8 mb-16">
        {/* Main Hero */}
        <div className="lg:w-2/3 group">
          <Link href={`/news/${heroArticle.slug}`} className="block overflow-hidden rounded-2xl relative aspect-[16/9] mb-6 shadow-2xl">
            <img 
              src={heroArticle.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1200"} 
              alt={heroArticle.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-8 flex flex-col justify-end">
              <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded w-fit mb-4 tracking-widest uppercase">FEATURED STORY</span>
              <h2 className="text-white text-3xl md:text-5xl font-bold font-[Playfair_Display] leading-tight mb-4 group-hover:text-primary-light transition-colors">
                {heroArticle.title}
              </h2>
              <div className="flex items-center gap-4 text-gray-300 text-sm font-[Inter]">
                <span className="flex items-center gap-1.5"><Clock size={14} /> {heroArticle.date || "2h ago"}</span>
                <span className="flex items-center gap-1.5"><MessageSquare size={14} /> 12 Comments</span>
              </div>
            </div>
          </Link>
          <p className="text-gray-600 text-lg leading-relaxed font-[Inter] line-clamp-3">
            {heroArticle.excerpt || heroArticle.content?.substring(0, 240) + "..."}
          </p>
        </div>

        {/* Side List (Latest in Category) */}
        <div className="lg:w-1/3">
          <div className="flex items-center justify-between mb-6 pb-2 border-b-2 border-primary">
            <h3 className="font-bold text-gray-900 uppercase tracking-wider text-sm font-[Inter]">Latest in {label}</h3>
            <Link href="#" className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">VIEW ALL <ArrowRight size={12} /></Link>
          </div>
          <div className="space-y-6">
            {sideArticles.map((article, i) => (
              <Link key={article.id} href={`/news/${article.slug}`} className="flex gap-4 group">
                <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                  <img src={article.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=400"} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-primary transition-colors line-clamp-2 font-[Playfair_Display]">
                    {article.title}
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-2 font-[Inter]">{article.date || "3h ago"}</p>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-8 bg-gray-900 rounded-2xl p-6 text-white text-center shadow-xl">
             <h4 className="text-lg font-bold font-[Playfair_Display] mb-2 leading-tight">Get Daily {label} Updates</h4>
             <p className="text-xs text-gray-400 mb-4 font-[Inter]">Join 50k+ readers receiving our specialized newsletter.</p>
             <div className="flex gap-2">
               <input type="email" placeholder="Your email" className="bg-white/10 border border-white/20 px-3 py-2 rounded text-xs w-full focus:outline-none focus:border-white/40" />
               <button className="bg-primary hover:bg-primary-dark px-4 py-2 rounded text-xs font-bold transition-all">JOIN</button>
             </div>
          </div>
        </div>
      </section>

      {/* ── SECONDARY MID SECTION (Grid) ── */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-gray-50 rounded-[32px] border border-gray-100">
          {gridArticles.map((article) => (
            <div key={article.id} className="group">
              <Link href={`/news/${article.slug}`} className="block aspect-[4/3] rounded-2xl overflow-hidden mb-4 shadow-md">
                <img src={article.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=600"} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" />
              </Link>
              <h3 className="text-xl font-bold text-gray-900 font-[Playfair_Display] mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </h3>
              <p className="text-sm text-gray-500 font-[Inter] line-clamp-2">
                {article.excerpt || article.content?.substring(0, 100) + "..."}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── REMAINING SECTION (Standard + Sidebar) ── */}
      <section className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-2/3">
           <h2 className="text-2xl font-bold text-gray-900 font-[Playfair_Display] mb-8 pb-3 border-b border-gray-100 flex items-center gap-3">
             <span className="w-2 h-8 bg-primary rounded-full"></span>
             Deep Dive & Analysis
           </h2>
           <div className="space-y-12">
             {remainingArticles.map((article) => (
               <div key={article.id} className="flex flex-col md:flex-row gap-6 group">
                 <Link href={`/news/${article.slug}`} className="md:w-1/3 aspect-[3/2] overflow-hidden rounded-2xl shadow-lg">
                    <img src={article.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800"} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                 </Link>
                 <div className="md:w-2/3">
                    <span className="text-[10px] font-bold text-primary tracking-widest uppercase mb-2 block">{article.subcategory || label}</span>
                    <Link href={`/news/${article.slug}`}>
                      <h3 className="text-2xl font-bold text-gray-900 font-[Playfair_Display] mb-3 group-hover:text-primary transition-colors leading-tight">
                        {article.title}
                      </h3>
                    </Link>
                    <p className="text-gray-500 text-sm font-[Inter] leading-relaxed mb-4 line-clamp-3">
                      {article.excerpt || article.content?.substring(0, 160) + "..."}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-6 h-6 rounded-full bg-gray-200" />
                         <span className="text-xs font-bold text-gray-800">Editorial Team</span>
                      </div>
                      <div className="flex gap-4">
                        <button className="text-gray-400 hover:text-primary transition-colors"><Share2 size={16} /></button>
                        <button className="text-gray-400 hover:text-primary transition-colors"><MessageSquare size={16} /></button>
                      </div>
                    </div>
                 </div>
               </div>
             ))}
           </div>
           
           <div className="mt-16 text-center">
             <button className="px-12 py-4 bg-white border-2 border-gray-100 hover:border-primary text-gray-900 hover:text-primary font-bold rounded-2xl transition-all shadow-sm font-[Inter]">
                LOAD MORE STORIES
             </button>
           </div>
        </div>
        
        <aside className="lg:w-1/3">
           <div className="sticky top-24 space-y-12">
             <Sidebar />
           </div>
        </aside>
      </section>
    </div>
  );
}
