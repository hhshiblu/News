"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
const BATCH = 10;

function imgSrc(p) {
  return p?.featuredImage || p?.image || "/placeholder.jpg";
}
function fmtDate(p) {
  const d = p?.publishedAt || p?.createdAt;
  if (!d) return "";
  try {
    const now = new Date();
    const pub = new Date(d);
    const diffMs = now - pub;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return pub.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}
function catLabel(c) {
  return typeof c === "object" ? c?.name : c || "News";
}

function NewsImageCard({ post }) {
  return (
    <Link href={`/news/${post.slug}`} className="group block">
      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-sm mb-2.5 bg-gray-100">
        <Image
          src={imgSrc(post)}
          alt={post.title}
          fill
          unoptimized
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <span className="absolute top-2 left-2 bg-primary text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 font-[Inter]">
          {catLabel(post.category)}
        </span>
      </div>
      <h3 className="text-[13px] md:text-[14px] font-bold text-gray-900 font-[Playfair_Display] leading-snug line-clamp-2 group-hover:text-primary transition-colors">
        {post.title}
      </h3>
      <p className="text-[10px] text-gray-400 mt-1 font-[Inter]">{fmtDate(post)}</p>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="w-full aspect-[16/9] bg-gray-200 rounded-sm mb-2.5" />
      <div className="h-3.5 bg-gray-200 rounded w-full mb-1.5" />
      <div className="h-3.5 bg-gray-200 rounded w-3/4 mb-1.5" />
      <div className="h-2.5 bg-gray-100 rounded w-1/4" />
    </div>
  );
}

async function fetchMorePosts(offset, seenIds = new Set()) {
  try {
    const qs = new URLSearchParams({ limit: String(BATCH), offset: String(offset) });
    const res = await fetch(`${API_URL}/public/posts?${qs.toString()}`);
    if (!res.ok) return [];
    const data = await res.json();
    const posts = data?.posts || [];
    // Filter out already-seen posts
    return posts.filter((p) => {
      const key = String(p.id ?? p.slug);
      if (seenIds.has(key)) return false;
      seenIds.add(key);
      return true;
    });
  } catch {
    return [];
  }
}

/**
 * InfiniteNewsFeed — Client component.
 * Renders initial posts in a 4-column image card grid.
 * Uses IntersectionObserver to load more as user scrolls.
 * Shows skeleton cards while loading.
 */
export default function InfiniteNewsFeed({ initialPosts = [], initialOffset = 0, seenIdsArray = [] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [offset, setOffset] = useState(initialOffset);
  const [loading, setLoading] = useState(false);
  const [exhausted, setExhausted] = useState(false);
  const sentinelRef = useRef(null);
  const seenIds = useRef(new Set(seenIdsArray));
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || exhausted) return;
    loadingRef.current = true;
    setLoading(true);

    const newPosts = await fetchMorePosts(offset, seenIds.current);
    if (newPosts.length === 0) {
      setExhausted(true);
    } else {
      setPosts((prev) => [...prev, ...newPosts]);
      setOffset((prev) => prev + BATCH);
    }

    setLoading(false);
    loadingRef.current = false;
  }, [offset, exhausted]);

  return (
    <section className="bg-white border-t border-gray-100 py-10 md:py-12">
      <div className="max-w-[1280px] mx-auto px-4">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-6 bg-primary rounded-full shrink-0" />
          <h2 className="text-[13px] font-black uppercase tracking-[0.22em] text-gray-900 font-[Inter]">
            More News
          </h2>
          <div className="h-px flex-1 bg-gray-300" />
        </div>

        {/* 4-col image grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {posts.map((post) => (
            <NewsImageCard key={post.id ?? post.slug} post={post} />
          ))}

          {/* Skeleton cards while loading */}
          {loading &&
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={`sk-${i}`} />)}
        </div>

        {/* Load More Button */}
        {!exhausted && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={loadMore}
              disabled={loading}
              className="px-10 py-3.5 bg-primary text-white text-[13px] font-bold uppercase tracking-widest font-[Inter] rounded hover:bg-primary transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Loading...
                </>
              ) : (
                "Load More News"
              )}
            </button>
          </div>
        )}

        {exhausted && posts.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-[11px] font-[Inter] text-gray-400 uppercase tracking-widest">
              — You're all caught up —
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
