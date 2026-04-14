"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { getArticlesByTag } from "@/data/queries";
import CategoryGrid from "@/components/category/CategoryGrid";
import CategoryHero from "@/components/category/CategoryHero";
import BigCard from "@/components/news/BigCard";
import HorizontalCard from "@/components/news/HorizontalCard";
import Sidebar from "@/components/layout/Sidebar";
import { Hash, Newspaper, TrendingUp, Filter } from "lucide-react";
import Link from "next/link";

function TagContent() {
  const { slug } = useParams();
  const tagName = (slug || "").replace(/-/g, " ");
  const articles = getArticlesByTag(slug);

  if (!articles || articles.length === 0) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-20 text-center">
        <Hash className="mx-auto mb-4 text-gray-200" size={64} />
        <h1 className="text-3xl font-bold font-[Playfair_Display] text-gray-900 mb-4 uppercase tracking-tighter italic">#{tagName}</h1>
        <p className="text-gray-500 font-[Inter] mb-8">No articles found in this topic yet.</p>
        <Link href="/" className="bg-primary text-white px-6 py-3 font-bold rounded-sm">Explore Other Topics</Link>
      </div>
    );
  }

  // Section slicing for high-density "Topic Hub" layout
  const hero = articles[0];
  const spotlight = articles.slice(1, 3);
  const horizontal = articles[3];
  const gridArticles = articles.slice(4);

  return (
    <div className="bg-white min-h-screen">
      {/* ── TOPIC HEADER ── */}
      <div className="bg-gray-100/50 pt-12 pb-16 border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
             <div className="flex items-center gap-2 text-[12px] font-bold text-primary uppercase tracking-[0.3em] mb-4 font-[Inter]">
                <TrendingUp size={14} /> Topic Discovery Hub
             </div>
             <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 font-[Playfair_Display] italic tracking-tighter mb-6">
               #{tagName}
             </h1>
             <p className="text-lg text-gray-500 font-[Inter] leading-relaxed mb-8">
               Everything being published on **LabourPulse** regarding <span className="text-gray-900 font-semibold">{tagName}</span>. 
               From breaking updates to deep-dive reports.
             </p>
             <div className="flex flex-wrap justify-center gap-4 text-[13px] font-bold font-[Inter] text-gray-400">
                <span className="flex items-center gap-1.5"><Newspaper size={16} className="text-primary" /> {articles.length} Stories</span>
                <span className="text-gray-200">|</span>
                <span className="flex items-center gap-1.5"><TrendingUp size={16} className="text-primary" /> Trending Topic</span>
             </div>
          </div>
        </div>
      </div>

      {/* ── DISCOVERY FEED ── */}
      <div className="max-w-[1280px] mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
           
           <main className="flex-1 min-w-0">
              
              {/* 1. TOP STORY (Hero) */}
              <div className="mb-12">
                <CategoryHero story={hero} />
              </div>

              {/* 2. SPOTLIGHT ROW (2 Big Cards) */}
              {spotlight.length > 0 && (
                <div className="mb-12">
                   <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-[3px] bg-primary"></div>
                      <h3 className="text-[14px] font-bold uppercase tracking-widest text-gray-900 font-[Inter]">Analysis & Perspective</h3>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {spotlight.map(story => (
                        <BigCard key={story.id} story={story} />
                      ))}
                   </div>
                </div>
              )}

              {/* 3. HORIZONTAL BREAK */}
              {horizontal && (
                <div className="mb-12">
                   <HorizontalCard story={horizontal} />
                </div>
              )}

              {/* 4. MAIN TOPIC GRID */}
              <div className="mb-12">
                 <div className="flex items-center justify-between border-b-2 border-gray-900 pb-3 mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 font-[Playfair_Display]">Topic Archive</h3>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest font-[Inter]">
                       <Filter size={13} /> Showing Latest
                    </div>
                 </div>
                 <CategoryGrid articles={gridArticles} />
              </div>

           </main>

           {/* Sidebar */}
           <aside className="lg:w-[310px] flex-shrink-0">
              <div className="sticky top-24">
                 <Sidebar />
              </div>
           </aside>

        </div>
      </div>
    </div>
  );
}

export default function TagPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TagContent />
    </Suspense>
  );
}
