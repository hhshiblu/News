"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, User } from "lucide-react";
import { fetchMorePosts } from "@/lib/fetchMorePosts";

/* ──────────────────────────────────────────────────────────────────────
   CARD HELPERS
   ────────────────────────────────────────────────────────────────────── */

function fmtDate(story) {
  const d = story?.publishedAt || story?.createdAt;
  if (!d) return story?.timestamp || "";
  try {
    const now = new Date();
    const pub = new Date(d);
    const diffMins = Math.floor((now - pub) / 60000);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return pub.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch { return story?.timestamp || ""; }
}

function imgSrc(story) {
  return story?.featuredImage || story?.image || "/placeholder.jpg";
}

function catName(story) {
  if (typeof story?.category === "object") return story.category?.name || "News";
  return story?.category || "News";
}

function authorName(story) {
  if (typeof story?.author === "object") return story.author?.name || "";
  return story?.author || "";
}

/* ──────────────────────────────────────────────────────────────────────
   VARIANT: "category" — 2-col horizontal cards
   ────────────────────────────────────────────────────────────────────── */
function CategoryGrid({ posts }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 stagger-children">
      {posts.map((story) => (
        <Link
          key={story.id}
          href={`/news/${story.slug}`}
          className="flex bg-white border border-gray-100 overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 group img-zoom animate-fade-in"
        >
          <div className="w-[38%] flex-shrink-0 relative overflow-hidden" style={{ minHeight: "120px" }}>
            <Image
              src={imgSrc(story)}
              alt={story.title}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 768px) 38vw, 18vw"
            />
          </div>
          <div className="flex-1 flex flex-col justify-between p-3">
            <div>
              <span className="inline-block text-[9px] font-bold tracking-widest uppercase mb-1.5 text-white bg-primary font-[Inter] px-1.5 py-px">
                {catName(story)}
              </span>
              <h3 className="text-[13px] font-bold text-gray-900 leading-snug line-clamp-2 font-[Playfair_Display] mb-1 group-hover:text-primary transition-colors">
                {story.title}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-gray-400 font-[Inter] mt-1">
              {authorName(story) && <span>By {authorName(story)}</span>}
              {authorName(story) && <span>·</span>}
              <span>{story.timestamp || fmtDate(story)}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   VARIANT: "subcategory" — alternating wide horizontal + 3 small cards
   ────────────────────────────────────────────────────────────────────── */
function SubcategoryGrid({ posts }) {
  const rows = [];
  let i = 0;
  let rowIdx = 0;

  while (i < posts.length) {
    if (rowIdx % 2 === 0) {
      // Wide horizontal card
      const story = posts[i];
      rows.push(
        <Link
          key={`wide-${story.id}`}
          href={`/news/${story.slug}`}
          className="flex bg-white border border-gray-100 overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 group img-zoom animate-fade-in"
        >
          <div className="w-[40%] flex-shrink-0 relative overflow-hidden" style={{ minHeight: "160px" }}>
            <Image src={imgSrc(story)} alt={story.title} fill unoptimized className="object-cover" sizes="(max-width: 768px) 40vw, 20vw" />
          </div>
          <div className="flex-1 flex flex-col justify-between p-4">
            <div>
              <span className="inline-block text-[9px] font-bold tracking-widest uppercase mb-2 text-white bg-emerald-600 font-[Inter] px-2 py-0.5">
                {catName(story)}
              </span>
              <h3 className="text-[15px] font-bold text-gray-900 leading-snug line-clamp-3 font-[Playfair_Display] mb-2 group-hover:text-emerald-700 transition-colors">
                {story.title}
              </h3>
              {story.excerpt && (
                <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2 font-[Inter]">{story.excerpt}</p>
              )}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-400 font-[Inter] mt-2">
              {authorName(story) && <span>By {authorName(story)}</span>}
              {authorName(story) && <span>·</span>}
              <span>{story.timestamp || fmtDate(story)}</span>
            </div>
          </div>
        </Link>
      );
      i += 1;
    } else {
      // 3 small vertical cards
      const chunk = posts.slice(i, i + 3);
      rows.push(
        <div key={`grid-${i}`} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-fade-in">
          {chunk.map((story) => (
            <Link key={story.id} href={`/news/${story.slug}`} className="flex flex-col bg-white border border-gray-100 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200 img-zoom h-full">
              <div className="relative overflow-hidden flex-shrink-0" style={{ paddingTop: "56%" }}>
                <Image src={imgSrc(story)} alt={story.title} fill unoptimized className="object-cover" sizes="(max-width: 768px) 50vw, 30vw" />
                <span className="absolute left-2.5 top-2 text-[9px] font-bold tracking-widest uppercase text-white bg-emerald-600 font-[Inter] px-1.5 py-px">
                  {catName(story)}
                </span>
              </div>
              <div className="flex flex-col flex-1 p-2.5">
                <h3 className="text-[13px] font-bold text-gray-900 leading-snug line-clamp-3 font-[Playfair_Display] mb-2 flex-1">
                  {story.title}
                </h3>
                <span className="text-[10px] text-gray-400 font-[Inter] mt-auto">
                  {story.timestamp || fmtDate(story)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      );
      i += chunk.length;
    }
    rowIdx += 1;
  }

  return <div className="space-y-5 stagger-children">{rows}</div>;
}

/* ──────────────────────────────────────────────────────────────────────
   VARIANT: "tag" — staggered grid with mixed image + text-only cards
   ────────────────────────────────────────────────────────────────────── */
function TagGrid({ posts }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
      {posts.map((p, idx) => {
        const isTextOnly = idx % 4 === 3;

        if (isTextOnly) {
          return (
            <Link key={p.id} href={`/news/${p.slug}`} className="group block animate-fade-in">
              <div className="border-l-4 border-primary pl-4 py-3 bg-[#fef9f9] rounded-r-lg hover:bg-primary/5 transition-colors h-full flex flex-col justify-center">
                <span className="text-[9px] font-black uppercase tracking-widest text-primary font-[Inter] mb-1.5">
                  {catName(p)}
                </span>
                <h3 className="text-[15px] font-bold text-gray-900 font-[Playfair_Display] leading-snug line-clamp-3 group-hover:text-primary transition-colors mb-2">
                  {p.title}
                </h3>
                {p.excerpt && (
                  <p className="text-[12px] text-gray-500 font-[Inter] line-clamp-2 mb-2">{p.excerpt}</p>
                )}
                <p className="text-[10px] text-gray-400 flex items-center gap-1 font-[Inter]">
                  <Clock size={9} /> {fmtDate(p)}
                </p>
              </div>
            </Link>
          );
        }

        return (
          <Link key={p.id} href={`/news/${p.slug}`} className="group block animate-fade-in">
            <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg mb-2.5 bg-gray-100">
              <Image
                src={imgSrc(p)} alt={p.title} fill unoptimized
                sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 30vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-primary font-[Inter] block mb-0.5">
              {catName(p)}
            </span>
            <h3 className="text-[13px] md:text-[14px] font-bold text-gray-900 font-[Playfair_Display] leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-1">
              {p.title}
            </h3>
            <p className="text-[10px] text-gray-400 font-[Inter] flex items-center gap-1">
              <Clock size={9} /> {fmtDate(p)}
            </p>
          </Link>
        );
      })}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   GRID VARIANT MAP
   ────────────────────────────────────────────────────────────────────── */
const GRID_VARIANTS = {
  category: CategoryGrid,
  subcategory: SubcategoryGrid,
  tag: TagGrid,
};

/* ══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════════════ */

/**
 * Shared "See More" feed — renders posts in a page-specific grid layout.
 *
 * @param {Object}  props
 * @param {Array}   props.initialPosts    – server-rendered seed posts
 * @param {string}  props.variant         – "category" | "subcategory" | "tag"
 * @param {Object}  props.fetchParams     – query params for API
 * @param {string} [props.endpoint]       – API path, default "/public/posts"
 * @param {number} [props.limit]          – batch size
 * @param {number} [props.offset]         – skip N items
 * @param {string}  props.buttonLabel     – button text
 * @param {string} [props.buttonClass]    – tailwind classes for button
 * @param {number} [props.totalFromServer]
 */
export default function LoadMoreFeed({
  initialPosts = [],
  variant = "category",
  fetchParams = {},
  endpoint = "/public/posts",
  limit = 10,
  offset,
  buttonLabel = "See More",
  buttonClass = "",
  totalFromServer,
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(() => {
    if (totalFromServer != null) return initialPosts.length < totalFromServer;
    return initialPosts.length >= limit;
  });

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await fetchMorePosts({
        endpoint,
        params: fetchParams,
        page,
        limit,
        offset,
      });

      const newPosts = res?.posts || [];

      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const unique = newPosts.filter((p) => !existingIds.has(p.id));
          const merged = [...prev, ...unique];

          const total = res?.total ?? totalFromServer;
          if (total != null && merged.length >= total) {
            setHasMore(false);
          } else if (newPosts.length < limit) {
            setHasMore(false);
          }

          return merged;
        });
        setPage((p) => p + 1);
      }
    } catch {
      console.error("Load more failed");
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, endpoint, fetchParams, page, limit, offset, totalFromServer]);

  const GridComponent = GRID_VARIANTS[variant] || CategoryGrid;

  if (posts.length === 0) return null;

  return (
    <div>
      <GridComponent posts={posts} />

      {/* See More / All Loaded */}
      <div className="flex justify-center mt-8 mb-4">
        {hasMore ? (
          <button
            onClick={loadMore}
            disabled={loading}
            className={`group inline-flex items-center gap-2 font-[Inter] text-[13px] font-bold tracking-wide transition-all duration-300 disabled:opacity-60 disabled:cursor-wait ${buttonClass}`}
          >
            {loading ? (
              <>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: "0s" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: "0.15s" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: "0.3s" }} />
                </span>
                Loading…
              </>
            ) : (
              <>
                {buttonLabel}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        ) : posts.length > 0 ? (
          <p className="text-[12px] text-gray-400 font-[Inter] font-medium tracking-wide uppercase">
            ✓ All stories loaded
          </p>
        ) : null}
      </div>
    </div>
  );
}
