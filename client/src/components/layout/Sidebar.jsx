"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Flame, Clock, Zap, MessageSquare } from "lucide-react";
import AdSlot from "@/components/ads/AdSlot";
import { fetchPublicPosts } from "@/lib/api";

const normalizePost = (post) => ({
  ...post,
  image: post.featuredImage || "/placeholder.jpg",
  author: post.author?.name || "Staff Reporter",
  category: post.category?.name || "News",
  timestamp: post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString()
    : "Recently",
});

export default function Sidebar() {
  const [breaking, setBreaking] = useState([]);
  const [trending, setTrending] = useState([]);
  const [latest, setLatest] = useState([]);

  useEffect(() => {
    async function loadSidebarData() {
      try {
        const [breakingRes, breakingB, trendingRes, latestRes] =
          await Promise.all([
            fetchPublicPosts({ tagSlug: "breaking-news", limit: 10 }),
            fetchPublicPosts({ tagSlug: "breaking", limit: 10 }),
            fetchPublicPosts({ tagSlug: "trending", limit: 10 }),
            fetchPublicPosts({ limit: 12 }),
          ]);

        const seen = new Set();
        const merged = [];
        for (const p of [
          ...(breakingRes?.posts || []),
          ...(breakingB?.posts || []),
        ]) {
          if (!p?.id || seen.has(p.id)) continue;
          seen.add(p.id);
          merged.push(p);
        }

        setBreaking(merged.map(normalizePost));
        setTrending((trendingRes?.posts || []).map(normalizePost));
        setLatest((latestRes?.posts || []).map(normalizePost));
      } catch (error) {
        console.error("Sidebar Data Fetch Error:", error);
      }
    }

    loadSidebarData();
  }, []);

  return (
    <aside className="flex flex-col gap-5">
      <div className="bg-gray-950 text-white p-4 rounded-xl overflow-hidden relative border border-gray-800">
        <div className="absolute top-0 right-0 p-2 opacity-10">
          <Zap size={64} className="text-primary fill-primary" />
        </div>
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-800">
          <Zap size={14} className="text-primary fill-primary shrink-0" />
          <h2 className="text-[11px] font-black uppercase tracking-[0.15em] font-[Inter]">
            Breaking News
          </h2>
        </div>
        <div className="space-y-3">
          {breaking.length > 0 ? (
            breaking.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="group flex gap-2.5 items-start"
              >
                <span
                  className="w-2 h-2 rounded-full bg-red-600 shrink-0 mt-1.5 shadow-sm shadow-red-900/50"
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-bold text-gray-100 leading-snug group-hover:text-primary transition-colors line-clamp-3 font-[Inter]">
                    {item.title}
                  </p>
                  <span className="text-[9px] text-gray-500 mt-1 block font-bold tracking-widest uppercase">
                    {item.timestamp}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-[11px] text-gray-500 font-[Inter] italic">
              No breaking updates…
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-center py-1">
        <AdSlot slotKey="public_sidebar_medium" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-gray-900">
          <h2 className="flex items-center gap-1.5 text-[12px] font-black uppercase tracking-widest font-[Inter] text-gray-950">
            <Flame size={16} className="text-primary fill-primary shrink-0" />{" "}
            Trending
          </h2>
        </div>
        <div className="space-y-4">
          {trending.length > 0 ? (
            trending.map((item, idx) => (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="flex gap-3 group items-start"
              >
                <span
                  className={`text-2xl font-black font-[Playfair_Display] leading-none transition-colors shrink-0 w-6 ${idx < 3 ? "text-primary/25 group-hover:text-primary" : "text-gray-200 group-hover:text-gray-300"}`}
                >
                  {idx + 1}
                </span>
                <div className="min-w-0 pt-0.5">
                  <h3 className="text-[12px] font-bold text-gray-800 group-hover:text-primary leading-snug transition-colors line-clamp-3 font-[Inter]">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-[11px] text-gray-500 font-[Inter]">
              No trending items…
            </p>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
          <h2 className="flex items-center gap-1.5 text-[12px] font-black uppercase tracking-widest font-[Inter] text-gray-700">
            <Clock size={14} className="shrink-0" /> Latest
          </h2>
          <Link
            href="/"
            className="text-[10px] font-black uppercase tracking-widest text-primary hover:opacity-80 font-[Inter]"
          >
            View all —
          </Link>
        </div>
        <div className="space-y-2.5">
          {latest.map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.slug}`}
              className="flex gap-2.5 items-start group"
            >
              <span
                className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-1.5 ring-2 ring-emerald-600/20"
                aria-hidden
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-[12px] font-bold text-gray-800 group-hover:text-primary leading-snug line-clamp-3 transition-colors font-[Inter]">
                  {item.title}
                </h3>
                <div className="flex flex-wrap items-center gap-1.5 text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                  <span className="text-primary">{item.category}</span>
                  <span>·</span>
                  <span>{item.timestamp}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/15 p-4 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-primary text-white rounded-md">
            <MessageSquare size={16} />
          </div>
          <h3 className="text-base font-black text-gray-900 font-[Playfair_Display] leading-tight">
            Insight Digest
          </h3>
        </div>
        <p className="text-xs text-gray-600 mb-4 leading-relaxed font-[Inter]">
          Critical stories in your inbox.
        </p>
        <div className="space-y-2">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20 font-[Inter]"
          />
          <button
            type="button"
            className="w-full bg-gray-950 hover:bg-primary text-white py-2.5 text-[10px] font-black tracking-widest uppercase rounded-lg transition-all"
          >
            Subscribe
          </button>
        </div>
      </div>
    </aside>
  );
}
